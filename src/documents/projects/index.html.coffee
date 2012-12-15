---
title: 'Projects'
layout: 'page'
---

# Projects
projects = (@feedr.feeds['balupton-projects'] or []).concat(@feedr.feeds['bevry-projects'] or []).sort((a,b) -> b.watchers - a.watchers)
if projects.length
	text @partial 'content/project-list.html.coffee', {
		projects: projects
	}
