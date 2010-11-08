<?php
# Init
$bootstrapr = str_replace('public/styles/scaffold.php','',$_SERVER['SCRIPT_FILENAME']).'/scripts/bootstrapr.php';
require_once($bootstrapr);
$Bootstrapr->bootstrap('application-configuration');

/**
 * The environment class helps us handle errors
 * and autoloading of classes. It's not required
 * to make Scaffold function, but makes it a bit
 * nicer to use.
 */
require_once SCAFFOLD_PATH.'/lib/Scaffold/Environment.php';

/**
 * Set timezone, just in case it isn't set. PHP 5.3+ 
 * throws a tantrum if you try and use time() without
 * this being set.
 */
date_default_timezone_set('GMT');

/**
 * Automatically load any Scaffold Classes
 */
Scaffold_Environment::auto_load();

/**
 * Let Scaffold handle errors
 */
Scaffold_Environment::handle_errors();

/** 
 * Set the view to use for errors and exceptions
 */
Scaffold_Environment::set_view(realpath(SCAFFOLD_PATH.'/views/error.php'));

# Scaffold Config
$config = $GLOBALS['ApplicationConfiguration']['compiler']['scaffold']['config'];

# The container creates Scaffold objects
$Container = Scaffold_Container::getInstance(SCAFFOLD_PATH,$config);

# This is where the magic happens
$Scaffold = $Container->build();

# Compile
$Source = $Scaffold->getSource(null, $config);

// Compiles the source object
$Source = $Scaffold->compile($Source);

// Use the result to render it to the browser. Hooray!
$Scaffold->render($Source);
