const path = require('path');
const fs = require('fs/promises');

const folderPath = path.join(__dirname, '/secret-folder');

(async (folderPath) => {
  const dirElements = await fs.readdir(folderPath, {withFileTypes: true});

  for (const element of dirElements) {
    if (element.isFile()) {
      const elementPath = path.join(folderPath, element.name);
      const elementSize = (await fs.stat(elementPath)).size / 1024;

      console.log(`${path.parse(elementPath).name} - ${path.extname(elementPath).slice(1)} - ${elementSize.toFixed(3)}kb`);
    }
  }
})(folderPath);
