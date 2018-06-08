'use strict'

const h = require('hyperscript')

const renderLink = require('../partials/link')
const renderContact = require('../partials/contact')

module.exports = function defaultLayout (data) {

	const { site, document, feeds, links, menu, currentURL } = data
	const { url, datePublished, title, author, description, keywords, content } = document

	return (
		'<!DOCTYPE html>' +
		h('html', { lang: 'en' }, [
			h('head', [
				h('meta', { charset: 'utf-8' }),
				h('meta', { 'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge,chrome=1' }),
				h('meta', { 'http-equiv': 'content-type', 'content': 'text/html; charset=utf-8' }),
				h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),

				h('title', title),

				/* @todo prepared template helpers */
				h('meta', { name: 'title', content: title }),
				h('meta', { name: 'author', content: author }),
				h('meta', { name: 'description', content: description }),
				h('meta', { name: 'keywords', content: keywords }),

				h('link', { rel: 'stylesheet', href: '//cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css' }),
				h('link', { rel: 'stylesheet', href: '/styles/style.css' }),

				feeds.map(
					({ href, title }) =>
						h('link', {
							href,
							title,
							type: 'application/atom+xml',
							rel: 'alternate'
						})
				)
			]),

			h('body', [
				h('header.heading', [
					h('a', { href: '/', title: 'Return home' }, [
						h('h1', site.text.heading),
						h('span.heading-avatar')
					]),
					h('h2', site.text.subheading)
				]),
				h('nav.pages', [
					h('ul',
						menu.map(({ url, title, text }) =>
							h('li', { class: url === currentURL ? 'active' : 'inactive' }, [
								h('a', { href: url, title }, text)
							])
						)
					)
				]),

				h('article.page', {
					typeof: 'soic:page',
					about: url,
					datetime: datePublished.toISOString()
				}, content),

				h('footer.footing', [
					h('div.about', site.text.about),
					h('div.copyright', site.text.copyright)
				]),

				h('aside.sidebar', [
					h('section.links', links
						.filter((link) => link.social)
						.map((link) =>
							h('h1', renderLink(link))
						)
					)
				]),

				h('script', { defer: true, src: '//cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js' }),
				h('script', { defer: true, src: '/scripts/script.js' }),

				h('aside.modal.referrals.hide', [
					h('section.links', links
						.filter((link) => link.referral)
						.map((link) =>
							h('h3', renderLink(link, link.title))
						)
					)
				]),

				h('aside.modal.contact.hide', renderContact()),

				h('aside.modal.backdrop.hide')

			])
		]).outerHTML
	)
}
