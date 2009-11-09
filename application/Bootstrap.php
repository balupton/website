<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{

	/**
	 * Initialise our Locale
	 * @return
	 */
	protected function _initLocale () {
		// Prepare
		$this->bootstrap('autoload');
		$this->bootstrap('balphp');
		// Locale
		$Locale = new Bal_Locale($this->getOption('locale'));
		// Done
		return true;
	}

	/**
	 * Initialise our Mail
	 * @return
	 */
	protected function _initMail ( ) {
		// Fetch
		$mail = $this->getOption('mail');
		$transport = $mail['transport'];
		$smtp = $transport['smtp'];
		$address = $smtp['address']; unset($smtp['address']);
		// Apply
		$Transport = new Zend_Mail_Transport_Smtp($address, $smtp);
		Zend_Mail::setDefaultTransport($Transport);
		// Done
		return true;
	}
	
	/**
	 * Initialise our Log
	 * @return
	 */
	protected function _initLog ( ) {
		// Prepare
		$this->bootstrap('autoload');
		// Mail
		$mail = $this->getOption('mail');
		$Mail = new Zend_Mail();
		$Mail->setFrom($mail['from']['address'], $mail['from']['name']);
		$Mail->addTo($mail['log']['address'], $mail['log']['name']);
		// Create Log
		$Log = new Zend_Log();
		Zend_Registry::set('Log',$Log);
		// Create Writer: SysLog
		$Writer_Syslog = new Zend_Log_Writer_Syslog();
		$Log->addWriter($Writer_Syslog);
		// Create Writer: Email
		$Writer_Mail = new Zend_Log_Writer_Mail($Mail);
		$Writer_Mail->setSubjectPrependText('Error Log: mydance.com.au');
		//$Writer->addFilter(Zend_Log::WARN);
		$Log->addWriter($Writer_Mail);
		// Create Writer: Firebug
		if ( DEBUG_MODE ) {
			//$Writer_Firebug = new Zend_Log_Writer_Firebug();
			//$Log->addWriter($Writer_Firebug);
		}
		// Done
		return true;
	}

	/**
	 * Initialise our View
	 * @return
	 */
	protected function _initView ( ) {
		$this->bootstrap('autoload');
        // Initialize view
        $view = new Zend_View();
        $view->doctype('XHTML1_STRICT');
        $view->headTitle('Default Title')->setSeparator(' > ');
		$view->headMeta()->setHttpEquiv('Content-Type', 'text/html; charset=utf-8');
        // Add it to the ViewRenderer
        $viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper('ViewRenderer');
        $viewRenderer->setView($view);
	    // Done
        return $view;
	}

	/**
	 * Initialise our Presentation
	 * @return
	 */
	protected function _initPresentation () {
		// Prepare
		$this->bootstrap('view');
		// View Helpers
		$view = $this->getResource('view');
		$view->addHelperPath('Bal/View/Helper/', 'Bal_View_Helper');
		$view->addHelperPath(APPLICATION_PATH.'/modules/admin/views/helpers', 'Content');
		// Widgets
		$widgetConfig = $this->getOption('bal'); $widgetConfig = $widgetConfig['widget'];
		$view->getHelper('widget')->addWidgets($widgetConfig);
		// Done
		return true;
	}

	/**
	 * Initialise our routes/routing/router
	 * @return
	 */
	protected function _initRoutes () {
		// Prepare
		$this->bootstrap('doctrine');
		// Route
		$config = new Zend_Config_Ini(CONFIG_PATH.'/routes.ini', 'production');
		$frontController = Zend_Controller_Front::getInstance();
		if ( defined('BASE_URL') ) $frontController->setBaseUrl(BASE_URL);
    	$router = $frontController->getRouter();
		$router->removeDefaultRoutes();
    	$router->addConfig($config, 'routes');
    	// Location
    	// $resources = $this->getOption('resources');
    	// $frontController->addModuleDirectory($resources['frontController']['moduleDirectory']);
		// Done
		return true;
	}

	/**
	 * Initialise Zend's Autoloader, used for plugins etc
	 * +CU (Doctrine Forms)
	 * @return
	 */
	protected function _initAutoload () {
		// Initialise Zend's Autoloader, used for plugins etc
		$autoloader = Zend_Loader_Autoloader::getInstance();
		$autoloader->registerNamespace('Bal_');

		// Done
		return $autoloader;
	}
	
	/**
	 * Initialise Lucence Index
	 * @return
	 */
	protected function _initIndex ( ) {
		// Prepare
		$config = array();
		$config['data'] = $this->getOption('data');
		
		// Check
		if ( empty($config['data']['index_path']) ) {
			return true;
		}
		
		// Initialise
		$Index = Zend_Search_Lucene::create($config['data']['index_path']);
		Zend_Registry::set('Index', $Index);
		
		// Done
		return true;
	}
	
	/**
	 * Initialise our Doctrine ORM.
	 * Options: +VALIDATE_ALL
	 * @return
	 */
	protected function _initDoctrine () {
		$this->bootstrap('autoload');

		// Load Doctrine
	    require_once 'Doctrine.php';
	    $Loader = Zend_Loader_Autoloader::getInstance();
	    $Loader->pushAutoloader(array('Doctrine', 'autoload'));

	    // Get Config
	    $config = array();
	    $config['data'] = $this->getOption('data');

	 	// Version Handle
		$version_1_2 = version_compare('1.1', Doctrine::VERSION, '<');
		
		// Options
		$extensions_path = $config['data']['extensions_path'];
		
		// Apply Paths
		//Doctrine::setModelsDirectory($config['data']['models_path']);
	 	if ( $version_1_2 ) Doctrine::setExtensionsPath($extensions_path);

		// Autoload
		if ( $version_1_2 ) spl_autoload_register(array('Doctrine', 'autoload'));
		if ( $version_1_2 ) spl_autoload_register(array('Doctrine', 'modelsAutoload'));
		if ( $version_1_2 ) spl_autoload_register(array('Doctrine', 'extensionsAutoload'));

		/*
		// Importer
		$Import = new Doctrine_Import_Schema();
		$Import->setOptions(array(
		    'pearStyle' => true,
		    'baseClassesDirectory' => null,
		    'baseClassPrefix' => 'Base_',
		    //'classPrefix' => 'MyProject_Models_',
		    //'classPrefixFiles' => true
		));*/

	    // Get Manager
	    $Manager = Doctrine_Manager::getInstance();

	    // Apply Config
		$Manager->setAttribute(
			Doctrine::ATTR_PORTABILITY,
			Doctrine::PORTABILITY_EMPTY_TO_NULL | Doctrine::PORTABILITY_RTRIM);
		$Manager->setAttribute(
	        Doctrine::ATTR_MODEL_LOADING,
	        Doctrine::MODEL_LOADING_CONSERVATIVE);
	 	$Manager->setAttribute(
			Doctrine::ATTR_VALIDATE,
			Doctrine::VALIDATE_ALL
		);

		// Apply Extensions
		if ( $version_1_2 ) $Manager->registerExtension('Taggable');

		// Apply Listener
		$Manager->addRecordListener(new Bal_Doctrine_Record_Listener_Html(false));

		// Cache
		//$cacheConn = Doctrine_Manager::connection(new PDO('sqlite::memory:'));
		//$cacheDriver = new Doctrine_Cache_Db(array('connection' => $cacheConn,'tableName' => 'cache'));
		//$manager->setAttribute(Doctrine::ATTR_QUERY_CACHE, $cacheDriver);
		//$manager->setAttribute(Doctrine::ATTR_RESULT_CACHE, $cacheDriver);

	    // Add models and generated base classes to Doctrine autoloader
	    Doctrine::loadModels($config['data']['models_path']);

	    // Create Connection
	    $Connection = $Manager->openConnection($config['data']['connection_string']);
		
	    // Profile Connection
	    $Profiler = new Doctrine_Connection_Profiler();
		$Connection->setListener($Profiler);
		Zend_Registry::set('Profiler',$Profiler);
	    
	    // Return Manager
	    return $Manager;
	}

	/**
	 * Initialise our balPHP Library
	 * @return
	 */
	protected function _initBalphp ( ) {
		$this->bootstrap('autoload');

		// balPHP
		Bal_Framework::import();

		// Done
		return true;
	}

}

