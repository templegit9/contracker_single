const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Check if rimraf is installed
let useRimraf = false;
try {
  require.resolve('rimraf');
  useRimraf = true;
} catch (e) {
  console.log('rimraf not found, using native commands for directory removal');
}

// Paths to delete
const pathsToDelete = [
  'package-lock.json',
  'node_modules'
];

console.log('Starting dependency reset process...');

// Delete files/directories
pathsToDelete.forEach(p => {
  const fullPath = path.join(__dirname, p);
  
  try {
    if (fs.existsSync(fullPath)) {
      console.log(`Removing ${p}...`);
      
      if (fs.lstatSync(fullPath).isDirectory()) {
        try {
          if (useRimraf) {
            // Use rimraf if available
            const rimraf = require('rimraf');
            rimraf.sync(fullPath);
          } else {
            // Fallback to native commands
            if (process.platform === 'win32') {
              execSync(`rmdir /s /q "${fullPath}"`);
            } else {
              execSync(`rm -rf "${fullPath}"`);
            }
          }
          console.log(`Removed directory: ${p}`);
        } catch (err) {
          console.error(`Failed to remove directory ${p}:`, err.message);
          console.error('You may need to manually delete it.');
        }
      } else {
        fs.unlinkSync(fullPath);
        console.log(`Removed file: ${p}`);
      }
    } else {
      console.log(`${p} does not exist, skipping.`);
    }
  } catch (err) {
    console.error(`Error handling ${p}:`, err);
  }
});

// Install dependencies with legacy peer deps flag
console.log('\nInstalling dependencies with --legacy-peer-deps...');
console.log('This may take a few minutes.\n');

try {
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  console.log('\nDependencies reinstalled successfully!');
} catch (err) {
  console.error('\nFailed to install dependencies:', err.message);
  console.log('\nTry running the following commands manually:');
  console.log('  npm install --legacy-peer-deps');
}

console.log('\nReset process complete!');
console.log('You can now run "npm start" to start the application.'); 