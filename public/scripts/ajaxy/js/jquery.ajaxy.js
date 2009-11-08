/**
 * jQuery Ajaxy Plugin (balupton edition) - Ajax extension for history remote
 * Copyright (C) 2008-2009 Benjamin Arthur Lupton
 * http://www.balupton.com/projects/jquery_ajaxy/
 *
 * This file is part of jQuery History Plugin (balupton edition).
 * 
 * jQuery Ajaxy Plugin (balupton edition) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * jQuery Ajaxy Plugin (balupton edition) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with jQuery History Plugin (balupton edition).  If not, see <http://www.gnu.org/licenses/>.
 *
 * @name jqsmarty: jquery.ajaxy.js
 * @package jQuery Ajaxy Plugin (balupton edition)
 * @version 1.2.0-beta
 * @date August 3, 2009
 * @category jquery plugin
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2008-2009 Benjamin Arthur Lupton {@link http://www.balupton.com}
 * @license GNU Affero General Public License - {@link http://www.gnu.org/licenses/agpl.html}
 * @example Visit {@link http://jquery.com/plugins/project/jquery_history_bal} for more information.
 * 
 * 
 * I would like to take this space to thank the following projects, blogs, articles and people:
 * - jQuery {@link http://jquery.com/}
 * - jQuery UI History - Klaus Hartl {@link http://www.stilbuero.de/jquery/ui_history/}
 * - Really Simple History - Brian Dillard and Brad Neuberg {@link http://code.google.com/p/reallysimplehistory/}
 * - jQuery History Plugin - Taku Sano (Mikage Sawatari) {@link http://www.mikage.to/jquery/jquery_history.html}
 * - jQuery History Remote Plugin - Klaus Hartl {@link http://stilbuero.de/jquery/history/}
 * - Content With Style: Fixing the back button and enabling bookmarking for ajax apps - Mike Stenhouse {@link http://www.contentwithstyle.co.uk/Articles/38/fixing-the-back-button-and-enabling-bookmarking-for-ajax-apps}
 * - Bookmarks and Back Buttons {@link http://ajax.howtosetup.info/options-and-efficiencies/bookmarks-and-back-buttons/}
 * - Ajax: How to handle bookmarks and back buttons - Brad Neuberg {@link http://dev.aol.com/ajax-handling-bookmarks-and-back-button}
 *
 **
 ***
 * CHANGELOG
 **
 * v1.2.0-beta, August 3, 2009
 * - Moved base/root/relative url functionality inside
 * - Fixed issue with A elements continuing link
 * - Improvements to form submission
 * - Debug improvements
 * 
 * v1.1.0-beta, July 25, 2009
 * - Added support for hash callbacks
 * 
 * v1.0.1-final, July 11, 2009
 * - Restructured a little bit
 * - Documented
 * - Added get and set functions for misc
 * - Added support for Ajaxy error headers
 * - Cleaned go/request
 *
 * v1.0.0-final, June 19, 2009
 * - Been stable for over a year now, pushing live.
 * 
 * v0.1.0-dev, July 24, 2008
 * - Initial Release
 * 
 */

// Start of our jQuery Plugin
(function($)
{	// Create our Plugin function, with $ as the argument (we pass the jQuery object over later)
	// More info: http://docs.jquery.com/Plugins/Authoring#Custom_Alias
	
	/**
	 * Debug
	 */
	if (typeof console === 'undefined') {
		console = typeof window.console !== 'undefined' ? window.console : {};
	}
	console.log			= console.log 			|| function(){};
	console.debug		= console.debug 		|| console.log;
	console.warn		= console.warn			|| console.log;
	console.info		= console.info			|| console.log;
	console.error		= console.error			|| function(){var args = [];for (var i = 0; i < arguments.length; i++) { args.push(arguments[i]); } alert(args.join("\n")); };
	console.trace		= console.trace			|| console.log;
	console.group		= console.group			|| console.log;
	console.groupEnd	= console.groupEnd		|| console.log;
	console.profile		= console.profile		|| console.log;
	console.profileEnd	= console.profileEnd	|| console.log;
	
	/**
	 * String.prototype.strip - Trim a value off the front or back
	 * @copyright Benjamin "balupton" Lupton (MIT Licenced)
	 */
	String.prototype.strip = String.prototype.strip || function(value){
		var str = this;
		value = String(value);
		if ( value && str.length >= value.length ) {
			if ( str.substr(0, value.length) === value ) {
				str = str.substring(value.length);
			}
			if ( str.substr(str.length-value.length, value.length) === value ) {
				str = str.substring(0,str.length-value.length);
			}
		}
		return String(str);
	}
	
	/**
	 * $.fn.values - Get form values
	 * @param {Object} event
	 * @copyright Benjamin "balupton" Lupton (MIT Licenced)
	 */
	$.fn.values = $.fn.values || function(){
		var values = {};
		var $form = $(this);
		var inputs = 'input,textarea,select';
		var $fields = $form.find(inputs).add($form.filter(inputs));
		$fields.each(function(){
			var $input = $(this);
			var name = $input.attr('name') || null;
			if ( !name ) {
				return true;
			}
			// Skip if won't submit
			if ( $input.is(':radio,:checkbox') && !$input.is(':selected,:checked') ) {
				return true;
			}
			// Set value
			if (name.indexOf('[]') !== -1) {
				// We want an array
				if (typeof values[name] === 'undefined') {
					values[name] = [];
				}
				values[name].push($input.val() || $input.text());
			}
			else {
				values[name] = $input.val();
			}
		});
		return values;
	};
	/**
	 * $.fn.value - Get the proper form value for an item
	 * @param {Object} event
	 * @copyright Benjamin "balupton" Lupton (MIT Licenced)
	 */
	$.fn.value = $.fn.value = function(){
		var $this = $(this);
		if ( $this.length > 1 ) {
			var values = $this.values();
			for ( i in values ) {
				return values[i];
			}
		}
		return $this.val();
	}
	
	/**
	 * Helpers for $.fn.ajaxify
	 */
	var ajaxify_helper = {
		a: function(event){
			var Ajaxy = $.Ajaxy;
			// We have a ajax link
			var $this = $(this);
			var hash = Ajaxy.format($this.attr('href'));
			var history = !$this.hasClass('ajaxy__no_history');
			var result = Ajaxy.go({
				'hash': hash,
				'history': history
			});
			// Prevent
			event.stopPropagation();
			event.preventDefault();
			return false;
		},
		form: function(event){
			var Ajaxy = $.Ajaxy;
			// Get the form
			var $form = $(this);
			// Check
			var disabled = $form.attr('disabled'); disabled = disabled || disabled === 'false';
			if ( disabled ) {
				return false;
			}
			// See if we are in the middle of a request
			if ( $form.attr('target') ) {
				// We are, so proceed with the request
				return true;
			}
			// Generate the hash
			var hash = $.Ajaxy.format($form.attr('action'));//.replace(/[?\.]?\/?/, '#/');
			// Perform request
			Ajaxy.go({
				'hash':	hash,
				'form':	this
			});
			// Prevent
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
	};
	
	/**
	 * Ajaxify an Element
	 * Eg. $('#id').ajaxify();
	 * @param {Object} options
	 */
	$.fn.ajaxify = function ( options ) {
		var Ajaxy = $.Ajaxy;
		var $this = $(this);
		// Ajaxify the controllers
		for ( var controller in $.Ajaxy.controllers ) {
			$.Ajaxy.ajaxifyController(controller);
		}
		// Add the onclick handler for ajax compatiable links
		$this.find('a.ajaxy').unbind('click',ajaxify_helper.a).click(ajaxify_helper.a);
		// Add the onclick handler for ajax compatiable forms
		$this.find('form.ajaxy').unbind('submit',ajaxify_helper.form).submit(ajaxify_helper.form);
		// And chain
		return this;
	};
	
	/**
	 * Ajaxy
	 */
	$.Ajaxy = {
		
		// -----------------
		// Options
		
		/**
		 * User configuration
		 */
		options: {
			root_url: '',
			base_url: '',
			relative_url: '',
			analytics: true,
			auto_ajaxify: true,
			debug: false
		},
		
		// -----------------
		// Variables
		
		/**
		 * Have we been constructed
		 */
		constructed: false,
		
		/**
		 * Collection of Controllers
		 */
		controllers: {},
		
		/**
		 * Collection of hashes
		 */
		hashes: {},
		
		/**
		 * Queue for our events
		 * @param {Object} hash
		 */
		ajaxqueue: [],
		
		/**
		 * Our assigned data
		 * @param {Object} data
		 */
		data: {},
			
		/**
		 * Contains any redirect data in case we were
		 * @param {Object} redirected
		 */
		redirected: false,
		
		// --------------------------------------------------
		// Functions
		
		/**
		 * Format a hash accordingly
		 * @param {String} hash
		 */
		format: function (hash){
			var Ajaxy = $.Ajaxy; var History = $.History;
			// Strip urls
			hash = hash.replace(/^\//, '').strip(Ajaxy.options.root_url).strip(Ajaxy.options.base_url);
			// History format
			hash = History.format(hash);
			// Slash
			if ( hash ) hash = '/'+hash;
			// All good
			return hash;
		},
		
		/**
		 * Bind controllers
		 * Either via Ajaxy.bind(controller, options), or Ajaxy.bind(controllers)
		 * @param {String} controller
		 * @param {Object} options
		 */
		bind: function ( controller, options ) {
			var Ajaxy = $.Ajaxy;
			// Add a controller
			if ( typeof options === 'undefined' && typeof controller === 'object' ) {
				// Array of controllers
				for (index in controller) {
					Ajaxy.bind(index, controller[index]);
				}
				return true;
			} else if ( typeof options === 'function' ) {
				// We just have the response handler
				options = {
					'response': options
				}
			} else if ( typeof options !== 'object' ) {
				// Unknown handlers
				console.error('AJAXY: Bind: Unknown option type', controller, options);
				return false;
			}
			
			// Create the controller
			if ( typeof Ajaxy.controllers[controller] === 'undefined' ) {
				Ajaxy.controllers[controller] = {
					trigger:function(action){
						return Ajaxy.trigger(controller, action);
					},
					ajaxy_data: {},
					response_data: {},
					request_data: {},
					error_data: {}
				};
			}
			
			// Bind the handlers to the controller
			for ( option in options ) {
				Ajaxy.controllers[controller][option] = options[option];
			}
			
			// Ajaxify the controller
			Ajaxy.ajaxifyController(controller);
			
			// Done
			return true;
		},
		
		/**
		 * Ajaxify a particullar controller
		 * @param {String} controller
		 */
		ajaxifyController: function(controller) {
			var Ajaxy = $.Ajaxy; var History = $.History;
			// Do selector
			if ( typeof this.controllers[controller]['selector'] !== 'undefined' ) {
				// We have a selector
				$(function(){
					// Onload
					var $els = $(Ajaxy.controllers[controller]['selector']);
					var handler = function(){
						// Check to make sure we aren't already where we need to be
						var hash = Ajaxy.format($(this).attr('href'));
						if ( hash === History.getHash() ) return false;
						// Fire the request handler
						Ajaxy.trigger(controller, 'request');
						// Cancel link
						return false;
					};
					$els.click(handler);
				})
			}
		},
		
		/**
		 * Trigger the action for the particular controller
		 * @param {Object} controller
		 * @param {Object} action
		 * @param {Object} args
		 * @param {Object} params
		 */
		trigger: function ( controller, action, args, params ) {
			var Ajaxy = $.Ajaxy;
			// Trigger
			if ( Ajaxy.options.debug ) console.debug('Ajaxy.trigger: ', [this, arguments, params]);
			
			// Fire the state handler
			params = params || {};
			args = args || [];
			var i, n, list, call_generic;
			call_generic = true;
			
			// Check Controller
			if ( typeof controller === 'undefined' || controller === null ) {
				console.info('Ajaxy.trigger: Controller Reset', [controller, action], [this, arguments]);
				controller = '_generic';
			}
			if ( typeof Ajaxy.controllers[controller] === 'undefined' ) {
				// No Controller
				console.error('Ajaxy.trigger: No Controller', [controller, action], [this, arguments]);
				console.trace();
				if ( controller !== '_generic' ) {
					Ajaxy.trigger('_generic', 'error', args, params);
				}
				return false;
			}
			
			// Check Controller Action
			if ( typeof Ajaxy.controllers[controller][action] === 'undefined' ) {
				// No Action
				console.error('Ajaxy.trigger: No Controller Action', [controller, action], [this, arguments]);
				console.trace();
				if ( controller !== '_generic' ) {
					Ajaxy.trigger('_generic', 'error', args, params);
				}
				return false;
			}
			
			// Apply the Params to the Controller
			params.propagate = (typeof params.propagate === 'undefined' || params.propagate) ? true : false;
			params.request_data = params.request_data||{};
			params.response_data = params.response_data||{};
			params.error_data = params.error_data||{};
			params.user_data = params.user_data||{};
			params.ajaxy_data = $.extend({},{
				controller: controller,
				action: action
			}, params.ajaxy_data||{});
			
			// Apply
			Ajaxy.controllers[controller].propagate = params.propagate;
			Ajaxy.controllers[controller].request_data = params.request_data;
			Ajaxy.controllers[controller].response_data = params.response_data;
			Ajaxy.controllers[controller].error_data = params.error_data;
			Ajaxy.controllers[controller].user_data = params.user_data;
			Ajaxy.controllers[controller].ajaxy_data = params.ajaxy_data;
			
			// Forward
			Ajaxy.controllers[controller].forward = function(_controller, _action, _args, _params){
				if ( Ajaxy.options.debug ) console.debug('Ajaxy.triger.forward:', [controller, action, args, params], [this, arguments]);
				_action = _action||action;
				_args = _args||args;
				_params = _params||this;
				Ajaxy.trigger(_controller, _action, _args, _params);
				return true;
			}
			
			// Fire the specific handler
			var handler = Ajaxy.controllers[controller][action];
			var result = handler.apply(Ajaxy.controllers[controller], args);
			//if ( result === false ) {
			if ( Ajaxy.controllers[controller].propagate === false ) {
				// Break
				call_generic = false;
			}
			
			// Fire generic
			if ( call_generic && controller !== '_generic' ) {
				Ajaxy.controllers[controller].forward('_generic');
			}
			
			// Done
			return true;
		},
		
		/**
		 * Get a piece of data
		 * @param {Object} name
		 */
		get: function ( name ) {
			var Ajaxy = $.Ajaxy;
			
			//
			if ( typeof Ajaxy.data[name] !== 'undefined' ) {
				return Ajaxy.data[name];
			} else {
				return undefined;
			}
		},
		
		/**
		 * Set a piece (or pieces) of data
		 * Ajaxy.set(data), Ajaxy.set(name, value)
		 * @param {Object} data
		 * @param {Object} value
		 */
		set: function ( data, value ) {
			var Ajaxy = $.Ajaxy;
			
			// Set route data
			if ( typeof value === 'undefined' ) {
				if ( typeof data === 'object' ) {
					Ajaxy.data.extend(true, data);
				}
			} else {
				Ajaxy.data[data] = value;
			}
		},
		
		/**
		 * Refresh
		 */
		refresh: function(){
			var Ajaxy = $.Ajaxy; var History = $.History;
			// Go
			return Ajaxy.go(History.getHash());
		},
		
		/**
		 * Perform an Ajaxy Request
		 * @param {Object} data
		 */
		go: function ( data ) {
			var Ajaxy = $.Ajaxy; var History = $.History;
			// Go
			if ( Ajaxy.options.debug ) console.debug('Ajaxy.go:', [this, arguments]);
			
			// Ensure format
			if ( typeof data === 'string' ) {
				// We have just a hash
				data = {
					hash: data
				};
			}
			
			// Ensure callbacks
			
			// Prepare
			var hashdata = {
				url: 		data.url || null,
				hash: 		data.hash || null,
				form: 		data.form || null,
				data: 		data.data || {},
				history:	typeof data.history === 'undefined' ? null : data.history,
				response: 	data.response || data.success || null,
				request:	data.request || null,
				error: 		data.error || null
			};
			
			// Ensure hash
			if ( !hashdata.hash && hashdata.url ) {
				hashdata.hash = Ajaxy.format(hashdata.url);
				// We have a URL
				// Don't log by default
				if ( hashdata.history === null ) {
					hashdata.history = false;
				}
			} else if ( hashdata.form ) {
				// We have a form
				// Don't log by default
				if ( hashdata.history === null ) {
					hashdata.history = false;
				}
			} else {
				// We are normal
				// Do log by default
				if ( hashdata.history === null ) {
					hashdata.history = true;
				}
			}
			
			// Ensure
			hashdata.history = hashdata.history ? true : false
			
			// Check hash
			if ( !hashdata.hash ) {
				console.error('Ajaxy.request: No Hash');
				return false;
			} else {
				hashdata.hash = Ajaxy.format(hashdata.hash);
			}
			
			// Figure it out
			if ( hashdata.hash !== History.getHash() && Ajaxy.options.debug ) {
				if ( Ajaxy.options.debug ) console.debug('Ajaxy.reqest: Trigger but no change.', hashdata.hash);
			}
			
			// Assign data for reuse
			Ajaxy.hashes[hashdata.hash] = hashdata;
			
			// Trigger hash
			if ( hashdata.history ) {
				// Log the history
				// Trigger automaticly
				History.go(hashdata.hash);
			} else {
				// Don't log
				// Trigger manually
				Ajaxy.hashchange(hashdata.hash);
			}
			
			// Done
			return true;
		},
		
		/**
		 * Send an Ajaxy Request
		 * @param {Object} hash
		 */
		request: function (hash) {
			var Ajaxy = $.Ajaxy; var History = $.History;
			
			// Format the hash
			hash = Ajaxy.format(hash);
			
			// Check if we were a redirect
			if ( Ajaxy.redirected !== false ) {
				// We were, ignore as we have already been fired
				Ajaxy.redirected = false;
				return;
			}
			
			// Add to AJAX queue
			Ajaxy.ajaxqueue.push(hash);
			if ( Ajaxy.ajaxqueue.length !== 1 ) {
				// Already processing an event
				return false;
			}
			
			// Fire the analytics
			if ( this.options.analytics && typeof pageTracker !== 'undefined' ) {
				pageTracker._trackPageview('/'+hash);
			}
			
			// Ensure the Hash Data
			var hashdata;
			hashdata = Ajaxy.hashes[hash] = Ajaxy.hashes[hash] || {};
			hashdata.url = (hashdata.url || Ajaxy.options.root_url+Ajaxy.options.base_url+(hash.replace(/^\//, '') || '?'));
			hashdata.hash = hash;
			hashdata.form = hashdata.form || null;
			hashdata.data = hashdata.data || {};
			hashdata.data.Ajaxy = true;
			hashdata.response = hashdata.response || null;
			hashdata.request = hashdata.request || null;
			hashdata.error = hashdata.error || null;
			hashdata.request_data = hashdata.request_data||{};
			hashdata.response_data = hashdata.response_data||{};
			hashdata.error_data = hashdata.error_data||{};
			
			// Trigger Request
			Ajaxy.trigger('_generic', 'request');
			
			// Define handlers
			var request;
			request = {
				data: hashdata.data,
				url: hashdata.url,
				type: 'post',
				dataType: 'json',
				success: function(response_data, status){
					// Success
					if ( Ajaxy.options.debug ) console.debug('Ajaxy.request.success:', [this, arguments]);
					
					// Prepare
					response_data = response_data || {};
					response_data.Ajaxy = response_data.Ajaxy || {};
					
					// Check for redirect
					if ( response_data.Ajaxy.redirected ) {
						// A redirect was performed, set a option so we know what to do
						var newhash = Ajaxy.format(response_data.Ajaxy.redirected.to);
						Ajaxy.redirected = {
							status: true,
							from: hash,
							to: newhash
						};
						// Update the history, not ajaxy
						History.go(newhash);
						// We do the redirect check up the top, so no worries here, this one flows through like normal
					};
					
					// Success function
					Ajaxy.ajaxqueue.shift()
					var queue_hash = Ajaxy.ajaxqueue.pop();
					if (queue_hash && queue_hash !== hash) {
						Ajaxy.ajaxqueue = []; // abandon others
						Ajaxy.hashchange(queue_hash);
						return false; // don't care for this
					}
					
					// Prepare
					hashdata.response_data = response_data;
					hashdata.error_data = {};
					
					// Check controller
					var controller = response_data.controller || null;
					
					// Fire callback
					if ( hashdata.response ) {
						if ( hashdata.response.apply(hashdata, arguments) || controller === 'callback' ) {
							// Ignore the rest
							return true;
						}
						if ( !controller ) {
							// If we are continueing on, ignore missing controller
							controller = '_generic';
						}
					}
					
					// Trigger handler
					return Ajaxy.trigger(controller, 'response', [], hashdata);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown, response_data){
					// Error
					if ( Ajaxy.options.debug ) console.debug('Ajaxy.request.error:', [this, arguments]);
					
					// Prepare
					if ( !response_data ) {
						response_data = {
							responseText: XMLHttpRequest.responseText
						}
					}
					
					// Handler queue
					Ajaxy.ajaxqueue.shift()
					var queue_hash = Ajaxy.ajaxqueue.pop();
					if (queue_hash && queue_hash !== hash) {
						Ajaxy.ajaxqueue = []; // abandon others
						Ajaxy.hashchange(queue_hash);
						return false; // don't care for this
					}
					
					// Prepare
					var error_data = {
						XMLHttpRequest: XMLHttpRequest,
						textStatus: textStatus,
						errorThrown: errorThrown
					};
					
					// Prepare
					hashdata.request_data.XMLHttpRequest = XMLHttpRequest;
					hashdata.response_data = response_data;
					hashdata.error_data = {};
					
					// Check controller
					var controller = response_data.controller || null;
					
					// Fire callback
					if ( hashdata.response ) {
						if ( hashdata.response.apply(hashdata, arguments) || controller === 'callback' ) {
							// Ignore the rest
							return true;
						}
						if ( !controller ) {
							// If we are continueing on, ignore missing controller
							controller = '_generic';
						}
					}
					
					// Trigger handler
					return Ajaxy.trigger(controller, 'error', [], hashdata);
				},
				
				complete:	function ( XMLHttpRequest, textStatus ) {
					// Request completed
					if ( Ajaxy.options.debug ) console.debug('Ajaxy.request.complete:', [this, arguments]);
					// Set XMLHttpRequest
					hashdata.request_data.XMLHttpRequest = XMLHttpRequest;
					// Ignore for some reason
					if ( false && this.url !== XMLHttpRequest.channel.name ) {
						// A redirect was performed, set a option so we know what to do
						var newhash = Ajaxy.format(XMLHttpRequest.channel.name);
						Ajaxy.redirected = {
							status: true,
							from: hash,
							to: newhash
						};
						// Update the history, not ajaxy
						History.go(newhash);
					};
				}
			};
			
			// Handle form if need be
			if ( hashdata.form ) {
				var $form = $(hashdata.form);
					
				// Determine form type
				var enctype = $form.attr('enctype');
				if ( enctype === 'multipart/form-data' ) {
					// We are a complicated form
					// Submit via target
					
					// Generate iframe
					var iframe_id = 'ajaxy_form_iframe_' + Math.floor(Math.random() * 99999);
					var $iframe = $('<iframe style="display:none" src="about:blank" id="'+iframe_id+'" name="'+iframe_id+'" >').appendTo('body').hide();
					var $ajax = $('<input type="hidden" name="ajax" value="true"/>').appendTo($form);
					var $hidden = $('<input type="hidden" name="Ajaxy[form]" value="true"/>').appendTo($form);
					
					// Event
					$iframe.bind('load', function(){
						var iframe = this.document || this.currentDocument || this.contentWindow.document;
						
						// Check location
						if ( iframe.location.href === 'about:blank' ) {
							return true;
						}
						
						// Fire handler
						var text = $iframe.contents().find('.response').val();
						var json = false;
						try {
							json = JSON.parse(text);
						} catch ( e ) {
							console.error('Invalid response: ', text, [this, arguments]);
						}
						if ( json ) {
							request.success(json);
						} else {
							request.error(json);
						}
						
						// Clean up
						$form.removeAttr('target');
						$iframe.remove();
						$ajax.remove();
						$hidden.remove();
					});
					
					// Adjust the form
					$form.attr('target', iframe_id);
					
					// Submit the form
					$form.submit();

					// Update
					var values = $form.values();
					request.data = hashdata.data = $.extend(request.data, values);
					hashdata.request_data = request;
					
					// Done with this
					return true;
				}
				else {
					// Normal form
					var values = $form.values();
					request.data = hashdata.data = $.extend(request.data, values);
				}
			}
			
			// Update
			hashdata.request_data = request;
			
			// Perform AJAX request
			return Ajaxy.ajax(request);
		},
		
		
		/**
		 * Wrapper for Ajaxy Request
		 * @param {Object} data
		 */
		ajax: function(options){
			var Ajaxy = $.Ajaxy; var History = $.History;
			// Defaults
			var callbacks = {};
			callbacks.success = options.success || function (response_data, status) {
				// Success
				if ( Ajaxy.options.debug ) console.debug('Ajaxy.ajax.callbacks.success:', [this, arguments]);
				// Handle
				$('.error').empty();
			};
			callbacks.error = options.error || function (XMLHttpRequest, textStatus, errorThrown, response_data) {
				// Error
				if ( Ajaxy.options.debug ) console.debug('Ajaxy.ajax.callbacks.error:', [this, arguments]);
				// Handle
				$('.error').html(errorThrown);
			};
			callbacks.complete = options.complete || function(XMLHttpRequest, textStatus){
				// Request completed
				if ( Ajaxy.options.debug ) console.debug('Ajaxy.ajax.callbacks.complete:', [this, arguments]);
			};
			delete options.success;
			delete options.error;
			delete options.complete;
			
			// Prepare
			var request = $.extend({
				type:		'post',
				dataType:	'json'
			}, options || {});
			
			// Handlers
			request.success = function(response_data, status){
				// Success
				if ( Ajaxy.options.debug ) console.debug('Ajaxy.ajax.success:', [this, arguments]);
				// Check
				if ( typeof response_data.controller === 'undefined' && ((typeof response_data.success !== 'undefined' && !response_data.success) || (typeof response_data.error !== 'undefined' && response_data.error)) ) {
					// Error on simple Ajax request, not Ajaxy
					return callbacks.error.apply(this, [null, status, response_data.error, response_data]);
				}
				// Fire
				return callbacks.success.apply(this, [response_data, status]);
			};
			request.error = function(XMLHttpRequest, textStatus, errorThrown) {
				// Error
				if ( Ajaxy.options.debug ) console.debug('Ajaxy.ajax.error:', [this, arguments]);
				
				// Check if we really are an error
				if ( XMLHttpRequest.responseText && XMLHttpRequest.responseText[0] === '{' ) {
					var response_data = JSON.parse(XMLHttpRequest.responseText);
					return this.success.apply(this, [response_data, textStatus]);
				}
				
				// Apply
				return callbacks.error.apply(this, [XMLHttpRequest, textStatus, errorThrown, response_data]);
			};
			
			// Send the Request
			return $.ajax(request);
		},
		
		
		/**
		 * Handler for a hashchange
		 * @param {Object} hash
		 */
		hashchange: function ( hash ) {
			var Ajaxy = $.Ajaxy; var History = $.History;
			
			// Perform the Request
			Ajaxy.request(hash);
		},
		
		// --------------------------------------------------
		// Constructors
		
		/**
		 * Configure Ajaxy
		 * @param {Object} options
		 */
		configure: function ( options ) {
			var Ajaxy = $.Ajaxy; var History = $.History;
			
			// Extract
			var controllers, routes;
			if ( typeof options.controllers !== 'undefined' ) {
				controllers = options.controllers; delete options.controllers;
			}
			if ( typeof options.routes !== 'undefined' ) {
				routes = options.routes; delete options.routes;
			}
			
			// Set options
			Ajaxy.options = $.extend(Ajaxy.options, options);
			
			// Set params
			Ajaxy.bind(controllers);
			
			
			// URLs
			Ajaxy.options.root_url = (Ajaxy.options.root_url || document.location.protocol.toString()+'//'+document.location.hostname.toString()).replace(/\/$/, '')+'/';
			Ajaxy.options.base_url = (Ajaxy.options.base_url || '').replace(/^\/|\/$/, '');
			if ( Ajaxy.options.base_url ) Ajaxy.options.base_url += '/';
			Ajaxy.options.relative_url = Ajaxy.format(Ajaxy.options.relative_url || document.location.pathname.toString().replace(/^\//, ''));
			
			// Initial redirect
			Ajaxy.options.relative_url = Ajaxy.options.relative_url.strip(Ajaxy.options.root_url).strip(Ajaxy.options.base_url);
			if ( Ajaxy.options.relative_url && Ajaxy.options.relative_url !== null  ) {
				var location = Ajaxy.options.root_url+Ajaxy.options.base_url+'#/'+Ajaxy.format(Ajaxy.options.relative_url).replace(/^\//, '');
				document.location = location;
			}
			
			
			// Done
			return true;
		},
		
		/**
		 * Construct Ajaxy
		 * @param {Object} options
		 */
		construct: function ( )
		{	// Construct our Plugin
			var Ajaxy = $.Ajaxy; var History = $.History;
			
			// Check if we've been constructed
			if ( Ajaxy.constructed ) {
				return;
			} else {
				Ajaxy.constructed = true;
			}
			
			// Set AJAX History Handler
			History.bind(function(hash)
			{	// History Handler
				return Ajaxy.hashchange(hash);
			});
			
			// Modify the document
			$(function()
			{	// On document ready
				Ajaxy.domReady();
				History.domReady();
			});
			
			// All done
			return true;
		},
		
		/**
		 * Perform any DOM manipulation
		 */
		domReady: function ( )
		{	// We are good
			var Ajaxy = $.Ajaxy;
			
			// Auto ajaxify?
			if ( Ajaxy.options.auto_ajaxify ) {
				$('body').ajaxify();
			}
			
			// All done
			return true;
		}
	
	};
	
	// Construct
	$.Ajaxy.construct();

// Finished definition
})(jQuery); // We are done with our plugin, so lets call it with jQuery as the argument
