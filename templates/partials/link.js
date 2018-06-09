'use strict'

const h = require('hyperscript')

module.exports = function renderLink (link) {
	return h('a', {
		title: link.title,
		color: link.color ? `${link.color} !important` : '',
		class: link.class,
		href: link.url
	}, link.text)
}
