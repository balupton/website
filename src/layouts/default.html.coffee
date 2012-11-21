---
title: 'Benjamin Lupton'
---

# Prepare
links =
	docpad: '<a href="http://docpad.org" title="Visit Website">DocPad</a>'
	hostel: '<a href="http://startuphostel.org" title="Visit Website">Startup Hostel</a>'
	backbonejs: '<a href="http://backbonejs.org/" title="Visit Website">Backbone.js</a>'
	historyjs: '<a href="http://historyjs.net" title="Visit Website">History.js</a>'
	bevry: '<a href="http://bevry.me" title="Visit Website">Bevry</a>'
	services: '<a href="http://bevry.me/services" title="View my company\'s services">Services</a>'
	opensource: '<a href="http://en.wikipedia.org/wiki/Open-source_software" title="Visit on Wikipedia">Open-Source</a>'
	html5: '<a href="http://en.wikipedia.org/wiki/HTML5" title="Visit on Wikipedia">HTML5</a>'
	javascript: '<a href="http://en.wikipedia.org/wiki/JavaScript" title="Visit on Wikipedia">JavaScript</a>'
	nodejs: '<a href="http://nodejs.org/" title="Visit Website">Node.js</a>'
	balupton: '<a href="http://balupton.com" title="Visit Website">Benjamin Lupton</a>'
	author: '<a href="http://balupton.com" title="Visit Website">Benjamin Lupton</a>'
	source: '<a href="https://github.com/balupton/balupton.docpad" title="View Website Source">open-source</a>'
	cclicense: '<a href="http://creativecommons.org/licenses/by/3.0/" title="Visit Website">Creative Commons Attribution License</a>'
	mitlicense: '<a href="http://creativecommons.org/licenses/MIT/" title="Visit Website">MIT License</a>'
	contact: '<a href="mailto:b@bevry.me" title="Email me">Email</a>'
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

# Site & Document Data
site = @site
documentTitle = if @document.title then "#{@document.title} | #{@site.title}" else @site.title

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
		for feed in feeds
			link
				href: h feed.href
				title: h feed.title
				type: (feed.type or 'application/atom+xml')
				rel: 'alternate'

		# SEO
		title documentTitle
		meta name: 'title', content: documentTitle
		meta name: 'author', content: (@document.author or site.author)
		meta name: 'email', content: (@document.email or site.email)
		meta name: 'description', content: (@document.description or site.description)
		meta name: 'keywords', content: site.keywords.concat(@document.keywords or []).join(', ')

		# Styles
		text  @getBlock('styles').toHTML()
		link rel: 'stylesheet', href: '/styles/style.css', media: 'screen, projection'
		link rel: 'stylesheet', href: '/styles/print.css', media: 'print'
		link rel: 'stylesheet', href: '/vendor/fancybox-2.0.5/jquery.fancybox.css', media: 'screen, projection'
	body ->
		# Heading
		header '.heading', ->
			a href:'/', title:'Return home', ->
				h1 -> 'Benjamin Lupton'
				span '.heading-avatar', ->
			h2 ->
				text """
					Founder of #{links.bevry}, #{links.docpad}, #{links.historyjs}  &amp; #{links.hostel}.<br/>
					Aficionado of #{links.javascript}, #{links.nodejs}, #{links.opensource} and #{links.html5}.<br/>
					Available for consulting, training and speaking. #{links.contact}.
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

		# Promo
		div '.promo.promo-top', ->
			a href:'http://gaaus.tumblr.com/vote', title:'Vote for Benjamin Lupton', ->
				img src:'/images/gatech.gif', width:728, height:90

		# Document
		article '.page',
			'typeof': 'sioc:page'
			about: @document.url
			datetime: @document.date.toISODateString()
			-> @content

		# Promo
		#div '.promo.promo-bottom', ->
		#	a href:'http://gaaus.tumblr.com/vote', title:'Vote for Benjamin Lupton', ->
		#		img src:'/images/gatech.gif', width:728, height:90

		# Footing
		footer '.footing', ->
			p '.about', -> """
				This website was created with #{links.bevry}’s #{links.docpad} and is #{links.source}
				"""
			p '.copyright', -> """
				Unless stated otherwise, all content is licensed under the #{links.cclicense} and code licensed under the #{links.mitlicense}, &copy; #{links.author}
				"""

		# Sidebar
		aside '.sidebar', ->
			# Facebook
			section '.facebook.links', ->
				header ->
					a href: 'https://www.facebook.com/balupton', title: 'Visit my Facebook', ->
						h1 -> 'Facebook'
						img '.icon', src: '/images/facebook.gif'

			# LinkedIn
			section '.linkedin.links', ->
				header ->
					a href: 'http://www.linkedin.com/in/balupton', title: 'Visit my LinkedIn', ->
						h1 -> 'LinkedIn'
						img '.icon', src: '/images/linkedin.png'

			# Github
			section '.github.links', ->
				header ->
					a href: 'https://github.com/balupton', title: 'Visit my Github', ->
						h1 -> 'GitHub'
						img '.icon', src: '/images/github.gif'
				ul ->
					for entry in @feedr.feeds.github.entry
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
					for tweet in @feedr.feeds.twitter
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
					for video,key in @feedr.feeds.vimeo
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
					for image in @feedr.feeds.flickr.items
						li datetime: image.date_taken, ->
							a href: image.link, title: image.title, ->
								img src: @cachr(image.media.m), alt: image.title

		# Scripts
		text @getBlock('scripts').add("""
			/vendor/jquery-1.7.1.js
			/vendor/fancybox-2.0.5/jquery.fancybox.js
			/scripts/script.js""".split('\n')
		).toHTML()

		# Analytics
		analytics = @site.analytics or {}
		if analytics.reinvigorate?
			script src:'http://include.reinvigorate.net/re_.js'
			script """
				reinvigorate.track("#{analytics.reinvigorate}");
				"""
		if analytics.google?
			script """
				var _gaq = _gaq || [];
				_gaq.push(['_setAccount', '#{analytics.google}']);
				_gaq.push(['_trackPageview']);
				(function() {
					var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
					ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
					var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
				})();
				"""
		if analytics.gauges?
			script """
				var _gauges = _gauges || [];
				(function() {
					var t   = document.createElement('script');
					t.type  = 'text/javascript';
					t.async = true;
					t.id    = 'gauges-tracker';
					t.setAttribute('data-site-id', '#{analytics.gauges}');
					t.src = '//secure.gaug.es/track.js';
					var s = document.getElementsByTagName('script')[0];
					s.parentNode.insertBefore(t, s);
				})();
				"""
