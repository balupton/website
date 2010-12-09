<?php
# Load
if ( empty($GLOBALS['Application']) ) {
	# Bootstrap
	require_once(dirname(__FILE__).'/bootstrapr.php');
	$Bootstrapr = Bootstrapr::getInstance();
	$Bootstrapr->bootstrap('zend-application');
}

# Load
$GLOBALS['Application']->bootstrap('ScriptSetup');

# Prepare
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

# Prepare
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

# App
Bal_App::getInstance($Application)->setup();
die;
