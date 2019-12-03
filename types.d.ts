import { ReactElement } from 'react'
import { StrictUnion } from 'simplytyped'

// ====================================
// JSX

type Child = string | JSX.Element | ReactElement<any>
type Children = Child | Child[]

// ====================================
// Misc

interface Link {
	url: string
	name?: string
	description?: string
	color?: string
	tags?: string[]
	referralCode?: string
	redirect?: 'permanent' | 'temporary' | 'page'
}
interface Links {
	[key: string]: Link
}

interface Page extends Link {
	author?: string
	published?: boolean
	date?: Date
	title?: string
}

interface Project {
	url: string
	html_url: string
	owner: {
		login: string
	}
	name: string
	watchers: number
	description: string
}
type Projects = Project[]

// ====================================
// Modules

declare module '*.mdx' {
	let MDXComponent: (props: Object) => JSX.Element
	export default MDXComponent
}

declare module '.data/links.json' {
	export default getPages
}
