const { withMDX } = require('@bevry/mdx')
module.exports = withMDX(
	{
		pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
		target: 'serverless'
	},
	{
		extension: /\.mdx?$/
	}
)
