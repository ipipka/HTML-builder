const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');
const fileReadStream = fs.createReadStream(filePath, 'utf-8');

fileReadStream.on('data', chunk => process.stdout.write(chunk));
fileReadStream.on('error', error => console.log('Error', error.message));
