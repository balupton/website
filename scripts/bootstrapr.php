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
		 * Get the Instance
		 */
		public static function getInstance ( ) {
			global $Bootstrapr;
			if ( empty($Bootstrapr) ) {
				$Bootstrapr = new Bootstrapr();
			}
			return $Bootstrapr;
		}
	
		/**
		 * Convenient logging to profile the bootstrap
		 */
		public static function log ( $file, $line = null, $class = null, $function = null, $args = null ) {
			if ( !defined('PROFILE_BOOTSTRAP') || !PROFILE_BOOTSTRAP ) return false;
			if ( $line === null ) {
				echo '<!--['.date('H:i:s:u').']:['.$file.']-->';
			}
			elseif ( $class === null ) {
				echo '<!--['.date('H:i:s:u').']:['.$file.':'.$line.']-->';
			}
			else {
				$vars = '';
				if ( !empty($args) && is_array($args) ) {
					foreach ( $args as $arg ) {
						if ( is_array($arg) ) {
							$vars .= 'Array('.count($arg).')';
						}
						elseif ( is_object($arg) ) {
							$vars .= get_class($arg).'()';
						}
						else {
							$vars .= var_export($arg,true);
						}
						$vars .= ', ';
					}
					$vars = substr($vars,0,-2);
				}
				echo
				'<!--'.
					'['.date('H:i:s:u').']:'.
					'['.
						($class?$class.'::':'').
						($function?$function.'(':'').
						$vars.
						($function?')':'').
					']:['.
						$file.':'.$line.
					']'.
				'-->'."\n";
			}
			return true;
		}
		
		/**
		 * Parse a YAML File
		 */
		public function parseYamlFile ( $file ) {
			return $this->parseYamlString(file_get_contents($file));
		}
		
		/**
		 * Ensure we have a valid YAML String
		 */
		public function ensureYamlString ( $contents ) {
			return str_replace("\t",'    ',$contents);
		}
		
		/**
		 * Parse a YAML String
		 */
		public function parseYamlString ( $contents ) {
			$contents = $this->ensureYamlString($contents);
			$Yaml = new sfYamlParser();
			return $Yaml->parse($contents);
		}
		
		/**
		 * Parse a YAML File with PHP Parsing
		 */
		public function loadYamlFile ( $file ) {
			return sfYaml::load($file);
		}
		
		/**
		 * Parse an Advanced Yaml File
		 * Includes Inheritance, Path Separators, and Compilation
		 */
		public function parseAdvancedYamlFile ( $file_path, $compiled_file_path, $inheritance = null ) {
			# Prepare
			$configuration = null;
			
			# Determine Configuration Files
			if ( is_array($file_path) ) {
				$config_files = $file_path;
			}
			elseif ( strstr($file_path,PATH_SEPARATOR) ) {
				# We are wanting to load in multiple configuration files
				$config_files = explode(PATH_SEPARATOR,$file_path);
			}
			else {
				# We just want to load in the sole file
				$config_files = array($file_path);
			}
			
			# Extract the filemtime
			$multi_filemtime = 0;
			foreach ( $config_files as $_file_path ) {
				$_filemtime = filemtime($_file_path);
				if ( !$multi_filemtime || $_filemtime < $multi_filemtime ) {
					$multi_filemtime = $_filemtime;
				}
			}
			
			# Include the core configuration
			if ( is_readable($compiled_file_path) && filemtime($compiled_file_path) > $multi_filemtime ) {
				$configuration = unserialize(file_get_contents($compiled_file_path));
			}
			
			# Include the core configuration (falling back on uncompiled if compiled didn't work)
			if ( !$configuration ) {
				$configuration_str = '';
				foreach ( $config_files as $_file_path ) {
					$configuration_str .= "\n".file_get_contents($_file_path);
				}
				$configuration = $this->parseYamlString($configuration_str);
				$this->ensurePath($compiled_file_path);
				file_put_contents($compiled_file_path, serialize($configuration));
			}
			
			# Extract for our Environment
			$configuration = $configuration[APPLICATION_ENV];
			
			# Adjust for Yaml Inheritance
			if ( $inheritance || ($inheritance === null && function_exists('adjust_yaml_inheritance')) ) {
				$configuration = adjust_yaml_inheritance($configuration);
			}
			
			# Return Configuration
			return $configuration;
		}
		
		/**
		 * Load an Advanced Yaml File
		 * Includes PHP Parsing, Inheritance, Path Separators and Compilation
		 */ 
		public function loadAdvancedYamlFile ( $file_path, $compiled_file_path, $temp_file_name = null, $inheritance = null ) {
			# Prepare
			$configuration = null;
			
			# Determine Temp File Name
			if ( empty($temp_file_name) ) {
				$temp_file_name = md5($file_path).'.yml';
			}
			
			# Determine Configuration Files
			if ( is_array($file_path) ) {
				$config_files = $file_path;
			}
			elseif ( strstr($file_path,PATH_SEPARATOR) ) {
				# We are wanting to load in multiple configuration files
				$config_files = explode(PATH_SEPARATOR,$file_path);
			}
			else {
				# We just want to load in the sole file
				$config_files = array($file_path);
			}

			# Extract the filemtime
			$multi_filemtime = 0;
			foreach ( $config_files as $_file_path ) {
				$_filemtime = filemtime($_file_path);
				if ( !$multi_filemtime || $_filemtime < $multi_filemtime ) {
					$multi_filemtime = $_filemtime;
				}
			}
			
			# Include the core configuration
			if ( is_readable($compiled_file_path) && filemtime($compiled_file_path) > $multi_filemtime ) {
				$configuration = unserialize(file_get_contents($compiled_file_path));
			}
			
			# Check if Compiled is Adequate
			if ( !$configuration ) {
				# Adjust
				$configuration_str = '';
				foreach ( $config_files as $_file_path ) {
					$configuration_str .= "\n".$this->ensureYamlString(file_get_contents($_file_path));
				}
				
				# Write to Temp
				$config_tmp_file = tempnam('/tmp', $temp_file_name);
				file_put_contents($config_tmp_file, $configuration_str);
				
				# Load Yaml (with PHP parsing)
				$configuration = $this->loadYamlFile($config_tmp_file);
				unlink($config_tmp_file);
				
				# Store
				$this->ensurePath($compiled_file_path);
				file_put_contents($compiled_file_path, serialize($configuration));
			}
			
			# Extract for our Environment
			$configuration = $configuration[APPLICATION_ENV];
			
			# Adjust for Yaml Inheritance
			if ( $inheritance || ($inheritance === null && function_exists('adjust_yaml_inheritance')) ) {
				$configuration = adjust_yaml_inheritance($configuration);
			}
			
			# Return Configuration
			return $configuration;
		}
		
		/**
		 * Ensures all the necessary directories and the file exist for a DSN
		 */
		public function ensureDsnPath ( $dsn ) {
			$prefix = 'sqlite:///';
			if ( strpos($dsn, $prefix) === 0 ) {
				$path = substr($dsn,strlen($prefix));
				return $this->ensurePath($path);
			}
			return false;
		}
		
		/**
		 * Ensures the path is writeable
		 */
		public function ensureWriteable ( $path ) {
			`chmod -R 777 $path`;
		}
		
		/**
		 * Ensures all the necessary directories and the file exist
		 */
		public function ensurePath ( $path ) {
			system('mkdir -p '.dirname($path));
			touch($path);
			return true;
		}
		
		/**
		 * Returns the first readable file from an array
		 */
		public function firstReadableFile(array $files){
			foreach ( $files as $file ) {
				if ( is_readable($file) ) {
					return $file;
				}
			}
			return false;
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
				$_SERVER['DOCUMENT_ROOT'] = preg_replace('/^(.+?)(public_html|www|htdocs)(.*)/i', '$1$2', realpath(dirname(__FILE__).'/..'));
				// $root_dir = preg_replace('/scripts\/?.*$/', '', $_SERVER['PWD']);
				// $root_dir = preg_replace('/scripts\/?.*$/', '', $_SERVER['SCRIPT_FILENAME']);
			}
			$_SERVER['DOCUMENT_ROOT'] = realpath($_SERVER['DOCUMENT_ROOT']);

			# Script Filename
			if ( empty($_SERVER['SCRIPT_FILENAME']) ) {
				$_SERVER['SCRIPT_FILENAME']		= $_SERVER['DOCUMENT_ROOT'].'/index.php';
			} else {
				$_SERVER['SCRIPT_FILENAME']		= realpath($_SERVER['SCRIPT_FILENAME']);
			}
			$_SERVER['SCRIPT_FILENAME'] = realpath($_SERVER['SCRIPT_FILENAME']);
			
			# Server Port
			if ( empty($_SERVER['SERVER_PORT']) ) {
				$_SERVER['SERVER_PORT'] = 80;
			}
			
			# Server Port
			if ( empty($_SERVER['SERVER_ADDR']) ) {
				$_SERVER['SERVER_ADDR'] = 'localhost';
			}
			
			# Script Uri
			if ( empty($_SERVER['REQUEST_URI']) ) {
				// We are in a CLI
				$_SERVER['REQUEST_URI'] = str_replace(
					$_SERVER['DOCUMENT_ROOT'],
					'',
					$_SERVER['SCRIPT_FILENAME']
				);
			}
			
			# Hostname
			if ( empty($_SERVER['HOSTNAME']) ) {
				$_SERVER['HOSTNAME'] 			= '';
			}
			
			# CLI
			if ( !isset($_SERVER['CLI']) ) {
				$_SERVER['CLI'] = empty($_SERVER['HTTP_USER_AGENT']) && empty($_SERVER['HTTP_HOST']);
			}
			
			# Server Name
			if ( empty($_SERVER['SERVER_NAME']) ) {
				// Fallback onto HTTP_HOST
				if ( empty($_SERVER['HTTP_HOST']) ) {
					// We are running in a CLI environment
					// The HTTP_HOST should be defined in the config.php
					$_SERVER['HTTP_HOST'] = 'localhost';
				}
				// Apply ensured HTTP_HOST to SERVER_NAME
				$_SERVER['SERVER_NAME'] = $_SERVER['HTTP_HOST'];
			}

			# HTTP Host
			if ( empty($_SERVER['HTTP_HOST']) ) {
				// Fallback onto SERVER_NAME (which falls back onto us)
				$_SERVER['HTTP_HOST'] = $_SERVER['SERVER_NAME'];
			}

			# PHP_SELF
			if ( empty($_SERVER['PHP_SELF']) ) {
				$_SERVER['PHP_SELF'] = $_SERVER['REQUEST_URI'];
			}
			
			# Request URI
			if ( empty($_SERVER['REQUEST_URI']) && !empty($_SERVER['REDIRECT_URL']) ) {
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
		
			# Prepare the environment
			if ( !defined('APPLICATION_ENV') ) {
				define('APPLICATION_ENV',					'development');
			}
			
			# Define the core paths
			if ( !defined('APPLICATION_ROOT_PATH') ) {
				define('APPLICATION_ROOT_PATH',				realpath(dirname(__FILE__).'/..'));
			}
			if ( !defined('APPLICATION_PATH') ) {
				define('APPLICATION_PATH',					APPLICATION_ROOT_PATH.'/application');
			}
			if ( !defined('CONFIG_CORE_PATH') ) {
				define('CONFIG_CORE_PATH',					APPLICATION_ROOT_PATH.'/application/config/default/core.yml'.
															PATH_SEPARATOR.
															APPLICATION_ROOT_PATH.'/application/config/core.yml' );
			}
			if ( !defined('CONFIG_CORE_COMPILED_PATH') ) {
				define('CONFIG_CORE_COMPILED_PATH',			APPLICATION_ROOT_PATH.'/application/config/compiled/core.data');
			}
			if ( !defined('DOCUMENT_ROOT') ) {
				define('DOCUMENT_ROOT',						$_SERVER['DOCUMENT_ROOT']);
			}
			if ( !defined('HTTP_HOST') ) {
				define('HTTP_HOST',							$_SERVER['HTTP_HOST']);
			}
			if ( !defined('COMMON_PATH') ) {
				define('COMMON_PATH',						APPLICATION_ROOT_PATH.'/common');
			}
			if ( !defined('LIBRARY_PATH') ) {
				define('LIBRARY_PATH',						APPLICATION_ROOT_PATH.'/library');
			}
			
			# Find the Yaml Parser
			if ( !defined('SFYAML_PATH') ) {
				$paths = array('SymfonyComponents/YAML/lib','SymfonyComponents/YAML');
				$rootpaths = array('SymfonyComponents/YAML','SymfonyComponents/YAML');
				$subpaths = array('', COMMON_PATH.'/', LIBRARY_PATH.'/');
				
				foreach ( $paths as $key => $path ) {
					foreach ( $subpaths as $subpath ) {
						$fullpath = $subpath.$path;
						$rootpath = $subpath.$rootpaths[$key];
						if ( is_dir($fullpath) ) {
							define('SFYAML_PATH', $fullpath);
							define('SFYAML_ROOT_PATH', $rootpath);
							break 2;
						}
					}
				}
				
				if ( !defined('SFYAML_PATH') ) {
					define('SFYAML_ROOT_PATH', 	COMMON_PATH.'/SymfonyComponents/YAML');
					define('SFYAML_PATH', 		SFYAML_ROOT_PATH.'/lib');
				}
				
				unset($paths); unset($subpaths); unset($fullpath); unset($key);
			}
	
		}
	
		/**
		 * Load the Core Configuration
		 * Will load the config into Constant Variables
		 */
		private function _initConfiguration ( ) {
			# Prepare
			$this->bootstrap('environment');
			$configuration = null;
			
			# Check for sfYaml
			if ( !defined('SFYAML_PATH') || !is_dir(SFYAML_PATH) ) {
				throw new Exception('Could not find the sfYaml library.');
			}
				
			# Load the YAML Parser
			require_once(SFYAML_PATH.'/sfYamlParser.php');
			require_once(SFYAML_PATH.'/sfYaml.php');
			
			# Parse Advanced Yaml File
			$configuration = $this->parseAdvancedYamlFile(CONFIG_CORE_PATH, CONFIG_CORE_COMPILED_PATH);
			
			# Adjust our configuration
			if ( trim($configuration['BASE_URL']) === 'auto' ) {
				# We should autodetect the base url
				$relative_path = str_replace('\\','/',str_replace(DOCUMENT_ROOT, '', APPLICATION_ROOT_PATH));
				$configuration['BASE_URL'] = $relative_path;
				unset($relative_path);
			}
			if ( !defined('DEBUG_MODE') && trim($configuration['DEBUG_MODE']) === 'auto' ) {
				define('DEBUG_MODE',		APPLICATION_ENV === 'development');
				unset($configuration['DEBUG_MODE']);
			}
			if ( !defined('PRODUCTION_MODE') && trim($configuration['PRODUCTION_MODE']) === 'auto' ) {
				define('PRODUCTION_MODE',	DEBUG_MODE);
				unset($configuration['PRODUCTION_MODE']);
			}
			
			# Apply Our Configuration
			foreach ( $configuration as $key => &$value ) {
				$value = preg_replace('/\s/m', '', $value); // remove excess whitespace (tabs and newlines)
				$value = preg_replace('/\\<\\?\\=([a-zA-Z0-9_()]+)\\?\\>/e','\\1',$value); // parse constants
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
			
			# BalPHP Arrays - Used for YAML Code Below adjust_yaml_inheritance
			require_once(BALPHP_PATH.'/core/functions/_arrays.funcs.php');
		}
		
		/**
		 * Load our Application Configuration
		 */
		private function _initApplicationConfiguration ( ) {
			# Prepare
			$this->bootstrap('compatibility');
			global $ApplicationConfiguration;
			$configuration_str = ''; $config_files = $configuration = null;
			
			# Load Yaml Configuration File
			$configuration = $this->loadAdvancedYamlFile(CONFIG_FILE_PATH, CONFIG_COMPILED_FILE_PATH, 'config_tmp_file');
			
			# Create Zend Config
			$ApplicationConfiguration = $configuration;
		}
		
		/**
		 * Initialise our Libraries needed for Zend Framework
		 */
		private function _initLibraries ( ) {
			# Prepare
			$this->bootstrap('application-configuration');
			
			# HTMLPurifier
			require_once(HTMLPURIFIER_PATH.'/HTMLPurifier.auto.php');
			require_once(HTMLPURIFIER_PATH.'/HTMLPurifier/Lexer/PH5P.php');

			# Zend Application
			require_once implode(DIRECTORY_SEPARATOR, array(ZEND_PATH,'Zend','Application.php'));
		}
	
		/**
		 * Load our Zend Framework Configuration
		 */
		private function _initZendConfig ( ) {
			# Prepare
			$this->bootstrap('libraries');
			global $ApplicationConfig, $ApplicationConfiguration;
			
			# Prepare Zend Config
			require('Zend/Config.php');
			require('Zend/Config/Exception.php');

			# Create Zend Config
			$ApplicationConfig = new Zend_Config($ApplicationConfiguration);
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
