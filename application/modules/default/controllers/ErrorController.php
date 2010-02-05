<?php

require_once 'Zend/Controller/Action.php';
class ErrorController extends Zend_Controller_Action {
	
	/**
	 * Initialise our Zend Controller
	 * @return
	 */
    public function init() {
    	// Initialise Ajaxy Helper
		// $this->getHelper('Ajaxy')->configure($this, $this->view, $this->getRequest());
    }


	# ========================
	# ACTIONS
	
	/**
	 * Fired when an error occurs
	 * @return
	 */
    public function errorAction() {
    	# Fetch
		$Registry = Zend_Registry::getInstance();
        $errors = $this->_getParam('error_handler');
		$Exception = $errors->exception;
		$Request = $errors->request;
		$env = $this->getInvokeArg('env');
		$messages = array();
		
		
        # Use defined error layout
        $this->getHelper('layout')->disableLayout();
        
        # Use defined error view
        $template = $this->getHelper('App')->getApp()->getConfig('bal.error.template');
        if ( $template ) {
            $this->_helper->viewRenderer($template);
        }
        
		
		# Fetch Exceptor
		$Exceptor = new Bal_Exceptor($Exception);
		
		# Handle
		$error = $Exceptor->getId();
		switch ( $error ) {
			case 'error-application-404':
		        $this->getResponse()->setHttpResponseCode(404);
				break;
			
			default:
		        $this->getResponse()->setHttpResponseCode(500);
				break;
		}
		
		# Apply
		$this->view->error = $error;
		$this->view->title = $Exceptor->getTitle();
		$this->view->messages = $Exceptor->getMessages();
		$this->view->exceptor = $Exceptor->toString();
		
		
		# Profiler
		$Profiler = isset($Registery->Profiler) ? $Registery->Profiler : null;
        
		# Assign
        $this->view->env		= $env;
		$this->view->exception 	= $Exception;
		$this->view->request   	= $Request;
		$this->view->profiler	= $Profiler;
		
		# Apply
		$this->view->headTitle()->append('Error');
		$this->view->page = 'error';
		
		# Log the error
		$Exceptor->log();
		
		# Done
		return true;
    }


}

