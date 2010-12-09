<?php

// Use JSmarty?
if ( !empty($_GET['jsmarty']) )
{	// Use JSmarty
	echo file_get_contents('templates/index.tpl');
	die;
}

// Include Templating System
require dirname(__FILE__).'/smarty/Smarty.class.php';
$smarty = new Smarty;
$smarty->compile_check = true;
// $smarty->debugging = true;

// Set Data
if ( empty($_GET['page']) )
{	// Default
}
elseif ( $_GET['page'] === 'home' )
{	// Home
	$smarty->assign(array(
		'intro' => 'Welcome to <u>Home</u>',
		'outro' => $smarty->fetch('page/home/outro.tpl')
	));
}
elseif ( $_GET['page'] === 'search' )
{	// Search
	$smarty->assign(array(
		'query' => 'blah blah blah',
		'results' => array(
			array('number'=>'One'),
			array('number'=>'Two'),
			array('number'=>'Three')
		)
	));
	$smarty->assign('page', $smarty->fetch('page/search.tpl'));
}

// Display
$smarty->display('index.tpl');


?>