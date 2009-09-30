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
	
	// Prereqs
	if ( typeof String.prototype.trim  === 'undefined' ) {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	
	// Helpers
	$.fn.cancel = function(callback){
		return $(this).keypress(function(e){
			if ( e.keyCode === 27 ) { // ESC
				callback.call(this);
			}
		});
	};
	$.fn.enter = function(callback){
		return $(this).keypress(function(e){
			if ( e.keyCode === 13 ) { // Enter
				callback.call(this);
			}
		});
	};
	
	// Boolean Helpers
	$.isPossibleTrue = function(value){
		return value === 1 || value === '1' || value === 'true' || value === true || value === 'yes' || value === 'on';
	}
	$.isPossibleFalse = function(value){
		return !value || value === 0 || value === '0' || value === 'false' || value === false || value === 'no' || value === 'off';
	}
	$.isPossibleBoolean = function(value){
		return	$.isPossibleTrue(value) || $.isPossibleFalse(value);
	}
	
	// Timepicker
	$.fn.timepicker = function(options){
		var $input = $(this);
		$input.hide();
		// Prepare
		$input.addClass('jquery-time');
		// Generate
		var $hours = $('<select class="jquery-time-hours" />');
		for ( var hours=12,hour=1; hour<=hours; ++hour ) {
			$hours.append('<option>'+hour+'</option>');
		}
		var $minutes = $('<select class="jquery-time-minutes" />');
		for ( var mins=12,min=1; min<=mins; ++min ) {
			$minutes.append('<option>'+min+'</option>');
		}
		var $meridian = $('<select class="jquery-time-meridian" />');
		$meridian.append('<option>am</option>');
		$meridian.append('<option>pm</option>');
		// Defaults
		var value = $input.val();
		var date = new Date(value);
		var hours = date.getUTCDate();
		var minutes = date.getUTCMinutes();
		var meridian = 'am';
		if ( hours > 12 ) {
			hours -= 12; meridian = 'pm';
		}
		// Apply
		$hours.val(hours);
		$minutes.val(minutes);
		$meridian.val(meridian);
		// Bind
		$hours.add($minutes).add($meridian).change(function(){
			var value = $hours.val()+':'+$minutes.val()+' '+$meridian.val();
			$input.val(value);
		});
		// Append
		$meridian.insertAfter($input);
		$minutes.insertAfter($input);
		$hours.insertAfter($input);
		// Done
		return $input;
	}
	
	/**
	 * Gates Application
	 * Declares & Defines our Application Object
	 */
	$.Gates = {
		
		// -----------------
		// Elements
			
		$body: null,
	
		// -----------------
		// Variables
		
		options: {
			root_url: '',
			base_url: '',
			relative_url: '',
			dateformat: 'yy-mm-dd',
			timeconvention: 24,
			debug: false,
			error_message: 'An error has occurred.',
			logout_seconds: false,
			logout_url: false
		},
	
		// -----------------
		// Functions
		
		/**
		 * Application Constructor
		 * Initialises our Application
		 * @param {Object} options
		 */
		construct: function(options){
			var Gates = $.Gates; var Ajaxy = $.Ajaxy;
			
			// Apply options
			Gates.options = $.extend(Gates.options, options);
			
			// Dateformat
			$.Sparkle.options.dateformat = Gates.options.dateformat;
			$.Sparkle.options.timeconvention = Gates.options.timeconvention;
			
			// Ajaxify
			if (($.Ajaxy || false)) {
				Gates.ajaxify();
			}
			
			// Document Ready
			$(function(){
				// Prepare Elements
				Gates.$body = $(document.body);
				
				// Ajaxify
				if (($.Ajaxy || false)) {
					// Add ajaxify to Sparkle
					$.Sparkle.extensions.add('ajaxify', function(){
						return $(this).ajaxify();
					});
				}

				// Add Gates to Sparkle
				$.Sparkle.extensions.add('gates', function(){
					var $this = $(this); var Sparkle = $.Sparkle;
					return $this.find('.js-hide,.hide,.prototype').hide();
					return $this.find('.js-show').show();
				});
				
				// Sparkle
				Gates.$body.sparkle();
				
				// Timeout
				if ( Gates.options.logout_url||false ) {
					Gates.timer.setup();
				}
			});
		},

		timer: {
			timeout: false,
			time: false,
			clear: function(){
				var Gates = $.Gates; var Ajaxy = $.Ajaxy;
				// Clear
				clearTimeout(Gates.timer.timeout);
				Gates.timer.timeout = false;
			},
			action: function(){
				var Gates = $.Gates; var Ajaxy = $.Ajaxy;
				// Timeout
				document.location = Gates.options.logout_url;
			},
			setup: function(){
				var Gates = $.Gates; var Ajaxy = $.Ajaxy;
				// Setup timer
				Gates.timer.time = (Gates.options.logout_seconds||10*60)*1000;
				Gates.timer.reset();
			},
			reset: function(){
				var Gates = $.Gates; var Ajaxy = $.Ajaxy;
				// Reset timer
				Gates.timer.clear();
				Gates.timer.timeout = setTimeout(Gates.timer.action, Gates.timer.time);
			}
		},
		
		/**
		 * Ajaxify our Application
		 * Binds our handlers and ajaxifys compatiable links
		 */
		ajaxify: function(){
			var Gates = $.Gates; var Ajaxy = $.Ajaxy;
			
			// Message
			var Message = {
				show: function ( element, message, format ) {
					// Prepare
					format = format||'auto';
					if ( format === 'auto' ) {
						format = ($(message).length === 0) ? 'text': 'html';
					}
					// Fetch
					var $el = $(element);
					if ( !$el.length || !message || typeof message !== 'string' ) {
						return this;
					}
					// Apply
					$el.hide();
					switch ( format ) {
						case 'text':
							$el.text(message).wrapInner('<pre>');
							break;
						default:
						case 'html':
							$el.html(message);
							break;
					}
					// Display
					$el.sparkle().animate({height:'show',opacity:'show'});
					// Done
					return this; // chain
				},
				hide: function ( element ) {
					 $(element).animate({height:'hide',opacity:'hide'},200,function(){
						$(this).empty();
					});
					// Done
					return this; // chain
				}
			};
			
			// Controllers
			var controllers = {
				'_generic': {
					request: function(){
						var Gates = $.Gates; Gates.timer.reset();
						// Debug
						if ( Gates.options.debug ) console.debug('Gates.Ajaxy._generic.request: ', [this, arguments]);
						// Loading
						Gates.$body.addClass('loading');
						$('#loading-modal').hide().fadeIn(200);
						// Clean
						Message.hide('.error:last').hide('.success:last');
						$(':input.invalid').removeClass('invalid');
						// Done
						return true;
					},
					response: function(){
						var Gates = $.Gates; Gates.timer.reset(); var data = this.response_data;
						// Debug
						if ( Gates.options.debug ) console.debug('Gates.Ajaxy._generic.response: ', [this, arguments]);
						// Title
						if ( data.title ) {
							document.title = data.title;
						}
						// Loaded
						Gates.$body.removeClass('loading');
						$('#loading-modal').hide();
						// Populate
						Message.show('.error:last', data.error||false).show('.success:last', data.success||false);
						// Reload?
						if ( !(data.error||false) && data.reload||false ) {
							document.location.reload();
						}
						// Done
						return true;
					},
					error: function(){
						var Gates = $.Gates; Gates.timer.reset(); var data = this.response_data; var Ajaxy = $.Ajaxy;
						// Unmanaged Error
						// Populate
						var error = this.user_data.error||data.error||data.responseText||false;
						// Log
						console.warn('Gates.Ajaxy._generic.error: ', [error, this.user_data.error, data.error, data.responseText], [this, arguments]);
						if ( !error ) {
							// Default
							// Try and detect the message
							if ( this.request_data.data['Ajaxy[error_likely]']||false ) {
								error = this.request_data.data['Ajaxy[error_likely]'];
							} else {
								error = Gates.options.error_message;
							}
						}
						// Log
						console.warn('Gates.Ajaxy._generic.error: ', [error, this.user_data.error, data.error, data.responseText], [this, arguments]);
						// Handle
						if ( error ) {
							// Discover
							var managed = typeof this.user_data.error === 'undefined' ? false : true;
							var error_format = this.user_data.error_format||false;
							if ( !error_format ) error_format = (data.responseText||false) ? 'text' : 'auto';
							// Handle
							switch ( error_format ) {
								case 'page':
									$('#page').hide().html(error).sparkle().fadeIn(400);
									break;
								default:
									var $error = $('.error:last');
									if ( $error.length ) {
										// Show Error
										Message.show($error, error, error_format);
										// Custom Error
										switch ( data.error||false ) {
											case 'error-doctrine-validation':
												for ( var i=0,n=data.messages.length; i<n; ++i ) {
													var message = data.messages[i];
													var $field = $(':input[name='+message.table+'['+message.field+']'+']');
													$field.addClass('invalid');
												}
												break;
											default:
												break;
										}
									} else {
										// Error
										console.error('Gates.Ajaxy._generic.error: Could not find error element:', error, [this, arguments]);
										console.trace();
									}
									break;
							}
						}
						// Success
						Message.show('.success:last', data.success||false);
						// Loaded
						Gates.$body.removeClass('loading');
						$('#loading-modal').hide();
						// Done
						return true;
					}
				},
				'error': {
					response: function(){
						var Gates = $.Gates; var data = this.response_data; var Ajaxy = $.Ajaxy;
						// Managed Error
						if (Gates.options.debug) {
							console.warn('Gates.Ajaxy.error.response: ', data, [this, arguments]);
						}
						// Prepare
						this.propagate = false;
						// Error
						this.user_data.error_format = (Gates.options.debug) ? 'page' : 'auto';
						this.user_data.error = (this.user_data.error_format === 'page') ? data.view : $(data.view).find('.message').html();
						// Forward
						this.forward('_generic', 'error');
						// Done
						return true;
					}
				},
				'login': {
					response: function(){
						var Gates = $.Gates;
						document.location = Gates.options.base_url;
					}
				},
				'modal': {
					selector: '.ajaxy__modal',
					request: function(){
						var Gates = $.Gates;
						// Request
						if ( Gates.options.debug ) console.debug('Gates.Ajaxy.modal.request: ', [this, arguments]);
						// DOM
						// We don't want to perform a animation here as it doesn't look that good
						// $('#page').fadeOut(400);
						// Done
						return true;
					},
					response: function(){
						var Gates = $.Gates; var data = this.response_data; var Ajaxy = $.Ajaxy;
						// Response
						if ( Gates.options.debug ) {
							console.debug('Gates.Ajaxy.modal.response: ', [this, arguments]);
						}
						
						// Prepare Events
						var cancel = function(callback){
							var $modal = $('body > .modal');
							// $modal.siblings().unbind('click', cancel);
							$modal.fadeOut(200, function(){
								$modal.hide().empty();
								if ( typeof callback === 'function' ) callback();
							});
							// Overlay
							var $overlay = $('body > .overlay');
							$overlay.fadeOut(200, function(){
								$overlay.hide().empty();
							});
							return true;
						};
						
						// Handle Submit
						if ( data.submit||false && data.success||false ) {
							switch ( data.modal ) {
								case 'confirm':
									if ( Gates.confirm_callback ) {
										// Do callback
										Gates.confirm_callback.apply(this, [data]);
									}
									break;
								default:
									break;
							}
						}
						
						// Handle Display
						if ( !(data.view||false) ) {
							// Submit was good
							return cancel(function(){
								if ( data.refresh||false ) {
									// Refresh?
									Ajaxy.refresh();
								}
							});
						}
						
						// Prepare Modal
						var $modal = $('body > .modal');
						if ( $modal.length === 0 ) {
							$modal = $('<div class="modal"/>').appendTo(document.body);
						} else {
							$modal.empty();
						}
						
						// Display Modal
						// $modal.siblings().unbind('click', cancel).bind('click', cancel);
						$modal.hide().html(data.view).sparkle().find('.cancel-button').click(cancel);
						$modal.fadeIn(200).find(':input:not(:hidden):visible:first').focus();
						
						// Overlay
						var $overlay = $('body > .overlay');
						if ( $overlay.length === 0 ) {
							$overlay = $('<div class="overlay"/>').appendTo(document.body);
						}
						var opacity = $overlay.css('opacity');
						$overlay.css('opacity', 0).fadeTo(200, opacity);
						
						// Done
						return true;
					}
				},
				'page': {
					selector: '.ajaxy__page',
					request: function(){
						var Gates = $.Gates;
						// Request
						if ( Gates.options.debug ) console.debug('Gates.Ajaxy.page.request: ', [this, arguments]);
						// DOM
						// We don't want to perform a animation here as it doesn't look that good
						// $('#page').fadeOut(400);
						// Done
						return true;
					},
					response: function(){
						var Gates = $.Gates; var data = this.response_data; var Ajaxy = $.Ajaxy;
						// Response
						if ( Gates.options.debug ) console.debug('Gates.Ajaxy.page.response: ', [this, arguments]);
						// Logic
						if ( data.search ) {
							Ajaxy.set('search', data.search);
						}
						// DOM// DOM
						$('#page-menu').find('ul > li.'+data.page).addClass('selected').siblings('.selected').removeClass('selected');
						$('#page').hide().html(data.view).sparkle().fadeIn(400);
						// Done
						return true;
					}
				},
				'page-staff/subpage': {
					selector: '.ajaxy__page-staff-subpage',
					request: function(){
						// Forward
						return this.forward('page-applicant/subpage', 'request');
					},
					response: function(){
						// Forward
						return this.forward('page-applicant/subpage', 'response');
					}
				},
				'page-applicant/subpage': {
					selector: '.ajaxy__page-applicant-subpage',
					request: function(){
						var Gates = $.Gates;
						// DOM
						// $('#subpage').fadeOut(400);
						// Done
						return true;
					},
					response: function(){
						var Gates = $.Gates; var data = this.response_data;
						// Response
						if ( Gates.options.debug ) console.debug('Gates.Ajaxy.page-applicant/subpage.response: ', [this, arguments]);
						// DOM
						$('#subpage-menu').find('ul > li.'+data.subpage).addClass('selected').siblings('.selected').removeClass('selected');
						$('#subpage').hide().html(data.view).sparkle().fadeIn(200);
						// Done
						return true;
					}
				}
			};
			
			// Configure ajaxy
			Ajaxy.configure({
				'controllers': controllers,
				'relative_url': Gates.options.relative_url,
				'root_url': Gates.options.root_url,
				'base_url': Gates.options.base_url,
				'debug': Gates.options.debug
			});
		},
		
		confirm_callback: false,
		confirm_done: true,
		/** Ajaxy AJAX helper so that we can do the confirm */
		confirm_ajax: function(callback, url, error) {
			var Gates = $.Gates; var Ajaxy = $.Ajaxy;
			// Reset
			Gates.confirm_callback = false;
			Gates.confirm_done = false;
			// Confirm
			Ajaxy.go({
				url: url,
				history: false,
				success: function(){
					// Set Confirmation Callback
					// to send the form again as we are good
					Gates.confirm_callback = function(data){
						// Confirmed
						Gates.confirm_done = true;
						// Note
						data = data || {};
						data.confirm = data.confirm || {};
						// Callback
						callback(data);
						// Done
						return true;
					}
				},
				error: error||null
			});
			// Done
			return true;
		},
		/** Ajaxy Form helper so that we can do the confirm */
		confirm_form: function($form, url){
			var Gates = $.Gates; var Ajaxy = $.Ajaxy;
			// Reset
			Gates.confirm_callback = false;
			Gates.confirm_done = false;
			// Prepare
			$form = $($form);
			var callback = function(data){
				// Confirmed
				$form.attr('disabled', false);
				// Note
				for ( key in data.confirm ) {
					var value = data.confirm[key]||false;
					$form.find(':input[name='+key+']').remove();
					$('<input type="hidden" name="'+key+'">').val(value).appendTo($form);
				}
				// Submit
				$form.trigger('submit');
				// Done
				return true;
			};
			// Bind later
			$form.submit(function(e){
				// Check
				var confirmed = Gates.confirm_done;
				if ( !confirmed ) {
					// Request
					Gates.confirm_ajax(callback, url, function(){
						// Error
						$form.attr('disabled', false);
					});
					// Prevent
					e.stopPropagation();
					e.preventDefault();
					$form.attr('disabled', true);
					return false;
				} else {
					$form.removeAttr('disabled');
				}
				// Done
				return true;
			});
			// Done
			return true;
		},
		
		send: function(options){
			var Gates = $.Gates; var Ajaxy = $.Ajaxy;
			return Ajaxy.go(options);
		},
		
		panelBender: function(options){
			// Default
			if ( typeof options === 'string' ) {
				var $panel = $(options);
				options = {
					panel:		$panel,
					heading:	$panel.find('.heading'),
	            	form:		$panel.find('form'),
					content:	$panel.find('.content'),
	            	submit:		$panel.find('input[type=submit]'),
	            	cancel:		$panel.find('.cancel'),
	            	text:		$panel.find('input,textarea,select').filter(':first')
				};
				delete $panel;
			}
			
			// Prepare
			var	$panel =	$(options.panel),
				$heading =	$(options.heading),
				$form =		$(options.form),
				$content =	$(options.content).hide(),
				$cancel =	$(options.cancel),
				$submit =	$(options.submit),
				$text =		$(options.text);
			
			// Functions
			var edit = function(){
				$content.slideToggle(200,function(){
					if ( $panel.is(':visible') ) {
						// Shown
						$text.focus();
					} else {
						// Hidden
					}
				});
			};
			var cancel = function(){
				$content.slideUp(200, function(){
					$form[0].reset();
				});
			};
			
			// Bind
			$heading.click(edit);
			$panel.cancel(cancel);
			$cancel.click(cancel);
		},
		
		inlineEdit: function(options, urls, callbacks){
			var Gates = $.Gates; var Ajaxy = $.Ajaxy;
			
			// Prepare
			options.copy = typeof options.copy !== 'undefined' ? options.copy : true;
			options.copy_to = typeof options.copy_to !== 'undefined' ? options.copy_to : options.copy;
			options.copy_from = typeof options.copy_from !== 'undefined' ? options.copy_from : options.copy;
			options.remove_last = typeof options.remove_last === 'undefined' ? true : options.remove_last;
			options['item-field'] = typeof options['item-field'] !== 'undefined' ? options['item-field'] : false;
			callbacks = callbacks || {};
			callbacks.save = callbacks.save || false;
			callbacks.remove = callbacks.remove || false;
			
			// Functions
			var edit = function(){
				// Fetch
				var $item = $(this).parents(options['item']+':first');
				var $view = $item.find(options['item-view']).hide();
				var $edit = $item.find(options['item-edit']).show();
				// Generate
				var data = $item.values();
				// Perform
				if ( options.copy_to ) {
					var $fields = options['item-field'] ? $item.find(options['item-field']) : $items;
					$fields.each(function(){
						var $field = $(this);
						$field.find(options['item-field-input']).val(
							$field.find(options['item-field-value']).text().trim()
						);
					});
				}
				$item.filter(':first').find(options['item-field-input']+':not(:hidden):visible:first').focus();
			};
			var save = function(){
				// Fetch
				var $item = $(this).parents(options['item']+':first');
				var $view = $item.find(options['item-view']).show();
				var $edit = $item.find(options['item-edit']).hide();
				// Data
				var data = $item.values();
				// Values
				if ( options.copy_from ) {
					var $fields = options['item-field'] ? $item.find(options['item-field']) : $items;
					$fields.each(function(){
						var $field = $(this);
						var $value = $field.find(options['item-field-value']);
						var $input = $field.find(options['item-field-input']);
						var value = $input.value();
						if ( $.isPossibleBoolean(value) ) {
							var Text = $value.text().trim();
							var text = Text.toLowerCase();
							if ( text === 'yes' || text === 'no' ) {
								value = $.isPossibleTrue(value) ? 'yes' : 'no';
								if ( Text[0] !== text[0] ) {
									value = value[0].toUpperCase()+value.substr(1);
								}
							}
						}
						$value.text(value);
					});
				}
				// Submit
				var submit = function(){
					Gates.send({
						url:		urls['edit'],
						data:		data,
						success:	(callbacks.save
							? function(){
								// Complete
								// Has callback
								callbacks.save.apply($item, arguments);
							}
							: function(){
								// Complete
							}
						)
					});
					// Done
					return true;
				}
				// Confirm
				if ( options.confirm||false ) {
					Gates.confirm_ajax(function(_data){
						// Note
						data = $.extend(true, data, _data.confirm);
						// Submit
						submit();
						// Done
						return true;
					}, options.confirm);
				} else {
					// Submit
					submit();
				}
				// Done
				return true;
			};
			var cancel = function(){
				var $item = $(this).parents(options['item']+':first');
				var $view = $item.find(options['item-view']).show();
				var $edit = $item.find(options['item-edit']).hide();
			};
			var remove = function(){
				var $item = $(this).parents(options['item']+':first');
				var $siblings = $item.siblings(options['item']);
				// Check
				if ( !options['remove_last'] && $siblings.length === 0 ) {
					// We are the last do not remove
					return false;
				}
				// Perform
				var data = $item.values();
				Gates.send({
					url:		urls['remove'],
					data:		data,
					success:	(callbacks.remove
						? function(){
							// Complete
							callbacks.remove.apply($item, arguments);
						}
						: function(){
							// Complete
							$item.fadeOut(200, function(){
								$item.remove();
								// Show empty if need be
								if ( $siblings.length === 1 ) {
									$siblings.show();
								}
							});
						}
					)
				});
			};
			
			// Bind
			var $items = $(options['items']);
			var $hover_panel = (options['item-hover']||false) ? $items.find(options['item-hover']) : $items;
			$hover_panel.hover(function(){
				$(this).find(options['item-hover-content']).show();
			}, function(){
				if ( $items.find(options['item-edit']).is(':visible') === false ) {
					$(this).find(options['item-hover-content']).hide();
				}
			});
			$items.find(options['item-hover-content']).hide();
			$items.find(options['item-edit']).hide();
			$items.find(options['item-edit_button']).click(edit);
			$items.find(options['item-remove_button']).click(remove);
			$items.find(options['item-save_button']).click(save);
			$items.find(options['item-cancel_button']).click(cancel);
			var $fields = options['item-field'] ? $items.find(options['item-field']) : $items;
			$fields.find(options['item-field-input']).cancel(cancel).enter(save);
		}
	};

})(jQuery);