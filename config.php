<?php
/**
 * Welcome to the config.php file of BalCMS.
 * This file is used to set our necessary basic configuration, mainly the application environment we are using.
 */

# ==========================
# Adjust Application Environments

# --------------------------
# Production Server
if (
	 	strpos($_SERVER['HTTP_HOST'], 'balupton.com') !== false
	|| 	strpos($_SERVER['HTTP_HOST'], 'balupton.com.s113264.gridserver.com') !== false
	||	$_SERVER['DOCUMENT_ROOT'] === '/nfs/c07/h02/mnt/113264/domains/balupton.com/html'
	|| 	$_SERVER['DOCUMENT_ROOT'] === '/home/113264/users/.home/domains/balupton.com/html'
	|| 	$_SERVER['DOCUMENT_ROOT'] === '/home/113264/domains/s113264.gridserver.com/html'
	|| 	$_SERVER['DOCUMENT_ROOT'] === '/home/113264/domains/balupton.com/html'
) {
	# Prepare
	$preview_host = 'balupton.com.s113264.gridserver.com';
	$live_host = 'balupton.com';

	# Apply
	define('APPLICATION_ENV', 				'production');
	$_SERVER['HTTP_HOST'] = 				$live_host;
}

# --------------------------
# Staging Server
elseif (
	 	strpos($_SERVER['HTTP_HOST'], 'staging.balupton.com') !== false
	||	strpos($_SERVER['HTTP_HOST'], 'staging.balupton.com.s113264.gridserver.com') !== false
	||	$_SERVER['DOCUMENT_ROOT'] === '/nfs/c07/h02/mnt/113264/domains/staging.balupton.com/html'
	|| 	$_SERVER['DOCUMENT_ROOT'] === '/home/113264/users/.home/domains/staging.balupton.com/html'
	|| 	$_SERVER['DOCUMENT_ROOT'] === '/home/113264/domains/staging.balupton.com/html'
) {
	# Prepare
	$preview_host = 'staging.balupton.com.s113264.gridserver.com';
	$live_host = 'staging.balupton.com';

	# Apply
	define('APPLICATION_ENV', 				'staging');
	$_SERVER['HTTP_HOST'] = 				$preview_host;
}

# --------------------------
# Testing Server
elseif (
		$_SERVER['DOCUMENT_ROOT'] === '/home/balupton/subdomains/testing.balupton.com'
	||  $_SERVER['SERVER_NAME'] === 'testing.balupton.com'
) {
	define('APPLICATION_ENV', 				'testing');
	$_SERVER['HTTP_HOST'] = 				'localhost';
}

# --------------------------
# Development Environment
elseif (
		strpos(strtolower($_SERVER['DOCUMENT_ROOT']), '/users/balupton/dropbox/server/public_html') !== false
) {
	define('APPLICATION_ENV', 				'development');
	$_SERVER['HTTP_HOST'] = 				'localhost';
}

# --------------------------
# Unconfigured Environment
else {
	throw new Exception('Unknown Project Location');
}

