const path = require('path');
const fs = require('fs/promises');

const sourceFolderPath = path.join(__dirname, '/files');
const copyFolderPath = path.join(__dirname, '/files-copy');

(async (source, copy) => {
  try {
    // remove copy-folder
    await fs.rm(copy, {force: true, recursive: true});

    // create new copy-folder
    await fs.mkdir(copy);

    // copy files
    const sourceElements = await fs.readdir(source, {withFileTypes: true});

    for (const element of sourceElements) {
      if (element.isFile()) {
        const sourceFilePath = path.join(source, element.name);
        const copyFilePath = path.join(copy, element.name);

        await fs.copyFile(sourceFilePath, copyFilePath);
      }
      else if (element.isDirectory()) {
        await fs.mkdir(path.join(copy, element.name));
      }
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
})(sourceFolderPath, copyFolderPath);
