/* eslint camelcase:0 */
import React from 'react'
import Link from './link'
import { Projects } from '../types/app'

export default function JSXProjects({ items }: { items: Projects }) {
	return (
		<>
			<nav className="project-list" typeof="dc:collection">
				{items.map(({ url, html_url, owner, name, watchers, description }) => (
					<li key={url} className="project" typeof="soic:post" about={url}>
						<div className="project-header">
							<Link className="project-link" url={html_url}>
								<em className="project-owner" property="dc:owner">
									{owner.login}
								</em>
								/
								<strong className="project-name" property="dc:name">
									{name}
								</strong>
								<strong className="project-stars" property="dc:stars">
									{watchers} stars
								</strong>
							</Link>
						</div>
						{!description ? (
							''
						) : (
							<p className="project-description" property="dc:description">
								{description}
							</p>
						)}
					</li>
				))}
			</nav>
		</>
	)
}
