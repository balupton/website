<?php
/**
 * Welcome to the config.php file of BalCMS.
 * This file is used to set our necessary basic configuration, mainly the application environment we are using.
 */

# --------------------------
# Adjust Application Environments

# Include paths
if (
	strpos(strtolower($_SERVER['DOCUMENT_ROOT']), '/users/balupton/server/public_html') !== false
) {
	# Development Environment
	define('APPLICATION_ENV', 				'development');
	define('COMMON_PATH', 					'/Users/balupton/Server/public_html/common');
}
elseif ( $_SERVER['DOCUMENT_ROOT'] === '/home/balupton/subdomains/testing.balupton.com' ||  $_SERVER['SERVER_NAME'] === 'testing.balupton.com' ) {
	# Testing Server
	define('APPLICATION_ENV', 				'testing');
	define('COMMON_PATH', 					'/home/balupton/common');
}
elseif ( $_SERVER['DOCUMENT_ROOT'] === '/home/balupton/subdomains/staging.balupton.com' ||  $_SERVER['SERVER_NAME'] === 'staging.balupton.com' ) {
	# Staging Server
	define('APPLICATION_ENV', 				'staging');
	define('COMMON_PATH', 					'/home/balupton/common');
}
elseif ( $_SERVER['DOCUMENT_ROOT'] === '/home/balupton/public_html' || strpos($_SERVER['HTTP_HOST'], 'balupton.com') !== false ) {
	# Production Server
	define('APPLICATION_ENV', 				'production');
	define('COMMON_PATH', 					'/home/balupton/common');
}
elseif ( true ) {
	# Uncofigured Environment
	define('APPLICATION_ENV', 				'development');
}
else {
	# Uncofigured Environment
	throw new Exception('Unknown Project Location');
}
