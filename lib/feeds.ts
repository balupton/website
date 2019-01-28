'use strict'

export type Feed = { href: string; title: string }

const feeds: Feed[] = [
	{
		href: 'http://feeds.feedburner.com/balupton.atom',
		title: 'Blog Posts'
	},
	{
		href: 'https://medium.com/feed/@balupton',
		title: 'Medium Posts'
	}
]

export default feeds
