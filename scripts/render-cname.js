const { writeFile } = require('fs');
const { resolve } = require('path');

writeFile(resolve(__dirname, '../docs/.vuepress/dist/CNAME'), 'blog.jxxj.top', (err) => {
  if (err) {
    console.error(err);
  }
});
