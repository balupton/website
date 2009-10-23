<?php

/**
 * Admin_ContentController
 *
 * @author
 * @version
 */

require_once 'Zend/Controller/Action.php';

class Admin_ContentController extends Zend_Controller_Action {

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
		return $this->_forward('content-list');
	}

	public function contentNewAction ( ) {
		$this->registerMenu('content-new');
	}

	public function contentListAction ( ) {
		# Prepare
		$content = $this->_getParam('content', false);
		$Content = $ContentCrumbArray = $ContentListArray = $ContentArray = array();
		$this->registerMenu('content-list');
		# Fetch Crumbs
		// Check
		if ( $content ) {
			// We have a content as a root
			$Content = Doctrine_Query::create()
				->select('c.*, cr.*, ct.*, ca.*')
				->from('Content c, c.Route cr, c.Tags ct, c.Author ca')
				->where('c.code = ?', $content)
				->fetchOne();
			$ContentArray = $Content->toArray();
			// Customise Tree Handling
			$Query = Doctrine_Query::create()
				->select('c.*')
				->from('Content c');
			$Tree = Doctrine::getTable('Content')->getTree();
			$Tree->setBaseQuery($Query);
			// Fetch Content Crumbs
			$ContentCrumbArray = array();
			$Temp = $Content; while ( $Temp = $Temp->getNode()->getParent() ) {
				$ContentCrumbArray[] = $Temp->toARray();
			}
			$ContentCrumbArray[] = $ContentArray;
			// Reset Tree
			$Tree->resetBaseQuery();
		}

		# Fetch Content
		// Customise Tree Handling
		$Query = Doctrine_Query::create()
			->select('c.*, cr.*, ct.*, ca.*')
			->from('Content c, c.Route cr, c.Tags ct, c.Author ca')
			->where('c.enabled = true AND c.system = false')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		$Tree = Doctrine::getTable('Content')->getTree();
		$Tree->setBaseQuery($Query);
		// Fetch
		if( $Content ) {
			$ContentListArray = $Content->getNode()->getChildren();
		} else {
			$ContentListArray = $Tree->fetchRoots();
		}
		if ( !$ContentListArray && $ContentArray ) {
			$ContentListArray = array($ContentArray);
		}
		// Reset Tree
		$Tree->resetBaseQuery();

		# Finish
		// Release
		//$Content->free();
		// Apply
		$this->view->ContentCrumbArray = $ContentCrumbArray;
		$this->view->ContentListArray = $ContentListArray;
		$this->view->ContentArray = $ContentArray;
	}


}
