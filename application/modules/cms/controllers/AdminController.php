<?php

require_once 'Zend/Controller/Action.php';
class Cms_AdminController extends Zend_Controller_Action {

	public function init ( ) {
		// Layout
		$this->getHelper('Layout')->setLayout('back-full');
		// Navigation
		$nav = file_get_contents(CONFIG_PATH . '/nav-admin.json');
		$nav = Zend_Json::decode($nav, Zend_Json::TYPE_ARRAY);
		$this->view->NavigationFavorites = new Zend_Navigation($nav['favorites']);
		$this->view->NavigationMenu = new Zend_Navigation($nav['menu']);
	
	}

	public function registerMenu ( $id ) {
		$NavigationMenu = $this->view->NavigationMenu;
		$NavItem = $NavigationMenu->findBy('id', $id);
		$NavItem->parent->active = $NavItem->active = true;
	}

	# ========================
	# INDEX
	

	public function indexAction ( ) {
		$this->_forward('content');
	}

	public function loginAction ( ) {
		$this->getHelper('layout')->setLayout('back-login');
	}

	public function dashboardAction ( ) {
		// Prepare
		$this->registerMenu('admin-dashboard');
	}

	# ========================
	# SUBSCRIPTION
	

	public function subscriptionAction ( ) {
		$this->_forward('subscriber-list');
	}

	public function subscriberListAction ( ) {
		# Prepare
		$this->registerMenu('admin-subscriber-list');
		$SubscriberListArray = array();
		$search = $this->_getParam('search', false);
		
		# Prepare
		$ListQuery = Doctrine_Query::create()->select('s.id, s.email, st.name, sc.id')->from('Subscriber s, s.Tags st, s.ContentList sc')->where('s.enabled = ?', true)->orderBy('s.email ASC')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		
		# Handle
		if ( $search ) {
			// Search
			$Query = Doctrine::getTable('Subscriber')->search($search, $ListQuery);
			$SubscriberListArray = $Query->execute();
		} else {
			// No Search
			$SubscriberListArray = $ListQuery->execute();
		}
		
		# Apply
		$this->view->SubscriberListArray = $SubscriberListArray;
		
		# Render
		$this->render('subscription/subscriber-list');
	}

	# ========================
	# MEDIA
	

	public function mediaAction ( ) {
		$this->_forward('media-list');
	}

	public function mediaDeleteAction ( ) {
		# Prepare
		$Media = $this->_getMedia();
		
		# Handle
		if ( $Media && $Media->exists() ) {
			$Media->delete();
		}
		
		# Done
		return $this->getHelper('redirector')->gotoRoute(array('action' => 'media-list'), 'admin', true);
	}

	public function mediaEditAction ( ) {
		# Prepare
		$Media = $MediaArray = array();
		
		# Save
		$Media = $this->_saveMedia();
		if ( !$Media->id ) {
			return $this->_forward('media-new');
		}
		$this->registerMenu('admin-media-list');
		
		# Fetch
		$MediaArray = $Media->toArray();
		
		# Apply
		$this->view->MediaArray = $MediaArray;
		
		# Render
		$this->render('media/media-edit');
	}

	public function mediaNewAction ( ) {
		# Prepare
		$this->registerMenu('admin-media-edit');
		$Media = $MediaArray = array();
		
		# Save
		$Media = $this->_saveMedia();
		if ( $Media->id ) {
			return $this->getHelper('redirector')->gotoRoute(array('action' => 'media-edit', 'media' => $Media->code), 'admin', true);
		}
		
		# Fetch
		$MediaArray = $Media->toArray();
		
		# Apply
		$this->view->MediaArray = $MediaArray;
		
		# Render
		$this->render('media/media-edit');
	}

	public function mediaListAction ( ) {
		# Prepare
		$this->registerMenu('admin-media-list');
		$MediaListArray = array();
		$search = $this->_getParam('search', false);
		
		# Save
		$Media = $MediaArray = array();
		$Media = $this->_saveMedia();
		$MediaArray = $Media->toArray();
		
		# Prepare
		$ListQuery = Doctrine_Query::create()->select('m.*, ma.*')->from('Media m, m.Author')->orderBy('m.code ASC')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		
		# Handle
		if ( $search ) {
			// Search
			$Query = Doctrine::getTable('Media')->search($search, $ListQuery);
			$MediaListArray = $Query->execute();
		} else {
			// No Search
			$MediaListArray = $ListQuery->execute();
		}
		
		# Apply
		$this->view->MediaListArray = $MediaListArray;
		$this->view->MediaArray = $MediaArray;
		
		# Render
		$this->render('media/media-list');
	}

	# ========================
	# MEDIA: GENERIC
	

	protected function _saveMedia ( $param = 'media' ) {
		# Prepare
		$Media = $this->_getMedia();
		
		# Fetch
		$Request = $this->_request;
		$post = $Request->getPost($param, array());
		$file = !empty($_FILES[$param]) ? $_FILES[$param] : array();
		
		# Check
		if ( (empty($post) && empty($file)) || is_string($post) ) {
			return $Media;
		}
		
		# Prepare
		array_keep($post, array('code', 'title', 'path', 'size', 'type', 'mimetype', 'width', 'height'));
		
		# Apply
		$Media->merge($post);
		$Media->file = $file;
		$Media->save();
		
		# Stop Duplicates
		$Request->setPost($param, $Media->code);
		
		# Add the saved message
		$url = $this->view->getHelper('bal')->getBaseUrl().$Media->url;
		$this->view->getHelper('message')->addMessage('<p>Updated the media <a href="' . $url . '">' . $Media->title . '</a></p>', 'updated');
		
		# Done
		return $Media;
	}

	protected function _getMedia ( ) {
		$media = $this->_getParam('media', false);
		if ( is_string($media) ) {
			$Media = Doctrine_Query::create()->select('m.*, ma.*')->from('Media m, m.Author ma')->where('m.code = ?', $media)->fetchOne();
		}
		if ( empty($Media) ) {
			return new Media();
		}
		return $Media;
	}

	# ========================
	# CONTENT
	

	public function contentAction ( ) {
		return $this->_forward('content-list');
	}

	public function contentDeleteAction ( ) {
		# Prepare
		$Content = $this->_getContent();
		# Handle
		if ( $Content && $Content->exists() ) {
			if ( isset($Content->Parent) && $Content->Parent->exists() ) {
				$code = $Content->Parent->code;
			}
			$Content->delete();
		}
		# Done
		return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-list'), 'admin', true);
	}

	public function contentEditAction ( ) {
		# Prepare
		$Content = $ContentCrumbArray = $ContentArray = array();
		
		# Save
		$Content = $this->_saveContent();
		if ( !$Content->id ) {
			return $this->_forward('content-new');
		}
		$type = $Content->type;
		$this->registerMenu('admin-' . $type . '-list');
		
		# Fetch
		$ContentArray = $Content->toArray();
		$ContentCrumbArray[] = $ContentArray;
		
		# Fetch parent
		if ( empty($ContentArray['Parent']) ) {
			$ContentArray['Parent'] = array('id' => 0);
		}
		
		# Fetch content for use in dropdown
		$ContentListQuery = Doctrine_Query::create()->select('c.title, c.id, c.parent_id, c.position, cr.path')->from('Content c, c.Route cr')->where('c.enabled = ? AND c.type = ?', array(true, 'content'))->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		$ContentListArray = $ContentListQuery->execute();
		$ContentListArray = array_tree($ContentListArray, 'id', 'parent_id', 'level', 'position');
		
		# Apply
		$this->view->type = $type;
		$this->view->ContentCrumbArray = $ContentCrumbArray;
		$this->view->ContentListArray = $ContentListArray;
		$this->view->ContentArray = $ContentArray;
		
		# Render
		$this->render('content/content-edit');
	}

	public function contentNewAction ( ) {
		# Prepare
		$type = $this->_getParam('type', 'content');
		$this->registerMenu('admin-' . $type . '-edit');
		$Content = $ContentCrumbArray = $ContentArray = array();
		
		# Save
		$Content = $this->_saveContent();
		if ( $Content->id ) {
			return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-edit', 'content' => $Content->code), 'admin', true);
		}
		
		# Prepare
		$Content->published_at = date('Y-m-d H:i:s', time());
		if ( $type === 'event' ) {
			$Content->event_start_at = date('Y-m-d H:i:s', time());
			$Content->event_finish_at = date('Y-m-d H:i:s', time());
		}
		
		# Fetch
		$ContentArray = $Content->toArray();
		$ContentCrumbArray[] = $ContentArray;
		
		# Fetch parent
		if ( empty($ContentArray['Parent']) ) {
			$ContentArray['Parent'] = array('id' => 0);
		}
		
		# Fetch content for use in dropdown
		$ContentListQuery = Doctrine_Query::create()->select('c.title, c.id, c.parent_id, c.position, cr.path')->from('Content c, c.Route cr')->where('c.enabled = ? AND c.type = ?', array(true, 'content'))->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		$ContentListArray = $ContentListQuery->execute();
		$ContentListArray = array_tree($ContentListArray, 'id', 'parent_id', 'level', 'position');
		
		# Apply
		$this->view->type = $type;
		$this->view->ContentCrumbArray = $ContentCrumbArray;
		$this->view->ContentListArray = $ContentListArray;
		$this->view->ContentArray = $ContentArray;
		
		# Render
		$this->render('content/content-edit');
	}

	public function contentListAction ( ) {
		# Prepare
		$type = $this->_getParam('type', 'content');
		$this->registerMenu('admin-' . $type . '-list');
		$content = $this->_getParam('content', false);
		$search = $this->_getParam('search', false);
		$Content = $ContentCrumbArray = $ContentListArray = $ContentArray = array();
		
		# Prepare
		$ListQuery = Doctrine_Query::create()->select('c.*, cr.*, ct.*, ca.*, cp.*')->from('Content c, c.Route cr, c.Tags ct, c.Author ca, c.Parent cp')->where('c.enabled = ? AND c.type = ?', array(true, $type))->orderBy('c.position ASC, c.id ASC')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		
		# Handle
		if ( $search ) {
			// Search
			$Query = Doctrine::getTable('Content')->search($search, $ListQuery);
			$ContentListArray = $Query->execute();
		} else {
			// No Search
			

			# Fetch Crumbs
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
			if ( $Content ) {
				// Children
				$ContentListArray = $ListQuery->andWhere('cp.id = ?', $Content->id)->execute();
			} else {
				// Roots
				if ( $type === 'content' )
					$ContentListArray = $ListQuery->andWhere('NOT EXISTS (SELECT cpc.id FROM Content cpc WHERE cpc.id = c.parent_id)')->execute();
				else
					$ContentListArray = $ListQuery->execute();
			}
			
			// If nothing, use us
			if ( !$ContentListArray && $ContentArray ) {
				$ContentListArray = array($ContentArray);
			}
		
		}
		
		# Apply
		$this->view->type = $type;
		$this->view->ContentCrumbArray = $ContentCrumbArray;
		$this->view->ContentListArray = $ContentListArray;
		$this->view->ContentArray = $ContentArray;
		
		# Render
		$this->render('content/content-list');
	}

	public function contentPositionAction ( ) {
		# Prepare
		$Request = $this->getRequest();
		$json = json_decode($Request->getPost('json'), true);
		$positions = $json['positions'];
		
		# Handle
		$data = array('success' => false);
		if ( !empty($positions) ) {
			foreach ( $positions as $id => $position ) {
				$Content = Doctrine::getTable('Content')->find($id);
				$Content->position = $position;
				$Content->save();
			}
			$data = array('success' => true);
		}
		
		# Done
		$this->getHelper('json')->sendJson($data);
	}

	# ========================
	# CONTENT: GENERIC
	

	protected function _saveContent ( ) {
		# Prepare
		$Content = $this->_getContent();
		
		# Fetch
		$Request = $this->_request;
		$content = $Request->getPost('content');
		$subscription = $Request->getPost('subscription', array());
		
		# Check
		if ( empty($content) || is_string($content) ) {
			return $Content;
		}
		
		# Ensure
		array_key_ensure($subscription, 'tags', '');
		
		# Prepare
		array_keep($content, array('code', 'content', 'description', 'parent', 'status', 'tags', 'title', 'type'));
		$content['tags'] .= ', ' . $subscription['tags'];
		
		# Tags
		$tags = implode(', ', array_clean(explode(',', $content['tags'])));
		unset($content['tags']);
		
		# Parent
		$parent = $content['parent'];
		unset($content['parent']);
		if ( $parent ) {
			$Content->Parent = Doctrine::getTable('Content')->find($parent);
		} else {
			$Content->Parent = null;
		}
		
		# Apply
		$Content->merge($content);
		
		# Avatar
		$Avatar = $this->_saveMedia('avatar');
		if ( $Avatar->id ) {
			if ( $Avatar->type !== 'image' ) {
				$Avatar->delete();
			} else {
				if ( $Content->avatar_id ) {
					$Content->Avatar->delete(); // delete the old avatar
				}
				$Content->Avatar = $Avatar;
			}
		}
		
		# Apply
		$Content->save();
		
		# Tags
		$Content->setTags($tags);
		
		# Stop Duplicates
		$Request->setPost('content', $Content->code);
		
		# Add the saved message
		$url = $this->view->getHelper('bal')->getBaseUrl('front', true) . '/' . $Content->Route->path;
		$this->view->getHelper('message')->addMessage('<p>Updated the content <a href="' . $url . '">' . $Content->title . '</a></p>', 'updated');
		
		# Done
		return $Content;
	}

	protected function _getContent ( ) {
		$content = $this->_getParam('content', false);
		if ( is_string($content) ) {
			$Content = Doctrine_Query::create()->select('c.*, cr.*, ct.*, ca.*, cp.*, cm.*')->from('Content c, c.Route cr, c.Tags ct, c.Author ca, c.Parent cp, c.Avatar cm')->where('c.code = ?', $content)->fetchOne();
		}
		if ( empty($Content) ) {
			return new Content();
		}
		return $Content;
	}

	# ========================
	# EVENT
	

	public function eventAction ( ) {
		return $this->_forward('event-list');
	}

	public function eventDeleteAction ( ) {
		return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-delete', 'type' => 'event'), 'admin');
	}

	public function eventEditAction ( ) {
		return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-edit', 'type' => 'event'), 'admin');
	}

	public function eventNewAction ( ) {
		return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-new', 'type' => 'event'), 'admin');
	}

	public function eventListAction ( ) {
		return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-list', 'type' => 'event'), 'admin');
	}

}
