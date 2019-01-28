const withTypescript = require('@zeit/next-typescript')
const withMDX = require('@zeit/next-mdx')({
	extension: /\.mdx?$/
})
module.exports = withMDX(
	withTypescript({
		pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
		target: 'serverless'
	})
)
