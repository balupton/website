<?php
// Prepare
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', 1);
	
// Load
if ( empty($Application) ) {
	// Bootstrap
	$run = $bootstrap = false;
	require_once(dirname(__FILE__).'/../index.php');
}
header('Content-Type: text/plain');

// Load
$Application->bootstrap('config');
$Application->bootstrap('doctrine');
$Application->bootstrap('balphp');
$Application->bootstrap('app');
$Application->bootstrap('balcms');

// Get Config
$applicationConfig = Zend_Registry::get('applicationConfig');

// Check Secret
if ( $_GET['secret'] !== $applicationConfig['bal']['setup']['secret'] ) {
	throw new Zend_Exception('Trying to setup without the secret! Did we not tell you? Maybe it is for good reason!');
}

// Get Config
$applicationConfig['data'] = $Application->getOption('data');


// Handle
$mode = !empty($_GET['mode']) ? $_GET['mode'] : null;
switch ( $mode ) {
	
	case 'install':
		$ensure = array('createindex', 'reload', 'optimiseindex', 'media');
		array_keys_ensure($_GET, $ensure, true);
		echo 'Setup: mode:install ['.implode(array_keys($_GET),',').']'."<br/>\n";
		break;
		
	case 'update':
		$ensure = array('optimiseindex');
		array_keys_ensure($_GET, $ensure, true);
		echo 'Setup: mode:update ['.implode(array_keys($_GET),',').']'."<br/>\n";
		break;
	
	case 'debug':
		$ensure = array('debug');
		array_keys_ensure($_GET, $ensure, true);
		echo 'Setup: mode:debug ['.implode(array_keys($_GET),',').']'."<br/>\n";
		break;
		
	default:
		echo 'Setup: mode:normal ['.implode(array_keys($_GET),',').']'."<br/>\n";
		break;
}


//Debug: debug
if ( !empty($_GET['debug'])) {
	echo 'Debug: debug enabled'."<br/>\n";
	setcookie('debug',DEBUG_SECRET,0,'/');
}


// Media: media
if ( !empty($_GET['media']) ) {
	echo 'Media: media'."<br/>\n";
	// Delete the contents of media dirs; uploads and images
	$images_path = IMAGES_PATH;
	$upload_path = UPLOADS_PATH;
	
	// Check
	if ( empty($images_path) ) {
		die('You must first create your media paths');
	}
	
	// Scan directories
	$scan = scan_dir($images_path,null,null,$images_path.'/')+scan_dir($upload_path,null,null,$upload_path.'/');
	
	// Wipe files
	foreach ( $scan as $file ) {
		echo 'Media: deleted file ['.$file.']'."<br/>\n";
		unlink($file);
	}
}


// Lucene
$data_lucence = !empty($applicationConfig['data']['index_path']);

// Lucence: createindex
if ( !empty($_GET['createindex']) && $data_lucence ) {
	echo 'Lucene: createindex ['.$applicationConfig['data']['index_path'].']'."<br/>\n";
	$Index = Zend_Search_Lucene::create($applicationConfig['data']['index_path']);
	Zend_Registry::set('Index', $Index);
} else {
	$Application->bootstrap('index');
}



// Doctrine
$data_path_to_use = $applicationConfig['data']['fixtures_path'];

// Doctrine: usedump
if ( !empty($_GET['usedump']) ) {
	$data_path_to_use = $applicationConfig['data']['dump_path'];
	echo 'Doctrine: usedump ['.$data_path_to_use.']'."<br/>\n";
}

// Doctrine: makedump
if ( !empty($_GET['makedump']) ) {
	echo 'Doctrine: makedump ['.$applicationConfig['data']['dump_path'].']'."<br/>\n";
	Doctrine::dumpData($applicationConfig['data']['dump_path'].'/data.yml', false);
}

// Doctrine: reload
if ( !empty($_GET['reload']) ) {
	echo 'Doctrine: reload ['.$data_path_to_use.']'."<br/>\n";
	Doctrine::dropDatabases();
	Doctrine::createDatabases();
	if ( APPLICATION_ENV === 'development' ) {
		# Importer
		$Import = new Doctrine_Import_Schema();
		$Import->setOptions(array(
		    'pearStyle' => true,
		    'baseClassesDirectory' => null,
		    'baseClassPrefix' => 'Base_',
		    'classPrefix' => '',
		    'classPrefixFiles' => false
		));
		$Import->importSchema($applicationConfig['data']['yaml_schema_path'], 'yml', $applicationConfig['data']['models_path']);
		##Doctrine::generateModelsFromYaml($applicationConfig['data']['yaml_schema_path'],$applicationConfig['data']['models_path']);
	    Doctrine::loadModels($applicationConfig['data']['models_path']);
	}
	Doctrine::createTablesFromModels();
	Doctrine::loadData($data_path_to_use);
}

// Lucene: index
if ( !empty($_GET['optimiseindex']) && $data_lucence ) {
	echo 'Lucene: optimiseindex ['.$applicationConfig['data']['index_path'].']'."<br/>\n";
	$Index = Zend_Registry::get('Index');
	$Index->optimize();
}


// Done
echo 'Completed.';
die;