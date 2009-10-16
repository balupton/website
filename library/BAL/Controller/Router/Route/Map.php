<?php
require_once 'Zend/Controller/Router/Route/Interface.php';
 
class BAL_Controller_Router_Route_Map extends Zend_Controller_Router_Route_Regex {
	
    /**#@+
     * Array keys to use for module, controller, and action. Should be taken out of request.
     * @var string
     */
    protected $_moduleKey     = 'module';
    protected $_controllerKey = 'controller';
    protected $_actionKey     = 'action';
    /**#@-*/
	
    /**
     * @var Zend_Controller_Dispatcher_Interface
     */
    protected $_dispatcher;

    /**
     * @var Zend_Controller_Request_Abstract
     */
    protected $_request;
	
    /**
     * Set request keys based on values in request object
     * @return void
     */
    protected function _setRequestKeys()
    {
        if (null !== $this->_request) {
            $this->_moduleKey     = $this->_request->getModuleKey();
            $this->_controllerKey = $this->_request->getControllerKey();
            $this->_actionKey     = $this->_request->getActionKey();
        }

        if (null !== $this->_dispatcher) {
            $this->_defaults += array(
                $this->_controllerKey => $this->_dispatcher->getDefaultControllerName(),
                $this->_actionKey     => $this->_dispatcher->getDefaultAction(),
                $this->_moduleKey     => $this->_dispatcher->getDefaultModule()
            );
        }

        $this->_keysSet = true;
    }
 	
	
	
    /**
     * Instantiates route based on passed Zend_Config structure
     * @param Zend_Config $config Configuration object
     */
    public static function getInstance(Zend_Config $config)
    {
        $defs = ($config->defaults instanceof Zend_Config) ? $config->defaults->toArray() : array();
        $map = ($config->map instanceof Zend_Config) ? $config->map->toArray() : array();
        $reverse = (isset($config->reverse)) ? $config->reverse : null;
        return new self($config->route, $defs, $map, $reverse);
    }
	
	protected function _getOptions(){
		$options = $GLOBALS['Application']->getOption('balcms'); $options = $options['routing'];
		return $options;
	}
	protected function _getDefaults($prefix = array(), $postfix = array()){
        $defaults = $this->_getMappedValues($this->_defaults, true, false);
		return array_merge($prefix, $defaults, $postfix);
	}
	protected function _getParamsString($params){
		$url = '';
        foreach ($params as $key => $value) {
            if (is_array($value)) {
                foreach ($value as $arrayValue) {
                    if ($encode) $arrayValue = urlencode($arrayValue);
                    $url .= '/' . $key;
                    $url .= '/' . $arrayValue;
                }
            } else {
                if ($encode) $value = urlencode($value);
                $url .= '/' . $key;
                $url .= '/' . $value;
            }
        }
		return $url;
	}
 	
    /**
     * Matches a user submitted path with a previously defined route.
     * Assigns and returns an array of defaults on a successful match.
     *
     * @param  string $path Path used to match against this routing map
     * @return array|false  An array of assigned values or a false on a mismatch
     */
    public function match ($path, $partial = false) {
    	// Prepare
        $this->_setRequestKeys();
    	$values = parent::match($path,$partial);
		
		// Get defaults and options
		$options = $this->_getOptions();
		$defaults = $this->_getDefaults($options['defaults']);
		$routeTable = $defaults['routeTable'];
		$pathColumn = $defaults['pathColumn'];
		$dataColumn = $defaults['dataColumn'];
		$typeColumn = $defaults['typeColumn'];
		
		// Get Path
		$path = $values['map_path'];
		$params = $values['map_params'];
		
		// Fetch
		$path = trim($path, '/');
		$params = trim($params,'/');
		
		// Include Params into $values
		$params = explode('/',$params);
		$key = $value = null; $i = 0; foreach ( $params as $param ) {
			if ( $i % 2 === 0 ) {
				$key = $param;
				$value = true;
			} else {
				$value = $param;
				$values[$key]= $value;
				$key = $value = null;
			}
			++$i;
		} if ( $key ) $values[$key] = $value; // In case we have an left overs: /key/value/key. Value will be {true}
		
		// Fetch the Page
		$Page = Doctrine::getTable($routeTable)->findOneBy($pathColumn,$path);
		if ( !$Page || !$Page->exists() ) {
			// Could not find anything!
			return false; // Will cause 404
		}
		
		// Retrieve Page routing information
		$type = $Page->get($typeColumn);
		if ( empty($options['routeTypes'][$type]) ) {
            require_once 'Zend/Controller/Router/Exception.php';
            throw new Zend_Controller_Router_Exception('Route type ['.$type.'] has no configuration.');
		}
		$routeType = $options['routeTypes'][$type];
		$module = !empty($routeType['module']) ? $routeType['module'] : null;
		$controller = $routeType['controller'];
		$action = $routeType['action'];
		$data = $Page->get($dataColumn); if ( empty($data) ) $data = array();
		
		// Apply routing information
		$values[$this->_moduleKey] = $module;
		$values[$this->_controllerKey] = $controller;
		$values[$this->_actionKey] = $action;
		
		// Done
		return $values;
    }
	
    /**
     * Assembles user submitted parameters forming a URL path defined by this route
     *
     * @param array $data An array of variable and value pairs used as parameters
     * @param bool $reset Weither to reset the current params
     * @return string Route path with user submitted parameters
     */
    public function assemble($data = array(), $reset = false, $encode = false, $partial = false) {
    	// Prepare
        if (!$this->_keysSet) {
            $this->_setRequestKeys();
        }
		
		// Get defaults and options
		$options = $this->_getOptions();
		$defaults = $this->_getDefaults($options['defaults']);
		$pathColumn = $defaults['pathColumn'];
		
    	// Fetch Page
		if ( empty($data['Page']) ) {
            require_once 'Zend/Controller/Router/Exception.php';
            throw new Zend_Controller_Router_Exception('Cannot assemble. Page has not been specified.');
		}	$Page = $data['Page'];
		
		// Get Params
		$params = $data;
		unset($params['Page']);
		
		// Generate URL
		$url_path = $Page->get($pathColumn);
		$url_params = $this->_getParamsString($params);
        $url = @vsprintf($this->_reverse, compact('url_path', 'url_params'));
		
		// Return URL
        return $url;
    }
	
}