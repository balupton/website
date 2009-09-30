<?php

class EventHandler extends BaseHandler {
	
	public function EventPage ( $options ) {
		// Prepare
		$Item_id = $options['Item_id'];
		
		// Check
		if ( !$this->register('event-'.$Event->id) ) {
			// We are already registered, nothing to do here...
			return true;
		}
		
		// Fetch
		$Event = Doctrine::getTable('Event')->find($Item_id);
		
		// Render
		$this->View->Event = $Event->toArray();
		$view = $this->View->render('event');
		
		// Return
		return array(
			'title' => array('Event', $Event->title),
			'view' => $view
		);
	}
	
	public function EventsWidget ( $options ) {
		// Prepare
		$page = 1;
		
		// Check
		if ( !$this->register('page-'.$page) ) {
			// We are already registered, nothing to do here...
			return true;
		}
		
		// Fetch
		$Events = Doctrine::getTable('Event')->findAll();
		
		// Render
		$this->View->Events = $Events->toArray();
		$view = $this->View->render('events');
		
		// Return
		return array(
			'title' => array('Events', 'Page '.$page),
			'view' => $view
		);
	}
	
	
}
