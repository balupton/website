# Project List
nav '.project-list', 'typeof':'dc:collection', ->
	for project in @projects
		li '.project', 'typeof':'soic:post', about:project.url, ->
			h3 ->
				a '.project-link', href:project.html_url, ->
					em '.project-owner', property:'dc:owner', ->
						project.owner.login
					text ' / '
					strong '.project-name', property:'dc:name', ->
						project.name
					small '.project-watchers', property:'dc:watchers', ->
						text "#{project.watchers} watchers"
			if project.description
				p '.project-description', property:'dc:description', ->
					project.description
