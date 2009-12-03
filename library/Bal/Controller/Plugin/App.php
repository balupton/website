<?php
require_once 'Zend/Controller/Plugin/Abstract.php';
class Bal_Controller_Plugin_App extends Zend_Controller_Plugin_Abstract {
	
	# ========================
	# VARIABLES
	
	protected $_User = null;
	protected $_options = array(
	);
	
	# ========================
	# CONSTRUCTORS
	
	/**
	 * Construct
	 * @param array $options
	 */
	public function __construct ( array $options = array() ) {
		$this->mergeOptions($options);
		$this->getIdentity();
	}
	
	
	# ========================
	# CONFIG
	
	
	/**
	 * Gets the Application Configuration (as array) or specific config variable
	 * @param string $confs [optional]
	 * @return array
	 */
	public function getConfig ( $confs = null ) {
		# Prepare:
		$applicationConfig = array();
		
		# Load
		if ( Zend_Registry::isRegistered('applicationConfig') ) {
			$applicationConfig = Zend_Registry::get('applicationConfig');
		}
		
		# Check
		if ( !$confs ) {
			return $applicationConfig;
		}
		
		# Detailed
		$confs = explode('.', $confs);
		$value = $applicationConfig;
		
		# Cycle
		foreach ( $confs as $conf ) {
			if ( !is_array($value) || !array_key_exists($conf, $value) ) return null;
			$value = $value[$conf];
		}
		
		# Done
		return $value;
	}
	
	/**
	 * Get the helper option
	 * @param string $name
	 * @param mixed $default
	 */
	public function getOption ( $name, $default = null ) {
		# Get
		return empty($this->_options[$name]) ? $default : $this->_options[$name];
	}
	
	/**
	 * Set the helper option
	 * @param string $name
	 * @param mixed $value
	 */
	public function setOption ( $name, $value ) {
		# Set
		$this->_options[$name] = $value;
		# Chain
		return $this;
	}
	
	/**
	 * Merge the helper options
	 * @param array $options
	 */
	public function mergeOptions ( array $options ) {
		# Merge
		$this->_options = array_merge($this->_options, $options);
		# Chain
		return $this;
	}
	
	# -----------
	# Authentication
	
	/**
	 * Logout the User
	 * @param bool $redirect
	 */
	public function logout ( ) {
		# Locale
	   	Zend_Registry::get('Locale')->clearLocale();
	   	
		# Logout
		$this->getAuth()->clearIdentity();
		Zend_Session::forgetMe();
		
		# Chain
		return $this;
	}

	/**
	 * Login the User
	 * @param string $username
	 * @param string $password
	 * @param string $locale
	 * @param string $remember
	 * @return bool
	 */
	public function login ( $username, $password, $locale = null, $remember = null ) {
		# Prepare
		$Session = new Zend_Session_Namespace('login'); // not sure why needed but it is here
		$Auth = $this->getAuth();
		
		# Load
		$AuthAdapter = new Bal_Auth_Adapter_Doctrine($username, $password);
		$AuthResult = $Auth->authenticate($AuthAdapter);
		
		# Check
		if ( !$AuthResult->isValid() ) {
			# Failed
			$error = implode($AuthResult->getMessages(),"\n");
			$error = empty($error) ? 'The credentials that were supplied are invalid' : $error;
			throw new Zend_Auth_Exception($error);
		}
		
		# Passed
		
		# RememberMe
		if ( $remember ) {
			$rememberMe = $this->getConfig('bal.auth.remember');
			if ( $rememberMe ) {
				$rememberMe = strtotime($rememberMe)-time();
				Zend_Session::rememberMe($rememberMe);
			}
		}
		
		# Set Locale
		if ( $locale ) {
   			$Locale = Zend_Registry::get('Locale');
			$Locale->setLocale($locale);
		}
		
		# Flush User
		$this->setUser();
		
		# Acl
		$this->loadUserAcl();
		
		# Admin cookies
		if ( $this->hasPermission('admin') ) {
			// Enable debug
			setcookie('debug','secret',0,'/');
		}
		
		# Done
		return true;
	}
	
	/**
	 * Get the Zend Auth
	 * @return Zend_Auth
	 */
	public function getAuth ( ) {
		# Return the Zend_Auth Singleton
		return Zend_Auth::getInstance();
	}
	
	/**
	 * Do we have an Identity
	 * @return bool
	 */
	public function hasIdentity ( ) {
		# Check
		return $this->getIdentity() ? true : false;
	}
	
	/**
	 * Return the logged in Identity
	 * @return Doctrine_Record
	 */
	public function getIdentity ( ) {
		# Fetch
		return $this->getAuth()->getIdentity();
	}
	
	/**
	 * Do we have a User
	 * @return bool
	 */
	public function hasUser ( ) {
		# Check
		return !empty($this->_User);
	}
	
	/**
	 * Return the logged in User
	 * @return Doctrine_Record
	 */
	public function getUser ( ) {
		# Return
		if ( $this->_User === null ) {
			$User = $this->setUser();
		}
		return $this->_User;
	}
	
	/**
	 * Sets the logged in User
	 * @return Doctrine_Record
	 */
	public function setUser ( ) {
		$Auth = $this->getAuth();
		$this->_User = $Auth->hasIdentity() ? Doctrine::getTable('User')->find($Auth->getIdentity()) : false;
		return $this->_User;
	}
	
	# -----------
	# Authorisation
	
	/**
	 * Return the Zend Registry
	 * @return Zend_Registry
	 */
	public function getRegistry ( ) {
		return Zend_Registry::getInstance();
	}
	
	/**
	 * Return the applied Acl
	 * @param Zend_Acl $Acl [optional]
	 * @return Zend_Acl
	 */
	public function getAcl ( Zend_Acl $Acl = null ) {
		# Check
		if ( $Acl) {
			return $Acl;
		}
		
		# Check
		if ( !Zend_Registry::isRegistered('acl') ) {
			# Create
			$Acl = new Zend_Acl();
			$this->loadAcl($Acl);
			$this->setAcl($Acl);
		}
		else {
			# Load
			$Acl = Zend_Registry::get('acl');
		}
		
		# Return
		return $Acl;
	}
	
	/**
	 * Apply the Acl
	 * @param Zend_Acl $Acl [optional]
	 */
	public function setAcl ( Zend_Acl $Acl ) {
		# Set
		$Acl = Zend_Registry::set('acl', $Acl);
		
		# Chain
		return $this;
	}
	
	/**
	 * Load the User into the Acl
	 * @param Doctrine_Record $User [optional]
	 * @param Zend_Acl $Acl [optional]
	 * @return bool
	 */
	public function loadUserAcl ( $User = null, Zend_Acl $Acl = null ) {
		# Ensure User
		if ( !$User && !($User = $this->getUser()) ) return false;
		
		# Fetch ACL
		$Acl = $this->getAcl($Acl);
		
		# Create User Acl
		$AclUser = new Zend_Acl_Role('user-'.$User->id);
		
		# Add User Roles to Acl
		/* What we do here is add the user role to the ACL.
		 * We also make it so the user role inherits from the actual roles
		 */
		$Roles = $User->Roles; $roles = array();
		foreach ( $Roles as $Role ) {
			$roles[] = 'role-'.$Role->code;
		}
		$Acl->addRole($AclUser, $roles);
		
		# Add User Permissions to Acl
		$Permissions = $User->Permissions; $permissions = array();
		foreach ( $Permissions as $Permission ) {
			$permissions[] = 'permission-'.$Permission->code;
		}
		$Acl->allow($AclUser, null, $permissions);
		
		# Done
		return true;
	}
	
	public function loadAcl ( Zend_Acl $Acl = null ) {
		# Fetch ACL
		$Acl = $this->getAcl($Acl);
		
		# Add Permissions to Acl
		$Permissions = Doctrine::getTable('Permission')->findAll(Doctrine::HYDRATE_ARRAY);
		foreach ( $Permissions as $Permission ) {
			$permission = 'permission-'.$Permission['code'];
			$Acl->add(new Zend_Acl_Resource($permission));
		}
		
		# Add Roles to Acl
		$Roles = Doctrine::getTable('Role')->createQuery()->select('r.code, rp.code')->from('Role r, r.Permissions rp')->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
		foreach ( $Roles as $Role ) {
			$role = 'role-'.$Role['code'];
			var_dump($role);
			$AclRole = new Zend_Acl_Role($role);
			$Acl->addRole($AclRole);
			$permissions = array();
			foreach ( $Role['Permissions'] as $Permission ) {
				$permissions[] = 'permission-'.$Permission['code'];
			}
			$Acl->allow($AclRole, null, $permissions);
		}
		
		# Done
		return true;
	}
	
	/**
	 * Do we have that Acl entry?
	 * @param string $role
	 * @param string $action
	 * @param mixed $resource
	 * @param bool
	 */
	public function hasAclEntry ( $role, $action, $resource, Zend_Acl $Acl = null ) {
		# Prepare
		$Acl = $this->getAcl($Acl);
		
		# Check
		return $Acl->isAllowed($role, $action, $resource);
	}
	
	/**
	 * Does the loaded User have that Permission?
	 * @param string $action
	 * @param mixed $permissions [optional]
	 * @return bool
	 */
	public function hasPermission ( $action, $permissions = null ) {
		# Prepare
		if ( $permissions === null ) {
			// Shortcut simplified
			$permissions = $action;
			$action = null;
		}
		
		# Fetch
		$User = $this->getUser();
		
		# Check
		if ( $Identity->id && ($result = $this->hasAclEntry('user-'.$User->id, $action, $permissions)) ) {
			return $result;
		}
		
		# Done
		return false;
	}
	
	# -----------
	# View stuff

	/**
	 * Get the root url for the site
	 * @return string
	 */
	public function getRootUrl ( ) {
		return ROOT_URL;
	}
	
	/**
	 * Get the base url for the site
	 * @param bool $prefix
	 * @return string
	 */
	public function getBaseUrl ( $prefix = false ) {
		$prefix = $prefix ? $this->getRootUrl() : '';
		$suffix = BASE_URL;
		return $prefix.$suffix;
	}

	/**
	 * Get the base url for the public area
	 * @see getBaseUrl
	 * @param bool $prefix
	 * @return string
	 */
	public function getPublicUrl ( $prefix = false ) {
		$prefix = $prefix ? $this->getRootUrl() : '';
		$suffix = PUBLIC_URL;
		return $prefix.$suffix;
	}
	
	/**
	 * Get the base url for an area
	 * @see getThemeUrl
	 * @param string $area
	 * @param bool $prefix
	 * @return string
	 */
	public function getAreaUrl ( $area, $prefix = false ) {
		$theme = $this->getAreaTheme($area);
		return $this->getThemeUrl($theme, $prefix);
	}
	
	/**
	 * Get the base url for a theme
	 * @param string $theme
	 * @param bool $prefix
	 * @return string
	 */
	public function getThemeUrl ( $theme, $prefix = false ) {
		$prefix = $prefix ? $this->getRootUrl() : '';
		$suffix = THEMES_URL.'/'.$theme;
		return $prefix.$suffix;
	}
	
	
	/**
	 * Get a area's theme
	 * @param string $area
	 * @return string|null
	 */
	public function getAreaTheme ( $area ) {
		$theme = null;
		switch ( $area ) {
			case 'front':
				$theme = $this->getConfig('bal.themes.front');
				break;
			case 'back':
				$theme = $this->getConfig('bal.themes.back');
				break;
			default:
				break;
		}
		return $theme;
	}
	
	public function getThemePath ( $theme ) {
		$themes_path = THEMES_PATH;
		return $themes_path . DIRECTORY_SEPARATOR . $theme;
	}
	
	public function startLayout ( $layout = null ) {
		Zend_Layout::startMvc();
		return $this;
	}
	
	public function getLayout ( ) {
		return Zend_Layout::getMvcInstance();
	}
	
	public function setLayout ( $layout ) {
		return $this->getLayout()->setLayout('layout');
	}
	
	public function getAreaLayoutPath ( $area ) {
		$theme = $this->getAreaTheme($area);
		return $this->getThemeLayoutPath($theme);
	}
	
	public function getThemeLayoutPath ( $theme ) {
		return $this->getThemePath($theme) . DIRECTORY_SEPARATOR . 'layouts';
	}
	
	public function setAreaLayout ( $area, $layout = 'theme' ) {
		$theme = $this->getAreaTheme($area);
		return $this->setThemeLayout($theme, $layout);
	}
	
	public function setThemeLayout ( $theme, $layout = 'theme' ) {
		$path = $this->getThemeLayoutPath($theme);
		return $this->getLayout()->setLayout($layout)->setLayoutPath($path);
	}
	
	
	# -----------
	# Menu
	
	
	/**
	 * Activate a Navigation Menu Item
	 * @return
	 */
	public function activateNavigationItem ( Zend_Navigation $Menu, $id, $parents = true ) {
		# Find Current
		$Item = $Menu->findBy('id', $id);
		
		# Check
		if ( !$Item ) {
			return false;
		}
		
		# Active Current
		$Item->active = true;
		
		# Activate Parents
		if ( $parents ) {
			$tmpItem = $Item;
			while ( !empty($tmpItem->parent) ) {
				$tmpItem = $tmpItem->parent;
				$tmpItem->active = true;
			}
		}
		
		# Done
		return true;
	}
	
	
	# -----------
	# Helpers
	
	/**
	 * Get the Pager
	 * @param integer $page_current [optional] Which page are we on?
	 * @param integer $page_items [optional] How many items per page?
	 * @return
	 */
	public function getPager($DQ, $page_current = 1, $page_items = 10){
		# Fetch
		$Pager = new Doctrine_Pager(
			$DQ,
			$page_current,
			$page_items
		);
		
		# Return
		return $Pager;
	}
	
	/**
	 * Get the Pages
	 * @param unknown_type $Pager
	 * @param unknown_type $PagerRange
	 * @param unknown_type $page_current
	 */
	public function getPages($Pager, $PagerRange, $page_current = 1){
		# Paging
		$page_first = $Pager->getFirstPage();
		$page_last = $Pager->getLastPage();
		$Pages = $PagerRange->rangeAroundPage();
		foreach ( $Pages as &$Page ) {
			$Page = array(
				'number' => $Page,
				'title' => $Page
			);
		}
		$Pages[] = array('number' => $Pager->getPreviousPage(), 'title' => 'prev');
		$Pages[] = array('number' => $Pager->getNextPage(), 'title' => 'next');
		foreach ( $Pages as &$Page ) {
			$page = $Page['number'];
			$Page['selected'] = $page == $page_current;
			if ( is_numeric($Page['title']) ) {
				$Page['disabled'] = $page < $page_first || $page > $page_last;
			} else {
				$Page['disabled'] = $page < $page_first || $page > $page_last || $page == $page_current;
			}
		}
		
		# Done
		return $Pages;
	}
	
	/**
	 * Get the Paging Details
	 * @param unknown_type $DQ
	 * @param unknown_type $page_current
	 * @param unknown_type $page_items
	 * @param unknown_type $pages_chunk
	 */
	public function getPaging($DQ, $page_current = 1, $page_items = 5, $pages_chunk = 5){
		# Fetch
		$Pager = $this->getPager($DQ, $page_current, $page_items);
		
		# Results
		$PagerRange = new Doctrine_Pager_Range_Sliding(array(
				'chunk' => $pages_chunk
    		),
			$Pager
		);
		$Items = $Pager->execute();
		
		# Get Pages
		$Pages = $this->getPages($Pager, $PagerRange, $page_current);
		
		# Check page current
		$page_first = $Pager->getFirstPage();
		$page_last = $Pager->getLastPage();
		if ( $page_current > $page_last ) $page_current = $page_last;
		elseif ( $page_current < $page_first ) $page_current = $page_first;
		
		# Done
		return array($Items, $Pages, $page_current);
	}
	
}
