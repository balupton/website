(function() {
  var images, img, _i, _len;

  images = document.getElementsByTagName('img');

  for (_i = 0, _len = images.length; _i < _len; _i++) {
    img = images[_i];
    img.onerror = function() {
      var a, li;
      a = this.parentNode;
      li = a.parentNode;
      if (li.tagName.toLowerCase() === 'li') {
        return li.parentNode.removeChild(li);
      } else {
        return this.parentNode.removeChild(this);
      }
    };
  }

  $.fn.preventScrollBubbling = function() {
    return $(this).bind('mousewheel', function(event, delta, deltaX, deltaY) {
      this.scrollTop -= deltaY * 20;
      return event.preventDefault();
    });
  };

  $(function() {
    $('section.vimeo a').click(function(event) {
      var $a, href, video, videoId;
      if (event.which === 2 || event.metaKey) {
        return true;
      }
      event.preventDefault();
      $a = $(this);
      href = $a.attr('href');
      videoId = href.replace(/[^0-9]/g, '');
      video = {
        id: videoId,
        title: $a.attr('title'),
        width: $a.data('width'),
        height: $a.data('height')
      };
      return $.fancybox.open({
        href: "http://player.vimeo.com/video/" + video.id,
        title: video.title,
        width: video.width,
        height: video.height,
        padding: 0,
        type: 'iframe'
      });
    });
    $('.js').removeClass('js');
    $('.more-to-read').hide();
    return $('.read-more').click(function() {
      return $(this).hide().next('.more-to-read').show();
    });
  });

}).call(this);
