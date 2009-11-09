<?php

/**
 * Admin_ContentController
 *
 * @author
 * @version
 */

require_once 'Zend/Controller/Action.php';
class Admin_SubscriptionController extends Zend_Controller_Action {

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
		return $this->_forward('subscriber-list');
	}
	
	public function subscriberListAction ( ) {
		# Prepare
		$this->registerMenu('subscription-subscriber-list');
		$SubscriberListArray = array();
		$search = $this->_getParam('search', false);
		
		# Prepare
		$ListQuery = Doctrine_Query::create()
			->select('s.id, s.email, st.name, sc.id')
			->from('Subscriber s, s.Tags st, s.ContentList sc')
			->where('s.enabled = ?', true)
			->orderBy('s.email ASC')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		
		# Handle
		if ( $search ) {
			// Search
			$Query = Doctrine::getTable('Subscriber')->search($search,$ListQuery);
			$SubscriberListArray = $Query->execute();
		}
		else {
			// No Search
			$SubscriberListArray = $ListQuery->execute();
		}
		
		# Apply
		$this->view->SubscriberListArray = $SubscriberListArray;
	}
	

}
