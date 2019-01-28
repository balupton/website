/* eslint camelcase:0 */
import React from 'react'
import { Project, Projects } from '../lib/types'

function JSXProject({
	url,
	html_url,
	owner,
	name,
	watchers,
	description
}: Project) {
	return (
		<li className="project" typeof="soic:post" about={url}>
			<div className="project-header">
				<a className="project-link" href={html_url}>
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
				</a>
			</div>
			{!description ? (
				''
			) : (
				<p className="project-description" property="dc:description">
					{description}
				</p>
			)}
		</li>
	)
}

export default function JSXProjects({ projects }: { projects: Projects }) {
	return (
		<>
			<nav className="project-list" typeof="dc:collection">
				{projects.map(JSXProject)}
			</nav>
		</>
	)
}
