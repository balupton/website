###
layout: default
###

# Title
if @document.title
	header '.page-header', ->
		h1 ->
			a '.page-link', href:@document.url, ->
				strong '.page-title', property:'dcterms:title', ->
					@document.title
				small '.page-date', property:'dc:date', ->
					" #{@document.date.toDateString()}"

# Content
div '.page-content', property: 'sioc:content',
	-> @content

# Footer
footer '.page-footer', ->
	# Disqus
	section '.page-comments', ->
		text @getDisqus()
