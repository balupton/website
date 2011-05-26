# Requires
docpad = require 'docpad'
express = require 'express'

# Create Instances
docpadInstance = docpad.createInstance port:8002

# Fetch Servers
docpadServer = docpadInstance.server

# Master Server
app = express.createServer()
app.use express.vhost 'balupton.*', docpadServer
app.listen process.env.PORT || 10113