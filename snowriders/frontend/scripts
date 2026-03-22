const fs = require('fs');
const filePath = 'src/pages/ProfilePage.jsx';
let content = fs.readFileSync(filePath, 'utf8');
// Replace the '2024' fallback with '...'
const before = content.indexOf("'2024'");
if (before !== -1) {
  content = content.replace("'2024'", "'...'");
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed: replaced 2024 with ...');
} else {
  console.log('Not found - checking content around line 145...');
  const lines = content.split('\n');
  lines.slice(142, 148).forEach((l, i) => console.log(143 + i, JSON.stringify(l)));
}
