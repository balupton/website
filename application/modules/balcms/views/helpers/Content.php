<?php
require_once 'Zend/View/Helper/Abstract.php';
class Balcms_View_Helper_Content extends Zend_View_Helper_Abstract {
	
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
	
	/**
	 * Render the Content content
	 * @param mixed $Content
	 * @param array $params
	 * @return string rendered content
	 */
	public function renderContent ( Content $Content, array $params = array() ) {
		# Fetch
		$content = delve($Content,'content');
		$content_rendered = delve($Content,'content_rendered');
		
		# Prepare Params
		$params['Content'] = $Content;
		
		# Render Content
		$render = $this->_cache
			? $content_rendered
			: $this->renderWidgets(
				$content,
				$params += array('Content'=>$Content)
			);
			
		# Return render
		return $render;
	}

	/**
	 * Render the Content description
	 * @param mixed $Content
	 * @param array $params
	 * @return string rendered content
	 */
	public function renderDescription ( Content $Content, array $params = array() ) {
		# Fetch
		$description = delve($Content,'description');
		$description_rendered = delve($Content,'description_rendered');
		
		# Prepare Params
		$params['Content'] = $Content;
		
		# Render Description
		$render = $this->_cache
			? $description_rendered
			: $this->renderWidgets(
				$description,
				$params += array('Content'=>$Content)
			);
		
		# Return render
		return $render;
	}
	
	/**
	 * Render all the widgets for a piece of content
	 * @param string $content
	 * @param array $params
	 */
	public function renderWidgets ( $content, array $params = array() ) {
		return $this->view->getHelper('widget')->renderAll($content, $params);
	}
	
	protected function _generateModel ( array $params ) {
		# Prepare
		$content = delve($params,'content');
		$parent = delve($params,'parent');
		$codes = prepare_csv_array($content);
		$Content = $this->getContentObjectFromParams($params);
		
		# Create Query
		$ContentListQuery = Doctrine_Query::create()
			->select('*')
			->from('Content c')
			->where('c.status = ?', 'published')
			->orderBy('c.published_at DESC, c.id ASC')
			->limit(20);
		
		# Adjust Query
		if ( empty($codes) ) {
			$ContentListQuery->addFrom('c.Parent cParent');
			if ( is_numeric($parent) ) {
				$ContentListQuery->andWhere('cParent.id = ?', $parent);
			} elseif ( is_string($parent) ) {
				$ContentListQuery->andWhere('cParent.code = ?', $parent);
			} else {
				$ContentListQuery->andWhere('cParent.id = ?', $Content->id);
			}
		} else {
			$ContentListQuery->andWhereIn('c.code',$codes);
		}
		
		# Fetch
		$ContentList = $ContentListQuery->execute();
		
		# Apply
		$model = compact('Content','ContentList');
		$model = array_merge($params, $model);
		
		# Return model
		return $model;
	}
	
	/**
	 * Render a carousel
	 * @param $params
	 * @return string
	 */
	public function renderCarouselWidget ( array $params = array() ) {
		# Fetch Model
		$model = $this->_generateModel($params);
		
		# Render
		return $this->renderWidgetView('carousel', $model);
	}
	
	/**
	 * Renders the popular tags
	 * @param $params
	 * @return string
	 */
	public function renderPopulartaglistWidget ( array $params = array() ) {
		# Fetch
		$Content = $this->getContentObjectFromParams($params);
		$TagList = Doctrine::getTable('TaggableTag')->getPopularTags('Content');
		
		# Apply
		$model = compact('Content','TagList');
		$model = array_merge($params, $model);
		
		# Render
		return $this->renderWidgetView('taglist', $model);
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
		$model = array_merge($params, $model);
		
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
		$model = array_merge($params, $model);
		
		# Render
		return $this->renderWidgetView('subscribe', $model);
	}

	/**
	 * Render a recentlist
	 * @param $params
	 * @return string
	 */
	public function renderRecentlistWidget ( array $params = array() ) {
		# Fetch Model
		$model = $this->_generateModel($params);
		
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
		$ContentList = Doctrine_Query::create()->select('*')->from('Content c, c.Parent cp')->where('c.status = ? AND cp.id = ?', array('published', $Content->id))->orderBy('c.published_at DESC, c.id ASC')->limit(20)->execute();
		
		// need to fetch in the order of most recent first
		// should add paging
		
		# Apply
		$model = compact('Content','ContentList');
		$model = array_merge($params, $model);
		
		# Render
		return $this->renderWidgetView('articlelist', $model);
	}
	
	/**
	 * Render a contentlist
	 * @param $params
	 * @return string
	 */
	public function renderContentlistWidget ( array $params = array() ) {
		# Fetch Model
		$model = $this->_generateModel($params);
		
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
		$EventsPast = Doctrine_Query::create()->select('*')->from('ContentEvent c, c.Parent cp')->where('c.status = ? AND cp.id = ?', array('published', $Content->id))->orderBy('c.event_start_at ASC, c.id ASC')->limit(20)->andWhere('c.event_start_at < ?', $timestamp)->execute();
		$EventsFuture = Doctrine_Query::create()->select('*')->from('ContentEvent c, c.Parent cp')->where('c.status = ? AND cp.id = ?', array('published', $Content->id))->orderBy('c.event_start_at ASC, c.id ASC')->limit(20)->andWhere('c.event_start_at >= ?', $timestamp)->execute();
		
		# Apply
		$model = compact('Content','EventsPast','EventsFuture');
		$model = array_merge($params, $model);
		
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