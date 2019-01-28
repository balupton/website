import React from 'react'
import Link from './link'
import { Links } from '../types/app'

export default function JSXDocuments({ items }: { items: Links }) {
	return (
		<nav className="link-list" typeof="dc:collection">
			{items.map(({ url, title, date, description }) => (
				<li key={url} className="document" typeof="soic:post" about={url}>
					<div className="link-header">
						<Link className="link-link" url={url}>
							<strong className="link-title" property="dc:title">
								{title}
							</strong>
							{!date ? (
								''
							) : (
								<small className="link-date" property="dc:date">
									{date.toDateString()}
								</small>
							)}
						</Link>
					</div>
					{!description ? (
						''
					) : (
						<p className="link-description" property="dc:description">
							{description}
						</p>
					)}
				</li>
			))}
		</nav>
	)
}
