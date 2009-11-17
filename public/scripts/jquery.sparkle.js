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

(function($){
	
	// Debug
	if (typeof console === 'undefined') {
		console = typeof window.console !== 'undefined' ? window.console : {};
	}
	console.log			= console.log 			|| function(){};
	console.debug		= console.debug 		|| console.log;
	console.warn		= console.warn			|| console.log;
	console.error		= console.error			|| function(){var args = [];for (var i = 0; i < arguments.length; i++) { args.push(arguments[i]); } alert(args.join("\n")); };
	console.trace		= console.trace			|| console.log;
	console.group		= console.group			|| console.log;
	console.groupEnd	= console.groupEnd		|| console.log;
	console.profile		= console.profile		|| console.log;
	console.profileEnd	= console.profileEnd	|| console.log;
	
	
	// Prototypes
	$.fn.findAndSelf = $.fn.findAndSelf || function(selector){
		var $this = $(this);
		return $this.find(selector).andSelf().filter(selector);
	};
	
	// BalClass
	$.BalClass = $.BalClass || function(config){
		this.construct(config);
	};
	$.extend($.BalClass.prototype, {
		config: {
			'default': {}
		},
		construct: function(config){
			this.configure(config);
			return true;
		},
		configure: function(config){
			var Me = this;
			Me.config = $.extend({},Me.config,config||{});
			return Me;
		},
		addConfig: function(name, config){
			var Me = this;
			if ( typeof config === 'undefined' ) {
				if ( typeof name === 'object' ) {
					// Series
					for ( var i in name ) {
						Me.applyConfig(i, name[i]);
					}
				}
				return false;
			} else if ( typeof config === 'object' ) {
				// Single
				Me.applyConfig(name, config);
			}
			return Me;
		},
		applyConfig: function(name,config){
			var Me = this;
			$.extend(Me.config[name],config||{});
			return Me;
		},
		getConfig: function(name){
			var Me = this;
			if ( typeof name !== 'string' ) {
				return this.config;
			}
			return this.getConfigWith(name);
		},
		getConfigWith: function(name,config){
			var Me = this;
			if ( typeof name !== 'string' ) {
				if ( typeof config === 'undefined' ) {
					config = name;
				}
				name = 'default';
			}
			if ( typeof config !== 'object' ) {
				config = {};
			}
			return $.extend({}, Me.config[name]||{}, config||{});
		},
		getConfigWithDefault: function(name,config){
			var Me = this;
			return Me.getConfigWith('default',Me.getConfigWith(name,config));
		}
	});
	
	// SparkleClass
	$.SparkleClass = function(config){
		this.construct(config);
	};
	$.extend($.SparkleClass.prototype, $.BalClass.prototype, {
		add: function(name, func, config) {
			var Sparkle = $.Sparkle;
			if ( name === 'object' ) {
				// Series
				for ( var i in name ) {
					Sparkle.add(i, name[i]);
				}
			} else {
				// Individual
				var Extension = {
					config: {},
					extension: false
				};
				// Discover
				if ( typeof func === 'object' && typeof func.config !== 'undefined' ) {
					Extension.config = func.config;
					Extension.extension = func.extension;
				} else {
					Extension.extension = func;
				}
				// Apply
				Sparkle.addConfig(name, Extension);
			}
			return true;
		},
		fn: function(extension){
			var $this = $(this); var Sparkle = $.Sparkle;
			if ( extension ) {
				// Individual
				Sparkle.trigger.apply($this, [extension]);
			} else {
				// Series
				Sparkle.cycle.apply($this, []);
			}
			return $this;
		},
		cycle: function(){
			var $this = $(this); var Sparkle = $.Sparkle;
			var Extensions = Sparkle.getConfig();
			for ( extension in Extensions ) {
				Sparkle.trigger.apply($this, [extension]);
			}
			return $this;
		},
		trigger: function(extension){
			var $this = $(this); var Sparkle = $.Sparkle;
			var Extension = Sparkle.getConfigWithDefault(extension);
			if ( typeof Extension.extension !== 'undefined' ) {
				// We are not just a config object but an actual extension
				return Extension.extension.apply($this, [Sparkle, Extension.config, Extension]);
			}
			return false;
		},
		construct: function(config){
			var Sparkle = this;
			Sparkle.configure(config);
			$(function(){
				$.fn.sparkle = Sparkle.fn;
				$(document.body).sparkle();
			});
			return true;
		}
	});
	
	// Sparkle
	$.Sparkle = new $.SparkleClass({
		'date': {
			config: {
				selector: '.sparkle-date',
				dateformat: 'yy-mm-dd'
			},
			extension: function(Sparkle, config){
				var $this = $(this);
				var $item = $this.findAndSelf(config.selector);
				return typeof $item.datepicker === 'undefined' ? $item : $item.datepicker({
					dateFormat: config.dateformat
				});
			}
		},
		'time': {
			config: {
				selector: '.sparkle-time',
				timeconvention: 24
			},
			extension: function(Sparkle, config){
				var $this = $(this);
				var $item = $this.findAndSelf(config.selector);
				return typeof $item.timepicker === 'undefined' ? $item : $item.timepicker({
					convention: config.timeconvention
				});
			}
		},
		'hide-if-empty': {
			config: {
				selector: '.sparkle-hide-if-empty:empty'
			},
			extension: function(Sparkle, config) {
				var $this = $(this);
				return $this.findAndSelf(config.selector).hide();
			}
		},
		'hide': {
			config: {
				selector: '.sparkle-hide'
			},
			extension: function(Sparkle, config) {
				var $this = $(this);
				return $this.findAndSelf(config.selector).hide();
			}
		},
		'subtle': {
			config: {
				selector: '.sparkle-subtle',
				css: {
					'font-size': '80%'
				},
				inSpeed: 200,
				inCss: {
					'opacity': 1
				},
				outSpeed: 400,
				outCss: {
					'opacity': 0.5
				}
			},
			extension: function(Sparkle, config) {
				var $this = $(this);
				var $suble = $this.findAndSelf(config.selector);
				return $suble.css(config.css).css(config.start).hover(function() {
					// Over
					$(this).stop(true, false).animate(config.inCss, config.inSpeed);
				}, function() {
					// Out
					$(this).stop(true, false).animate(config.outCss, config.outSpeed);
				});
			}
		},
		'panelshower': {
			config: {
				selectorSwitch: '.sparkle-panelshower-switch',
				selectorPanel: '.sparkle-panelshower-panel',
				inSpeed: 200,
				outSpeed: 200
			},
			extension: function(Sparkle, config) {
				var $this = $(this);
				var $switches = $this.findAndSelf(config.selectorSwitch);
				var $panels = $this.findAndSelf(config.selectorPanel);
				var panelswitch = function() {
					var $switch = $(this);
					var $panel = $switch.siblings(config.selectorPanel).filter(':first');
					var value = $switch.val();
					var show = $switch.is(':checked,:selected') && !(!value || value === 0 || value === '0' || value === 'false' || value === false || value === 'no' || value === 'off');
					if (show) {
						$panel.fadeIn(config.inSpeed);
					}
					else {
						$panel.fadeOut(config.outSpeed);
					}
				};
				$switches.click(panelswitch);
				$panels.hide();
			}
		},
		'autogrow': {
			config: {
				selector: 'textarea.autogrow,textarea.autosize'
			},
			extension: function(Sparkle, config){
				var $this = $(this);
				return $this.findAndSelf(config.selector).autogrow();
			}
		},
		'gsfn': {
			config: {
				selector: '.gsfn'
			},
			extension: function(Sparkle, config) {
				var $this = $(this);
				// Apply Action
				$(function() {
					// Apply
					$this.findAndSelf(config.selector).click(function(event) {
						if ( typeof GSFN_feedback_widget === 'undefined' ) {
							console.warn('GSFN has failed to load.');
							return false;
						}
						GSFN_feedback_widget.show();
						//event.stopPropagation();
						event.preventDefault();
						return false;
					});
				});
			}
		}
	});
	
})(jQuery);