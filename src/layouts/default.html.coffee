---
title: 'Benjamin Lupton'
---

# Prepare
links =
	docpad: '<a href="https://github.com/bevry/docpad" title="Visit on GitHub">DocPad</a>'
	historyjs: '<a href="https://github.com/balupton/history.js" title="Visit on GitHub">History.js</a>'
	bevry: '<a href="http://bevry.me" title="Visit Website">Bevry</a>'
	opensource: '<a href="http://en.wikipedia.org/wiki/Open-source_software" title="Visit on Wikipedia">Open-Source</a>'
	html5: '<a href="http://en.wikipedia.org/wiki/HTML5" title="Visit on Wikipedia">HTML5</a>'
	javascript: '<a href="http://en.wikipedia.org/wiki/JavaScript" title="Visit on Wikipedia">JavaScript</a>'
	nodejs: '<a href="http://nodejs.org/" title="Visit Website">Node.js</a>'
	metrouitheme: '<a href="https://github.com/bevry/metro.docpad" title="Visit on GitHub">Metro Theme</a>'
	balupton: '<a href="http://balupton.com" title="Visit Website">Benjamin Lupton</a>'
	author: '<a href="http://balupton.com" title="Visit Website">Benjamin Lupton</a>'
	cclicense: '<a href="http://creativecommons.org/licenses/by/3.0/" title="Visit Website">Creative Commons Attribution License</a>'
	mitlicense: '<a href="http://creativecommons.org/licenses/MIT/" title="Visit Website">MIT License</a>'
pages = [
	url: '/'
	match: '/index'
	label: 'home'
	title: 'Return home'
,
	url: '/projects'
	label: 'projects'
	title: 'View projects'
,
	url: '/blog'
	label: 'blog'
	title: 'View articles'
]

# HTML
doctype 5
html lang: 'en', ->
	head ->
		# Standard
		meta charset: 'utf-8'
		meta 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1'
		meta 'http-equiv': 'content-type', content: 'text/html; charset=utf-8'
		meta name: 'viewport', content: 'width=device-width, initial-scale=1'
		text @blocks.meta.join('')

		# Feed
		feeds = [
			href: 'http://feeds.feedburner.com/balupton.atom'
			title: 'Blog Posts'
		,
			href: 'https://github.com/balupton.atom'
			title: 'GitHub Activity'
		,
			href: 'http://vimeo.com/api/v2/balupton/videos.atom'
			title: 'Vimeo Videos'
		,
			href: 'http://api.flickr.com/services/feeds/photos_public.gne?id=35776898@N00&lang=en-us&format=atom'
			title: 'Flickr Photos'
		,
			href: 'https://api.twitter.com/1/statuses/user_timeline.atom?screen_name=balupton&count=20&include_entities=true&include_rts=true'
			title: 'Tweets'
		]
		for feed in feeds
			link
				href: feed.href
				title: feed.title
				type: (feed.type or 'application/atom+xml')
				rel: 'alternate'

		# Document
		title "#{@document.title} | Benjamin Lupton"
		meta name: 'description', content: @document.description or ''  if @document.description
		meta name: 'author', content: @document.author or ''  if @document.author

		# Styles
		text @blocks.styles.join('')
		link rel: 'stylesheet', href: '/styles/style.css', media: 'screen, projection'
		link rel: 'stylesheet', href: '/styles/print.css', media: 'print'
		link rel: 'stylesheet', href: '/vendor/fancybox-2.0.5/jquery.fancybox.css', media: 'screen, projection'
	body ->
		# Sidebar
		aside '.sidebar', ->
			# Twitter
			section '.facebook.links', ->
				header ->
					a href: 'https://www.facebook.com/balupton', title: 'Visit my Facebook', ->
						h1 -> 'Facebook'
						img '.icon', src: '/images/facebook.gif'

			# Github
			section '.github.links', ->
				header ->
					a href: 'https://github.com/balupton', title: 'Visit my Github', ->
						h1 -> 'Github'
						img '.icon', src: '/images/github.gif'
				ul ->
					for entry in @feeds.github.entry
						li datetime: entry.published, ->
							a href: entry.link['@'].href, title: "View on Github", ->
								entry.title['#']

			# Twitter
			section '.twitter.links', ->
				header ->
					a href: 'https://twitter.com/#!/balupton', title: 'Visit my Twitter', ->
						h1 -> 'Twitter'
						img '.icon', src: '/images/twitter.gif'
				ul ->
					for tweet in @feeds.twitter
						continue  if tweet.in_reply_to_user_id
						li datetime: tweet.created_at, ->
							a href: "https://twitter.com/#!/#{tweet.user.screen_name}/status/#{tweet.id_str}", title: "View on Twitter", ->
								tweet.text

			# Vimeo
			section '.vimeo.images', ->
				header ->
					a href: 'https://vimeo.com/balupton', title: 'Visit my Vimeo', ->
						h1 -> 'Vimeo'
						img '.icon', src: '/images/vimeo.gif'
				ul ->
					for video,key in @feeds.vimeo
						li datetime: video.upload_date, ->
							a href: video.url, title: video.title, 'data-height': video.height, 'data-width': video.width, ->
								img src: @cachr(video.thumbnail_medium), alt: video.title

			# Flickr
			section '.flickr.images', ->
				header ->
					a href: 'http://www.flickr.com/people/balupton/', title: 'Visit my Flickr', ->
						h1 -> 'Flickr'
						img '.icon', src: '/images/flickr.gif'
				ul ->
					for image in @feeds.flickr.items
						li datetime: image.date_taken, ->
							a href: image.link, title: image.title, ->
								img src: @cachr(image.media.m), alt: image.title

		# Heading
		header '.heading', ->
			a href:'/', title:'Return home', ->
				h1 -> 'Benjamin Lupton'
			h2 ->
				text """
					Founder of #{links.bevry}, #{links.historyjs} &amp; #{links.docpad}.<br/>
					#{links.opensource} leader, #{links.html5}, #{links.javascript} and #{links.nodejs} expert.<br/>
					Available for consulting, training and talks. Hire.
				"""

		# Pages
		nav '.pages', ->
			ul ->
				for page in pages
					match = page.match or page.url
					cssname = if @document.url.indexOf(match) is 0 then 'active' else 'inactive'
					li 'class':cssname, ->
						a href:page.url, ->
							page.label

		# Document
		article '.page',
			'typeof': 'sioc:page'
			about: @document.url
			datetime: @document.date.toISODateString()
			-> @content

		# Footing
		footer '.footing', ->
			p '.about', -> """
				This website was created with #{links.bevry}’s #{links.docpad} using the #{links.metrouitheme} by #{links.balupton}
			"""
			p '.copyright', -> """
				Unless stated otherwise, all content is licensed under the #{links.cclicense} and code licensed under the #{links.mitlicense}, &copy; #{links.author}
			"""

		# Scripts
		text @blocks.scripts.join('')
		script src: '/vendor/jquery-1.7.1.js'
		script src: '/vendor/modernizr-2.5.3.js'
		script src: '/vendor/underscore-1.3.1.js'
		script src: '/vendor/backbone-0.9.1.js'
		script src: '/vendor/fancybox-2.0.5/jquery.fancybox.js'
		script src: '/scripts/script.js'
