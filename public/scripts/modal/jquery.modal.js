(function(){
	
	// Pre-Requisites
	$.fn.removeFade = $.fn.removeFade || function(speed,easing){
		var $this = $(this);
		$this.animate({opacity:0}, speed||200, easing||'swing', function(){
			$this.remove();
		});
		return $this;
	}
	
	// Check
	if ( typeof $.Modal !== 'undefined' ) {
		return;
	}
	
	// Namespace
	var Modal = function($modal, options){
		Modal.create($modal, options);
		return Modal;
	};
	
	// Bind
	$.fn.modal = function(){
		Modal.create(this);
		return this;
	};
	
	// Create
	Modal.create = function($modal, options){
		// Prepare
		$modal = $($modal);
		options = $.extend({}, options);
		// Create
		$modal.find('.close-button').click(function(){
			$modal.removeFade(200);
		});
		// Done
		return true;
	};
	
	// Apply
	$.Modal = Modal;
	
	// Init
	$(function(){
		$('#jquery-modal').modal();
	});
	
	// Done
	return true;
})();
