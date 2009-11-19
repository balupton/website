<?php

require_once 'Zend/Controller/Action.php';
class Cms_FrontController extends Zend_Controller_Action {

	# ========================
	# INDEX
	
	public function indexAction () {
		# Get Index Page
		$Content = Doctrine::getTable('Content')->createQuery()->where('enabled = ? AND status = ?', array(true,'published'))->orderBy('position ASC, id ASC')->setHydrationMode(Doctrine::HYDRATE_ARRAY)->fetchOne();
		$content = $Content['id'];
		
		# Forward
		return $this->_forward('content-page', null, null, array('id'=>$content));
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
	
	
}
