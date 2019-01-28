import React from 'react'
import { MetaPost, Children } from '../lib/types'
import DefaultLayout from './default'
import Link from '../components/link'

interface Props {
	meta: MetaPost
	children: Children
}

export default function PageLayout(props: Props) {
	console.log(props)
	const { meta, children } = props
	return (
		<DefaultLayout url="/blog" meta={meta}>
			{!meta.title ? (
				''
			) : (
				<header className="page-header">
					<Link href="." className="page-link">
						<h1>
							<strong className="page-title" property="dcterms:title">
								{meta.title}
							</strong>
							<small className="page-date" property="dc:date">
								{new Date(meta.date).toDateString()}
							</small>
						</h1>
					</Link>
				</header>
			)}
			<div className="page-content" property="soic:content">
				{children}
			</div>
		</DefaultLayout>
	)
}
