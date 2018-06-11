/* eslint no-confusing-arrow:0 no-use-before-define:1 */
'use strict'

const pathUtil = require('path')
const fsUtil = require('fs')
const fs = require('fs').promises

const h = require('hyperscript')
const yamljs = require('yamljs')
const { replaceElementSync, extractAttribute } = require('ropo')
const docmatter = require('docmatter')
const xml2js = require('xml2js')
const marked = require('marked')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const mkdirp = require('mkdirp')
const cpr = require('cpr')

const renderDefaultLayout = require('./templates/layouts/default.js')
const renderPageLayout = require('./templates/layouts/page.js')
const renderPostLayout = require('./templates/layouts/post.js')

const directories = {
	cache: pathUtil.join(__dirname, 'cache'),
	out: pathUtil.join(__dirname, 'out'),
	source: pathUtil.join(__dirname, 'source'),
	data: pathUtil.join(__dirname, 'source', 'data'),
	fragments: pathUtil.join(__dirname, 'source', 'fragments'),
	layouts: pathUtil.join(__dirname, 'source', 'layouts'),
	partials: pathUtil.join(__dirname, 'source', 'partials'),
	render: pathUtil.join(__dirname, 'source', 'render'),
	raw: pathUtil.join(__dirname, 'source', 'raw')
}

const data = require(directories.data)

const githubClientId = process.env.BEVRY_GITHUB_CLIENT_ID
const githubClientSecret = process.env.BEVRY_GITHUB_CLIENT_SECRET
const githubAuthString = `client_id=${githubClientId}&client_secret=${githubClientSecret}`

function renderElements (html) {
	const result1 = replaceElementSync(html, /x-text/, function (content, { attributes }) {
		const code = extractAttribute(attributes, 'code')
		return database[code]
	})

	const result2 = replaceElementSync(result1, /x-link/, function (content, { attributes, inner }) {
		const code = extractAttribute(attributes, 'code') || extractAttribute(attributes, 'data-code')
		const link = links.map[code]

		if (inner && inner.indexOf('x-link') !== -1) {
			// console.error({ content, inner })
			throw new Error('unclosed x-link')
		}

		if (!link) {
			// console.error({ code, attributes, inner, content })
			throw new Error('missing link')
		}

		const title = extractAttribute(attributes, 'title') || link.title || ''
		const href = link.url
		const color = link.color || null
		const className = link.class || null
		const style = color == null ? null : { color: `${color} !important` }

		const text = inner || link.text || ''

		const element = h('a', { title, href, style, class: className }, text).outerHTML

		return element
	})

	return result2
}

function makeDirectory (path) {
	return new Promise(function (resolve, reject) {
		mkdirp(path, function (err, made) {
			if (err) return reject(err)
			resolve(made)
		})
	})
}

function copyDirectory (source, target) {
	return new Promise(function (resolve, reject) {
		cpr(source, target, { deleteFirst: true, overwrite: true, confirm: true }, function (err, files) {
			if (err) return reject(err)
			resolve(files)
		})
	})
}

function writeFile (path, content) {
	return makeDirectory(pathUtil.dirname(path)).then(() => fs.writeFile(path, content))
}

function parseDocument (input) {
	const matter = docmatter(input)

	// if no front matter: {content}
	if (!matter.header) return { content: matter.content.trim() }

	// if front matter: {delimiter, parser, header, body, content}
	let data = null
	switch (matter.parser || 'yaml') {
		case 'yaml':
			data = yamljs.parse(
				matter.header.replace(/\t/g, '    ')  // YAML doesn't support tabs that well
			)
			break

		default:
			throw new Error('unsupport front matter')
	}

	return { data, content: matter.body.trim() }
}

function parseXML (xml) {
	return new Promise(function (resolve, reject) {
		xml2js.parseString(xml, function (err, result) {
			if (err) return reject(err)
			resolve(result)
		})
	})
}

async function isthere (path) {
	return new Promise(function (resolve) {
		fsUtil.exists(path, function (exists) {
			resolve(exists)
		})
	})
}

async function cache (url, type, test) {
	try {
		const hash = require('crypto').createHash('md5').update(url).digest('hex')
		const cachefile = `${cachedir}/${hash}`
		const exists = await isthere(cachefile)
		if (exists) {
			let data
			const text = await fs.readFile(cachefile)
			switch (type) {
				case 'json':
					data = JSON.parse(text)
					break
				case 'xml':
					data = await parseXML(text)
					break
				case 'text':
				default:
					data = text
					break
			}
			return data
		}
		else {
			let data, text
			const response = await fetch(url)
			switch (type) {
				case 'json':
					data = await response.json()
					text = JSON.stringify(data, null, '  ')
					break
				case 'xml':
					text = await response.text()
					data = await parseXML(text)
					break
				case 'text':
				default:
					data = text = await response.text()
					break
			}
			if (test && test(data) !== true) {
				throw new Error(`test failed for ${url} with data: ${text}`)
			}
			await fs.writeFile(cachefile, text)
			return data
		}
	}
	catch (e) {
		throw e
	}
}
function suffixNumber (input) {
	let rank = String(input)

	if (rank) {
		if (rank >= 1000) {
			rank = rank.substring(0, rank.length - 3) + ',' + rank.substr(-3)
		}
		else if (rank >= 10 && rank < 20) {
			rank += 'th'
		}
		else {
			switch (rank.substr(-1)) {
				case '1':
					rank += 'st'
					break
				case '2':
					rank += 'nd'
					break
				case '3':
					rank += 'rd'
					break
				default:
					rank += 'th'
			}
		}
	}

	return rank
}

function floorToNearest (value, floorToNearest) {
	return Math.floor(value / floorToNearest) * floorToNearest
}

function getRank (list) {
	const index = list.findIndex((user) => user.username === 'balupton')
	return index === -1 ? Promise.reject('could not find me in the listing') : Promise.resolve(index + 1)
}

async function renderFragments (directory) {
	const dir = pathUtil.join(__dirname, directory)
	const results = {}
	await fs.readdir(dir)
		.then((files) => Promise.all(
			files
				.filter((file) => file.endsWith('.md'))
				.map((file) =>
					fs.readFile(pathUtil.join(dir, file), 'utf8')
						.then((text) => {
							results[file.substr(0, file.length - 3)] = marked(text)
						})
				)
		))
	return results
}

function renderDocuments (directory, developerMetadata) {
	const dir = pathUtil.join(__dirname, directory)
	return fs.readdir(dir)
		.then((files) => Promise.all(
			files
				.filter((file) => file.endsWith('.md'))
				.map((file) =>
					fs.readFile(pathUtil.join(dir, file), 'utf8')
						.then((text) => {
							const matter = parseDocument(text)
							const metadata = Object.assign({}, developerMetadata, matter.data)
							const data = {
								title: metadata.title,
								url: '/' + directory + '/' + file.substr(0, file.length - 3),
								path: pathUtil.join(outdir, '/' + directory + '/' + file.substr(0, file.length - 3) + '/index.html'),
								keywords: (metadata.keywords || '').split(/[, ]+/),
								datePublished: new Date(metadata.datePublished || metadata.date),
								content: marked(matter.content)
							}
							return data
						})
				)
		))
}

/*
'github': {
	url: 'https://github.com/balupton.atom',
	type: 'xml'
},
'medium': {
	url: 'https://medium.com/feed/ephemeral-living',
	type: 'xml'
}
{
	href: 'http://feeds.feedburner.com/balupton.atom',
	title: 'Blog Posts'
},
{
	href: 'https://medium.com/feed/@balupton',
	title: 'Medium Posts'
}
*/

// pull in feeds
const database = {
	'stackoverflow-reputation': cache('https://api.stackexchange.com/2.2/users/130638?order=desc&sort=reputation&site=stackoverflow', 'json')
		.then((data) => data.items[0].reputation || Promise.reject('.reputation was empty'))
		.then((reputation) => suffixNumber(floorToNearest(reputation, 1000))),

	'github-followers': cache(`https://api.github.com/users/balupton?${githubAuthString}`, 'json')
		.then((data) => data.followers || Promise.reject('.followers was empty')),

	'github-watch-rank-australia-javascript': cache(`https://api.github.com/legacy/user/search/location:Australia%20language:JavaScript?${githubAuthString}`, 'json')
		.then((data) => getRank(data.users))
		.then((reputation) => suffixNumber(reputation)),

	'github-watch-rank-australia': cache(`https://api.github.com/legacy/user/search/location:Australia?${githubAuthString}`, 'json')
		.then((data) => getRank(data.users))
		.then((reputation) => suffixNumber(reputation)),

	'github-stars': Promise.resolve(0),
	'github-contributions': Promise.resolve(0),
	'github-projects': Promise.resolve(0),

	'gists': cache(`https://api.github.com/users/balupton/gists?per_page=100&${githubAuthString}`, 'json'),

	'medium': cache('https://medium.com/feed/ephemeral-living', 'xml')
		.then((data) => data.rss.channel[0].item.map(function (item) {
			return {
				title: item.title[0],
				url: item.link[0],
				datePublished: new Date(item.pubDate[0]),
				content: item['content:encoded']
			}
		})),

	'notes': renderDocuments('notes', { layout: 'post' }),
	'posts': renderDocuments('posts', { layout: 'post' }),
	'fragments': renderFragments('fragments')

}

// github-stars: @suffixNumber @floorToNearest(@getGithubCounts().stars, 50)
// github-contributions:  @suffixNumber @floorToNearest(@getGithubCounts().contributions, 100)
// github-projects: @getGithubCounts().projects

async function main () {
	await Promise.all([
		makeDirectory(cachedir),
		copyDirectory(rawdir, outdir)
	])

	const values = await Promise.all(Object.values(database))
	const data = {}
	Object.keys(database).forEach(function (key, index) {
		data[key] = values[index]
	})

	const documents = data.notes.concat(data.posts)
	await Promise.all(
		documents.map(function (document) {
			try {
				return writeFile(document.path,
					renderElements(
						renderPostLayout({
							site,
							feeds,
							links,
							menu,
							fragments: data.fragments,
							document
						})
					)
				)
			}
			catch (e) {
				console.error(e)
				throw new Error('failed to render: ' + document.url)
			}
		})
	)

	const gists = data.gists
		.filter((gist) => gist.public)
		.map((gist) => ({
			title: gist.description,
			url: gist.html_url,
			datePublished: new Date(gist.created_at),
			comments: gist.comments /* @todo re-add comment count into listings */
		}))

	const pages = [
		{
			path: pathUtil.join(outdir, 'atom.xml'),
			content: require('./templates/pages/atom.js')({ site, documents })
		},
		{
			path: pathUtil.join(outdir, 'blog', 'index.html'),
			content: renderPageLayout({
				site,
				feeds,
				links,
				menu,
				require ('./templates/pages/blog.js')({ site, documents, gists })
		}
	]

	await Promise.all(
		pages.map(
			({ path, content }) => writeFile(path, content)
		)
	)

}

main()

/*
fetch('https://github.com/')
	.then((res) => res.text())
	.then((body) => console.log(body))

// json

fetch('https://api.github.com/users/github')
	.then((res) => res.json())
	.then((json) => console.log(json))


const parseString = require('xml2js').parseString
const xml = '<root>Hello xml2js!</root>'
parseString(xml, function (err, result) {
	console.dir(result)
})

const cheerio = require('cheerio')
const $ = cheerio.load('<h2 class="title">Hello world</h2>')

$('h2.title').text('Hello there!')
$('h2').addClass('welcome')

$.html()
*/


// pull in posts
// pull in notes
// pull in documents

/*

# Posts
posts = []

## Local
for document in @getCollection('posts').toJSON()
	posts.push(document)

## Medium
for entry in @feedr.feeds['medium']?.channel?.item or []
	posts.push(
		title: entry.title
		url: entry.link
		date: new Date(entry.pubDate)
	)

## Render
if posts.length isnt 0
	text @partial('content/document-list.html.coffee', {
		documents: posts.sort((a,b) -> b.date.getTime() - a.date.getTime())
	})

	# Gist Listing
	gists = []
	for gist in @feedr.feeds['github-gists'] or[]
		continue if gist.public isnt true
		gists.push(
			title: gist.description
			url: gist.html_url
			date: new Date(gist.created_at)
			comments: gist.comments
		)

// copy raw to out

// render posts with layouts
// render pages with layouts

// render documents with the above

		# Ranking Helpers
		suffixNumber: suffixNumber
		floorToNearest: floorToNearest
		getAustraliaJavaScriptRank: ->
			feed = @feedr.feeds['github-australia-javascript']?.users ? null
			return getRankInUsers(feed) or 2
		getAustraliaRank: ->
			feed = @feedr.feeds['github-australia']?.users ? null
			return getRankInUsers(feed) or 4
		getGithubFollowers: (z=50) ->
			followers = @feedr.feeds['github-profile']?.followers ? null
			return followers or 709
		getStackoverflowReputation: (z=1000) ->
			reputation = @feedr.feeds['stackoverflow-profile']?.items?[0]?.reputation ? null
			return reputation or 20321

		# Project Counts
		getGithubCounts: ->
			@githubCounts or= (=>
				projects = @getProjects()
				forks = stars = 0
				total = projects.length

				topUsers = @feedr.feeds['github-top'] ? null
				me = 'balupton'
				rank = 14
				rankAustralia = 0
				contributions = 4554

				for topUser, index in topUsers
					if (topUser.location or '').indexOf('Australia') isnt -1
						++rankAustralia
					if topUser.login is me
						rank = index+1
						contributions = topUser.contributions
						break

				for project in projects
					forks += project.forks
					stars += project.watchers

				rankAustralia or= 1
				total or= 239
				forks or= 2517
				stars or= 15522

				return {forks, stars, projects:total, rank, rankAustralia, contributions}
			)()


			# Prepare repos getter
			reposGetter ?= require('getrepos').create(
				log: docpad.log
				github_client_id: githubClientId
				github_client_secret: githubClientSecret
			)

			# Fetch repos
			reposGetter.fetchReposFromUsers ['balupton','bevry','docpad','webwrite','browserstate','chainyjs','chainy-plugins','chainy-bundles','interconnectapp','js2coffee'], (err,repos=[]) ->
				# Check
				return next(err)  if err

				# Apply
				projects = repos.sort((a,b) -> b.watchers - a.watchers)
				docpad.log('info', "Fetched your latest projects for display within the website, all #{repos.length} of them")

				# Complete
				return next()

			# Return
			return true

// github-followers: @getGithubFollowers()
// github-stars: @suffixNumber @floorToNearest(@getGithubCounts().stars, 50)
// github-contributions:  @suffixNumber @floorToNearest(@getGithubCounts().contributions, 100)
// github-projects: @getGithubCounts().projects
// github-activity-rank: @suffixNumber @getGithubCounts().rank
// github-activity-rank-australia: if (a = @suffixNumber @getGithubCounts().rankAustralia) is'1st' then'' else a
// github-watch-rank-australia-javascript: <%= @suffixNumber @getAustraliaJavaScriptRank()
// github-watch-rank-australia: <%= @suffixNumber @getAustraliaRank() %>
// stackoverflow-reputation: @suffixNumber @floorToNearest @getStackoverflowReputation(), 1000

*/
