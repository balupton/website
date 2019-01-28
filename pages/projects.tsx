import React from 'react'
import Layout from '../layouts/page'
import ProjectList from '../components/project-list'
import { Projects, Stats } from '../lib/types'

interface Props {
	projects: Projects
	stats: Stats
}

export default function ProjectsPage({
	projects = [],
	stats = { githubStars: 0, githubForks: 0 }
}: Props) {
	return (
		<Layout code="projects">
			<ProjectList projects={projects} />
			<h3>Totals</h3>
			<ul>
				<li>Projects: {projects.length}</li>
				<li>Stars: {stats.githubStars}</li>
				<li>Forks: {stats.githubForks}</li>
			</ul>
		</Layout>
	)
}
