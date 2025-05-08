const fs = require('fs');
const path = require('path');
const glob = require('glob');
const MarkdownIt = require('markdown-it');
const axios = require('axios');

// --- Configuration ---
const WEBFLOW_API_KEY = process.env.WEBFLOW_API_KEY;
const WEBFLOW_SITE_ID = process.env.WEBFLOW_SITE_ID;
const WEBFLOW_COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID;

// --- IMPORTANT ---
// Set these to the *API names* of your fields in Webflow's "legal pages" collection.
// Find these in your Webflow project settings under "API & Integrations" -> Collections -> Legal Pages
const FIELD_ID_TITLE = process.env.WEBFLOW_TITLE_FIELD_ID;
const FIELD_ID_SLUG = process.env.WEBFLOW_SLUG_FIELD_ID;
const FIELD_ID_PATH = process.env.WEBFLOW_PATH_FIELD_ID;
const FIELD_ID_HTML_CONTENT = process.env.WEBFLOW_HTML_FIELD_ID;
const FIELD_ID_MD_CONTENT = process.env.WEBFLOW_MD_FIELD_ID;

const WEBFLOW_API_BASE = 'https://api.webflow.com';

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

// Function to find all markdown files
function findMdFiles(rootDir) {
  return new Promise((resolve, reject) => {
    // Find all .md files, excluding those in .git or node_modules
    glob('**/*.md', { ignore: ['.git/**', 'node_modules/**'], cwd: rootDir }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

// Function to extract title (first H1 or H2)
function extractTitle(markdownContent) {
    const match = markdownContent.match(/^#{1,2}\s+(.*)/m);
    return match ? match[1].trim() : 'Untitled Legal Page'; // Default title if no H1/H2 found
}

// Function to generate a simple slug from a file path
function generateSlug(filePath) {
    // Remove extension, make lowercase, replace slashes/spaces with hyphens
    let slug = filePath
        .replace(/\.md$/, '')
        .toLowerCase()
        .replace(/[\/\s_]+/g, '-') // Replace slashes, spaces, underscores with hyphens
        .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
    if (slug === '') { // Handle case where path is just '/' or similar
        slug = 'index'; // Or some other default
    }
    return slug;
}


// Function to get existing items by path from Webflow
async function getWebflowItemsByPath(collectionId) {
    console.log(`Workspaceing existing items from Webflow collection ${collectionId}...`);
    const itemsMap = new Map(); // Map of repoPath -> Webflow Item ID
    let offset = 0;
    const limit = 100; // Max items per request

    try {
        while (true) {
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
                response.data.items.forEach(item => {
                    // Assuming the 'path' field exists and is reliable as a unique key
                    if (item.fieldData && item.fieldData[FIELD_ID_PATH]) {
                        itemsMap.set(item.fieldData[FIELD_ID_PATH], item._id);
                    }
                });

                if (response.data.items.length < limit) {
                    // Less than limit items returned, means we've reached the end
                    break;
                }
                offset += limit; // Prepare for next page
            } else {
                console.warn("Unexpected response structure when fetching items:", response.data);
                break; // Exit loop on unexpected structure
            }
        }
        console.log(`Workspaceed ${itemsMap.size} existing items.`);
        return itemsMap;

    } catch (error) {
        console.error("Error fetching existing Webflow items:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        throw error; // Re-throw to stop the process
    }
}


// Function to create or update item in Webflow
async function syncItem(repoPath, mdContent, htmlContent, title, existingItemsMap) {
    const slug = generateSlug(repoPath);
    const existingItemId = existingItemsMap.get(repoPath);

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

    try {
        if (existingItemId) {
            // Update existing item
            console.log(`Updating item for path: ${repoPath} (Webflow ID: ${existingItemId})`);
            await webflow.put(`/collections/${WEBFLOW_COLLECTION_ID}/items/${existingItemId}`, itemData);
            console.log(`Successfully updated item for path: ${repoPath}`);
        } else {
            // Create new item
            console.log(`Creating new item for path: ${repoPath}`);
            await webflow.post(`/collections/${WEBFLOW_COLLECTION_ID}/items`, itemData);
            console.log(`Successfully created item for path: ${repoPath}`);
        }
    } catch (error) {
         console.error(`Error syncing item for path: ${repoPath}`, error.message);
         if (error.response) {
             console.error("Response data:", error.response.data);
             console.error("Response status:", error.response.status);
         }
         // Decide if you want to throw here or continue with other files
         // throw error;
    }
}

// Main sync function
async function syncWebflow() {
  try {
    const markdownFiles = await findMdFiles('.'); // Scan from repository root
    console.log(`Found ${markdownFiles.length} markdown files.`);

    if (markdownFiles.length === 0) {
      console.log("No markdown files found to sync. Exiting.");
      return;
    }

    // Fetch existing items ONCE before processing files
    const existingItemsMap = await getWebflowItemsByPath(WEBFLOW_COLLECTION_ID);


    for (const filePath of markdownFiles) {
      console.log(`Processing ${filePath}...`);
      try {
        const markdownContent = fs.readFileSync(filePath, 'utf8');
        const htmlContent = md.render(markdownContent);
        const title = extractTitle(markdownContent);
        const repoPath = filePath; // The path relative to the repo root

        await syncItem(repoPath, markdownContent, htmlContent, title, existingItemsMap);

      } catch (fileProcessingError) {
        console.error(`Error processing file ${filePath}:`, fileProcessingError.message);
        // Continue processing other files
      }
    }

    console.log("Webflow sync process completed.");

  } catch (overallError) {
    console.error("Overall sync process failed:", overallError.message);
    process.exit(1); // Exit with a non-zero code to indicate failure in GitHub Actions
  }
}

// Execute the main function
syncWebflow();