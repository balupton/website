import htm from 'htm'
import vhtml from 'vhtml'
const html = htm.bind(vhtml)

import { site } from '../../lib/config'
import { getPages } from '../../lib/links'

import { Http2ServerRequest, Http2ServerResponse } from 'http2'
export default function(req: Http2ServerRequest, res: Http2ServerResponse) {
	res.end(html`
		<?xml version="1.0" encoding="utf-8"?>
		<feed xmlns="http://www.w3.org/2005/Atom">
			<title>${site.title}</title>
			<subtitle>${site.description}</subtitle>
			<link rel="self" href="https://balupton.com/atom.xml" />
			<link href="https://balupton.com" />
			<updated>${new Date().toISOString()}</updated>
			<id>${site.url}</id>
			<author>
				<name>${site.author}</name>
			</author>
			${getPages('post').map(
				page => html`
					<entry>
						<title>${page.title || page.name}</title>
						<link href="${site.url + page.url}" />
						<updated>${new Date(page.date || '').toISOString()}</updated>
						<id>${site.url + page.url}</id>
						<content type="html">@todo</content>
					</entry>
				`
			)}
		</feed>
	`)
}
