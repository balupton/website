###
title: 'Articles'
layout: 'page'
menuText: 'blog'
menuTitle: 'View articles'
menuOrder: 3
###

# Posts
posts = []

## Local
for document in @getCollection('posts').toJSON()
	posts.push(document)

## Medium
for entry in @feedr.feeds['medium']?.channel?.item or []
	posts.push(
		title: entry.title
		url: entry.link
		date: new Date(entry.pubDate)
	)

## Render
if posts.length isnt 0
	text @partial('content/document-list.html.coffee', {
		documents: posts.sort((a,b) -> b.date.getTime() - a.date.getTime())
	})

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
		a href:'https://gist.github.com/balupton', ->
			h1 ->
				'Gists'
		# p 'My everyday worthwhile technical snippets and guides'
		text @partial('content/document-list.html.coffee', {
			documents: gists
		})
