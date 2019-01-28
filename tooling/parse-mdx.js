const docmatter = require('docmatter')
module.exports = function parseMDX(src) {
	const { content, body, header } = docmatter(src)
	const meta = header ? JSON.parse(header) : {}
	meta.tags = Array.isArray(meta.tags)
		? meta.tags
		: meta.tags
		? meta.tags.split(/\s*,\s*/)
		: []
	return { meta, body: body || content, header }
}
