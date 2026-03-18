const { writeFile } = require('fs');
const { resolve } = require('path');

writeFile(resolve(__dirname, '../docs/.vitepress/dist/CNAME'), 'blog.cinb1314.online', (err) => {
  if (err) {
    console.error(err);
  }
});
