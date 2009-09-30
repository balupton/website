/**
 * jQuery Sparkle (balupton edition) - Simple Rich Effects
 * Copyright (C) 2009 Benjamin Arthur Lupton
 * http://jquery.com/plugins/project/jquerylightbox_bal
 *
 * This file is part of jQuery Sparkle (balupton edition).
 * 
 * jQuery Sparkle (balupton edition) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * jQuery Sparkle (balupton edition) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with jQuery Lightbox (balupton edition).  If not, see <http://www.gnu.org/licenses/>.
 *
 * @name jquery_sparkle: jquery.sparkle.js
 * @package jQuery Sparkle (balupton edition)
 * @version 1.0.0-dev
 * @date August 11, 2009
 * @category jQuery plugin
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2009 Benjamin Arthur Lupton {@link http://www.balupton.com}
 * @license GNU Affero General Public License - {@link http://www.gnu.org/licenses/agpl.html}
 * @example Visit {@link http://jquery.com/plugins/project/jquerylightbox_bal} for more information.
 */

// -----------------
// Sparkle

$.Sparkle = {
	options: {
		dateformat: 'yy-mm-dd',
		timeconvention: 24
	},
	extensions: {
		listArray: [],
		listObject: {},
		add: function(key, extension){
			var Sparkle = $.Sparkle;
			if ( typeof extension === 'undefined' || typeof key !== 'string' ) {
				if ( typeof key === 'object' ) {
					// Series
					for (var i in key) {
						var extension = key[i];
						Sparkle.extensions.add(i, extension);
					}
				} else {
					// Si Nombre
					Sparkle.extensions.listArray.push(key);
				}
			} else {
				// Defined
				Sparkle.extensions.listObject[key] = extension;
			}
			// Done
			return true;
		},
		cycle: function(obj){
			var Sparkle = $.Sparkle;
			for ( var i = 0, n = Sparkle.extensions.listArray.length; i<n; ++i ) {
				var extension = Sparkle.extensions.listArray[i];
				extension.apply(obj, [$.Sparkle]);
			}
			for ( var i in Sparkle.extensions.listObject ) {
				var extension = Sparkle.extensions.listObject[i];
				extension.apply(obj, [$.Sparkle]);
			}
			// Done
			return true;
		}
	},
	fn: function(extension){
		var Sparkle = $.Sparkle;
		if ( extension ) {
			// Individual
			Sparkle.extensions.listObject[extension].apply(obj, [$.Sparkle]);
		} else {
			// Series
			Sparkle.extensions.cycle(this);
		}
		return this;
	},
	construct: function(){
		var Sparkle = $.Sparkle;
		$.fn.sparkle = Sparkle.fn;
		// Done
		return true;
	}
};
$.Sparkle.construct();

// -----------------
// Effects

$.Sparkle.extensions.add({
	'date': function(){
		var $this = $(this); var Sparkle = $.Sparkle;
		var $item = $this.find('.jquery-date');
		return typeof $item.datepicker === 'undefined' ? $item : $item.datepicker({
			dateFormat: Sparkle.options.dateformat
		});
	},
	'time': function(){
		var $this = $(this); var Sparkle = $.Sparkle;
		var $item = $this.find('.jquery-time');
		return typeof $item.timepicker === 'undefined' ? $item : $item.timepicker({
			convention: Sparkle.options.timeconvention
		});
	},
	'hide-if-empty': function(){
		var $this = $(this); var Sparkle = $.Sparkle;
		return $this.find('.jquery-hide-if-empty:empty').hide();
	},
	'hide': function(){
		var $this = $(this); var Sparkle = $.Sparkle;
		return $this.find('.jquery-hide').hide();
	},
	'subtle': function(){
		var $this = $(this);
		var $suble = $this.find('.sparkle-subtle');
		return $suble.css({
			'opacity': 0.5,
			'font-size': '80%'
		}).hover(function(){
			// Over
			$(this).stop(true,false).animate({
				'opacity': 1
			}, 200);
		},function(){
			// Out
			$(this).stop(true,false).animate({
				'opacity': 0.5
			}, 400);
		});
	},
	'panelshower': function(){
		var $this = $(this); var Sparkle = $.Sparkle;
		var $switches = $this.find('.jquery-panelshower-switch');
		var $panels = $this.find('.jquery-panelshower-panel');
		var panelswitch = function(){
			var $switch = $(this);
			var $panel = $switch.siblings('.jquery-panelshower-panel:first');
			var value = $switch.val();
			var show = $switch.is(':checked,:selected') && !(!value || value === 0 || value === '0' || value === 'false' || value === false || value === 'no' || value === 'off');
			if ( show ) {
				$panel.fadeIn(200);
			} else {
				$panel.fadeOut(200);
			}
		};
		$switches.click(panelswitch);
		$panels.hide();
	}
});

