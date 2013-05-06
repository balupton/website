---
cacheable: true
---

# Flickr
section '.flickr.images', ->
	header ->
		a href:'http://www.flickr.com/people/balupton/', title:'Visit my Flickr', ->
			h1 -> 'Flickr'
			img '.icon', src: '/images/flickr.gif'

	entries = (@feedr.feeds.flickr?.items or [])
	if entries.length isnt 0 then ul ->
		for entry in entries
			li datetime:entry.date_taken, ->
				a href:entry.link, title:entry.title, ->
					img src:@cachr(entry.media.m), alt:entry.title
