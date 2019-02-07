import {
	Link,
	LinkMap,
	Tag,
	LinkCode,
	LinkCache,
	RawLink,
	RawLinkMap
} from '../types/app'

import rawLinkMap from '../.app/links.json'

function hydrateRawLink(link: RawLink) {
	if (link.date) link.date = new Date(link.date)
	return link as Link
}
function hydrateRawLinkMap(links: RawLinkMap) {
	Object.keys(links).forEach(function(code) {
		const link = links[code]
		hydrateRawLink(link)
	})
	return links as LinkMap
}

const linkMap: LinkMap = hydrateRawLinkMap(rawLinkMap)
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
