# Document List
nav '.document-list', 'typeof':'dc:collection', ->
	for document in @documents
		li '.document', 'typeof':'soic:post', about:document.url, ->
			div '.document-header', ->
				a '.document-link', href:document.url, ->
					strong '.document-title', property:'dc:title', ->
						document.title
					small '.document-date', property:'dc:date', ->
						document.date.toDateString()
				if document.comments
					a '.document-comments', href:document.url+'#comments', ->
						small property:'dc:comments', ->
							"#{document.comments} comments"
			if document.description
				p '.document-description', property:'dc:description', ->
					document.description