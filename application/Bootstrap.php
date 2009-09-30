<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
	
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
		$view->addHelperPath('BAL/View/Helper/', 'BAL_View_Helper');
		// Done
		return true;
	}
	
	/**
	 * Initialise our routes/routing/router
	 * @return 
	 */
	protected function _initRoutes () {
		$config = new Zend_Config_Ini(APPLICATION_PATH.'/configs/routes.ini', 'production');
		$frontController = Zend_Controller_Front::getInstance();
		if ( defined('BASE_URL') ) $frontController->setBaseUrl(BASE_URL);
    	$router = $frontController->getRouter();
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
		$autoloader->registerNamespace('BAL_');
		
		// Done
		return $autoloader;
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
	    $doctrineOptions = $this->getOption('doctrine');
	 
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
		
		// Apply Paths
	 	// Doctrine::setExtensionsPath($doctrineOptions['extensions_path']);
		
		// Apply Extensions
		// $Manager->registerExtension('Taggable');
		
		// Apply Listener
		$Manager->addRecordListener(new BAL_Doctrine_Record_Listener_Html(false));
		
		// Cache
		//$cacheConn = Doctrine_Manager::connection(new PDO('sqlite::memory:'));
		//$cacheDriver = new Doctrine_Cache_Db(array('connection' => $cacheConn,'tableName' => 'cache'));
		//$manager->setAttribute(Doctrine::ATTR_QUERY_CACHE, $cacheDriver);
		//$manager->setAttribute(Doctrine::ATTR_RESULT_CACHE, $cacheDriver);
		
	    // Add models and generated base classes to Doctrine autoloader
	    Doctrine::loadModels($doctrineOptions['models_path']);
		
	    // Create Connection
	    $Connection = $Manager->openConnection($doctrineOptions['connection_string']);    
		
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
		BAL_Framework::import();
		
		// Done
		return true;
	}
	
}

