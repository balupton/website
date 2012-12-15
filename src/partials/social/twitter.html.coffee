---
cacheable: true
---

# Twitter
section '.twitter.links', ->
	header ->
		a href: 'https://twitter.com/balupton', title: 'Visit my Twitter', ->
			h1 -> 'Twitter'
			img '.icon', src: '/images/twitter.gif'
	ul ->
		for tweet in (@feedr.feeds.twitter or [])
			continue  if tweet.in_reply_to_user_id
			li datetime: tweet.created_at, ->
				a href: "https://twitter.com/#!/#{tweet.user.screen_name}/status/#{tweet.id_str}", title: "View on Twitter", ->
					tweet.text
