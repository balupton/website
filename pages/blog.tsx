import React from 'react'
import Layout from '../layouts/default'
import LinkList from '../components/link-list'
import Link from '../components/link'
import { getLinksByTag } from '../lib/links'
import { postComparator } from '../lib/util'

export default function BlogPage() {
	const posts = getLinksByTag('post')
	const notes = getLinksByTag('note')
	const gists = []
	return (
		<Layout code="blog" useTitle={false}>
			<section className="posts">
				<h1>Posts</h1>
				<LinkList items={posts.sort(postComparator)} />
			</section>
			<section className="posts">
				<h1>Notes</h1>
				<LinkList items={notes.sort(postComparator)} />
			</section>
			<section className="gists">
				<Link code="gists">
					<h1>Gists</h1>
				</Link>
				<LinkList items={[]} />
			</section>
		</Layout>
	)
}
