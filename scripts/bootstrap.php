<?php

# --------------------------
# Prepare Core

# Check
if ( !isset($prepare) || $prepare ) {
	
	# Load in Preparation
	require_once implode(DIRECTORY_SEPARATOR, array(dirname(__FILE__),'bootstrap.prepare.php'));

	# Define the core paths
	if ( !defined('APPLICATION_ROOT_PATH') ) {
		define('APPLICATION_ROOT_PATH',				realpath(dirname(__FILE__).'/..'));
	}
	if ( !defined('APPLICATION_PATH') ) {
		define('APPLICATION_PATH',					APPLICATION_ROOT_PATH.'/application');
	}
	if ( !defined('CONFIG_CORE_PATH') ) {
		define('CONFIG_CORE_PATH',					APPLICATION_ROOT_PATH.'/application/config/core.yaml');
	}

	# Find the Yaml Parser
	if ( !defined('SFYAML_PATH') ) {
		$temp = 'SymfonyComponents/YAML';
		if ( is_dir(APPLICATION_ROOT_PATH.'/common/'.$temp) )
			define('SFYAML_PATH',				APPLICATION_ROOT_PATH.'/common/'.$temp);
		elseif ( is_dir(APPLICATION_ROOT_PATH.'/library/'.$temp) )
			define('SFYAML_PATH',				APPLICATION_ROOT_PATH.'/library/'.$temp);
		else
			throw new Exception('Could not find the sfYaml library.');
		unset($temp);
	}
	
	# Prepare the environment
	if ( !defined('APPLICATION_ENV') ) {
		define('APPLICATION_ENV',					'development');
	}
}


# --------------------------
# Load Zend Framework

# Check
if ( !isset($load) || $load ) {
	
	# --------------------------
	# Load the Core Configuration
	
	# Load the YAML Parser
	require_once(SFYAML_PATH.'/sfYamlParser.php');
	require_once(SFYAML_PATH.'/sfYaml.php');
	$Yaml = new sfYamlParser();
	
	# Include the core configuration
	$configuration = $Yaml->parse(file_get_contents(CONFIG_CORE_PATH));

	# Adjust for our Environment
	$configuration = $configuration[APPLICATION_ENV];

	# Apply our configuration
	foreach ( $configuration as $key => &$value ) {
		$value = preg_replace('/\\<\\?\\=([a-zA-Z_]+)\\?\\>/e','\\1',trim($value));
		define($key,$value);
	}

	# Apply include paths
	if ( !isset($include_paths) || $include_paths ) {
		$include_paths_original = explode(PATH_SEPARATOR,str_replace('.'.PATH_SEPARATOR.'/usr/local/zend/share/ZendFramework/library'.PATH_SEPARATOR, '', get_include_path()));
		$include_paths_new = explode(PATH_SEPARATOR,INCLUDE_PATHS);
		$include_paths_final = array_unique(array_merge($include_paths_new, $include_paths_original));
		$include_paths_final = implode(PATH_SEPARATOR, $include_paths_final);
		set_include_path($include_paths_final);
		unset($include_paths_original, $include_paths_new, $include_paths_final);
	}

	# Unset
	unset($configuration);

	# --------------------------
	# PHP Compatability Ensure

	# Fix Request URI
	if ( !empty($_SERVER['REDIRECT_URL']) ) {
		$_SERVER['REQUEST_URI'] = $_SERVER['REDIRECT_URL'];
	}

	# Fix magic quotes
	if ( !isset($fix_magic_quotes) || $fix_magic_quotes ) {
		require_once BALPHP_PATH.'/core/functions/_params.funcs.php';
		fix_magic_quotes();
	}


	# --------------------------
	# Library Includes

	# HTMLPurifier
	require_once(HTMLPURIFIER_PATH.'/HTMLPurifier.auto.php');
	require_once(HTMLPURIFIER_PATH.'/HTMLPurifier/Lexer/PH5P.php');

	# Zend Application
	require_once implode(DIRECTORY_SEPARATOR, array(ZEND_PATH,'Zend','Application.php'));
	
	# BalPHP Arrays - Used for YAML Code Below adjust_yaml_inheritance
	require_once(BALPHP_PATH.'/core/functions/_arrays.funcs.php');
	
	# --------------------------
	# Configure
	
	if ( !isset($ApplicationConfig) ) {
		# Prepare
		$config = ''; $config_files;

		# Fetch
		if ( strstr(CONFIG_FILE_PATH,PATH_SEPARATOR) ) {
			# We are wanting to load in multiple configuration files
			$config_files = explode(PATH_SEPARATOR,CONFIG_FILE_PATH);
		}
		else {
			# We just want to load in the sole file
			$config_files = array(CONFIG_FILE_PATH);
		}

		# Adjust
		foreach ( $config_files as $file ) {
			$config .= "\n".file_get_contents($file);
		}

		# Parse
		$config_tmp_file = tempnam('/tmp', 'config_tmp_file');
		file_put_contents($config_tmp_file, $config);
		$configuration = sfYaml::load($config_tmp_file);
		unlink($config_tmp_file);
		
		# Extract
		$configuration = $configuration[APPLICATION_ENV];
		
		# Adjust
		$configuration = adjust_yaml_inheritance($configuration);
		
		# Prepare Zend Config
		require('Zend/Config.php');
		require('Zend/Config/Exception.php');

		# Create Zend Config
		$ApplicationConfig = new Zend_Config($configuration);
	}


	# --------------------------
	# Initialise

	# Create Application
	if ( !isset($Application) ) {
		$Application = new Zend_Application(
		    APPLICATION_ENV,
		    $ApplicationConfig
		);
	}

	# Bootstrap
	if ( !isset($bootstrap) || $bootstrap ) {
		$Application->bootstrap();
	}

	# Run
	if ( !isset($run) || $run ) {
		try {
			# Run Zend Framework
			$Application->run();
		
			# Check for Errors
			$FrontController = Zend_Controller_Front::getInstance();
			$Response = $FrontController->getResponse();
			if ( $Response && !$Response->getBody() && $Response->isException() ) {
				$Exceptions = true;
			}
			unset($Response);
			unset($FrontController);
		}
		catch ( Exception $Exception ) {
			# An Error Occured
			$Exceptions = array($Exception);
		}
	}

	# Error Handling
	if ( !empty($Exceptions) ) {
		# An Error Occured
		if ( class_exists('Bal_Exceptor') && class_exists('Bal_Log') ) {
			# Log Exceptions
			if ( is_traversable($Exceptions) ) {
				foreach ( $Exceptions as $Exception ) {
					# Log Exceptions
					$Exceptor = new Bal_Exceptor($Exception);
					$Exceptor->log();
				}
			}
		
			# Try to Dispatch the Error Controller
			try {
				# Fetch
				$FrontController = Zend_Controller_Front::getInstance();
				//$Response = $FrontController->getResponse();
				//$Request = $FrontController->getRequest();
			
				# Apply
				//$Request->setDispatched(false);
				//$Response->setException(new Exception('An uncaught error has occurred'));
			
				# Dispatch
				$FrontController->dispatch($Request, $Response);
			}
			# Dispatching the Error Controller Failed
			catch ( Exception $Exception ) {
				# Log Exception
				$Exceptor = new Bal_Exceptor($Exception);
				$Exceptor->log();
	
				# Display a Error Page
				echo
					'<!DOCTYPE html><html><head><title>An error has occurred.</title></head><body>'.
						'<h1>An error has occurred.</h1>'.
	
						'<h2>Error Log</h2>'.
						Bal_Log::getInstance()->render().
	
						'<h2>Error Details</h2>'.
						'<pre>'.
							'$_GET = '."\n".
							var_export($_GET,true)."\n\n".
		
							'$_POST = '."\n".
							var_export($_POST,true)."\n\n".
		
							'$_SERVER = '."\n".
							var_export($_SERVER,true)."\n\n".
		
							'$_ENV = '."\n".
							var_export($_SERVER,true)."\n\n".
		
							'php.include_path = '."\n".
							var_export(get_include_path(),true)."\n\n".
						'</pre>'.
	
					'</body></html>';
			}
		}
		else {
			echo
				'<!DOCTYPE html><html><head><title>An error has occurred.</title></head><body>'.
					'<h1>An error has occurred.</h1>'.
				'</body></html>';
		}
	}

}