---
cacheable: true
---

# Flickr
section '.flickr.images', ->
	header ->
		a href: 'http://www.flickr.com/people/balupton/', title: 'Visit my Flickr', ->
			h1 -> 'Flickr'
			img '.icon', src: '/images/flickr.gif'
	ul ->
		for image in (@feedr.feeds.flickr?.items or [])
			li datetime: image.date_taken, ->
				a href: image.link, title: image.title, ->
					img src: @cachr(image.media.m), alt: image.title
