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

# Redirects
docpadServer.redirect 'github', (req, res) ->
	return 'https://github.com/balupton/'+req.params[0]

# /projects/jquery-lightbox
# /sandbox/jquery-lightbox/asd
# /jquery-lightbox/asd
docpadServer.get /^\/(?:sandbox|projects?)\/([^\/]+)\/?.*/, (req, res) ->
	res.redirect 'github', 301

# Todo:
# - Add redirects for old balupton.com demos
# - Make the official balupton website by making it balupton.com instead of balupton.no.de