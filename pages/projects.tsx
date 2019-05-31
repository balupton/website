import React from 'react'
import Layout from '../layouts/default'
import Projects from '../components/list-projects'
import { Project, Stats } from '../types/app'

interface Props {
	projects: Project[]
	stats: Stats
}

export default function ProjectsPage({
	projects = [],
	stats = { githubStars: 0, githubForks: 0 }
}: Props) {
	return (
		<Layout code="projects" useTitle={false}>
			<Projects items={projects} />
			<h3>Totals</h3>
			<ul>
				<li>Projects: {projects.length}</li>
				<li>Stars: {stats.githubStars}</li>
				<li>Forks: {stats.githubForks}</li>
			</ul>
		</Layout>
	)
}
