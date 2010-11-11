<?php
require_once 'Zend/View/Helper/Abstract.php';
class Balcms_View_Helper_Social extends Zend_View_Helper_Abstract {

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
		# Set
		$this->view = $view;
		
		# Done
		return true;
	}
	
	/**
	 * Self Reference
	 * @return Zend_View_Helper_Interface
	 */
	public function social ( ) {
		# Chain
		return $this;
	}
	
	public function renderYoutubeWidget ( $params = array() ) {
		# Prepare
		$content = $params['content'];
		$prefix = 'http://www.youtube.com/v/';
		
		# Handle
		$code = false;
		if ( strstr($content, '/') ) {
			# We have a url
			$url = $content;
			$matches = array();
			preg_match('/v[\/=]([^&]+)/', $url, $matches);
			$code = $matches[1];
		} else {
			$code = $content;
		}
		
		# Generate
		$youtube = $prefix.$code;
		
		# Apply the Model
		$model = compact('youtube');
		$model = array_merge($params, $model);
		
		# Render
		return $this->view->getHelper('widget')->renderWidgetView(delve($params,'partial','social/youtube/youtube'), $model);
	}
	
	public function renderVimeoWidget ( $params = array() ) {
		# Prepare
		$oembed_endpoint = 'http://www.vimeo.com/api/oembed';
		
		# Extract
		$video_url = $params['content'];

		# Create the URLs
		$json_url = $oembed_endpoint.'.json?url='.rawurlencode($video_url);
		
		# Load in the oEmbed Object
		$Oembed = json_decode(file_get_contents($json_url));

		# Apply the Model
		$model = compact('Oembed');
		$model = array_merge($params, $model);
		
		# Render
		return $this->view->getHelper('widget')->renderWidgetView(delve($params,'partial','social/vimeo/vimeo'), $model);
	}
	
}