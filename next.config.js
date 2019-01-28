const withMDX = require('./tooling/next-mdx')
const withTypescript = require('@zeit/next-typescript')
module.exports = withMDX(
	withTypescript({
		pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
		target: 'serverless'
	}),
	{
		extension: /\.mdx?$/
	}
)
