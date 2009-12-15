(function($){
	// By Benjamin "balupton" Lupton (MIT Licenced) - unless specified otherwise
	
	// Core Prototypes
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
	String.prototype.toInt = String.prototype.toInt || function(){
		return parseInt(this);
	};
	String.prototype.wrap = String.prototype.wrap || function(start,end){
		return start+this+end;
	};
	String.prototype.wrapSelection = String.prototype.wrapSelection || function(start,end,a,z){
		if ( typeof a === 'undefined' || a === null ) a = this.length;
		if ( typeof z === 'undefined' || z === null ) z = this.length;
		return this.substring(0,a)+start+this.substring(a,z)+end+this.substring(z);
	};
	String.prototype.toSlug = String.prototype.toSlug || function(){
		return this.toLowerCase().replace(/[\s_]/g, '-').replace(/[^-a-z0-9]/g, '').replace(/--+/g, '-');
	}
	Number.prototype.zeroise = String.prototype.zeroise = String.prototype.zeroise ||function(threshold){
		var number = this,
			str = number.toString();
		if (number < 0) { str = str.substr(1, str.length) }
		while (str.length < threshold) { str = "0" + str }
		if (number < 0) { str = '-' + str }
		return str;
	};
	Date.prototype.getDatetime = String.prototype.getDatetime || function(){
		var now = this;
		var datetime = now.getUTCFullYear() + '-' +
			(now.getUTCMonth()+1).zeroise(2) + '-' +
			now.getUTCDate().zeroise(2) + 'T' +
			now.getUTCHours().zeroise(2) + ':' +
			now.getUTCMinutes().zeroise(2) + ':' +
			now.getUTCSeconds().zeroise(2) + '+00:00';
		return datetime;
	};

	
	// jQuery Prototypes
	$.fn.inDOM = function(){
		var $ancestor = $(this).parent().parent();
		return $ancestor.size() && ($ancestor.height()||$ancestor.width());
	};
	$.fn.valWrap = function(start,end){
		var $field = $(this);
		return $field.val($field.val().wrap(start,end));
	};
	$.fn.valWrapSelection = function(start,end,a,z){
		var $field = $(this);
		var field = $field.get(0);
		start = start||"";
		end = end||"";
		if ( a || z ) {
			$field.val($field.val().wrapSelection(start,end,a,z));
		}
		else {
			var a = field.selectionStart,
				z = field.selectionEnd;
			if ( document.selection) {
				field.focus();
				var sel = document.selection.createRange();
				sel.text = start + sel.text + end;
			}
			else {
				var scrollTop = field.scrollTop;
				$field.val($field.val().wrapSelection(start,end,a,z));
				field.focus();
				field.selectionStart = a+start.length;
				field.selectionEnd = z+start.length;
				field.scrollTop = scrollTop;
			}
		}
		return $field;
	};
	$.fn.giveFocus = function(){
		var $this = $(this);
		var selector = ':input:visible:first';
		if ( $this.is(selector) ) {
			$this.focus();
		} else {
			$this.find(selector).focus();
		}
		return this;
	}
	$.fn.firstInput = function(){
		return $(this).findAndSelf(':input:first');
	}
	$.fn.cancel = function(callback){
		return $(this).findAndSelf(':input').keypress(function(e){
			if ( e.keyCode === 27 ) { // ESC
				callback.call(this);
			}
		});
	};
	$.fn.enter = function(callback){
		return $(this).findAndSelf(':input').keypress(function(e){
			if ( e.keyCode === 13 ) { // Enter
				callback.call(this);
			}
		});
	};
	$.fn.highlight = function(){
		return $(this).effect("highlight", {}, 3000);
	};
	
	// Sparkle: delete warning
	$.Sparkle.add('deletewarn', function(){
		var $this = $(this); var Sparkle = $.Sparkle;
		// Fetch
		var $inputs = $this.findAndSelf('.delete-action').click(function(event){
			var $this = $(this);
			if ( !confirm($this.attr('title')||'Are you sure you want to delete this?') ) {
				// Prevent
				event.stopPropagation();
				event.preventDefault();
			}
		});
		// Done
		return $this;
	});
	
	// InlineEdit
	$.InlineEdit = new $.BalClass({
		'default': {
			edit_button: '<a class="inline-edit-button inline-edit-button-edit">Edit</a>',
			edit_button_class: '',
			remove_button: '<a class="inline-edit-button inline-edit-button-remove">Remove</a>',
			ok_button: '<a class="inline-edit-button inline-edit-button-ok button">OK</a>',
			cancel_button: '<a class="inline-edit-button inline-edit-button-cancel">Cancel</a>',
			panel: '<span class="inline-edit-panel"/>',
			view_panel: '<span class="inline-edit-panel-view"/>',
			edit_panel: '<span class="inline-edit-panel-edit"/>',
			hideClass: 'hide',
			highlightClass: 'editable',
			clickableSelector: '.inline-edit-clickable,label',
			open: function(e,els){
				els.$edit.data('orig', els.$edit.val());
				els.$views.hide();
				els.$edits.show();
				els.$edit.giveFocus();
				return true;
			},
			update: function(e,els){
				els.$view.html(els.$edit.value());
				els.$views.show();
				els.$edits.hide();
				return true;
			},
			cancel: function(e,els){
				els.$edit.val(els.$edit.data('orig'));
				els.$views.show();
				els.$edits.hide();
				return true;
			},
			remove: false
		},
		'editbutton': {
			edit_button_class: 'button'
		}
	});
	$.fn.inlineEdit = function(option, options) {
		// Prepare
		var Me = $.InlineEdit;
		var config = Me.getConfigWithDefault(option, options);
		// Fetch
		var $view = $(this).addClass(config.highlightClass);
		var $edit = $(config.edit).hide().removeClass(config.hideClass);
		var $edit_button = $(config.edit_button);
		var $ok_button = $(config.ok_button);
		var $cancel_button = $(config.cancel_button);
		var $remove_button = $(config.remove_button);
		var $panel = $(config.panel);
		var $view_panel = $(config.view_panel);
		var $edit_panel = $(config.edit_panel).hide();
		// Handle
		var insertPanel = !$panel.inDOM();
		if ( config.edit_button_class && config.edit_button_class.length ) {
			$edit_button.addClass(config.edit_button_class);
		}
		if ( !config.remove ) {
			$remove_button.hide();
		}
		// Build
		$view_panel.append($edit_button).append($remove_button);
		$edit_panel.append($ok_button).append($cancel_button);
		$panel.append($view_panel).append($edit_panel);
		if ( insertPanel ) {
			$panel.insertAfter($edit);
		}
		// Simplify
		var $views = $($view_panel).add($view);
		var $edits = $($edit_panel).add($edit);
		var $edit_buttons = $edit_button.add($view);
		if ( config.clickableSelector ) {
			$edit_buttons = $edit_buttons.add(
				$view.add($edit).add($panel).siblings(config.clickableSelector)
			);
		}
		// Functions
		var pack = function(){
			return {
				$views: $views,
				$edits: $edits,
				$view: $view,
				$edit: $edit,
				$panel: $panel
			};
		}
		var open = function(e){
			config.open.apply(this,[e,pack(),config]);
		};
		var cancel = function(e){
			config.cancel.apply(this,[e,pack(),config]);
		};
		var update = function(e){
			config.update.apply(this,[e,pack(),config]);
		};
		var remove = function(e){
			config.remove.apply(this,[e,pack(),config]);
		};
		// Bind
		$edit_buttons.click(open);
		$cancel_button.click(cancel); $edit.cancel(cancel);
		$ok_button.click(update); $edit.enter(update);
		if ( config.remove ) {
			$remove_button.click(remove);
		}
		// Done
		return this;
	};
	
	// Editor
	$.Editor = new $.BalClass({
		'default': {
			// Location of TinyMCE script
			script_url: '/scripts/tiny_mce/tiny_mce.js',
			
			// General options
			theme: "advanced",
			plugins: "autoresize,safari,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

			// Theme options
			theme_advanced_buttons1: "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect,|,code,",
			theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,undo,redo,|,link,unlink,image,|,preview,|,forecolor,backcolor,|,bullist,numlist,|,outdent,indent,blockquote,|,fullscreen",
			theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup",
			theme_advanced_toolbar_location: "top",
			theme_advanced_toolbar_align: "left",
			theme_advanced_statusbar_location: "bottom",
			theme_advanced_path: false,
			theme_advanced_resizing: false,
			width: "100%",
			
			// Compat
			//add_form_submit_trigger: false,
			//submit_patch: false,
			
			// Example content CSS (should be your site CSS)
			// content_css : "css/content.css",
			
			// Replace values for the template plugin
			template_replace_values: {
				
			}
		},
		'rich': {
		},
		'simple': {
			theme_advanced_buttons2: "",
			theme_advanced_buttons3: ""
		}
	});
	$.fn.editor = function(options) {
		var Me = $.Editor;
		var config = Me.getConfigWithDefault(options,options);
		var $this = $(this);
		//$this.parent('form:first').unbind().submit(function(){
			//tinyMCE.triggerSave();
		//});
		return $this.tinymce(config);
	};
	
	// Help
	$.Help = new $.BalClass({
		'default': {
			// Elements
			wrap: '<span class="help-wrap"/>',
			icon: '<span class="help-icon"/>',
			text: '<span class="help-text"/>',
			parentClass: '',
			title: ''
		}
	});
	$.fn.help = function(options){
		var Me = $.Help;
		if ( typeof options === 'string' ) {
			options = {
				title: options
			};
		}
		var config = Me.getConfigWithDefault(options,options);
		// Fetch
		var $this = $(this);
		var $wrap = $(config.wrap);
		var $icon = $(config.icon);
		var $text = $(config.text);
		var $parent = $this.parent().addClass(config.parentClass);
		// Build
		var $contents = $this.contents();
		$this.append($wrap.append($text).append($icon));
		$contents.appendTo($text);
		$this.attr('title', config.title);
		// Done
		return $this;
	}
	
})(jQuery);
