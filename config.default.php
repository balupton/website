<?php
/**
 * Welcome to the config.php file of BalCMS.
 * This file is used to set our necessary basic configuration, mainly the application environment we are using.
 */

# --------------------------
# Adjust Application Environments

# Unconfigured Environment
if ( true ) {
	define('APPLICATION_ENV', 	'development'); // set the application environment
	$_SERVER['HTTP_HOST'] = 	'localhost'; // force in case we are runing in the CLI
}
# Example Environment
elseif (
	$_SERVER['DOCUMENT_ROOT'] === '/users/example/Sites'
	|| strpos($_SERVER['HTTP_HOST'], 'example.com') !== false
) {
	define('APPLICATION_ENV', 	'development'); // set the application environment
	$_SERVER['HTTP_HOST'] = 	'example.com'; // force in case we are runing in the CLI
}
# Unconfigured Environment
else {
	throw new Exception('Unknown Project Location');
}
