'use strict'

const h = require('hyperscript')

const renderDocumentListing = require('../partials/document-list.js')

module.exports = function renderBlog (data) {

	const { site, articles, gists } = data

	return [
		renderDocumentListing({
			documents: articles
		}),
		h('section.gists', [
			h('a', { href: 'https://gist.github.com/balupton' }, [
				h('h1', 'Gists')
			]),
			renderDocumentListing({
				documents: gists
			})
		])
	]
