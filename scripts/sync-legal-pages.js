const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const MarkdownIt = require('markdown-it');
const { WebflowClient } = require("webflow-api");


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
function generateHtmlLayout(sections) {
  // Use a container and grid/flex rows for each section
  let html = '<div class="legal-sections-container">';
  for (const section of sections) {
    html += '<div class="legal-section-row">';
    html += '<div class="plain-english-col">';
    if (section.plainEnglish) {
      html += md.render(section.plainEnglish);
    }
    html += '</div>';
    html += '<div class="legalese-col">';
    if (section.legalese) {
      html += md.render(section.legalese);
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
        const sections = parseSections(markdownContent);
        const htmlContent = generateHtmlLayout(sections);
        debugLog(`Generated ${htmlContent.length} characters of HTML`);

        const title = extractTitle(filePath);
        const repoPath = filePath; // The path relative to the repo root

        // Write HTML content to disk for debugging/review
        const htmlOutputPath = path.join('scripts', 'output', path.dirname(filePath), `${path.basename(filePath, '.md')}.html`);
        debugLog(`Writing HTML output to: ${htmlOutputPath}`);

        // Read header and footer templates
        const headerContent = fs.readFileSync(path.join('scripts', 'input', 'header.html'), 'utf8');
        const footerContent = fs.readFileSync(path.join('scripts', 'input', 'footer.html'), 'utf8');
        
        // Combine header, content and footer
        const fullHtmlContent = headerContent + htmlContent + footerContent;
        
        // Ensure the output directory exists
        fs.mkdirSync(path.dirname(htmlOutputPath), { recursive: true });
        
        // Write the HTML content to file
        fs.writeFileSync(htmlOutputPath, fullHtmlContent);
        debugLog(`Successfully wrote HTML to ${htmlOutputPath}`);

        debugLog(`Syncing item with title: "${title}", path: "${repoPath}"`);
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