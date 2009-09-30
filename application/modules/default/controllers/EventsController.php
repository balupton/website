<?php

class EventsController extends Zend_Controller_Action {

	public function init () {
	}
	
	public function eventAction ( ) {
		// Request
		$Request = $this->getRequest();
		$Response = $this->getResponse();
		$Item_id = $this->_getParam('Item_id');
		$Event = Doctrine::getTable('Event')->find($Item_id);
		
		// Get the Event
		echo($Item_id.':'.$Event->title.'<br />');
		
		// Dev
		$this->view->Event = $Event->toArray();
		$Response->insert('event', $this->render('event'));
	}
	
}

