<?php
/**
 * Welcome to the config.php file of BalCMS.
 * This file is used to set our necessary basic configuration, mainly the application environment we are using.
 */

# --------------------------
# Adjust Application Environments

# Include paths
if ( strpos(strtolower($_SERVER['DOCUMENT_ROOT']), '/users/balupton/dropbox/server/public_html') !== false ) {
	# Development Environment
	define('APPLICATION_ENV', 				'development');
	$_SERVER['HTTP_HOST'] = 				'localhost';
}
elseif ( $_SERVER['DOCUMENT_ROOT'] === '/home/balupton/subdomains/testing.balupton.com' ||  $_SERVER['SERVER_NAME'] === 'testing.balupton.com' ) {
	# Testing Server
	define('APPLICATION_ENV', 				'testing');
	$_SERVER['HTTP_HOST'] = 				'localhost';
}
elseif ( $_SERVER['DOCUMENT_ROOT'] === '/home/balupton/subdomains/staging.balupton.com' ||  $_SERVER['SERVER_NAME'] === 'staging.balupton.com' ) {
	# Staging Server
	define('APPLICATION_ENV', 				'staging');
	$_SERVER['HTTP_HOST'] = 				'localhost';
}
elseif ( $_SERVER['DOCUMENT_ROOT'] === '/home/balupton/public_html' || strpos($_SERVER['HTTP_HOST'], 'balupton.com') !== false ) {
	# Production Server
	define('APPLICATION_ENV', 				'production');
	$_SERVER['HTTP_HOST'] = 				'balupton.com';
}
elseif ( $_SERVER['DOCUMENT_ROOT'] === '/nfs/c07/h02/mnt/113264/domains/balupton.com' || $_SERVER['DOCUMENT_ROOT'] === '/home/113264/domains/s113264.gridserver.com/html' || $_SERVER['DOCUMENT_ROOT'] === '/home/113264/domains/balupton.com/html' || strpos($_SERVER['HTTP_HOST'], 'balupton.com.s113264.gridserver.com') !== false ) {
	# Production Server
	define('APPLICATION_ENV', 				'production');
	$_SERVER['HTTP_HOST'] = 				'balupton.com.s113264.gridserver.com';
}
elseif ( true ) {
	# Uncofigured Environment
	define('APPLICATION_ENV', 				'development');
	$_SERVER['HTTP_HOST'] = 				'localhost';
}
else {
	# Uncofigured Environment
	throw new Exception('Unknown Project Location');
}