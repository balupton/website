import React from 'react'
import { LinkProps } from '../types/app'
import Error from './error'
import NextLink from 'next/link'
import { getLink } from '../shared/links'

export default function JSXLink(props: LinkProps) {
	let data: LinkProps
	if (props.code) {
		const link = getLink(props.code)
		if (!link) return <Error>No link for: {props.code}</Error>
		data = Object.assign({}, link, props)
	} else {
		data = Object.assign({}, props)
	}

	if (!data.url) return <Error>No link URL</Error>

	const style: { color?: string } = {}
	if (props.useColor && data.color) style.color = data.color

	return (
		<NextLink href={data.url}>
			<a title={data.title} style={style} className={props.className}>
				{data.children || data.text}
			</a>
		</NextLink>
	)
}
