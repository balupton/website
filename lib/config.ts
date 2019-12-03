import * as pathUtil from 'path'

export const cachePath = pathUtil.join(__dirname, '..', '.data')
export const linksPath = pathUtil.join(__dirname, '..', '.data', 'links.json')
export const pagesPath = pathUtil.join(__dirname, '..', 'pages')
export const pagesGlob = '**/*.mdx'

export const directoryTags = {
	notes: ['note'],
	blog: ['post']
}

export const site = {
	url: 'https://balupton.com',
	author: 'Benjamin Lupton',
	title: 'Benjamin Lupton',
	description:
		'Founder of Bevry. Benjamin leads an exceptional life by being a specialised generalist. Global citizenship, borderless economy, contextual culture, self governance.',
	feeds: ['https://balupton.com/feedburner', 'https://balupton.com/feedmedium'],
	links: {
		home: {
			url: '/',
			name: 'About',
			description: "Benjamin Lupton's Biography",
			tags: ['menu']
		},
		projects: {
			url: '/projects',
			name: 'Projects',
			description: "Benjamin Lupton's Projects",
			tags: ['menu']
		},
		blog: {
			url: '/blog',
			name: 'Blog',
			description: "Benjamin Lupton's Posts",
			tags: ['menu']
		},
		contact: {
			url: '#📨',
			name: 'Contact',
			description: 'Contact me'
		},
		referrals: {
			url: '#💸',
			name: 'Referrals',
			description: 'View my referral offerings'
		}
	},
	email: 'b@lupton.cc',
	tags: []
}
