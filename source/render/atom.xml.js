'use strict'

const h = require('hyperscript')

module.exports = function renderAtomFeed (data) {

	const { site, documents } = data

	return (
		'<?xml version="1.0" encoding="utf-8"?>' +
		h('feed', { xmlns: 'http://www.w3.org/2005/Atom' }, [
			h('title', site.title),
			h('subtitle', site.description),
			h('link', { rel: 'self', href: 'https://balupton.com/atom.xml' }),
			h('link', { href: 'https://balupton.com' }),
			h('updated', (new Date()).toISOString()),
			h('id', site.url),
			h('author', [
				h('name', site.author)
			]),
			documents.map(({ title, url, datePublished, content }) =>
				h('entry', [
					h('title', title),
					h('link', { href: site.url + url }),
					h('updated', datePublished.toISOString()),
					h('id', site.url + url),
					h('content', { type: 'html' }, content)
				])
			)
		]).outerHTML
	)
}
