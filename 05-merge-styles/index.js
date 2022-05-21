const path = require('path');
const fs = require('fs/promises');

const sourcePath = path.join(__dirname, '/styles');
const distStylePath = path.join(__dirname, '/project-dist', 'bundle.css');

(async (source, distStyle) => {
  try {
    let styleData = '';
    const sourceElements = await fs.readdir(source, {withFileTypes: true});

    for (const element of sourceElements) {
      if (element.isFile() && path.extname(element.name) === '.css') {
        const filePath = path.join(sourcePath, element.name);

        styleData += styleData === '' ? '' : '\n';
        styleData += await fs.readFile(filePath, 'utf8');
      }
    }
    await fs.writeFile(distStyle, styleData, 'utf8');
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
})(sourcePath, distStylePath);
