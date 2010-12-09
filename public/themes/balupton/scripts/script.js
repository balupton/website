(function($){
	
	// Cache
	var Ajaxy = $.Ajaxy||false, Sparkle = $.Sparkle, ie = $.browser.msie;
	
	// Sparkle Extensions
	Sparkle.addExtension({
		name: 'adjustments',
		extension: function(){
			var $this = $(this);
			
			// Clean up skin
			$this.findAndSelf('section:not(.clean)').addClass('not-clean');
			$this.findAndSelf('.nav-tags,.nav-children').filter(':has(li:first-child:last-child)').hide();
			
			// Prevent ajaxy from working on internal links that aren't ajaxy compatible
			$this.findAndSelf('a[href^=http://www.balupton.com/sandbox],a[href^=/sandbox]').removeAjaxy();
			
			// Do something???
			if ( false && $.BalCMS.options.root_url !== 'http://www.balupton.com' ) {
				$this.findAndSelf('a[href^=http://www.balupton.com]').each(function(){
					var $this = $(this);
					$this.attr('href',
						$this.attr('href').replace('http://www.balupton.com',$.BalCMS.options.root_url+$.BalCMS.options.base_url)
					);
				}).ajaxify();
			}
			
			return $this;
		}
	});
	
	// Mobile
	if ( /Mobile/i.test(navigator.userAgent) ) {
		// Sparkle Extensions
		Sparkle.addExtension({
			name: 'mobile',
			extension: function(){
				var $this = $(this);
				$this.findAndSelf('.gsfnwidget').unbind('click').removeClass('gsfnwidget');
				return $this;
			}
		});
	}
	
	// Construct
	$.BalCMS = {
		options: {
			root_url: 'http://192.168.1.2/',
			base_url: '/projects/balupton/',
			debug: true
		},
		init: function(){
			var BalCMS = $.BalCMS;
			
			// doReady
			$(function(){
				BalCMS.domReady();
			});
		},
		domReady: function(){
			var BalCMS = $.BalCMS;
			
			// Fetch elements
			var $body = $(document.body),
				$content = $('#content').opacityFix(),
				$menu = $('#nav-main');
		
			// Bind to Ajaxy onReady
			Ajaxy.onReady(function(){
				$('#search').addAjaxy('page');
				$body.sparkle()
			});
			
			// Configure Ajaxy
			if ( !ie )
			Ajaxy.configure({
				'options': {
					root_url: BalCMS.options.root_url,
					base_url: BalCMS.options.base_url,
					debug: BalCMS.options.debug,
					request_match: true,
					redirect: 'postpone',
					relative_as_base: false,
					support_text: false,
					track_all_anchors: true,
					track_all_internal_links: true,
					scrollto_content: true,
					aliases: [
						['','/','/welcome']
					]
				},
				'Controllers': {
					'_generic': {
						request: function(){
							// Log what is happening
							if ( Ajaxy.options.debug ) window.console.debug('$.Ajaxy.configure.Controllers._generic.request', [this,arguments]);
							
							// Loading
							$body.addClass('loading');
							
							// Done
							return true;
						},
						response: function(){
							// Prepare
							var data = this.State.Response.data; var state = this.state||'unknown';
							
							// Log what is happening
							if ( Ajaxy.options.debug ) window.console.debug('$.Ajaxy.configure.Controllers._generic.response', [this,arguments], data, state);
							
							// Title
							var title = data.title||false; // if we have a title in the response JSON
							if ( !title && this.state||false ) title = 'jQuery Ajaxy - '+this.state; // if not use the state as the title
							if ( title ) document.title = title; // if we have a new title use it
							
							// Loaded
							$body.removeClass('loading');
							
							// Display State
							$('#current').text('Our current state is: ['+state+']');
							
							// Return true
							return true;
						},
						refresh: function(){
							// Prepare
							var data = this.State.Response.data; var state = this.state||'unknown';
							
							// Loaded
							$body.removeClass('loading');
							
							// Done
							return true;
						},
						error: function(){
							// Prepare
							var data = this.State.Error.data||this.State.Response.data; var state = this.state||'unknown';
							
							// Error
							var error = data.error||data.responseText||false;
							var error_message = data.content||error;
							
							// Log what is happening
							if ( Ajaxy.options.debug ) window.console.error('$.Ajaxy.configure.Controllers._generic.error', [this, arguments], error_message);
							
							// Loaded
							$body.removeClass('loading');
							
							// Display State
							window.console.error('An error occured: ' + error_message);
							
							// Done
							return true;
						}
					},
					'page': {
						classname: 'ajaxy-page',
						matches: /^\/(welcome|services|articles|projects|work|clients)\/?|^\/$/,
						request: function(){
							// Log what is happening
							if ( Ajaxy.options.debug ) window.console.debug('$.Ajaxy.configure.Controllers.page.request', [this,arguments]);
							
							// Adjust Menu
							$menu.find('li.active').removeClass('active');
							
							// Hide Content
							$content.stop(true,true).fadeOut(800);
							
							// Return true
							return true;
						},
						response: function(){
							// Prepare
							var Action = this; var data = this.State.Response.data; var state = this.state; var State = this.State;
							
							// Log what is happening
							if ( Ajaxy.options.debug ) window.console.debug('$.Ajaxy.configure.Controllers.page.response', [this,arguments], data, state);
							
							// Adjust Menu
							$menu.find('a[href$="'+state+'"]').parent().addClass('active').siblings('.active').removeClass('active');
							
							// Prepare Content
							$content.stop(true,true).html(data.content);
							$content.sparkle();
							
							// Display Content
							$content.delay(100).fadeIn(400,function(){
								Action.documentReady({
									'content': $content,
									'auto_sparkle_documentReady': false,
									'auto_ajaxify_documentReady': false
								});
							});
							
							// Return true
							return true;
						},
						refresh: function(){
							// Prepare
							var Action = this; var data = this.State.Response.data; var state = this.state; var State = this.State;
							
							// Log what is happening
							if ( Ajaxy.options.debug ) window.console.debug('$.Ajaxy.configure.Controllers.page.refresh', [this,arguments], data, state);
							
							// Prepare Content
							$content.stop(true,true).show();
							
							// Display Content
							Action.documentReady({
								'content': $content
							});
							
							// Return true
							return true;
						}
					}
				}
			});
		}
	};
	
	// Init
	$.BalCMS.init();
	
})(jQuery);