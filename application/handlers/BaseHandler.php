<?php

class BaseHandler {
	
	protected $Controller;
	protected $View;
	
	/**
	 * Initialise our Handler
	 * @param object $Controller
	 * @param object $View
	 * @return 
	 */
	public function init ( $Controller, $View ) {
		$this->Controller = $Controller;
		$this->View = $View;
		// Registry
		$this->registryInit();
		// Done
		return true;
	}
	
	/**
	 * Registers the Action, so we know what's it up to so we can cache
	 * @param object $code
	 * @return 
	 */
	protected function register ( $code ) {
		// Fetch
		$key = debug_backtrace(); $key = $callee[0]['function'];
		
		// Check if it exists in the registry
		if ( $this->registryExists($key) ) {
			return false;
		}
		
		// Add to the registry
		$this->registryAppend($key, $code);
		
		// Run like the wind
		return true;
	}
	
	/** Registry for the Actions, so we can cache  */
	static private $_registry = array();
	/** Contains the current Parent so we have leveling on our register */
	static private $_registry_parent = null;
	
	/**
	 * Initialise our Register
	 * @return 
	 */
	private function registryInit ( ) {
		// Init Registry
		if ( self::$_registry_parent === null ) self::$_registry_parent =& self::$_registry;
		// Done
		return true;
	}
	
	/**
	 * Insert a Registry Item
	 * @param object $key
	 * @param object $code
	 * @return 
	 */
	private function registryAppend ( $key, $code ) {
		// Append
		self::$_registry_parent['children'][$key] = array(
			'code' => $code,
			'children' => array()
		);
		// Update Reference
		self::$_registry_parent =& self::$_registry_parent['children'][$key];
		// Done
		return true;
	}
	
	/**
	 * Check if the Registry Item exists
	 * @param object $key
	 * @return 
	 */
	private function registryExists ( $key ) {
		// Check if it exists in the registry and is the same
		if ( array_key_exists($key, self::$_registry_parent['children']) ) {
			if ( self::$_registry_parent['children'][$key]['code'] == $code ) {
				return true;
			}
		}
		return false;
	}
}
