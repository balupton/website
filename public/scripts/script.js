/**
 * jQuery App (balupton edition) - Application Resource Library
 * Copyright (C) 2010 Benjamin Arthur Lupton
 * http://www.balupton.com/projects/jquery-app
 *
 * This file is part of jQuery App (balupton edition).
 * 
 * jQuery App (balupton edition) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * jQuery App (balupton edition) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with jQuery Lightbox (balupton edition).  If not, see <http://www.gnu.org/licenses/>.
 *
 * @name jquery_app: jquery.app.js
 * @package jQuery App (balupton edition)
 * @version 1.0.0-dev
 * @date January 10, 2010
 * @category jQuery plugin
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2009 Benjamin Arthur Lupton {@link http://www.balupton.com}
 * @license GNU Affero General Public License - {@link http://www.gnu.org/licenses/agpl.html}
 * @example Visit {@link http://www.balupton.com/projects/jquery-app} for more information.
 */

(function($){
	
	
	// Log
	$(function(){
		$('.log .event').click(function(){
			$(this).find('.details').toggle();
		});
	});
	
	// changePopulate
	$.fn.changePopulate = $.fn.changePopulate || function(url, name, items, callback_before, callback_after) {
		// Prepare
		var $find = $(this);
		// Events
		var events = {
			change: function(event){
				var data = {}; data[name] = $(this).val();
				$.ajax({
					url:  url,
					method: 'post',
					dataType: 'json',
					data: data,
					success: function(data, status){
						for ( var code in items ) {
							var item = items[code];
							var type = item.type||'option';
							var name = item.name||null;
							var current = item.current||[]; if ( typeof current !== 'array' && typeof current !== 'object'  ) {
								current = [current];
							}
							var $el = item.el||item;
							var keys = typeof item.keys !== 'undefined' ? item.keys : true;
							//
							$el.empty();
							//
							if ( callback_before||false ) {
								callback_before(data);
							}
							//
							if ( typeof data[code].length === 'undefined' ) {
								for ( var key in data[code] ) {
									var title = data[code][key];
									var value = keys ? key : title;
									switch ( type ) {
										case 'option':
											var $option = $('<option>').val(value).text(title).appendTo($el);
											if ( current.has(key) || current.has(value) ) $option.choose();
											break;
										case 'checkbox':
											if ( !name ) {
												console.warn('No name for checkbox in changePopulate', $el, item, items);
											}
											var $label = $('<label>').text(title).appendTo($el);
											var $checkbox = $('<input>').attr('type','checkbox').val(value).attr('name',name).prependTo($label);
											if ( current.has(key) || current.has(value) ) $checkbox.choose();
											break;
									}
								}
							}
						}
						if ( callback_after||false ) {
							callback_after(data);
						}
						return true;
					}
				});
			}
		}
		$find.unbind('change',events.change).change(events.change).trigger('change');
		// Done
		return true;
	}
	
})(jQuery);