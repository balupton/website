'use strict'

const h = require('hyperscript')

module.exports = function renderPostLayout (data) {
	const { document } = data
	const { title, url, content, datePublished } = document

	return [
		document.title
			? h('header.page-header', [
				h('h1', [
					h('a.page-link', { href: url }, [
						h('strong.page-title', { property: 'dcterms:title' }, title),
						h('small.page-data', { property: 'dc:date' }, datePublished.toDateString())
					])
				])
			])
			: '',

		h('div.page-content', { property: 'soic:content' }, content)
	]
}
