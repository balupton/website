<?php
# Prepare Reporting
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

# Load
if ( empty($Application) ) {
	# Bootstrap
	$run = $bootstrap = false;
	$root_dir = '';
	if ( !empty($_SERVER['PWD']) ) {
		$root_dir = preg_replace('/scripts\/?.*$/', '', $_SERVER['PWD']);
	} else {
		$root_dir = preg_replace('/scripts\/?.*$/', '', $_SERVER['SCRIPT_FILENAME']);
	}
	require_once ($root_dir.DIRECTORY_SEPARATOR.'index.php');
}

# Bootstrap
$Application->bootstrap('ScriptSetup');

# App
Bal_App::getInstance($Application)->setup();
die;
