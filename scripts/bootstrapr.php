<?php

# --------------------------
# Define Bootstrapr

if ( !class_exists('Bootstrapr') ) {
	class Bootstrapr {
	
		/**
		 * What has already been bootstrapped?
		 */
		private $bootstraped = array();
	
		/**
		 * Bootstrap an Item
		 */
		public function bootstrap ( $name ) {
			# Adjust
			$code = str_replace(' ','',ucwords(str_replace('-',' ',$name)));
		
			# Cache
			if ( !empty($this->bootstraped[$code]) ) {
				return true;
			}
			$this->bootstraped[$code] = true;
		
			# Fire
			$function = '_init'.$code;
			$this->$function();
		}
	
	
		/**
		 * Prepares Basic Error Reporting
		 */
		private function _initErrors ( ) {
			# Error Handling
			error_reporting(E_ALL | E_STRICT);
			ini_set('error_reporting', E_ALL | E_STRICT);
			ini_set('display_errors', 1);
			ini_set('display_startup_errors', 1);
		}
	
		/**
		 * Ensures Compatibility with the Server Variable
		 */
		private function _initServer ( ) {
			# Prepare
			$this->bootstrap('errors');
		
			# Server
			if ( !isset($_SERVER) ) {
				$_SERVER = array();
			}

			# Document Root
			if ( empty($_SERVER['DOCUMENT_ROOT']) ) {
				$_SERVER['DOCUMENT_ROOT']		= realpath(dirname(__FILE__).'/..');
				// $root_dir = preg_replace('/scripts\/?.*$/', '', $_SERVER['PWD']);
				// $root_dir = preg_replace('/scripts\/?.*$/', '', $_SERVER['SCRIPT_FILENAME']);
			}

			# Script Filename
			if ( empty($_SERVER['SCRIPT_FILENAME']) ) {
				$_SERVER['SCRIPT_FILENAME']		= $_SERVER['DOCUMENT_ROOT'].'/index.php';
			} else {
				$_SERVER['SCRIPT_FILENAME']		= realpath($_SERVER['SCRIPT_FILENAME']);
			}

			# Hostname
			if ( empty($_SERVER['HOSTNAME']) ) {
				$_SERVER['HOSTNAME'] = '';
			}
			
			# Server Name
			if ( empty($_SERVER['SERVER_NAME']) ) {
				$_SERVER['SERVER_NAME'] = empty($_SERVER['HTTP_HOST']) ? '' : $_SERVER['HTTP_HOST'];
			}

			# HTTP Host
			if ( empty($_SERVER['HTTP_HOST']) ) {
				$_SERVER['HTTP_HOST'] = $_SERVER['SERVER_NAME'];
			}

			# Request URI
			if ( !empty($_SERVER['REDIRECT_URL']) ) {
				$_SERVER['REQUEST_URI'] = $_SERVER['REDIRECT_URL'];
			}
		}
		
		/**
		 * Sets some core Zend Framework Environment Variables
		 */
		private function _initEnvironment () {
			# Prepare
			$this->bootstrap('server');
			
			# Load in the Application Environment File
			if ( is_file(dirname(__FILE__).'/../config.php') ) {
				require_once(dirname(__FILE__).'/../config.php');
			}
		
			# Define the core paths
			if ( !defined('APPLICATION_ROOT_PATH') ) {
				define('APPLICATION_ROOT_PATH',				realpath(dirname(__FILE__).'/..'));
			}
			if ( !defined('APPLICATION_PATH') ) {
				define('APPLICATION_PATH',					APPLICATION_ROOT_PATH.'/application');
			}
			if ( !defined('CONFIG_CORE_PATH') ) {
				define('CONFIG_CORE_PATH',					APPLICATION_ROOT_PATH.'/application/config/core.yml');
			}
			if ( !defined('DOCUMENT_ROOT') ) {
				define('DOCUMENT_ROOT',						$_SERVER['DOCUMENT_ROOT']);
			}
			if ( !defined('HTTP_HOST') ) {
				define('HTTP_HOST',						$_SERVER['HTTP_HOST']);
			}

			# Find the Yaml Parser
			if ( !defined('SFYAML_PATH') ) {
				$temp = 'SymfonyComponents/YAML';
				if ( defined('COMMON_PATH') && is_dir(COMMON_PATH.'/'.$temp) )
					define('SFYAML_PATH',				COMMON_PATH.'/'.$temp);
				if ( is_dir(APPLICATION_ROOT_PATH.'/common/'.$temp) )
					define('SFYAML_PATH',				APPLICATION_ROOT_PATH.'/common/'.$temp);
				elseif ( is_dir(APPLICATION_ROOT_PATH.'/library/'.$temp) )
					define('SFYAML_PATH',				APPLICATION_ROOT_PATH.'/library/'.$temp);
				unset($temp);
			}
	
			# Prepare the environment
			if ( !defined('APPLICATION_ENV') ) {
				define('APPLICATION_ENV',					'development');
			}
		}
	
		/**
		 * Load the Core Configuration
		 * Will load the config into Constant Variables
		 */
		private function _initConfiguration ( ) {
			# Prepare
			$this->bootstrap('environment');
			
			# Check for sfYaml
			if ( !defined('SFYAML_PATH') ) {
				throw new Exception('Could not find the sfYaml library.');
			}
				
			# Load the YAML Parser
			require_once(SFYAML_PATH.'/sfYamlParser.php');
			require_once(SFYAML_PATH.'/sfYaml.php');
			$Yaml = new sfYamlParser();
	
			# Include the core configuration
			$configuration = $Yaml->parse(file_get_contents(CONFIG_CORE_PATH));

			# Adjust for our Environment
			$configuration = $configuration[APPLICATION_ENV];
	
			# Adjust our configuration
			if ( trim($configuration['BASE_URL']) === 'auto' ) {
				# We should autodetect the base url
				$relative_path = str_replace('\\','/',str_replace(DOCUMENT_ROOT, '', APPLICATION_ROOT_PATH));
				$configuration['BASE_URL'] = $relative_path;
				unset($relative_path);
			}
	
			# Apply our configuration
			foreach ( $configuration as $key => &$value ) {
				$value = preg_replace('/\\<\\?\\=([a-zA-Z0-9_()]+)\\?\\>/e','\\1',trim($value));
				if ( !defined($key) )
					define($key,$value);
			}
		}
	
		/**
		 * Adjust our Include Paths
		 */
		private function _initIncludes ( ) {
			# Prepare
			$this->bootstrap('configuration');
			
			# Apply include paths
			$include_paths_original = explode(PATH_SEPARATOR,str_replace('.'.PATH_SEPARATOR.'/usr/local/zend/share/ZendFramework/library'.PATH_SEPARATOR, '', get_include_path()));
			$include_paths_new = explode(PATH_SEPARATOR,INCLUDE_PATHS);
			$include_paths_final = array_unique(array_merge($include_paths_new, $include_paths_original));
			$include_paths_final = implode(PATH_SEPARATOR, $include_paths_final);
			set_include_path($include_paths_final);
		}
	
		/**
		 * Resolve some compatibility differences
		 */
		private function _initCompatibility ( ) {
			# Prepare
			$this->bootstrap('includes');
		
			# Fix magic quotes
			if ( !isset($fix_magic_quotes) || $fix_magic_quotes ) {
				require_once BALPHP_PATH.'/core/functions/_params.funcs.php';
				fix_magic_quotes();
			}
		}
	
		/**
		 * Initialise our Libraries needed for Zend Framework
		 */
		private function _initLibraries ( ) {
			# Prepare
			$this->bootstrap('compatibility');
		
			# HTMLPurifier
			require_once(HTMLPURIFIER_PATH.'/HTMLPurifier.auto.php');
			require_once(HTMLPURIFIER_PATH.'/HTMLPurifier/Lexer/PH5P.php');

			# Zend Application
			require_once implode(DIRECTORY_SEPARATOR, array(ZEND_PATH,'Zend','Application.php'));
	
			# BalPHP Arrays - Used for YAML Code Below adjust_yaml_inheritance
			require_once(BALPHP_PATH.'/core/functions/_arrays.funcs.php');
		}
	
		/**
		 * Load our Zend Framework Configuration
		 */
		private function _initZendConfig ( ) {
			# Prepare
			$this->bootstrap('libraries');
			global $ApplicationConfig;
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
	
		/**
		 * Create our Zend Framework Application
		 */
		private function _initZendApplication ( ) {
			# Prepare
			$this->bootstrap('zend-config');
			global $ApplicationConfig, $Application;
		
			# Create Zend Zpplication
			$Application = new Zend_Application(
			    APPLICATION_ENV,
			    $ApplicationConfig
			);
		}
	
		/**
		 * Bootstrap our Zend Framework Application
		 */
		private function _initZendBootstrap ( ) {
			# Prepare
			$this->bootstrap('zend-application');
			global $Application;
		
			# Zend Bootstrap
			$Application->bootstrap();
		}
	
		/**
		 * Run our Zend Framework Application
		 */
		private function _initZendRun ( ) {
			# Prepare
			$this->bootstrap('zend-bootstrap');
			global $Exceptions, $Application;
		
			# Zend Run
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
	
		/**
		 * Handle any uncaught Zend Framework Exceptions
		 */
		private function _initZendExceptions ( ) {
			# Prepare
			$this->bootstrap('zend-run');
			global $Exceptions;
		
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
						//$FrontController->dispatch($Request, $Response);
						$FrontController->dispatch();
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
	
		/**
		 * Run the Zend Framework Application
		 */
		private function _initRun ( ) {
			# Prepare
			$this->bootstrap('zend-exceptions');
		}
	}
}

# --------------------------
# Create Bootstrapr

global $Bootstrapr;
if ( empty($Bootstrapr) ) {
	$Bootstrapr = new Bootstrapr();
}