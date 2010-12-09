<?php


function populate_include ( $file, $data = array() )
{	// Include the file in a new scope
	extract($data);
	require($file);
}
function populate ( $item )
{	
	// Prepare / Checks
	if ( !is_array($item) )
	{	// We just have a template
		$template = $item;
		$data = array();
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

		// Fetch Data
		$data = array();
		if ( !empty($item['data']) )
		{	// We got data (and is array)
			$data = $item['data'];
		}
		
		// Fetch template
		$template = $item['template'];
		if ( is_array($template) )
		{	// Have an array
			if ( empty($template['type']) || empty($template['value']) )
			{	die('no clue what type of template we have');	}
			// Get template
			if ( $template['type'] === 'file' )
			{	// Get template from file contents
				if ( substr($template['value'],strlen($template['value'])-4) === '.php' )
				{	// Include instead of read
					ob_start();
					populate_include($template['value'], $data);
					$template = ob_get_contents();
					ob_end_clean();
				}
				else
				{	// Read instead of include
					$template = file_get_contents($template['value']);
				}
			}
			elseif ( $template['type'] === 'raw' )
			{	// Get template from value
				$template = $template['value'];
			}
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
		$keys[] = '/\\%\\%'.$key.'(\\|.*?)\\%\\%/i';
		$values[] = $value;
	}
	
	// Populate
	if ( empty($display) )
	{
		// Add any left overs, by replacing with default values
		$keys[] = '/<!--\\[[^\\|\\-\\]]*?\\|([^\\|\\-\\]]+?)\\]-->/ie';
		$values[] = 'populate(file_get_contents(\''.$GLOBALS['template_dir'].'$1\'))';
		$keys[] = '/\\%\\%.*?\\|([^\\%]+?)\\%\\%/ie';
		$values[] = '\'$1\'';
	
		// Apply
		$display = preg_replace($keys, $values, $template);
	}
	
	// Return populated template
	return $display;
}

?>