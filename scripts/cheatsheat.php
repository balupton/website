<?php

class Bal_Auth_Adapter_Doctrine implements Zend_Auth_Adapter_Interface {
	
	private $_username;
	private $_password;
	protected $_options = array(
		'tableName' => 'User',
		'indentityColumn' => 'username',
		'credentialColumn' => 'password'
	);
	
	
	# -----------
	# Construction
	
    /**
     * Sets username and password for authentication
     * @return void
     */
    public function __construct($username, $password, $options = array()) {
        $this->_username = $username;
        $this->_password = $password;
		// Apply the options
		$this->mergeOptions($options);
    }
	
	# -----------
	# Options
	
	public function getOption ( $name, $default = null ) {
		return empty($this->_options[$name]) ? $default : $this->_options[$name];
	}
	
	public function setOption ( $name, $value ) {
		$this->_options[$name] = $value;
	}
	
	public function mergeOptions ( $options ) {
		$this->_options = array_merge($this->_options, $options);
	}
	
	# -----------
	
	public function setTableName ($value) {
		$this->setOption('tableName', $value);
		return $this;
	}
	public function setIdentityColumn ($value) {
		$this->setOption('indentityColumn', $value);
		return $this;
	}
	public function setCredentialColumn ($value) {
		$this->setOption('credentialColumn', $value);
		return $this;
	}
	
	
	# -----------
	# Authentication
	
    /**
     * Performs an authentication attempt using Doctrine User class.
     * @throws Zend_Auth_Adapter_Exception If authentication cannot be performed
     * @return Zend_Auth_Result
     */
    public function authenticate ( ) {
    	$Result = null;

    	try {
    		// Fetch User
			$DQ = Doctrine_Query::create()
			    ->from($this->getOption('tableName').' u')
			    ->where('u.'.$this->getOption('indentityColumn').' = ?', $this->_username);
			$User = $DQ->fetchOne();
			
			if ( empty($User) ) {
				// Invalid user
				$Result = new Zend_Auth_Result(
		            Zend_Auth_Result::FAILURE_IDENTITY_NOT_FOUND,
		            null,
		            array('The indentity '.$this->_username.' was not found.')
				);
			}
			else {
				if ( $User->get($this->getOption('credentialColumn')) !== $this->_password) {
					// Invalid password
					$Result = new Zend_Auth_Result(
			            Zend_Auth_Result::FAILURE_CREDENTIAL_INVALID,
			            $User,
			            array('The credentials that were supplied are invalid.')
					);
				}
				else {
					// Everything went well
					$Result = new Zend_Auth_Result(
			            Zend_Auth_Result::SUCCESS,
			            $User,
			            array()
					);
				}
			}
    	}
		catch ( Exception $e ) {
			// Error
    		throw new Zend_Auth_Adapter_Exception($e->getMessage());
    	}
		
		// Done
		return $Result;
    }
}

class Bal_Controller_Action_Helper_ extends Zend_Controller_Action_Helper_Abstract {
	
	protected $_options = array(
		'forward' => array('login', 'index')
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
	}
	
	public function mergeOptions ( $options ) {
		$this->_options = array_merge($this->_options, $options);
	}
	
	# -----------
	# Authentication
	
	public function logout ( ) {
		// Logout from the Zend_Auth Singleton
		Zend_Auth::getInstance()->clearIdentity();
	}
	
	public function authenticate ( $forward = null ) {
		// Are we logged in?
		if ( $this->hasIdentity() ) {
			// Yes
			return true;
		}
		else {
			// Prepare the redirect
			if ( $forward === null ) $redirect = $this->getOption('forward');
			// Should we redirect?
			if ( $forward ) {
				// Redirect
				if ( !is_array($forward) ) $forward = array($forward, 'index');
				$this->_forward($forward[0], $forward[1]);
			}
			else {
				// Failed
			}
		}
		
		// Load the Acl for the Indentity
		$this->loadAcl();
		
		// Done
		return false;
	}
	
	public function getAuth ( ) {
		// Get the Zend_Auth Singleton
		return Zend_Auth::getInstance();
	}
	
	public function hasIndentity ( ) {
		// Get the Zend_Auth Singleton
		$Auth = $this->getAuth();
		// Check if we have an Indentity
		return $Auth->hasIdentity();
	}
	
	public function getIndentity ( ) {
		// Get the Zend_Auth Singleton
		$Auth = $this->getAuth();
		// Check if we have an Indentity
		return $Auth->getIdentity();
	}
	
	# -----------
	# Authorisation
	
	protected $_Acl = null;
	
	public function getAcl ( ) {
		// Get the Acl, or instantiate it
		return $this->_Acl ? $this->_Acl : ($this->_Acl = new Zend_Acl());
	}
	
	public function loadAcl ( $Indentity = null ) {
		// Ensure Indentity
		if ( !$Indentity || !($Indentity = $this->getIndentity()) ) return false;
		// Load the Acl
		$Acl = $this->getAcl();
		// Add the Indentity as a role
		$Role = new Zend_Acl_Role($Indentity->id);
		if ( !$Acl->hasRole($Role) ) {
			// Add the role because it doesn't exist
			$Acl->addRole($Role);
		}
		// Load the Permissions
		$Indentity->loadReference('PermissionList');
		// Add the Permissions to the Acl
		foreach ( $Indentity->PermissionList as $Permission ) {
			$Acl->allow($Indentity->id, null, $Permission->code);
		}
		// Done
		return true;
	}
	
	public function hasAcl ( $role, $action, $permissions ) {
		// Get the Zend_Acl
		$Acl = $this->getAcl();
		// Check the role
		return $this->isAllowed($role, $action, $permissions);
	}
	
	public function hasPermission ( $action, $permissions = null ) {
		// Prepare
		if ( $permissions === null ) {
			// Shortcut simplified
			$permissions = $action;
			$action = null;
		}
		// Get the Indentity
		$Identity = $this->getIndentity();
		// Check role
		if ( $Indentity->hasAccessor('role') && $result = $this->hasAcl($Indentiy->role, $action, $permissions) ) return $result;
		// Check name
		if ( $Indentity->hasAccessor('username') && $result = $this->hasAcl($Indentiy->username, $action, $permissions) ) return $result;
		// Check id
		if ( $Indentity->hasAccessor('id') && $result = $this->hasAcl($Indentiy->id, $action, $permissions) ) return $result;
		// Exhausted
		return false;
	}
	
}
