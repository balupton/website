<?php

// Include paths
if ( strstr($_SERVER['DOCUMENT_ROOT'], 'C:') === '/home/content/h/e/n/henfa/html' ) {
	// We are probably on the devleopment sever
	define('APPLICATION_ENV', 				'development');
	define('ROOT_PATH', 					realpath($_SERVER['DOCUMENT_ROOT']));
	define('COMMON_PATH', 					realpath(ROOT_PATH.'/common'));
	define('DOCTRINE_PATH', 				realpath(ROOT_PATH.'/common/doctrine-1.2/lib'));
	define('DOCTRINE_EXTENSIONS_PATH', 		realpath(ROOT_PATH.'/common/doctrine-extensions/lib'));
	define('ZEND_PATH', 					realpath(ROOT_PATH.'/common/zend-1.9.4/library'));
	define('BALPHP_PATH', 					realpath(ROOT_PATH.'/common/balphp/lib'));
	define('BASE_URL', 						'/projects/balcms/public/');
} else {
	// We are on the production server
	define('APPLICATION_ENV', 				!empty($_COOKIE['debug']) && $_COOKIE['debug']==='secret' ? 'staging' : 'production');
	define('ROOT_PATH', 					realpath($_SERVER['DOCUMENT_ROOT']));
	define('COMMON_PATH', 					realpath(ROOT_PATH.'/common'));
	define('DOCTRINE_PATH', 				realpath(ROOT_PATH.'/common/doctrine-1.2/lib'));
	define('DOCTRINE_EXTENSIONS_PATH', 		realpath(ROOT_PATH.'/common/doctrine-extensions/lib'));
	define('ZEND_PATH', 					realpath(ROOT_PATH.'/common/zend-1.9.4/library'));
	define('BALPHP_PATH', 					realpath(ROOT_PATH.'/common/balphp/lib'));
	//define('BASE_URL', 					'/stage/public/');
}

// Define application environment
if ( !defined('APPLICATION_ENV') )
	define('APPLICATION_ENV', 				(getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'development'));
if ( !defined('APPLICATION_PATH') )
	define('APPLICATION_PATH', 				realpath(dirname(__FILE__) . '/../application'));
if ( !defined('CONFIG_PATH') )
	define('CONFIG_PATH', 					realpath(APPLICATION_PATH.'/configs'));
if ( !defined('LIBRARY_PATH') )
	define('LIBRARY_PATH', 					realpath(APPLICATION_PATH.'/../library'));
if ( !defined('PUBLIC_PATH') )
	define('PUBLIC_PATH', 					realpath(APPLICATION_PATH.'/../public'));
if ( !defined('HANDLER_PATH') )
	define('HANDLER_PATH', 					realpath(APPLICATION_PATH.'/handlers'));

// Ensure library/ is on include_path
$include_paths = array();
if ( defined('ZEND_PATH') )
	$include_paths[] = ZEND_PATH;
if ( defined('DOCTRINE_PATH') )
	$include_paths[] = DOCTRINE_PATH;
//$include_paths[] = get_include_path();
$include_paths[] = LIBRARY_PATH;
$include_paths[] = HANDLER_PATH;
//if ( defined('BALPHP_PATH') )
//	$include_paths[] = BALPHP_PATH;
set_include_path(implode(PATH_SEPARATOR, $include_paths));

// Zend_Application
require_once 'Zend/Application.php';

// Create application, bootstrap, and run
$Application = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . '/configs/application.ini'
);

// Check if we want to bootstrap
if ( !isset($bootstrap) || $bootstrap )
$Application->bootstrap();

// Check if we want to run
if ( !isset($run) || $run )
$Application->run();
