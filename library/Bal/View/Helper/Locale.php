<?php
require_once 'Zend/View/Helper/Abstract.php';
class Bal_View_Helper_Locale extends Zend_View_Helper_Abstract {

	public function locale ( ) {
		return $this;
	}
	
	public function __call($name, $arguments) {
		// Prepare
		$Locale = Zend_Registry::get('Locale');
		// Forward
		$method = array($Locale, $name);
		return call_user_func_array($method, $arguments);
    }
    
}