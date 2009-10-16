<?php

class IndexController extends Zend_Controller_Action {

	public function init () {
		// Layout
		$this->getHelper('Layout')->setLayout('simple');
	}
	
	public function debugAction ( ) {
		echo '<pre>';
		var_dump($Request->getParams());
		echo '</pre>';
	}
	
	public function contentPageAction ( ) {
		die('contentPage reached');
		
	}
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
	
	/*
	public function itemAction ( ) {
		// Navigation
		$NavigationList = $this->applyNavigation();
		
		// Fetch
		$Item = $this->_getParam('Item');
		if ( !$Item && ($item = $this->_getParam('item')) ) {
			$Item = Doctrine::getTable('Item')->findOneByCode($item);
		}
		
		// Check
		if ( !$Item->id ) throw new Exception('error-page-404');
		if ( $Item->status !== 'published' ) throw new Exception('error-page-hidden');
		
		// Specific
		switch ( true ) {
			case $Item->hasFeature('collection'):
				$tags = $types = array();
				$Types = $Item->FilteredTypes;	foreach ( $Types as $Type ) $types[] = $Type->code;
				$Tags = $Item->FilteredTags;	foreach ( $Tags as $Tag ) $tags[] = $Tag->code;
				$ItemList_Items = Doctrine::getTable('Item')->createQuery();
				if ( !empty($types) ) $ItemList_Items->whereIn('Item.type', $types);
				if ( !empty($types) ) $ItemList_Items->whereIn('Item.type', $types);
					->whereIn('Item.type', $types)
					->execute();
				$this->view->ItemList_Items = $ItemList_Items;
				break;
			case $Item->hasFeature('comment'):
				$Item_Comments = Doctrine::getTable('Item_Comment')->createQuery()
					->where('Item_Comment.comment_parent_Item_id = ?', $Item->id)
					->execute();
				$this->view->Item_Comments = $Item_Comments;
				break;
			default:
				break;
		}
		
		// Assign
		$this->view->Item = $Item;
		
		// Done
		return true;
	}
	
	public function commentAction ( ) {
		// Post a comment
		
	}
	
	protected function applyNavigation ( ) {
		// Check
		if ( !empty($this->view->NavigationMap) ) return;
		
		// Perform
		$NavigationList = Doctrine::getTable('Item')->createQuery()
			->select('id, code, title, nav_parent')
			->where('Item.nav_parent IS NOT NULL')
			->andWhere('Item.status = ?', 'published')
			->orderBy('Item.nav_parent ASC, Item.published DESC')
			->execute();
		
		// Generate
		$NavigationMap = array();
		foreach ( $NavigationList as $Item ) {
			$NavigationMap[$Item->nav_parent][] = $Item;
		}
		
		// Apply
		$this->view->NavigationMap = $NavigationMap;
		$this->view->NavigationList = $NavigationList;
		
		// Return ItemList
		return $NavigationList;
	}
	*/
}

