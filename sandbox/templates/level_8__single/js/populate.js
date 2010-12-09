$(function()
{
	// Include Templating System
	var renderer, compiler;
	renderer = $.getRenderer();
	compiler = renderer.get_compiler();
	
	
	// Do Page Mods
	$('.links a').each(function(){
		var $this = $(this);
		var href = $this.attr('href').toString();
		var page = href.substring(href.lastIndexOf('=')+1);
		$this.click(function(){
			populate(page);
			return false;
		});
	});
	
	// Populate
	function populate(page)
	{	// Populate our display
		
		if (!page)
		{	// Default, do nothing
		}
		else 
			if (page === 'home') { // Home
				renderer.assign({
					'intro': 'Welcome to <u>Home</u>',
					'outro': renderer.fetch('page/home/outro.tpl')
				});
				renderer.assign('page', renderer.fetch('page/home.tpl'));
			}
			else 
				if (page === 'search') { // Search
					renderer.assign({
						'query': 'blah blah blah',
						'results': [{
							'number': 'One'
						}, {
							'number': 'Two'
						}, {
							'number': 'Three'
						}]
					});
					renderer.assign('page', renderer.fetch('page/search.tpl'));
				}
		
		// Update Display
		$('.container').fetch(); // - only works if it has a className and ID of the same value
		// $(document.body).fetch(); - DOES NOT WORK, needs to be fixed...
	}
	
	// Do initial populate
	populate('');
});
