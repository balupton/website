<?php
class Bal_View_Helper_App extends Zend_View_Helper_Abstract {

	/**
	 * The App Plugin
	 * @var Bal_Controller_Plugin_App
	 */
	protected $_App = null;
	
	/**
	 * The View in use
	 * @var Zend_View_Interface
	 */
	public $view;
	
	/**
	 * Apply View
	 * @param Zend_View_Interface $view
	 */
	public function setView (Zend_View_Interface $view) {
		# Apply
		$this->_App = Zend_Controller_Front::getInstance()->getPlugin('Bal_Controller_Plugin_App');
		
		# Set
		$this->view = $view;
		
		# Chain
		return $this;
	}
	
	/**
	 * Returns @see Bal_Controller_Plugin_App
	 */
	public function getApp(){
		# Done
		return $this->_App;
	}
	
	/**
	 * Self reference
	 */
	public function app ( ) {
		# Chain
		return $this;
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