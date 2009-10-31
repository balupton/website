(function(){
	
	// Core Prototypes
	String.prototype.wrap = function(start,end){
		return start+this+end;
	};
	String.prototype.wrapSelection = function(start,end,a,z){
		if ( typeof a === 'undefined' || a === null ) a = this.length;
		if ( typeof z === 'undefined' || z === null ) z = this.length;
		return this.substring(0,a)+start+this.substring(a,z)+end+this.substring(z);
	};
	String.prototype.autop = function(){
		var pee = this;
		var blocklist = 'table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select|form|blockquote|address|math|p|h[1-6]';

		if ( pee.indexOf('<object') != -1 ) {
			pee = pee.replace(/<object[\s\S]+?<\/object>/g, function(a){
				return a.replace(/[\r\n]+/g, '');
			});
		}

		pee = pee.replace(/<[^<>]+>/g, function(a){
			return a.replace(/[\r\n]+/g, ' ');
		});

		pee = pee + "\n\n";
		pee = pee.replace(new RegExp('<br />\\s*<br />', 'gi'), "\n\n");
		pee = pee.replace(new RegExp('(<(?:'+blocklist+')[^>]*>)', 'gi'), "\n$1");
		pee = pee.replace(new RegExp('(</(?:'+blocklist+')>)', 'gi'), "$1\n\n");
		pee = pee.replace(new RegExp("\\r\\n|\\r", 'g'), "\n");
		pee = pee.replace(new RegExp("\\n\\s*\\n+", 'g'), "\n\n");
		pee = pee.replace(new RegExp('([\\s\\S]+?)\\n\\n', 'mg'), "<p>$1</p>\n");
		pee = pee.replace(new RegExp('<p>\\s*?</p>', 'gi'), '');
		pee = pee.replace(new RegExp('<p>\\s*(</?(?:'+blocklist+')[^>]*>)\\s*</p>', 'gi'), "$1");
		pee = pee.replace(new RegExp("<p>(<li.+?)</p>", 'gi'), "$1");
		pee = pee.replace(new RegExp('<p>\\s*<blockquote([^>]*)>', 'gi'), "<blockquote$1><p>");
		pee = pee.replace(new RegExp('</blockquote>\\s*</p>', 'gi'), '</p></blockquote>');
		pee = pee.replace(new RegExp('<p>\\s*(</?(?:'+blocklist+')[^>]*>)', 'gi'), "$1");
		pee = pee.replace(new RegExp('(</?(?:'+blocklist+')[^>]*>)\\s*</p>', 'gi'), "$1");
		pee = pee.replace(new RegExp('\\s*\\n', 'gi'), "<br />\n");
		pee = pee.replace(new RegExp('(</?(?:'+blocklist+')[^>]*>)\\s*<br />', 'gi'), "$1");
		pee = pee.replace(new RegExp('<br />(\\s*</?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)>)', 'gi'), '$1');
		pee = pee.replace(new RegExp('(?:<p>|<br ?/?>)*\\s*\\[caption([^\\[]+)\\[/caption\\]\\s*(?:</p>|<br ?/?>)*', 'gi'), '[caption$1[/caption]');

		// Fix the pre|script tags
		pee = pee.replace(/<(pre|script)[^>]*>[\s\S]+?<\/\1>/g, function(a) {
			a = a.replace(/<br ?\/?>[\r\n]*/g, '\n');
			return a.replace(/<\/?p( [^>]*)?>[\r\n]*/g, '\n');
		});

		return pee;
	};
	Number.prototype.zeroise = String.prototype.zeroise = function(threshold){
		var number = this,
			str = number.toString();
		if (number < 0) { str = str.substr(1, str.length) }
		while (str.length < threshold) { str = "0" + str }
		if (number < 0) { str = '-' + str }
		return str;
	};
	Date.prototype.getDatetime = function(){
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
	$.fn.valAutop = function(){
		var $field = $(this);
		return $field.val($field.val().autop());
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
	
	// CMS
	$.CMS = {
		// Editor
		Editor: {
			// Toolbar
			Toolbar: {
				get: function(toolbar){
					return $(toolbar||'#quicktags');
				},
				render: function(editor,toolbar){
					var CMS = $.CMS; var Editor = CMS.Editor; var Toolbar = Editor.Toolbar;
					var $toolbar = Toolbar.get(toolbar);
					var $holder = $('<div id="ed_toolbar">');
					$.each(Toolbar.buttons, function(i,button){
						button = $.extend({
							title: '',
							id: '',
							class: '',
							accesskey: '',
							onclick: function(){}
						}, button);
						var $button = $('<input class="ed_button" type="button"/>');
						$button.attr('id',button.id);
						$button.addClass(button.class);
						$button.attr('accesskey', button.accesskey);
						$button.val(button.title);
						$button.click(function(){
							return button.onclick.apply(this,[editor,toolbar]);
						});
						$holder.append($button);
					});
					$toolbar.append($holder);
				},
				buttons: [{
					title: 'b',
					id: 'ed_strong',
					accesskey: 'b',
					onclick: function(editor, toolbar){
						var CMS = $.CMS; var Editor = CMS.Editor;
						Editor.insertTag(editor, '<strong>', '</strong>');
						return true;
					}
				},{
					title: 'i',
					id: 'ed_em',
					accesskey: 'i',
					onclick: function(editor, toolbar){
						var CMS = $.CMS; var Editor = CMS.Editor;
						Editor.insertTag(editor, '<em>', '</em>');
						return true;
					}
				},{
					title: 'link',
					id: 'ed_link',
					accesskey: 'a',
					onclick: function(editor, toolbar){
						var CMS = $.CMS; var Editor = CMS.Editor;
						Editor.insertLink(editor);
						return true;
					}
				},{
					title: 'quote',
					id: 'ed_block',
					accesskey: 'q',
					onclick: function(editor, toolbar){
						var CMS = $.CMS; var Editor = CMS.Editor;
						Editor.insertTag(editor, '<blockquote>', '</blockquote>');
						return true;
					}
				},{
					title: 'del',
					id: 'ed_del',
					accesskey: 'd',
					onclick: function(editor, toolbar){
						var CMS = $.CMS; var Editor = CMS.Editor;
						var now = new Date();
						var start = '<del datetime="'+now.getDatetime()+'">';
						var end = '</del>';
						Editor.insertTag(editor, start, end);
						return true;
					}
				},{
					title: 'ins',
					id: 'ed_ins',
					accesskey: 's',
					onclick: function(editor, toolbar){
						var CMS = $.CMS; var Editor = CMS.Editor;
						var now = new Date();
						var start = '<ins datetime="'+now.getDatetime()+'">';
						var end = '</ins>';
						Editor.insertTag(editor, start, end);
						return true;
					}
				},{
					title: 'img',
					id: 'ed_img',
					accesskey: 'm',
					onclick: function(editor, toolbar){
						var CMS = $.CMS; var Editor = CMS.Editor;
						Editor.insertImage(editor);
						return true;
					}
				},{
					title: 'ul',
					id: 'ed_ul',
					accesskey: 'u',
					onclick: function(editor, toolbar){
						var CMS = $.CMS; var Editor = CMS.Editor;
						Editor.insertTag(editor, '<ul>', '</ul>');
						return true;
					}
				},{
					title: 'ol',
					id: 'ed_ol',
					accesskey: 'o',
					onclick: function(editor, toolbar){
						var CMS = $.CMS; var Editor = CMS.Editor;
						Editor.insertTag(editor, '<ol>', '</ol>');
						return true;
					}
				},{
					title: 'li',
					id: 'ed_li',
					accesskey: 'li',
					onclick: function(editor, toolbar){
						var CMS = $.CMS; var Editor = CMS.Editor;
						Editor.insertTag(editor, '<li>', '</li>');
						return true;
					}
				},{
					title: 'code',
					id: 'ed_code',
					accesskey: 'c',
					onclick: function(editor, toolbar){
						var CMS = $.CMS; var Editor = CMS.Editor;
						Editor.insertTag(editor, '<code>', '</code>');
						return true;
					}
				}]
			}, // Toolbar
			
			// Editor
			get: function(editor){
				return $(editor||'#content');
			},
			insertImage: function(editor){
				var CMS = $.CMS; var Editor = CMS.Editor;
				// Prepare
				var value = 'http://';
				var textUrl = 'Enter the image\'s URL';
				var textAlt = 'Enter the image\'s description';
				var url = prompt(textUrl, value); if ( !url ) return;
				var alt = prompt(textAlt, value); if ( !alt ) return;
				// Apply
				var start = '<img src="'+url+'" alt="'+alt+'">',
					end = '</a>';
				Editor.insertTag(editor,start,end);
				// Done
				return true;
			},
			insertLink: function(editor){
				var CMS = $.CMS; var Editor = CMS.Editor;
				// Prepare
				var value = 'http://';
				var textUrl = 'Enter the URL';
				var url = prompt(textUrl, value); if ( !url ) return;
				// Apply
				var start = '<a href="'+url+'">',
					end = '</a>';
				Editor.insertTag(editor,start,end);
				// Done
				return true;
			},
			insertTag: function(editor, start, end){
				var CMS = $.CMS; var Editor = CMS.Editor;
				// Prepare
				var $editor = Editor.get(editor);
				// Apply
				$editor.valWrapSelection(start,end);
				// Done
				return true;
			},
			render: function(editor,toolbar,mode){
				var CMS = $.CMS; var Editor = CMS.Editor; var Toolbar = Editor.Toolbar;
				
				// Prepare
				var $editor = Editor.get(editor);
				var $toolbar = Toolbar.get(toolbar);
				mode = mode||'visual';
				
				// Elements
				var $buttonVisual	= $('#edButtonVisual'),
					$buttonStandard	= $('#edButtonStandard');
				
				// TinyMCE
				var ed = false;
				try { ed = tinyMCE.get(editor); }
				catch(e) { ed = false; }
				
				// Mode
				if ( 'visual' == mode ) {
					if ( ed && !ed.isHidden() )
						return false;
					
					// Apply
					$buttonVisual.addClass('active');
					$buttonStandard.removeClass('active');
					$editor.valAutop();

					// Toolbar
					$toolbar.hide();
					
					// Display
					if ( ed ) {
						ed.show();
					} else {
						try{tinyMCE.execCommand('mceAddControl', false, editor);}
						catch(e){}
					}
					
				}
				else {
					// Apply
					//ta.style.color = '#000';
					$buttonVisual.removeClass('active');
					$buttonStandard.addClass('active');
					
					// Display
					if ( ed && !ed.isHidden() ) {
						$editor.height(ed.getContentAreaContainer().offsetHeight+24+'px');
						ed.hide();
					}
					
					// Toolbar
					$toolbar.show();
				}
			} // render
			
		} // Editor
	
	}; // CMS
	
})();

var switchEditors = {

	mode : '',

	I : function(e) {
		return document.getElementById(e);
	},

	edInit : function() {
	},

	saveCallback : function(el, content, body) {

		if ( tinyMCE.activeEditor.isHidden() )
			content = this.I(el).value;
		else
			content = this.pre_wpautop(content);

		return content;
	},

	pre_wpautop : function(content) {
		var blocklist1, blocklist2;

		// Protect pre|script tags
		content = content.replace(/<(pre|script)[^>]*>[\s\S]+?<\/\1>/g, function(a) {
			a = a.replace(/<br ?\/?>[\r\n]*/g, '<wp_temp>');
			return a.replace(/<\/?p( [^>]*)?>[\r\n]*/g, '<wp_temp>');
		});

		// Pretty it up for the source editor
		blocklist1 = 'blockquote|ul|ol|li|table|thead|tbody|tr|th|td|div|h[1-6]|p';
		content = content.replace(new RegExp('\\s*</('+blocklist1+')>\\s*', 'mg'), '</$1>\n');
		content = content.replace(new RegExp('\\s*<(('+blocklist1+')[^>]*)>', 'mg'), '\n<$1>');

		// Mark </p> if it has any attributes.
		content = content.replace(new RegExp('(<p [^>]+>.*?)</p>', 'mg'), '$1</p#>');

		// Sepatate <div> containing <p>
		content = content.replace(new RegExp('<div([^>]*)>\\s*<p>', 'mgi'), '<div$1>\n\n');

		// Remove <p> and <br />
		content = content.replace(new RegExp('\\s*<p>', 'mgi'), '');
		content = content.replace(new RegExp('\\s*</p>\\s*', 'mgi'), '\n\n');
		content = content.replace(new RegExp('\\n\\s*\\n', 'mgi'), '\n\n');
		content = content.replace(new RegExp('\\s*<br ?/?>\\s*', 'gi'), '\n');

		// Fix some block element newline issues
		content = content.replace(new RegExp('\\s*<div', 'mg'), '\n<div');
		content = content.replace(new RegExp('</div>\\s*', 'mg'), '</div>\n');
		content = content.replace(new RegExp('\\s*\\[caption([^\\[]+)\\[/caption\\]\\s*', 'gi'), '\n\n[caption$1[/caption]\n\n');
		content = content.replace(new RegExp('caption\\]\\n\\n+\\[caption', 'g'), 'caption]\n\n[caption');

		blocklist2 = 'blockquote|ul|ol|li|table|thead|tr|th|td|h[1-6]|pre';
		content = content.replace(new RegExp('\\s*<(('+blocklist2+') ?[^>]*)\\s*>', 'mg'), '\n<$1>');
		content = content.replace(new RegExp('\\s*</('+blocklist2+')>\\s*', 'mg'), '</$1>\n');
		content = content.replace(new RegExp('<li([^>]*)>', 'g'), '\t<li$1>');

		if ( content.indexOf('<object') != -1 ) {
			content = content.replace(/<object[\s\S]+?<\/object>/g, function(a){
				return a.replace(/[\r\n]+/g, '');
			});
		}

		// Unmark special paragraph closing tags
		content = content.replace(new RegExp('</p#>', 'g'), '</p>\n');
		content = content.replace(new RegExp('\\s*(<p [^>]+>.*</p>)', 'mg'), '\n$1');

		// Trim whitespace
		content = content.replace(new RegExp('^\\s*', ''), '');
		content = content.replace(new RegExp('[\\s\\u00a0]*$', ''), '');

		// put back the line breaks in pre|script
		content = content.replace(/<wp_temp>/g, '\n');

		// Hope.
		return content;
	},

	go : function(id, mode) {
		id = id || 'content';
		mode = mode || this.mode || '';

		var ed, qt = this.I('quicktags'), H = this.I('edButtonHTML'), P = this.I('edButtonPreview'), ta = this.I(id);

		try { ed = tinyMCE.get(id); }
		catch(e) { ed = false; }

		if ( 'tinymce' == mode ) {
			if ( ed && !ed.isHidden() )
				return false;

			//setUserSetting( 'editor', 'tinymce' );
			this.mode = 'html';

			P.className = 'active';
			H.className = '';
			//edCloseAllTags(); // :-(
			qt.style.display = 'none';

			ta.value = this.wpautop(ta.value);

			if ( ed ) {
				ed.show();
			} else {
				try{tinyMCE.execCommand("mceAddControl", false, id);}
				catch(e){}
			}
		} else {
			//setUserSetting( 'editor', 'html' );
			ta.style.color = '#000';
			this.mode = 'tinymce';
			H.className = 'active';
			P.className = '';

			if ( ed && !ed.isHidden() ) {
				ta.style.height = ed.getContentAreaContainer().offsetHeight + 24 + 'px';
				ed.hide();
			}

			qt.style.display = 'block';
		}
		return false;
	},

	wpautop : function(pee) {
		var blocklist = 'table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select|form|blockquote|address|math|p|h[1-6]';

		if ( pee.indexOf('<object') != -1 ) {
			pee = pee.replace(/<object[\s\S]+?<\/object>/g, function(a){
				return a.replace(/[\r\n]+/g, '');
			});
		}

		pee = pee.replace(/<[^<>]+>/g, function(a){
			return a.replace(/[\r\n]+/g, ' ');
		});

		pee = pee + "\n\n";
		pee = pee.replace(new RegExp('<br />\\s*<br />', 'gi'), "\n\n");
		pee = pee.replace(new RegExp('(<(?:'+blocklist+')[^>]*>)', 'gi'), "\n$1");
		pee = pee.replace(new RegExp('(</(?:'+blocklist+')>)', 'gi'), "$1\n\n");
		pee = pee.replace(new RegExp("\\r\\n|\\r", 'g'), "\n");
		pee = pee.replace(new RegExp("\\n\\s*\\n+", 'g'), "\n\n");
		pee = pee.replace(new RegExp('([\\s\\S]+?)\\n\\n', 'mg'), "<p>$1</p>\n");
		pee = pee.replace(new RegExp('<p>\\s*?</p>', 'gi'), '');
		pee = pee.replace(new RegExp('<p>\\s*(</?(?:'+blocklist+')[^>]*>)\\s*</p>', 'gi'), "$1");
		pee = pee.replace(new RegExp("<p>(<li.+?)</p>", 'gi'), "$1");
		pee = pee.replace(new RegExp('<p>\\s*<blockquote([^>]*)>', 'gi'), "<blockquote$1><p>");
		pee = pee.replace(new RegExp('</blockquote>\\s*</p>', 'gi'), '</p></blockquote>');
		pee = pee.replace(new RegExp('<p>\\s*(</?(?:'+blocklist+')[^>]*>)', 'gi'), "$1");
		pee = pee.replace(new RegExp('(</?(?:'+blocklist+')[^>]*>)\\s*</p>', 'gi'), "$1");
		pee = pee.replace(new RegExp('\\s*\\n', 'gi'), "<br />\n");
		pee = pee.replace(new RegExp('(</?(?:'+blocklist+')[^>]*>)\\s*<br />', 'gi'), "$1");
		pee = pee.replace(new RegExp('<br />(\\s*</?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)>)', 'gi'), '$1');
		pee = pee.replace(new RegExp('(?:<p>|<br ?/?>)*\\s*\\[caption([^\\[]+)\\[/caption\\]\\s*(?:</p>|<br ?/?>)*', 'gi'), '[caption$1[/caption]');

		// Fix the pre|script tags
		pee = pee.replace(/<(pre|script)[^>]*>[\s\S]+?<\/\1>/g, function(a) {
			a = a.replace(/<br ?\/?>[\r\n]*/g, '\n');
			return a.replace(/<\/?p( [^>]*)?>[\r\n]*/g, '\n');
		});

		return pee;
	}
};
