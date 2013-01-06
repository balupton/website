---
layout: default
---

# Title
if @document.title
	header '.page-header', ->
		h1 ->
			a '.page-link', href:@document.url, ->
				strong '.page-title', property:'dcterms:title', ->
					@document.title
				small '.page-date', property:'dc:date', ->
					" #{@document.date.toShortDateString()}"

# Content
div '.page-content', property: 'sioc:content',
	-> @content

# Footer
footer '.page-footer', ->
	# Subscribe Buttons
	section '.page-subscribe.subscribeButtons', ->
		# Like
		div '.subscribeButton.like', ->
			text """
				<iframe src="//www.facebook.com/plugins/like.php?href=#{h @site.url+@document.url}&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=false&amp;font&amp;colorscheme=light&amp;action=like&amp;height=21&amp;appId=266367676718271" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:21px;" allowTransparency="true"></iframe>
				"""

		# Facebook
		div '.subscribeButton.facebook', ->
			text """
				<iframe src="//www.facebook.com/plugins/follow.php?href=https%3A%2F%2Fwww.facebook.com%2Fbalupton&amp;layout=button_count&amp;show_faces=false&amp;colorscheme=light&amp;font&amp;width=450&amp;appId=266367676718271" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height: 20px;" allowTransparency="true"></iframe>
				"""

		# Tweet
		div '.subscribeButton.tweet', ->
			text """
				<a href="https://twitter.com/share" class="twitter-share-button" data-via="balupton" data-related="balupton">Tweet</a>
				<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
				"""

		# Twitter
		div '.subscribeButton.twitter', ->
			text """
				<a href="https://twitter.com/balupton" class="twitter-follow-button" data-show-count="false">Follow @balupton</a>
				<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
				"""

		# Quora
		div '.subscribeButton.quora', ->
			text """
				<span class="quora-follow-button" data-name="Benjamin-Lupton">
					Follow <a href="http://www.quora.com/Benjamin-Lupton">Benjamin Lupton</a> on <a href="http://www.quora.com">Quora</a>
					<script type="text/javascript" src="//www.quora.com/widgets/follow?embed_code=7N31XJs"></script>
				</span>
				"""

	# Related Posts
	relatedPosts = []
	for document in @document.relatedDocuments or []
		if document.url.indexOf('/blog') is 0 and document.url.indexOf('/blog/index') isnt 0
			relatedPosts.push(document)
	if relatedPosts.length
		section '.related-documents', ->
			h2 -> 'Related Posts'
			text @partial 'content/document-list', {
				documents: relatedPosts
			}

	# Disqus
	section '.page-comments', ->
		text @partial('services/disqus', @)