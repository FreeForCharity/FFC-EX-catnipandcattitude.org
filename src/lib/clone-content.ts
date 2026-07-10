import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

/**
 * Load a faithfully-cloned page fragment (the live site's design + content,
 * captured under src/clone-content/). Asset references are stored with a
 * `%%BASE%%` token so the correct GitHub Pages basePath is substituted at
 * build time — keeping the raw markup out of the assetPath() drift scan while
 * still resolving on subpath deploys.
 */
export function loadCloneContent(name: string): string {
  const raw = readFileSync(join(process.cwd(), 'src', 'clone-content', `${name}.html`), 'utf8')
  return raw.split('%%BASE%%').join(basePath)
}
