<?php

if ( !empty($_SERVER['REDIRECT_URL']) ) {
	$_SERVER['REQUEST_URI'] = $_SERVER['REDIRECT_URL'];
}

// Include paths
if ( strstr($_SERVER['DOCUMENT_ROOT'], 'C:') ) {
	// We are probably on the devleopment sever
	define('APPLICATION_ENV', 				'development');
	define('ROOT_PATH', 					realpath($_SERVER['DOCUMENT_ROOT']));
	define('APPLICATION_PATH', 				realpath(dirname(__FILE__) . '/application'));
	define('CONFIG_PATH', 					realpath(APPLICATION_PATH.'/configs'));
	
	define('COMMON_PATH', 					realpath(ROOT_PATH.'/common'));
	define('DOCTRINE_PATH', 				realpath(COMMON_PATH.'/doctrine-1.2.0-beta3/lib'));
	define('DOCTRINE_EXTENSIONS_PATH', 		realpath(COMMON_PATH.'/doctrine-extensions'));
	define('ZEND_PATH', 					realpath(COMMON_PATH.'/zend-1.9.5/library'));
	define('BALPHP_PATH', 					realpath(COMMON_PATH.'/balphp/lib'));
	
	define('CONFIG_APP_PATH', 				realpath(CONFIG_PATH.'/sites/mydance.ini'));
	define('ROOT_URL',						'http://localhost');
	define('BASE_URL', 						'/projects/balcms');
}
elseif ( strpos($_SERVER['HTTP_HOST'], 'mydance.com.au') !== false ) {
	// We are on the production server
	define('APPLICATION_ENV', 				!empty($_COOKIE['debug']) && $_COOKIE['debug']==='secret' ? 'staging' : 'production');
	define('ROOT_PATH', 					realpath($_SERVER['DOCUMENT_ROOT']));
	define('APPLICATION_PATH', 				realpath(dirname(__FILE__) . '/application'));
	define('CONFIG_PATH', 					realpath(APPLICATION_PATH.'/configs'));
	
	define('COMMON_PATH', 					realpath(ROOT_PATH.'/common'));
	define('DOCTRINE_PATH', 				realpath(COMMON_PATH.'/doctrine-1.2.0-beta3/lib'));
	define('DOCTRINE_EXTENSIONS_PATH', 		realpath(COMMON_PATH.'/doctrine-extensions'));
	define('ZEND_PATH', 					realpath(COMMON_PATH.'/zend-1.9.5/library'));
	define('BALPHP_PATH', 					realpath(COMMON_PATH.'/balphp/lib'));
	
	define('CONFIG_APP_PATH', 				realpath(CONFIG_PATH.'/sites/mydance.ini'));
	define('ROOT_URL',						'http://www.mydance.com.au');
}

// Fix magic quotes
require_once BALPHP_PATH.'/core/functions/_params.funcs.php';
fix_magic_quotes();

// Debug Mode
if ( !defined('DEBUG_MODE') ) define('DEBUG_MODE',
	('development' === APPLICATION_ENV || 'testing' === APPLICATION_ENV ||
		(!empty($_COOKIE['debug']) && $_COOKIE['debug'] === 'secret')
	)
	? 1
	: 0
);

// Define application environment
if ( !defined('APPLICATION_ENV') )
	define('APPLICATION_ENV', 				(getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'development'));
if ( !defined('APPLICATION_PATH') )
	define('APPLICATION_PATH', 				realpath(dirname(__FILE__) . '/../application'));
if ( !defined('CONFIG_PATH') )
	define('CONFIG_PATH', 					realpath(APPLICATION_PATH.'/configs'));
if ( !defined('CONFIG_APP_PATH') )
	define('CONFIG_APP_PATH', 				realpath(CONFIG_PATH.'/application.ini'));
if ( !defined('APPLICATION_ROOT_PATH') )
	define('APPLICATION_ROOT_PATH', 		realpath(APPLICATION_PATH.'/..'));
if ( !defined('LIBRARY_PATH') )
	define('LIBRARY_PATH', 					realpath(APPLICATION_ROOT_PATH.'/library'));
if ( !defined('PUBLIC_PATH') )
	define('PUBLIC_PATH', 					realpath(APPLICATION_ROOT_PATH.'/public'));
//if ( !defined('HANDLER_PATH') )
//	define('HANDLER_PATH', 					realpath(APPLICATION_PATH.'/handlers'));

// Ensure library/ is on include_path
$include_paths = array();
if ( defined('ZEND_PATH') )
	$include_paths[] = ZEND_PATH;
if ( defined('DOCTRINE_PATH') )
	$include_paths[] = DOCTRINE_PATH;
//$include_paths[] = get_include_path();
$include_paths[] = LIBRARY_PATH;
//$include_paths[] = HANDLER_PATH;
//if ( defined('BALPHP_PATH') )
//	$include_paths[] = BALPHP_PATH;
set_include_path(implode(PATH_SEPARATOR, $include_paths));

// Zend_Application
require_once 'Zend/Application.php';

// Create application, bootstrap, and run
$Application = new Zend_Application(
    APPLICATION_ENV,
    CONFIG_APP_PATH
);

// Check if we want to bootstrap
if ( !isset($bootstrap) || $bootstrap )
$Application->bootstrap();

// Check if we want to run
if ( !isset($run) || $run )
$Application->run();
