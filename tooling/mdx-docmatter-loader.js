/* eslint prefer-rest-params:0 */
const pathUtil = require('path')
const parseMDX = require('./parse-mdx')
module.exports = async function(src) {
	let result = ''
	try {
		const callback = this.async()
		const { meta, body, header } = parseMDX(src)
		// not a document, probably a component
		if (!header) return callback(null, body)
		if (!meta.title) throw new Error('mdx document missing meta title')
		// is a document
		const useLayout = header && meta.layout !== false
		const layout = pathUtil.join(
			__dirname,
			'..',
			'layouts',
			meta.layout || 'default'
		)
		result = [
			useLayout && `import Layout from '${layout}'`,
			`export const meta = ${JSON.stringify(meta, null, '  ')}`,
			body,
			useLayout &&
				'export default ({ children }) => <Layout {...meta}>{children}</Layout>'
		]
			.filter(i => i)
			.join('\n\n')
		return callback(null, result)
	} catch (err) {
		console.error('failure:', { err, result, this: this, arguments, src })
	}
}
