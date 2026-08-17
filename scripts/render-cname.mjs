import { writeFile } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = dirname(fileURLToPath(import.meta.url))
writeFile(resolve(dir, '../docs/.vitepress/dist/CNAME'), 'blog.ddxd.fashion', (err) => {
  if (err) console.error(err)
})
