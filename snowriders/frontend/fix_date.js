const fs = require('fs');
const path = 'src/pages/ProfilePage.jsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(": '2024'}", ": '...'}" );
fs.writeFileSync(path, content, 'utf8');
console.log('Done');
