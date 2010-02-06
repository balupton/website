<?php
require_once 'Zend/Controller/Action.php';
class Balcms_BackController extends Zend_Controller_Action {

	# ========================
	# CONSTRUCTORS
	

	public function init ( ) {
		# Layout
		$this->getHelper('App')->getApp()->setArea('back');
		
		# Login
		$this->getHelper('App')->setOption('logged_in_forward', array('index', 'back'));
		
		# Authenticate / redirect to login if need be
		if ( !in_array($this->getRequest()->getActionName(), array(false, 'login', 'index')) ) {
			# Within unsafe area, must authenticate
			$this->getHelper('App')->authenticate(true, false);
		}
		
		# Navigation
		$this->applyNavigation();
		
		# Done
		return true;
	}
	
	public function applyNavigation ( ) {
		# Module Config
		$module_path = Zend_Controller_Front::getInstance()->getModuleDirectory('balcms');
		$module_config_path = $module_path . '/config';
		
		# Navigation
		$NavBack = file_get_contents($module_config_path . '/nav-back.json');
		$NavBack = Zend_Json::decode($NavBack, Zend_Json::TYPE_ARRAY);
		$this->view->NavigationFavorites = new Zend_Navigation($NavBack['favorites']);
		$this->view->NavigationMenu = new Zend_Navigation($NavBack['menu']);
	}

	public function activateNavigationMenuItem ( $id ) {
		return $this->getHelper('App')->getApp()->activateNavigationItem($this->view->NavigationMenu, $id);
	}

	# ========================
	# INDEX
	

	public function indexAction ( ) {
		# Redirect
		return $this->_forward('content');
	}

	/**
	 * Logout the User and redirect
	 * @return bool
	 */
	public function logoutAction ( ) {
		# Logout
		$this->getHelper('App')->logout(true);
		# Done
		return true;
	}

	/**
	 * Login the User and redirect
	 * @return bool
	 */
	public function loginAction ( ) {
		# Prepare
		$Request = $this->getRequest();
		$Log = Bal_App::getLog();
		
		# Load
		$login = $Request->getParam('login', array());
		array_keys_keep_ensure($login, array('username','password','locale','remember'));
		
		# Check
		if ( !empty($login['username']) && !empty($login['password']) ) {
			# Login
			try {
				# Prepare Login
				$username = $login['username'];
				$password = $login['password'];
				$locale = $login['locale'];
				$remember = $login['remember'];
				
				# Login and Forward
				return $this->getHelper('App')->loginForward($username, $password, $locale, $remember, false, true);
			}
			catch ( Exception $Exception ) {
				# Log the Event and Continue
				$Exceptor = new Bal_Exceptor($Exception);
				$Exceptor->log();
			}
		}
		
		# Render
		$this->getHelper('App')->getApp()->setArea('back')->setLayout('login');
		$this->render('index/login');
		
		# Done
		return true;
	}

	public function dashboardAction ( ) {
		# Prepare
		$this->activateNavigationMenuItem('back-dashboard');
		
		# Render
		$this->render('index/dashboard');
		
		# Done
		return true;
	}

	# ========================
	# SUBSCRIPTION
	

	public function subscriptionAction ( ) {
		# Redirect
		return $this->_forward('subscriber-list');
	}

	public function subscriberListAction ( ) {
		# Prepare
		$this->activateNavigationMenuItem('back-subscriber-list');
		$SubscriberList = array();
		$search = $this->_getParam('search', false);
		
		# Prepare
		$ListQuery = Doctrine_Query::create()->select('s.id, s.email, st.name, sc.id')->from('Subscriber s, s.Tags st, s.ContentList sc')->where('s.enabled = ?', true)->orderBy('s.email ASC')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		
		# Handle
		if ( $search ) {
			// Search
			$Query = Doctrine::getTable('Subscriber')->search($search, $ListQuery);
			$SubscriberList = $Query->execute();
		} else {
			// No Search
			$SubscriberList = $ListQuery->execute();
		}
		
		# Apply
		$this->view->SubscriberList = $SubscriberList;
		
		# Render
		$this->render('subscription/subscriber-list');
		
		# Done
		return true;
	}

	# ========================
	# MEDIA
	

	public function mediaAction ( ) {
		# Redirect
		return $this->_forward('media-list');
	}

	public function mediaDeleteAction ( ) {
		# Prepare
		$Media = $this->_getMedia();
		
		# Handle
		if ( $Media && $Media->exists() ) {
			$Media->delete();
		}
		
		# Redirect
		return $this->getHelper('redirector')->gotoRoute(array('action' => 'media-list'), 'back', true);
	}

	public function mediaEditAction ( ) {
		# Prepare
		$Media = array();
		
		# Save
		try {
			$Media = $this->_saveMedia();
			if ( !$Media->id ) {
				return $this->_forward('media-new');
			}
		}
		catch ( Exception $Exception ) {
			# Log the Event and Continue
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
	
		# Menu
		$this->activateNavigationMenuItem('back-media-list');
		
		# Apply
		$this->view->Media = $Media->toArray();
		
		# Render
		$this->render('media/media-edit');
		
		# Done
		return true;
	}

	public function mediaNewAction ( ) {
		# Prepare
		$Media = array();
		
		# Save
		try {
			$Media = $this->_saveMedia();
			if ( $Media->id ) {
				return $this->getHelper('redirector')->gotoRoute(array('action' => 'media-edit', 'media' => $Media->code), 'back', true);
			}
		}
		catch ( Exception $Exception ) {
			# Log the Event and Continue
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
		
		# Menu
		$this->activateNavigationMenuItem('back-media-edit');
		
		# Apply
		$this->view->Media = $Media->toArray();
		
		# Render
		$this->render('media/media-edit');
		
		# Done
		return true;
	}

	public function mediaListAction ( ) {
		# Prepare
		$this->activateNavigationMenuItem('back-media-list');
		$MediaList = array();
		$search = $this->_getParam('search', false);
		
		# Save
		try {
			$Media = $this->_saveMedia();
		}
		catch ( Exception $Exception ) {
			# Log the Event and Continue
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
		
		# Prepare
		$ListQuery = Doctrine_Query::create()->select('m.*, ma.*')->from('Media m, m.Author')->orderBy('m.code ASC')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		
		# Handle
		if ( $search ) {
			// Search
			$Query = Doctrine::getTable('Media')->search($search, $ListQuery);
			$MediaList = $Query->execute();
		} else {
			// No Search
			$MediaList = $ListQuery->execute();
		}
		
		# Apply
		$this->view->MediaList = $MediaList;
		$this->view->Media = $Media->toArray();
		
		# Render
		$this->render('media/media-list');
		
		# Done
		return true;
	}

	# ========================
	# MEDIA: GENERIC
	

	protected function _saveMedia ( $param = 'media' ) {
		# Prepare
		$Connection = Bal_App::getDataConnection();
		$Media = $this->_getMedia();
		$Log = Bal_App::getLog();
		
		# Handle
		try {
			# Fetch
			$Request = $this->_request;
			$post = $Request->getPost($param, array());
			$file = !empty($_FILES[$param]) ? $_FILES[$param] : array();
		
			# Check
			if ( (empty($post) && (empty($file) || empty($file['name']))) || is_string($post) ) {
				return $Media;
			}
			
			# Start
			$Connection->beginTransaction();
			
			# Prepare
			array_keys_keep($post, array('code', 'title', 'path', 'size', 'type', 'mimetype', 'width', 'height'));
		
			# Apply
			$Media->merge($post);
			$Media->file = $file;
			$Media->save();
		
			# Stop Duplicates
			$Request->setPost($param, $Media->code);
			
			# Finish
			$Connection->commit();
			
			# Log
			$log_details = array(
				'Media'		=> $Media->toArray(),
				'mediaUrl'	=> $this->view->getHelper('content')->getMediaUrl($Media)
			);
			$Log->log(array('log-media-save',$log_details),Bal_Log::NOTICE,array('friendly'=>true,'class'=>'success','details'=>$log_details));
		}
		catch ( Exception $Exception ) {
			# Revert
			$Connection->rollback();
			
			# Log the Event and Continue
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
		
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
		# Redirect
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
		
		# Redirect
		return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-list'), 'back', true);
	}

	public function contentEditAction ( ) {
		# Prepare
		$Content = $ContentCrumb = array();
		
		# Save
		$Content = $this->_saveContent();
		if ( !$Content->id ) {
			return $this->_forward('content-new');
		}
		$type = $Content->type;
		$this->activateNavigationMenuItem('back-' . $type . '-list');
		
		# Fetch
		$ContentArray = $Content->toArray();
		$ContentCrumb[] = $ContentArray;
		
		# Fetch content for use in dropdown
		$ContentListQuery = Doctrine_Query::create()->select('c.title, c.id, c.parent_id, c.position, cr.path')->from('Content c, c.Route cr')->where('c.enabled = ? AND c.type = ?', array(true, 'content'))->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		$ContentList = $ContentListQuery->execute();
		$ContentList = array_tree_flat($ContentList, 'id', 'parent_id', 'level', 'position');
		
		# Apply
		$this->view->type = $type;
		$this->view->ContentCrumb = $ContentCrumb;
		$this->view->ContentList = $ContentList;
		$this->view->Content = $ContentArray;
		
		# Render
		$this->render('content/content-edit');
		
		# Done
		return true;
	}

	public function contentNewAction ( ) {
		# Prepare
		$type = $this->_getParam('type', 'content');
		$this->activateNavigationMenuItem('back-' . $type . '-edit');
		$Content = $ContentCrumb = array();
		
		# Save
		try {
			$Content = $this->_saveContent();
			if ( $Content->id ) {
				return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-edit', 'content' => $Content->code), 'back', true);
			}
		}
		catch ( Exception $Exception ) {
			# Log the Event and Continue
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
		
		# Prepare
		$Content->published_at = doctrine_timestamp();
		if ( $type === 'event' ) {
			$Content->event_start_at = doctrine_timestamp();
			$Content->event_finish_at = doctrine_timestamp();
		}
		
		# Fetch
		$ContentArray = $Content->toArray();
		$ContentCrumb[] = $ContentArray;
		
		# Fetch content for use in dropdown
		$ContentListQuery = Doctrine_Query::create()->select('c.title, c.id, c.parent_id, c.position, cr.path')->from('Content c, c.Route cr')->where('c.enabled = ? AND c.type = ?', array(true, 'content'))->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		$ContentList = $ContentListQuery->execute();
		$ContentList = array_tree_flat($ContentList, 'id', 'parent_id', 'level', 'position');
		
		# Apply
		$this->view->type = $type;
		$this->view->ContentCrumb = $ContentCrumb;
		$this->view->ContentList = $ContentList;
		$this->view->Content = $ContentArray;
		
		# Render
		$this->render('content/content-edit');
		
		# Done
		return true;
	}

	public function contentListAction ( ) {
		# Prepare
		$type = $this->_getParam('type', 'content');
		$this->activateNavigationMenuItem('back-' . $type . '-list');
		$content = $this->_getParam('content', false);
		$search = $this->_getParam('search', false);
		$Content = $ContentCrumb = $ContentList = $ContentArray = array();
		
		# Prepare
		$ListQuery = Doctrine_Query::create()->select('c.*, cr.*, ct.*, ca.*, cp.*, cm.*')->from('Content c, c.Route cr, c.Tags ct, c.Author ca, c.Parent cp, c.Avatar cm')->where('c.enabled = ? AND c.type = ?', array(true, $type))->orderBy('c.position ASC, c.id ASC')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		
		# Handle
		if ( $search ) {
			// Search
			$Query = Doctrine::getTable('Content')->search($search, $ListQuery);
			$ContentList = $Query->execute();
		} else {
			// No Search
			

			# Fetch Crumbs
			if ( $content ) {
				// We have a content as a root
				$Content = $this->_getContent($content);
				$ContentArray = $Content->toArray();
				$ContentCrumb = $Content->getCrumbs(Doctrine::HYDRATE_ARRAY, true);
			}
			
			# Fetch list
			if ( $Content ) {
				// Children
				$ContentList = $ListQuery->andWhere('cp.id = ?', $Content->id)->execute();
			} else {
				// Roots
				if ( $type === 'content' )
					$ContentList = $ListQuery->andWhere('NOT EXISTS (SELECT cpc.id FROM Content cpc WHERE cpc.id = c.parent_id)')->execute();
				else
					$ContentList = $ListQuery->execute();
			}
			
			// If nothing, use us
			if ( !$ContentList && $Content ) {
				$ContentList = array($Content);
			}
		
		}
		
		# Apply
		$this->view->type = $type;
		$this->view->ContentCrumb = $ContentCrumb;
		$this->view->ContentList = $ContentList;
		$this->view->Content = $ContentArray;
		
		# Render
		$this->render('content/content-list');
		
		# Done
		return true;
	}

	public function contentPositionAction ( ) {
		# Prepare
		$Request = $this->getRequest();
		$json = json_decode($Request->getPost('json'), true);
		$positions = $json['positions'];
		
		# Handle
		try {
			$data = array('success' => false);
			if ( !empty($positions) ) {
				foreach ( $positions as $id => $position ) {
					$Content = Doctrine::getTable('Content')->find($id);
					$Content->position = $position;
					$Content->save();
				}
				$data = array('success' => true);
			}
		}
		catch ( Exception $Exception ) {
			# Log the Event and Continue
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
		
		# Respond
		$this->getHelper('json')->sendJson($data);
	}

	# ========================
	# CONTENT: GENERIC
	

	protected function _saveContent ( ) {
		# Prepare
		$Content = $this->_getContent();
		$Connection = Bal_App::getDataConnection();
		$Log = Bal_App::getLog();
		
		try {
			# Fetch
			$Request = $this->_request;
			$content = fetch_param('content');
			$subscription = fetch_param('subscription');
		
			# Check
			if ( empty($content) || is_string($content) ) {
				return $Content;
			}
		
			# Start
			$Connection->beginTransaction();
			
			# Ensure
			array_key_ensure($subscription, 'tags', '');
		
			# Prepare
			array_keys_keep_ensure($content, array('code', 'content', 'description', 'parent', 'status', 'tags', 'title', 'type'));
			$content['tags'] .= ', ' . $subscription['tags'];
		
			# Tags
			$tags = explode(',', $content['tags']);
			$tags = implode(', ', array_clean($tags));
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
			if ( $Request->getPost('content_avatar_delete') && !empty($Content->Avatar) ) {
				$Content->Avatar->delete(); // delete by user request
				$Content->Avatar = null;
			}
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
		
			# Pre Save
			if ( !$Content->id )
				$Content->save();
			
			# Relations
			$Content->setTags($tags);
		
			# Post Save
			$Content->save();
		
			# Stop Duplicates
			$Request->setPost('content', $Content->code);
			
			# Finish
			$Connection->commit();
			
			# Log
			$log_details = array(
				'Content'		=> $Content->toArray(),
				'contentUrl'	=> $this->view->getHelper('content')->getContentUrl($Content)
			);
			$Log->log(array('log-content-save',$log_details),Bal_Log::NOTICE,array('friendly'=>true,'class'=>'success','details'=>$log_details));
		}
		catch ( Exception $Exception ) {
			$Connection->rollback();
			# Log the Event and Continue
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
		
		# Done
		return $Content;
	}

	protected function _getContent ( ) {
		# Fetch
		$content = $this->_getParam('content', false);
		
		# Load
		$Query = Doctrine_Query::create()->select('c.*, cr.*, ct.*, ca.*, cp.*, cm.*')->from('Content c, c.Route cr, c.Tags ct, c.Author ca, c.Parent cp, c.Avatar cm');
		if ( is_string($content) || is_numeric($content) ) {
			$Content = $Query->where('c.code = ? OR c.id = ?', array($content,$content))->fetchOne();
		}
		
		# Check
		if ( empty($Content) ) {
			return new Content();
		}
		
		# Done
		return $Content;
	}

	# ========================
	# EVENT
	

	public function eventAction ( ) {
		# Redirect
		return $this->_forward('event-list');
	}

	public function eventDeleteAction ( ) {
		# Redirect
		return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-delete', 'type' => 'event'), 'back');
	}

	public function eventEditAction ( ) {
		# Redirect
		return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-edit', 'type' => 'event'), 'back');
	}

	public function eventNewAction ( ) {
		# Redirect
		return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-new', 'type' => 'event'), 'back');
	}

	public function eventListAction ( ) {
		# Redirect
		return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-list', 'type' => 'event'), 'back');
	}

}
