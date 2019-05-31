/* eslint camelcase:0 */
import React from 'react'
import NextLink from 'next/link'
import { Links } from '../types/app'
import { hydrateLink } from '../shared/links'

export default function List({ items }: { items: Links }) {
	return (
		<nav className="referrals">
			{items.map(item => (
				<li key={item.code} className="project">
					<NextLink href={item.url}>
						<a href={item.url} style={{ color: item.color }}>
							{item.title}
						</a>
					</NextLink>
				</li>
			))}
		</nav>
	)
}
