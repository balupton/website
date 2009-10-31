<?php
require_once 'Zend/Cotnroller/Action/Helper/Abstract.php';
class Bal_Controller_Action_Helper_Gates extends Zend_Controller_Action_Helper_Abstract {
	
	protected $_options = array(
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
	
	# -----------
	# User
	
	/** The current User */
	protected $_User = null;
	/**
	 * Fetch the specified or current User
	 * @param integer $id [optional]
	 * @return
	 */
	public function getUser ( $id = null, $id_type = 'user' ) {
		$User = null;
		if ( $id ) {
			// Custom
			switch ( $id_type ) {
				case 'applicant':
				case 'staff':
				case 'submission':
					$User = Doctrine_Query::create()
			    		->from('User u')
						->where('u.'.$id_type.'_id = ?', $id)
						->fetchOne();
					break;
				case 'user':
				default:
					$User = Doctrine::getTable('Applicant')->find($id);
					break;
			}
		} elseif ( $id === null ) {
			// Default
			if ( $this->_User !== null ) {
				// Cache
				$User = $this->_User;
			} else {
				// Fetch
				$User = $this->_User = $this->getActionController()->getHelper('Application')->getIdentity();
			}
		}
		return $User;
	}
	
	# -----------
	# Applicant
	
	protected $_Applicant = null;
	public function getApplicant ( $id = null, $refnum = null ) {
		$Applicant = null;
		// Custom
		if ( $id ) {
			// Id
			$Applicant = Doctrine::getTable('Applicant')->find($id);
		} elseif ( $refnum ) {
			// Reference
			$Applicant = Doctrine_Query::create()
	    		->from('Applicant a, a.Staff, a.Branch')
				->where('a.refnum = ?', $refnum)
				->fetchOne();
		} elseif ( $id === null && $refnum === null ) {
			// Default
			if ( $this->_Applicant ) {
				// Cache
				$Applicant = $this->_Applicant;
			} else {
				// Fetch
				$id = $this->getUser()->applicant_id;
				if ( $id ) {
					$this->_Applicant = $Applicant = Doctrine::getTable('Applicant')->find($id);
				}
			}
		}
		// Done
		return $Applicant;
	}
	
	# -----------
	# Staff
	
	protected $_Staff = null;
	public function getStaff ( $id = null ) {
		$Staff = null;
		// Custom
		if ( $id ) {
			// Id
			$Staff = Doctrine::getTable('Staff')->find($id);
		} elseif ( $id === null ) {
			// Default
			if ( $this->_Staff ) {
				// Cache
				$Staff = $this->_Staff;
			} else {
				// Fetch
				$id = $this->getUser()->staff_id;
				if ( $id ) {
					$this->_Staff = $Staff = Doctrine::getTable('Staff')->find($id);
				}
			}
		}
		// Done
		return $Staff;
	}
	
	# -----------
	# Submission
	
	protected $_Submission = null;
	public function getSubmission ( $id = null ) {
		$Submission = null;
		// Custom
		if ( $id ) {
			// Id
			$Submission = Doctrine::getTable('Submission')->find($id);
		} elseif ( $id === null ) {
			// Default
			if ( $this->_Submission ) {
				// Cache
				$Submission = $this->_Submission;
			} else {
				// Fetch
				$id = $this->getUser()->submission_id;
				if ( $id ) {
					$this->_Submission = $Submission = Doctrine::getTable('Submission')->find($id);
				}
			}
		}
		// Done
		return $Submission;
	}
	
	# -----------
	# Branch
	
	protected $_Branch = null;
	public function getBranch ( $id = null ) {
		$Branch = null;
		// Custom
		if ( $id ) {
			// Id
			$Branch = Doctrine::getTable('Branch')->find($id);
		} elseif ( $id === null ) {
			// Default
			if ( $this->_Branch ) {
				// Cache
				$Branch = $this->_Branch;
			} else {
				// Fetch
				if ( $Staff = $this->getStaff() ) {
					$Branch = $Staff->Branch;
				}
				elseif ( $Applicant = $this->getApplicant() ) {
					$Branch = $Applicant->Branch;
				}
			}
		}
		// Done
		return $Branch;
	}
}
