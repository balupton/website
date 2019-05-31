import React, { useState, useEffect } from 'react'
import { useEscapeKey } from '@bevry/hooks'

import { site } from '../config'
import { PageProps } from '../types/app'
import { uniq } from '../shared/util'
import Router from 'next/router'
import Head from 'next/head'
import NextLink from 'next/link'
import Link from '../components/link'
import Referrals from '../components/list-referrals'
import Sidebar from '../components/list-sidebar'
import Pages from '../components/list-pages'
import { About, SubHeading, Copyright } from '../components/segments'
import Contact from '../components/contact.mdx'
import { getLinksByTag, getLink, hydrateLink } from '../shared/links'
import { useHashPages } from '../client/hooks'

export default function DefaultLayout(pageProps: PageProps) {
	const link = pageProps.code ? getLink(pageProps.code) : null
	const data = Object.assign({}, site, link, pageProps)
	const tags = uniq(site.tags, link && link.tags, pageProps.tags)
	const pageTitle = data.pageTitle || data.title
	useEscapeKey(function() {
		Router.push(Router.pathname)
	})
	const modal = useHashPages({
		contact: ['contact', '📨', '%F0%9F%93%A8'],
		referrals: ['referrals', '💸', '%F0%9F%92%B8']
	})
	const showStyle = { display: 'block' }
	const hideStyle = { display: 'none' }
	const modalContactStyle = modal === 'contact' ? showStyle : hideStyle
	const modalReferralsStyle = modal === 'referrals' ? showStyle : hideStyle
	const modalBackdropStyle = modal ? showStyle : hideStyle
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
				<meta httpEquiv="content-type" content="text/html; charset=utf-8" />
				<title>{pageTitle}</title>
				<meta name="title" content={pageTitle} />
				<meta name="author" content={data.author} />
				<meta name="description" content={data.description} />
				<meta name="keywords" content={tags.join(', ')} />
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

			<section className="menu">
				<Pages active={data.url} items={site.menu.map(code => getLink(code))} />
			</section>

			<article className="page">
				{data.useTitle === false ? (
					''
				) : (
					<header>
						<NextLink href=".">
							<h1>
								<strong>{pageTitle}</strong>
								{data.useDate === false || !data.date ? (
									''
								) : (
									<small>{new Date(data.date).toDateString()}</small>
								)}
							</h1>
						</NextLink>
					</header>
				)}
				<section className="content">{data.children}</section>
			</article>

			<footer className="footing">
				<section className="about">
					<About />
				</section>
				<section className="copyright">
					<Copyright />
				</section>
			</footer>

			<aside className="sidebar">
				<Sidebar items={getLinksByTag('social')} />
			</aside>

			<aside className="modal referrals" style={modalReferralsStyle}>
				<Referrals items={getLinksByTag('referral')} />
			</aside>

			<aside className="modal contact" style={modalContactStyle}>
				<Contact />
			</aside>

			<NextLink href={{ hash: '🏡' }}>
				<aside className="modal backdrop" style={modalBackdropStyle} />
			</NextLink>
		</>
	)
}
