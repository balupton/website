import * as pathUtil from 'path'
import { promises as fs } from 'fs'
import globber from 'fast-glob'
// import mkdirp = require('make-dir')

import { Meta, Link, LinkMap } from '../types/app'
import * as parseMDX from '../tooling/parse-mdx'
import {
	cachePath,
	pagesGlob,
	pagesPath,
	linksPath,
	links,
	linkAliases,
	directoryTags
} from '../config'

const linkMap: LinkMap = {}

async function addAliasLinks() {
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
			const link: Link = {
				...meta,
				alias: false,
				url,
				code: url,
				text: meta.title,
				tags: tags.concat(meta.tags)
			}
			linkMap[link.code] = link
		})
	)
}
async function main() {
	// await mkdirp(cachePath)
	await addDocumentLinks()
	await addAliasLinks()
	// console.log('links', Object.keys(linkMap).join(' '))
	console.log('writing', linksPath)
	await fs.writeFile(linksPath, JSON.stringify(linkMap, null, '  '))
	console.log('wrote', linksPath)
}

try {
	main()
} catch (err) {
	console.error('FAILED!!!')
	throw new Error(err)
}
