'use strict'

const h = require('hyperscript')

module.exports = function postLayout (data) {
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

		/*
		h('footer.page-footer', [
			h('section.page-subscribe.social-buttons', renderSocialButtons),

			# Related Posts
			relatedPosts = []
			for document in @document.relatedDocuments or []
			if document.url.indexOf('/blog') is 0 and document.url.indexOf('/blog/index') isnt 0
			relatedPosts.push(document)
			if relatedPosts.length
			section '.related-documents', ->
			h2 -> 'Related Posts'
			text @partial 'content/document-list', {
			documents: relatedPosts
			}

			h('section.page-comments', renderDisqus())
		])
		*/
	]
}
