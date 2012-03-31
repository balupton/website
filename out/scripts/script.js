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
    #$('.scroller').preventScrollBubbling()
    $('section.vimeo a').click (event) ->
        # Continue as normal for cmd clicks etc
        return true  if event.which is 2 or event.metaKey

        # Show the fancybox
        event.preventDefault()
        $a = $(@)
        href = $a.attr('href')
        videoId = href.replace(/[^0-9]/g,'')
        video =
            id: videoId
            title: $a.attr('title')
            width: $a.data('width')
            height: $a.data('height')
        $.fancybox.open(
            href: "http://player.vimeo.com/video/#{video.id}"
            title: video.title
            width: video.width
            height: video.height
            padding: 0
            type: 'iframe'
        )
