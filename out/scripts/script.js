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

  $(function() {});

}).call(this);
