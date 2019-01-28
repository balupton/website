import { ReactElement } from 'react'

export type Child = string | JSX.Element | ReactElement<any>
export type Children = Child | Child[]

export interface Stats {
	githubStars: number
	githubForks: number
}

interface File {
	basename: string
	extension: string
	directory: string
	path: string
	url: string
}
type Files = File[]

export interface Document {
	url: string
	title: string
	date: string
	description: string
}
export type Documents = Document[]

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

type MetaPost = {
	date: string
	title: string
	keywords?: string
	description?: string
	author?: string
}

type MetaPage = Partial<MetaPost>
