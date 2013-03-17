---
title: 'Projects'
layout: 'page'
---

# Projects
projects = (@feedr.feeds['balupton-projects'] or [])
	.concat?(@feedr.feeds['bevry-projects'] or [])
	.concat?(@feedr.feeds['browserstate-projects'] or [])
	.concat?(@feedr.feeds['docpad-projects'] or [])
	.filter((a) -> a.fork is false)
	.sort?((a,b) -> b.watchers - a.watchers)

# Check
if projects.length
	# Prepare
	forksAmount = watchersAmount = 0
	for project in projects
		forksAmount += project.forks
		watchersAmount += project.watchers

	# List
	text @partial 'content/project-list.html.coffee', {
		projects: projects
	}

	# Facts
	h3 'Totals'
	ul ->
		li -> "Projects: #{projects.length}"
		li -> "Stars: #{watchersAmount}"
		li -> "Forks: #{forksAmount}"
