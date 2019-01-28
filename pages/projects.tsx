import React from 'react'
import Layout from '../layouts/default'
import ProjectList from '../components/project-list'
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
			<ProjectList items={projects} />
			<h3>Totals</h3>
			<ul>
				<li>Projects: {projects.length}</li>
				<li>Stars: {stats.githubStars}</li>
				<li>Forks: {stats.githubForks}</li>
			</ul>
		</Layout>
	)
}
