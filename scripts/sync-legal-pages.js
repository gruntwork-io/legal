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

function log(message) { console.log(message); }
function debugLog(message) { if (DEBUG) console.log(`[DEBUG] ${message}`); }

const FIELD_ID_TITLE = process.env.WEBFLOW_TITLE_FIELD_ID || 'name';
const FIELD_ID_SLUG = process.env.WEBFLOW_SLUG_FIELD_ID || 'slug';
const FIELD_ID_HTML_CONTENT = process.env.WEBFLOW_HTML_FIELD_ID || 'html-content';

debugLog(`WEBFLOW_SITE_ID: ${WEBFLOW_SITE_ID}`);
debugLog(`WEBFLOW_COLLECTION_ID: ${WEBFLOW_COLLECTION_ID}`);

const md = new MarkdownIt({ html: true });

function preprocessMarkdown(content) {
  return content.replace(
    /<!--Plain English:([\s\S]*?)-->/g,
    (_, plainEnglishContent) => {
      const cleanContent = plainEnglishContent.trim();
      return `\n\n<div class="plain-english"><em>Plain English: ${cleanContent}</em></div>\n\n`;
    }
  );
}

const webflow = new WebflowClient({ accessToken: WEBFLOW_API_KEY });

async function findMdFiles(rootDir) {
  const files = await glob('**/*.md', {
    ignore: ['.git/**', 'node_modules/**', 'scripts/**', '**/README.md'],
    cwd: rootDir
  });
  debugLog(`Found ${files.length} markdown files`);
  return files;
}

function extractTitle(filePath) {
  const basename = path.basename(filePath, '.md');
  let spacedName = basename.replace(/[-_]/g, ' ');
  spacedName = spacedName.replace(/([a-z])([A-Z])/g, '$1 $2');
  const titleCased = spacedName
    .split(' ')
    .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '')
    .join(' ');
  if (titleCased === 'Sla') return 'Service Level Agreement';
  return titleCased;
}

function generateSlug(title) {
  return title.toLowerCase().replace(/\s+/g, '-');
}

async function getWebflowItemsBySlug(collectionId) {
  log(`Fetching existing items from Webflow collection ${collectionId}...`);
  const itemsMap = new Map();
  let offset = 0;
  const limit = 100;

  try {
    let hasMoreItems = true;
    while (hasMoreItems) {
      const response = await webflow.collections.items.listItems(collectionId, { limit, offset });
      if (response && Array.isArray(response.items)) {
        response.items.forEach(item => {
          if (item?.fieldData[FIELD_ID_SLUG]) {
            itemsMap.set(item.fieldData[FIELD_ID_SLUG], item.id);
          }
        });
        hasMoreItems = response.items.length === limit;
        offset += limit;
      } else {
        hasMoreItems = false;
      }
    }
    log(`Fetched ${itemsMap.size} existing items.`);
    return itemsMap;
  } catch (error) {
    console.error("Error fetching existing Webflow items:", error.message);
    throw error;
  }
}

async function syncItem(repoPath, htmlContent, title, existingItemsMap) {
  const slug = generateSlug(title);
  const existingItemId = existingItemsMap.get(slug);

  const fieldData = {
    [FIELD_ID_TITLE]: title,
    [FIELD_ID_SLUG]: slug,
    [FIELD_ID_HTML_CONTENT]: htmlContent,
  };

  try {
    if (existingItemId) {
      log(`Updating: ${repoPath} (ID: ${existingItemId})`);
      await webflow.collections.items.updateItem(WEBFLOW_COLLECTION_ID, existingItemId, { fieldData });
      log(`✅ Updated: ${repoPath}`);
    } else {
      log(`Creating: ${repoPath}`);
      const created = await webflow.collections.items.createItem(WEBFLOW_COLLECTION_ID, { fieldData });
      log(`✅ Created: ${repoPath} (ID: ${created?.id})`);
    }
  } catch (error) {
    console.error(`❌ Error syncing ${repoPath}:`, error.message);
    if (error.response) console.error("Response:", error.response);
  }
}

async function publishSite() {
  try {
    log(`Publishing Webflow site ${WEBFLOW_SITE_ID}...`);
    await webflow.sites.publish(WEBFLOW_SITE_ID, {
      customDomains: ["www.gruntwork.io"],
      publishToWebflowSubdomain: true
    });
    log(`✅ Site published successfully.`);
  } catch (error) {
    console.error("❌ Error publishing site:", error.message);
  }
}

async function syncWebflow() {
  if (!WEBFLOW_API_KEY) throw new Error('WEBFLOW_API_KEY is required');
  if (!WEBFLOW_SITE_ID) throw new Error('WEBFLOW_SITE_ID is required');
  if (!WEBFLOW_COLLECTION_ID) throw new Error('WEBFLOW_COLLECTION_ID is required');

  const markdownFiles = await findMdFiles('.');
  log(`Found ${markdownFiles.length} markdown files.`);
  if (markdownFiles.length === 0) { log("Nothing to sync."); return; }

  const existingItemsMap = await getWebflowItemsBySlug(WEBFLOW_COLLECTION_ID);

  for (const filePath of markdownFiles) {
    log(`Processing ${filePath}...`);
    try {
      const markdownContent = fs.readFileSync(filePath, 'utf8');
      const processedMarkdown = preprocessMarkdown(markdownContent);
      const htmlContent = md.render(processedMarkdown);
      const title = extractTitle(filePath);
      await syncItem(filePath, htmlContent, title, existingItemsMap);
    } catch (err) {
      console.error(`❌ Failed to process ${filePath}:`, err.message);
    }
  }
  log("Sync complete.");
}

syncWebflow().then(() => publishSite()).catch(err => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
