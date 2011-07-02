# Requires
docpad = require 'docpad'
express = require 'express'

# Configuration
masterPort = process.env.PORT || 10113

# Create Instances
docpadInstance = docpad.createInstance port: masterPort

# Fetch Servers
docpadServer = docpadInstance.server

# Master Server
masterServer = docpadServer
masterServer.use express.vhost 'balupton.*', docpadServer
masterServer.use express.vhost 'balupton.*.*', docpadServer
# Note: Change the above if you are not balupton, they should be the DNS for your own server


# -------------------------------------
# Redirects

# Redirect Definitions
docpadServer.redirect 'github', (req, res) ->
	project = req.params[0]
	return "https://github.com/balupton/#{project}"
docpadServer.redirect 'demo', (req, res) ->
	project = req.params[0]
	return "http://balupton.github.com/#{project}/demo/"

# Project Demos
docpadServer.get /^\/(?:sandbox|projects?)\/([^\/]+)\/demo\/?.*/, (req, res) ->
	res.redirect 'demo', 301

# Project Homes
docpadServer.get /^\/(?:sandbox|projects?)\/([^\/]+)\/?.*/, (req, res) ->
	res.redirect 'github', 301

# Security Report
docpadServer.get '/documents/webct_exploits.txt', (req, res) ->
	res.redirect 'http://seclists.org/fulldisclosure/2008/Mar/51', 301

# -------------------------------------
# Todo

# - Get broken old demos working
# - Fix old projects locations to point to their github page
# - Make the official balupton website by making it balupton.com instead of balupton.no.de