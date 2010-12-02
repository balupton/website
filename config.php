<?php
/**
 * Welcome to the config.php file of BalCMS.
 * This file is used to set our necessary basic configuration, mainly the application environment we are using.
 */

# --------------------------
# Adjust Application Environments

# Include paths
if ( true ) {
	# Unconfigured Environment
	define('APPLICATION_ENV', 				'development'); // default
	define('COMMON_PATH', 					dirname(__FILE__).'/common'); // default
	$_SERVER['HTTP_HOST'] = 				'localhost'; // default
}
else {
	# Unconfigured Environment
	throw new Exception('Unknown Project Location');
}
