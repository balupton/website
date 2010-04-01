<?php
# Init
$bootstrap = $run = false;
require_once (dirname(__FILE__) . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'index.php');
$Application->bootstrap('balphp');

# CSSScaffold
$config = array();
$config['document_root'] = ROOT_PATH;
$config['system'] = COMMON_PATH.DIRECTORY_SEPARATOR.'csscaffold'.DIRECTORY_SEPARATOR;
$config['urlpath'] = PUBLIC_PATH;
require_once ($config['system'].'index.php');
