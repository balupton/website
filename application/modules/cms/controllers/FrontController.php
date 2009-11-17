<?php

require_once 'Zend/Controller/Action.php';
class Cms_FrontController extends Zend_Controller_Action {

	# ========================
	# INDEX
	
	public function indexAction () {
		// Navigation
		die('indexACtion reached');
		$NavigationList = $this->applyNavigation();
		
		// Get Page
		$Item = $NavigationList->getFirst();
		$Item->load();
		
		// Forward
		return $this->_forward('item', null, null, array('Item'=>$Item));
	}
	
	# ========================
	# CONTENT
	
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
	
	# ========================
	# EVENTS
	
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
	
}
