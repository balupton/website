<?php
require_once 'Zend/View/Helper/Abstract.php';
class Bal_View_Helper_Content extends Zend_View_Helper_Abstract {
	
    /**
     * Whether or not to cache content
     * @var bool
     */
	protected $_cache = null;
	
	/**
	 * The App Plugin
	 * @var Bal_Controller_Plugin_App
	 */
	protected $_App = null;
	
	/**
	 * The View in use
	 * @var Zend_View_Interface
	 */
	public $view;

	/**
	 * Apply View
	 * @param Zend_View_Interface $view
	 */
	public function setView (Zend_View_Interface $view) {
		# Apply
		$this->_App = Zend_Controller_Front::getInstance()->getPlugin('Bal_Controller_Plugin_App');
		$this->_cache = $this->_App->getConfig('bal.widgets.cache');
		
		# Set
		$this->view = $view;
		
		# Done
		return true;
	}

	
	/**
	 * Returns @see Bal_Controller_Plugin_App
	 */
	public function getApp(){
		# Done
		return $this->_App;
	}
	
	/**
	 * Self Reference
	 * @return Zend_View_Helper_Interface
	 */
	public function content ( ) {
		# Chain
		return $this;
	}
	
	public function getMediaUrl ( $Media ) {
		# Prepare
		$name = null;
		
		# Handle
		if ( is_object($Media) ) {
			# Is Object
			$name = $Media->name;
		} elseif ( is_array($Media) ) {
			if ( array_key_exists('name', $Media) ) {
				# Is Array
				$name = $Media['name'];
			} elseif ( array_key_exists('id', $Media) ) {
				# Is Content Array with Id
				$name = Doctrine::getTable('Media')->find($Media['id'])->name;
			}
		}
		
		# Postfix
		$mediaUrl = UPLOADS_URL.'/'.$name;
		
		# Done
		return $mediaUrl;
	}
	
	public function getContentUrl ( $Content ) {
		# Prepare
		$Route = null;
		
		# Handle
		if ( is_object($Content) ) {
			# Is Content Object
			$Route = $Content->Route;
		} elseif ( is_array($Content) ) {
			if ( array_key_exists('Route', $Content) ) {
				# Is Content Array
				$Route = $Content['Route'];
			} elseif ( array_key_exists('path', $Content) ) {
				# Is Route
				$Route = $Content;
			} elseif ( array_key_exists('id', $Content) ) {
				# Is Content Array with Id
				$Route = Doctrine::getTable('Content')->find($Content['id'])->Route;
			}
		}
		
		# Done
		return $this->view->url(array('Map'=>$Route),'map',true);
	}
	
	/**
	 * Render the Content content
	 * @param mixed $Content
	 * @param array $params
	 * @return string rendered content
	 */
	public function renderContent ( $Content, array $params = array() ) {
		if ( is_object($Content) ) {
			return $this->_cache ? $Content->content_rendered : $this->renderWidgets($Content->content, $params+=array('Content'=>$Content));
		} elseif ( is_array($Content) ) {
			return $this->_cache ? $Content['content_rendered'] : $this->renderWidgets($Content['content'], $params+=array('ContentArray'=>$Content));
		} else {
			return $this->_cache ? $Content : $this->renderWidgets($Content, $params);
		}
	}

	/**
	 * Render the Content description
	 * @param mixed $Content
	 * @param array $params
	 * @return string rendered content
	 */
	public function renderDescription ( $Content, array $params = array() ) {
		if ( is_object($Content) ) {
			return $this->_cache ? $Content->description_rendered : $this->renderWidgets($Content->description, $params+=array('Content'=>$Content));
		} elseif ( is_array($Content) ) {
			return $this->_cache ? $Content['description_rendered'] : $this->renderWidgets($Content['description'], $params+=array('ContentArray'=>$Content));
		} else {
			return $this->_cache ? $Content : $this->renderWidgets($Content, $params);
		}
	}
	
	/**
	 * Render all the widgets for a piece of content
	 * @param string $content
	 * @param array $params
	 */
	public function renderWidgets ( $content, array $params = array() ) {
		return $this->view->getHelper('widget')->renderAll($content, $params);
	}
	
	/**
	 * Render a carousel
	 * @param $params
	 * @return string
	 */
	public function renderCarouselWidget ( array $params = array() ) {
		# Prepare
		$codes = explode(',', str_replace(' ', '', $params['content']));
		
		# Fetch
		$Content = $this->getContentObjectFromParams($params);
		$ContentList = Doctrine_Query::create()->select('*')->from('Content c')->where('c.enabled = ? AND c.status = ?', array(true, 'published'))->andWhereIn('c.code',$codes)->orderBy('c.published_at DESC, c.id ASC')->limit(20)->execute();
		
		# Apply
		$model = compact('Content','ContentList');
		
		# Render
		return $this->renderWidgetView('carousel', $model);
	}
	
	/**
	 * Render a taglist
	 * @param $params
	 * @return string
	 */
	public function renderTaglistWidget ( array $params = array() ) {
		# Fetch
		$Content = $this->getContentObjectFromParams($params);
		$TagList = Doctrine_Query::create()->select('t.*')->from('TaggableTag t')->orderBy('t.name ASC')->execute();
		
		# Apply
		$model = compact('Content','TagList');
		
		# Render
		return $this->renderWidgetView('taglist', $model);
	}
	
	/**
	 * Render a subscription form
	 * @param $params
	 * @return string
	 */
	public function renderSubscribeWidget ( array $params = array() ) {
		# Fetch
		$Content = $this->getContentObjectFromParams($params);
		
		# Apply
		$model = compact('Content');
		
		# Render
		return $this->renderWidgetView('subscribe', $model);
	}

	/**
	 * Render a recentlist
	 * @param $params
	 * @return string
	 */
	public function renderRecentlistWidget ( array $params = array() ) {
		# Fetch
		$Content = $this->getContentObjectFromParams($params);
		$ContentList = Doctrine_Query::create()->select('*')->from('Content c')->where('c.enabled = ? AND c.status = ?', array(true, 'published'))->orderBy('c.published_at DESC, c.id ASC')->limit(20)->execute();
		
		# Apply
		$model = compact('Content','ContentList');
		
		# Render
		return $this->renderWidgetView('recentlist', $model);
	}

	/**
	 * Render a articlelist
	 * @param $params
	 * @return string
	 */
	public function renderArticlelistWidget ( array $params = array() ) {
		# Prepare
		
		# Fetch
		$Content = $this->getContentObjectFromParams($params);
		$ContentList = Doctrine_Query::create()->select('*')->from('Content c, c.Parent cp')->where('c.enabled = ? AND c.status = ? AND cp.id = ?', array(true, 'published', $Content->id))->orderBy('c.published_at DESC, c.id ASC')->limit(20)->execute();
		
		// need to fetch in the order of most recent first
		// should add paging
		
		# Apply
		$model = compact('Content','ContentList');
		
		# Render
		return $this->renderWidgetView('articlelist', $model);
	}
	
	/**
	 * Render a contentlist
	 * @param $params
	 * @return string
	 */
	public function renderContentlistWidget ( array $params = array() ) {
		# Prepare
		
		# Fetch
		$Content = $this->getContentObjectFromParams($params);
		$ContentList = Doctrine_Query::create()->select('*')->from('Content c, c.Parent cp')->where('c.enabled = ? AND c.status = ? AND cp.id = ?', array(true, 'published', $Content->id))->orderBy('c.position ASC, c.id ASC')->limit(20)->execute();
		
		# Apply
		$model = compact('Content','ContentList');
		
		# Render
		return $this->renderWidgetView('contentlist', $model);
	}
	
	/**
	 * Render a eventlist
	 * @param $params
	 * @return string
	 */
	public function renderEventlistWidget ( array $params = array() ) {
		# Prepare
		$timestamp = date('Y-m-d H:i:s', time());
		
		# Fetch
		$Content = $this->getContentObjectFromParams($params);
		$EventsPast = Doctrine_Query::create()->select('*')->from('Event c, c.Parent cp')->where('c.enabled = ? AND c.status = ? AND cp.id = ?', array(true, 'published', $Content->id))->orderBy('c.event_start_at ASC, c.id ASC')->limit(20)->andWhere('c.event_start_at < ?', $timestamp)->execute();
		$EventsFuture = Doctrine_Query::create()->select('*')->from('Event c, c.Parent cp')->where('c.enabled = ? AND c.status = ? AND cp.id = ?', array(true, 'published', $Content->id))->orderBy('c.event_start_at ASC, c.id ASC')->limit(20)->andWhere('c.event_start_at >= ?', $timestamp)->execute();
		
		# Apply
		$model = compact('Content','EventsPast','EventsFuture');
		
		# Render
		return $this->renderWidgetView('eventlist', $model);
	}
	
	/**
	 * Render a Widget's View Script
	 * @param string $widget
	 * @param array $model [optional]
	 * @return string
	 */
	public function renderWidgetView ( $widget, array $model = array() ) {
		return $this->view->getHelper('widget')->renderWidgetView($widget, $model);
	}
	
	
	/**
	 * Fetch the Content Id from the params
	 * @param array $params
	 */
	protected function getContentIdFromParams ( array $params ) {
		if ( array_key_exists('Content', $params) ) {
			return $params['Content']->id;
		} elseif ( array_key_exists('ContentArray', $params) ) {
			return $params['ContentArray']['id'];
		} else {
			throw new Zend_Exception('No Content Object or Array passed to the Widget');
			return false;
		}
	}

	/**
	 * Fetch the Content Object from the params
	 * @param array $params
	 */
	protected function getContentObjectFromParams ( array $params ) {
		if ( array_key_exists('Content', $params) ) {
			return $params['Content'];
		} elseif ( array_key_exists('ContentArray', $params) ) {
			return Doctrine::getTable('Content')->find($params['ContentArray']['id']);
		} else {
			throw new Zend_Exception('No Content Object or Array passed to the Widget');
			return false;
		}
	}
	
}