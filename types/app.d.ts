import { ReactElement } from 'react'
import { StrictUnion } from 'simplytyped'

// ====================================
// JSX

export type Child = string | JSX.Element | ReactElement<any>
export type Children = Child | Child[]

// ====================================
// Misc

export interface Stats {
	githubStars: number
	githubForks: number
}

export interface Project {
	url: string
	html_url: string
	owner: {
		login: string
	}
	name: string
	watchers: number
	description: string
}
export type Projects = Project[]

// ====================================
// Meta

export type LinkCode = string

export type Tag =
	| 'referral'
	| 'recommendation'
	| 'social'
	| 'alias'
	| 'feed'
	| string
export type Tags = Tag[]

export type DirectoryTags = { [key: string]: Tags }

export interface Site {
	url: string
	title: string
	author: string
	heading: string
	email: string
	description: string
	tags: Tags
	menu: LinkCode[]
}

export interface SiteProps extends Partial<Site> {
	children: Children
	url?: string
	code?: string
	useTitle?: boolean
	useDate?: boolean
}

export interface RawMeta {
	date: string
	title: string
	tags?: string | Tags
	description?: string
	author?: string
	published?: boolean
	className?: string
	color?: string
}

export interface Meta extends RawMeta {
	tags: Tags
}

// ====================================
// Links

export interface RawLink extends Partial<Meta> {
	url: string
	text: string
	as?: string
	alias?: boolean
}
export interface Link extends RawLink {
	tags: Tags
	code: LinkCode
	alias: boolean
}
export interface LinkProps extends Partial<Link> {
	children?: Children
	useColor?: boolean
}

export type Links = Link[]
export type RawLinkMap = { [key: string]: RawLink }
export type LinkMap = { [key: string]: Link }
export type LinkCache = { [key: string]: Links }
export type LinkAliasMap = { [key: string]: LinkCode }
