<?php
require_once 'Zend/View/Helper/Abstract.php';
class Balcms_View_Helper_Social extends Zend_View_Helper_Abstract {

	public function social ( ) {
		return $this;
	}
	
	public function renderYoutubeWidget ( $params = array() ) {
		// Prepare
		$content = $params['content'];
		$prefix = 'http://www.youtube.com/v/';
		
		// Handle
		$code = false;
		if ( strstr($content, '/') ) {
			// We have a url
			$url = $content;
			$matches = array();
			preg_match('/v[\/=]([a-zA-Z]+)/', $url, $matches);
			$code = $matches[1];
		} else {
			$code = $content;
		}
		
		// Heights
		$class = 'youtube-embed';
		$height_css = $width_css = '';
		if ( !empty($params['height']) ) {
			$height = $params['height'];
			$height_css = 'height:'.$height.'px;';
		}
		if ( !empty($params['width']) ) {
			$width = $params['width'];
			$width_css = 'width:'.$width.'px;';
		}
		if ( !empty($params['class']) ) {
			$class = $params['class'];
		}
		
		// Generate
		$url = $prefix.$code;
		
		// Return the render
		return
			'<object type="application/x-shockwave-flash" class="'.$class.'" style="'.$width_css.' '.$height_css.'" data="'.$url.'">'.
			'<param name="movie" value="'.$url.'" />'.
			'</object>';
	}
	
}