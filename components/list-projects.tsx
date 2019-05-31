/* eslint camelcase:0 */
import React from 'react'
import NextLink from 'next/link'
import { Projects } from '../types/app'

export default function List({ items }: { items: Projects }) {
	return (
		<nav className="projects">
			{items.map(item => (
				<li key={item.html_url}>
					<NextLink href={item.html_url}>
						<a href={item.html_url}>
							<em className="project-owner">{item.owner.login}</em>/
							<strong className="project-name">{item.name}</strong>
							<strong className="project-stars">{item.watchers} stars</strong>
						</a>
					</NextLink>
					<p>{item.description}</p>
				</li>
			))}
		</nav>
	)
}
