<?php

class PageHandler extends BaseHandler {
	
	public function postComment ( ) {
		// Post a Comment
		$comment = $this->Controller->getRequest()->getParam('comment');
		if ( empty($comment) ) return true;
		
		// Create the Comment
		$Comment = new Comment();
		$Comment->merge($comment);
		
		// Apply the Comment
		$Comment->save();
		
		// Return the Comment
		return $Comment;
	}
	
	public function ContentPage ( $options ) {
		// Prepare
		$Item_id = $options['Item_id'];
		
		// Actions
		$this->postComment();
		
		// Check
		if ( !$this->register('page-'.$Event->id) ) {
			// We are already registered, nothing to do here...
			return true;
		}
		
		// Fetch
		$Page = Doctrine::getTable('Page')->find($Item_id);
		
		// Render
		$this->View->Page = $Page->toArray();
		$view = $this->View->render('page');
		
		// Return
		return array(
			'title' => array('Page', $Page->title),
			'view' => $view
		);
	}
	
}
