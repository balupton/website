import React from 'react'
import site from '../lib/site'
import feeds from '../lib/feeds'
import menu from '../lib/menu'
import { MetaPage, Children } from '../lib/types'

import Head from 'next/head'
import Link from '../components/link'
import { About, SubHeading, Copyright } from '../components/segments'
// import Contact from '../components/contact.mdx'
import { getLinksByTag, getLink } from '../lib/links'

interface Props {
	url?: string
	meta: MetaPage
	children: Children
}

export default function DefaultLayout({ url, meta, children }: Props) {
	const title = meta.title ? `${meta.title} | ${site.title}` : site.title
	const author = meta.author || site.author
	const description = meta.description || site.description
	const keywords = site.keywords.concat(meta.keywords || []).join(', ')
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
				<meta httpEquiv="content-type" content="text/html; charset=utf-8" />
				<title>{title}</title>
				<meta name="title" content={title} />
				<meta name="author" content={author} />
				<meta name="description" content={description} />
				<meta name="keywords" content={keywords} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="stylesheet"
					href="//cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css"
				/>
				<link rel="stylesheet" href="/static/styles/style.css" />
				{feeds.map(({ href, title }) => (
					<link
						key={href}
						href={href}
						title={title}
						type="application/atom+xml"
						rel="alternate"
					/>
				))}
			</Head>

			<header className="heading">
				<Link code="home">
					<h1>{site.heading}</h1>
					<span className="heading-avatar" />
				</Link>
				<h2>
					<SubHeading />
				</h2>
			</header>

			<nav className="pages">
				<ul>
					{menu.map(code => (
						<li
							key={code}
							className={url === getLink(code).url ? 'active' : 'inactive'}
						>
							<Link code={code} />
						</li>
					))}
				</ul>
			</nav>

			<article className="page" typeof="soic:page" about={url}>
				{children}
			</article>

			<footer className="footing">
				<div className="about">
					<About />
				</div>
				<div className="copyright">
					<Copyright />
				</div>
			</footer>

			<aside className="sidebar">
				<section className="links">
					{getLinksByTag('social').map(link => (
						<h1 key={link.code}>
							<Link color={true} code={link.code} />
						</h1>
					))}
				</section>
			</aside>

			<aside className="modal referrals hide">
				<section className="links">
					{getLinksByTag('social').map(link => (
						<h3 key={link.code}>
							<Link color={true} code={link.code} />
						</h3>
					))}
				</section>
			</aside>

			<aside className="modal contact hide" />

			<aside className="modal backdrop hide" />
		</>
	)
}
