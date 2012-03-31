---
title: 'Projects'
layout: 'page'
---

# Projects
projects = @feeds['balupton-projects'].concat(@feeds['bevry-projects']).sort((a,b) -> b.watchers - a.watchers)
if projects.length
	text @partial 'project-list.html.coffee', {
		projects: projects
	}
