import rawLinkMap from '../.app/links.json'
import {
	Link,
	LinkMap,
	Tag,
	Code,
	LinkCache,
	RawLink,
	RawLinkMap
} from '../types/app'

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

export function getLink(code: Code) {
	return linkMap[code]
}

export function hydrateLink(input: { code?: string }): Link {
	let result: Link
	if (input.code) {
		const link = getLink(input.code)
		if (!link) throw new Error(`No link for: ${input.code}`)
		result = Object.assign({}, link, input)
	} else {
		result = Object.assign({}, input) as Link
	}
	if (!result.url) throw new Error(`No link URL`)
	return result
}
