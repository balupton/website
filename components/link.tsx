/* eslint camelcase:0 */
import React from 'react'
import NextLink from 'next/link'

import { Link, Children } from '../types.js'

import { getLink, trim } from '../lib/links'

function clean(value: string) {
	return value.replace(/^\/+/, '').replace(/[/#]+$/, '')
}

export default function LinkComponent({
	url,
	code,
	useColor = false,
	link,
	children
}: {
	url?: string
	code?: string
	useColor?: boolean
	link?: Link
	children?: Children
}) {
	let item: Link
	if (url) item = { url }
	else if (link) item = link
	else if (code) {
		item = getLink(code)
	} else {
		throw new Error('no link or code passed')
	}

	const style: { color?: string } = {}
	if (useColor && item.color) style.color = item.color

	const el = (
		<a title={item.description} href={item.url} style={style}>
			{children || item.name || item.url}
		</a>
	)

	const trimmed = trim(item.url)
	if (trimmed === item.url) return el
	else return <NextLink href={trimmed}>{el}</NextLink>
}
