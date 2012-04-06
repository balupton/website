---
title: 'Projects'
layout: 'page'
---

# Projects
projects = @feedr.feeds['balupton-projects'].concat(@feedr.feeds['bevry-projects']).sort((a,b) -> b.watchers - a.watchers)
if projects.length
	text @partial 'project-list.html.coffee', {
		projects: projects
	}
