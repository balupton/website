<?php

class EventsController extends Zend_Controller_Action {

	public function init () {
	}
	
	public function eventsPageAction ( ) {
		// Prepare
		$Request = $this->getRequest();
		$Response = $this->getResponse();
		
		// Handle
		var_dump($Request->getParams());
		die('events found');
		
		// View
		die;
	}
	
	public function eventPageAction ( ) {
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
	
	public function eventsWidgetAction ( ) {
		
	}
	
}

