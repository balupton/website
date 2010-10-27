<?php
# Init
$bootstrapr = str_replace('public/styles/csscaffold.php','',$_SERVER['SCRIPT_FILENAME']).'/scripts/bootstrapr.php';
require_once($bootstrapr);
$Bootstrapr->bootstrap('application-configuration');

# Scaffold Config
if ( !defined('SCAFFOLD_PRODUCTION') ) define('SCAFFOLD_PRODUCTION',PRODUCTION_MODE);
$config = $GLOBALS['ApplicationConfiguration']['compilers']['scaffold']['config'];
$options = array();

# Load Scaffold
require_once CSSCAFFOLD_PATH.'/index.php';
