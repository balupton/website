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
class Bal_Controller_Router_Route_Simple extends Zend_Controller_Router_Route_Abstract {
	
	protected $_route = null;
	protected $_defaults = array();
	protected $_mode = 'clean';

	public function getVersion ( ) {
		return 1;
	}

	/**
	 * Instantiates route based on passed Zend_Config structure
	 * @param Zend_Config $config Configuration object
	 */
	public static function getInstance ( Zend_Config $config ) {
		$defaults = ($config->defaults instanceof Zend_Config) ? $config->defaults->toArray() : array();
		$mode = (isset($config->mode)) ? $config->mode : null;
		return new self($config->route, $defaults, $mode);
	}

	/**
	 * Prepares the route for mapping.
	 *
	 * @param string $route Map used to match with later submitted URL path
	 * @param array $defaults Defaults for map variables with keys as variable names
	 */
	public function __construct ( $route, $defaults = array(), $mode = 'clean' ) {
		$this->_route = trim($route, '/');
		$this->_defaults = (array)$defaults;
		$this->_mode = in_array($mode, array('clean', 'get')) ? $mode : 'clean';
	}

	/**
	 * Return a single parameter of route's defaults
	 *
	 * @param string $name Array key of the parameter
	 * @return string Previously set default
	 */
	public function getDefault ( $name ) {
		if ( isset($this->_defaults[$name]) ) {
			return $this->_defaults[$name];
		}
		return null;
	}

	/**
	 * Return an array of defaults
	 *
	 * @return array Route defaults
	 */
	public function getDefaults ( ) {
		return $this->_defaults;
	}

	/**
	 * Return the build query string
	 *
	 * @return array Route defaults
	 */
	protected function _getQueryString ( $params = null, $encode = false, $mode = null ) {
		$query = '';
		if ( is_null($params) )
			$params = $this->_defaults;
		if ( is_null($mode) )
			$mode = $this->_mode;
		foreach ( $params as $key => $value ) {
			if ( is_array($value) ) {
				$url .= $this->_getQueryString($value, $encode);
			} else {
				if ( $encode )
					$value = rawurlencode($value);
				if ( $mode === 'clean' )
					$url .= '/' . $key . '/' . $value;
				else
					$url .= ($encode ? '&amp;' : '&') . $key . '=' . $value;
			}
		}
		return $query;
	}

	/**
	 * Matches a user submitted path with a previously defined route.
	 * Assigns and returns an array of defaults on a successful match.
	 *
	 * @param string $path Path used to match against this routing map
	 * @return array|false An array of assigned values or a false on a mismatch
	 */
	public function match ( $path, $partial = false ) {
		$url = $this->assemble(array(), false, false, false);
		
		if ( $partial ) {
			if ( substr($path, 0, strlen($url)) === $url ) {
				$this->setMatchedPath($url);
				return $this->_defaults;
			}
		} else {
			if ( trim($path, '/') == $url ) {
				return $this->_defaults;
			}
		}
		
		return false;
	}

	/**
	 * Assembles a URL path defined by this route
	 *
	 * @param array $data An array of variable and value pairs used as parameters
	 * @return string Route path with user submitted parameters
	 */
	public function assemble ( $data = array(), $reset = false, $encode = true, $partial = false ) {
		$url = trim($this->_route, '/');
		if ( $reset === false )
			$data += $this->_defaults;
		if ( $this->_mode === 'clean' ) {
			$url .= $this->_getQueryString();
		} else {
			if ( strpos($url, '?') === false )
				$url .= '?';
			$url .= $this->_getQueryString($data, $encode);
		}
		$url = trim($url, '/');
		return $url;
	}

}