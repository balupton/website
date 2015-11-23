# =================================
# Misc Configuration

# Prepare
githubClientId = process.env.BEVRY_GITHUB_CLIENT_ID
githubClientSecret = process.env.BEVRY_GITHUB_CLIENT_SECRET
githubAuthString = "client_id=#{githubClientId}&client_secret=#{githubClientSecret}"
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
				Website of Benjamin Lupton. Founder of Bevry, DocPad and History.js. Aficionado of HTML5, CoffeeScript and NodeJS. Available for consulting, training and talks. ENTP.
				"""
			keywords: """
				balupton, benjamin lupton, lupton, coffeescript, node.js, javascript, history.js, html5, docpad, nowpad, jquery, css3, ruby, git, nosql, cson, html5 history api, ajax, html, web development, web design, nlp, git, neuro-linguistic programming, programming, hacking, hackathon, aloha editor, contenteditable, hallo, jekyll, entp, inventor, web 2.0
				"""

			text:
				heading: "Benjamin Lupton"
				subheading: '''
					<t render="html.coffee">
						text """
							<span>#{@link 'opencollaboration'} Entrepreneur. #{@link 'writer'}. #{@link 'vegan'}.</span>
							<!-- <span>#{@link 'husband'}. Stepdad. #{@link 'agnostic'}. #{@link 'pantheist'}. #{@link 'trich'}.</span> -->
							<span>Founded #{@link 'bevry'}, #{@link 'docpad'}, #{@link 'historyjs'} &amp; #{@link 'hostel'}.</span>
							<span>Aficionado of #{@link 'javascript'}, #{@link 'nodejs'}, #{@link 'html5'} and #{@link 'opensource'}.</span>
							<span>Available for consulting, training and speaking. #{@link 'contact'}.</span>
							"""
					</t>
					'''
				about: '''
					<t render="html.coffee">
						text """
							This website was created with #{@link 'bevry'}’s #{@link 'docpad'} and is #{@link 'source'}
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
				#gauges: '5077ae93f5a1f5067b000028'
				googleAnalytics: 'UA-4446117-1'
				#reinvigorate: '52uel-236r9p108l'

				gittipButton: 'balupton'
				flattrButton: '344188/balupton-on-Flattr'
				paypalButton: 'QB8GQPZAH84N6'

			social:
				"""
				feedly
				gratipay
				flattr
				amazon
				twitter
				linkedin
				facebook
				tumblr
				medium
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
					href: 'http://balupton.tumblr.com/rss'
					title: 'Tumblr Posts'
				,
					href: 'https://medium.com/feed/@balupton'
					title: 'Medium Posts'
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
				husband:
					text: 'Husband'
					url: 'http://h.lupton.cc'
					title: "Helen Lupton is my amazing wife. Learn about Helen on her blog."
				opencollaboration:
					text: 'Open-Collaboration'
					url: 'https://github.com/bevry/goopen'
					title: "Open-Collaboration is the notion that we can all work together freely and liberally to accomplish amazing things. It's what I dedicate my life too. Learn about Open-Collaboration via the Go Open Campaign."
				freeculture:
					text: 'Free Culture'
					url: 'http://en.wikipedia.org/wiki/Free_culture_movement'
					title: 'Free Culture is the notion that everything should be free, in terms of free as in no money needed, and free as in people can re-use it liberally. Learn about Free Culture on Wikipedia.'
				writer:
					text: 'Author'
					url: 'https://gumroad.com/l/vKuF'
					title: '''Author of the mostly likely not the best non-best selling book in cultural literature right now.'''
				vegan:
					text: 'Vegan'
					url: 'http://balupton.com/v'
					title: '''Veganism is the stance that other lives are not ours to own. Vegans commonly associate this with the practice of reducing their harm to all lives, primarily through a strict-vegetarian diet and lifestyle. That's it, nothing special. Learn about what turned me vegan.'''
				agnostic:
					text: 'Agnostic'
					url: 'http://en.wikipedia.org/wiki/Agnostic'
					title: 'Agnosticism is the understanding that one cannot prove the existance or non-existance of something that is not observable, therefore agnostics do not take a theist or athiest stance. Learn about Agnosticism on Wikipedia.'
				pantheist:
					text: 'Pantheist'
					url: 'http://en.wikipedia.org/wiki/Pantheism'
					title: 'Pantheism is a stance that believes the notion of God is synonymous with the notion of the Universe. Learn about Pantheism on Wikipedia.'
				docpad:
					text: 'DocPad'
					url: 'http://docpad.org'
					title: 'DocPad is a static site generator built with Node.js. Learn about DocPad on its website.'
				hostel:
					text: 'Startup Hostel'
					url: 'http://startuphostel.org'
					title: 'Startup Hostel is a co-work and co-live initiative. Learn about Startup Hostel on its website.'
				historyjs:
					text: 'History.js'
					url: 'https://github.com/browserstate/history.js'
					title: 'History.js lets you create cross-browser stateful web applications. Learn about History.js on its website.'
				taskgroup:
					text: 'TaskGroup'
					url: 'https://github.com/bevry/taskgroup'
					title: 'The true solution to callback hell. Robust, simple, and consistent. Group together synchronous and asynchronous tasks and execute them with support for concurrency, naming, and nesting.'
				bevry:
					text: 'Bevry'
					url: 'http://bevry.me'
					title: 'Bevry is the open-company and community that I founded in 2011, it\'s a great thing. Learn about Bevry on its website.'
				webwrite:
					text: 'Web Write'
					url: 'https://github.com/webwrite'
					title: '''Web Write is an open-source initiative to create a series of admin interfaces that work with any backend. Learn more about Web Write on its website.'''
				services:
					text: 'Services'
					url: 'http://bevry.me/services'
					title: '''View my company's services'''
				opensource:
					text: 'Open-Source'
					url: 'http://en.wikipedia.org/wiki/Open-source_software'
					title: 'Open-Source is the releasing of the original format of something so that others can improve on it freely. Learn about Open-Source on Wikipedia.'
				html5:
					text: 'HTML5'
					url: 'http://en.wikipedia.org/wiki/HTML5'
					title: 'HTML5 is the langauge that the content of websites are written in. Learn about HTML5 on Wikipedia.'
				coffeescript:
					text: 'CoffeeScript'
					url: 'http://coffeescript.org'
					title: 'CoffeeScript is a high-level language that compiles to JavaScript. Learn about CoffeeScript on its website.'
				javascript:
					text: 'JavaScript'
					url: 'http://en.wikipedia.org/wiki/JavaScript'
					title: 'JavaScript is the language that makes website interactive. It powers the web. Learn about JavaScript on Wikipedia.'
				nodejs:
					text: 'Node.js'
					url: 'http://nodejs.org/'
					title: 'Node.js is JavaScript on the backend, it lets frontend web developers code web servers and desktop applications. Its really cool. Learn about Node.js on its website.'
				balupton:
					text: 'Benjamin Lupton'
					url: 'http://balupton.com'
					title: 'Visit website'
				author:
					text: 'Benjamin Lupton'
					url: 'http://balupton.com'
					title: 'Visit website'
				source:
					text: 'open-source'
					url: 'https://github.com/balupton/balupton.docpad'
					title: 'View website&apos;s source'
				contact:
					text: 'Contact'
					url: 'mailto:b@bevry.me'
					title: 'Contact me'
					cssClass: 'contact-button'
				trich:
					text: 'Not Alone'
					url: 'http://www.trich.org/about/hair-faqs.html'
					title: '''Along with up to 10% of the population by some estimates, I happen to have trichotillomania (obsessive compulsive hair pulling) that for me, occurs in times of emotional despair, once every few years. It's time the mental illness stigma goes away. Learn about Trichotillomania on the TLC Learning Centre.'''
				poly:
					text: 'Polyamorous'
					url: 'https://en.wikipedia.org/wiki/Polyamory'
					title: 'Polyamory is the practice, desire, or acceptance of intimate relationships that are not exclusive with respect to other sexual or intimate relationships, with knowledge and consent of everyone involved.'
				moneyless:
					text: 'Moneyless Living'
					url: 'http://www.moneylessmanifesto.org'
					title: 'Moneyless living is a life abstaining from direct use of money, instead using excess and natural methods of meeting life\'s demands.'
				lentil:
					text: 'Lentil as Anything'
					url: 'http://lentilasanything.com'
					title: 'Lentil as Anything is a not-for-profit volunteer based pay-what you want restaraunt. It\'s Sydney location is completely vegan, containing a restaraunt and mocktail bar. It\'s a great place to hang out.'
				walk:
					text: 'Bibbulmum Track'
					url: 'https://www.bibbulmuntrack.org.au'
					title: 'The Bibbulmun Track is one of the world’s great long distance walk trails, stretching 1000km from Kalamunda in the Perth Hills, to Albany on the south coast, winding through the heart of the scenic South West of Western Australia.'

		# Link Helper
		link: (code, text, title) ->
			link = @site.links[code]
			renderedLink = """
				<a href="#{link.url}" title="#{title or link.title}" class="#{link.cssClass or ''}">#{text or link.text}</a>
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
			followers = @feedr.feeds['github-profile']?.followers ? null
			return followers or 709
		getStackoverflowReputation: (z=1000) ->
			reputation = @feedr.feeds['stackoverflow-profile']?.items?[0]?.reputation ? null
			return reputation or 20321

		# Project Helpers
		getProjects: ->
			return projects

		# Project Counts
		getGithubCounts: ->
			@githubCounts or= (=>
				projects = @getProjects()
				forks = stars = 0
				total = projects.length

				topUsers = @feedr.feeds['github-top'] ? null
				me = 'balupton'
				rank = 14
				rankAustralia = 0
				contributions = 4554

				for topUser, index in topUsers
					if (topUser.location or '').indexOf('Australia') isnt -1
						++rankAustralia
					if topUser.login is me
						rank = index+1
						contributions = topUser.contributions
						break

				for project in projects
					forks += project.forks
					stars += project.watchers

				rankAustralia or= 1
				total or= 239
				forks or= 2517
				stars or= 15522

				return {forks, stars, projects:total, rank, rankAustralia, contributions}
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
				github_client_id: githubClientId
				github_client_secret: githubClientSecret
			)

			# Fetch repos
			reposGetter.fetchReposFromUsers ['balupton','bevry','docpad','webwrite','browserstate','chainyjs','chainy-plugins','chainy-bundles','interconnectapp','js2coffee'], (err,repos=[]) ->
				# Check
				return next(err)  if err

				# Apply
				projects = repos.sort((a,b) -> b.watchers - a.watchers)
				docpad.log('info', "Fetched your latest projects for display within the website, all #{repos.length} of them")

				# Complete
				return next()

			# Return
			return true

	# =================================
	# Plugin Configuration

	plugins:
		feedr:
			timeout: 60*1000
			feeds:
				'stackoverflow-profile':
					url: 'https://api.stackexchange.com/2.2/users/130638?order=desc&sort=reputation&site=stackoverflow'
					parse: 'json'

				'github-australia-javascript':
					url: "https://api.github.com/legacy/user/search/location:Australia%20language:JavaScript?#{githubAuthString}"
					parse: 'json'
				'github-australia':
					# https://github.com/search?q=location%3AAustralia&type=Users&s=followers
					url: "https://api.github.com/legacy/user/search/location:Australia?#{githubAuthString}"
					parse: 'json'
				'github-gists':
					url: "https://api.github.com/users/balupton/gists?per_page=100&#{githubAuthString}"
					parse: 'json'
				'github-top':
					url: 'https://gist.github.com/paulmillr/4524946/raw/github-users-stats.json'
					parse: 'json'
				'github-profile':
					url: "https://api.github.com/users/balupton?#{githubAuthString}"
					parse: 'json'

				'github':
					url: "https://github.com/balupton.atom"
					parse: 'xml'
				'tumblr':
					url: "http://balupton.tumblr.com/rss"
					parse: 'xml'
				'medium':
					url: "https://medium.com/feed/@balupton"
					parse: 'xml'

				#'flattr':
				#	url: 'https://api.flattr.com/rest/v2/users/balupton/activities.atom'

				#'twitter':
				#	url: "https://api.twitter.com/1/statuses/user_timeline.json?screen_name=balupton&count=20&include_entities=true&include_rts=true"

				'vimeo':
					url: "http://vimeo.com/api/v2/balupton/videos.json"
					parse: 'json'

				'youtube':
					#url: "http://gdata.youtube.com/feeds/base/users/balupton/uploads?alt=json&orderby=published&client=ytapi-youtube-profile"
					url: "http://gdata.youtube.com/feeds/api/playlists/PLYVl5EnzwqsQs0tBLO6ug6WbqAbrpVbNf?alt=json"
					parse: 'json'

				#'flickr':
				#	url: "http://api.flickr.com/services/feeds/photos_public.gne?id=35776898@N00&lang=en-us&format=json"

		cleanurls:
			simpleRedirects:
				# Twitter
				't': 'https://twitter.com/balupton'
				'twitter': '/t'

				# Vegan
				'/v': 'https://github.com/balupton/plant-vs-animal-products/blob/master/README.md#readme'
				'/vegan': '/v'
				'/vegetarian': '/v'

				# Sustainability
				'/s': 'http://balupton.tumblr.com/post/79542013417/sustainability'
				'/sustainability': '/s'
				
				# Books
				'/bookupdates': 'https://confirmsubscription.com/h/r/36CE01ACCFE65688'
				'/books': '/bookupdates'
				'/book': '/bookupdates'

			advancedRedirects: [
				# Old URLs
				[/^https?:\/\/(?:www\.balupton\.com|(?:www\.)?lupton\.cc|balupton\.herokuapp\.com|balupton\.github\.io\/website)(.*)$/, 'https://balupton.com$1']

				# Demos
				[/^\/sandbox(?:\/([^\/]+).*)?$/, 'http://balupton.github.io/$1/demo/']

				# Projects
				[/^\/(?:projects?\/|(?:g|gh|github)\/?)(.*)$/, 'https://github.com/balupton/$1']
			]
