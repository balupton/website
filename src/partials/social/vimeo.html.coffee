---
cacheable: true
---

# Vimeo
section '.vimeo.images.videos', ->
	header ->
		a href: 'https://vimeo.com/balupton', title: 'Visit my Vimeo', ->
			h1 -> 'Vimeo'
			img '.icon', src: '/images/vimeo.gif'

	entries = (@feedr.feeds.vimeo or [])
	if entries.length isnt 0 then ul ->
		for entry,key in entries
			li datetime:entry.upload_date, ->
				a href:entry.url, 'data-embed':"http://player.vimeo.com/video/#{entry.id}?autoplay=1", title:entry.title, 'data-height':entry.height, 'data-width':entry.width, ->
					img src:@cachr(entry.thumbnail_medium), alt:entry.title
