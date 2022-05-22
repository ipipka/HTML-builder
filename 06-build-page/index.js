const path = require('path');
const fs = require('fs/promises');

const distPath = path.join(__dirname, '/project-dist');

// components markup
const componentsMarkup = async (folderPath) => {
  let markup = {};
  try {
    const dirElements = await fs.readdir(folderPath, {withFileTypes: true});

    for (const element of dirElements) {
      if (element.isFile() && path.extname(element.name) === '.html') {
        const elementPath = path.join(folderPath, element.name);
        const elementName = path.parse(element.name).name;
        markup[elementName] = await  fs.readFile(elementPath, 'utf8');
      }
    }

    return markup;
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
};

// template
const createIndexFile = async (source, dist, components) => {
  try {
    let template = await fs.readFile(source, 'utf8');
    const markup = await componentsMarkup(components);

    template = template.replace(/{{(\w+)}}/g, ($1) => {
      return markup[$1.slice(2, -2)];
    });

    await fs.writeFile(dist, template, 'utf8');
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
};

// style
const createStyleFile = async (source, dist) => {
  try {
    let style = '';
    const sourceElements = await fs.readdir(source, {withFileTypes: true});

    for (const element of sourceElements) {
      if (element.isFile() && path.extname(element.name) === '.css') {
        const filePath = path.join(source, element.name);

        style += style=== '' ? '' : '\n';
        style += await fs.readFile(filePath, 'utf8');
      }
    }

    await fs.writeFile(dist, style, 'utf8');
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
};

const createAssetsFolder = async (source, dist) => {
  try {
    const sourceElements = await fs.readdir(source, {withFileTypes: true});

    for (const element of sourceElements) {
      if (element.isFile()) {
        const sourceFilePath = path.join(source, element.name);
        const distFilePath = path.join(dist, element.name);

        await fs.copyFile(sourceFilePath, distFilePath);
      } else if (element.isDirectory()) {
        const sourceInnerPath = path.join(source, element.name);
        const distInnerPath = path.join(dist, element.name);

        await fs.mkdir(path.join(dist, element.name));
        await createAssetsFolder(sourceInnerPath, distInnerPath);
      }
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
};

(async (dist) => {
  try {
    // remove dist
    await fs.rm(dist, {force: true, recursive: true});

    // create folder dist
    await fs.mkdir(dist);

    // create index based on template
    const sourceTemplatePath = path.join(__dirname, 'template.html');
    const distTemplatePath = path.join(dist, 'index.html');
    const componentsPath = path.join(__dirname, 'components');

    await createIndexFile(sourceTemplatePath, distTemplatePath, componentsPath);

    // style
    const sourceStylePath = path.join(__dirname, '/styles');
    const distStylePath = path.join(dist, 'style.css');

    await createStyleFile(sourceStylePath, distStylePath);

    // assets
    const sourceAssetsPath = path.join(__dirname, '/assets');
    const distAssetsPath = path.join(dist, '/assets');

    await fs.mkdir(distAssetsPath);
    await createAssetsFolder(sourceAssetsPath, distAssetsPath);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
})(distPath);
