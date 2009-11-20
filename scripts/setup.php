<?php
// Load
if ( empty($Application) ) {
	// Bootstrap
	$run = $bootstrap = false;
	require_once(dirname(__FILE__).'/../public/index.php');
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
}
header('Content-Type: text/plain');

// Load
$Application->bootstrap('doctrine');
$Application->bootstrap('balphp');
$Application->bootstrap('app');

// Get Config
$config = array();
$config['bal'] = $Application->getOption('bal');

// Check Secret
if ( $_GET['secret'] !== $config['bal']['install']['secret'] ) {
	throw new Zend_Exception('Trying to install without the secret! Did we not tell you? Maybe it is for good reason!');
}

// Get Config
$config['data'] = $Application->getOption('data');


// Install
if ( !empty($_GET['install']) ) {
	// Install All
	$install = array('createindex', 'reload', 'optimiseindex');
	echo 'Setup: install ['.implode($install,',').']'."<br/>\n";
	foreach ( $install as $param ) {
		$_GET[$param] = true;
	}
}

// Lucene
$data_lucence = !empty($config['data']['index_path']);

// Lucence: createindex
if ( !empty($_GET['createindex']) && $data_lucence ) {
	echo 'Lucene: createindex ['.$config['data']['index_path'].']'."<br/>\n";
	$Index = Zend_Search_Lucene::create($config['data']['index_path']);
	Zend_Registry::set('Index', $Index);
} else {
	$Application->bootstrap('index');
}


// Doctrine
$data_path_to_use = $config['data']['fixtures_path'];

// Doctrine: usedump
if ( !empty($_GET['usedump']) ) {
	$data_path_to_use = $config['data']['dump_path'];
	echo 'Doctrine: usedump ['.$data_path_to_use.']'."<br/>\n";
}

// Doctrine: makedump
if ( !empty($_GET['makedump']) ) {
	echo 'Doctrine: makedump ['.$config['data']['dump_path'].']'."<br/>\n";
	Doctrine::dumpData($config['data']['dump_path'].'/data.yml', false);
}

// Doctrine: reload
if ( !empty($_GET['reload']) ) {
	echo 'Doctrine: reload ['.$data_path_to_use.']'."<br/>\n";
	Doctrine::dropDatabases();
	Doctrine::createDatabases();
	if ( APPLICATION_ENV === 'development' )
	Doctrine::generateModelsFromYaml($config['data']['yaml_schema_path'],$config['data']['models_path']);
	Doctrine::createTablesFromModels();
	Doctrine::loadData($data_path_to_use);
}

// Lucene: index
if ( !empty($_GET['optimiseindex']) && $data_lucence ) {
	echo 'Lucene: optimiseindex ['.$config['data']['index_path'].']'."<br/>\n";
	$Index = Zend_Registry::get('Index');
	$Index->optimize();
}


// Done
echo 'Completed.';
die;