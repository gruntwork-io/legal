const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const MarkdownIt = require('markdown-it');
const axios = require('axios');

// --- Configuration ---
const WEBFLOW_API_KEY = process.env.WEBFLOW_API_KEY;
const WEBFLOW_SITE_ID = process.env.WEBFLOW_SITE_ID;
const WEBFLOW_COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID;
const DEBUG = process.env.DEBUG === 'true';

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
const FIELD_ID_TITLE = process.env.WEBFLOW_TITLE_FIELD_ID;
const FIELD_ID_SLUG = process.env.WEBFLOW_SLUG_FIELD_ID;
const FIELD_ID_PATH = process.env.WEBFLOW_PATH_FIELD_ID;
const FIELD_ID_HTML_CONTENT = process.env.WEBFLOW_HTML_FIELD_ID;
const FIELD_ID_MD_CONTENT = process.env.WEBFLOW_MD_FIELD_ID;

const WEBFLOW_API_BASE = 'https://api.webflow.com';

debugLog('Environment configuration loaded');
debugLog(`WEBFLOW_SITE_ID: ${WEBFLOW_SITE_ID}`);
debugLog(`WEBFLOW_COLLECTION_ID: ${WEBFLOW_COLLECTION_ID}`);

const md = new MarkdownIt();

const webflow = axios.create({
  baseURL: WEBFLOW_API_BASE,
  headers: {
    'Authorization': `Bearer ${WEBFLOW_API_KEY}`,
    'accept': 'application/json',
    'content-type': 'application/json',
    'accept-version': '1.0.0',
  },
});
debugLog('Webflow API client initialized');

// Function to find all markdown files
function findMdFiles(rootDir) {
  debugLog(`Searching for markdown files in: ${rootDir}`);
  return new Promise((resolve, reject) => {
    // Find all .md files, excluding those in .git or node_modules
    glob('**/*.md', { ignore: ['.git/**', 'node_modules/**'], cwd: rootDir }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        debugLog(`Found ${files.length} markdown files`);
        if (DEBUG && files.length > 0) {
          debugLog(`First few files: ${files.slice(0, 3).join(', ')}${files.length > 3 ? '...' : ''}`);
        }
        resolve(files);
      }
    });
  });
}

// Function to extract title (first H1 or H2)
function extractTitle(markdownContent) {
  debugLog('Extracting title from markdown content');
  const match = markdownContent.match(/^#{1,2}\s+(.*)/m);
  const title = match ? match[1].trim() : 'Untitled Legal Page';
  debugLog(`Extracted title: "${title}"`);
  return title;
}

// Function to generate a simple slug from a file path
function generateSlug(filePath) {
  debugLog(`Generating slug from: ${filePath}`);
  // Remove extension, make lowercase, replace slashes/spaces with hyphens
  let slug = filePath
    .replace(/\.md$/, '')
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
    while (true) {
      debugLog(`Fetching items batch - offset: ${offset}, limit: ${limit}`);
      // Note: Webflow API filtering might be limited or require the exact field ID.
      // A simpler approach for a collection of reasonable size is to fetch all and filter client-side.
      // If your collection is very large, you might need to adjust or look for specific Webflow filter capabilities.
      const response = await webflow.get(`/collections/${collectionId}/items`, {
        params: {
          offset: offset,
          limit: limit
        }
      });

      if (response.data && Array.isArray(response.data.items)) {
        debugLog(`Received ${response.data.items.length} items in batch`);
        response.data.items.forEach(item => {
          // Assuming the 'path' field exists and is reliable as a unique key
          if (item.fieldData && item.fieldData[FIELD_ID_PATH]) {
            const path = item.fieldData[FIELD_ID_PATH];
            itemsMap.set(path, item._id);
            debugLog(`Mapped path "${path}" to ID "${item._id}"`);
          } else {
            debugLog(`Item missing path field: ${JSON.stringify(item._id)}`);
          }
        });

        if (response.data.items.length < limit) {
          // Less than limit items returned, means we've reached the end
          debugLog('Reached end of items list (received less than limit)');
          break;
        }
        offset += limit; // Prepare for next page
        debugLog(`Moving to next page, new offset: ${offset}`);
      } else {
        console.warn("Unexpected response structure when fetching items:", response.data);
        debugLog(`Unexpected response structure: ${JSON.stringify(response.data)}`);
        break; // Exit loop on unexpected structure
      }
    }
    log(`Fetched ${itemsMap.size} existing items.`);
    return itemsMap;

  } catch (error) {
    console.error("Error fetching existing Webflow items:", error.message);
    debugLog(`API Error details: ${JSON.stringify(error.message)}`);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      debugLog(`Response headers: ${JSON.stringify(error.response.headers)}`);
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
    isArchived: false,
    isDraft: false,
    fieldData: {
      [FIELD_ID_TITLE]: title,
      [FIELD_ID_SLUG]: slug,
      [FIELD_ID_PATH]: repoPath, // Store the original repository path
      [FIELD_ID_HTML_CONTENT]: htmlContent,
      [FIELD_ID_MD_CONTENT]: mdContent,
      // Add other required fields here if any, e.g., 'live': true
    },
  };

  debugLog(`Item data: ${JSON.stringify({
    title: itemData.fieldData[FIELD_ID_TITLE],
    slug: itemData.fieldData[FIELD_ID_SLUG],
    path: itemData.fieldData[FIELD_ID_PATH],
    htmlContentLength: htmlContent.length,
    mdContentLength: mdContent.length
  })}`);

  try {
    if (existingItemId) {
      // Update existing item
      log(`Updating item for path: ${repoPath} (Webflow ID: ${existingItemId})`);
      debugLog(`PUT request to: /collections/${WEBFLOW_COLLECTION_ID}/items/${existingItemId}`);
      const response = await webflow.put(`/collections/${WEBFLOW_COLLECTION_ID}/items/${existingItemId}`, itemData);
      debugLog(`Update response status: ${response.status}`);
      log(`Successfully updated item for path: ${repoPath}`);
    } else {
      // Create new item
      log(`Creating new item for path: ${repoPath}`);
      debugLog(`POST request to: /collections/${WEBFLOW_COLLECTION_ID}/items`);
      const response = await webflow.post(`/collections/${WEBFLOW_COLLECTION_ID}/items`, itemData);
      debugLog(`Create response status: ${response.status}`);
      debugLog(`Created with ID: ${response.data?._id || 'unknown'}`);
      log(`Successfully created item for path: ${repoPath}`);
    }
  } catch (error) {
    console.error(`Error syncing item for path: ${repoPath}`, error.message);
    debugLog(`Sync error details: ${error.stack || error.message}`);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      debugLog(`Error response headers: ${JSON.stringify(error.response.headers)}`);
    }
    // Decide if you want to throw here or continue with other files
    // throw error;
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

        debugLog('Converting markdown to HTML');
        const htmlContent = md.render(markdownContent);
        debugLog(`Generated ${htmlContent.length} characters of HTML`);

        const title = extractTitle(markdownContent);
        const repoPath = filePath; // The path relative to the repo root

        debugLog(`Syncing item with title: "${title}", path: "${repoPath}"`);
        await syncItem(repoPath, markdownContent, htmlContent, title, existingItemsMap);

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

// Execute the main function
debugLog('Script initialized, starting sync process');
syncWebflow();