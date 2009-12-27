<?php
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap {

	/**
	 * Initialise our Locale
	 * @return
	 */
	protected function _initLocale ( ) {
		# Prepare
		$this->bootstrap('autoload');
		$this->bootstrap('balphp');
		
		# Locale
		$Locale = new Bal_Locale($this->getOption('locale'));
		
		# Done
		return true;
	}

	/**
	 * Initialise our Mail
	 * @return
	 */
	protected function _initMail ( ) {
		# Prepare
		$this->bootstrap('config');
		
		# Config
		$applicationConfig = Zend_Registry::get('applicationConfig');
		
		# Fetch
		$smtp_host = $applicationConfig['mail']['transport']['smtp']['host'];
		$smtp_config = $applicationConfig['mail']['transport']['smtp']['config'];
		if ( empty($smtp_config) )
			$smtp_config = array();
			
		# Apply
		$Transport = new Zend_Mail_Transport_Smtp($smtp_host, $smtp_config);
		Zend_Mail::setDefaultTransport($Transport);
		
		# Done
		return true;
	}

	/**
	 * Initialise our Log
	 * @return
	 */
	protected function _initLog ( ) {
		# Prepare
		$this->bootstrap('autoload');
		
		# Config
		$applicationConfig = Zend_Registry::get('applicationConfig');
		
		# Mail
		$mail = $applicationConfig['mail'];
		$Mail = new Zend_Mail();
		$Mail->setFrom($mail['from']['address'], $mail['from']['name']);
		$Mail->addTo($mail['log']['address'], $mail['log']['name']);
		
		# Create Log
		$Log = new Zend_Log();
		Zend_Registry::set('Log', $Log);
		
		# Create Writer: SysLog
		$Writer_Syslog = new Zend_Log_Writer_Syslog();
		$Log->addWriter($Writer_Syslog);
		
		# Create Writer: Email
		$Writer_Mail = new Zend_Log_Writer_Mail($Mail);
		$Writer_Mail->setSubjectPrependText('Error Log: mydance.com.au');
		//$Writer->addFilter(Zend_Log::WARN);
		$Log->addWriter($Writer_Mail);
		
		# Create Writer: Firebug
		if ( DEBUG_MODE ) {
			//$Writer_Firebug = new Zend_Log_Writer_Firebug();
		//$Log->addWriter($Writer_Firebug);
		}
		
		# Done
		return true;
	}

	/**
	 * Initialise our View
	 * @return
	 */
	protected function _initView ( ) {
		# Prepare
		$this->bootstrap('autoload');
		$this->bootstrap('config');
		
		# Config
		$applicationConfig = Zend_Registry::get('applicationConfig');
		
		# Initialize view
		$View = new Zend_View();
		$View->doctype('XHTML1_STRICT');
		$View->headTitle($applicationConfig['bal']['site']['title'])->setSeparator($applicationConfig['bal']['site']['separator']);
		$View->headMeta()->setHttpEquiv('Content-Type', 'text/html; charset=utf-8');
		
		# Add it to the ViewRenderer
		$ViewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper('ViewRenderer');
		$ViewRenderer->setView($View);
		
		# Done
		return $View;
	}

	/**
	 * Initialise our Presentation
	 * @return
	 */
	protected function _initPresentation ( ) {
		# Prepare
		$this->bootstrap('view');
		$this->bootstrap('config');
		$this->bootstrap('app');
		$View = $this->getResource('view');
		$applicationConfig = Zend_Registry::get('applicationConfig');
		
		# Layout
		$FrontController = Zend_Controller_Front::getInstance();
		$App = $FrontController->getPlugin('Bal_Controller_Plugin_App');
		$App->startMvc();
		
		# View Helpers
		$View->addHelperPath(BALPHP_PATH . '/Bal/View/Helper', 'Bal_View_Helper');
		
		# Done
		return true;
	}
	
	/**
	 * Initialise our balcms module
	 * @return
	 */
	protected function _initBalcms ( ) {
		# Prepare
		$this->bootstrap('presentation');
		$View = $this->getResource('view');
		$applicationConfig = Zend_Registry::get('applicationConfig');
		
		# View Helpers
		$View->addHelperPath(APPLICATION_PATH . '/modules/balcms/views/helpers', 'Balcms_View_Helper');
		$View->addScriptPath(APPLICATION_PATH . '/modules/balcms/views/scripts');
		
		# Widgets
		$View->getHelper('widget')->addWidgets($applicationConfig['bal']['widget']);
		
		# Done
		return true;
	}

	/**
	 * Initialise our routes/routing/router
	 * @return
	 */
	protected function _initRoutes ( ) {
		# Prepare
		$this->bootstrap('autoload');
		
		# Route
		$routeConfig = new Zend_Config_Ini(CONFIG_PATH . '/routes.ini', 'production');
		$FrontController = Zend_Controller_Front::getInstance();
		if ( defined('BASE_URL') ) {
			$FrontController->setBaseUrl(BASE_URL);
		} else {
			define('BASE_URL', rtrim($FrontController->getBaseUrl(), '/'));
		}
		$router = $FrontController->getRouter();
		$router->removeDefaultRoutes();
		
		$router->addConfig($routeConfig, 'routes');
		
		# Location
		# $resources = $this->getOption('resources');
		# $FrontController->addModuleDirectory($resources['frontController']['moduleDirectory']);
		

		# Done
		return true;
	}

	/**
	 * Initialise Zend's Autoloader, used for plugins etc
	 * +CU (Doctrine Forms)
	 * @return
	 */
	protected function _initAutoload ( ) {
		# Initialise Zend's Autoloader, used for plugins etc
		$Autoloader = Zend_Loader_Autoloader::getInstance();
		$Autoloader->registerNamespace('Bal_');
		
		# Action Controllers
		Zend_Controller_Action_HelperBroker::addPrefix('Bal_Controller_Action_Helper_');
		
		# Done
		return $Autoloader;
	}

	/**
	 * Initialise Lucence Index
	 * @return
	 */
	protected function _initIndex ( ) {
		# Prepare
		$this->bootstrap('app');
		
		# Config
		$applicationConfig = Zend_Registry::get('applicationConfig');
		
		# Check
		if ( empty($applicationConfig['data']['index_path']) ) {
			return true;
		}
		
		# Initialise
		$Index = Zend_Search_Lucene::create($applicationConfig['data']['index_path']);
		Zend_Registry::set('Index', $Index);
		
		# Done
		return true;
	}

	/**
	 * Initialise our Config
	 * @return array
	 */
	protected function _initConfig ( ) {
		# Prepare
		$this->bootstrap('autoload');
		
		# Load
		if ( !Zend_Registry::isRegistered('applicationConfig') ) {
			$applicationConfig = $this->getOptions();
			Zend_Registry::set('applicationConfig', $applicationConfig);
		}
		
		# Done
		return true;
	}

	/**
	 * Initialise our Defaults
	 * @return
	 */
	protected function _initDefaults ( ) {
		# Prepare
		$this->bootstrap('autoload');
		
		# Load Front Controller
		$FrontController = Zend_Controller_Front::getInstance();
		
		# Apply
		$FrontController->setDefaultControllerName('front')->setDefaultAction('index');
		
		# Error Handler
		$FrontController = Zend_Controller_Front::getInstance();
		$FrontController->registerPlugin(new Zend_Controller_Plugin_ErrorHandler(array('module' => 'default', 'controller' => 'error', 'action' => 'error')));
		
		# Module Specific Error Controllers
		# $FrontController->registerPlugin(new Bal_Controller_Plugin_ErrorControllerSelector());
		
		# Done
		return true;
	}

	protected function _initApp ( ) {
		# Prepare
		$this->bootstrap('autoload');
		$this->bootstrap('config');
		$this->bootstrap('routes');
		$this->bootstrap('doctrine');
		
		# Load
		$FrontController = Zend_Controller_Front::getInstance();
		
		# Register
		if ( !$FrontController->hasPlugin('Bal_Controller_Plugin_App') ) {
			
			# Create
			$App = new Bal_Controller_Plugin_App();
			
			# Configure
			$applicationConfig = $App->getConfig();
			$appConfig = empty($applicationConfig['bal']['app']) ? array() : $applicationConfig['bal']['app'];
			$App->mergeOptions($appConfig);
			
			# Register
			$FrontController->registerPlugin($App);
		}
		
		# Done
		return true;
	}

	/**
	 * Initialise our Doctrine ORM.
	 * Options: +VALIDATE_ALL
	 * @return
	 */
	protected function _initDoctrine ( ) {
		# Prepare
		$this->bootstrap('autoload');
		$this->bootstrap('config');
		
		# Config
		$applicationConfig = Zend_Registry::get('applicationConfig');
		$extensions_path = $applicationConfig['data']['extensions_path'];
		
		# Autoload
		require_once (DOCTRINE_PATH . '/Doctrine.php');
		$Autoloader = Zend_Loader_Autoloader::getInstance();
		$Autoloader->pushAutoloader(array('Doctrine', 'autoload'), 'Doctrine_');
		$Autoloader->pushAutoloader(array('Doctrine', 'modelsAutoload'));
		$Autoloader->pushAutoloader(array('Doctrine', 'extensionsAutoload'));
		$Autoloader->pushAutoloader(array('Doctrine', 'autoload'), 'sfYaml');
		
		# Apply Paths
		Doctrine_Core::setPath(DOCTRINE_PATH);
		Doctrine_Core::setModelsDirectory($applicationConfig['data']['models_path']);
		Doctrine_Core::setExtensionsPath($extensions_path);
		Doctrine_Core::setModelsDirectory($applicationConfig['data']['models_path']);
		
		# Get Manager
		$Manager = Doctrine_Manager::getInstance();
		
		# Apply Config
		$Manager->setAttribute(Doctrine::ATTR_PORTABILITY, Doctrine::PORTABILITY_EMPTY_TO_NULL | Doctrine::PORTABILITY_RTRIM);
		$Manager->setAttribute(Doctrine::ATTR_MODEL_LOADING, Doctrine::MODEL_LOADING_CONSERVATIVE);
		$Manager->setAttribute(Doctrine::ATTR_VALIDATE, Doctrine::VALIDATE_ALL);
		$Manager->setAttribute(Doctrine_Core::ATTR_USE_DQL_CALLBACKS, true);
		
		# Apply Extensions
		$Manager->registerExtension('Taggable');
		
		# Apply Listener
		$Manager->addRecordListener(new Bal_Doctrine_Record_Listener_Html(false));
		
		# Cache
		//$cacheConn = Doctrine_Manager::connection(new PDO('sqlite::memory:'));
		//$cacheDriver = new Doctrine_Cache_Db(array('connection' => $cacheConn,'tableName' => 'cache'));
		//$manager->setAttribute(Doctrine::ATTR_QUERY_CACHE, $cacheDriver);
		//$manager->setAttribute(Doctrine::ATTR_RESULT_CACHE, $cacheDriver);
		

		# Prepare Connection
		$dsn = $applicationConfig['data']['connection_string'];
		$unix_socket = ini_get('mysql.default_socket');
		if ( $unix_socket ) {
			$dsn .= ';unix_socket=' . $unix_socket;
		}
		
		# Create Connection
		$Connection = $Manager->openConnection($dsn);
		
		# Profile Connection
		if ( DEBUG_MODE ) {
			$Profiler = new Doctrine_Connection_Profiler();
			$Connection->setListener($Profiler);
			Zend_Registry::set('Profiler', $Profiler);
		}
		
		# Return Manager
		return $Manager;
	}

	/**
	 * Initialise our balPHP Library
	 * @return
	 */
	protected function _initBalphp ( ) {
		$this->bootstrap('autoload');
		
		# balPHP
		Bal_Framework::import();
		
		# Done
		return true;
	}

}

