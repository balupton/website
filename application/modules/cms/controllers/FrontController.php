<?php

require_once 'Zend/Controller/Action.php';
class Cms_FrontController extends Zend_Controller_Action {

	
	# ========================
	# CONSTRUCTORS
	
	public function init ( ) {
		# Layout
		$this->getHelper('Layout')->setLayout($this->getHelper('App')->getApp()->getConfig('bal.site.skin'));
		
		# Login
		$this->getHelper('App')->setOption('logged_in_forward', array('index', 'Admin'));
		
		# Authenticate
		$this->getHelper('App')->authenticate(false, false);
		
		# Navigation
		//$nav = file_get_contents(CONFIG_PATH . '/nav-admin.json');
		//$nav = Zend_Json::decode($nav, Zend_Json::TYPE_ARRAY);
		//$this->view->NavigationFavorites = new Zend_Navigation($nav['favorites']);
		//$this->view->NavigationMenu = new Zend_Navigation($nav['menu']);
		
		# Done
		return true;
	}

	public function registerMenu ( $id ) {
		$NavigationMenu = $this->view->NavigationMenu;
		$NavItem = $NavigationMenu->findBy('id', $id);
		$NavItem->parent->active = $NavItem->active = true;
	}
	
	
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
		# Prepare
		$Request = $this->getRequest();
		$Response = $this->getResponse();
		
		# Fetch
		$content_id = $this->_getParam('id');
		$Content = Doctrine::getTable('Content')->find($content_id);
		
		# Apply
		$this->view->Content = $Content->toArray();
		
		# Render
		$this->render('content/content-page');
		
		# Done
		return true;
	}
	
	
}
