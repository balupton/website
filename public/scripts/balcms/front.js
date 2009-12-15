(function($){
	// By Benjamin "balupton" Lupton (MIT Licenced) - unless specified otherwise
	
	// Sparkle: debug
	$.Sparkle.add('debug', function(){
		var $this = $(this); var Sparkle = $.Sparkle;
		// Prepare
		var click = function(event){
			var $this = $(this);
			var $parent = $this.parent();
			var show = !$parent.data('sparkle-debug-show');
			$parent.data('sparkle-debug-show', show);
			$this.siblings('.value').toggle(show);
		};
		var dblclick = function(event){
			var $this = $(this);
			var $parent = $this.parent();
			var show = !$parent.data('sparkle-debug-show');
			$parent.data('sparkle-debug-show', show);
			$parent.find('.value').toggle(show);
		};
		// Fetch
		var $debug = $this.findAndSelf('.debug:not(.sparkle-debug-init)');
		$debug.addClass('sparkle-debug-init').find('.value:has(.var)').hide().siblings('.name,.type').addClass('link').click(click).dblclick(dblclick);
		// Done
		return $this;
	});
	
	// Handle
	$(function(){
		$(document.body).sparkle();
	});
	
})(jQuery);