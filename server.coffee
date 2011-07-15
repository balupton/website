# Requires
docpad = require 'docpad'
express = require 'express'

# Variables
oneDay = 86400000
expiresOffset = oneDay
debug = true


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


# -------------------------------------
# Middlewares

# Configure
docpadServer.configure ->
	# Redirect Middleware
	docpadServer.use (req,res,next) ->
		if req.headers.host in ['www.balupton.com','lupton.cc','www.lupton.cc','balupton.no.de']
			res.redirect 'http://balupton.com'+req.url, 301
			res.end()
		else
			next()

	# Static Middleware
	docpadInstance.serverAction (err) -> throw err  if err

	# Router Middleware
	docpadServer.use docpadServer.router

	# 404 Middleware
	docpadServer.use (req,res,next) ->
		res.send(404)


# -------------------------------------
# Start Server

# Start Server
docpadServer.listen masterPort
console.log 'Express server listening on port %d', docpadServer.address().port

# DNS Servers
masterServer.use express.vhost 'balupton.*', docpadServer
masterServer.use express.vhost 'balupton.*.*', docpadServer
masterServer.use express.vhost 'lupton.*', docpadServer


# -------------------------------------
# Redirects

# Demos
docpadServer.get /^\/sandbox(?:\/([^\/]+).*)?$/, (req, res) ->
	project = req.params[0]
	res.redirect "http://balupton.github.com/#{project}/demo/", 301
	# ^ github pages don't have https

# Projects
docpadServer.get /^\/(?:g|gh|github|projects)(?:\/(.*))?$/, (req, res) ->
	project = req.params[0] or ''
	res.redirect "https://github.com/balupton/#{project}", 301

# Twitter
docpadServer.get /^\/(?:t|twitter|tweet)\/?.*$/, (req, res) ->
	res.redirect "https://twitter.com/balupton", 301

# Sharing Feed
docpadServer.get /^\/feeds?\/shar(e|ing)?.*$/, (req, res) ->
	res.redirect "http://feeds.feedburner.com/balupton/shared", 301

# Feeds
docpadServer.get /^\/feeds?\/?.*$/, (req, res) ->
	res.redirect "http://feeds.feedburner.com/balupton", 301

# Security Report
docpadServer.get '/documents/webct_exploits.txt', (req, res) ->
	res.redirect 'http://seclists.org/fulldisclosure/2008/Mar/51', 301


# -------------------------------------
# Todo

# - Make the official balupton website by making it balupton.com instead of balupton.no.de