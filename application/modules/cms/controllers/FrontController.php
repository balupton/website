<?php

require_once 'Zend/Controller/Action.php';
class Cms_FrontController extends Zend_Controller_Action {

	
	# ========================
	# CONSTRUCTORS
	
	public function init ( ) {
		
		# Layout
		$this->getHelper('Layout')->setLayout($this->getHelper('App')->getApp()->getConfig('bal.site.skin'));
		
		# Login
		$this->getHelper('App')->setOption('logged_in_forward', array('index', 'Admin'));
		
		# Authenticate
		$this->getHelper('App')->authenticate(false, false);
		
		# Navigation
		$this->applyNavigation();
		
		# Done
		return true;
	}
	
	public function applyNavigation ( ) {
		# Content
		$ContentListQuery = Doctrine_Query::create()->select('c.title, c.code, c.id, c.parent_id, c.position, cr.*')->from('Content c, c.Route cr')->where('c.enabled = ? AND c.status = ? AND NOT EXISTS (SELECT cp.id FROM Content cp WHERE cp.id = c.parent_id)', array(true, 'published'))->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		$ContentListArray = $ContentListQuery->execute();
		foreach ( $ContentListArray as &$Content ) {
			$Content['id'] = 'content-'.$Content['code'];
			$Content['route'] = 'map';
			$Content['label'] = $Content['title'];
			$Content['order'] = $Content['position'];
			$Content['params'] = array('Map'=>$Content['Route']);
			$Content['route'] = 'map';
		}
		
		# Navigation Menu
		$NavTree = array_tree_round($ContentListArray, 'id', 'parent_id', 'level', 'position', 'pages', array('id','route','order','uri','label','title','children','map','params'));
		$this->view->NavigationMenu = new Zend_Navigation($NavTree);
		
		# Navigation Actions + Footer
		$NavFront = file_get_contents(CONFIG_PATH . '/nav-front.json');
		$NavFront = Zend_Json::decode($NavFront, Zend_Json::TYPE_ARRAY);
		$this->view->NavigationActions = new Zend_Navigation($NavFront['actions']);
		$this->view->NavigationFooter = new Zend_Navigation($NavFront['footer']);
		
		# Done
		return true;
	}

	public function registerNavigationAction ( $code ) {
		# Navigation
		$NavigationActions = $this->view->NavigationActions;
		$NavItem = $NavigationActions->findBy('id', 'action-'.$code);
		$NavItem->parent->active = $NavItem->active = true;
		
		# Done
		return true;
	}
	
	public function registerNavigationMenu ( $code ) {
		# Navigation
		$NavigationMenu = $this->view->NavigationMenu;
		$NavItem = $NavigationMenu->findBy('id', 'content-'.$code);
		$NavItem->parent->active = $NavItem->active = true;
		
		# Done
		return true;
	}
	
	
	# ========================
	# INDEX
	
	public function indexAction () {
		# Home Page
		$ContentArray = Doctrine::getTable('Content')->createQuery()->where('enabled = ? AND status = ?', array(true,'published'))->orderBy('position ASC, id ASC')->setHydrationMode(Doctrine::HYDRATE_ARRAY)->fetchOne();
		$content = $ContentArray['id'];
		
		# Popular Tags (as we are the home page)
		//$tags = Doctrine::getTable('Content')->getPopularTagsArray();
		//$tags = array_keys($tags);
		//$keywords = implode(', ', $tags);
		
		# Forward
		return $this->_forward('content-page', null, null, array('id'=>$content));
	}
	
	# ========================
	# CONTENT

	public function searchAction () {
		# Prepare
		$search = $this->_getParam('search');
		
		# Check
		if ( !$search ) {
			return $this->_forward('index');
		}
		
		# Query
		$ListQuery = Doctrine_Query::create()->select('c.*, cr.*, ct.*, ca.*, cp.*, cm.*')->from('Content c, c.Route cr, c.Tags ct, c.Author ca, c.Parent cp, c.Avatar cm')->where('c.enabled = ? AND c.status = ?', array(true, 'published'))->orderBy('c.position ASC, c.id ASC');
		
		# Search
		$ContentQuery = Doctrine::getTable('Content')->search($search, $ListQuery);
		$ContentList = $ContentQuery->execute();
		
		# Apply
		$this->view->search = $search;
		$this->view->ContentList = $ContentList;
		$this->view->headTitle()->append('Search');
		$this->registerNavigationAction('search');
		
		# Render
		$this->render('content/content-search');
		
		# Done
		return true;
	}
	
	public function contentPageAction ( ) {
		# Prepare
		$Request = $this->getRequest();
		$Response = $this->getResponse();
		
		# Fetch
		$content_id = $this->_getParam('id');
		$Content = Doctrine::getTable('Content')->find($content_id);
		
		# Keywords
		$keywords = explode(', ', $Content->tagstr);
		
		# Crumbs
		$ContentCrumbsArray = $Content->getCrumbs(Doctrine::HYDRATE_ARRAY, false);
		foreach ( $ContentCrumbsArray as $Crumb ) {
			$keywords += explode(', ', $Crumb['tagstr']);
			$this->view->headTitle()->append($Crumb['title']);
		}
		
		# Keywords
		$keywordstr = implode(', ' , $keywords);
		
		# Apply
		$this->view->Content = $Content;
		$this->view->headTitle()->append($Content->title);
		$this->view->headMeta()->appendName('keywords', $keywordstr);
		$this->registerNavigationMenu($Content->code);
		
		# Render
		$this->render('content/content-page');
		
		# Done
		return true;
	}
	
	
}
