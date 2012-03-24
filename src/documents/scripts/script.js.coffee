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

# Prevent Scroll Bubbling
# When the item has finished scrolling, prevent it the scroll from bubbling to parent elements
$.fn.preventScrollBubbling = ->
	$(@).bind 'mousewheel', (event, delta, deltaX, deltaY) ->
		@scrollTop -= (deltaY*20)
		event.preventDefault()

# jQuery's domReady
$ ->
	# Prevent scrolling on our sidebar scrollers
	$('.scroller').preventScrollBubbling()

# Add black and white hover effect to images
$(window).load ->
	$('.sidebar ul img').greyScale({
		fadeTime: 200
	})
