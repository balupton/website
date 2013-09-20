---
title: 'Articles'
layout: 'page'
menuText: 'blog'
menuTitle: 'View articles'
menuOrder: 3
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

# Gist Listing
gists = []
for gist in @feedr.feeds['github-gists'] or []
	continue if gist.public isnt true
	gists.push(
		title: gist.description
		url: gist.html_url
		date: new Date(gist.created_at)
		comments: gist.comments
	)
if gists.length isnt 0
	section '.gists', ->
		h1 'Gists'
		text @partial 'content/document-list.html.coffee', {
				documents: gists
			}