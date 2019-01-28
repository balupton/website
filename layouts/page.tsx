import React from 'react'
import { MetaPage, Children } from '../lib/types'
import DefaultLayout from './default'
import Link from '../components/link'
import { getLink } from '../lib/links'

interface Props {
	code: string
	title?: string | false
	meta?: MetaPage
	children: Children
}

export default function PageLayout({
	code,
	title,
	meta = {},
	children
}: Props) {
	const link = getLink(code)
	const _title = title !== false ? title || meta.title || '' : ''
	const url = link ? link.url : ''
	return (
		<DefaultLayout url={url} meta={meta}>
			{_title ? (
				''
			) : (
				<header className="page-header">
					<Link href=".">
						<h1 property="dcterms:title">{_title}</h1>
					</Link>
				</header>
			)}
			<div className="page-content" property="soic:content">
				{children}
			</div>
		</DefaultLayout>
	)
}
