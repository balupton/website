<?php

$template_dir = dirname(__FILE__).'/templates/';

if ( empty($_GET['page']) ) $_GET['page'] = 'home';

if ( $_GET['page'] === 'home' )
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
	if ( !is_array($item) )
	{	die('item not an array');	}
	
	if ( empty($item['template']) )
	{	die('template does not exist');		}
	
	// Get template
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
	
	// Get data
	if ( empty($item['data']) )
	{	// Nothing to do, return template
		return $template;
	}
	$data = $item['data'];
	if ( !is_array($data) )
	{	die('no clue what data we have');	}
	
	// Populate
	$keys = array();
	$values = array();
	$display = '';
	foreach ( $data as $key => $value )
	{	
		// Do we need to recurse
		if ( is_array($value) && !empty($value['template']) )
		{	// More to do, lets recurse
			$value = populate($value);
		}
		elseif ( is_array($value) )
		{	// We are a list, so duplicate the template
			$display .= populate(array('template'=>$template,'data'=>$value));
		}
		
		// Style 1
		$keys[] = '%'.$key.'%';
		$values[] = $value;
		// Style 2
		$keys[] = '<!--['.$key.']-->';
		$values[] = $value;
	}
	if ( empty($display) )
	{	$display = str_replace($keys, $values, $template);	}
	
	// Return display
	return $display;
}

echo populate($templates);

?>