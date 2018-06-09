'use strict'

const h = require('hyperscript')

module.exports = function renderPageLayout (data) {
	const { document } = data
	const { title, url, content } = document

	return [
		document.title
			? h('header.page-header', [
				h('a', { href: url }, [
					h('h1', { property: 'dcterms:title' }, title)
				])
			])
			: '',
		h('div.page-content', { property: 'soic:content' }, content)
	]
}
