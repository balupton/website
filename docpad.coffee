# =================================
# Misc Configuration

envConfig = process.env
githubAuthString = "client_id=#{envConfig.BALUPTON_GITHUB_CLIENT_ID}&client_secret=#{envConfig.BALUPTON_GITHUB_CLIENT_SECRET}"
getRankInUsers = (users, fallback=null) ->
	rank = null

	for user,index in users
		if user.login is 'balupton'
			rank = String(index+1)
			break

	return fallback  if rank is null

	if rank >= 10 and rank < 20
		rank += 'th'
	else switch rank.substr(-1)
		when '1'
			rank += 'st'
		when '2'
			rank += 'nd'
		when '3'
			rank += 'rd'
		else
			rank += 'th'

	return rank or fallback


# =================================
# DocPad Configuration

module.exports =
	regenerateEvery: 1000*60*60  # hour

	# =================================
	# Template Data
	# These are variables that will be accessible via our templates
	# To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

	templateData:
		# Site Data
		site:
			url: "http://balupton.com"
			title: "Benjamin Lupton"
			author: "Benjamin Lupton"
			email: "b@lupton.cc"
			description: """
				Website of Benjamin Lupton. Founder of Bevry, DocPad and HistoryJS. Aficionado of HTML5, CoffeeScript and NodeJS. Available for consulting, training and talks. ENTP.
				"""
			keywords: """
				balupton, benjamin lupton, lupton, coffeescript, node.js, javascript, history.js, html5, docpad, nowpad, jquery, css3, ruby, git, nosql, cson, html5 history api, ajax, html, web development, web design, nlp, git, neuro-linguistic programming, programming, hacking, hackathon, aloha editor, contenteditable, hallo, jekyll, entp, inventor, web 2.0
				"""

			text:
				heading: "Benjamin Lupton"
				subheading: '''
					<t render="html.coffee">
						link = @getPreparedLink.bind(@)
						text """
							Founder of #{link 'bevry'}, #{link 'docpad'}, #{link 'historyjs'}  &amp; #{link 'hostel'}.<br/>
							Aficionado of #{link 'javascript'}, #{link 'nodejs'}, #{link 'opensource'} and #{link 'html5'}.<br/>
							Available for consulting, training and speaking. #{link 'contact'}.
							"""
					</t>
					'''
				about: '''
					<t render="html.coffee">
						link = @getPreparedLink.bind(@)
						text """
							This website was created with #{link 'bevry'}’s #{link 'docpad'} and is #{link 'source'}
							"""
					</t>
					'''
				copyright: '''
					<t render="html.md">
						Unless stated otherwise; all works are Copyright © 2011+ [Benjamin Lupton](http://balupton.com) and licensed [permissively](http://en.wikipedia.org/wiki/Permissive_free_software_licence) under the [MIT License](http://creativecommons.org/licenses/MIT/) for code and the [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/) for everything else (including content, media and design), enjoy!
					</t>
					'''

			services:
				facebookLikeButton:
					applicationId: '266367676718271'
				facebookFollowButton:
					applicationId: '266367676718271'
					username: 'balupton'
				twitterTweetButton: "balupton"
				twitterFollowButton: "balupton"
				githubFollowButton: "balupton"
				quoraFollowButton: "Benjamin-Lupton"
				disqus: 'balupton'
				gauges: '5077ae93f5a1f5067b000028'
				googleAnalytics: 'UA-4446117-1'
				reinvigorate: '52uel-236r9p108l'

			social:
				"""
				facebook
				linkedin
				github
				twitter
				vimeo
				""".trim().split('\n')

			scripts: """
				/vendor/jquery-1.7.1.js
				/vendor/fancybox-2.0.5/jquery.fancybox.js
				/scripts/script.js
				""".trim().split('\n')

			feeds: [
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

			pages: [
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

			links:
				docpad:
					text: 'DocPad'
					url: 'http://docpad.org'
					title: 'Visit Website'
				hostel:
					text: 'Startup Hostel'
					url: 'http://startuphostel.org'
					title: 'Visit Website'
				backbonejs:
					text: 'Backbone.js'
					url: 'http://backbonejs.org'
					title: 'Visit Website'
				historyjs:
					text: 'History.js'
					url: 'http://historyjs.net'
					title: 'Visit Website'
				bevry:
					text: 'Bevry'
					url: 'http://bevry.me'
					title: 'Visit Website'
				services:
					text: 'Services'
					url: 'http://bevry.me/services'
					title: "View my company's services"
				opensource:
					text: 'Open-Source'
					url: 'http://en.wikipedia.org/wiki/Open-source_software'
					title: 'Visit on Wikipedia'
				html5:
					text: 'HTML5'
					url: 'http://en.wikipedia.org/wiki/HTML5'
					title: 'Visit on Wikipedia'
				javascript:
					text: 'JavaScript'
					url: 'http://en.wikipedia.org/wiki/JavaScript'
					title: 'Visit on Wikipedia'
				nodejs:
					text: 'Node.js'
					url: 'http://nodejs.org/'
					title: 'Visit Website'
				balupton:
					text: 'Benjamin Lupton'
					url: 'http://balupton.com'
					title: 'Visit Website'
				author:
					text: 'Benjamin Lupton'
					url: 'http://balupton.com'
					title: 'Visit Website'
				source:
					text: 'open-source'
					url: 'https://github.com/balupton/balupton.docpad'
					title: 'View Website Source'
				contact:
					text: 'Contact'
					url: 'mailto:b@bevry.me'
					title: 'Contact me'
					cssClass: 'contact-button'

		# Link Helper
		getPreparedLink: (name) ->
			link = @site.links[name]
			renderedLink = """
				<a href="#{link.url}" title="#{link.title}" class="#{link.cssClass or ''}">#{link.text}</a>
				"""
			return renderedLink

		# Meta Helpers
		getPreparedTitle: -> if @document.title then "#{@document.title} | #{@site.title}" else @site.title
		getPreparedAuthor: -> @document.author or @site.author
		getPreparedEmail: -> @document.email or @site.email
		getPreparedDescription: -> @document.description or @site.description
		getPreparedKeywords: -> @site.keywords.concat(@document.keywords or []).join(', ')

		# Ranking Helpers
		getAustraliaJavaScriptRank: ->
			feed = @feedr.feeds['github-australia-javascript']?.users ? null
			return getRankInUsers(feed,'2nd')
		getAustraliaRank: ->
			feed = @feedr.feeds['github-australia']?.users ? null
			return getRankInUsers(feed,'4th')
		getGithubFollowers: (floorToNearest=50) ->
			followers = @feedr.feeds['github-profile']?.followers
			if followers
				result = Math.floor(followers/floorToNearest)*floorToNearest
			else
				result = 250
			return result
		getStackoverflowReputation: (floorToNearest=1000) ->
			reputation = @feedr.feeds['stackoverflow-profile']?.users?[0]?.reputation ? null
			if reputation
				result = Math.floor(reputation/floorToNearest)*floorToNearest
			else
				result = 9000
			return result


	# =================================
	# Collections

	collections:
		pages: ->
			@getCollection('documents').findAllLive({pageOrder:$exists:true},[pageOrder:1])

		posts: ->
			@getCollection('documents').findAllLive({relativeOutDirPath:'blog'},[date:-1])


	# =================================
	# Events

	events:

		serverExtend: (opts) ->
			# Prepare
			docpadServer = opts.server

			# ---------------------------------
			# Server Configuration

			# Redirect Middleware
			docpadServer.use (req,res,next) ->
				if req.headers.host in ['www.balupton.com','lupton.cc','www.lupton.cc','balupton.no.de','balupton.herokuapp.com']
					res.redirect 301, 'http://balupton.com'+req.url
				else
					next()

			# ---------------------------------
			# Server Extensions

			# Demos
			docpadServer.get /^\/sandbox(?:\/([^\/]+).*)?$/, (req, res) ->
				project = req.params[0]
				res.redirect 301, "http://balupton.github.com/#{project}/demo/"
				# ^ github pages don't have https

			# Projects
			docpadServer.get /^\/projects\/(.*)$/, (req, res) ->
				project = req.params[0] or ''
				res.redirect 301, "https://github.com/balupton/#{project}"

			docpadServer.get /^\/(?:g|gh|github)(?:\/(.*))?$/, (req, res) ->
				project = req.params[0] or ''
				res.redirect 301, "https://github.com/balupton/#{project}"

			# Twitter
			docpadServer.get /^\/(?:t|twitter|tweet)(?:\/(.*))?$/, (req, res) ->
				res.redirect 301, "https://twitter.com/balupton"

			# Sharing Feed
			docpadServer.get /^\/feeds?\/shar(e|ing)(?:\/(.*))?$/, (req, res) ->
				res.redirect 301, "http://feeds.feedburner.com/balupton/shared"

			# Feeds
			docpadServer.get /^\/feeds?(?:\/(.*))?$/, (req, res) ->
				res.redirect 301, "http://feeds.feedburner.com/balupton"


	# =================================
	# Plugin Configuration

	plugins:
		feedr:
			feeds:
				'stackoverflow-profile':
					url: 'http://api.stackoverflow.com/1.0/users/130638/'
				'github-australia-javascript':
					url: "https://api.github.com/legacy/user/search/location:Australia%20language:JavaScript?#{githubAuthString}"
				'github-australia':
					url: "https://api.github.com/legacy/user/search/location:Australia?#{githubAuthString}"
					# https://github.com/search?q=location%3AAustralia&type=Users&s=followers
				'github-profile':
					url: "https://api.github.com/users/balupton?#{githubAuthString}"
				'balupton-projects':
					url: "https://api.github.com/users/balupton/repos?per_page=100&#{githubAuthString}"
				'bevry-projects':
					url: "https://api.github.com/users/bevry/repos?per_page=100&#{githubAuthString}"
				'browserstate-projects':
					url: "https://api.github.com/users/browserstate/repos?per_page=100&#{githubAuthString}"
				'docpad-projects':
					url: "https://api.github.com/users/docpad/repos?per_page=100&#{githubAuthString}"
				'github':
					url: "https://github.com/balupton.atom"
				'twitter':
					url: "https://api.twitter.com/1/statuses/user_timeline.json?screen_name=balupton&count=20&include_entities=true&include_rts=true"
				'vimeo':
					url: "http://vimeo.com/api/v2/balupton/videos.json"
				#'flickr':
				#	url: "http://api.flickr.com/services/feeds/photos_public.gne?id=35776898@N00&lang=en-us&format=json"

