<?php

/**
 * Admin_IndexController
 *
 * @author
 * @version
 */

require_once 'Zend/Controller/Action.php';

class Admin_IndexController extends Zend_Controller_Action {

	public function init () {
		// Layout
		$this->getHelper('Layout')->setLayout('admin');
		// Navigation
		$nav = file_get_contents(CONFIG_PATH.'/nav-admin.json');
		$nav = Zend_Json::decode($nav, Zend_Json::TYPE_ARRAY);
		$this->view->NavigationFavorites = new Zend_Navigation($nav['favorites']);
		$this->view->NavigationMenu = new Zend_Navigation($nav['menu']);

	}

	public function registerMenu ( $id ) {
		$NavigationMenu = $this->view->NavigationMenu;
		$NavItem = $NavigationMenu->findBy('id',$id);
		$NavItem->parent->active = $NavItem->active = true;
	}

	public function indexAction () {
		$this->_forward('dashboard');
	}

	public function dashboardAction ( ) {
		// Prepare
		$this->registerMenu('index-dashboard');
	}

}
