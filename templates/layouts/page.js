'use strict'

const h = require('hyperscript')

const renderDefaultLayout = require('./default.js')

module.exports = function renderPageLayout (data, content) {
	const { document } = data
	const { title, url } = document
	content = content || document.content

	const result = h('div', [
		document.title
			? h('header.page-header', [
				h('a', { href: url }, [
					h('h1', { property: 'dcterms:title' }, title)
				])
			])
			: '',
		h('div.page-content', { property: 'soic:content', innerHTML: content })
	])

	return renderDefaultLayout(data, result)
}
