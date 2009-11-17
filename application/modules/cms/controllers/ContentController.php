<?php

class ContentController extends Zend_Controller_Action {

	public function init () {
	}
	
	public function contentPageAction ( ) {
		// Prepare
		$Request = $this->getRequest();
		$Response = $this->getResponse();
		
		// Fetch
		$content_id = $this->_getParam('id');
		$Content = Doctrine::getTable('Content')->find($content_id);
		
		// Display
		echo($content_id.':'.$Content->title.'<br />');
		die;
		
		// Dev
		$this->view->Content = $Item->toArray();
	}
	
}

