'use strict'

const h = require('hyperscript')

const renderDefaultLayout = require('./default.js')

module.exports = function renderPostLayout (data, content) {
	const { document } = data
	const { title, url, datePublished } = document
	content = content || document.content

	const result = h('div', [
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

		h('div.page-content', { property: 'soic:content', innerHTML: content })
	])

	return renderDefaultLayout(data, result)
}
