---
cacheable: true
---

# Mediu
section '.medium.links', ->
	# Header
	header ->
		a href:'https://medium.com/@balupton', title:'Visit my Medium', ->
			h1 -> 'Medium'
			img '.icon', src:'/images/medium.png'

	###
	# Fetch
	entries = []
	for entry in @feedr.feeds['medium']?.channel?.item or []
		entries.push(
			title: entry.title
			url: entry.link
			date: new Date(entry.pubDate)
		)

	# Output
	if entries.length isnt 0
		ul ->
			for entry in entries
				li datetime: entry.date.toISOString(), ->
					a href: entry.url, title:"View on Medium", ->
						entry.title
	###