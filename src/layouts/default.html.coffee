---
title: 'Benjamin Lupton'
---

# Prepare
documentTitle = @getPreparedTitle()

# HTML
doctype 5
html lang: 'en', ->
	head ->
		# Standard
		meta charset: 'utf-8'
		meta 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1'
		meta 'http-equiv': 'content-type', content: 'text/html; charset=utf-8'
		meta name: 'viewport', content: 'width=device-width, initial-scale=1'
		text  @getBlock('meta').toHTML()

		# Feed
		for feed in @site.feeds
			link
				href: h feed.href
				title: h feed.title
				type: (feed.type or 'application/atom+xml')
				rel: 'alternate'

		# SEO
		title documentTitle
		meta name: 'title', content: documentTitle
		meta name: 'author', content: @getPreparedAuthor()
		meta name: 'email', content: @getPreparedEmail()
		meta name: 'description', content: @getPreparedDescription()
		meta name: 'keywords', content: @getPreparedKeywords()

		# Styles
		text  @getBlock('styles').toHTML()
		link rel: 'stylesheet', href: '/styles/style.css', media: 'screen, projection'
		link rel: 'stylesheet', href: '/styles/print.css', media: 'print'
		link rel: 'stylesheet', href: '/vendor/fancybox-2.0.5/jquery.fancybox.css', media: 'screen, projection'
	body ->
		# Modals
		aside '.modal.contact', -> @partial('content/contact')
		aside '.modal.backdrop', ->

		# Heading
		header '.heading', ->
			a href:'/', title:'Return home', ->
				h1 -> @site.text.heading
				span '.heading-avatar', ->
			h2 -> @site.text.subheading

		# Pages
		nav '.pages', ->
			ul ->
				for page in @site.pages
					match = page.match or page.url
					cssname = if @document.url.indexOf(match) is 0 then 'active' else 'inactive'
					li 'class':cssname, ->
						a href:page.url, ->
							page.label

		# Document
		article '.page',
			'typeof': 'sioc:page'
			about: @document.url
			datetime: @document.date.toISOString()
			-> @content

		# Footing
		footer '.footing', ->
			div '.about', -> @site.text.about
			div '.copyright', -> @site.text.copyright

		# Sidebar
		aside '.sidebar', ->
			# Social
			text @partial("social/#{social}", @)  for social in @site.social

		# Scripts
		text @getBlock('scripts').add(@site.scripts).toHTML()
