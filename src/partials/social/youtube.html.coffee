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
			li datetime:entry.published.$t, ->
				a href:entry.link[0].href, 'data-embed':entry.link[0].href.replace(/watch\?v=/i, 'v/')+'&autoplay=1', title:entry.title.$t, ->
					img src:@cachr(entry.media$group.media$thumbnail[0].url), alt:entry.title.$t
