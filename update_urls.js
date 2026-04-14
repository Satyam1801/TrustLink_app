const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace single quoted fetch calls: 'http://localhost:5000/api/...' -> `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/...`
      content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, "\`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}$1\`");

      // Replace backtick fetch calls: `http://localhost:5000/api/links/${id}` -> `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/links/${id}`
      content = content.replace(/`http:\/\/localhost:5000(.*?)`/g, "\`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}$1\`");
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir(path.join(__dirname, 'client', 'src', 'app'));
console.log('Update complete.');
