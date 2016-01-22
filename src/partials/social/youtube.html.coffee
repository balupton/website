---
cacheable: true
---

# Youtube
section '.youtube.images.videos', ->
	header ->
		a href: 'http://www.youtube.com/user/balupton', title: 'Visit my Youtube', ->
			h1 -> 'Youtube'
			img '.icon', src: '/images/youtube.png'

	entries = (@feedr.feeds.youtube?.feed?.items or [])
	if entries.length isnt 0 then ul ->
		for entry,key in entries
			time = entry.snippet.publishedAt
			id = entry.snippet.resourceId.videoId
			link = 'https://www.youtube.com/watch?v='+id
			embed = link.replace(/watch\?v=/i, 'v/')+'&autoplay=1'
			title = entry.snippet.title
			image = entry.thumbnails.default.url
			if link and image
				li datetime:time, ->
					a href:link, 'data-embed':embed, title:title, ->
						img src:@cachr(image), alt:title
