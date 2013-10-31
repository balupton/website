# =================================
# Misc Configuration

# Prepare
githubAuthString = "client_id=#{process.env.GITHUB_CLIENT_ID}&client_secret=#{process.env.GITHUB_CLIENT_SECRET}"
projects = []
reposGetter = null

# -------------------------------------
# Helpers

getRankInUsers = (users=[]) ->
	rank = null

	for user,index in users
		if user.login is 'balupton'
			rank = String(index+1)
			break

	return rank

suffixNumber = (rank) ->
	rank = String(rank)

	if rank
		if rank >= 1000
			rank = rank.substring(0,rank.length-3)+','+rank.substr(-3)
		else if rank >= 10 and rank < 20
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

	return rank

floorToNearest = (value,floorToNearest) ->
	result = Math.floor(value/floorToNearest)*floorToNearest


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
			version: require('./package.json').version
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
							#{link 'opencollaboration'} Entrepreneur. Husband. Stepdad. #{link 'vegan'}. #{link 'pantheist'}. #{link 'agnostic'}.<br/>
							Founded #{link 'bevry'}, #{link 'docpad'}, #{link 'historyjs'}, #{link 'webwrite'} &amp; #{link 'hostel'}.<br/>
							Aficionado of #{link 'javascript'}, #{link 'coffeescript'}, #{link 'nodejs'}, #{link 'html5'} and #{link 'opensource'}.<br/>
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

				gittipButton: 'balupton'
				flattrButton: '344188/balupton-on-Flattr'
				paypalButton: 'QB8GQPZAH84N6'

			social:
				"""
				feedly
				gittip
				flattr
				twitter
				facebook
				linkedin
				github
				youtube
				vimeo
				""".trim().split('\n')

			styles: []  # embedded in layout

			scripts: """
				/vendor/jquery.js
				/vendor/fancybox/jquery.fancybox.js
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

			links:
				opencollaboration:
					text: 'Open-Collaboration'
					url: 'https://github.com/bevry/goopen'
					title: 'Learn more'
				freeculture:
					text: 'Free Culture'
					url: 'http://en.wikipedia.org/wiki/Free_culture_movement'
					title: 'Learn more on Wikipedia'
				vegan:
					text: 'Vegan'
					url: 'https://gist.github.com/balupton/6633207'
					title: 'Learn why I went vegan'
				agnostic:
					text: 'Agnostic'
					url: 'http://en.wikipedia.org/wiki/Agnostic'
					title: 'Learn more on Wikipedia'
				pantheist:
					text: 'Pantheist'
					url: 'http://en.wikipedia.org/wiki/Pantheism'
					title: 'Learn more on Wikipedia'
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
				webwrite:
					text: 'Web Write'
					url: 'https://github.com/webwrite'
					title: 'Visit Website'
				services:
					text: 'Services'
					url: 'http://bevry.me/services'
					title: "View my company's services"
				opensource:
					text: 'Open-Source'
					url: 'http://en.wikipedia.org/wiki/Open-source_software'
					title: 'Learn more on Wikipedia'
				html5:
					text: 'HTML5'
					url: 'http://en.wikipedia.org/wiki/HTML5'
					title: 'Learn more on Wikipedia'
				coffeescript:
					text: 'CoffeeScript'
					url: 'http://coffeescript.org'
					title: 'Visit Website'
				javascript:
					text: 'JavaScript'
					url: 'http://en.wikipedia.org/wiki/JavaScript'
					title: 'Learn more on Wikipedia'
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
		suffixNumber: suffixNumber
		floorToNearest: floorToNearest
		getAustraliaJavaScriptRank: ->
			feed = @feedr.feeds['github-australia-javascript']?.users ? null
			return getRankInUsers(feed) or 2
		getAustraliaRank: ->
			feed = @feedr.feeds['github-australia']?.users ? null
			return getRankInUsers(feed) or 4
		getGithubFollowers: (z=50) ->
			followers = @feedr.feeds['github-profile']?.followers or 358
			return followers
		getStackoverflowReputation: (z=1000) ->
			reputation = @feedr.feeds['stackoverflow-profile']?.users?[0]?.reputation ? 10746
			return reputation

		# Project Helpers
		getProjects: ->
			return projects

		# Project Counts
		getGithubCounts: ->
			@githubCounts or= (=>
				projects = @getProjects()
				forks = stars = 0
				total = projects.length

				top = @feedr.feeds['github-top'] ? null
				topData = /\#([0-9]+).+?balupton.+?([0-9]+)/.exec(top)
				rank = topData?[1] or 23
				contributions = topData?[2] or 3582

				for project in projects
					forks += project.forks
					stars += project.watchers

				total or= 136
				forks or= 1057
				stars or= 8024

				return {forks, stars, projects:total, rank, contributions}
			)()


	# =================================
	# Collections

	collections:
		pages: ->
			@getCollection('documents').findAllLive({menuOrder:$exists:true},[menuOrder:1])

		posts: ->
			@getCollection('documents').findAllLive({relativeOutDirPath:'blog'},[date:-1])


	# =================================
	# Events

	events:

		# Fetch Projects
		generateBefore: (opts,next) ->
			# Prepare
			docpad = @docpad

			# Log
			docpad.log('info', 'Fetching your latest projects for display within the website')

			# Prepare repos getter
			reposGetter ?= require('getrepos').create(
				log: docpad.log
				github_client_id: process.env.GITHUB_CLIENT_ID
				github_client_secret: process.env.GITHUB_CLIENT_SECRET
			)

			# Fetch repos
			reposGetter.fetchReposFromUsers ['balupton','bevry','docpad','webwrite','browserstate'], (err,repos=[]) ->
				# Check
				return next(err)  if err

				# Apply
				projects = repos.sort((a,b) -> b.watchers - a.watchers)
				docpad.log('info', "Fetched your latest projects for display within the website, all #{repos.length} of them")

				# Complete
				return next()

			# Return
			return true

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
			timeout: 60*1000
			feeds:
				'stackoverflow-profile':
					url: 'http://api.stackoverflow.com/1.0/users/130638/'
				'github-australia-javascript':
					url: "https://api.github.com/legacy/user/search/location:Australia%20language:JavaScript?#{githubAuthString}"
				'github-australia':
					url: "https://api.github.com/legacy/user/search/location:Australia?#{githubAuthString}"
					# https://github.com/search?q=location%3AAustralia&type=Users&s=followers
				'github-gists':
					url: "https://api.github.com/users/balupton/gists?per_page=100&#{githubAuthString}"
				'github-top':
					url: 'https://gist.github.com/paulmillr/2657075/raw/active.md'
				'github-profile':
					url: "https://api.github.com/users/balupton?#{githubAuthString}"
				#'flattr':
				#	url: 'https://api.flattr.com/rest/v2/users/balupton/activities.atom'
				'github':
					url: "https://github.com/balupton.atom"
				'medium':
					url: "https://medium.com/feed/@balupton"
				#'twitter':
				#	url: "https://api.twitter.com/1/statuses/user_timeline.json?screen_name=balupton&count=20&include_entities=true&include_rts=true"
				'vimeo':
					url: "http://vimeo.com/api/v2/balupton/videos.json"
				'youtube':
					#url: "http://gdata.youtube.com/feeds/base/users/balupton/uploads?alt=json&orderby=published&client=ytapi-youtube-profile"
					url: "http://gdata.youtube.com/feeds/api/playlists/PLYVl5EnzwqsQs0tBLO6ug6WbqAbrpVbNf?alt=json"
				#'flickr':
				#	url: "http://api.flickr.com/services/feeds/photos_public.gne?id=35776898@N00&lang=en-us&format=json"

