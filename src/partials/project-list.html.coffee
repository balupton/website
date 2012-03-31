# Project List
nav '.project-list', 'typeof':'dc:collection', ->
	for project in @projects
		li '.project', 'typeof':'soic:post', about:project.url, ->
			a '.project-link', href:project.html_url, ->
				h3 '.document-title', ->
					em '.project-owner', property:'dc:owner', ->
						project.owner.login
					text ' / '
					strong '.project-name', property:'dc:name', ->
						project.name
					small '.project-watchers', property:'dc:watchers', ->
						text "#{project.watchers} watchers"