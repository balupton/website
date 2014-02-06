---
cacheable: true
---

# Tumblr
section '.tumblr.links', ->
	# Header
	header ->
		a href:'http://balupton.tumblr.com', title:'Visit my Tumblr', ->
			h1 -> 'Tumblr'
			img '.icon', src:'/images/tumblr.png'

	###
	# Fetch
	entries = []
	for entry in @feedr.feeds['tumblr']?.channel?.item or []
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
					a href: entry.url, title:"View on Tumblr", ->
						entry.title
	###