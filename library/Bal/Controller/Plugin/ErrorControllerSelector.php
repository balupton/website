<?php
require_once 'Zend/Controller/Plugin/Abstract.php';
class Bal_Controller_Plugin_ErrorControllerSelector extends Zend_Controller_Plugin_Abstract {

	public function dispatchLoopShutdown ( Zend_Controller_Request_Abstract $request ) {
		$front = Zend_Controller_Front::getInstance();
		
		//If the ErrorHandler plugin is not registered, bail out
		if ( !($front->getPlugin('Zend_Controller_Plugin_ErrorHandler') instanceof Zend_Controller_Plugin_ErrorHandler) )
			return;
		
		$error = $front->getPlugin('Zend_Controller_Plugin_ErrorHandler');
		
		//Generate a test request to use to determine if the error controller in our module exists
		$testRequest = new Zend_Controller_Request_HTTP();
		$testRequest
			->setModuleName($request->getModuleName())
			->setControllerName($error->getErrorHandlerController())
			->setActionName($error->getErrorHandlerAction());
		
		// Does the controller even exist?
		if ( $front->getDispatcher()->isDispatchable($testRequest) ) {
			return $error->setErrorHandlerModule($testRequest->getModuleName());
		}
		
	
		//Generate a test request to use to determine if the error controller in our module exists
		$testRequest
			->setModuleName($error->getErrorHandlerModule())
			->setControllerName($error->getErrorHandlerController())
			->setActionName($error->getErrorHandlerAction());
		
		// Does the controller even exist?
		if ( $front->getDispatcher()->isDispatchable($testRequest) ) {
			return $error->setErrorHandlerModule($testRequest->getModuleName());
		}
		
	
		//Generate a test request to use to determine if the error controller in our module exists
		$testRequest
			->setModuleName('default')
			->setControllerName($error->getErrorHandlerController())
			->setActionName($error->getErrorHandlerAction());
		
		// Does the controller even exist?
		if ( $front->getDispatcher()->isDispatchable($testRequest) ) {
			$error->setErrorHandlerModule($testRequest->getModuleName());
		}
		
		
		// Done
		return;
	}
}
