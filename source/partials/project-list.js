/* eslint camelcase:0 */
'use strict'

const h = require('hyperscript')

module.exports = function renderProjectListing (data) {
	const { projects } = data

	return h('nav.project-list', { typeof: 'dc:collection' }, projects.map(({ url, html_url, owner, name, watchers, description }) =>
		h('li.project', { typeof: 'soic:post', about: url }, [
			h('div.project-header', [
				h('a.project-link', { href: html_url }, [
					h('em.project-owner', { property: 'dc:owner' }, owner.login),
					' / ',
					h('strong.project-name', { property: 'dc:name' }, name),
					h('strong.project-stars', { property: 'dc:stars' }, `${watchers} stars`)
				])
			]),
			description
				? h('p.project-description', { property: 'dc:description' }, description)
				: ''
		])
	))
}
