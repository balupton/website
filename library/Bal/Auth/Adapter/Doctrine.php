<?php
require_once 'Zend/Auth/Adapter/Interface.php';
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
			    ->where('u.'.$this->getOption('indentityColumn').' = ? AND u.enabled = true', $this->_username);
			$User = $DQ->fetchOne();
			
			if ( empty($User) ) {
				// Invalid user
				$Result = new Zend_Auth_Result(
		            Zend_Auth_Result::FAILURE_IDENTITY_NOT_FOUND,
		            null,
		            array('The indentity could not be found')
				);
			}
			else {
				if ( $User->get($this->getOption('credentialColumn')) !== $this->_password) {
					// Invalid password
					$Result = new Zend_Auth_Result(
			            Zend_Auth_Result::FAILURE_CREDENTIAL_INVALID,
			            $User->id,
			            array('The credentials that were supplied are invalid')
					);
				}
				else {
					// Everything went well
					$Result = new Zend_Auth_Result(
			            Zend_Auth_Result::SUCCESS,
			            $User->id,
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
