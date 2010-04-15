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
		
		# Handle Menu
		try {
			# Also checks permission
			$App->activateNavigationItem('back.main', 'dashboard-dashboard', true);
		}
		catch ( Exception $Exception ) {
			# Log the Event and Continue
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
			
			# Logout
			$App->logout(true);
		}
		
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
		
		# Prepare
		$type = $Request->getParam('type');
		$typeLower = strtolower($type);
		$Table = Bal_Doctrine_Core::getTable($type);
		$tableComponentName = Bal_Doctrine_Core::getTableComponentName($type);
		$fields = Bal_Doctrine_Core::fetchListingFields($Table);
		
		# Prepare Menu
		$App->activateNavigationItem('back.main', 'crud-list-'.$typeLower, true);
		
		# --------------------------
		
		# Search
		$search = $App->fetchSearch();
		$searchQuery = delve($search,'query');
		
		# Prepare Criteria
		$criteria = array(
			'relations' => true,
			'hydrationMode' => Doctrine::HYDRATE_ARRAY
		);
		
		# Criteria: Search Query
		if ( $searchQuery ) {
			$criteria['search'] = $searchQuery;
		}
		
		# Fetch
		$ItemList = $App->fetchRecords($tableComponentName,$criteria);
		
		# Permissions
		$ItemListEditable = $App->hasNavigationItem('back.main', 'crud-new-'.$typeLower, true);
		$ItemListDeletable = true;
		
		# --------------------------
		
		# Apply
		$this->view->search = $search;
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
		$Table = Bal_Doctrine_Core::getTable($type);
		$tableComponentName = Bal_Doctrine_Core::getTableComponentName($type);
		
		# --------------------------
		
		# Fetch
		$Item = Bal_Doctrine_Core::saveItem($Table);
		
		# Menu
		$App->activateNavigationItem('back.main', 'crud-'.(delve($Item,'id')?'list':'new').'-'.$typeLower, true);
		
		# --------------------------
		
		# Form
		$Form = Bal_Form_Doctrine::fetchForm($tableComponentName,$Item);
		$Form
			->setAction('')
			->setMethod('post')
			->addElement('submit', '__submit__', array('class'=>'button-primary','label'=>'Save Changes'));
		
		# Apply
		$this->view->Item = $Item;
		$this->view->type = $type;
		$this->view->Form = $Form;
		
		# --------------------------
		
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
		
		# --------------------------
		
		# Search
		$search = $App->fetchSearch();
		$searchQuery = delve($search,'query');
		
		# Prepare Criteria
		$criteria = array(
			'Identity' => $Identity,
			'hydrationMode' => Doctrine::HYDRATE_ARRAY
		);
		
		# Criteria: SearchQuery
		if ( $searchQuery ) {
			$criteria['search'] = $searchQuery;
		}
		
		# Fetch
		$UserList = $App->fetchRecords('User',$criteria);
		
		# --------------------------
		
		# Apply
		$this->view->search = $search;
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
		
		# --------------------------
		
		# Fetch
		$User = $this->_getUser();
		if ( $User->level > $Identity->level ) {
			throw new Zend_Exception('error-user-level');
		}
		
		# Apply
		$User = $this->_saveUser($User, array('remove'=>array('password')));
		$App->activateNavigationItem('back.main', 'user-'.($User->id ? 'list' : 'new'), true);
		
		# Form
		$Form = Bal_Form_Doctrine::fetchForm('User',$User);
		$Form
			->setAction('')
			->setMethod('post')
			->addElement('submit', '__submit__', array('class'=>'button-primary','label'=>'Save Changes'));
		
		# --------------------------
		
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
		
		# --------------------------
		
		# Fields to Display in CSV
		$fields = rstrip('User.'.implode(', User.',$Table->getFieldNames()), 'User.');
		
		# Prepare Criteria
		$criteria = array(
			'select' => $fields,
			'Identity' => $Identity,
			'hydrationMode' => Doctrine::HYDRATE_ARRAY
		);
		
		# Fetch
		$Users = $App->fetchRecords('User',$criteria);
		
		# Create CSV
		$csv = prepare_csv_content($fields, $Users);
		$filename = 'users.csv';
		
		# --------------------------
		
		# Download CSV
		become_file_download($csv, null, null, $filename);
		die;
	}
	
	public function userDeleteAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Identity = $App->getUser();
		
		# --------------------------
		
		# Fetch
		$User = $this->_getUser();
		if ( $User->level > $Identity->level ) {
			throw new Zend_Exception('error-user-level');
		}
		
		# Delete
		$App->deleteItem('User', $User);
		
		# --------------------------
		
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
		
		# --------------------------
		
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
		
		# --------------------------
		
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
		
		# --------------------------
		
		# Search
		$search = $App->fetchSearch();
		$searchQuery = delve($search,'query');
		
		# Prepare Criteria
		$criteria = array(
			'fetch' => 'Subscribers',
			'hydrationMode' => Doctrine::HYDRATE_ARRAY
		);
		
		# Criteria: Search
		if ( $searchQuery ) {
			$criteria['search'] = $searchQuery;
		}
		
		# Fetch
		$SubscriberList = $App->fetchRecords('User',$criteria);
		
		# --------------------------
		
		# Apply
		$this->view->search = $search;
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
		
		# --------------------------
		
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
		
		# --------------------------
		
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
		
		# --------------------------
		
		# Search
		$search = $App->fetchSearch();
		$searchQuery = delve($search,'query');
		
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
		
		# --------------------------
		
		# Criteria
		$criteria = array(
			'fetch' => 'list',
			'hydrationMode' => Doctrine::HYDRATE_ARRAY
		);
		
		# Criteria: Search
		if ( $searchQuery ) {
			$criteria['search'] = $searchQuery;
		}
		
		# Fetch
		$FileList = $App->fetchRecords('File',$criteria);
		
		# --------------------------
		
		# Apply
		$this->view->search = $search;
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
		
		# --------------------------
		
		# Delete
		$Content = $App->deleteItem('Content');
		$content = delve($Content,'Parent.code');
		
		# --------------------------
		
		# Redirect
		return $this->getHelper('redirector')->gotoRoute(array('action'=>'content-list','content'=>$content), 'back', true);
	}
	
	public function getContentSimpleList ( ) {
		# Prepare
		
		# --------------------------
		
		# Criteria
		$criteria = array(
			'fetch' => 'simplelist',
			'hydrationMode' => Doctrine::HYDRATE_ARRAY
		);
		
		# Fetch
		$ContentList = $App->fetchRecords('Content',$criteria);
		
		# Format as Tree
		$ContentList = array_tree_flat($ContentList, 'id', 'Parent_id', 'level', 'position');
		
		# --------------------------
		
		# Return ContentList
		return $ContentList;
	}

	public function contentEditAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Content = $ContentCrumbs = array();
		
		# --------------------------
		
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
		$ContentList = $this->getContentSimpleList();
		
		# --------------------------
		
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
		
		# --------------------------
		
		# Save/Load
		try {
			$Content = $this->_saveContent();
			if ( delve($Content,'id') ) {
				return $this->getHelper('redirector')->gotoRoute(array('action' => 'content-edit', 'content' => $Content->code), 'back', true);
			}
		}
		catch ( Exception $Exception ) {
			# Log the Event and Continue
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
		
		# --------------------------
		
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
		$ContentList = $this->getContentSimpleList();
		
		# --------------------------
		
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
		
		# --------------------------
		
		# Search
		$search = $App->fetchSearch();
		$searchQuery = delve($search,'query');
		
		# Prepare Criteria
		$criteria = array(
			'fetch' => 'listing',
			'hydrationMode' => Doctrine::HYDRATE_ARRAY
		);
		
		# Criteria
		if ( $searchQuery ) {
			$criteria['search'] = $searchQuery;
		}
		else {
			 # No Search
			
			# Fetch Current
			$Content = $this->_getContent(null, array('create'=>false));
			
			# Handle Current
			if ( delve($Content,'id') ) {
				// We have a content as a root
				$ContentArray = $Content->toArray();
				$ContentCrumbs = $Content->getCrumbs(Doctrine::HYDRATE_ARRAY, true);
				
				// Children
				$criteria['Parent'] = $Content;
			}
			else {
				// Roots
				if ( $type === 'content' ) {
					$criteria['Root'] = true;
				} // or all of type
			}
		}
		
		# Fetch
		$ContentList = $App->fetchRecords('Content',$criteria);
		
		# Postpare
		if ( !$searchQuery ) {
			# If nothing, use us
			if ( !$ContentList && $Content ) {
				$ContentList = array($Content);
			}
		
		}
		
		# --------------------------
		
		# Apply
		$this->view->search = $search;
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
		
		# --------------------------
		
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
		
		# --------------------------
		
		# Respond
		$this->getHelper('json')->sendJson($data);
	}

	
	# ========================
	# CONTENT: GENERIC
	
	protected function _getContent ( $record = null, array $options = array() ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Options
		array_keys_ensure($options, array('create'));
		
		# --------------------------
		
		# Create
		if ( $options['create'] === null ) {
			$options['create'] = true;
		}
		
		# Fetch
		$Content = Bal_Doctrine_Core::fetchItem('Content', $record, $options);
		
		# --------------------------
		
		# Return Content
		return $Content;
	}
	
	protected function _saveContent ( $record = null, array $options = array() ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Options
		array_keys_ensure($options, array('create','keep'));
		
		# --------------------------
		
		# Create
		if ( $options['create'] === null ) {
			$options['create'] = true;
		}
		
		# Keep
		if ( $options['keep'] === null ) {
			$options['keep'] = array('code', 'content', 'description', 'Parent', 'status', 'tags', 'title', 'type', 'Avatar');
		}
		
		# Save
		$Content = Bal_Doctrine_Core::saveItem('Content', $record, $options);
		
		# --------------------------
		
		# Return Content
		return $Content;
	}
	
	
	# ========================
	# FILE: GENERIC
	
	protected function _getFile ( $record = null, array $options = array() ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Options
		array_keys_ensure($options, array('create'));
		
		# --------------------------
		
		# Create
		if ( $options['create'] === null ) {
			$options['create'] = true;
		}
		
		# Fetch
		$File = Bal_Doctrine_Core::fetchItem('File', $record, $options);
		
		# --------------------------
		
		# Return File
		return $File;
	}
	
	protected function _saveFile ( $record = null, array $options = array() ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Options
		array_keys_ensure($options, array('create','keep'));
		
		# --------------------------
		
		# Create
		if ( $options['create'] === null ) {
			$options['create'] = true;
		}
		
		# Keep
		if ( $options['keep'] === null ) {
			$options['keep'] = array('file', 'code', 'title', 'path', 'size', 'type', 'mimetype', 'width', 'height');
		}
		
		# Save
		$File = Bal_Doctrine_Core::saveItem('File', $record, $options);
		
		# --------------------------
		
		# Return File
		return $File;
	}
	
	# ========================
	# USER: GENERIC
	
	protected function _getUser ( $record = null, array $options = array() ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Options
		array_keys_ensure($options, array('create'));
		
		# --------------------------
		
		# Create
		if ( $options['create'] === null ) {
			$options['create'] = true;
		}
		
		# Fetch
		$File = Bal_Doctrine_Core::fetchItem('User', $record, $options);
		
		# --------------------------
		
		# Return File
		return $File;
	}
	
	protected function _saveUser ( $record = null, array $options = array() ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Options
		array_keys_ensure($options, array('create','remove'));
		
		# --------------------------
		
		# Create
		if ( $options['create'] === null ) {
			$options['create'] = true;
		}
		
		# Remove
		if ( $options['remove'] === null ) {
			$options['remove'] = array('permissions', 'roles', 'Permissions', 'Roles');
		}
		
		# Save
		$User = Bal_Doctrine_Core::saveItem('User', $record, $options);
		
		# --------------------------
		
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
