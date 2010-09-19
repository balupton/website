<?php

# --------------------------
# Prepare Settings

# Error Handling
error_reporting(E_ALL | E_STRICT);
ini_set('error_reporting', E_ALL | E_STRICT);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

# --------------------------
# Prepare Environment

# Server
if ( !isset($_SERVER) ) {
	$_SERVER = array();
}

# Document Root
if ( empty($_SERVER['DOCUMENT_ROOT']) ) {
	$_SERVER['DOCUMENT_ROOT']		= realpath(dirname(__FILE__).'/..');
}

# Script Filename
if ( empty($_SERVER['SCRIPT_FILENAME']) ) {
	$_SERVER['SCRIPT_FILENAME']		= $_SERVER['DOCUMENT_ROOT'].'/index.php';
} else {
	$_SERVER['SCRIPT_FILENAME']		= realpath($_SERVER['SCRIPT_FILENAME']);
}

# Hostname
if ( empty($_SERVER['HOSTNAME']) ) {
	$_SERVER['HOSTNAME'] = '';
}

# Server Name
if ( empty($_SERVER['SERVER_NAME']) ) {
	$_SERVER['SERVER_NAME'] = empty($_SERVER['HTTP_HOST']) ? '' : $_SERVER['HTTP_HOST'];
}

# HTTP Host
if ( empty($_SERVER['HTTP_HOST']) ) {
	$_SERVER['HTTP_HOST'] = $_SERVER['SERVER_NAME'];
}
