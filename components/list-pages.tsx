/* eslint camelcase:0 */
import React from 'react'
import NextLink from 'next/link'
import { Links } from '../types/app'
import { hydrateLink } from '../shared/links'

export default function List({
	items,
	active
}: {
	items: Links
	active?: string
}) {
	return (
		<nav className="pages">
			{items.map(item => (
				<li
					key={item.code}
					className={
						active ? (active === item.url ? 'active' : 'inactive') : ''
					}
				>
					<NextLink href={item.url}>
						<a title={item.linkTitle || item.title} href={item.url}>
							<strong>{item.text}</strong>
							{item.date ? (
								<small>{new Date(item.date).toDateString()}</small>
							) : (
								''
							)}
						</a>
					</NextLink>
					{item.description ? <p>{item.description}</p> : ''}
				</li>
			))}
		</nav>
	)
}
