# Requires
docpad = require 'docpad'
express = require 'express'

# Variables
oneDay = 86400000
expiresOffset = oneDay

# -------------------------------------
# Server

# Configuration
masterPort = process.env.PORT || 10113

# Create Instances
docpadInstance = docpad.createInstance port: masterPort, maxAge: expiresOffset

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

	# DoS Detection
	requests = {}

	# WWW Redirect
	docpadServer.get '*', (req, res, next) ->
		console.log {url: req.url, ip: req.connection.remoteAddress, status: res.statusCode}

		###
		# DoS Dection
		requestKey = req.url+'|'+req.connection.remoteAddress
		if requests[requestKey]?
			++requests[requestKey].counter
			requests[requestKey].res.push res
		else
			requests[requestKey] = {
				counter: 1
				res: [res]
				timeout: setTimeout(
					->
						if requests[requestKey]?
							# 
							if requests[requestKey].counter > 20
								console.log 'bad request'
								for res in requests[requestKey].res
									if res.statusCode < 200
										res.send(400) # Bad Request
							delete requests[requestKey]
					10*1000
				)
			}
		###
		
		# Timeout Handling
		((req,res) ->
			setTimeout(
				->
					console.log 'timed out:', {url: req.url, ip: req.connection.remoteAddress, status: res.statusCode}
					if res.statusCode < 200
						console.log 'request timed out'
						res.send(408) # Request Timeout
				30*1000
			)						
		)(req,res)
		
		# Handle
		if /\/http/.test(req.url) or /^\/(blogs|services|articles|clients|work|public)/.test(req.url)
			console.log 'not found'
			res.send(404) # Not Found
		else
			if req.headers.host in ['www.balupton.com','lupton.cc','www.lupton.cc','balupton.no.de']
				res.redirect 'http://balupton.com'+req.url, 301
			else
				expires = new Date()
				expires.setTime expires.getTime() + expiresOffset
				res.header 'Expires', expires.toGMTString()
				next()
		
	# Project Demos
	docpadServer.get /^\/(?:sandbox|projects?)\/([^\/]+)\/demo\/?.*/, (req, res) ->
		project = req.params[0]
		res.redirect "https://balupton.github.com/#{project}/demo/", 301

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