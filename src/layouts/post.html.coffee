---
layout: default
---

# Title
if @document.title
	header '.page-header', ->
		h1 ->
			a href:@document.url, ->
				strong property:'dcterms:title', ->
					@document.title
				small '.date', property:'dc:date', ->
					" #{@document.date.toShortDateString()}"

# Content
div '.page-content', property: 'sioc:content',
	-> @content