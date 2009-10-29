<?php

class BAL_Controller_Action_Helper_Application extends Zend_Controller_Action_Helper_Abstract {
	
	protected $_options = array(
		'logged_out_forward' => array('login', 'index'),
		'logged_in_forward' => array('index', 'index')
	);
	
	public function __construct ( $options = array() ) {
		$this->mergeOptions($options);
	}
	
	
	# -----------
	# Options
	
	public function getOption ( $name, $default = null ) {
		return empty($this->_options[$name]) ? $default : $this->_options[$name];
	}
	
	public function setOption ( $name, $value ) {
		$this->_options[$name] = $value;
		return $this;
	}
	
	public function mergeOptions ( $options ) {
		$this->_options = array_merge($this->_options, $options);
		return $this;
	}
	
	# -----------
	# Authentication
	
	public function logout ( $redirect = true ) {
		// Logout from the Zend_Auth Singleton
		Zend_Auth::getInstance()->clearIdentity();
		// Forward
		if ( $redirect ) $this->forwardOut($redirect);
		// Done
		return $this;
	}
	
	protected function forward ($redirect) {
		$Redirector = $this->getActionController()->getHelper('Redirector');
		call_user_func_array(array($Redirector,'gotoSimple'), $redirect);
	}
	protected function forwardIn ($redirect = true) {
		if ( $redirect === true ) $redirect = $this->getOption('logged_in_forward');
		$this->forward($redirect);
	}
	protected function forwardOut ($redirect = true) {
		if ( $redirect === true ) $redirect = $this->getOption('logged_out_forward');
		$this->forward($redirect);
	}
	
	public function authenticate ($logged_out_forward = false, $logged_in_forward = false) {
		// Prepare the session
		$Session = new Zend_Session_Namespace('login');
		
		// Check if we are logged in
		if ( $this->hasIdentity() ) {
			// Load the Acl for the Identity
			$this->loadAcl();
			// Apply Identity
			$this->getActionController()->view->Identity = $this->getIdentity();
			// We are logged in
			if ( $logged_in_forward ) {
				// Forward
				if ( $logged_in_forward ) $this->forwardIn($logged_in_forward);
			}
			else {
				// Done
			}
			// Done
			return true;
		}
		else {
			// We are not logged in
			if ( $logged_out_forward ) {
				// Forward
				if ( $logged_out_forward ) $this->forwardOut($logged_out_forward);
			}
			else {
				// Done
			}
			// Done
			return false;
		}
		
		// Done
		return null;
	}
	
	public function getAuth ( ) {
		// Get the Zend_Auth Singleton
		return Zend_Auth::getInstance();
	}
	
	public function hasIdentity ( ) {
		// Get the Zend_Auth Singleton
		$Auth = $this->getAuth();
		// Check if we have an Identity
		return $this->getIdentity() ? true : false;
	}
	
	public function getIdentity ( ) {
		// Get the Zend_Auth Singleton
		$Auth = $this->getAuth();
		// Check if we have an Identity
		return $Auth->hasIdentity() ? Doctrine::getTable('User')->find($Auth->getIdentity()) : false;
	}
	
	# -----------
	# Authorisation
	
	public function getRegistry ( ) {
		return Zend_Registry::getInstance();
	}
	
	public function getAcl ( ) {
		// Get the Registry
		$Registry = $this->getRegistry();
		// Check
		if ( !$Registry->isRegistered('acl') ) {
			$Acl = new Zend_Acl();
			$Registry->set('acl', $Acl);
		}
		else {
			$Acl = $Registry->get('acl');
		}
		// Return the Acl
		return $Acl;
	}
	
	public function loadAcl ( $Identity = null ) {
		// Ensure Identity
		if ( !$Identity && !($Identity = $this->getIdentity()) ) return false;
		// Load the Acl
		$Acl = $this->getAcl();
		// Add the Identity as a role
		$Role = new Zend_Acl_Role($Identity->id);
		if ( !$Acl->hasRole($Role) ) {
			// Add the role because it doesn't exist
			$Acl->addRole($Role);
		}
		// Load the Permissions
		$Identity->loadReference('PermissionList');
		// Add the Permissions to the Acl
		$permissions = array();
		foreach ( $Identity->PermissionList as $Permission ) {
			$permissions[] = $Permission->code;
			$Acl->allow($Identity->id, null, $Permission->code);
		}
		$this->getActionController()->view->permissions = $permissions;
		// Done
		return true;
	}
	
	public function hasAcl ( $role, $action, $permissions ) {
		// Get the Zend_Acl
		$Acl = $this->getAcl();
		// Check the role
		return $Acl->isAllowed($role, $action, $permissions);
	}
	
	public function hasPermission ( $action, $permissions = null ) {
		// Prepare
		if ( $permissions === null ) {
			// Shortcut simplified
			$permissions = $action;
			$action = null;
		}
		// Get the Identity
		$Identity = $this->getIdentity();
		// Check role
		// if ( $Identity->hasAccessor('role') && $result = $this->hasAcl($Identity->role, $action, $permissions) ) return $result;
		// Check name
		// if ( $Identity->hasAccessor('username') && $result = $this->hasAcl($Identity->username, $action, $permissions) ) return $result;
		// Check id
		if ( $Identity->id && ($result = $this->hasAcl($Identity->id, $action, $permissions)) ) return $result;
		// Exhausted
		return false;
	}
	
	# -----------
	# Helpers
	
	/**
	 * Get a Pager Object
	 * @param integer $page_current [optional] Which page are we on?
	 * @param integer $page_items [optional] How many items per page?
	 * @return 
	 */
	public function getPager($DQ, $page_current = 1, $page_items = 10){
		// Fetch
		$Pager = new Doctrine_Pager(
			$DQ,
			$page_current,
			$page_items
		);
		
		// Return
		return $Pager;
	}
	
	public function getPages($Pager, $PagerRange, $page_current = 1){
		// Paging
		$page_first = $Pager->getFirstPage();
		$page_last = $Pager->getLastPage();
		$Pages = $PagerRange->rangeAroundPage();
		foreach ( $Pages as &$Page ) {
			$Page = array(
				'number' => $Page,
				'title' => $Page
			);
		}
		$Pages[] = array('number' => $Pager->getPreviousPage(), 'title' => 'prev');
		$Pages[] = array('number' => $Pager->getNextPage(), 'title' => 'next');
		foreach ( $Pages as &$Page ) {
			$page = $Page['number'];
			$Page['selected'] = $page == $page_current;
			if ( is_numeric($Page['title']) ) {
				$Page['disabled'] = $page < $page_first || $page > $page_last;
			} else {
				$Page['disabled'] = $page < $page_first || $page > $page_last || $page == $page_current;
			}
		}
		
		return $Pages;
	}
	
	public function getPaging($DQ, $page_current = 1, $page_items = 5, $pages_chunk = 5){
		// Fetch
		$Pager = $this->getPager($DQ, $page_current, $page_items);
		
		// Results
		$PagerRange = new Doctrine_Pager_Range_Sliding(array(
				'chunk' => $pages_chunk
    		),
			$Pager
		);
		$Items = $Pager->execute();
		
		// Get Pages
		$Pages = $this->getPages($Pager, $PagerRange, $page_current);
		
		// Check page current
		$page_first = $Pager->getFirstPage();
		$page_last = $Pager->getLastPage();
		if ( $page_current > $page_last ) $page_current = $page_last;
		elseif ( $page_current < $page_first ) $page_current = $page_first;
		
		// Return
		return array($Items, $Pages, $page_current);
	}
	
}
