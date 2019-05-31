/* eslint camelcase:0 */
import React from 'react'
import NextLink from 'next/link'
import { LinkProps } from '../types/app'
import { hydrateLink } from '../shared/links'

export default function List(data: LinkProps) {
	const item = hydrateLink(data)
	return (
		<NextLink href={item.url}>
			<a title={item.linkTitle || item.title} href={item.url}>
				{data.children || item.text}
			</a>
		</NextLink>
	)
}
