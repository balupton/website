<?php

require_once(dirname(__FILE__).'/_templates.php');

$template_dir = dirname(__FILE__).'/templates/';

if ( empty($_GET['page']) )
{	// Default
	$templates = array(
		'template' => array(
			'type' => 'file',
			'value' => $template_dir.'skeleton.php'
		)
	);
}
elseif ( $_GET['page'] === 'home' )
{	// Home
	$templates = array(
		'template' => array(
			'type' => 'file',
			'value' => $template_dir.'skeleton.php'
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
			'value' => $template_dir.'skeleton.php'
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

echo populate($templates);

?>