/**
 * jQuery Smarty Plugin (jQSmarty) - Smarty Templating Engine for jQuery
 * Copyright (C) 2008-2010 Benjamin Arthur Lupton
 * http://github.com/balupton/jquery-smarty
 *
 * This file is part of jQuery Smarty Plugin (jQSmarty).
 * 
 * jQuery Smarty Plugin (jQSmarty) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * jQuery Smarty Plugin (jQSmarty) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with jQuery Smarty Plugin (jQSmarty).  If not, see <http://www.gnu.org/licenses/>.
 *
 * @name jqsmarty: jquery.smarty.js
 * @package jQuery Smarty Plugin (jQSmarty)
 * @version 0.5.0-dev
 * @date June 29, 2010
 * @category jquery plugin
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2008-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 * @license GNU Affero General Public License - {@link http://www.gnu.org/licenses/agpl.html}
 * @example Visit {@link http://github.com/balupton/jquery-smarty} for more information.
 * 
 * 
 * I would like to take this space to thank the wonderful contributors to the following projects:
 * - jQuery {@link http://jquery.com/}
 * - Smarty {@link http://www.smarty.net/}
 * - JSmarty {@link http://code.google.com/p/jsmarty/}
 * - PHP.JS {@link http://phpjs.org/}
 *
 **
 ***
 * CHANGELOG
 **
 * v0.5.0-dev, June 29, 2010
 * - No longer autoloads (caused too many loading sync issues)
 * - Updated $.console, as google chrome hates function aliasing
 * - Wrapped all evals in try-catch as google chrome hates evals
 * - Uses YUI Compressor for jquery smarty. This is due to closure not liking evals.
 * - No longer uses date.js
 * 
 * v0.4.3-dev, May 17, 2008
 * - Updated the php.js library to a new version, and now includes minified
 * - Updated the date library to a much newer version (+extras), and is now packed
 * - Added support for the runat tag (jaxer compatiable)
 * 
 * v0.4.2-dev, May 04, 2008
 * - Auto import of resources now fixes never cache issue
 * 
 * v0.4.1-dev, May 1, 2008
 * - Fixed/Added support for not named foreach loops
 * - Imports resources automaticly now
 * 
 * v0.4.0-dev, April 11, 2008
 * - Added support for multiple modifiers at once
 * - Added auto_update modifier, this is another HUGE step to true web 2.0
 * 
 * v0.3.1-dev, April 06, 2008
 * - Added cycle, debug, foreach functions.
 * - Fixed serious flaw in else/elseif handling.
 *   
 * v0.3.0-dev, April 04, 2008
 * - Updated $.Smarty.varloc, works a bit better, but also more limited (shouldn't be a problem though)
 * - Added onchange, so $.Smarty.onchange('something.something', function(old_value, new_value){});
 *   - This is extremely important for AJAX/Web2.0 work.
 * 
 * v0.2.1-dev, March 20, 2008
 * - Fixed:
 *   - single char attribute regex problem
 *   - multi line comments
 * - Added: date_format, default, fsize_format, 
 * - Includes: php2.js, DateJS
 * 
 * v0.2.0-dev, February 19, 2008
 * - Initial Release
 * 
 */

// Start of our jQuery Plugin
(function($)
{	// Create our Plugin function, with $ as the argument (we pass the jQuery object over later)
	// More info: http://docs.jquery.com/Plugins/Authoring#Custom_Alias
	
	/**
	 * Console Emulator
	 * @copyright Benjamin "balupton" Lupton (MIT Licenced)
	 * We have to convert arguments into arrays, and do this explicitly as webkit hates function references, and arguments cannot be passed as is
	 */
	if ( typeof $.log === 'undefined' ) {
		if ( typeof window.console !== 'undefined' && typeof window.console.log === 'function' )
		{	// Use window.console
			// Prepare
			$.console = {};
			// Log
			$.console.log = $.log = function(){
				var arr = []; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
			    window.console.log.apply(window.console, arr);
			};
			// Debug
			if ( typeof window.console.debug !== 'undefined' ) {
				$.console.debug = function(){
					var arr = []; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
				    window.console.debug.apply(window.console, arr);
				};
			} else {
				$.console.debug = function(){
					var arr = []; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
				    window.console.log.apply(window.console, arr);
				};
			}
			// Warn
			if ( typeof window.console.warn !== 'undefined' ) {
				$.console.warn = function(){
					var arr = []; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
				    window.console.warn.apply(window.console, arr);
				};
			} else {
				$.console.warn = function(){
					var arr = []; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
				    window.console.log.apply(window.console, arr);
				};
			}
			// Error
			if ( typeof window.console.error !== 'undefined' ) {
				$.console.error = function(){
					var arr = ['An error has occured:']; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
				    window.console.error.apply(window.console, arr);
					$.console.trace();
				};
			} else {
				$.console.error = function(){
					var args = arguments;
					var arr = ['An error has occured:']; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
				    window.console.log.apply(window.console, arr);
					$.console.trace();
				};
			}
			// Trace
			if ( typeof window.console.trace !== 'undefined' ) {
				$.console.trace = function(){
				    window.console.trace();
				};
			} else {
				$.console.trace = function(){
				    window.console.log.apply(window.console, ["Attempted trace... but window.console.trace does not exist."]);
				};
			}
		}
		else
		{	// Don't use anything
			// Prepare
			$.console = {};
			// Assign
			$.log = $.console.log = $.console.debug = $.console.warn = $.console.trace = function(){};
			$.console.error = function(){
				alert("An error has occured. Please use another browser to obtain more detailed information.");
			};
		}
	}
	
	// Declare our class
	$.SmartyClass = function ( )
	{	// This is the handler for our constructor
		this.construct();
	};

	// Extend jQuery elements for Lightbox
	String.prototype.populate = $.fn.populate = function ( options )
	{	// Init a el for Lightbox
		// Eg. $('#gallery a').lightbox();
		
		// If need be: Instantiate $.LightboxClass to $.Lightbox
		$.Smarty = $.Smarty || new $.SmartyClass();
		
		// Establish options
		options = $.extend({data:null}, options);
		
		// Call
		var result;
		if ( typeof this.substring !== 'undefined' )
		{	// Within a string 
			result = $.Smarty.populate(this);
		}
		else
		{	// Within a object
			$.each($(this), function(){
				var $this = $(this);
				return $this.html($.Smarty.populate($(this).html()));
			});
			result = this;
		}
		
		// Done
		return result;
	};
	
	// Define our class
	$.extend($.SmartyClass.prototype,
	{	// Our Plugin definition
		
		// -----------------
		// Data
		
		data: {
			'build':'0.5.0-dev (June 29, 2010)'
		},
		
		config: {
			// I don't see the use for this currently
		},
		
		templates: {
			
		},
		
		onchange_funcs: {
			
		},
		
		auto_updates: {
			'_length':0
		},
		
		modifier_helper: { // used for advanced modifier stuff
		},
		
		// -----------------
		// Function Data
		
		section: {},
		foreach: {},
		cycle: {},
		
		// -----------------
		// Locations
		
		template_url:	'templates/',
		
		// -----------------
		// Config
		
		//ldelim:			'%{',
		//rdelim:			'}%',
		// {([^\s'"}|:]*)(?:[|:]?("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|[^\s'"}]+)\s*)*}(?:(.+?){\/\1})?
		// {([^\s'"}]*)\s*((?:(?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|[^\s'"}]+)\s*)*)}(?:(.+?){\/\1})?
		search: {
			//tags:				/{(?:([^\s'"}]+)[\s}])?(?:((?:(?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|[^\s'"}]+)\s*?)+)})?(?:(.+?){\/\1})?/,
			"tags":				/\{((?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|[^\s'"}]+)*)\s*((?:(?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|[^\s'"}]+)\s*)*)\}(?:(.+?)\{\/\1\})?/,
			"tags_g":			/\{((?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|[^\s'"}]+)*)\s*((?:(?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|[^\s'"}]+)\s*)*)\}(?:(.+?)\{\/\1\})?/g,
			"attributes":		/(?:[\s]*(?:([^=\s]+?)=)?((?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|[^\s'"]+)+))+?/,
			"attributes_g":		/(?:[\s]*(?:([^=\s]+?)=)?((?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|[^\s'"]+)+))+?/g,
			"modifiers":		/(?:([|:])("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|[^|:]+)?)+?/,
			"modifiers_g":		/(?:([|:])("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|[^|:]+)?)+?/g
		},
		
		operators: {
	        "eq":	'==',
	        "ne":	'!=',
	        "neq":	'!=',
	        "gt":	'>',
	        "lt":	'<',
	        "ge":	'>=',
	        "gte":	'>=',
	        "le":	'<=',
	        "lte":	'<=',
	        // not:	'!',
	        "and":	'&&',
	        "or":	'||',
	        "mod":	'%',
			
			'==':	'==',
			'===':	'===',
			'!=':	'!=',
			'>':	'>',
			'<':	'<',
			'>=':	'>=',
			'<=':	'<=',
			'!':	'!',
			'%':	'%',
			
			'(':	'(',
			')':	')',
			
			'0':			0,
			'false':		false,
			
			'null':			null,
			'undefined':	null
		},
		
		// -----------------
		// Plugins
		
		modifiers: {
			auto_update: function(value, id, el, css_class)
			{	// Auto-Update this value/field/whatever
				// Auto-Update MUST BE ON THE END OF THE MODIFIERS!!!
				
				// Update length of auto updates
				++$.Smarty.auto_updates._length;
				
				// Defaults
				el = (typeof el === 'undefined') ? 'span' : el;
				css_class = css_class ? ' class="'+css_class+'"' : '';
				
				// ID or jQuery Expression
				var j;
				if ( !el || (id && id.match(/[^a-zA-Z0-9_]/g)) )
				{	// We have a jquery expression
					// console.log('j:',[id,el,css_class]);
					j = html_entity_decode(id);
					id = el = css_class = null;
				}
				else
				{	// We have a normal id
					id = id || 'jqsmarty__auto_update__'+$.Smarty.auto_updates._length;
					j = '#'+id;
				}
				
				// Get helper
				var helper = $.extend({}, $.Smarty.modifier_helper); // clone
				if ( helper['var'].charAt(0) !== '$' )
				{	// This isn't a variable, so this does not apply
					$.Smarty.debug('jqsmarty: ERROR: auto_update does not apply for: ', helper);
					return value;
				}
				
				// Get needed helper vars
				var v = helper['var'];
				var s = helper.source;
				
				// Remove auto_update from helper source
				for ( var i = 1, n = helper.modifiers.length; i < n; i++ )
				{
					var c = helper.modifiers[i];
					if ( c.value === 'auto_update' )
					{
						s = s.replace(c.source, '');
						break;
					}
				}
				
				// Apply the onchange handler
				$.Smarty.onchange(v, function(){
					// console.log(helper);
					$.Smarty.debug('jquery: auto_update:', [v, j]);
					var new_value = $.Smarty.value(s);
					$(j).html(new_value);
				});
				
				// Display
				var result = el ? '<'+el+' id="'+id+'" '+css_class+'>'+value+'</'+el+'>' : '';
				
				// Return
				return result;
			},
			capitalize: function(value)
			{	// Captilize the value
				var result = ucwords(value);
				return result;
			},
			cat: function(value, cat)
			{	// Catenate  the value
				// Process
				return value+''+cat;
			},
			count_characters: function(value, include_spaces)
			{	//
				// Process
			    if (include_spaces) 
				{ return value.length; }
				return value.match(/[^\s]/g).length;
			},
			count_paragraphs: function(value)
			{	//
				// count \r or \n characters
			    return value.match(/[\r\n]+/g).length;
			},
			count_sentences: function(value)
			{	//
				// find periods with a word before but not after.
			    return value.match(/[^\s]\.(?!\w)/g).length;
			},
			count_words: function(value)
			{	//
			    // count matches that contain alphanumerics
			    return value.match(/[a-zA-Z0-9\\x80-\\xff]+/g).length;
			},
			date_format: function(value, format, default_date)
			{	/**
				 * @author   Benjamin "balupton" Lupton, shogo < shogo4405 at gmail dot com>
				 * @see      http://smarty.php.net/manual/en/language.modifier.date.format.php
				 */
				if( !value && !default_date ) {
					return '!CHECK THE SYNTAX FOR [date_format]!';
				}
				var t = (value || default_date);
				if ( typeof t !== "number" ) {
					t = strtotime(t, time());
				}
				var result = strftime((format || '%b %e %Y'), t);
				//$.console.debug([format,value,default_date,result,time]);
				return result;
			},
			'default': function (value, default_value)
			{	//
				return value || default_value;
			},
			fsize_format: function (size, format, precision)
			{
				// Defaults
				format = format || '';
				precision = precision || 2;
				// Sizes
			    var sizes = {
					'TB':1099511627776,
					'GB':1073741824,
					'MB':1048576,
					'KB':1024,
					'B':1
				};
			    // Get "human" filesize
				var result = '';
			    $.each(sizes, function ( unit, bytes ) {
			        if ( size > bytes || unit == strtoupper(format) ) {
			            result = number_format(size / bytes, precision)+' '+unit;
						return false; // break;
			        }
			    });
				// Return
				return result;
			}
		},
			
		functions: {
			'*': function(content, attribute)
			{	// Comment
				return content.populate();
			},
			assign: function ( content, attributes )
			{	// Assign a variable
				// Check
				if ( typeof attributes['var'] === 'undefined' || typeof attributes.value === 'undefined' )
				{	// Error
					return '!CHECK THE SYNTAX FOR [assign]!';
				}
				// Assign
				var value = attributes['value'];
				if ( value === '[]' )
				{	// Make an object
					value = {};
				}
				else
				{	// Not array, so escape
					// value = '"'+$.Smarty.escape(attributes['value'])+'"';
				}
				var key = attributes['var'];
				$.Smarty.assign(key, value);
				// Return
				return content.populate();
			},
			capture: function(content, attributes)
			{	// {capture} is used to collect the output of the template between the tags into a variable instead of displaying it.
				return content.populate();
			},
			cycle: function(content, attributes)
			{	// Cycle between values
			
				// Prepare
				var name = attributes.name || 'default'; // The name of the cycle
				var values = attributes.values; // 	The values to cycle through, either a comma delimited list (see delimiter attribute), or an array of values
				var print = attributes.print || true; // Whether to print the value or not
				var advance = attributes.advance || true; // Whether or not to advance to the next value
				var delimiter = attributes.delimiter || ','; // The delimiter to use in the values attribute
				var assign = attributes.assign || null; // The template variable the output will be assigned to
				var reset = attributes.reset || false; // The cycle will be set to the first value and not advanced
				
				// Prepare
				if ( assign && typeof attributes.print === 'undefined' )
				{	// Assigning, so don't print
					print = false;
				}
				
				// Convert values to array if not already
				if (typeof values === 'string') {
					try {
						values = values.split(eval('/' + delimiter + '/g'));
					} catch ( e ) {
						$.console.error(493,e);
					}
				}
				
				// Create the data block
				var data;
				if ( typeof $.Smarty.cycle[name] === 'undefined' || $.Smarty.cycle[name].values.toString() !== values.toString() )
				{	// No data, or new values, or reset has been called
					// So update
					data = {
						values:values,
						index:-1,
						length:values.length
					};
				}
				else
				{	// Have data already so use that
					data = $.Smarty.cycle[name];
					if ( reset )
					{	// Reset index
						data.index = -1;
					}
				}
				
				// Do changes
				if (advance)
				{
					++data.index;
					if ( data.index >= data.length )
					{ data.index = 0; }
				}
				
				// Get and set current value
				var current = data.values[data.index];
				
				// Assign?
				if ( assign )
				{	// Assign the var
					$.Smarty.assign(assign, current);
				}
				
				// Set the data
				$.Smarty.cycle[name] = data;
				
				// Do we want to print?
				var result = print ? current : '';
				
				// Done
				return result;
			},
			debug: function(content, attributes)
			{	// Debug the output
				var output = attributes.output;
				$.Smarty.debug('Smarty Debug: ', output);
				return '';
			},
			"if": function(content, attributes)
			{	// Include and populate a template
				
				// Evaluate the IF
				// PHP functions have already been defined by php.js
				// Operators have already been converted by core
				
				/*
				// Arrayify
				var a = [];
				for ( i in attributes )
				{	// Push values from object to array
					a.push(attributes[i]);
				}
				attributes = a; delete a;
				*/
				
				// $.Smarty.debug(566, ['IF:', content, attributes]);
				
				// Prepare statement
				var statements = '';
				var values = [];
				
				// Build statement
				var attribute, statement, is, left, middle, right;
				var reset = function() {
					// ($a / $b) % 2 != 0
					statement = '';
					is = false;
					left = ''; // ($a / $b)
					middle = ''; // % 2
					right = '== 0'; // != 0
				};
				var add = function () {
					//
					statement = is ? '('+statement+left+') '+middle+right : statement;
					statements += statement;
				};
				
				// Prepare
				reset();
				
				// Cycle through attributes
				for ( i in attributes ) {
					if ( $.Smarty.skip(i) ) continue;
					attribute = attributes[i];
					if ( $.Smarty.skip(attribute) ) continue;
					// Figure out what to do
					switch ( attribute )
					{
						case 'is':
							is = true; // we are a is block
							break;
							
						case 'not':
							right = right === '== 0' ? '!= 0' : '== 0';
							break;
							
						case 'div':
							break;
							
						case 'even':
							middle = '% 2 ';
							break;
							
						case 'odd':
							right = right === '== 0' ? '!= 0' : '== 0';
							middle = '% 2 ';
							break;
							
						case 'by':
							left = left+' / ';
							break;
							
						case '||':
						case '&&':
							add();
							statements += attribute+' ';
							reset();
							break;
							
						default:
							// $.Smarty.debug(['Atribute:', attribute]);
							if ( typeof $.Smarty.operators[attribute] !== 'undefined')
							{	// Operator
								statement += attribute+' ';
							}
							else
							{	// Value
								// We should be the last value in a IS statement (so we used a by)
								// OR a normal statement attribute
								values.push(attribute);
								if ( is )
								{
									left += 'values['+(values.length-1)+'] ';
								}
								else
								{
									statement += 'values['+(values.length-1)+'] ';
								}
								// $.Smarty.debug('attribute: ',attribute, values);
							}
							break;
					}
				}
				add();
						
				// Evaluate the statement
				// $.Smarty.debug(666, ['IF: ['+statements+']', attributes]);
				try {
					var result = eval(statements);
				} catch ( e ) {
					$.console.error(652,e);
				}
				
				// Figure out what to do
				var regex;
				var matches;
				if ( result )
				{	// Result is true, so disregard any else and elseif
					regex = /^(.*)\{(?:elseif|else)([^}]*)\}/;
					matches = content.match(regex);
					if ( matches !== null )
					{	// We have something to do
						// $.Smarty.debug(content, matches);
						content = matches[1];
					}
				}
				else
				{	// Result is false, so move on to an else or elseif
					regex = /\{(elseif|else)([^}]*)\}(.*)$/;
					matches = content.match(regex);
					if ( matches !== null )
					{	// We have something to do
						content = matches[3];
						if ( matches[1] === 'else' )
						{	// Basic if
							content = content.populate();
						}
						else if ( matches[1] === 'elseif' )
						{	// Fire elseif
							attributes = $.Smarty.attributes(matches[2]);
							content = $.Smarty.functions['if'](content, attributes);
						}
						else
						{	// Clear
							content = '';
						}
					}
					else
					{	// Clear
						content = '';
					}
					return content; // don't want to populate (prolly already done, or no need to)
				}
				
				// Done
				return content.populate();
			},
			include: function(content, attributes)
			{	// Include and populate a template
				var template = attributes.file;
				var template_id = 'smarty_include__'+template.replace(/[^\w_]/g,'_');
				$.Smarty.fetch(template, template_id);
				return '<span id="'+template_id+'"></span><script type="text/javascript">$.Smarty.include("'+template+'","'+template_id+'");</script>';
			},
			literal: function(content, attributes)
			{	// Don't do any processing on the content
				return content;
			},
			js: function(content, attributes)
			{	// Shortcut for js, don't ask my why you would want this?
				return '<script type="text/javascript">'+$content+'</script>';
			},
			foreach: function(content, attributes)
			{	// Sections
				// Prepare
				var from = attributes.from; // The array you are looping through
				if ( typeof from !== 'object' )
				{	return '';	}
				var item = attributes.item; // The name of the variable that is the current element
				var key = attributes.key || null; // The name of the variable that is the current key
				var name = attributes.name || Math.round(Math.random()*10000); // The name of the foreach loop for accessing foreach properties
				// Check
				if ( typeof from !== 'object' )
				{	return '';	}
				// Get length
				var length = 0;
				for ( var i in from ) {
					if ( $.Smarty.skip(i) ) continue;
					++length;
				}
				// Prepare Properties
				var data_proto = {
					index:-1,
					iteration:0,
					first:true,
					last:false,
					//
					show:true,
					total:length,
					//
					item:null,
					key:null
				};
				// Prepare Regex
				// var regex_g = eval('/{.*?$'+item+'.*?}/g');
				// var regex = eval('/({.*?)('+item+')(.*?})/');
				var replace = {item:item, key:key};
				// Process
				var result = '';
				// Traverse
				$.each(from, function(key, value) {
					// Prepare
					var data = data_proto;
					++data.index;
					++data.iteration;
					data.first = data.index === 0;
					data.last = data.iteration === data.total;
					data.item = value;
					data.key = key;
					// Apply
					$.Smarty.foreach[name] = data;
					// Replace
					var part = content;
					try {
						$.each(replace, function(replace, find){
							part = part.replace(eval('/\\{.*?\\$'+find+'.*?\\}/g'), function(match){
								match = match.match(eval('/(\\{.*?)(\\$'+find+')(.*?\\})/'));
								match = match[1]+'$smarty.foreach.'+name+'.'+replace+match[3];
								return match;
							});
						});
					} catch ( e ) {
						$.console.error(770,e);
					}
					// Populate
					result += part.populate();
				});
				// Return
				return result;
			},
			section: function(content, attributes)
			{	// Sections
				// Prepare
				var name = attributes.name; // The name of the section
				var loop = attributes.loop; // Value to determine the number of loop iterations
				if ( typeof loop !== 'object' )
				{	return '';	}
				var start = attributes.start || 0; // The index position that the section will begin looping. If the value is negative, the start position is calculated from the end of the array. For example, if there are seven values in the loop array and start is -2, the start index is 5. Invalid values (values outside of the length of the loop array) are automatically truncated to the closest valid value.
				var step = attributes.step || 1; // The step value that will be used to traverse the loop array. For example, step=2 will loop on index 0,2,4, etc. If step is negative, it will step through the array backwards.
				var max = attributes.max || loop.length; // Sets the maximum number of times the section will loop.
				var show = attributes.show || true; // Determines whether or not to show this section
				// Prepare
				try {
					var regex_g = eval('/{.*?\\['+name+'\\].*?}/g');
					var regex = eval('/({.*?\\[)('+name+')(\\].*?})/');
				} catch ( e ) {
					$.console.error(794,e);
				}
				// Process
				var result = '';
				// Cycle through the object
				for ( var section, i = start; i < max ; i += step )
				{	// Traverse
					section = content.replace(regex_g, function(match){
						match = match.match(regex);
						match = match[1]+i+match[3];
						return match;
					});
					result += section.populate();
				}
				// Return
				return result;
			},
			strip: function(content, attributes)
			{	// No point as populate already does this
				return content;
			}
			
		},
		
		// -----------------
		// Functions
		
		skip: function ( attr ) {
			var result = false;
			switch ( attr ) {
				case '':
				case 'index':
				case 'input':
				case '__proto__':
					// For some reason, Chrome is the only browser which adds these
					result = true;
					break;
			}
			return result;
		},
		
		fetch: function ( template, template_id /* optional for includes */ )
		{
			// Cache
			if ( typeof $.Smarty.templates[template] !== 'undefined' )
			{	// Already in cache
				if ( $.Smarty.templates[template] === 'fetching' )
				{	// Still fetching
					return false;
				}
				return $.Smarty.templates[template];
			}
			// Fetch
			var template_url = $.Smarty.template_url+template;
			$.get(template_url, function(data) {
				$.Smarty.templates[template] = data;
				//$.Smarty.debug(template, 'fetched');
				if ( typeof template_id !== 'undefined' )
				{
					$.Smarty.include(template, template_id);
				}
			});
			//$.Smarty.debug(template, 'fetching');
			$.Smarty.templates[template] = 'fetching';
			return false;
		},
		
		include: function ( template, template_id )
		{	// Now why do we do this?
			// Because we can not guarantee that the html element is in the DOM by the time the template is fetched
			// So a script tag is added that calls this when the dom element is in the dom
			// Also, the template may not of been fetched yet, even though the el is in the DOM
			// So we then have a callback for when the data is fetched to go here again
			
			//$.Smarty.debug(template, 'check');
			// Fetch template
			var $template = $('#'+template_id);
			var data = $.Smarty.fetch(template,template_id);
			if ( $template.length !== 0 )
			{	// We are ready
				data = $.Smarty.fetch(template,template_id);
				//$.Smarty.debug(template, 'data', data)
				if ( data )
				{	// Data has been fetch
					data = data.populate(); // populate the data
					$template.next('script').remove();
					$template.after(data);
					$template.remove();
				}
			}
			// Done
			return true;
		},
		
		// -----------------
		// Functions
		
		clearCache: function ( )
		{
			$.Smarty.templates = {};
		},
		
		populate: function(template){ // Populate the html
			template = new String(template);
			template = template.replace(/[\r\n\t]*/g, '');
			//$.Smarty.debug(template);
			return template.replace($.Smarty.search.tags_g, $.Smarty.tag_handler);
		},
		
		tag_handler: function(tag)
		{	// Handle the smarty tag
		
			// Explode the Tag
			//$.Smarty.debug("tag1: ",tag);
			tag = tag.match($.Smarty.search.tags);
			if (!tag) { return ''; } // already done
			//$.Smarty.debug("tag2: ",tag);
			
			// Extract
			var func = tag[1];
			var result;
			if ( func )
			{	// We have a function
				var attributes = $.Smarty.attributes(tag[2]);
				var content = tag[3] || '';
				result = $.Smarty.call(func, attributes, content);
			}
			else
			{	// We have a modifier instead
				result = $.Smarty.value(tag[2]);
			}
			
			// Done
			return result;
		},
		
		attributes: function ( attributes )
		{	// Fetch the attributes of a function
			if ( !attributes )
			{	// Empty (prolly not a function)
				return [];
			}
			attributes = (' '+attributes).match($.Smarty.search.attributes_g);
			// Sort out Attributes
			var attributes_new = {};
			for ( index in attributes )
			{
				if ( $.Smarty.skip(index) ) continue;
				var attribute = new String(attributes[index]).match($.Smarty.search.attributes);
				if ( attribute === null )
				{	// Continue
					continue;
				}
				var key;
				var value;
				if ( typeof attribute[1] === 'undefined' )
				{	// [ ' "blah"', undefined, '"blah"' ]
					key = index;
					value = attribute[0].replace(/^\s+|\s+$/g,''); // trim
				}
				else
				{	// [ ' var="hello"', 'var', '"hello"' ]
					key = attribute[1];
					value = attribute[2];
				}
				// Prepare
				//$.Smarty.debug(962, ["attribute: ", value]);
				value = $.Smarty.value(value);
				//$.Smarty.debug(964, ["attribute: ", value]);
				// Append
				attributes_new[key] = value;
			}
			attributes = attributes_new;
			// Done
			return attributes;
		},
		
		value: function ( source_raw )
		{	// Have a value or variable
		
			// Check
			if ( !source_raw || source_raw === '||' )
			{	// Empty, or Stop the OR from stuffing up our regex
				return source_raw || '';
			}
			
			var source_parts = ('|'+source_raw).match($.Smarty.search.modifiers_g);
			var modifiers = []; // [{raw, value, modifier, attributes}]
			// $.Smarty.debug(value, parts);
			for (source_part in source_parts) { // Cycle
				if ( $.Smarty.skip(source_part) ) continue;
				
				// Get pieces
				var source = String(source_parts[source_part]);
				var parts = source.match($.Smarty.search.modifiers);
				if ( parts === null )
				{	// Continue
					continue;
				}
				
				// Get the original value
				var raw = parts[2]; // what the value was
				var value = raw || null; // what the value will be
				
				// Figure out what we are
				var what = parts[1] === '|' ? 'modifier' : 'attribute';
				
				// Figure out what we have
				// Get first last char
				if (  value !== null && value !== '' )
				{	// We have something to do
					var a = value.charAt(0);
					var z = value.charAt(value.length - 1);
					switch ( true )
					{
						case !isNaN(value) || value === '0':
							// Number
							value = parseInt(value, 10);
							break;
						case (a === '"' && z === '"'):
						case (a === "'" && z === "'"):
							// String
							try {
								value = eval(value);
							} catch ( e ) {
								$.console.error(1002,e);
							}
							break;
						case (a === '$'):
							// Variable
							var loc = $.Smarty.varloc(value);
							// $.Smarty.debug(value, loc,[loc.substring(0,10),loc.substring(0,10) === "['smarty']"])
							if ( loc.substring(0,10) === "['smarty']" )
							{	// Directly accessing smarty
								loc = '$.Smarty'+loc.substring(10);
							}
							else
							{	// Not directly accessing smarty
								loc = '$.Smarty.data'+loc;
							}
							// $.Smarty.debug('value:',value, loc, $.Smarty.data);
							try {
								value = eval(loc);
							} catch ( e ) {
								$.console.error(1021,e);
							}
							// $.Smarty.debug(value, $.Smarty.data);
							break;
						case (a === '#' && z === "#"):
							// Config
							value = value.substring(1,value.length-1); // trim off #s
							try {
								value = eval('$.Smarty.config'+$.Smarty.varloc(value));
							} catch ( e ) {
								$.console.error(1031,e);
							}
							break;
						case (typeof $.Smarty.operators[value] !== 'undefined'):
							// Operator
							// $.Smarty.debug('operator: ',value, $.Smarty.operators[value]);
							value = $.Smarty.operators[value];
							break;
						default:
							// Nothing to do
							// KEEP AS A STRING
							// $.Smarty.debug('value: '+value);
							break;
					}
				}
				
				// Depending on what we have, handle it differently
				if ( what === 'modifier' )
				{	// Modifier
					modifiers.push({
						'source':source,
						'raw':raw,
						'value':value,
						'attributes':[]
					});
				}
				else
				{	// Attribute
					// Append attribute to last modifier
					modifiers[modifiers.length-1].attributes.push(value);
					// Append attribute source to modifier source
					modifiers[modifiers.length-1].source += source;
				}
				
				// Done
			}
			
			// Have a result
			var result;
			if ( typeof modifiers[0].value === 'undefined' ) {
				// if the variable does not actually list in case we were a variable reference
				result = '';
			} else {
				result = modifiers[0].value; // As this is actually the value we want to modify
			}
			
			// Apply Modifiers
			for ( var i = 1, n = modifiers.length; i < n; ++i )
			{	// We have modifiers, so apply them
				var modifier = modifiers[i];
				// Add some stuff to the helper, this is advanced shit
				$.Smarty.modifier_helper['var'] = modifiers[0].raw; // original var
				$.Smarty.modifier_helper.raw = modifier.raw;
				$.Smarty.modifier_helper.source = source_raw;
				$.Smarty.modifier_helper.modifiers = modifiers;
				// Apply modifier
			
				result = $.Smarty.call(modifier.value, modifier.attributes, result);
			}
			
			// Return value
			return result;
		},
		
		call: function ( func, attributes, content )
		{	// Has a function with attribute and content
			// Has a modifier with attributes and value
			
			// Does things work
			if ( !func )
			{	// Nothing to do
				return '';
			}
			
			// Get content
			content = content || "";
			content = String(content);
			
			// Eval wrap
			try {
				// Check for function
				var call = '$.Smarty.functions[func]';
				var ref = eval(call);
				if ( typeof ref !== 'undefined' )
				{	// Function exists
					content = ref(content, attributes);
				}
				else
				{	// Check for modifier
					call = '$.Smarty.modifiers[func]';
					ref = eval(call);
					if ( typeof ref !== 'undefined' )
					{	// Modifier exists
						call += '("'+content.replace(/"/g, '\\"')+'",';
						for ( index in attributes ) {
							if ( $.Smarty.skip(index) ) continue;
							call += 'attributes['+index+'],';
						}
						call = call.substring(0,call.length-1);
						call += ')';
					
						// $.Smarty.debug('call: ',call);
						content = eval(call);
					}
					else
					{	// Nothing exists, so try value
						// No function because we are just a plain variable
						content = $.Smarty.value(func); // so set content as the variable
					}
				}
			} catch ( e ) {
				$.console.error(1136,e);
			}
			
			//$.Smarty.debug("call2: ", func, attributes, content);
			// Return the content
			return content;
		},
		
		varloc: function ( value, prefix )
		{
			// Stringify value
			value = new String(value);
			// Turn class->var to class.var
			value = value.replace(/\-\>/g, '.');
			// Turn .something into ["something"]
			var parts = value.match(/([^.$\['"\]]+)/g);
			value = '';
			for ( var i = 0, n = parts.length; i < n; ++i )
			{
				value += "['"+new String(parts[i])+"']";
			}
			// Do we have a prefix
			if ( prefix )
			{	// Just do the same, and prepend
				prefix = $.Smarty.varloc(prefix);
				value = prefix+value;
			}
			// Return
			return value;
		},
		
		assign: function ( key, value, preloc )
		{	// Assign
			
			// Prep
			preloc = preloc || '';
			
			// What to do
			if ( typeof value === 'undefined' && typeof key === 'object' )
			{	// No value, so key is an object of data
				// So let's mix it up
				$.each(key, function(i, val){
					$.Smarty.assign(i, val, preloc);
				});
			}
			else
			{	// There is a key and a value
				
				// Get loc
				var loc = $.Smarty.varloc(key, preloc);
				var loc2 = '$.Smarty.data'+loc;
				
				// Eval wrap
				try {
					// Get old value
					var old_value;
					old_value = eval(loc2);
					
					// Update value
					var call = loc2+' = value';
					
					// $.Smarty.debug('assign: ', call, value, old_value);
					eval(call);
				}
				catch ( e ) {
					$.console.error(1201,e);
				}
				
				// Call changed
				$.Smarty.changed(loc, old_value, value);
			}
			
			// Done
		},
		
		onchange: function ( key, func )
		{	// Add onchange handler for key
			try {
				// Get locations
				var loc = $.Smarty.varloc(key);
				var loc2 = '$.Smarty.onchange_funcs'+loc;
				// Create array if need be
				eval(loc2+' = '+loc2+' || []');
				// Push onchange functions
				eval(loc2+'.push(func)');
			}
			catch ( e ) {
				// The onchange handler does not exist, this is okay, ignore
				// This is okay as onchange will fire for everything
				return;
			}
		},
		
		changed: function ( key, old_value, new_value )
		{	// Trigger onchange functions for key, and pass value
			// $.Smarty.debug('changed:', [key, old_value, new_value]);
			var loc = $.Smarty.varloc(key);
			// $.Smarty.debug('changed: loc:', loc);
			try {
				// $.Smarty.debug('changed3: loc:', loc);
				var funcs = eval('$.Smarty.onchange_funcs'+loc);
			}
			catch (e) {
				// The onchange handler does not exist, this is okay, ignore
				// This is okay as onchange will fire for everything
				return;
			}
			
			// Trigger functions
			if (!funcs) { return; }
			$.each(funcs, function(i, func){
				func(old_value, new_value);
			});
			
			// Now do trigger for object data
			var merged;
			if (typeof old_value === 'object' && typeof new_value === 'object') {
				merged = $.extend({}, old_value, new_value);
			} else if ( typeof old_value === 'object' ) {
				merged = old_value;
			} else if ( typeof new_value === 'object' ) {
				merged = new_value;
			}
			
			// Cycle
			if ( !merged ) { return; }
			$.each(merged, function(i, val){
				var old_value2 = old_value[i];
				var new_value2 = new_value[i];
				var loc2 = $.Smarty.varloc(i, loc);
				// $.Smarty.debug('changed2:', [loc2, old_value2, new_value2]);
				$.Smarty.changed(loc2, old_value2, new_value2);
			});
			
			// Done
		},
		
		escape: function ( value, quote )
		{	// Redundant, include varname instead
			if ( typeof quote === 'undefined' )
			{	quote = '"';	}
			// alert(value);
			var result;
			try {
				result = new String(value).replace(eval('/'+quote+'/g'), '\\'+quote);
			}
			catch (e) {
				$.console.error(1283,e);
			}
			// Return
			return result;
		},
		
		
		// --------------------------------------------------
		// Things we don't really care about
		
		debug: function ( )
		{
			var arr = []; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
		    $.console.debug.apply($.console, arr);
		},
		
		// --------------------------------------------------
		// construct / domReady / Import resources
		
		construct: function ( )
		{
			// -------------------
			// Add Document Ready handler
			
			$(function() {
				// domReady
				$.Smarty.domReady();
			});
			
			// -------------------
			// Finish Up
			
			// All good
			return true;
		},
		
		domReady: function(){ // Populate the DOM
			// return $(document).populate();
		}
	
	}); // We have finished extending/defining our Plugin


	// --------------------------------------------------
	// Finish up
	
	// Instantiate
	if ( typeof $.Smarty === 'undefined' )
	{	// 
		$.Smarty = new $.SmartyClass();
	}

// Finished definition

})(jQuery); // We are done with our plugin, so lets call it with jQuery as the argument
