import { Page, Link, Links } from '../types'

import { site } from './config'

import _links from '../.data/links.json'
export const links = _links as Links

export function clean(value: string) {
	return value.replace(/^\/+/, '').replace(/[/#]+$/, '')
}

export function trim(value: string) {
	return value.replace(site.url, '')
}

export function getLink(code: string): Link {
	const link: Link =
		links[site.url + '/' + code] ||
		links[clean(site.url + '/' + code)] ||
		links[code] ||
		links[clean(code)]
	if (!link) throw new Error(`unable to find the link: ${code}`)
	return link
}

export function getLinks(tag: string): Links {
	const result: Links = {}
	for (const code of Object.keys(links)) {
		const link = links[code]
		if (link.tags && link.tags.includes(tag)) result[code] = link
	}
	return result
}

export function getPages(tag: string): Page[] {
	return Object.values(getLinks(tag))
}
