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