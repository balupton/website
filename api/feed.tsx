/*
import h from 'hyperscript'
import site from '../lib/site'
import { Documents } from '../lib/types'

interface Props {
	documents: Documents
}

export default function AtomFeed({ documents }: Props) {
	return (
		'<?xml version="1.0" encoding="utf-8"?>' +
		h('feed', { xmlns: 'http://www.w3.org/2005/Atom' }, [
			h('title', site.title),
			h('subtitle', site.description),
			h('link', { rel: 'self', href: 'https://balupton.com/atom.xml' }),
			h('link', { href: 'https://balupton.com' }),
			h('updated', new Date().toISOString()),
			h('id', site.url),
			h('author', [h('name', site.author)]),
			documents.map(({ title, url, date }) =>
				h('entry', [
					h('title', title),
					h('link', { href: site.url + url }),
					h('updated', new Date(date).toISOString()),
					h('id', site.url + url),
					h('content', { type: 'html' }) // @todo
				])
			)
		]).outerHTML
	)
}
*/
