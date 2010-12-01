
(function($){$.toJSON=function(o)
{if(typeof(JSON)=='object'&&JSON.stringify)
return JSON.stringify(o);var type=typeof(o);if(o===null)
return"null";if(type=="undefined")
return undefined;if(type=="number"||type=="boolean")
return o+"";if(type=="string")
return $.quoteString(o);if(type=='object')
{if(typeof o.toJSON=="function")
return $.toJSON(o.toJSON());if(o.constructor===Date)
{var month=o.getUTCMonth()+1;if(month<10)month='0'+month;var day=o.getUTCDate();if(day<10)day='0'+day;var year=o.getUTCFullYear();var hours=o.getUTCHours();if(hours<10)hours='0'+hours;var minutes=o.getUTCMinutes();if(minutes<10)minutes='0'+minutes;var seconds=o.getUTCSeconds();if(seconds<10)seconds='0'+seconds;var milli=o.getUTCMilliseconds();if(milli<100)milli='0'+milli;if(milli<10)milli='0'+milli;return'"'+year+'-'+month+'-'+day+'T'+
hours+':'+minutes+':'+seconds+'.'+milli+'Z"';}
if(o.constructor===Array)
{var ret=[];for(var i=0;i<o.length;i++)
ret.push($.toJSON(o[i])||"null");return"["+ret.join(",")+"]";}
var pairs=[];for(var k in o){var name;var type=typeof k;if(type=="number")
name='"'+k+'"';else if(type=="string")
name=$.quoteString(k);else
continue;if(typeof o[k]=="function")
continue;var val=$.toJSON(o[k]);pairs.push(name+":"+val);}
return"{"+pairs.join(", ")+"}";}};$.evalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);return eval("("+src+")");};$.secureEvalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);var filtered=src;filtered=filtered.replace(/\\["\\\/bfnrtu]/g,'@');filtered=filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']');filtered=filtered.replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered))
return eval("("+src+")");else
throw new SyntaxError("Error parsing JSON, source is not valid.");};$.quoteString=function(string)
{if(string.match(_escapeable))
{return'"'+string.replace(_escapeable,function(a)
{var c=_meta[a];if(typeof c==='string')return c;c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
return'"'+string+'"';};var _escapeable=/["\\\x00-\x1f\x7f-\x9f]/g;var _meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};})(jQuery);/* Copyright (c) 2006-2007 Mathias Bank (http://www.mathias-bank.de)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * 
 * Version 2.1
 * 
 * Thanks to 
 * Hinnerk Ruemenapf - http://hinnerk.ruemenapf.de/ for bug reporting and fixing.
 * Tom Leonard for some improvements
 * 
 */
jQuery.fn.extend({
/**
* Returns get parameters.
*
* If the desired param does not exist, null will be returned
*
* To get the document params:
* @example value = $(document).getUrlParam("paramName");
* 
* To get the params of a html-attribut (uses src attribute)
* @example value = $('#imgLink').getUrlParam("paramName");
*/ 
 getUrlParam: function(strParamName){
	  strParamName = escape(unescape(strParamName));
	  
	  var returnVal = new Array();
	  var qString = null;
	  
	  if ($(this).attr("nodeName")=="#document") {
	  	//document-handler
		
		if (window.location.search.search(strParamName) > -1 ){
			
			qString = window.location.search.substr(1,window.location.search.length).split("&");
		}
			
	  } else if ($(this).attr("src")!="undefined") {
	  	
	  	var strHref = $(this).attr("src")
	  	if ( strHref.indexOf("?") > -1 ){
	    	var strQueryString = strHref.substr(strHref.indexOf("?")+1);
	  		qString = strQueryString.split("&");
	  	}
	  } else if ($(this).attr("href")!="undefined") {
	  	
	  	var strHref = $(this).attr("href")
	  	if ( strHref.indexOf("?") > -1 ){
	    	var strQueryString = strHref.substr(strHref.indexOf("?")+1);
	  		qString = strQueryString.split("&");
	  	}
	  } else {
	  	return null;
	  }
	  	
	  
	  if (qString==null) return null;
	  
	  
	  for (var i=0;i<qString.length; i++){
			if (escape(unescape(qString[i].split("=")[0])) == strParamName){
				returnVal.push(qString[i].split("=")[1]);
			}
			
	  }
	  
	  
	  if (returnVal.length==0) return null;
	  else if (returnVal.length==1) return returnVal[0];
	  else return returnVal;
	}
});/* ------------------------------------------------------------------------
	Class: prettyPhoto
	Use: Lightbox clone for jQuery
	Author: Stephane Caron (http://www.no-margin-for-errors.com)
	Version: 2.5.6
------------------------------------------------------------------------- */

(function($) {
	$.prettyPhoto = {version: '2.5.6'};
	
	$.fn.prettyPhoto = function(settings) {
		settings = jQuery.extend({
			animationSpeed: 'normal', /* fast/slow/normal */
			opacity: 0.80, /* Value between 0 and 1 */
			showTitle: true, /* true/false */
			allowresize: true, /* true/false */
			default_width: 500,
			default_height: 344,
			counter_separator_label: '/', /* The separator for the gallery counter 1 "of" 2 */
			theme: 'light_rounded', /* light_rounded / dark_rounded / light_square / dark_square / facebook */
			hideflash: false, /* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
			wmode: 'opaque', /* Set the flash wmode attribute */
			autoplay: true, /* Automatically start videos: True/False */
			modal: false, /* If set to true, only the close button will close the window */
			changepicturecallback: function(){}, /* Called everytime an item is shown/changed */
			callback: function(){}, /* Called when prettyPhoto is closed */
			markup: '<div class="pp_pic_holder"> \
						<div class="pp_top"> \
							<div class="pp_left"></div> \
							<div class="pp_middle"></div> \
							<div class="pp_right"></div> \
						</div> \
						<div class="pp_content_container"> \
							<div class="pp_left"> \
							<div class="pp_right"> \
								<div class="pp_content"> \
									<div class="pp_loaderIcon"></div> \
									<div class="pp_fade"> \
										<a href="#" class="pp_expand" title="Expand the image">Expand</a> \
										<div class="pp_hoverContainer"> \
											<a class="pp_next" href="#">next</a> \
											<a class="pp_previous" href="#">previous</a> \
										</div> \
										<div id="pp_full_res"></div> \
										<div class="pp_details clearfix"> \
											<a class="pp_close" href="#">Close</a> \
											<p class="pp_description"></p> \
											<div class="pp_nav"> \
												<a href="#" class="pp_arrow_previous">Previous</a> \
												<p class="currentTextHolder">0/0</p> \
												<a href="#" class="pp_arrow_next">Next</a> \
											</div> \
										</div> \
									</div> \
								</div> \
							</div> \
							</div> \
						</div> \
						<div class="pp_bottom"> \
							<div class="pp_left"></div> \
							<div class="pp_middle"></div> \
							<div class="pp_right"></div> \
						</div> \
					</div> \
					<div class="pp_overlay"></div> \
					<div class="ppt"></div>',
			image_markup: '<img id="fullResImage" src="" />',
			flash_markup: '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',
			quicktime_markup: '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/"></embed></object>',
			iframe_markup: '<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',
			inline_markup: '<div class="pp_inline clearfix">{content}</div>'
		}, settings);
		
		// Fallback to a supported theme for IE6
		if($.browser.msie && parseInt($.browser.version) == 6){
			settings.theme = "light_square";
		}
		
		if($('.pp_overlay').size()==0) _buildOverlay(); // If the overlay is not there, inject it!
		
		// Global variables accessible only by prettyPhoto
		var doresize = true, percentBased = false, correctSizes,
		
		// Cached selectors
		$pp_pic_holder, $ppt, $pp_overlay,
		
		// prettyPhoto container specific
		pp_contentHeight, pp_contentWidth, pp_containerHeight, pp_containerWidth,
		
		// Window size
		windowHeight = $(window).height(), windowWidth = $(window).width(),
	
		//Gallery specific
		setPosition = 0,

		// Global elements
		scrollPos = _getScroll();
	
		// Window/Keyboard events
		$(window).scroll(function(){ scrollPos = _getScroll(); _centerOverlay(); _resizeOverlay(); });
		$(window).resize(function(){ _centerOverlay(); _resizeOverlay(); });
		$(document).keydown(function(e){
			if($pp_pic_holder.is(':visible'))
			switch(e.keyCode){
				case 37:
					$.prettyPhoto.changePage('previous');
					break;
				case 39:
					$.prettyPhoto.changePage('next');
					break;
				case 27:
					if(!settings.modal)
					$.prettyPhoto.close();
					break;
			};
	    });
	
		// Bind the code to each links
		$(this).each(function(){
			$(this).bind('click',function(){
				_self = this; // Fix scoping
				
				// Find out if the picture is part of a set
				theRel = $(this).attr('rel');
				galleryRegExp = /\[(?:.*)\]/;
				theGallery = galleryRegExp.exec(theRel);
				
				// Build the gallery array
				var imagesnew = new Array(), titles = new Array(), descriptions = new Array();
				if(theGallery){
					$('a[rel*='+theGallery+']').each(function(i){
						if($(this)[0] === $(_self)[0]) setPosition = i; // Get the position in the set
						imagesnew.push($(this).attr('href'));
						titles.push($(this).find('img').attr('alt'));
						descriptions.push($(this).attr('title'));
					});
				}else{
					imagesnew = $(this).attr('href');
					titles = ($(this).find('img').attr('alt')) ?  $(this).find('img').attr('alt') : '';
					descriptions = ($(this).attr('title')) ?  $(this).attr('title') : '';
				}

				$.prettyPhoto.open(imagesnew,titles,descriptions);
				return false;
			});
		});
	
		
		/**
		* Opens the prettyPhoto modal box.
		* @param image {String,Array} Full path to the image to be open, can also be an array containing full imagesnew paths.
		* @param title {String,Array} The title to be displayed with the picture, can also be an array containing all the titles.
		* @param description {String,Array} The description to be displayed with the picture, can also be an array containing all the descriptions.
		*/
		$.prettyPhoto.open = function(gallery_imagesnew,gallery_titles,gallery_descriptions) {
			// To fix the bug with IE select boxes
			if($.browser.msie && $.browser.version == 6){
				$('select').css('visibility','hidden');
			};
			
			if(settings.hideflash) $('object,embed').css('visibility','hidden'); // Hide the flash
			
			// Convert everything to an array in the case it's a single item
			imagesnew = $.makeArray(gallery_imagesnew);
			titles = $.makeArray(gallery_titles);
			descriptions = $.makeArray(gallery_descriptions);

			image_set = ($(imagesnew).size() > 0) ?  true : false; // Find out if it's a set

			// Hide the next/previous links if on first or last imagesnew.
			_checkPosition($(imagesnew).size());
		
			$('.pp_loaderIcon').show(); // Do I need to explain?
		
			// Fade the content in
			$pp_overlay.show().fadeTo(settings.animationSpeed,settings.opacity);

			// Display the current position
			$pp_pic_holder.find('.currentTextHolder').text((setPosition+1) + settings.counter_separator_label + $(imagesnew).size());

			// Set the description
			if(descriptions[setPosition]){
				$pp_pic_holder.find('.pp_description').show().html(unescape(descriptions[setPosition]));
			}else{
				$pp_pic_holder.find('.pp_description').hide().text('');
			};

			// Set the title
			if(titles[setPosition] && settings.showTitle){
				hasTitle = true;
				$ppt.html(unescape(titles[setPosition]));
			}else{
				hasTitle = false;
			};
			
			// Get the dimensions
			movie_width = ( parseFloat(grab_param('width',imagesnew[setPosition])) ) ? grab_param('width',imagesnew[setPosition]) : settings.default_width.toString();
			movie_height = ( parseFloat(grab_param('height',imagesnew[setPosition])) ) ? grab_param('height',imagesnew[setPosition]) : settings.default_height.toString();
			// If the size is % based, calculate according to window dimensions
			if(movie_width.indexOf('%') != -1 || movie_height.indexOf('%') != -1){
				movie_height = parseFloat(($(window).height() * parseFloat(movie_height) / 100) - 100);
				movie_width = parseFloat(($(window).width() * parseFloat(movie_width) / 100) - 100);
				percentBased = true;
			}
			
			// Fade the holder
			$pp_pic_holder.fadeIn(function(){
				imgPreloader = "";
				// Inject the proper content
				switch(_getFileType(imagesnew[setPosition])){
					case 'image':
						// Set the new image
						imgPreloader = new Image();

						// Preload the neighbour imagesnew
						nextImage = new Image();
						if(image_set && setPosition > $(imagesnew).size()) nextImage.src = imagesnew[setPosition + 1];
						prevImage = new Image();
						if(image_set && imagesnew[setPosition - 1]) prevImage.src = imagesnew[setPosition - 1];

						$pp_pic_holder.find('#pp_full_res')[0].innerHTML = settings.image_markup;
						$pp_pic_holder.find('#fullResImage').attr('src',imagesnew[setPosition]);

						imgPreloader.onload = function(){
							// Fit item to viewport
							correctSizes = _fitToViewport(imgPreloader.width,imgPreloader.height);

							_showContent();
						};

						imgPreloader.onerror = function(){
							alert('Image cannot be loaded. Make sure the path is correct and image exist.');
							$.prettyPhoto.close();
						};
					
						imgPreloader.src = imagesnew[setPosition];
					break;
				
					case 'youtube':
						correctSizes = _fitToViewport(movie_width,movie_height); // Fit item to viewport

						movie = 'http://www.youtube.com/v/'+grab_param('v',imagesnew[setPosition]);
						if(settings.autoplay) movie += "&autoplay=1";
					
						toInject = settings.flash_markup.replace(/{width}/g,correctSizes['width']).replace(/{height}/g,correctSizes['height']).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,movie);
					break;
				
					case 'vimeo':
						correctSizes = _fitToViewport(movie_width,movie_height); // Fit item to viewport
					
						movie_id = imagesnew[setPosition];
						movie = 'http://vimeo.com/moogaloop.swf?clip_id='+ movie_id.replace('http://vimeo.com/','');
						if(settings.autoplay) movie += "&autoplay=1";
				
						toInject = settings.flash_markup.replace(/{width}/g,correctSizes['width']).replace(/{height}/g,correctSizes['height']).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,movie);
					break;
				
					case 'quicktime':
						correctSizes = _fitToViewport(movie_width,movie_height); // Fit item to viewport
						correctSizes['height']+=15; correctSizes['contentHeight']+=15; correctSizes['containerHeight']+=15; // Add space for the control bar
				
						toInject = settings.quicktime_markup.replace(/{width}/g,correctSizes['width']).replace(/{height}/g,correctSizes['height']).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,imagesnew[setPosition]).replace(/{autoplay}/g,settings.autoplay);
					break;
				
					case 'flash':
						correctSizes = _fitToViewport(movie_width,movie_height); // Fit item to viewport
					
						flash_vars = imagesnew[setPosition];
						flash_vars = flash_vars.substring(imagesnew[setPosition].indexOf('flashvars') + 10,imagesnew[setPosition].length);

						filename = imagesnew[setPosition];
						filename = filename.substring(0,filename.indexOf('?'));
					
						toInject =  settings.flash_markup.replace(/{width}/g,correctSizes['width']).replace(/{height}/g,correctSizes['height']).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,filename+'?'+flash_vars);
					break;
				
					case 'iframe':
						correctSizes = _fitToViewport(movie_width,movie_height); // Fit item to viewport
				
						frame_url = imagesnew[setPosition];
						frame_url = frame_url.substr(0,frame_url.indexOf('iframe')-1);
				
						toInject = settings.iframe_markup.replace(/{width}/g,correctSizes['width']).replace(/{height}/g,correctSizes['height']).replace(/{path}/g,frame_url);
					break;
				
					case 'inline':
						// to get the item height clone it, apply default width, wrap it in the prettyPhoto containers , then delete
						myClone = $(imagesnew[setPosition]).clone().css({'width':settings.default_width}).wrapInner('<div id="pp_full_res"><div class="pp_inline clearfix"></div></div>').appendTo($('body'));
						correctSizes = _fitToViewport($(myClone).width(),$(myClone).height());
						$(myClone).remove();
						toInject = settings.inline_markup.replace(/{content}/g,$(imagesnew[setPosition]).html());
					break;
				};

				if(!imgPreloader){
					$pp_pic_holder.find('#pp_full_res')[0].innerHTML = toInject;
				
					// Show content
					_showContent();
				};
			});

		};
		
		/**
		* Change page in the prettyPhoto modal box
		* @param direction {String} Direction of the paging, previous or next.
		*/
		$.prettyPhoto.changePage = function(direction){
			if(direction == 'previous') {
				setPosition--;
				if (setPosition < 0){
					setPosition = 0;
					return;
				};
			}else{
				if($('.pp_arrow_next').is('.disabled')) return;
				setPosition++;
			};

			// Allow the resizing of the imagesnew
			if(!doresize) doresize = true;

			_hideContent(function(){$.prettyPhoto.open(imagesnew,titles,descriptions)});
			$('a.pp_expand,a.pp_contract').fadeOut(settings.animationSpeed);
		};
		
		/**
		* Closes the prettyPhoto modal box.
		*/
		$.prettyPhoto.close = function(){
			$pp_pic_holder.find('object,embed').css('visibility','hidden');
			
			$('div.pp_pic_holder,div.ppt,.pp_fade').fadeOut(settings.animationSpeed);
			
			$pp_overlay.fadeOut(settings.animationSpeed, function(){
				$('#pp_full_res').html(''); // Kill the opened content
				
				$pp_pic_holder.attr('style','').find('div:not(.pp_hoverContainer)').attr('style',''); // Reset the width and everything that has been set.
				_centerOverlay(); // Center it
			
				// To fix the bug with IE select boxes
				if($.browser.msie && $.browser.version == 6){
					$('select').css('visibility','visible');
				};
				
				// Show the flash
				if(settings.hideflash) $('object,embed').css('visibility','visible');
				
				setPosition = 0;
				settings.callback();
			});
			doresize = true;
		};
	
		/**
		* Set the proper sizes on the containers and animate the content in.
		*/
		_showContent = function(){
			$('.pp_loaderIcon').hide();

			// Calculate the opened top position of the pic holder
			projectedTop = scrollPos['scrollTop'] + ((windowHeight/2) - (correctSizes['containerHeight']/2));
			if(projectedTop < 0) projectedTop = 0 + $ppt.height();

			// Resize the content holder
			$pp_pic_holder.find('.pp_content').animate({'height':correctSizes['contentHeight']},settings.animationSpeed);
			
			// Resize picture the holder
			$pp_pic_holder.animate({
				'top': projectedTop,
				'left': (windowWidth/2) - (correctSizes['containerWidth']/2),
				'width': correctSizes['containerWidth']
			},settings.animationSpeed,function(){
				$pp_pic_holder.find('.pp_hoverContainer,#fullResImage').height(correctSizes['height']).width(correctSizes['width']);

				// Fade the new image
				$pp_pic_holder.find('.pp_fade').fadeIn(settings.animationSpeed);

				// Show the nav
				if(image_set && _getFileType(imagesnew[setPosition])=="image") { $pp_pic_holder.find('.pp_hoverContainer').show(); }else{ $pp_pic_holder.find('.pp_hoverContainer').hide(); }

				// Show the title
				if(settings.showTitle && hasTitle){
					$ppt.css({
						'top' : $pp_pic_holder.offset().top - 25,
						'left' : $pp_pic_holder.offset().left + 20,
						'display' : 'none'
					});

					$ppt.fadeIn(settings.animationSpeed);
				};
			
				// Fade the resizing link if the image is resized
				if(correctSizes['resized']) $('a.pp_expand,a.pp_contract').fadeIn(settings.animationSpeed);
				
				// Callback!
				settings.changepicturecallback();
			});
		};
		
		/**
		* Hide the content...DUH!
		*/
		function _hideContent(callback){
			// Fade out the current picture
			$pp_pic_holder.find('#pp_full_res object,#pp_full_res embed').css('visibility','hidden');
			$pp_pic_holder.find('.pp_fade').fadeOut(settings.animationSpeed,function(){
				$('.pp_loaderIcon').show();
				
				if(callback) callback();
			});
			
			// Hide the title
			$ppt.fadeOut(settings.animationSpeed);
		}
	
		/**
		* Check the item position in the gallery array, hide or show the navigation links
		* @param setCount {integer} The total number of items in the set
		*/
		function _checkPosition(setCount){
			// If at the end, hide the next link
			if(setPosition == setCount-1) {
				$pp_pic_holder.find('a.pp_next').css('visibility','hidden');
				$pp_pic_holder.find('a.pp_arrow_next').addClass('disabled').unbind('click');
			}else{ 
				$pp_pic_holder.find('a.pp_next').css('visibility','visible');
				$pp_pic_holder.find('a.pp_arrow_next.disabled').removeClass('disabled').bind('click',function(){
					$.prettyPhoto.changePage('next');
					return false;
				});
			};
		
			// If at the beginning, hide the previous link
			if(setPosition == 0) {
				$pp_pic_holder.find('a.pp_previous').css('visibility','hidden');
				$pp_pic_holder.find('a.pp_arrow_previous').addClass('disabled').unbind('click');
			}else{
				$pp_pic_holder.find('a.pp_previous').css('visibility','visible');
				$pp_pic_holder.find('a.pp_arrow_previous.disabled').removeClass('disabled').bind('click',function(){
					$.prettyPhoto.changePage('previous');
					return false;
				});
			};
			
			// Hide the bottom nav if it's not a set.
			if(setCount > 1) {
				$('.pp_nav').show();
			}else{
				$('.pp_nav').hide();
			}
		};
	
		/**
		* Resize the item dimensions if it's bigger than the viewport
		* @param width {integer} Width of the item to be opened
		* @param height {integer} Height of the item to be opened
		* @return An array containin the "fitted" dimensions
		*/
		function _fitToViewport(width,height){
			hasBeenResized = false;

			_getDimensions(width,height);
			
			// Define them in case there's no resize needed
			imageWidth = width;
			imageHeight = height;

			if( ((pp_containerWidth > windowWidth) || (pp_containerHeight > windowHeight)) && doresize && settings.allowresize && !percentBased) {
				hasBeenResized = true;
				notFitting = true;
			
				while (notFitting){
					if((pp_containerWidth > windowWidth)){
						imageWidth = (windowWidth - 200);
						imageHeight = (height/width) * imageWidth;
					}else if((pp_containerHeight > windowHeight)){
						imageHeight = (windowHeight - 200);
						imageWidth = (width/height) * imageHeight;
					}else{
						notFitting = false;
					};

					pp_containerHeight = imageHeight;
					pp_containerWidth = imageWidth;
				};
			
				_getDimensions(imageWidth,imageHeight);
			};

			return {
				width:Math.floor(imageWidth),
				height:Math.floor(imageHeight),
				containerHeight:Math.floor(pp_containerHeight),
				containerWidth:Math.floor(pp_containerWidth) + 40,
				contentHeight:Math.floor(pp_contentHeight),
				contentWidth:Math.floor(pp_contentWidth),
				resized:hasBeenResized
			};
		};
		
		/**
		* Get the containers dimensions according to the item size
		* @param width {integer} Width of the item to be opened
		* @param height {integer} Height of the item to be opened
		*/
		function _getDimensions(width,height){
			width = parseFloat(width);
			height = parseFloat(height);
			
			// Get the details height, to do so, I need to clone it since it's invisible
			$pp_details = $pp_pic_holder.find('.pp_details');
			$pp_details.width(width);
			detailsHeight = parseFloat($pp_details.css('marginTop')) + parseFloat($pp_details.css('marginBottom'));
			$pp_details = $pp_details.clone().appendTo($('body')).css({
				'position':'absolute',
				'top':-10000
			});
			detailsHeight += $pp_details.height();
			detailsHeight = (detailsHeight <= 34) ? 36 : detailsHeight; // Min-height for the details
			if($.browser.msie && $.browser.version==7) detailsHeight+=8;
			$pp_details.remove();
			
			// Get the container size, to resize the holder to the right dimensions
			pp_contentHeight = height + detailsHeight;
			pp_contentWidth = width;
			pp_containerHeight = pp_contentHeight + $ppt.height() + $pp_pic_holder.find('.pp_top').height() + $pp_pic_holder.find('.pp_bottom').height();
			pp_containerWidth = width;
		}
	
		function _getFileType(itemSrc){
			if (itemSrc.match(/youtube\.com\/watch/i)) {
				return 'youtube';
			}else if (itemSrc.match(/vimeo\.com/i)) {
				return 'vimeo';
			}else if(itemSrc.indexOf('.mov') != -1){ 
				return 'quicktime';
			}else if(itemSrc.indexOf('.swf') != -1){
				return 'flash';
			}else if(itemSrc.indexOf('iframe') != -1){
				return 'iframe'
			}else if(itemSrc.substr(0,1) == '#'){
				return 'inline';
			}else{
				return 'image';
			};
		};
	
		function _centerOverlay(){
			if(doresize) {
				titleHeight = $ppt.height();
				contentHeight = $pp_pic_holder.height();
				contentwidth = $pp_pic_holder.width();
				
				projectedTop = (windowHeight/2) + scrollPos['scrollTop'] - ((contentHeight+titleHeight)/2);
				
				$pp_pic_holder.css({
					'top': projectedTop,
					'left': (windowWidth/2) + scrollPos['scrollLeft'] - (contentwidth/2)
				});
				
				$ppt.css({
					'top' : projectedTop - titleHeight,
					'left': (windowWidth/2) + scrollPos['scrollLeft'] - (contentwidth/2) + 20
				});
			};
		};
	
		function _getScroll(){
			if (self.pageYOffset) {
				return {scrollTop:self.pageYOffset,scrollLeft:self.pageXOffset};
			} else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
				return {scrollTop:document.documentElement.scrollTop,scrollLeft:document.documentElement.scrollLeft};
			} else if (document.body) {// all other Explorers
				return {scrollTop:document.body.scrollTop,scrollLeft:document.body.scrollLeft};
			};
		};
	
		function _resizeOverlay() {
			windowHeight = $(window).height();
			windowWidth = $(window).width();
			
			$pp_overlay.css({
				'height':$(document).height()
			});
		};
	
		function _buildOverlay(){
			// Inject the markup
			$('body').append(settings.markup);
			
			// Set my global selectors
			$pp_pic_holder = $('.pp_pic_holder');
			$ppt = $('.ppt');
			$pp_overlay = $('div.pp_overlay');
			
			$pp_pic_holder.attr('class','pp_pic_holder ' + settings.theme); // Set the proper theme
			
			$pp_overlay
				.css({
					'opacity':0,
					'height':$(document).height()
					})
				.bind('click',function(){
					if(!settings.modal)
					$.prettyPhoto.close();
				});

			$('a.pp_close').bind('click',function(){ $.prettyPhoto.close(); return false; });

			$('a.pp_expand').bind('click',function(){
				$this = $(this); // Fix scoping
				
				// Expand the image
				if($this.hasClass('pp_expand')){
					$this.removeClass('pp_expand').addClass('pp_contract');
					doresize = false;
				}else{
					$this.removeClass('pp_contract').addClass('pp_expand');
					doresize = true;
				};
			
				_hideContent(function(){ $.prettyPhoto.open(imagesnew,titles,descriptions) });
				
				$pp_pic_holder.find('.pp_fade').fadeOut(settings.animationSpeed);
		
				return false;
			});
		
			$pp_pic_holder.find('.pp_previous, .pp_arrow_previous').bind('click',function(){
				$.prettyPhoto.changePage('previous');
				return false;
			});
		
			$pp_pic_holder.find('.pp_next, .pp_arrow_next').bind('click',function(){
				$.prettyPhoto.changePage('next');
				return false;
			});
		};
		
		_centerOverlay(); // Center it
	};
	
	function grab_param(name,url){
	  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	  var regexS = "[\\?&]"+name+"=([^&#]*)";
	  var regex = new RegExp( regexS );
	  var results = regex.exec( url );
	  if( results == null )
	    return "";
	  else
	    return results[1];
	}
})(jQuery);
/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};