import React from 'react'
import Layout from '../layouts/default'
import Pages from '../components/pages'
import Link from '../components/link'
import { getPages } from '../lib/links'

export default function BlogPage() {
	const posts = getPages('post')
	const notes = getPages('note')
	const gists = []
	return (
		<Layout code="blog" useTitle={false}>
			<section className="posts">
				<h1>Posts</h1>
				<Pages pages={posts} />
			</section>
			<section className="posts">
				<h1>Notes</h1>
				<Pages pages={notes} />
			</section>
			<section className="gists">
				<Link code="gists">
					<h1>Gists</h1>
				</Link>
				<Pages pages={[]} />
			</section>
		</Layout>
	)
}
