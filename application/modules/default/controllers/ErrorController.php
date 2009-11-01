<?php

class ErrorController extends Zend_Controller_Action {
	
	/**
	 * Initialise our Zend Controller
	 * @return
	 */
    public function init() {
    	// Initialise Ajaxy Helper
		// $this->getHelper('Ajaxy')->configure($this, $this->view, $this->getRequest());
		$this->getHelper('Layout')->setLayout('error');
    }


	# ========================
	# ACTIONS
	
	/**
	 * Fired when an error occurs
	 * @return
	 */
    public function errorAction() {
    	// Fetch
        $errors = $this->_getParam('error_handler');
		$Exception = $errors->exception;
		$Request = $errors->request;
		$messages = array();
		
		// Determine
		switch ($errors->type) {
		    case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_CONTROLLER:
		    case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION:
				// 404 error -- controller or action not found
		        $this->getResponse()->setHttpResponseCode(404);
		        $this->view->error = 'error-404';
		        break;
			
			case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_OTHER:
				// Thrown but unkown, perhaps managed?
				// Check if doctrine
				$class = get_class($Exception);
				switch ( $class ) {
					case 'Doctrine_Validator_Exception':
						$this->view->error = 'error-doctrine-validation';
						// Fetch
						$invalidRecords = $Exception->getInvalidRecords();
						// Cycle
						foreach ( $invalidRecords as $Record ) {
							// Fetch
							$ErrorStack = $Record->getErrorStack()->toArray();
							// Cycle
							foreach ( $ErrorStack as $field => $errors ) {
								foreach ( $errors as $error ) {
									// Prepare
									$Table = $Record->getTable();
									$message = array(
										'code' => 'error-doctrine-validation-'.$error,
										'table' => strtolower($Table->getComponentName()),
										'field' => $field,
										'value' => $Record->get($field)
									);
									// Handle
									switch ( $error ) {
										case 'type':
											$type = $Table->getTypeOf($field);
											$message['type'] = $type;
											break;
										case 'length':
											$properties = $Table->getDefinitionOf($field);
											$message['length'] = $properties['length'];
										default:
											break;
									}
									// Append
									$messages[] = $message;
								}
							}
						}
						break;
					default:
						break;
				}
				
		    default:
		        // application error
		        $this->getResponse()->setHttpResponseCode(500);
				if ( empty($this->view->error) ) $this->view->error = 'error-application';
		        break;
		}
		
		// Assign
		$this->view->exception 	= $Exception;
		$this->view->request   	= $Request;
		$this->view->messages	= $messages;
		
		// Render
		$this->view->headTitle()->append('Error');
		$this->view->page = 'error';
		
		// Log the error
		$Log = Zend_Registry::get('Log');
		if ( $Log ) {
			$Log->err($errors->exception);
			$Log->info(var_export($errors->request->getParams(),true));
		}
		
    }


}

