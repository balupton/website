# =================================
# Misc Configuration

envConfig = process.env


# =================================
# DocPad Configuration

module.exports =
	regenerateEvery: 1000*60*60  # hour

	# =================================
	# Template Data
	# These are variables that will be accessible via our templates
	# To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

	templateData:
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
			analytics:
				reinvigorate: "52uel-236r9p108l"
				google: "UA-4446117-1"
				gauges: "5077ae93f5a1f5067b000028"

	# =================================
	# Collections

	collections:
		posts: (database) ->
			database.findAllLive({relativeOutDirPath:'blog'},[date:-1])


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
			docpadServer.get /^\/(?:t|twitter|tweet)\/?.*$/, (req, res) ->
				res.redirect 301, "https://twitter.com/balupton"

			# Sharing Feed
			docpadServer.get /^\/feeds?\/shar(e|ing)?.*$/, (req, res) ->
				res.redirect 301, "http://feeds.feedburner.com/balupton/shared"

			# Feeds
			docpadServer.get /^\/feeds?\/?.*$/, (req, res) ->
				res.redirect 301, "http://feeds.feedburner.com/balupton"


	# =================================
	# Plugin Configuration

	plugins:
		marked:
			markedOptions:
				sanitize: false
		feedr:
			feeds:
				'balupton-projects':
					url: "https://api.github.com/users/balupton/repos?client_id=#{envConfig.BALUPTON_GITHUB_CLIENT_ID}&client_secret=#{envConfig.BALUPTON_GITHUB_CLIENT_SECRET}"
				'bevry-projects':
					url: "https://api.github.com/users/bevry/repos?client_id=#{envConfig.BALUPTON_GITHUB_CLIENT_ID}&client_secret=#{envConfig.BALUPTON_GITHUB_CLIENT_SECRET}"
				github:
					url: "https://github.com/balupton.atom"
				twitter:
					url: "https://api.twitter.com/1/statuses/user_timeline.json?screen_name=balupton&count=20&include_entities=true&include_rts=true"
				vimeo:
					url: "http://vimeo.com/api/v2/balupton/videos.json"
				flickr:
					url: "http://api.flickr.com/services/feeds/photos_public.gne?id=35776898@N00&lang=en-us&format=json"
