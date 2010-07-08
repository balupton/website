<?php

# Prepare
error_reporting(E_ALL | E_STRICT);
ini_set('error_reporting', E_ALL | E_STRICT);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

# Prepare
define('APPLICATION_ROOT_PATH', 			realpath(dirname(__FILE__)));
if ( !isset($_SERVER) ) {
	$_SERVER = array();
}
if ( empty($_SERVER['DOCUMENT_ROOT']) ) {
	$_SERVER['DOCUMENT_ROOT'] = realpath(dirname(__FILE__).'/../../');
}
if ( empty($_SERVER['SCRIPT_FILENAME']) ) {
	$_SERVER['SCRIPT_FILENAME'] = realpath(__FILE__);
} else {
	$_SERVER['SCRIPT_FILENAME'] = realpath($_SERVER['SCRIPT_FILENAME']);
}

# Debug Secret
define('DEBUG_SECRET',						md5(APPLICATION_ROOT_PATH));

# Include paths
if ( in_array($_SERVER['DOCUMENT_ROOT'], array('/Users/balupton/Server/htdocs')) ) {
	# Development Environment
	define('APPLICATION_ENV', 				'development');
	define('ROOT_PATH', 					realpath($_SERVER['DOCUMENT_ROOT']));
	define('APPLICATION_PATH', 				realpath(APPLICATION_ROOT_PATH . '/application'));
	define('CONFIG_PATH', 					realpath(APPLICATION_PATH.'/config'));
	
	define('COMMON_PATH', 					realpath(ROOT_PATH.'/common'));
	define('DOCTRINE_PATH', 				realpath(COMMON_PATH.'/doctrine-1.2.2-lib'));
	define('DOCTRINE_EXTENSIONS_PATH', 		realpath(COMMON_PATH.'/doctrine-extensions'));
	define('ZEND_PATH', 					realpath(COMMON_PATH.'/zend-1.10.6-lib'));
	define('BALPHP_PATH', 					realpath(COMMON_PATH.'/balphp-trunk/lib'));
	
	define('CONFIG_APP_PATH', 				realpath(CONFIG_PATH.'/application.ini'));
	define('CONFIG_APP_PATHS', 				realpath(CONFIG_PATH.'/balcms/standard.ini')
												.PATH_SEPARATOR.
												realpath(CONFIG_PATH.'/balcms/balcms.ini')
											);
	define('ROOT_URL',						'http://localhost');
	define('BASE_URL', 						'/projects/balcms');
}
elseif ( strpos($_SERVER['HTTP_HOST'], 'balupton.com') !== false ) {
	# Production Server
	define('APPLICATION_ENV', 				!empty($_COOKIE['debug']) && $_COOKIE['debug']===DEBUG_SECRET ? 'staging' : 'production');
	define('ROOT_PATH', 					realpath($_SERVER['DOCUMENT_ROOT']));
	define('APPLICATION_PATH', 				realpath(APPLICATION_ROOT_PATH . '/application'));
	define('CONFIG_PATH', 					realpath(APPLICATION_PATH.'/config'));
	
	define('COMMON_PATH', 					realpath(ROOT_PATH.'/common'));
	define('DOCTRINE_PATH', 				realpath(COMMON_PATH.'/doctrine-1.2.2-lib'));
	define('DOCTRINE_EXTENSIONS_PATH', 		realpath(COMMON_PATH.'/doctrine-extensions'));
	define('ZEND_PATH', 					realpath(COMMON_PATH.'/zend-1.10.4-lib'));
	define('BALPHP_PATH', 					realpath(COMMON_PATH.'/balphp-trunk/lib'));
	
	define('CONFIG_APP_PATH', 				realpath(CONFIG_PATH.'/application.ini'));
	define('ROOT_URL',						'http://www.balupton.com');
}
else {
	throw new Exception('Unknown Project Location');
}


# --------------------------

# Boostrap
require_once implode(DIRECTORY_SEPARATOR, array(APPLICATION_ROOT_PATH,'scripts','bootstrap.php'));
