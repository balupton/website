<?php

$template_dir = dirname(__FILE__).'/templates/';

if ( empty($_GET['page']) )
{	// Default
	$templates = file_get_contents($template_dir.'skeleton.htm');
}
elseif ( $_GET['page'] === 'home' )
{	// Home
	$templates = array(
		'template' => array(
			'type' => 'file',
			'value' => $template_dir.'skeleton.htm'
		),
		'data' => array(
			'page' => array( /* home */
				'template' => array(
					'type' => 'raw',
					'value' => '<div class="home">
						<div class="home_intro">
						<!--[intro]-->
						</div>
						<div class="home_content">
						Home Contents
						</div>
						<div class="home_outro">
						<!--[outro]-->
						</div>
					</div>'
				),
				'data' => array(
					'intro' => 'Welcome to <u>Home</u>',
					'outro' => array(
						'template' => array(
							'type' => 'file',
							'value' => $template_dir.'page/home/outro.htm'
						)
					)
				)
			)
		)
	);

}
elseif ( $_GET['page'] === 'search' )
{	// Search
	$templates = array(
		'template' => array(
			'type' => 'file',
			'value' => $template_dir.'skeleton.htm'
		),
		'data' => array(
			'page' => array( /* search */
				'template' => array(
					'type' => 'file',
					'value' => $template_dir.'page/search.htm'
				),
				'data' => array(
					'query' => 'blah blah blah',
					'results' => array(
						'template' => array(
							'type' => 'file',
							'value' => $template_dir.'page/search/result.htm'
						),
						'data' => array(
							array('number'=>'One'),
							array('number'=>'Two'),
							array('number'=>'Three')
						)
					)
				)
			)
		)
	);
	
}

function populate ( $item )
{	
	// Prepare / Checks
	if ( !is_array($item) )
	{	// We just have a template
		$template = $item;
		$data = NULL;
	}
	else
	if ( empty($item['template']) )
	{	// Have data but no template
		die('Sorry, you have data but no template.');
	}
	else
	if ( !empty($item['data']) && !is_array($item['data']) )
	{	// No clue what type of data we have... or how to handle it
		die('Sorry, your data is incorrect.');
	}
	else
	{	// Fetch template and data

		// Fetch template
		$template = $item['template'];
		if ( is_array($template) )
		{	// Have an array
			if ( empty($template['type']) || empty($template['value']) )
			{	die('no clue what type of template we have');	}
			// Get template
			if ( $template['type'] === 'file' )
			{	// Get template from file contents
				$template = file_get_contents($template['value']);
			} elseif ( $template['type'] === 'raw' )
			{	// Get template from value
				$template = $template['value'];
			}
		}
	
		// Fetch Data
		$data = NULL;
		if ( !empty($item['data']) )
		{	// We got data (and is array)
			$data = $item['data'];
		}
	}
	
	// Populate
	$keys = array();
	$values = array();
	$display = '';
	if ( !empty($data) )
	foreach ( $data as $key => $value )
	{	
		// Do we need to recurse
		if ( is_array($value) && !empty($value['template']) )
		{	// More to do, lets recurse
			$value = populate($value);
		}
		elseif ( is_int($key) && is_array($value) )
		{	// We are a list, so duplicate the template
			$display .= populate(array('template'=>$template,'data'=>$value));
			continue;
		}
		
		// Replace
		$keys[] = '/<!--\\['.$key.'(\\|-->.+?\\|'.$key.'-->|\\|?.*?\\]-->)/i';
		$values[] = $value;
		$keys[] = '/\\%'.$key.'(\\|.*?)\\%/i';
		$values[] = $value;
	}
	
	// Populate
	if ( empty($display) )
	{
		// Add any left overs, by replacing with default values
		$keys[] = '/<!--\\[[^\\|\\-\\]]*?\\|([^\\|\\-\\]]+?)\\]-->/ie';
		$values[] = 'populate(file_get_contents(\''.$GLOBALS['template_dir'].'$1\'))';
		$keys[] = '/\\%.*?\\|([^\\%]+?)\\%/ie';
		$values[] = '\'$1\'';
	
		// Apply
		$display = preg_replace($keys, $values, $template);
	}
	
	// Return populated template
	return $display;
}

echo populate($templates);

?>