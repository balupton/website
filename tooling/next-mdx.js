// https://github.com/zeit/next-plugins/pull/389
const pathUtil = require('path')
module.exports = (nextConfig = {}, pluginOptions = {}) => {
	const extension = pluginOptions.extension || /\.mdx$/

	return Object.assign({}, nextConfig, {
		webpack(config, options) {
			if (!options.defaultLoaders) {
				throw new Error(
					'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
				)
			}

			config.module.rules.push({
				test: extension,
				use: [
					options.defaultLoaders.babel,
					{
						loader: '@mdx-js/loader',
						options: pluginOptions.options
					},
					pathUtil.join(__dirname, './mdx-docmatter-loader')
				]
			})

			if (typeof nextConfig.webpack === 'function') {
				return nextConfig.webpack(config, options)
			}

			return config
		}
	})
}
