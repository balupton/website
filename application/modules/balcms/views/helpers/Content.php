<?php
require_once 'Zend/View/Helper/Abstract.php';
class Balcms_View_Helper_Content extends Zend_View_Helper_Abstract {
	
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
		$this->_App = Bal_App::getPlugin('Bal_Controller_Plugin_App');
		
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
		return $this->view->getHelper('widget')->renderWidgetView(delve($params,'partial','content/taglist/taglist'), $model);
	}
	
	/**
	 * Renders the url of the file
	 * @param $params
	 * @return string
	 */
	public function renderUrlWidget ( array $params = array() ) {
		return $this->view->app()->getFileUrl($params['file']);
	}
	
	
	/**
	 * Renders a code block
	 * @param $params
	 * @return string
	 */
	public function renderCodeWidget ( array $params = array() ) {
		# Extract
		$content = delve($params,'content','');
		$language = delve($params,'language','');
		$encoded = delve($params,'encoded',true);
		if ( $language ) $language = 'language-'.$language;
		
		# Encode
		$encodedContent = $encoded ? $content : $content.str_replace(
			array(
				'&',
				'<',
				'>',
				'[',
				']'
			),
			array(
				'&amp;',
				'&lt;',
				'&gt;',
				'&#91;',
				'&#93;'
			)
		);
		
		# Return
		return '<pre class="code '.$language.'">'.$encodedContent.'</pre>';
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
		return $this->view->getHelper('widget')->renderWidgetView(delve($params,'partial','content/subscribe/subscribe'), $model);
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
		return $this->view->getHelper('widget')->renderWidgetView(delve($params,'partial','content/contentlist/contentlist'), $model);
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
		return $this->view->getHelper('widget')->renderWidgetView(delve($params,'partial','content/eventlist/eventlist'), $model);
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