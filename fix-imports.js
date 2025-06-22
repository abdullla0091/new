// A script to create lowercase aliases for all capitalized files
// This helps avoid case sensitivity issues with imports

const fs = require('fs');
const path = require('path');

function createLowercaseAliases(dirPath) {
  // Read all files and directories in the given path
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    
    if (item.isDirectory()) {
      // Recursively process subdirectories
      createLowercaseAliases(fullPath);
    } else {
      // Check if the file name has uppercase letters
      const lowercaseName = item.name.toLowerCase();
      if (lowercaseName !== item.name) {
        const lowercasePath = path.join(dirPath, lowercaseName);
        
        // Create a copy of the file with lowercase name if it doesn't exist
        if (!fs.existsSync(lowercasePath)) {
          console.log(`Creating lowercase alias: ${lowercasePath} -> ${fullPath}`);
          fs.copyFileSync(fullPath, lowercasePath);
        }
      }
    }
  }
}

// Start from the app directory
const appDir = path.join(__dirname, 'app');
console.log('Creating lowercase aliases for files in the app directory...');
createLowercaseAliases(appDir);

// Also process the components directory
const componentsDir = path.join(__dirname, 'components');
console.log('Creating lowercase aliases for files in the components directory...');
createLowercaseAliases(componentsDir);

console.log('Done! Lowercase aliases have been created.'); 