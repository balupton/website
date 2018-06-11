/* ***
layout: page
*** */
'use strict'

const h = require('hyperscript')

const renderProjectListing = require('../partials/project-list.js')

module.exports = function renderBlog (data) {

	const { projects, stats } = data

	return [
		renderProjectListing({
			projects
		}),
		h('h3', 'Totals'),
		h('ul', [
			h('li', `Projects: ${projects.length}`),
			h('li', `Stars: ${stats.githubStars}`),
			h('li', `Forks: ${stats.githubForks}`)
		])
	]
}
