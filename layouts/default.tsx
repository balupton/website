import React, { useState, useEffect } from 'react'
import { useEscapeKey } from '@bevry/hooks'

import Router from 'next/router'
import Head from 'next/head'
import NextLink from 'next/link'

import { site } from '../lib/config'
import { Link, Children, Page } from '../types'
import { useHashPages } from '../lib/hooks'
import { getLink, getLinks, getPages } from '../lib/links'

import LinkComponent from '../components/link'
import Links from '../components/links'
import Pages from '../components/pages'
import Feed from '../components/feed'
import { About, SubHeading, Copyright } from '../components/segments'
import Contact from '../components/contact'

export default function Layout({
	code,
	meta,
	children,
	title,
	useDate,
	useTitle
}: {
	code?: string
	meta?: Link
	title?: string
	children: Children
	useDate?: boolean
	useTitle?: boolean
}) {
	const page: Page = Object.assign(
		{
			useDate,
			useTitle
		},
		code ? getLink(code) : {},
		meta
	)
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
				<title>{title || page.title || page.name || site.title}</title>
				<meta name="title" content={title || page.title || page.name} />
				<meta name="author" content={page.author || site.author} />
				<meta name="description" content={page.description} />
				<meta name="keywords" content={(page.tags || []).join(', ')} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="stylesheet"
					href="//cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
				/>
				<link rel="stylesheet" href="/styles/style.css" />
				<Feed links={getLinks('feed')} />
			</Head>

			<header className="heading">
				<LinkComponent code="home">
					<h1>{site.title}</h1>
					<span className="heading-avatar" />
				</LinkComponent>
				<h2>
					<SubHeading />
				</h2>
			</header>

			<section className="menu">
				<Pages
					useDate={false}
					useDescription={false}
					active={page.url}
					pages={getPages('menu')}
				/>
			</section>

			<article className="page">
				{useTitle === false ? (
					''
				) : (
					<header>
						<NextLink href=".">
							<h1>
								<strong>{page.title}</strong>
								{useDate === false || !page.date ? (
									''
								) : (
									<small>{new Date(page.date).toDateString()}</small>
								)}
							</h1>
						</NextLink>
					</header>
				)}
				<section className="content">{children}</section>
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
				<Links useColor={true} links={getLinks('social')} />
			</aside>

			<aside className="modal referrals" style={modalReferralsStyle}>
				<Links useColor={true} links={getLinks('referral')} />
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
