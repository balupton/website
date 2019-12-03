import React from 'react'
import Layout from '../layouts/default'
import Projects from '../components/projects'
import Fetch from '../components/fetch'
import { Project } from '../types'

export default function ProjectsPage({
	projects = []
}: {
	projects: Project[]
}) {
	return (
		<Layout code="projects" useTitle={false}>
			<Projects items={projects} />
			<h3>Totals</h3>
			<ul>
				<li>Projects: {projects.length}</li>
				<li>
					Stars: <Fetch url="/api/gs" />
				</li>
				<li>
					Forks: <Fetch url="/api/gf" />
				</li>
			</ul>
		</Layout>
	)
}
