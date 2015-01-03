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
		# p 'Expirements with Medium, a new writing platform'
		text @partial 'content/document-list.html.coffee', {
				documents: entries
			}

# Tumblr Listing
entries = []
for entry in @feedr.feeds['tumblr']?.channel?.item or []
	entries.push(
		title: entry.title
		url: entry.link
		date: new Date(entry.pubDate)
	)
if entries.length isnt 0
	section '.tumblr', ->
		a href:'http://balupton.tumblr.com', ->
			h1 ->
				'Tumblr'
		# p 'My bookmarks around the web'
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
		# p 'My everyday worthwhile technical snippets and guides'
		text @partial 'content/document-list.html.coffee', {
				documents: entries
			}
