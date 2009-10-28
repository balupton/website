<?php
// Load
$run = $bootstrap = false;
require_once(dirname(__FILE__).'/../public/index.php');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Run
$Application->bootstrap('doctrine');

$doctrineConfig = $Application->getOption('doctrine');
$fixtures_path = $doctrineConfig['data_fixtures_path'];

if ( !empty($_GET['usedump']) ) {
	$fixtures_path = $doctrineConfig['data_dump_path'];
	echo 'Using Dump.'."<br/>\n";
}

if ( !empty($_GET['dump']) ) {
	$fixtures_path = $doctrineConfig['data_dump_path'];
	echo 'Dumping.'."<br/>\n";
	Doctrine::dumpData($fixtures_path.'/data.yml', false);
}

if ( !empty($_GET['drop']) ) {
	echo 'Dropping.'."<br/>\n";
	Doctrine::dropDatabases();
	Doctrine::createDatabases();
	Doctrine::createTablesFromModels();
	Doctrine::loadData($fixtures_path);
}

die($fixtures_path);