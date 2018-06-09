'use strict'

const h = require('hyperscript')

module.exports = function renderDocumentListing (data) {
	const { documents } = data

	return h('nav.document-list', { typeof: 'dc:collection' }, documents.map(({ url, title, datePublished, description }) =>
		h('li.document', { typeof: 'soic:post', about: url }, [
			h('div.document-header', [
				h('a.document-link', { href: url }, [
					h('strong.document-title', { property: 'dc:title' }, title),
					h('small.document-date', { property: 'dc:date' }, datePublished.toDateString())
				])
			]),
			description
				? h('p.document-description', { property: 'dc:description' }, description)
				: ''
		])
	))
}
