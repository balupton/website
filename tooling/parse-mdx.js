const docmatter = require('docmatter')
module.exports = function parseMDX(src) {
	const { content, body, header } = docmatter(src)
	const meta = header ? JSON.parse(header) : {}
	meta.tags = Array.isArray(meta.tags)
		? meta.tags
		: meta.tags
		? meta.tags.split(/\s*,\s*/)
		: []
	if (meta.date) meta.date = new Date(meta.date)
	return { meta, body: body || content, header }
}
