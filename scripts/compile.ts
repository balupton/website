import { Meta, Link, LinkMap } from '../types/app'

import * as pathUtil from 'path'
import { promises as fs } from 'fs'
import * as parseMDX from '../tooling/parse-mdx'
import globber from 'fast-glob'
import * as mkdirp from 'make-dir'

import { links, linkAliases, directoryTags } from '../config'

const cachePath = pathUtil.join(__dirname, '..', '.app')
const linksPath = pathUtil.join(__dirname, '..', '.app', 'links.json')
const pagesPath = pathUtil.join(__dirname, '..', 'pages')
const pagesGlob = '**/*.mdx'

const linkMap: LinkMap = {}

async function addUserLinks() {
	Object.keys(links).forEach(function(code) {
		const link = links[code] as Link
		link.code = code
		link.alias = false
		if (!link.tags) link.tags = []
		linkMap[code] = link
	})
	Object.keys(linkAliases).forEach(function(alias) {
		const code = linkAliases[alias]
		const link = linkMap[code]
		if (!link) throw new Error(`Could not find link: ${code}`)
		linkMap[alias] = Object.assign({}, link, { alias: true })
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
			const meta: Meta = parseMDX(src).meta
			const tags = directoryTags[directory] || []
			meta.tags.push(...tags)
			const link: Link = {
				alias: false,
				url,
				code: url,
				text: meta.title,
				...meta
			}
			linkMap[link.code] = link
		})
	)
}
async function main() {
	await mkdirp(cachePath)
	await addDocumentLinks()
	await addUserLinks()
	await fs.writeFile(linksPath, JSON.stringify(linkMap, null, '  '))
}

main()
