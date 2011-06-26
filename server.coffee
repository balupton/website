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
docpadServer.get '/projects/:name', (req, res) ->
	res.redirect 'https://github.com/balupton/'+req.params.id, 301

# Todo:
# - Add redirects for old balupton.com project posts to their github pages
# - Make the official balupton website by making it balupton.com instead of balupton.no.de