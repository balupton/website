<?php
/**
 * Welcome to the config.php file of BalCMS.
 * This file is used to set our necessary basic configuration, mainly the application environment we are using.
 */

# --------------------------
# Adjust Application Environments

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
