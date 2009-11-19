<?php
class Bal_View_Helper_Bal extends Zend_View_Helper_Abstract {

	protected $_App = null;
	protected $_User = null;
	
	public $view;
	
	/**
	 * Construct
	 */
	public function __construct ( ) {
		# Apply
		$this->_App = Zend_Controller_Front::getInstance()->getPlugin('Bal_Controller_Plugin_App');
		# Done
		return true;
	}
	
	/**
	 * Apply View
	 * @param Zend_View_Interface $view
	 */
	public function setView (Zend_View_Interface $view) {
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
	public function bal ( ) {
		# Chain
		return $this;
	}

	/**
	 * Get a base_url
	 * @param string $area
	 * @param bool $root_url
	 * @return string
	 */
	public function getBaseUrl ( $area = 'front', $root_url = false ) {
		$baseUrl = Zend_Controller_Front::getInstance()->getBaseUrl();
		$prefix = $suffix = '';
		switch ( $area ) {
			case 'front':
				break;
			case 'back':
			case 'admin':
				$suffix = '/back';
				break;
			default:
				break;
		}
		if ( $root_url && defined('ROOT_URL') ) {
			$prefix = ROOT_URL;
		}
		return $prefix.$baseUrl.$suffix;
	}
	
	/**
	 * Get a Config variable
	 * @param string $confs
	 * @return mixed
	 */
	public function config ( $confs = null ) {
		$applicationConfig = Zend_Registry::get('applicationConfig');
		if ( !$confs ) return $config;
		$confs = explode('.',$confs);
		$value = $applicationConfig;
		foreach ( $confs as $conf ) {
			if ( !is_array($value) || !array_key_exists($conf, $value) ) return null;
			$value = $value[$conf];
		}
		return $value;
	}
	
	/**
     * Get the Current User
     * @return array
	 */
	public function getUser ( ) {
		# Prepare
		$user = array();
		# Load
		if ( $this->_User === null ) {
			$this->_User = $this->getApp()->getUser();
		}
		# Check
		if ( $this->_User ) {
			$user = $this->_User->toArray();
		} else {
			$user = false;
		}
		return $user;
	}
	
	/**
     * Check if the Permission exists for the current User
     * @return bool
	 */
	public function hasPermission ( $permission ) {
		return $this->getApp()->hasPermission($permission);
	}
}