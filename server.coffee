# Requires
docpad = require 'docpad'
express = require 'express'

# -------------------------------------
# Server

# Configuration
masterPort = process.env.PORT || 10113

# Create Instances
docpadInstance = docpad.createInstance port: masterPort, maxAge: 86400000 # one day

# Fetch Servers
#docpadInstance.generateAction -> \
docpadInstance.serverAction ->
	docpadServer = docpadInstance.server

	# Master Server
	masterServer = docpadServer

	# DNS Servers
	masterServer.use express.vhost 'balupton.*', docpadServer
	masterServer.use express.vhost 'balupton.*.*', docpadServer
	masterServer.use express.vhost 'lupton.*', docpadServer

	# -------------------------------------
	# Redirects

	# WWW Redirect
	docpadServer.get '*', (req, res, next) ->
		if req.headers.host in ['www.balupton.com','lupton.cc','www.lupton.cc','balupton.no.de']
			res.redirect 'http://balupton.com'+req.url, 301
		else
			next()
	
	# Project Demos
	docpadServer.get /^\/(?:sandbox|projects?)\/([^\/]+)\/demo\/?.*/, (req, res) ->
		project = req.params[0]
		res.redirect "http://balupton.github.com/#{project}/demo/", 301

	# Project Homes
	docpadServer.get /^\/(?:sandbox|projects?)\/([^\/]+)\/?.*/, (req, res) ->
		project = req.params[0]
		res.redirect "https://github.com/balupton/#{project}", 301

	# Security Report
	docpadServer.get '/documents/webct_exploits.txt', (req, res) ->
		res.redirect 'http://seclists.org/fulldisclosure/2008/Mar/51', 301

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