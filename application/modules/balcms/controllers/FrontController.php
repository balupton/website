<?php
require_once 'Zend/Controller/Action.php';
class Balcms_FrontController extends Zend_Controller_Action {

	# ========================
	# CONSTRUCTORS
	

	public function init ( ) {
		# Prepare
		$App = $this->getHelper('App');
		
		# Layout
		$App->setArea('front');
		
		# Login
		$App->setOption('logged_in_forward', array('index', 'back'));
		
		# Authenticate
		$App->authenticate(false, false);
		
		# Navigation
		$this->applyNavigation();
		
		# Done
		return true;
	}

	public function applyNavigation ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$App->applyNavigation();
		
		# Content
		$ContentListQuery = Doctrine_Query::create()->select('c.title, c.code, c.id, c.parent_id, c.position, cr.*')->from('Content c, c.Route cr')->where('c.status = ? AND NOT EXISTS (SELECT cp.id FROM Content cp WHERE cp.id = c.parent_id)', 'published')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
		$ContentListArray = $ContentListQuery->execute();
		foreach ( $ContentListArray as &$Content ) {
			$Content['id'] = 'content-' . $Content['code'];
			$Content['route'] = 'map';
			$Content['label'] = $Content['title'];
			$Content['order'] = $Content['position'];
			$Content['params'] = array('Map' => $Content['Route']);
			$Content['route'] = 'map';
		}
		
		# Navigation
		$NavTree = array_tree_round($ContentListArray, 'id', 'parent_id', 'level', 'position', 'pages', array('id', 'route', 'order', 'uri', 'label', 'title', 'children', 'map', 'params'));
		$App->applyNavigationMenu('front.menu', new Zend_Navigation($NavTree));
		
		# Done
		return true;
	}
	
	public function activateNavigationContentItem ( $Content ) { 
		# Prepare
		$App = $this->getHelper('App');
		$result = false; 
		
		# Handle
		while ( $result === false ) { 
			$code = $Content->code; 
			$result = $App->activateNavigationItem('front.menu', 'content-'.$Content->code, false, false);
			if ( empty($Content->parent_id) ) 
				break; 
			$Content = $Content->Parent; 
		} 
		
		# Done
		return $result;
	} 
	
	# ========================
	# INDEX
	

	public function indexAction ( ) {
		# Home Page
		$ContentArray = Doctrine::getTable('Content')->createQuery()->where('status = ?', 'published')->orderBy('position ASC, id ASC')->setHydrationMode(Doctrine::HYDRATE_ARRAY)->fetchOne();
		$content = $ContentArray['id'];
		
		# Popular Tags (as we are the home page)
		//$tags = Doctrine::getTable('Content')->getPopularTagsArray();
		//$tags = array_keys($tags);
		//$keywords = implode(', ', $tags);
		

		# Forward
		return $this->_forward('content-page', null, null, array('id' => $content));
	}
	

	# ========================
	# CONTENT
	

	public function searchAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$search = $App->fetchSearch();
		$searchQuery = delve($search,'query');
		
		# Check
		if ( !$searchQuery ) {
			return $this->_forward('index');
		}
		
		# Query
		$ListQuery = Doctrine_Query::create()->select('c.*, cr.*, ct.*, ca.*, cp.*, cm.*')->from('Content c, c.Route cr, c.Tags ct, c.Author ca, c.Parent cp, c.Avatar cm')->where('c.status = ?', 'published')->orderBy('c.position ASC, c.id ASC');
		
		# Search
		$ContentQuery = Doctrine::getTable('Content')->search($searchQuery, $ListQuery);
		$ContentList = $ContentQuery->execute();
		
		# Apply
		$this->view->search = $search;
		$this->view->ContentList = $ContentList;
		$this->view->headTitle()->append('Search');
		//$App->activateNavigationActionItem('front.actions','search',true);
		
		# Render
		$this->render('content/search');
		
		# Done
		return true;
	}

	public function unsubscribeAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Request = $this->getRequest();
		$Response = $this->getResponse();
		
		# Fetch
		$email = fetch_param('subscribe.email', $Request->getParam('email'));
		
		# Handle
		if ( empty($email) ) {
			# Apply
			$this->view->headTitle()->append('Unsubscribe');
			
			# Render
			return $this->render('subscription/unsubscribe');
		}
		
		# Subscribe
		$Subscriber = Doctrine::getTable('User')->findOneByEmail($email);
		if ( count($Subscriber) && $Subscriber->exists() ) {
			$Subscriber->removeAllTags();
			$Subscriber->save();
			// $Subscriber->delete(); // no longer delete the subscribers as they are now users
		}
		
		# Done
		return $this->_forward('index');
	}

	public function subscribeAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
		$Request = $this->getRequest();
		$Response = $this->getResponse();
		$Log = Bal_App::getLog();
		
		# Fetch
		$email = fetch_param('subscribe.email', $Request->getParam('email'));
		
		# Subscribe
		try {
			$Subscriber = new User();
			$Subscriber->email = $email;
			$Subscriber->setTags('newsletter');
			$Subscriber->save();
			# Log
			$log_details = array(
				'Subscriber' => $Subscriber->toArray(),
			);
			$Log->log(array('log-subscriber-save',$log_details),Bal_Log::NOTICE,array('friendly'=>true,'class'=>'success','details'=>$log_details));
		}
		catch ( Exception $Exception ) {
			# Log the Event
			$Exceptor = new Bal_Exceptor($Exception);
			$Exceptor->log();
		}
		
		# Done
		return $this->_forward('index');
	}

	public function contentPageAction ( ) {
		# Prepare
		$App = $this->getHelper('App');
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
		$keywordstr = implode(', ', $keywords);
		
		# Apply
		$this->view->Content = $Content;
		$this->view->headTitle()->append($Content->title);
		$this->view->headMeta()->appendName('description', strip_tags($Content->description_rendered));
		$this->view->headMeta()->appendName('keywords', $keywordstr);
		$this->activateNavigationContentItem($Content);
		
		# Render
		$this->render('content/content-' . $Content->type);
		
		# Done
		return true;
	}
	

}
