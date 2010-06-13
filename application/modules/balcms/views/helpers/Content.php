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
	 * Render the Content's Content
	 * @param mixed $Content
	 * @param array $params
	 * @return string rendered content
	 */
	public function renderContentContent ( Content $Content, array $params = array() ) {
		# Fetch
		$content = delve($Content,'content');
		$content_rendered = delve($Content,'content_rendered');
		
		# Prepare Params
		$params['Content'] = $Content;
		
		# Render Content
		$render = $this->_cache
			? $content_rendered
			: $this->renderWidgets(
				format_to_output($content,'rich'),
				$params += array('Content'=>$Content)
			)
		;
			
		# Return render
		return $render;
	}

	/**
	 * Render the Content description
	 * @param mixed $Content
	 * @param array $params
	 * @return string rendered content
	 */
	public function renderContentDescription ( Content $Content, array $params = array() ) {
		# Fetch
		$description = delve($Content,'description');
		$description_rendered = delve($Content,'description_rendered');
		
		# Prepare Params
		$params['Content'] = $Content;
		
		# Render Description
		$render = $this->_cache
			? $description_rendered
			: $this->renderWidgets(
				format_to_output($description,'rich'),
				$params += array('Content'=>$Content)
			)
		;
		
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
		# Check
		$Content = $this->getContentObjectFromParams($params);
		$ContentList = delve($params,'ContentList',array());
		if ( empty($ContentList) ) {
			# Prepare
			$content = delve($params,'content');
			$codes = prepare_csv_array($content);
		
			# Prepare Fetch
			$fetch = array_merge(
				array(
					'limit' => 20
				),
				$params
			);
			//$fetch = array_keys_unset($fetch, array('id','class','title','Content'));
			$fetch = array_keys_keep($fetch, array('featured','codes','limit','recent','Parent'));
			
			# Fetch: Parent
			if ( !isset($fetch['Parent']) ) {
				$fetch['Parent'] = $Content;
			}
			if ( empty($fetch['Parent']) ) {
				unset($fetch['Parent']);
			}
			
			# Fetch: Codes
			if ( !empty($codes) ) {
				$fetch['codes'] = $codes;
			}
		
			# Execute Fetch
			$ContentList = Content::fetch($fetch);
		}
		
		# Apply
		$model = compact('Content','ContentList');
		$model = array_merge($params, $model);
		
		# Return model
		return $model;
	}
	
	/**
	 * Renders the Taglist Widget
	 * 
	 * @param array 			$params [optional]
	 * 							The following options are provided:
	 * 								popular:		If specified to true, will only return the popular tags
	 * 
	 * @return string 			The following params are sent back to partial:
	 * 								Content:		The Content object which is rendering this widget
	 * 								TagList:		Doctrine_Collection of TaggableTags
	 */
	public function renderTaglistWidget ( array $params = array() ) {
		# Fetch
		$Content = $this->getContentObjectFromParams($params);
		if ( delve($params,'popular',false) ) {
			$TagList = Doctrine::getTable('TaggableTag')->getPopularTags('Content');
		}
		else {
			$TagList = Doctrine_Query::create()->select('t.*')->from('TaggableTag t')->orderBy('t.name ASC')->execute();
		}
		
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
	 * Renders the Contentlist Widget
	 * 
	 * @param array 			$params [optional]
	 * 							The following options are provided:
	 * 								featured:		If specified to true, will only return featured content
	 * 								recent:			If specified to true, will order by most recent
	 * 								partial:		If specified, will use this partial to render instead
	 * 
	 * @return string 			The following params are sent back to partial:
	 * 								Content:		The Content object which is rendering this widget
	 * 								ContentList:	A Doctrine_Collection of found Content
	 */
	public function renderContentlistWidget ( array $params = array() ) {
		# Fetch Model
		$model = $this->_generateModel($params);
		
		# Render
		return $this->renderWidgetView(delve($params,'partial','contentlist'), $model);
	}
	
	/**
	 * Renders the Eventlist Widget
	 * 
	 * @param array 			$params [optional]
	 * 							The following options are provided:
	 * 
	 * @return string 			The following params are sent back to partial:
	 * 								Content:		The Content object which is rendering this widget
	 * 								EventsPast:		A Doctrine_Collection of Event objects which occurred in the past
	 * 								EventsFuture:	A Doctrine_Collection of Event objects which will occur in the future
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
			//throw new Zend_Exception('No Content Object or Array passed to the Widget');
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
			//throw new Zend_Exception('No Content Object or Array passed to the Widget');
			return false;
		}
	}
	
}