<?php
# Init
$bootstrapr = str_replace('public/styles/csscaffold.php','',$_SERVER['SCRIPT_FILENAME']).'/scripts/bootstrapr.php';
require_once($bootstrapr);
$Bootstrapr->bootstrap('zend-application');
$Application->bootstrap('balphp');

# Scaffold
$config = array();
//$config['document_root'] = ROOT_PATH;
$config['system'] = COMMON_PATH.DIRECTORY_SEPARATOR.'csscaffold'.DIRECTORY_SEPARATOR;
$config['urlpath'] = PUBLIC_PATH;
require_once ($config['system'].'index.php');
