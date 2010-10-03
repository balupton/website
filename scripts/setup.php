<?php
# Load
if ( empty($GLOBALS['Application']) ) {
	# Bootstrap
	require_once(dirname(__FILE__).'/bootstrapr.php');
	$Bootstrapr->bootstrap('zend-application');
}

# Load
$GLOBALS['Application']->bootstrap('ScriptSetup');

# App
Bal_App::getInstance($Application)->setup();
die;
