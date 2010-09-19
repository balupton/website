<?php
/**
 * Welcome to the Index.php file of BalCMS.
 * This file is used to set our necessary basic configuration, such as paths of our application!
 * If you are installing BalCMS for the first time, you'll want to edit the base_url of the
 * "Unconfigured Development Environment" to the url where you have install me.
 */

# Prepare
require_once implode(DIRECTORY_SEPARATOR, array(dirname(__FILE__),'scripts','bootstrap.prepare.php'));

# Include paths
if ( true ) {
	# Uncofigured Environment
	define('APPLICATION_ENV', 				'development');
}
elseif ( strpos($_SERVER['DOCUMENT_ROOT'], '/Users/balupton/Server/htdocs') !== false ) {
	# Development Environment
	define('APPLICATION_ENV', 				'development');
}
elseif ( $_SERVER['DOCUMENT_ROOT'] === '/home/balupton/subdomains/staging.balupton.com' ||  $_SERVER['SERVER_NAME'] === 'staging.balupton.com' ) {
	# Staging Server
	define('APPLICATION_ENV', 				'staging');
}
elseif ( $_SERVER['DOCUMENT_ROOT'] === '/home/balupton/public_html' || strpos($_SERVER['HTTP_HOST'], 'balupton.com') !== false ) {
	# Production Server
	define('APPLICATION_ENV', 				'production');
}
else {
	throw new Exception('Unknown Project Location');
}

# --------------------------

# Boostrap
require implode(DIRECTORY_SEPARATOR, array(APPLICATION_ROOT_PATH,'scripts','bootstrap.php'));
