import React from 'react'
import Layout from '../layouts/page'
import DocumentList from '../components/document-list'
import Link from '../components/link'
import { Documents } from '../lib/types'

interface Props {
	documents: Documents
	gists: Documents
}

export default function BlogPage({ documents = [], gists = [] }: Props) {
	return (
		<Layout code="blog">
			<DocumentList documents={documents} />
			<section className="gists">
				<Link code="gists">
					<h1>Gists</h1>
				</Link>
				<DocumentList documents={gists} />
			</section>
		</Layout>
	)
}
