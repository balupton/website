---
cacheable: true
---

# Youtube
section '.youtube.images.videos', ->
	header ->
		a href: 'http://www.youtube.com/user/balupton', title: 'Visit my Youtube', ->
			h1 -> 'Youtube'
			img '.icon', src: '/images/youtube.png'

	entries = (@feedr.feeds.youtube?.feed?.entry or [])
	if entries.length isnt 0 then ul ->
		for entry,key in entries
			time = entry.published?.$t
			link = entry.link?[0]?.href
			embed = entry.link?[0].href.replace(/watch\?v=/i, 'v/')+'&autoplay=1'  if link
			title = entry.title?.$t
			image = entry.media$group?.media$thumbnail?[0]?.url
			if link and image
				li datetime:time, ->
					a href:link, 'data-embed':embed, title:title, ->
						img src:@cachr(image), alt:title
