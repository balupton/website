<?php
require_once 'Zend/Controller/Action.php';
class Balcms_BackController extends Zend_Controller_Action {

	# ========================
	# VARIABLES
	
	const MODULE = 'Balcms';
	
	
	# ========================
	# CONSTRUCTORS
	
	/**
	 * Initialise
	 * @return
	 */
	public function init ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$App->prepareLog();
		$actionName = $this->getRequest()->getActionName();
		
		# Layout
		$App->setArea('back');
		
		# Login
		$App->setOption('logged_in_forward',  array(array('action'=>'dashboard'),'back',true))
			->setOption('logged_out_forward', array(array('action'=>'login'),'back',true))
			;
		
		# Authenticate / redirect to login if need be
		if ( in_array($actionName, array(false, 'login', 'index')) ) {
			# Within Safe Area, Authenticate WITHOUT Redirects
			$App->authenticate(false, false);
		} else {
			# Outside Safe Area, Authenticate WITH Redirects
			$App->authenticate(true, false);
			
			# Check Permission Access For Admin Area
			try {
				$User = $App->getUser();
				if ( delve($User,'id') && !$App->hasPermission('permission-admin') ) {
					# Log
					$Log = Bal_App::getLog();
					$log_details = array(
						'User' => $User->toArray(false),
						'base_url' => $App->getBaseUrl(),
						'front_url' => $App->getAreaUrl('front'),
						'back_url' => $App->getAreaUrl('back')
					);
					$Log->log(array('log-admin-permission',$log_details),Bal_Log::ERR,array('friendly'=>true,'details'=>$log_details));
					
					# Logout
					$this->getHelper('redirector')->goToRoute(array('action'=>'login'),'back',true);
					//$App->logout(true);
					// ^ Don't log them out, just redirect them back to the login page
				}
			}
			catch ( Exception $Exception ) {
				# Log the Event and Continue
				$Exceptor = new Bal_Exceptor($Exception);
				$Exceptor->log();
			}
		}
		
		# Navigation
		$App->applyNavigation();
		
		# Done
		return true;
	}
	
	
	# ========================
	# INDEX
	

	public function indexAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Redirect
		return $App->authenticate(true, true);
	}

	/**
	 * Logout the User and redirect
	 * @return bool
	 */
	public function logoutAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Logout
		$App->logout(true);
		
		# Done
		return true;
	}

	/**
	 * Login the User and redirect
	 * @return bool
	 */
	public function loginAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Request = $this->getRequest();
		
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
				return $App->loginForward($username, $password, $locale, $remember, false, true);
			}
			catch ( Exception $Exception ) {
				# Log the Event and Continue
				$Exceptor = new Bal_Exceptor($Exception);
				$Exceptor->log();
			}
		}
		
		# Render
		$App->setArea('back')->setLayout('login');
		$this->render('index/login');
		
		# Done
		return true;
	}

	public function dashboardAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$App->activateNavigationItem('back.main', 'dashboard-dashboard', true);
		
		# Render
		$this->render('index/dashboard');
		
		# Done
		return true;
	}


	# ========================
	# CRUD
	

	public function crudAction ( ) {
		# Redirect
		return $this->_forward('crud-list');
	}

	public function crudListAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Request = $this->getRequest();
		$ItemList = array();
		
		# Prepare Type
		$type = $Request->getParam('type');
		$typeLower = strtolower($type);
		$Table = Bal_Form_Doctrine::getTable($type);
		$tableName = Bal_Form_Doctrine::getTableName($type);
		
		# Menu
		$App->activateNavigationItem('back.main', 'crud-list-'.$typeLower, true);
		
		
		# Search
		$search = $App->fetchSearch();
		$searchQuery = delve($search,'query');
		$this->view->search = $search;
		
		# Fields
		$fields = Bal_Form_Doctrine::fetchListingFields($tableName);
		$labelFieldName = $fields[0];
		
		# Prepare
		$ListQuery = $Table->createQuery()
			->select('*')
			->orderBy($labelFieldName.' ASC')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY)
			;
		
		# Add Field Relations to Query
		foreach ( $fields as $field ) {
			if ( $Table->hasRelation($field) ) {
				$ListQuery
					->addSelect('c'.$field.'.*')
					->addFrom($tableName.'.'.$field.' c'.$field)
					;
			}
		}
		
		# Handle
		if ( $searchQuery ) {
			// Search
			if ( method_exists($Table,'search') ) {
				$Query = $Table->search($searchQuery, $ListQuery);
			} else {
				$Query = $ListQuery->andWhere($labelFieldName.' LIKE ?', '%'.$searchQuery.'%');
			}
			$ItemList = $Query->execute();
		} else {
			// No Search
			$ItemList = $ListQuery->execute();
		}
		
		# Permissions
		$ItemListEditable = $App->hasNavigationItem('back.main', 'crud-new-'.$typeLower, true);
		$ItemListDeletable = true;
		
		
		# Apply
		$this->view->ItemListEditable = $ItemListEditable;
		$this->view->ItemListDeletable = $ItemListDeletable;
		$this->view->ItemListFields = $fields;
		$this->view->ItemList = $ItemList;
		$this->view->type = $type;
		
		
		# Render
		$this->render('crud/crud-list');
		
		# Done
		return true;
	}
	
	public function crudEditAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Request = $this->getRequest();
		$Item = array();
		
		# Prepare Type
		$type = $Request->getParam('type');
		$typeLower = strtolower($type);
		$Table = Bal_Form_Doctrine::getTable($type);
		$tableName = Bal_Form_Doctrine::getTableName($type);
		
		# Fetch
		$Item = $App->saveItem($type);
		
		# Menu
		$App->activateNavigationItem('back.main', 'crud-'.($Item->id?'list':'new').'-'.$typeLower, true);
		
		
		# Form
		$Form = Bal_Form_Doctrine::fetchForm($tableName,$Item);
		$Form
			->setAction('')
			->setMethod('post')
			->addElement('submit', '__submit__', array('class'=>'button-primary','label'=>'Save Changes'));
		
		# Apply
		$this->view->Item = $Item;
		$this->view->type = $type;
		$this->view->Form = $Form;
		
		
		# Render
		$this->render('crud/crud-edit');
		
		# Done
		return true;
	}
	
	public function crudNewAction ( ) {
		# Redirect
		return $this->_forward('crud-edit');
	}
	
	public function crudDeleteAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Request = $this->getRequest();
		$type = $Request->getParam('type');
		
		# Delete
		$App->deleteItem($type);
		
		# Redirect
		return $this->getHelper('redirector')->gotoRoute(array('action'=>'crud-list','type'=>$type), 'back', true);
	}
	
	
	# ========================
	# USER
	

	public function userAction ( ) {
		# Redirect
		return $this->_forward('user-list');
	}

	public function userListAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$App->activateNavigationItem('back.main', 'user-list', true);
		$Identity = $App->getUser();
		$UserList = array();
		
		# Search
		$search = $App->fetchSearch();
		$searchQuery = delve($search,'query');
		$this->view->search = $search;
		
		# Prepare
		$ListQuery = Doctrine_Query::create()
			->select('u.id, u.displayname, u.username, u.created_at, u.email, u.type, u.status, u.created_at, ua.*')
			->from('User u, u.Avatar ua')
			->where('u.level <= ?', $Identity->level)
			->orderBy('u.username ASC')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		
		# Handle
		if ( $searchQuery ) {
			// Search
			$Query = Doctrine::getTable('User')->search($searchQuery, $ListQuery);
			$UserList = $Query->execute();
		} else {
			// No Search
			$UserList = $ListQuery->execute();
		}
		
		# Apply
		$this->view->UserList = $UserList;
		
		# Render
		$this->render('user/user-list');
		
		# Done
		return true;
	}
	
	public function userEditAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Identity = $App->getUser();
		$type = 'user';
		
		# Fetch
		$User = $this->_getUser();
		if ( $User->level > $Identity->level ) {
			throw new Zend_Exception('error-user-level');
		}
		
		# Apply
		$User = $this->_saveUser($User, null, null, array('password'));
		$App->activateNavigationItem('back.main', 'user-'.($User->id ? 'list' : 'new'), true);
		
		# Form
		$Form = Bal_Form_Doctrine::fetchForm('User',$User);
		$Form
			->setAction('')
			->setMethod('post')
			->addElement('submit', '__submit__', array('class'=>'button-primary','label'=>'Save Changes'));
		
		# Apply
		$this->view->User = $User;
		$this->view->type = $type;
		$this->view->Form = $Form;
		
		# Render
		$this->render('user/user-edit');
		
		# Done
		return true;
	}
	
	public function userNewAction ( ) {
		# Redirect
		return $this->_forward('user-edit');
	}
	
	public function userDownloadAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Identity = $App->getUser();
		
		# Prepare Fetch
		$Table = Doctrine::getTable('User');
		$fields = $Table->getFieldNames();
		
		# Query
		$ListQuery = Doctrine_Query::create()
			->select('u.*')
			->from('User u')
			->where('u.level <= ?', $Identity->level)
			->orderBy('u.username ASC')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY);
			
		# Fetch
		$Users = $ListQuery->execute();
		
		# Create csv
		$csv = prepare_csv_content($fields, $Users);
		$filename = 'users.csv';
		
		# Download file
		become_file_download($csv, null, null, $filename);
		die;
	}
	
	public function userDeleteAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Identity = $App->getUser();
		
		# Fetch
		$User = $this->_getUser();
		if ( $User->level > $Identity->level ) {
			throw new Zend_Exception('error-user-level');
		}
		
		# Delete
		$App->deleteItem('User', $User);
		
		# Redirect
		return $this->getHelper('redirector')->gotoRoute(array('action'=>'user-list'), 'back', true);
	}
	
	/**
	 * Login the User and redirect
	 * @return bool
	 */
	public function userLoginAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Identity = $App->getUser();
		
		# Login
		try {
			# Fetch
			$User = $this->_getUser();
			if ( $User->level > $Identity->level ) {
				throw new Zend_Exception('error-user-level');
			}
			
			# Login
			$App->loginUser($User);
			$App->authenticate(true,true);
		}
		catch ( Exception $Exception ) {
			# Log the Event and Continue
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
		
		# Redirect
		return $this->_forward('user-list');
	}
	
	# ========================
	# SUBSCRIPTION
	

	public function subscriptionAction ( ) {
		# Redirect
		return $this->_forward('subscriber-list');
	}

	public function subscriberListAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$App->activateNavigationItem('back.main', 'subscriber-list', true);
		$SubscriberList = array();
		
		# Search
		$search = $App->fetchSearch();
		$searchQuery = delve($search,'query');
		$this->view->search = $search;
		
		# Prepare
		$ListQuery = Doctrine_Query::create()
			->select('s.id, s.email, s.displayname, s.subscriptions, st.name, s.status, s.created_at, COUNT(sMessagePublished.id) as subscription_published_count')
			->from('User s, s.SubscriptionTags st')
			->where('s.status = ?', 'published')
			->andWhere('s.subscriptions != ?', '')
			->orderBy('s.email ASC')
			->leftJoin('s.ReceivedMessages sMessagePublished WITH sMessagePublished.template = ? AND sMessagePublished.status = ?', array('content-subscription','published'))
			->groupBy('s.id')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		
		# Handle
		if ( $searchQuery ) {
			// Search
			$Query = Doctrine::getTable('Subscriber')->search($searchQuery, $ListQuery);
			$SubscriberList = $Query->execute();
		} else {
			// No Search
			$SubscriberList = $ListQuery->execute();
		}
		
		# Apply
		$this->view->SubscriberList = $SubscriberList;
		
		# Render
		$this->render('user/subscriber-list');
		
		# Done
		return true;
	}

	# ========================
	# MEDIA
	

	public function mediaAction ( ) {
		# Redirect
		return $this->_forward('media-file-list');
	}
	
	public function mediaFileDeleteAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Delete
		$App->deleteItem('File');
		
		# Redirect
		return $this->getHelper('redirector')->gotoRoute(array('action'=>'media-file-list'), 'back', true);
	}
	
	public function mediaFileEditAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$App->activateNavigationItem('back.main', 'file-list', true);
		
		# Prepare
		$File = array();
		
		# Save
		try {
			$File = $this->_saveFile();
			if ( !$File->id ) {
				# No File
				return $this->_redirect('media-file-new');
			}
			elseif ( !delve('file.id') && $File->id ) {
				# New File
				return $this->getHelper('redirector')->gotoRoute(array('action' => 'media-file-edit', 'file' => $File->code), 'back', true);
			}
		}
		catch ( Exception $Exception ) {
			# Log the Event and Continue
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
		
		# Apply
		$this->view->File = $File;
		
		# Render
		$this->render('midia/file-edit');
		
		# Done
		return true;
	}
	
	public function mediaFileListAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$App->activateNavigationItem('back.main', 'media-file-list', true);
		$FileList = array();
		
		# Search
		$search = $App->fetchSearch();
		$searchQuery = delve($search,'query');
		$this->view->search = $search;
		
		# Save
		try {
			$File = $this->_saveFile();
			if ( is_object($File) )
			$this->view->File = $File->toArray();
		}
		catch ( Exception $Exception ) {
			# Log the Event and Continue
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
		
		# Prepare
		$ListQuery = Doctrine_Query::create()->select('m.*, ma.*')->from('File m, m.Author')->orderBy('m.code ASC')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		
		# Handle
		if ( $searchQuery ) {
			// Search
			$Query = Doctrine::getTable('File')->search($searchQuery, $ListQuery);
			$FileList = $Query->execute();
		} else {
			// No Search
			$FileList = $ListQuery->execute();
		}
		
		# Apply
		$this->view->FileList = $FileList;
		
		# Render
		$this->render('media/file-list');
		
		# Done
		return true;
	}
	
	# ========================
	# CONTENT
	
	
	public function contentAction ( ) {
		# Redirect
		return $this->_forward('content-list');
	}

	public function contentDeleteAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Delete
		$Content = $App->deleteItem('Content');
		$content = delve($Content,'Parent.code');
		
		# Redirect
		return $this->getHelper('redirector')->gotoRoute(array('action'=>'content-list','content'=>$content), 'back', true);
	}
	
	public function getContentList ( ) {
		# Fetch
		$ContentListQuery = Doctrine_Query::create()->select('c.title, c.id, c.Parent_id, c.position, cr.path')->from('Content c, c.Route cr')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		$ContentList = $ContentListQuery->execute();
		$ContentList = array_tree_flat($ContentList, 'id', 'Parent_id', 'level', 'position');
		
		# Done
		return $ContentList;
	}

	public function contentEditAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Content = $ContentCrumbs = array();
		
		# Save
		$Content = $this->_saveContent();
		if ( !$Content->id ) {
			return $this->_forward('content-new');
		}
		$type = $Content->type;
		
		# Menu
		$App->activateNavigationItem('back.main', $type.'-list', true);
		
		# Fetch
		$ContentArray = $Content->toArray(true);
		$ContentCrumbs[] = $ContentArray;
		
		# Fetch content for use in dropdown
		$ContentList = $this->getContentList();
		
		# Apply
		$this->view->type = $type;
		$this->view->ContentCrumbs = $ContentCrumbs;
		$this->view->ContentList = $ContentList;
		$this->view->Content = $Content;
		
		# Render
		$this->render('content/content-edit');
		
		# Done
		return true;
	}

	public function contentNewAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Request = $this->getRequest();
		$type = $Request->getParam('type', 'content');
		$App->activateNavigationItem('back.main', $type.'-new', true);
		$Content = $ContentCrumbs = array();
		
		# Save/Load
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
		
		# Prepare New Content
		$Content->published_at = doctrine_timestamp();
		if ( $type === 'event' ) {
			$Content->event_start_at = doctrine_timestamp();
			$Content->event_finish_at = doctrine_timestamp();
		}
		
		# Fetch
		$ContentArray = $Content->toArray();
		$ContentCrumbs[] = $ContentArray;
		
		# Fetch content for use in dropdown
		$ContentList = $this->getContentList();
		
		# Apply
		$this->view->type = $type;
		$this->view->ContentCrumbs = $ContentCrumbs;
		$this->view->ContentList = $ContentList;
		$this->view->Content = $ContentArray;
		
		# Render
		$this->render('content/content-edit');
		
		# Done
		return true;
	}

	public function contentListAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Request = $this->getRequest();
		$type = $Request->getParam('type', 'content');
		$App->activateNavigationItem('back.main', $type.'-list', true);
		$Content = $ContentCrumbs = $ContentList = $ContentArray = array();
		
		# Search
		$search = $App->fetchSearch();
		$searchQuery = delve($search,'query');
		$this->view->search = $search;
		
		# Param
		$content = fetch_param('content');
		
		# Prepare
		$ListQuery = Doctrine_Query::create()
			->select('c.*, cr.*, ct.*, ca.*, cp.*, cm.*')
			->from('Content c, c.Route cr, c.ContentTags ct, c.Author ca, c.Parent cp, c.Avatar cm')
			->where('c.status = ?', 'published')
			->orderBy('c.position ASC, c.id ASC')
			->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		if ( $type !== 'content' ) {
			$ListQuery->andWhere('c.type = ?', $type);
		}
		
		# Handle
		if ( $searchQuery ) {
			// Search
			$Query = Doctrine::getTable('Content')->search($searchQuery, $ListQuery);
			$ContentList = $Query->execute();
		} else {
			// No Search
			
			# Fetch Crumbs
			$Content = $this->_getContent(null, null, false);
			if ( $Content ) {
				// We have a content as a root
				$ContentArray = $Content->toArray();
				$ContentCrumbs = $Content->getCrumbs(Doctrine::HYDRATE_ARRAY, true);
			}
			
			# Fetch list
			if ( $Content ) {
				// Children
				$ContentList = $ListQuery->andWhere('cp.id = ?', $Content->id)->execute();
			} else {
				// Roots
				if ( $type === 'content' )
					$ContentList = $ListQuery->andWhere('NOT EXISTS (SELECT cpc.id FROM Content cpc WHERE cpc.id = c.Parent_id)')->execute();
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
		$this->view->ContentCrumbs = $ContentCrumbs;
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
	
	protected function _getContentQuery ( ) {
		# Prepare
		$Query = Doctrine_Query::create()->select('i.*, ir.*, it.*, ia.*, ip.*, im.*')->from('Content i, i.Route ir, i.ContentTags it, i.Author ia, i.Parent ip, i.Avatar im');
		
		# Return Query
		return $Query;
	}
	
	protected function _getContent ( $record = null, $Query = null, $create = true ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Prepare Fetch
		if ( !$Query ) $Query = $this->_getContentQuery();
		
		# Fetch
		$Content = $App->fetchItem('Content', $record, $Query, $create);
		
		# Return File
		return $Content;
	}
	
	protected function _saveContent ( $record = null, $Query = null, $keep = null, $remove = null, $empty = null ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Prepare Fetch
		if ( !$keep ) $keep = array('code', 'content', 'description', 'Parent', 'status', 'tags', 'title', 'type', 'Avatar');
		$Content = $App->saveItem('Content', $record, $Query, $keep, $remove, $empty);
		
		# Return Content
		return $Content;
	}
	
	
	# ========================
	# MEDIA: GENERIC
	
	protected function _getFileQuery ( ) {
		# Prepare
		$Query = Doctrine_Query::create()->select('i.*, ia.*')->from('File i, i.Author ma');
		
		# Return Query
		return $Query;
	}
	
	protected function _getFile ( $record = null, $Query = null, $create = true ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Prepare Fetch
		if ( !$Query ) $Query = $this->_getFileQuery();
		
		# Fetch
		$File = $App->fetchItem('File', $record, $Query, $create);
		
		# Return File
		return $File;
	}
	
	protected function _saveFile ( $record = null, $Query = null, $keep = null, $remove = null, $empty = null ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Prepare Fetch
		if ( !$keep ) $keep = array('file', 'code', 'title', 'path', 'size', 'type', 'mimetype', 'width', 'height');
		
		# Fetch
		$File = $App->saveItem('File', $record, $Query, $keep, $remove, $empty);
		
		# Return File
		return $File;
	}
	
	# ========================
	# USER: GENERIC
	
	protected function _getUser ( $record = null, $Query = null, $create = true ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Fetch
		$File = $App->fetchItem('User', $record, $Query, $create);
		
		# Return File
		return $File;
	}
	
	protected function _saveUser ( $record = null, $Query = null, $keep = null, $remove = null, $empty = null ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Prepare Fetch
		if ( !$remove ) $remove = array('permissions', 'roles', 'Permissions', 'Roles');
		
		# Fetch
		$User = $App->saveItem('User', $record, $Query, $keep, $remove, $empty);
		
		# Return User
		return $User;
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
