<?php

class ContentController extends Zend_Controller_Action {

	public function init () {
	}
	
	public function pageAction ( ) {
		// Request
		$Request = $this->getRequest();
		$Response = $this->getResponse();
		$Item_id = $this->_getParam('Item_id');
		$Page = Doctrine::getTable('Page')->find($Item_id);
		
		// Get the Event
		echo($Item_id.':'.$Page->title.'<br />');
		
		// Dev
		$this->view->Page = $Page->toArray();
		$Response->insert('page', $this->render('page'));
	}
	
}

