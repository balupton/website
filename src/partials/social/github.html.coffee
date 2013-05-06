---
cacheable: true
---

# Github
section '.github.links', ->
	header ->
		a href:'https://github.com/balupton', title:'Visit my Github', ->
			h1 -> 'GitHub'
			img '.icon', src:'/images/github.gif'

	entries = (@feedr.feeds.github?.entry or [])
	if entries.length isnt 0 then ul ->
		for entry in entries
			li datetime: entry.published, ->
				a href: entry.link['@'].href, title:"View on Github", ->
					entry.title['#']
