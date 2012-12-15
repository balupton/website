---
title: 'Articles'
layout: 'page'
url: '/blog'
urls: ['/blog/','/blog/index.html','/blog.html']
---

# Post Listing
posts = []
for document in @getCollection('posts').toJSON()
	posts.push(document)
if posts.length
	text @partial 'content/document-list.html.coffee', {
		documents: posts
	}