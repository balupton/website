---
title: 'Articles'
layout: 'page'
---

# Post Listing
posts = []
for document in (@documents or [])
	if document.url.indexOf('/blog') is 0 and document.url.indexOf('/blog/index') isnt 0
		posts.push(document)
if posts.length
	text @partial 'document-list.html.coffee', {
		documents: posts
	}