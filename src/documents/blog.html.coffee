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

# Medium Listing
entries = []
for entry in @feedr.feeds['medium']?.channel?.item or []
	entries.push(
		title: entry.title
		url: entry.link
		date: new Date(entry.pubDate)
	)
if entries.length isnt 0
	section '.medium', ->
		a href:'http://medium.com/@balupton', ->
			h1 ->
				'Medium'
		text @partial 'content/document-list.html.coffee', {
				documents: entries
			}

# Gist Listing
entries = []
for gist in @feedr.feeds['github-gists'] or []
	continue if gist.public isnt true
	entries.push(
		title: gist.description
		url: gist.html_url
		date: new Date(gist.created_at)
		comments: gist.comments
	)
if entries.length isnt 0
	section '.gists', ->
		a href:'https://gist.github.com/balupton', ->
			h1 ->
				'Gists'
		text @partial 'content/document-list.html.coffee', {
				documents: entries
			}