import { writeFile } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = dirname(fileURLToPath(import.meta.url))
writeFile(resolve(dir, '../docs/.vitepress/dist/CNAME'), 'blog.cinb1314.online', (err) => {
  if (err) console.error(err)
})
