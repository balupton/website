import React from 'react'
import { site } from '../config'
import { SiteProps } from '../types/app'
import { uniq } from '../lib/util'

import Head from 'next/head'
import Link from '../components/link'
import { About, SubHeading, Copyright } from '../components/segments'
import Contact from '../components/contact.mdx'
import { getLinksByTag, getLink } from '../lib/links'

export default function DefaultLayout(props: SiteProps) {
	const link = props.code ? getLink(props.code) : null
	const data = Object.assign({}, site, link, props)
	data.tags = uniq(site.tags, link && link.tags, props && props.tags)
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
				<meta httpEquiv="content-type" content="text/html; charset=utf-8" />
				<title>{data.title}</title>
				<meta name="title" content={data.title} />
				<meta name="author" content={data.author} />
				<meta name="description" content={data.description} />
				<meta name="keywords" content={data.tags.join(', ')} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="stylesheet"
					href="//cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css"
				/>
				<link rel="stylesheet" href="/static/styles/style.css" />
				{getLinksByTag('feed').map(({ code, url, text }) => (
					<link
						key={code}
						href={url}
						title={text as string}
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
					{site.menu.map(code => (
						<li
							key={code}
							className={data.url === getLink(code).url ? 'active' : 'inactive'}
						>
							<Link code={code} />
						</li>
					))}
				</ul>
			</nav>

			<article className="page" typeof="soic:page" about={data.url}>
				{data.useTitle === false || !data.title ? (
					''
				) : (
					<header className="page-header">
						<Link url="." className="page-link">
							<h1>
								<strong className="page-title" property="dcterms:title">
									{data.title}
								</strong>
								{data.useDate === false || !data.date ? (
									''
								) : (
									<small className="page-date" property="dc:date">
										{new Date(data.date).toDateString()}
									</small>
								)}
							</h1>
						</Link>
					</header>
				)}
				<div className="page-content" property="soic:content">
					{data.children}
				</div>
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
							<Link useColor={true} code={link.code} />
						</h1>
					))}
				</section>
			</aside>

			<aside className="modal referrals hide">
				<section className="links">
					{getLinksByTag('social').map(link => (
						<h3 key={link.code}>
							<Link useColor={true} code={link.code} />
						</h3>
					))}
				</section>
			</aside>

			<aside className="modal contact hide">
				<Contact />
			</aside>

			<aside className="modal backdrop hide" />
		</>
	)
}
