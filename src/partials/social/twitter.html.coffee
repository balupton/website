---
cacheable: true
---

# Twitter
section '.twitter.links', ->
	header ->
		a href: 'https://twitter.com/balupton', title: 'Visit my Twitter', ->
			h1 -> 'Twitter'
			img '.icon', src: '/images/twitter.gif'

	entries = (@feedr.feeds.twitter or [])
	if entries.length isnt 0 then ul ->
		for entry in entries
			continue  if entry.in_reply_to_user_id
			li datetime:entry.created_at, ->
				a href:"https://twitter.com/#!/#{entry.user.screen_name}/status/#{entry.id_str}", title:"View on Twitter", ->
					entry.text
