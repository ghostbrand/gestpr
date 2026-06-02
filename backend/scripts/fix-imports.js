const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const files = globSync('src/**/*.js', { cwd: __dirname + '/..' });
let count = 0;

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  content = content.replace(/require\('@\/([^']+)'\)/g, (match, reqPath) => {
    const fileDir = path.dirname(file);
    const target = path.join('src', reqPath);
    let rel = path.relative(fileDir, target).split(path.sep).join('/');
    if (!rel.startsWith('.')) rel = `./${rel}`;
    return `require('${rel}')`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    count++;
    console.log(file);
  }
}

console.log(`Updated ${count} files`);
