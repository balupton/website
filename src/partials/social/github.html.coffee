---
cacheable: true
---

# Github
section '.github.links', ->
	header ->
		a href: 'https://github.com/balupton', title: 'Visit my Github', ->
			h1 -> 'GitHub'
			img '.icon', src: '/images/github.gif'
	ul ->
		for entry in (@feedr.feeds.github?.entry or [])
			li datetime: entry.published, ->
				a href: entry.link['@'].href, title: "View on Github", ->
					entry.title['#']
