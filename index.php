<?php

// Prepare
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 1);
	
// Prepare
if ( !empty($_SERVER['REDIRECT_URL']) ) {
	$_SERVER['REQUEST_URI'] = $_SERVER['REDIRECT_URL'];
}

// Prepare
define('APPLICATION_ROOT_PATH', 			realpath(dirname(__FILE__)));
if ( !isset($_SERVER) ) {
	$_SERVER = array();
}
if ( empty($_SERVER['DOCUMENT_ROOT']) ) {
	$_SERVER['DOCUMENT_ROOT'] = realpath(dirname(__FILE__).'/../../');
}


// Include paths
if ( strstr($_SERVER['DOCUMENT_ROOT'], 'C:') || $_SERVER['DOCUMENT_ROOT'] === '/usr/local/zend/apache2/htdocs' ) {
	// Windows Development Environment
	define('APPLICATION_ENV', 				'development');
	define('ROOT_PATH', 					realpath($_SERVER['DOCUMENT_ROOT']));
	define('APPLICATION_PATH', 				realpath(APPLICATION_ROOT_PATH . '/application'));
	define('CONFIG_PATH', 					realpath(APPLICATION_PATH.'/config'));
	
	define('COMMON_PATH', 					realpath(ROOT_PATH.'/common'));
	define('DOCTRINE_PATH', 				realpath(COMMON_PATH.'/doctrine-1.2.1-lib'));
	define('DOCTRINE_EXTENSIONS_PATH', 		realpath(COMMON_PATH.'/doctrine-extensions'));
	define('ZEND_PATH', 					realpath(COMMON_PATH.'/zend-1.9.6-lib'));
	define('BALPHP_PATH', 					realpath(COMMON_PATH.'/balphp-lib'));
	
	define('CONFIG_APP_PATH', 				realpath(CONFIG_PATH.'/mydance.ini'));
	define('ROOT_URL',						'http://localhost');
	define('BASE_URL', 						'/projects/balcms');
}
elseif ( strpos($_SERVER['HTTP_HOST'], 'mydance.com.au') !== false ) {
	// MyDance Production Server
	define('APPLICATION_ENV', 				!empty($_COOKIE['debug']) && $_COOKIE['debug']==='secret' ? 'staging' : 'production');
	define('ROOT_PATH', 					realpath($_SERVER['DOCUMENT_ROOT']));
	define('APPLICATION_PATH', 				realpath(APPLICATION_ROOT_PATH . '/application'));
	define('CONFIG_PATH', 					realpath(APPLICATION_PATH.'/config'));
	
	define('COMMON_PATH', 					realpath(ROOT_PATH.'/common'));
	define('DOCTRINE_PATH', 				realpath(COMMON_PATH.'/doctrine-1.2.1-lib'));
	define('DOCTRINE_EXTENSIONS_PATH', 		realpath(COMMON_PATH.'/doctrine-extensions'));
	define('ZEND_PATH', 					realpath(COMMON_PATH.'/zend-1.9.6-lib'));
	define('BALPHP_PATH', 					realpath(COMMON_PATH.'/balphp-lib'));
	
	define('CONFIG_APP_PATH', 				realpath(CONFIG_PATH.'/mydance.ini'));
	define('ROOT_URL',						'http://www.mydance.com.au');
}

// Fix magic quotes
require_once BALPHP_PATH.'/core/functions/_params.funcs.php';
fix_magic_quotes();

// Debug Mode
define('DEBUG_SECRET',			md5(APPLICATION_ROOT_PATH));
if ( !defined('DEBUG_MODE') ) 	define('DEBUG_MODE',
	('development' === APPLICATION_ENV || 'testing' === APPLICATION_ENV ||
		(!empty($_COOKIE['debug']) && $_COOKIE['debug'] === 'secret')
	)
	? 1
	: 0
);

// Defines
if ( !defined('APPLICATION_ENV') ) {
	define('APPLICATION_ENV', 				(getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'development'));
}
if ( !defined('APPLICATION_ROOT_PATH') ) {
	define('APPLICATION_ROOT_PATH', 		realpath(APPLICATION_PATH.'/..'));
}
if ( !defined('CONFIG_PATH') ) {
	define('CONFIG_PATH', 					realpath(APPLICATION_PATH.'/configs'));
}
if ( !defined('CONFIG_APP_PATH') ) {
	define('CONFIG_APP_PATH', 				realpath(CONFIG_PATH.'/application.ini'));
}
if ( !defined('LIBRARY_PATH') ) {
	define('LIBRARY_PATH', 					realpath(APPLICATION_ROOT_PATH.'/library'));
}

if ( !defined('BASE_URL') ) {
	define('BASE_URL', 						'');
}

if ( !defined('PUBLIC_PATH') ) {
	define('PUBLIC_PATH', 					realpath(APPLICATION_ROOT_PATH.'/public'));
}
if ( !defined('PUBLIC_URL') ) {
	define('PUBLIC_URL', 					BASE_URL.'/public');
}

if ( !defined('MEDIA_URL') ) {
	define('MEDIA_URL', 					PUBLIC_URL . '/media');
}
if ( !defined('MEDIA_PATH') ) {
	define('MEDIA_PATH', 					realpath(PUBLIC_PATH . '/media'));
}

if ( !defined('UPLOADS_URL') ) {
	define('UPLOADS_URL', 					MEDIA_URL . '/uploads');
}
if ( !defined('UPLOADS_PATH') ) {
	define('UPLOADS_PATH', 					realpath(MEDIA_PATH . '/uploads'));
}

if ( !defined('IMAGES_URL') ) {
	define('IMAGES_URL', 					MEDIA_URL . '/images');
}
if ( !defined('IMAGES_PATH') ) {
	define('IMAGES_PATH', 					realpath(MEDIA_PATH . '/images'));
}

if ( !defined('THEMES_URL') ) {
	define('THEMES_URL', 					PUBLIC_URL . '/themes');
}
if ( !defined('THEMES_PATH') ) {
	define('THEMES_PATH', 					realpath(PUBLIC_PATH . '/themes'));
}

if ( !defined('HTMLPURIFIER_PATH') ) {
	define('HTMLPURIFIER_PATH', 			realpath(COMMON_PATH . '/htmlpurifier-4.0.0-lib'));
}

// Ensure library/ is on include_path
$include_paths = $include_paths_original = array();
if ( defined('ZEND_PATH') )
	$include_paths[] = ZEND_PATH;
//if ( defined('DOCTRINE_PATH') )
//	$include_paths[] = DOCTRINE_PATH;
$include_paths[] = BALPHP_PATH;
$include_paths[] = LIBRARY_PATH;
$include_paths_original = str_replace('.:/usr/local/zend/share/ZendFramework/library:', '', get_include_path());
$include_paths_original = array_diff(explode(':',$include_paths_original),$include_paths);
$include_paths = array_merge($include_paths, $include_paths_original);
$include_paths = implode(PATH_SEPARATOR, $include_paths);
set_include_path($include_paths);
unset($include_paths, $include_paths_original);

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
