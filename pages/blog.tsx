import React from 'react'
import Layout from '../layouts/default'
import Pages from '../components/list-pages'
import Link from '../components/link'
import { getLinksByTag } from '../shared/links'
import { postComparator } from '../shared/util'

export default function BlogPage() {
	const posts = getLinksByTag('post')
	const notes = getLinksByTag('note')
	const gists = []
	return (
		<Layout code="blog" useTitle={false}>
			<section className="posts">
				<h1>Posts</h1>
				<Pages items={posts.sort(postComparator)} />
			</section>
			<section className="posts">
				<h1>Notes</h1>
				<Pages items={notes.sort(postComparator)} />
			</section>
			<section className="gists">
				<Link code="gists">
					<h1>Gists</h1>
				</Link>
				<Pages items={[]} />
			</section>
		</Layout>
	)
}
