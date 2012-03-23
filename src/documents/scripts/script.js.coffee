###
Coded in CoffeeScript: http://coffeescript.org/

We've already included the following for you to get started real quick:
- jQuery: http://jquery.com/
- Modernizr: http://www.modernizr.com/
- Underscore: http://documentcloud.github.com/underscore/
- Backbone: http://documentcloud.github.com/backbone/
###

# Hide failed images
images = document.getElementsByTagName('img')
for img in images
	img.onerror = ->
		a = @parentNode
		li = a.parentNode
		if li.tagName.toLowerCase() is 'li'
			li.parentNode.removeChild(li)
		else
			@parentNode.removeChild(@)


# jQuery's domReady
$ ->
	# Do something once the DOM is ready