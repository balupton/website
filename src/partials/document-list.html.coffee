# Document List
nav '.document-list', 'typeof':'dc:collection', ->
	for document in @documents
		li '.document', 'typeof':'soic:post', about:document.url, ->
			a '.document-link', href:document.url, ->
				h3 '.document-title', ->
					strong '.document-title', property:'dc:title', ->
						document.title
					small '.document-date', property:'dc:date', ->
						document.date.toShortDateString()
			if document.description
				p '.document-description', property:'dc.description', ->
					document.description
