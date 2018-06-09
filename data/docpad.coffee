# =================================
# Misc Configuration


# =================================
# DocPad Configuration

# -------------------------------------
# Helpers

getRankInUsers = (users=[]) ->
	rank = null

	for user,index in users
		if user.login is 'balupton'
			rank = String(index+1)
			break

	return rank

module.exports =


	# =================================
	# Plugin Configuration

		cleanurls:
			simpleRedirects: simpleRedirects

			advancedRedirects: [
				# Old URLs
				[/^https?:\/\/(?:www\.balupton\.com|(?:www\.)?lupton\.cc|balupton\.herokuapp\.com|balupton\.github\.io\/website)(.*)$/, 'https://balupton.com$1']

				# Demos
				[/^\/sandbox(?:\/([^\/]+).*)?$/, 'https://balupton.github.io/$1/demo/']

				# Projects
				[/^\/(?:projects?\/|(?:g|gh|github)\/?)(.+)$/, 'https://github.com/balupton/$1']

				# Amazon
				[/^\/amazon\/(.+)/, "https://read.amazon.com/kp/embed?asin=$1&tag=#{amazonCode}"]
			]

	# Add simple redirect
	simpleRedirects['/'+key] = value.url

