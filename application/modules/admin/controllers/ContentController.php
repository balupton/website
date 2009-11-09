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

	public function contentEditAction ( ) {
		# Prepare
		$this->registerMenu('content-content-list');
		$Content = $ContentCrumbArray = $ContentArray = array();
		
		# Save
		$Content = $this->_saveContent();
		if ( !$Content->id ){
			return $this->_forward('content-new');
		}
		
		# Fetch
		$ContentArray = $Content->toArray();
		$ContentCrumbArray[] = $ContentArray;
		
		# Fetch parent
		$ContentParent = $Content->getNode()->getParent();
		if ( $ContentParent && $ContentParent->exists() ) {
			$ContentArray['Parent'] = array('id'=>$Content->getNode()->getParent()->id);
		} else {
			$ContentArray['Parent'] = array('id'=>0);
		}
		
		# Fetch content for use in dropdown
		$ContentListQuery = Doctrine_Query::create()
			->select('c.title, c.root_id, c.level, c.id, cr.path')
			->from('Content c, c.Route cr')
			->where('c.enabled = true AND c.system = false')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		$ContentListArray = $ContentListQuery->execute();
		
		# Apply
		$this->view->ContentCrumbArray = $ContentCrumbArray;
		$this->view->ContentListArray = $ContentListArray;
		$this->view->ContentArray = $ContentArray;
	}

	public function contentNewAction ( ) {
		# Prepare
		$this->registerMenu('content-content-edit');
		$Content = $ContentCrumbArray = $ContentArray = array();
	
		# Save
		$Content = $this->_saveContent();
		if ( $Content->id ){
			return $this->getHelper('redirector')->gotoRoute(array(
				'controller'	=> 'content',
				'action'		=> 'content-edit',
				'content'		=> $Content->code
			), 'admin');
		}
		
		# Fetch
		$Content->published_at = date('Y-m-d H:i:s', time());
		$ContentArray = $Content->toArray();
		$ContentCrumbArray[] = $ContentArray;
		
		# Fetch parent
		$ContentArray['Parent'] = array('id'=>0);
		
		# Fetch content for use in dropdown
		$ContentListQuery = Doctrine_Query::create()
			->select('c.title, c.root_id, c.level, c.id, cr.path')
			->from('Content c, c.Route cr')
			->where('c.enabled = true AND c.system = false')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		$ContentListArray = $ContentListQuery->execute();
		
		# Apply
		$this->view->ContentCrumbArray = $ContentCrumbArray;
		$this->view->ContentListArray = $ContentListArray;
		$this->view->ContentArray = $ContentArray;
	}
	
	protected function _saveContent(){
		# Prepare
		$Content = $this->_getContent();
		
		# Fetch
		$Request = $this->_request;
		$content = $Request->getPost('content');
		$subscription = $Request->getPost('subscription', array());
		$content_files = !empty($_FILES['content']) ? $_FILES['content'] : array();
		
		# Check
		if ( empty($content) || is_string($content) ) {
			return $Content;
		}
		
		# Ensure
		array_key_ensure($subscription, 'tags', '');
		array_key_ensure($content_files, 'avatar', '');
		
		# Prepare
		array_keep($content, array('code','content','description','parent','status','tags','title'));
		$content['tags'] .= ', '.$subscription['tags'];
		$content['avatar'] = $content_files['avatar'];
		
		# Tags
		$tags = implode(', ',array_clean(explode(',',$content['tags'])));
		unset($content['tags']);
		
		# Parent
		$parent = $content['parent'];
		unset($content['parent']);
		
		# Avatar
		unset($content['avatar']);
		
		# Apply
		$Content->merge($content);
		$Content->save();
		
		# Tags
		$Content->setTags($tags);
		
		# Parent
		if ( empty($parent) ) {
			$treeObject = Doctrine_Core::getTable('Content')->getTree();
			$treeObject->createRoot($Content);
		} else {
			$Parent = Doctrine::getTable('Content')->find($parent);
			$Content->getNode()->moveAsLastChildOf($Parent);
		}
		$Content->save();
		
		# Stop Duplicates
		$Request->setPost('content', $Content->code);
		
		# Done
		return $Content;
	}
	
	protected function _getContent(){
		$content = $this->_getParam('content', false);
		if ( !$content || !is_string($content) ) {
			// No content
			return new Content();
		}
		$Content = Doctrine_Query::create()
			->select('c.*, cr.*, ct.*, ca.*')
			->from('Content c, c.Route cr, c.Tags ct, c.Author ca')
			->where('c.code = ?', $content)
			->fetchOne();
		return $Content;
	}
	
	public function contentListAction ( ) {
		# Prepare
		$this->registerMenu('content-content-list');
		$content = $this->_getParam('content', false);
		$search = $this->_getParam('search', false);
		$Content = $ContentCrumbArray = $ContentListArray = $ContentArray = array();
		
		# Prepare
		// Base Query
		$BaseQuery = Doctrine_Query::create()
			->select('c.*, cr.*, ct.*, ca.*')
			->from('Content c, c.Route cr, c.Tags ct, c.Author ca')
			->where('c.enabled = true AND c.system = false')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		
		# Handle
		// Check
		if ( $search ) {
			// Search
			$Query = Doctrine::getTable('Content')->search($search,$BaseQuery);
			//die($Query->getSqlQuery());
			$ContentListArray = $Query->execute();
		}
		else {
			// No Search
			
			# Fetch Crumbs
			
			// Check
			if ( $content ) {
				// We have a content as a root
				$Content = $this->_getContent($content);
				$ContentArray = $Content->toArray();
				
				// Customise Tree Handling
				$Query = Doctrine_Query::create()
					->select('c.title, c.code')
					->from('Content c');
				$Tree = Doctrine::getTable('Content')->getTree();
				$Tree->setBaseQuery($Query);
				
				// Fetch Content Crumbs
				$ContentCrumbArray = array();
				$Temp = $Content; while ( $Temp = $Temp->getNode()->getParent() ) {
					$ContentCrumbArray[] = $Temp->toArray();
				}
				$ContentCrumbArray[] = $ContentArray;
				
				// Reset Tree
				$Tree->resetBaseQuery();
			}
			
			
			# Fetch Content Tree
			
			// Customise Tree Handling
			$Tree = Doctrine::getTable('Content')->getTree();
			$Tree->setBaseQuery($BaseQuery);
			
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
			
		}
		
		# Apply
		$this->view->ContentCrumbArray = $ContentCrumbArray;
		$this->view->ContentListArray = $ContentListArray;
		$this->view->ContentArray = $ContentArray;
	}


}
