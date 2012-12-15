---
cacheable: true
---

# Vimeo
section '.vimeo.images', ->
	header ->
		a href: 'https://vimeo.com/balupton', title: 'Visit my Vimeo', ->
			h1 -> 'Vimeo'
			img '.icon', src: '/images/vimeo.gif'
	ul ->
		for video,key in (@feedr.feeds.vimeo or [])
			li datetime: video.upload_date, ->
				a href: video.url, title: video.title, 'data-height': video.height, 'data-width': video.width, ->
					img src: @cachr(video.thumbnail_medium), alt: video.title
