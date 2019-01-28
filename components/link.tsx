import React from 'react'
import { Children } from '../lib/types'
import Error from './error'
import NextLink from 'next/link'
import links, { BaseLink, LinkCode } from '../lib/links'
import { StrictUnion } from 'simplytyped'

export type BaseProps = {
	children?: Children
	code?: LinkCode
	href?: string
	title?: string
	className?: string
	color?: boolean
}
export type LinkProps = StrictUnion<
	(BaseProps & { code: LinkCode }) | (BaseProps & { href: string })
>

export default function JSXLink(props: LinkProps) {
	let link: BaseLink

	if (props.code) {
		if (!links[props.code])
			return (
				<Error>
					No link for <code>{props.code}</code>
				</Error>
			)
		link = Object.assign({}, links[props.code])
		if (props.href) link.url = props.href
		if (props.title) link.title = props.title
		if (props.children) link.text = props.children
	} else {
		link = {
			url: props.href || '',
			title: props.title,
			text: props.children || ''
		}
	}

	if (!link.url) return <Error>Link is missing URL</Error>

	const style: { color?: string } = {}
	if (link.color && props.color) style.color = link.color

	return (
		<NextLink href={link.url}>
			<a title={link.title} style={style} className={props.className}>
				{link.text}
			</a>
		</NextLink>
	)
}
