/*
 *	jQuery $.greyScale Plugin v0.2
 *	Written by Andrew Pryde (www.pryde-design.co.uk)
 *	Date: Mon 1 Aug 2011
 *	Licence: MIT Licence
 *
 *	Copyright (c) 2011 Andrew Pryde
 *	Permission is hereby granted, free of charge, to any person obtaining a copy of this 
 *	software and associated documentation files (the "Software"), to deal in the Software
 *	without restriction, including without limitation the rights to use, copy, modify, merge,
 *	publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
 *	to whom the Software is furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in all copies or 
 *	substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 *	BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 *	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 *	DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function($){

	$.fn.greyScale = function(args) {
		var options = $.extend({
			fadeTime: $.fx.speeds._default,
			reverse: false
		}, args);
		function greyScale(image, width, height) {
			var can = $('<canvas>')
				.css({
					display: 'none',
					position: 'absolute',
					left: 0,
					top: 0
				})
				.attr({
					width: width,
					height: height
				})
				.addClass('gsCanvas');
			var ctx = can[0].getContext('2d');
			ctx.drawImage(image, 0, 0, width, height);
			var imageData = ctx.getImageData(0, 0,	width, height);
			var px = imageData.data;
			var grey;
			for (i = 0; i < px.length; i+= 4) {
				grey = px[i] * .3 + px[i+1] * .59 + px[i+2] * .11;
				px[i] = px[i+1] = px[i+2] = grey;
			}
			ctx.putImageData(imageData, 0, 0);
			return can;
		}
		if ($.browser.msie) {
			// IE doesn't support Canvas so use it's horrible filter syntax instead
			this.each(function(){
				var greyscale = options.reverse ? 0 : 1;
				$(this).css({
					'filter': 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=' + greyscale + ')',
					'zoom': '1'
				});
				$(this).hover(function() {
					var greyscale = options.reverse ? 1 : 0;
					$(this).css({
						'filter': 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=' + greyscale + ')'
					});
				}, function() {
					var greyscale = options.reverse ? 0 : 1;
					$(this).css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=' + greyscale + ')');
				});
			});
		} else {
			this.each(function(index) {
				var $img = $(this);
				var width = $img.width(), height = $img.height();
				$img
					.wrap('<span class="gsWrapper">')
					.css({
						position: 'absolute',
						left: 0,
						top: 0,
						width: width,
						height: height
					})
				var $wrapper = $img.parent()
					.css({
						position: 'relative',
						display: 'inline-block',
						width: width,
						height: height
					});
				var can = greyScale($img[0], width, height);
				if (options.reverse) {
					can.appendTo($wrapper).css({
						display: "block",
						opacity: 0
					});
				}
				else {
					can.appendTo($wrapper).fadeIn(options.fadeTime);
				}
		});

		$(this).parent().on('mouseover mouseout', '.gsCanvas', function(event) {
			over = options.reverse ? 1 : 0;
			out = options.reverse ? 0 : 1;
			(event.type == 'mouseover') && $(this).stop().animate({'opacity': over}, options.fadeTime);
			(event.type == 'mouseout') && $(this).stop().animate({'opacity': out}, options.fadeTime); 
		});
	}
	};
})( jQuery );
