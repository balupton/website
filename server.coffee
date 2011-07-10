# Requires
docpad = require 'docpad'
express = require 'express'

# Variables
oneDay = 86400000
expiresOffset = oneDay
debug = false

# -------------------------------------
# Server

# Configuration
masterPort = process.env.PORT || 10113

# Create Servers
docpadServer = express.createServer()
masterServer = docpadServer

# Setup DocPad
docpadInstance = docpad.createInstance {
	port: masterPort
	maxAge: expiresOffset
	server: docpadServer
}

# Configuration
masterServer.configure =>
	# Middleware
	masterServer.use express.methodOverride()
	masterServer.use express.bodyParser()
	masterServer.use masterServer.router

# Generate Website
# docpadInstance.generateAction -> false

# Serve Website
docpadInstance.serverAction -> false

# Start Server Listening
masterServer.listen masterPort
console.log 'Express server listening on port %d', masterServer.address().port

# DNS Servers
masterServer.use express.vhost 'balupton.*', docpadServer
masterServer.use express.vhost 'balupton.*.*', docpadServer
masterServer.use express.vhost 'lupton.*', docpadServer

# -------------------------------------
# Redirects

# WWW Redirect
docpadServer.get '*', (req, res, next) ->
	# Prepare
	requestInfo = {url: req.headers.host+req.url, ip: req.connection.remoteAddress, status: res.statusCode}
	console.log requestInfo  if debug

	# Timeout Handling
	((req,res) ->
		setTimeout(
			->
				# Prepare
				requestInfo = {url: req.headers.host+req.url, ip: req.connection.remoteAddress, status: res.statusCode}

				# Check if we responded
				unless res._headerSent
					# Attempt timeout response
					res.send(408) # Request Timeout
					console.log 'request timeout:', requestInfo
					res.end() # End Response
					console.log 'end response:', requestInfo
			30*1000
		)						
	)(req,res)
	
	# Handle
	if /\/http/.test(req.url) or /^\/(blogs|services|articles|clients|work|public|front)/.test(req.url)
		console.log 'not found:', requestInfo
		res.send(404) # Not Found
	else
		if req.headers.host in ['www.balupton.com','lupton.cc','www.lupton.cc','balupton.no.de']
			res.redirect 'http://balupton.com'+req.url, 301
		else
			next()
	
# Project Demos
docpadServer.get /^\/sandbox\/([^\/]+)(.*)/, (req, res) ->
	project = req.params[0]
	res.redirect "http://balupton.github.com/#{project}/demo/", 301
	# ^ https breaks it

# Project Homes
docpadServer.get /^\/projects?\/([^\/]+)?.*/, (req, res) ->
	project = req.params[0]
	res.redirect "https://github.com/balupton/#{project}", 301

# Github
docpadServer.get /^\/(?:g|gh|github)\/?(.*)/, (req, res) ->
	project = req.params[0]
	res.redirect "https://github.com/balupton/#{project}", 301

# Twitter
docpadServer.get /^\/(?:t|twitter|tweet)\/?.*/, (req, res) ->
	res.redirect "https://twitter.com/balupton", 301

# Sharing Feed
docpadServer.get /^\/feeds?\/shar(e|ing)?.*/, (req, res) ->
	res.redirect "http://feeds.feedburner.com/balupton/shared", 301

# Feeds
docpadServer.get /^\/feeds?\/?.*/, (req, res) ->
	res.redirect "http://feeds.feedburner.com/balupton", 301

# -------------------------------------
# Todo

# - Make the official balupton website by making it balupton.com instead of balupton.no.de