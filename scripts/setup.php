<?php
# Prepare Reporting
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

# Load
if ( empty($Application) ) {
	# Bootstrap
	require_once(__DIR__.'/bootstrapr.php');
	$Bootstrapr->bootstrap('zend-application');
}

# Bootstrap
$Application->bootstrap('ScriptSetup');

# App
Bal_App::getInstance($Application)->setup();
die;
