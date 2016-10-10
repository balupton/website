###
title: 'Projects'
layout: 'page'
menuText: 'projects'
menuTitle: 'View projects'
###

# Prepare
projects = @getProjects()
githubCounts = @getGithubCounts()

# Check
if projects.length
	# List
	text @partial 'content/project-list.html.coffee', {
		projects: projects
	}

	# Facts
	h3 'Totals'
	ul ->
		li -> "Projects: #{projects.length}"
		li -> "Stars: #{githubCounts.stars}"
		li -> "Forks: #{githubCounts.forks}"
