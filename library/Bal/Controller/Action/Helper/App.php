<?php
require_once 'Zend/Controller/Action/Helper/Abstract.php';
class Bal_Controller_Action_Helper_App extends Zend_Controller_Action_Helper_Abstract {

	protected $_App = null;
	
	protected $_options = array(
		'logged_out_forward' => array('login'),
		'logged_in_forward' => array('index')
	);
	
	/**
	 * Construct
	 * @param array $options
	 */
	public function __construct ( array $options = array() ) {
		$this->_App = Zend_Controller_Front::getInstance()->getPlugin('Bal_Controller_Plugin_App');
		$this->mergeOptions($options);
	}
	
	/**
	 * Returns @see Bal_Controller_Plugin_App
	 */
	public function getApp(){
		return $this->_App;
	}
	
	
	# -----------
	# Options
	
	/**
	 * Get the helper option
	 * @param string $name
	 * @param mixed $default
	 */
	public function getOption ( $name, $default = null ) {
		# Get
		return empty($this->_options[$name]) ? $default : $this->_options[$name];
	}
	
	/**
	 * Set the helper option
	 * @param string $name
	 * @param mixed $value
	 */
	public function setOption ( $name, $value ) {
		# Set
		$this->_options[$name] = $value;
		# Chain
		return $this;
	}
	
	/**
	 * Merge the helper options
	 * @param array $options
	 */
	public function mergeOptions ( array $options ) {
		# Merge
		$this->_options = array_merge($this->_options, $options);
		# Chain
		return $this;
	}
	
	# -----------
	# Authentication

	/**
	 * Logout the User
	 * @param mixed $redirect
	 */
	public function logout ( $redirect = true ) {
		# Logout
		$this->getApp()->logout();
		
		# Forward
		if ( $redirect ) $this->forwardOut($redirect);
		
		# Done
		return $this;
	}

	/**
	 * Login the User
	 * @see forwardIn
	 * @see forwardOut
	 * @param string $username
	 * @param string $password
	 * @param string $locale
	 * @param string $remember
	 * @param bool $logged_out_forward
	 * @param bool $logged_in_forward
	 * @return bool
	 */
	public function login ( $username, $password, $locale = null, $remember = null, $logged_out_forward = false, $logged_in_forward = false ) {
		$this->getApp()->login($username, $password, $locale, $remember);
		return $this->authenticate($logged_out_forward, $logged_in_forward);;
	}
	
	/**
	 * Forward the Request
	 * @param mixed $redirect
	 */
	public function forward ($redirect) {
		$Redirector = $this->getActionController()->getHelper('Redirector');
		call_user_func_array(array($Redirector,'gotoSimple'), $redirect);
		return $this;
	}
	
	
	/**
	 * Forward the Request if Logged In
	 * @see forward
	 * @param mixed $redirect
	 */
	public function forwardIn ($redirect = true) {
		if ( $redirect === true ) $redirect = $this->getOption('logged_in_forward');
		return $this->forward($redirect);
	}
	
	/**
	 * Forward the Request if Logged Out
	 * @see forward
	 * @param mixed $redirect
	 */
	public function forwardOut ($redirect = true) {
		if ( $redirect === true ) $redirect = $this->getOption('logged_out_forward');
		return $this->forward($redirect);
	}
	
	/**
	 * Authenticate and Forward if need be
	 * @see forwardIn
	 * @see forwardOut
	 * @param bool $logged_out_forward
	 * @param bool $logged_in_forward
	 * @return bool
	 */
	public function authenticate ($logged_out_forward = false, $logged_in_forward = false) {
		# Prepare
		$result = null;
		
		# Check Login Status
		if ( $this->getApp()->hasIdentity() ) {
			# Logged In
			# Forward
			if ( $logged_in_forward ) {
				$this->forwardIn($logged_in_forward);
			}
			# Done
			$result = true;
		}
		else {
			# Logged Out
			# Forward
			if ( $logged_out_forward ) {
				$this->forwardOut($logged_out_forward);
			}
			# Done
			$result = false;
		}
		
		# Done
		return $result;
	}
	

	/**
	 * Magic
	 * @return mixed
	 */
	function __call ( $method, $args ) {
		$App = $this->getApp();
		if ( method_exists($App, $method) ) {
			return call_user_func_array(array($App, $method), $args);
		} else {
			throw new Zend_Exception('Could not find the method: '.$method);
		}
		return false;
	}
}
