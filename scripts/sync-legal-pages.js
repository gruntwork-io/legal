const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const MarkdownIt = require('markdown-it');
const { WebflowClient } = require("webflow-api");
const matter = require('gray-matter');


// --- Configuration ---
const WEBFLOW_API_KEY = process.env.WEBFLOW_API_KEY;
const WEBFLOW_SITE_ID = process.env.WEBFLOW_SITE_ID;
const WEBFLOW_COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID;
const DEBUG = process.env.DEBUG !== 'false';

// --- Logging utilities ---
function log(message) {
  console.log(message);
}

function debugLog(message) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`);
  }
}

// --- IMPORTANT ---
// Set these to the *API names* of your fields in Webflow's "legal pages" collection.
// Find these in your Webflow project settings under "API & Integrations" -> Collections -> Legal Pages
const FIELD_ID_TITLE = process.env.WEBFLOW_TITLE_FIELD_ID || 'name';
const FIELD_ID_SLUG = process.env.WEBFLOW_SLUG_FIELD_ID || 'slug';
const FIELD_ID_PATH = process.env.WEBFLOW_PATH_FIELD_ID || 'path';
const FIELD_ID_HTML_CONTENT = process.env.WEBFLOW_HTML_FIELD_ID || 'html-content';
const FIELD_ID_MD_CONTENT = process.env.WEBFLOW_MD_FIELD_ID || 'markdown-content';

debugLog('Environment configuration loaded');
debugLog(`WEBFLOW_SITE_ID: ${WEBFLOW_SITE_ID}`);
debugLog(`WEBFLOW_COLLECTION_ID: ${WEBFLOW_COLLECTION_ID}`);

// Configure markdown with custom rendering for "Plain English" comments
const md = new MarkdownIt({
  html: true  // Enable HTML tags in source
});

// Function to parse markdown into sections of Plain English and Legalese
function parseSections(content) {
  // Regex to match all Plain English blocks
  const regex = /<!--Plain English:([\s\S]*?)-->/g;
  let match;
  let lastIndex = 0;
  const sections = [];

  while ((match = regex.exec(content)) !== null) {
    const plainEnglish = match[1].trim();
    const start = match.index;
    const end = regex.lastIndex;

    // Legalese is the text between the end of the last match and the start of this match
    if (start > lastIndex) {
      const legalese = content.slice(lastIndex, start).trim();
      if (sections.length > 0) {
        // Attach legalese to previous section
        sections[sections.length - 1].legalese += '\n' + legalese;
      } else if (legalese) {
        // If legalese comes before any Plain English, add as its own section
        sections.push({ plainEnglish: '', legalese });
      }
    }
    // Start a new section with this Plain English
    sections.push({ plainEnglish, legalese: '' });
    lastIndex = end;
  }
  // Add any trailing legalese after the last Plain English
  if (lastIndex < content.length) {
    const legalese = content.slice(lastIndex).trim();
    if (sections.length > 0) {
      sections[sections.length - 1].legalese += '\n' + legalese;
    } else if (legalese) {
      sections.push({ plainEnglish: '', legalese });
    }
  }
  return sections;
}

// Function to generate side-by-side HTML layout for sections
function generateHtmlLayout(sections, frontmatter) {
  // Render frontmatter if present
  let html = '<div class="legal-frontmatter" style="margin-bottom: 2.5em;">';
  if (frontmatter) {
    if (frontmatter.title) {
      html += `<h1 class="heading" style="margin-bottom: 0.2em;">${frontmatter.title}</h1>`;
    }
    if (frontmatter.header) {
      html += `<div style="font-size: 1.2em; font-weight: 500; margin-bottom: 0.2em; color: #ccc;">${frontmatter.header}</div>`;
    }
    if (frontmatter.subheader) {
      html += `<div style="font-size: 1.1em; font-weight: 500; margin-bottom: 0.2em; color: #bbb;">${frontmatter.subheader}</div>`;
    }
    if (frontmatter.description) {
      html += `<div style="font-size: 1em; color: #aaa; margin-bottom: 0.5em;">${frontmatter.description}</div>`;
    }
  }
  html += '</div>';

  // Add column headers
  html += '<div class="legal-columns-header" style="display: flex; align-items: flex-end; margin-bottom: 1.5em;">';
  html += '<div style="flex: 1; min-width: 300px; font-size: 1.1em; font-weight: 600; color: #fff;">Plain English</div>';
  html += '<div style="flex: 2; min-width: 300px; font-size: 1.1em; font-weight: 600; color: #fff;">Legalese</div>';
  html += '</div>';

  // Render each section as a row with two columns, aligned vertically
  html += '<div class="legal-sections-container">';
  for (const section of sections) {
    html += '<div class="legal-section-row" style="display: flex; align-items: flex-start; margin-bottom: 32px;">';
    html += '<div class="plain-english-col" style="flex: 1; min-width: 300px; padding-right: 32px;">';
    if (section.plainEnglish) {
      html += '<div class="plain-english-block">' + md.render(section.plainEnglish) + '</div>';
    } else {
      html += '<div class="plain-english-block" style="min-height: 1em;"></div>';
    }
    html += '</div>';
    html += '<div class="legalese-col" style="flex: 2; min-width: 300px;">';
    if (section.legalese) {
      html += '<div class="legalese-block">' + md.render(section.legalese) + '</div>';
    } else {
      html += '<div class="legalese-block" style="min-height: 1em;"></div>';
    }
    html += '</div>';
    html += '</div>';
  }
  html += '</div>';
  return html;
}

// Initialize the Webflow client
const webflow = new WebflowClient({ accessToken: WEBFLOW_API_KEY });

debugLog('Webflow API client initialized');

// Function to find all markdown files
async function findMdFiles(rootDir) {
  debugLog(`Searching for markdown files in: ${rootDir}`);
  const files = await glob('**/*.md', { ignore: ['.git/**', 'node_modules/**', 'scripts/**', '**/README.md'], cwd: rootDir });
  debugLog(`Found ${files.length} markdown files`);
  return files;
}

// Function to extract title from filename in Title Case with spaces
function extractTitle(filePath) {
  debugLog(`Extracting title from filename: ${filePath}`);

  // Get the basename without extension
  const basename = path.basename(filePath, '.md');

  // Replace hyphens and underscores with spaces
  let spacedName = basename.replace(/[-_]/g, ' ');

  // Handle camelCase by inserting spaces before capital letters
  // This regex looks for a lowercase letter followed by an uppercase letter
  // and puts a space between them
  spacedName = spacedName.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Title case (capitalize first letter of each word)
  const titleCased = spacedName
    .split(' ')
    .map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  if (titleCased === 'Sla') {
    return 'Service Level Agreement';
  }
  debugLog(`Generated title: "${titleCased}"`);
  return titleCased;
}

// Function to generate a simple slug from a file path
function generateSlug(filePath) {
  debugLog(`Generating slug from: ${filePath}`);
  // Remove extension, make lowercase, replace slashes/spaces with hyphens
  let slug = filePath
    .replace(/\.md$/, '')
    .replace('..', '')
    .toLowerCase()
    .replace(/[\/\s_]+/g, '-') // Replace slashes, spaces, underscores with hyphens
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
  if (slug === '') { // Handle case where path is just '/' or similar
    slug = 'index'; // Or some other default
  }
  debugLog(`Generated slug: "${slug}"`);
  return slug;
}

// Function to get existing items by path from Webflow
async function getWebflowItemsByPath(collectionId) {
  log(`Fetching existing items from Webflow collection ${collectionId}...`);
  const itemsMap = new Map(); // Map of repoPath -> Webflow Item ID
  let offset = 0;
  const limit = 100; // Max items per request

  try {
    let hasMoreItems = true;

    while (hasMoreItems) {
      debugLog(`Fetching items batch - offset: ${offset}, limit: ${limit}`);

      // Fetch collection items with pagination
      const response = await webflow.collections.items.listItems(collectionId, { limit, offset });

      if (response && Array.isArray(response.items)) {
        const items = response.items;
        debugLog(`Received ${items.length} items in batch`);

        items.forEach(item => {
          if (item && item.fieldData[FIELD_ID_PATH]) {
            const path = item.fieldData[FIELD_ID_PATH];
            itemsMap.set(path, item.id);
            debugLog(`Mapped path "${path}" to ID "${item.id}"`);
          } else {
            debugLog(`Item missing path field: ${JSON.stringify(item.id)}`);
          }
        });

        if (items.length < limit) {
          // Less than limit items returned, means we've reached the end
          debugLog('Reached end of items list (received less than limit)');
          hasMoreItems = false;
        } else {
          offset += limit; // Prepare for next page
          debugLog(`Moving to next page, new offset: ${offset}`);
        }
      } else {
        console.warn("Unexpected response structure when fetching items:", response);
        debugLog(`Unexpected response structure: ${JSON.stringify(response)}`);
        hasMoreItems = false;
      }
    }

    log(`Fetched ${itemsMap.size} existing items.`);
    return itemsMap;

  } catch (error) {
    console.error("Error fetching existing Webflow items:", error.message);
    debugLog(`API Error details: ${JSON.stringify(error.message)}`);
    if (error.response) {
      console.error("Response data:", error.response);
      debugLog(`Response details: ${JSON.stringify(error.response)}`);
    }
    throw error; // Re-throw to stop the process
  }
}

// Function to create or update item in Webflow
async function syncItem(repoPath, mdContent, htmlContent, title, existingItemsMap) {
  const slug = generateSlug(repoPath);
  const existingItemId = existingItemsMap.get(repoPath);


  debugLog(`Syncing item: ${repoPath}`);
  debugLog(`Exists in Webflow: ${existingItemId ? 'Yes' : 'No'}`);

  const itemData = {
    // Note: webflow-api doesn't need isArchived and isDraft at the top level
    [FIELD_ID_TITLE]: title,
    [FIELD_ID_SLUG]: slug,
    [FIELD_ID_PATH]: repoPath, // Store the original repository path
    [FIELD_ID_HTML_CONTENT]: htmlContent,
    [FIELD_ID_MD_CONTENT]: mdContent,
    // Add other required fields here if any, e.g., 'live': true
  };

  debugLog(`Item data: ${JSON.stringify({ ...itemData, "html-content": htmlContent.length, "markdown-content": mdContent.length })}`);

  try {
    let response;
    if (existingItemId) {
      // Update existing item
      log(`Updating item for path: ${repoPath} (Webflow ID: ${existingItemId})`);
      debugLog(`PUT request to update item with ID ${existingItemId}`);

      response = await webflow.collections.items.updateItem(
        WEBFLOW_COLLECTION_ID,
        existingItemId,
        {
          fieldData: itemData
        });

      debugLog(`Update response: ${JSON.stringify(response)}`);
      log(`Successfully updated item for path: ${repoPath}`);
    } else {
      // Create new item
      log(`Creating new item for path: ${repoPath}`);
      debugLog(`POST request to create new item`);
      response = await webflow.collections.items.createItem(
        WEBFLOW_COLLECTION_ID,
        {
          fieldData: itemData
        });

      debugLog(`Create response: ${JSON.stringify(response)}`);
      debugLog(`Created with ID: ${response?._id || 'unknown'}`);
      log(`Successfully created item for path: ${repoPath}`);
    }

    return response;
  } catch (error) {
    console.error(`Error syncing item for path: ${repoPath}`, error.message);
    debugLog(`Sync error details: ${error.stack || error.message}`);
    if (error.response) {
      console.error("Response data:", error.response);
      debugLog(`Error response details: ${JSON.stringify(error.response)}`);
    }
    // Continue with other files rather than throwing
  }
}

// Good for debugging; write the HTML to a file for review
function writeHtmlToFile(filePath, htmlContent, frontmatter) {
  const htmlOutputPath = path.join('scripts', 'output', path.dirname(filePath), `${path.basename(filePath, '.md')}.html`);
  debugLog(`Writing HTML output to: ${htmlOutputPath}`);

  // Read header and footer templates
  let headerContent = fs.readFileSync(path.join('scripts', 'input', 'header.html'), 'utf8');
  const footerContent = fs.readFileSync(path.join('scripts', 'input', 'footer.html'), 'utf8');

  // Remove the <h1 class="heading">...</h1> from the header if frontmatter.title is present
  if (frontmatter && frontmatter.title) {
    headerContent = headerContent.replace(/<h1 class=\"heading\">[\s\S]*?<\/h1>/, '');
  }

  // Insert the legal sections into the correct container after the heading
  const container2Regex = /(<div class="w-layout-blockcontainer container-2 w-container">)([\s\S]*?<h1 class="heading">[\s\S]*?<\/h1>)/;
  let fullHtmlContent;
  if (container2Regex.test(headerContent)) {
    // If the container and heading are present, insert after the heading
    fullHtmlContent = headerContent.replace(
      /(<div class="w-layout-blockcontainer container-2 w-container">[\s\S]*?<h1 class="heading">[\s\S]*?<\/h1>)/,
      `$1${htmlContent}`
    ) + footerContent;
  } else if (headerContent.includes('<div class="w-layout-blockcontainer container-2 w-container">')) {
    // If only the container is present, insert heading and content
    fullHtmlContent = headerContent.replace(
      /(<div class="w-layout-blockcontainer container-2 w-container">)/,
      `$1${htmlContent}`
    ) + footerContent;
  } else {
    // Fallback: append the container, heading, and content at the end
    fullHtmlContent = headerContent + `<div class="w-layout-blockcontainer container-2 w-container">${htmlContent}</div>` + footerContent;
  }

  // Ensure the output directory exists
  fs.mkdirSync(path.dirname(htmlOutputPath), { recursive: true });

  // Write the HTML content to file
  fs.writeFileSync(htmlOutputPath, fullHtmlContent);
  debugLog(`Successfully wrote HTML to ${htmlOutputPath}`);
}

// Main sync function
async function syncWebflow() {
  debugLog('Starting Webflow sync process');
  try {
    debugLog('Checking environment variables');
    if (!WEBFLOW_API_KEY) {
      throw new Error('WEBFLOW_API_KEY environment variable is required');
    }
    if (!WEBFLOW_SITE_ID) {
      throw new Error('WEBFLOW_SITE_ID environment variable is required');
    }
    if (!WEBFLOW_COLLECTION_ID) {
      throw new Error('WEBFLOW_COLLECTION_ID environment variable is required');
    }

    const markdownFiles = await findMdFiles('.'); // Scan from repository root
    log(`Found ${markdownFiles.length} markdown files.`);

    if (markdownFiles.length === 0) {
      log("No markdown files found to sync. Exiting.");
      return;
    }

    // Fetch existing items ONCE before processing files
    debugLog('Fetching existing Webflow items');
    const existingItemsMap = await getWebflowItemsByPath(WEBFLOW_COLLECTION_ID);
    debugLog(`Existing items map contains ${existingItemsMap.size} entries`);

    debugLog('Beginning to process individual files');
    for (const filePath of markdownFiles) {
      log(`Processing ${filePath}...`);
      try {
        debugLog(`Reading file content: ${filePath}`);
        const markdownContent = fs.readFileSync(filePath, 'utf8');
        debugLog(`Read ${markdownContent.length} characters from file`);

        debugLog('Parsing sections and generating side-by-side HTML layout');
        const { content, data: frontmatter } = matter(markdownContent);
        const sections = parseSections(content);
        const htmlContent = generateHtmlLayout(sections, frontmatter);
        debugLog(`Generated ${htmlContent.length} characters of HTML`);

        const title = extractTitle(filePath);
        const repoPath = filePath; // The path relative to the repo root

        writeHtmlToFile(filePath, htmlContent, frontmatter);

        //debugLog(`Syncing item with title: "${title}", path: "${repoPath}"`);
        //await syncItem(repoPath, markdownContent, htmlContent, title, existingItemsMap);

      } catch (fileProcessingError) {
        console.error(`Error processing file ${filePath}:`, fileProcessingError.message);
        debugLog(`File processing error stack: ${fileProcessingError.stack}`);
        // Continue processing other files
      }
    }

    log("Webflow sync process completed.");
    debugLog('Sync process finished successfully');

  } catch (overallError) {
    console.error("Overall sync process failed:", overallError.message);
    debugLog(`Fatal error details: ${overallError.stack}`);
    process.exit(1); // Exit with a non-zero code to indicate failure in GitHub Actions
  }
}

// Optional: Publish changes to the site after sync is complete
async function publishSite() {
  try {
    log(`Publishing changes to Webflow site ${WEBFLOW_SITE_ID}...`);
    const domains = await webflow.publishSite({
      siteId: WEBFLOW_SITE_ID,
      domains: 'all' // Publish to all domains
    });

    log(`Successfully published to domains: ${domains.join(', ')}`);
  } catch (error) {
    console.error("Error publishing site:", error.message);
    debugLog(`Publish error details: ${error.stack || error.message}`);
    // Not throwing error to avoid failing if sync was successful but publish failed
  }
}

// Execute the main function
debugLog('Script initialized, starting sync process');
syncWebflow();