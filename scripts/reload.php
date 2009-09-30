<?php
// Load
$run = $bootstrap = false;
require_once(dirname(__FILE__).'/../public/index.php');

// Run
$Application->bootstrap('doctrine');

$doctrineOptions = $Application->getOption('doctrine');
error_reporting(E_ALL);
ini_set('display_errors', 1);

Doctrine::dropDatabases();
Doctrine::createDatabases();
Doctrine::createTablesFromModels();
Doctrine::loadData($doctrineOptions['data_fixtures_path']);

die($doctrineOptions['data_fixtures_path']);