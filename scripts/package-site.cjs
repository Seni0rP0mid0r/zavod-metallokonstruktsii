'use strict';
// Copy only public site files; never traverse the workspace or include credentials.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const entries = ['index.html', 'page.html', 'css', 'js', 'assets'];
fs.mkdirSync(output, { recursive: true });
function copyPublic(source, target) {
  const info = fs.lstatSync(source);
  if (info.isSymbolicLink()) throw new Error('Symlinks are not allowed in the public package: ' + source);
  const name = path.basename(source);
  if (name.startsWith('.') || /\.(?:env|pem|key)$/i.test(name) || name.toLowerCase() === 'secrets') return;
  if (info.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const child of fs.readdirSync(source)) copyPublic(path.join(source, child), path.join(target, child));
  } else {
    fs.copyFileSync(source, target);
  }
}
for (const name of entries) copyPublic(path.join(root, name), path.join(output, name));
fs.writeFileSync(path.join(output, '.nojekyll'), '');
console.log('Static site package: ' + output);
