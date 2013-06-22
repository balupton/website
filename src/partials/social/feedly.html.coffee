---
cacheable: true
---

# Flattr
section '.feedly.links', ->
	header ->
		a href:"http://www.feedly.com/home#subscription/feed/#{h @site?.feeds?[0]?.href}", title:'Follow on Feedly', ->
			h1 -> 'Feedly'
			img '.icon', src:'/images/feedly.png'
