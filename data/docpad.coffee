# =================================
# Misc Configuration

# Prepare
githubClientId = process.env.BEVRY_GITHUB_CLIENT_ID
githubClientSecret = process.env.BEVRY_GITHUB_CLIENT_SECRET
githubAuthString = "client_id=#{githubClientId}&client_secret=#{githubClientSecret}"
amazonCode = 'balupton07-20'
projects = []
reposGetter = null

# Cycle through links
socialLinks = []
referralLinks = []
simpleRedirects = {}
for own key,value of links
	# Fix aliases
	if typeof value is 'string'
		value = links[key] = links[value]
		unless value
			throw new Error("Could not find link alias #{value} for #{key}")
	else
		value.code = key

		# Sub Classes
		socialLinks.push(value)  if value.social
		referralLinks.push(value)  if value.referral

	# Add simple redirect
	simpleRedirects['/'+key] = value.url


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
			url: "https://balupton.com"
			title: "Benjamin Lupton"
			author: "Benjamin Lupton"
			email: "b@lupton.cc"
			description: """
				Website of Benjamin Lupton. Founder of Bevry, DocPad and History.js. Web developer for 10 years. Now a trader. Studies psychology and philosophy.
				"""
			keywords: """
				balupton, benjamin lupton, lupton, coffeescript, node.js, javascript, history.js, html, docpad, nowpad, jquery, css3, ruby, git, nosql, cson, html5 history api, ajax, html, web development, web design, nlp, git, neuro-linguistic programming, programming, hacking, hackathon, aloha editor, contenteditable, hallo, jekyll, entp, inventor, web 2.0
				"""

			text:
				heading: "Benjamin Lupton"
				subheading: '''
					<t render="html.coffee">
						text """
							<span>Founded #{@link 'bevry'}, #{@link 'docpad'}, and #{@link 'hostel'}.</span>
							<span>Accomplished in #{@link 'javascript'}, #{@link 'nodejs'}, #{@link 'webeng', 'Web Development'} and #{@link 'opensource'}.</span>
							<span>Enthusiast of #{@link 'quantitativepsychology'}, #{@link 'philosophy'} and #{@link 'trading'}.</span>
							<span>Available for consulting, training and speaking. #{@link 'contact'}. #{@link 'referrals'}.</span>
							"""
					</t>
					'''
				about: '''
					<t render="html.coffee">
						text """
							This website was created with #{@link 'bevry'}’s #{@link 'docpad'} and is #{@link 'source', 'open-source'}
							"""
					</t>
					'''
				copyright: '''
					<t render="html.md">
						Unless stated otherwise; all works are Copyright © 2011+ [Benjamin Lupton](http://balupton.com) and licensed [permissively](http://en.wikipedia.org/wiki/Permissive_free_software_licence) under the [MIT License](http://creativecommons.org/licenses/MIT/) for code and the [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/) for everything else (including content, media and design), enjoy!
					</t>
					'''

			services:
				disqus: 'balupton'

			# Links
			social: socialLinks  # b/c
			socialLinks: socialLinks
			referralLinks: referralLinks

			styles: [
				"//cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css"
				"/styles/style.css"
			]

			scripts: [
				"//cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js"
				"/scripts/script.js"
			]

			links: links

		# Link Helper
		link: (code, text, title) ->
			link = @site.links[code.toLowerCase()]
			throw new Error("The link #{code} was not found!")  unless link

			title or= link.title
			text or= link.text

			attributes = []
			attributes.push('style="color: ' + link.color + ' !important"')  if link.color
			attributes.push('class="' + link.cssClass + '"')  if link.cssClass
			attributes.push('title="' + title + '"')  if title
			attributes.push('href="' + link.url + '"')  if link.url
			attrs = attributes.join(' ')

			return "<a #{attrs}>#{text}</a>"

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
				'medium':
					url: "https://medium.com/feed/ephemeral-living"
					parse: 'xml'

		cleanurls:
			simpleRedirects: simpleRedirects

			advancedRedirects: [
				# Old URLs
				[/^https?:\/\/(?:www\.balupton\.com|(?:www\.)?lupton\.cc|balupton\.herokuapp\.com|balupton\.github\.io\/website)(.*)$/, 'https://balupton.com$1']

				# Demos
				[/^\/sandbox(?:\/([^\/]+).*)?$/, 'https://balupton.github.io/$1/demo/']

				# Projects
				[/^\/(?:projects?\/|(?:g|gh|github)\/?)(.+)$/, 'https://github.com/balupton/$1']

				# Amazon
				[/^\/amazon\/(.+)/, "https://read.amazon.com/kp/embed?asin=$1&tag=#{amazonCode}"]
			]
