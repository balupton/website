import React from 'react'
import { Document, Documents } from '../lib/types'

export default function JSXDocuments({ documents }: { documents: Documents }) {
	return (
		<nav className="document-list" typeof="dc:collection">
			{documents.map(({ url, title, date, description }) => (
				<li key={url} className="document" typeof="soic:post" about={url}>
					<div className="document-header">
						<a className="document-link" href={url}>
							<strong className="document-title" property="dc:title">
								{title}
							</strong>
							<small className="document-date" property="dc:date">
								{new Date(date).toDateString()}
							</small>
						</a>
					</div>
					{!description ? (
						''
					) : (
						<p className="document-description" property="dc:description">
							{description}
						</p>
					)}
				</li>
			))}
		</nav>
	)
}
