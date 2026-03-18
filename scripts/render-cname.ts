import { writeFile } from 'fs';
import { resolve } from 'path';

writeFile(resolve(new URL('.', import.meta.url).pathname, '../docs/.vitepress/dist/CNAME'), 'blog.cinb1314.online', (err) => {
  if (err) {
    console.error(err);
  }
});
