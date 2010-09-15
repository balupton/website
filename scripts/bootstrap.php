<?php


# --------------------------

# Defines
if ( !defined('APPLICATION_ENV') ) {
	define('APPLICATION_ENV', 				(getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'development'));
}
if ( !defined('APPLICATION_ROOT_PATH') ) {
	define('APPLICATION_ROOT_PATH', 		realpath(APPLICATION_PATH.'/..'));
}
if ( !defined('CONFIG_PATH') ) {
	define('CONFIG_PATH', 					realpath(APPLICATION_PATH.'/config'));
}
if ( !defined('MODELS_PATH') ) {
	define('MODELS_PATH', 					realpath(APPLICATION_PATH.'/models'));
}
if ( !defined('CONFIG_APP_PATH') ) {
	define('CONFIG_APP_PATH', 				realpath(CONFIG_PATH.'/application.ini'));
}
if ( !defined('LIBRARY_PATH') ) {
	define('LIBRARY_PATH', 					realpath(APPLICATION_ROOT_PATH.'/library'));
}
if ( !defined('IL8N_PATH') ) {
	define('IL8N_PATH', 					realpath(APPLICATION_ROOT_PATH.'/il8n'));
}
if ( !defined('MODULES_PATH') ) {
	define('MODULES_PATH', 					realpath(APPLICATION_PATH.'/modules'));
}
if ( !defined('DEBUG_MODE') ) {
	define('DEBUG_MODE',					(
			'development' === APPLICATION_ENV || 'testing' === APPLICATION_ENV ||
			(!empty($_COOKIE['debug']) && $_COOKIE['debug'] === DEBUG_SECRET)
		)	? 1
			: 0
	);
}

# --------------------------
		
if ( !defined('BASE_PATH') ) {
	define('BASE_PATH', 					APPLICATION_ROOT_PATH);
}
if ( !defined('BASE_URL') ) {
	define('BASE_URL', 						'');
}
	
if ( !defined('PUBLIC_PATH') ) {
	define('PUBLIC_PATH', 					realpath(APPLICATION_ROOT_PATH.'/public'));
}
if ( !defined('PUBLIC_URL') ) {
	define('PUBLIC_URL', 					BASE_URL.'/public');
}

# --------------------------

if ( !defined('HTMLPURIFIER_PATH') ) {
	define('HTMLPURIFIER_PATH', 			realpath(COMMON_PATH . '/htmlpurifier-4.1.1-lib'));
}

# --------------------------

if ( !defined('DATA_PATH') ) {
	define('DATA_PATH', 					realpath(APPLICATION_PATH . '/data'));
}
if ( !defined('LOGS_PATH') ) {
	define('LOGS_PATH', 					realpath(DATA_PATH . '/logs'));
}

# --------------------------

if ( !defined('MEDIA_URL') ) {
	define('MEDIA_URL', 					PUBLIC_URL . '/media');
}
if ( !defined('MEDIA_PATH') ) {
	define('MEDIA_PATH', 					realpath(PUBLIC_PATH . '/media'));
}

if ( !defined('DELETED_URL') ) {
	define('DELETED_URL', 					MEDIA_URL . '/deleted');
}
if ( !defined('DELETED_PATH') ) {
	define('DELETED_PATH', 					realpath(MEDIA_PATH . '/deleted'));
}

if ( !defined('IMAGES_URL') ) {
	define('IMAGES_URL', 					MEDIA_URL . '/images');
}
if ( !defined('IMAGES_PATH') ) {
	define('IMAGES_PATH', 					realpath(MEDIA_PATH . '/images'));
}

if ( !defined('INVOICES_URL') ) {
	define('INVOICES_URL', 					MEDIA_URL . '/invoices');
}
if ( !defined('INVOICES_PATH') ) {
	define('INVOICES_PATH', 				realpath(MEDIA_PATH . '/invoices'));
}

if ( !defined('TEMPLATES_URL') ) {
	define('TEMPLATES_URL', 				PUBLIC_URL . '/templates');
}
if ( !defined('TEMPLATES_PATH') ) {
	define('TEMPLATES_PATH', 				realpath(PUBLIC_PATH . '/templates'));
}

if ( !defined('UPLOADS_URL') ) {
	define('UPLOADS_URL', 					MEDIA_URL . '/uploads');
}
if ( !defined('UPLOADS_PATH') ) {
	define('UPLOADS_PATH', 					realpath(MEDIA_PATH . '/uploads'));
}

if ( !defined('THEMES_URL') ) {
	define('THEMES_URL', 					PUBLIC_URL . '/themes');
}
if ( !defined('THEMES_PATH') ) {
	define('THEMES_PATH', 					realpath(PUBLIC_PATH . '/themes'));
}

if ( !defined('SCRIPTS_URL') ) {
	define('SCRIPTS_URL', 					ROOT_URL.BASE_URL . '/scripts');
}
if ( !defined('SCRIPTS_PATH') ) {
	define('SCRIPTS_PATH', 					realpath(BASE_PATH . '/scripts'));
}

# --------------------------

# Fix REQUEST_URI
if ( !empty($_SERVER['REDIRECT_URL']) ) {
	$_SERVER['REQUEST_URI'] = $_SERVER['REDIRECT_URL'];
}

# Fix magic quotes
if ( !isset($fix_magic_quotes) || $fix_magic_quotes ) {
	require_once BALPHP_PATH.'/core/functions/_params.funcs.php';
	fix_magic_quotes();
}

# --------------------------

# Ensure library/ is on include_path
if ( !isset($include_paths) ) {
	$include_paths = $include_paths_original = array();
	$include_paths[] = BALPHP_PATH;
	if ( defined('ZEND_PATH') )
		$include_paths[] = ZEND_PATH;
	//if ( defined('DOCTRINE_PATH') )
	//	$include_paths[] = DOCTRINE_PATH;
	$include_paths[] = LIBRARY_PATH;
	//$include_paths[] = BALPHP_PATH;
	$include_paths[] = MODELS_PATH;
	$include_paths_original = str_replace('.:/usr/local/zend/share/ZendFramework/library:', '', get_include_path());
	$include_paths_original = array_diff(explode(':',$include_paths_original),$include_paths);
	$include_paths = array_merge($include_paths, $include_paths_original);
	$include_paths = implode(PATH_SEPARATOR, $include_paths);
	set_include_path($include_paths);
	unset($include_paths, $include_paths_original);
}

# HTMLPurifier
if ( HTMLPURIFIER_PATH ) {
	require_once(HTMLPURIFIER_PATH.'/HTMLPurifier.auto.php');
	require_once(HTMLPURIFIER_PATH.'/HTMLPurifier/Lexer/PH5P.php');
}

# Zend Application
require_once implode(DIRECTORY_SEPARATOR, array(ZEND_PATH,'Zend','Application.php'));

# Check Permissions
if ( defined('CONFIG_APP_PATHS') ) {
	system('chmod -R 755 '.CONFIG_APP_PATH);
	$configs = explode(PATH_SEPARATOR,CONFIG_APP_PATHS);
	$conf = '';
	foreach ( $configs as $config ) {
		$conf .= ";; $config ;;\r\n".file_get_contents($config)."\r\n\r\n";
	}
	file_put_contents(CONFIG_APP_PATH,$conf);
	unset($configs, $conf);
}

# Create Application
if ( !isset($Application) ) {
	$Application = new Zend_Application(
	    APPLICATION_ENV,
	    CONFIG_APP_PATH
	);
}

# Bootstrap
if ( !isset($bootstrap) || $bootstrap )
$Application->bootstrap();

# Run
if ( !isset($run) || $run )
$Application->run();

# Check for Errors
if ( class_exists('Bal_App') ) {
	$Response = Bal_App::getResponse();
	if ( !$Response->getBody() ) {
		$exceptions = $Response->getException();
		foreach ( $exceptions as $Exception ) {
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
		echo
			'<!DOCTYPE html><html><head><title>An error has occurred.</title></head><body>'.
				'<h1>An error has occurred.</h1>'.
				
				'<h2>Error Log</h2>'.
				Bal_Log::getInstance()->render().
				
				'<h2>Error Details</h2>'.
				'<pre>'.
					'$_GET = '."\n"
					var_export($_GET,true)."\n\n".
					
					'$_POST = '."\n"
					var_export($_POST,true)."\n\n".
					
					'$_SERVER = '."\n"
					var_export($_SERVER,true)."\n\n".
				'</pre>'.
				
			'</body></html>';
	}
}