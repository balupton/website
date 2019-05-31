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

export type Tag = string
export type Tags = Tag[]
export type Code = string

export type LinkTag =
	| 'referral'
	| 'recommendation'
	| 'social'
	| 'alias'
	| 'feed'
	| 'donate'
	| Tag
export type LinkTags = LinkTag[]

export type DirectoryTags = { [key: string]: string[] }

export interface RawMeta {
	author?: string
	date?: string | Date
	description?: string
	linkTitle?: string
	pageTitle?: string
	published?: boolean
	tags?: Tag | Tags
	title?: string
	url?: string
	code?: Code
}

export interface Meta extends RawMeta {
	title: string
	tags: Tags
}

export type Page = Partial<Meta>
export interface PageProps extends Page {
	children?: Children
	useDate?: boolean
	useTitle?: boolean
}

export interface Site extends Partial<Meta> {
	url: string
	heading: string
	menu: Code[]
	email: string
	tags: Tags
}

export interface RawLink extends Partial<Meta> {
	url: string
	text: string
	color?: string
	tags?: LinkTags
}
export interface Link extends RawLink {
	tags: LinkTags
	code: Code
	alias: boolean
}

export interface LinkProps extends Partial<Link> {
	children?: Children
}

export type Links = Link[]
export type RawLinkMap = { [key: string]: RawLink }
export type LinkMap = { [key: string]: Link }
export type LinkCache = { [key: string]: Links }
export type LinkAliasMap = { [key: string]: Code }
