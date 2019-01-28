import { Link, LinkMap, Tag, LinkCode, LinkCache } from '../types/app'

import _linkMap from '../.app/links.json'

const linkMap: LinkMap = _linkMap
const cache: LinkCache = {}

export function getLinksByTag(tag: Tag) {
	if (cache[tag]) return cache[tag]
	const results: Link[] = []
	Object.keys(linkMap).forEach(function(code: string) {
		const link = linkMap[code] as Link
		if (!link.alias && link.tags.includes(tag)) results.push(link)
	})
	cache[tag] = results
	return results
}

export function getLink(code: LinkCode) {
	return linkMap[code]
}
