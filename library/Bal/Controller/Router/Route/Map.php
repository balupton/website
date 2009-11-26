<?php
/**
 * Balupton's Resource Library (balPHP)
 * Copyright (C) 2008-2009 Benjamin Arthur Lupton
 * http://www.balupton.com/
 *
 * This file is part of Balupton's Resource Library (balPHP).
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Balupton's Resource Library (balPHP).  If not, see <http://www.gnu.org/licenses/>.
 *
 * @package balphp
 * @subpackage core
 * @version 0.1.0-final, April 21, 2008
 * @since 0.1.0-final, April 21, 2008
 * @author Benjamin "balupton" Lupton <contact@balupton.com> - {@link http://www.balupton.com/}
 * @copyright Copyright (c) 2008-2009, Benjamin Arthur Lupton - {@link http://www.balupton.com/}
 * @license http://www.gnu.org/licenses/agpl.html GNU Affero General Public License
 */

require_once 'Zend/Controller/Router/Route/Regex.php';
class Bal_Controller_Router_Route_Map extends Zend_Controller_Router_Route_Regex {
	
	/**#@+
	 * Array keys to use for module, controller, and action. Should be taken out of request.
	 * @var string
	 */
	protected $_moduleKey = 'module';
	protected $_controllerKey = 'controller';
	protected $_actionKey = 'action';
	protected $_keysSet = false;
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
	protected function _setRequestKeys ( ) {
		if ( null !== $this->_request ) {
			$this->_moduleKey = $this->_request->getModuleKey();
			$this->_controllerKey = $this->_request->getControllerKey();
			$this->_actionKey = $this->_request->getActionKey();
		}
		
		if ( null !== $this->_dispatcher ) {
			$this->_defaults += array($this->_controllerKey => $this->_dispatcher->getDefaultControllerName(), $this->_actionKey => $this->_dispatcher->getDefaultAction(), $this->_moduleKey => $this->_dispatcher->getDefaultModule());
		}
		
		$this->_keysSet = true;
	}

	/**
	 * Instantiates route based on passed Zend_Config structure
	 * @param Zend_Config $config Configuration object
	 */
	public static function getInstance ( Zend_Config $config ) {
		$defs = ($config->defaults instanceof Zend_Config) ? $config->defaults->toArray() : array();
		$map = ($config->map instanceof Zend_Config) ? $config->map->toArray() : array();
		$reverse = (isset($config->reverse)) ? $config->reverse : null;
		return new self($config->route, $defs, $map, $reverse);
	}

	protected function _getOptions ( ) {
		$options = $GLOBALS['Application']->getOption('bal');
		$options = $options['routing'];
		return $options;
	}

	protected function _getDefaults ( $prefix = array(), $postfix = array() ) {
		$defaults = $this->_getMappedValues($this->_defaults, true, false);
		return array_merge($prefix, $defaults, $postfix);
	}

	/**
	 * Return the build query string
	 *
	 * @return array Route defaults
	 */
	protected function _getQueryString ( $params, $encode = false ) {
		$query = '';
		foreach ( $params as $key => $value ) {
			if ( is_array($value) ) {
				$url .= $this->_getQueryString($value, $encode);
			} else {
				if ( $encode )
					$value = rawurlencode($value);
				$url .= '/' . $key;
				$url .= '/' . $value;
			}
		}
		return $query;
	}

	/**
	 * Matches a user submitted path with a previously defined route.
	 * Assigns and returns an array of defaults on a successful match.
	 *
	 * @param  string $path Path used to match against this routing map
	 * @return array|false  An array of assigned values or a false on a mismatch
	 */
	public function match ( $path, $partial = false ) {
		// Prepare
		$this->_setRequestKeys();
		$values = parent::match($path, $partial);
		//$frontController = Zend_Controller_Front::getInstance();
		//$Request = $frontController->getRequest();
		
		// Get defaults and options
		$options = $this->_getOptions();
		$defaults = $this->_getDefaults($options['defaults']);
		$routeTable = $defaults['routeTable'];
		$pathColumn = $defaults['pathColumn'];
		$dataColumn = $defaults['dataColumn'];
		$typeColumn = $defaults['typeColumn'];
		$firstAsHome = $defaults['firstAsHome'];
		$routeKey = $defaults['routeKey'];
		
		// Get Path
		$path = $values['map_path'];
		$params = $values['map_params'];
		
		// Fetch
		$path = trim($path, '/');
		$params = trim($params, '/');
		
		// Include Params into $values
		$params = explode('/', $params);
		$key = $value = null;
		$i = 0;
		foreach ( $params as $param ) {
			if ( $i % 2 === 0 ) {
				$key = $param;
				$value = true;
			} else {
				$value = $param;
				$values[$key] = $value;
				$key = $value = null;
			}
			++$i;
		}
		if ( $key )
			$values[$key] = $value; // In case we have an left overs: /key/value/key. Value will be {true}
		

		// Fetch the Page
		$Map = Doctrine::getTable($routeTable)->findOneBy($pathColumn, $path);
		if ( !$Map || !$Map->exists() ) {
			// Could not find anything!
			// Should we default to first
			if ( empty($path) && $firstAsHome ) {
				$Map = Doctrine::getTable($routeTable)->createQuery()->limit(1)->execute()->get(0);
			}
			// Check again
			if ( !$Map || !$Map->exists() ) {
				// 404
				return false;
			}
		}
		
		// Retrieve Page routing information
		$type = $Map->get($typeColumn);
		if ( empty($options['routeTypes'][$type]) ) {
			require_once 'Zend/Controller/Router/Exception.php';
			throw new Zend_Controller_Router_Exception('Route type [' . $type . '] has no configuration.');
		}
		$routeType = $options['routeTypes'][$type];
		$defaultRouteType = $options['routeTypes']['default'];
		$module = !empty($routeType['module']) ? $routeType['module'] : $defaultRouteType['module'];
		$controller = $routeType['controller'];
		$action = $routeType['action'];
		
		// Apply routing information
		$values[$this->_moduleKey] = $module;
		$values[$this->_controllerKey] = $controller;
		$values[$this->_actionKey] = $action;
		$values[$this->_actionKey] = $action;
		
		// Apply route data
		$values[$routeKey] = $Map;
		$data = $Map->get($dataColumn);
		if ( empty($data) )
			$data = array();
		$values = array_merge($data, $values);
		
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
	public function assemble ( $data = array(), $reset = false, $encode = false, $partial = false ) {
		# Prepare
		if ( !$this->_keysSet ) {
			$this->_setRequestKeys();
		}
		
		# Get defaults and options
		$options = $this->_getOptions();
		$defaults = $this->_getDefaults($options['defaults']);
		$pathColumn = $defaults['pathColumn'];
		
		# Fetch Path
		$url_path = null;
		if ( array_key_exists('path', $data) ) {
			$url_path = $data['path'];
		} elseif ( array_key_exists('Map', $data) ) {
			$Map = $data['Map'];
			$url_path = is_array($Map) ? $Map[$pathColumn] : $Map->get($pathColumn);
		}
		
		# Check
		if ( empty($url_path) ) {
			require_once 'Zend/Controller/Router/Exception.php';
			throw new Zend_Controller_Router_Exception('Cannot assemble. Map has not been specified.');
		}
		
		# Params
		$params = $data;
		unset($params['Map']);
		unset($params['path']);
		$url_params = $this->_getQueryString($params, $encode);
		
		# Generate URL
		$url = @vsprintf($this->_reverse, compact('url_path', 'url_params'));
		$url = trim($url, '/');
		
		# Return URL
		return $url;
	}

}