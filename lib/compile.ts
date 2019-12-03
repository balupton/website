import pathUtil from 'path'
import { promises as fs } from 'fs'
import globber from 'fast-glob'
import { fetch } from 'fetch-h2'
import mkdirp from 'make-dir'

import { Page, Links } from '../types'
import { parseMDX } from '@bevry/mdx'
import {
	site,
	cachePath,
	pagesGlob,
	pagesPath,
	linksPath,
	directoryTags
} from './config'

const links: Links = Object.assign({}, site.links)

export async function addRemoteLinks() {
	const resp = await fetch('https://editor.bevry.workers.dev/getter?key=links')
	const result = await resp.json()
	Object.keys(result).forEach(function(code) {
		links[code] = result[code]
	})
}

async function addDocumentLinks() {
	process.chdir(pagesPath)
	const paths: string[] = await globber([pagesGlob])
	await Promise.all(
		paths.map(async function(relativePath: string) {
			const absolutePath = pathUtil.resolve(pagesPath, relativePath)
			const directory = pathUtil.basename(pathUtil.dirname(absolutePath))
			const url = '/' + relativePath.replace(/\..+/, '') // trim the extension off
			const src = await fs.readFile(absolutePath, 'utf8')
			const meta: Page = parseMDX(src).meta
			// @ts-ignore
			const tags: string[] = directoryTags[directory] || []
			const link: Page = {
				...meta,
				url,
				name: meta.name || meta.title,
				tags: tags.concat(meta.tags || [])
			}
			links[url] = link
		})
	)
}

async function main() {
	await mkdirp(cachePath)
	await addRemoteLinks()
	await addDocumentLinks()
	console.log('writing', linksPath)
	await fs.writeFile(linksPath, JSON.stringify(links, null, '  '))
	console.log('wrote', linksPath)
}

try {
	main()
} catch (err) {
	console.error('FAILED!!!')
	throw new Error(err)
}
