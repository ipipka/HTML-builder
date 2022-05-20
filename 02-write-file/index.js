const path = require('path');
const fs = require('fs');
const readline = require('readline');

const fileWriteStream = fs.createWriteStream(path.join(__dirname, 'input.txt'));
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.write('Hi! Enter data for input.txt:\n');

rl.on('line', (data) => {
  data === 'exit' ? process.exit() : fileWriteStream.write(data + '\n');
});

process.on('exit', () => console.log('Have a good day...'));
