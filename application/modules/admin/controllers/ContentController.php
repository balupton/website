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
	
	public function contentDeleteAction ( ) {
		# Prepare
		$code = null;
		$Content = $this->_getContent();
		# Handle
		if ( $Content && $Content->exists() ) {
			if ( isset($Content->Parent) && $Content->Parent->exists() ) {
				$code = $Content->Parent->code;
			}
			$Content->delete();
		}
		# Done
		return $this->getHelper('redirector')->gotoRoute(array(
			'controller'	=> 'content',
			'action'		=> 'content-list',
			'code'			=> $code
		), 'admin', true);
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
		if ( empty($ContentArray['Parent']) ) {
			$ContentArray['Parent'] = array('id'=>0);
		}
		
		# Fetch content for use in dropdown
		$ContentListQuery = Doctrine_Query::create()
			->select('c.title, c.id, c.parent_id, c.position, cr.path')
			->from('Content c, c.Route cr')
			->where('c.enabled = true AND c.system = false')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		$ContentListArray = $ContentListQuery->execute();
		$ContentListArray = array_tree($ContentListArray,'id','parent_id','level','position');
		
		# Apply
		$this->view->ContentCrumbArray = $ContentCrumbArray;
		$this->view->ContentListArray = $ContentListArray;
		$this->view->ContentArray = $ContentArray;
	}
	
	public function contentPositionAction ( ) {
		# Prepare
		$Request = $this->getRequest();
		$json = json_decode($Request->getPost('json'), true);
		$positions = $json['positions'];
		
		# Handle
		$data = array('success'=>false);
		if ( !empty($positions) ) {
			foreach ( $positions as $id => $position ) {
				$Content = Doctrine::getTable('Content')->find($id);
				$Content->position = $position;
				$Content->save();
			}
			$data = array('success'=>true);
		}
		
		# Done
		$this->getHelper('json')->sendJson($data);
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
		if ( $parent ) {
			$Content->Parent = Doctrine::getTable('Content')->find($parent);
		} else {
			$Content->Parent = null;
		}
		
		# Avatar
		unset($content['avatar']);
		
		# Apply
		$Content->merge($content);
		$Content->save();
		
		# Tags
		$Content->setTags($tags);
		
		# Stop Duplicates
		$Request->setPost('content', $Content->code);
		
		# Done
		return $Content;
	}
	
	protected function _getContent(){
		$content = $this->_getParam('content', false);
		if ( is_string($content) ) {
			$Content = Doctrine_Query::create()
				->select('c.*, cr.*, ct.*, ca.*, cp.*')
				->from('Content c, c.Route cr, c.Tags ct, c.Author ca, c.Parent cp')
				->where('c.code = ?', $content)
				->fetchOne();
		}
		if ( empty($Content) ) {
			return new Content();
		}
		return $Content;
	}
	
	public function contentListAction ( ) {
		# Prepare
		$this->registerMenu('content-content-list');
		$content = $this->_getParam('content', false);
		$search = $this->_getParam('search', false);
		$Content = $ContentCrumbArray = $ContentListArray = $ContentArray = array();
		
		# Prepare
		$ListQuery = Doctrine_Query::create()
			->select('c.*, cr.*, ct.*, ca.*, cp.*')
			->from('Content c, c.Route cr, c.Tags ct, c.Author ca, c.Parent cp')
			->where('c.enabled = ? AND c.system = ?', array(true,false))
			->orderBy('c.position ASC, c.id ASC')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		
		# Handle
		if ( $search ) {
			// Search
			$Query = Doctrine::getTable('Content')->search($search,$ListQuery);
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
				
				// Fetch Crumbs
				$ContentCrumbArray = array();
				$Crumb = $Content;
				while ( $Crumb->parent_id ) {
					$Crumb = $Crumb->Parent;
					$ContentCrumbArray[] = $Crumb->toArray();
				}
				
				// Let us be the last crumb
				$ContentCrumbArray[] = $ContentArray;
			}
			
			
			# Fetch list
			
			// Fetch
			if( $Content ) {
				// Children
				$ContentListArray = $ListQuery->andWhere('cp.id = ?',$Content->id)->execute();
			} else {
				// Roots
				$ContentListArray = $ListQuery->andWhere('NOT EXISTS (SELECT cpc.id FROM Content cpc WHERE cpc.id = c.parent_id)')->execute();
			}
			
			// If nothing, use us
			if ( !$ContentListArray && $ContentArray ) {
				$ContentListArray = array($ContentArray);
			}
			
		}
		
		# Apply
		$this->view->ContentCrumbArray = $ContentCrumbArray;
		$this->view->ContentListArray = $ContentListArray;
		$this->view->ContentArray = $ContentArray;
	}


}
