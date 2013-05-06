---
cacheable: true
---

# Flattr
section '.flattr.links', ->
	header ->
		a href:'https://flattr.com/profile/balupton', title:'Visit my Flattr', ->
			h1 -> 'Flattr'
			img '.icon', src:'/images/flattr.png'

	entries = (@feedr.feeds.flattr?.entry or [])
	if entries.length isnt 0 then ul ->
		for entry in entries
			li datetime:entry.updated, ->
				a href:entry.link['@'].href, title:"View on Flattr", ->
					entry.title
