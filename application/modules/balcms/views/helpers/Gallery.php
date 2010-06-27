<?php
require_once 'Zend/View/Helper/Abstract.php';
class Balcms_View_Helper_Gallery extends Zend_View_Helper_Abstract {

	/*{
		"photoset": {
			"id": "72157624220884481", 
			"primary": "4729184767", 
			"owner": "35776898@N00", 
			"ownername": "balupton", 
			"photo": [
				{
					"id": "4729184767", 
					"secret": "34ee02e352", 
					"server": "1036", 
					"farm": 2, 
					"title": "Photo on 2010-06-08 at 15.20 #2", 
					"isprimary": "1", 
					"url_sq": "http://farm2.static.flickr.com/1036/4729184767_34ee02e352_s.jpg", 
					"height_sq": 75, 
					"width_sq": 75, 
					"url_t": "http://farm2.static.flickr.com/1036/4729184767_34ee02e352_t.jpg", 
					"height_t": "75", 
					"width_t": "100", 
					"url_s": "http://farm2.static.flickr.com/1036/4729184767_34ee02e352_m.jpg", 
					"height_s": "180", 
					"width_s": "240", 
					"url_m": "http://farm2.static.flickr.com/1036/4729184767_34ee02e352.jpg", 
					"height_m": "375", 
					"width_m": "500"
				}
			], 
			"page": 1, 
			"per_page": 500, 
			"perpage": 500, 
			"pages": 1, 
			"total": "3"
		}, 
		"stat": "ok"
	}*/
	
	/**
	 * Flickr API Key
	 * @var flickr_key
	 */
	protected $_flickr_key = '0b7d8cb1377281adf7628d296a4eb99d';
	
	/**
	 * Flickr API Url
	 * @var flickr_url
	 */
	protected $_flickr_url = 'http://api.flickr.com/services/rest/?';
	
	/**
	 * Self Reference
	 * @return Zend_View_Helper_Interface
	 */
	public function gallery ( ) {
		# Chain
		return $this;
	}
	
	/**
	 * Renders the Gallery Widget
	 * 
	 * @param array 			$params [optional]
	 * 							The following options are provided:
	 * 								flickr:			URL of a flickr page which we want to grab the images from
	 * 
	 * @return string 			The following params are sent back to partial:
	 * 								Content:		The Content object which is rendering this widget
	 * 								ImageList:		Array of Image Elements (arrays)
	 */
	public function renderGalleryWidget ( $params = array() ) {
		# Prepare
		$content = $params['content'];
		$flickr = delve($params,'flickr');
		$xhtml = '';
		
		# Handle
		switch ( true ) {
			case $flickr:
				# We are a flickr plugin
				$xhtml = $this->_handleFlickr($flickr);
				break;
			
			default:
				# Error
				throw new Bal_Exception(array(
					'error-widget-gallery-unknown',
					'params' => $params
				));
				break;
		}
		
		# Return the render
		return $xhtml;
	}
	
	protected function _handleFlickr ( $input ) {
		# Prepare
		$input = trim($input,'/');
		$xhtml = '';
		
		# Handle
		switch ( true ) {
			case strstr($input,'/sets/'):
				# Photoset
				$photoset = substr($input, strrpos($input,'/')+1);
				$xhtml = $this->_handleFlickr_Photoset($photoset);
				break;
			
			case strstr($input,'/galleries/'):
				# Photoset
				$gallery = substr($input, strrpos($input,'/')+1);
				$xhtml = $this->_handleFlickr_Gallery($gallery);
				break;
			
			case strstr($input,'/favorites'):
				# Photoset
				$user = substr($input, 0, strrpos($input,'/'));
				$user = substr($user, strrpos($user,'/')+1);
				$xhtml = $this->_handleFlickr_Favorites($user);
				break;
			
			case $input:
				# Search
				$xhtml = $this->_handleFlickr_Search($input);
				break;
			
			default:
				# Error
				throw new Bal_Exception(array(
					'error-widget-gallery-flickr-unknown',
					'params' => $params
				));
				break;
		}
		
		# Return xhtml
		return $xhtml;
	}
	
	protected function _requestFlickr ( array $params ) {
		# Fetch Flickr Response
		$response = file_get_contents($this->_flickr_url.implode_querystring($params,'&'));
		$response_object = unserialize($response);
		
		# Check
		if ( delve($response_object,'stat') !== 'ok' ) {
			throw new Bal_Exception(array(
				'error-flickr',
				'params' => $params,
				'response' => $response,
				'response_object' => $response_object
			));
		}
		
		# Return response_object
		return $response_object;
	}
	
	protected function _handleFlickr_Photoset ( $id ) {
		# Prepare
		$xhtml = '';
		$model = array();
		
		# flickr.photosets.getInfo
		$params = array(
			'api_key' => $this->_flickr_key,
			'method' => 'flickr.photosets.getInfo',
			'format' => 'php_serial',
			'photoset_id' => $id
		);
		$response = $this->_requestFlickr($params);
		
		# flickr.photosets.getPhotos
		$params = array_merge($params,array(
			'method' => 'flickr.photosets.getPhotos',
			'extras' => 'url_sq, url_t, url_s, url_m, url_o',
			'privacy_filter' => 1
		));
		$response = array_merge($response,$this->_requestFlickr($params));
		
		# Apply the Model
		$model = array('flickr' => $response);
		$model = array_merge($params, $model);
		
		# Render Widget
		$xhtml = $this->view->getHelper('widget')->renderWidgetView(delve($params,'partial','gallery/gallery/flickr/photoset'), $model);
		
		# Return xhtml
		return $xhtml;
	}
	
	protected function _handleFlickr_Gallery ( $id ) {
		# Prepare
		$xhtml = '';
		$model = array();
		
		# flickr.galleries.getInfo
		$params = array(
			'api_key' => $this->_flickr_key,
			'method' => 'flickr.galleries.getInfo',
			'format' => 'php_serial',
			'gallery_id' => $id
		);
		$response = $this->_requestFlickr($params);
		
		# flickr.galleries.getPhotos
		$params = array_merge($params,array(
			'method' => 'flickr.galleries.getPhotos',
			'extras' => 'url_sq, url_t, url_s, url_m, url_o',
			'privacy_filter' => 1
		));
		$response = array_merge($response,$this->_requestFlickr($params));
		
		# Apply the Model
		$model = array('flickr' => $response);
		$model = array_merge($params, $model);
		
		# Render Widget
		$xhtml = $this->view->getHelper('widget')->renderWidgetView(delve($params,'partial','gallery/gallery/flickr/gallery'), $model);
		
		# Return xhtml
		return $xhtml;
	}
	
	protected function _handleFlickr_Favorites ( $id ) {
		# Prepare
		$xhtml = '';
		$model = array();
		
		# flickr.people.getInfo
		$params = array(
			'api_key' => $this->_flickr_key,
			'method' => 'flickr.people.getInfo',
			'format' => 'php_serial',
			'user_id' => $id
		);
		$response = $this->_requestFlickr($params);
		
		# flickr.favorites.getPublicList
		$params = array_merge($params,array(
			'method' => 'flickr.favorites.getPublicList',
			'extras' => 'url_sq, url_t, url_s, url_m, url_o',
			'privacy_filter' => 1
		));
		$response = array_merge($response,$this->_requestFlickr($params));
		
		# Apply the Model
		$model = array('flickr' => $response);
		$model = array_merge($params, $model);
		
		# Render Widget
		$xhtml = $this->view->getHelper('widget')->renderWidgetView(delve($params,'partial','gallery/gallery/flickr/favorites'), $model);
		
		# Return xhtml
		return $xhtml;
	}
	
	protected function _handleFlickr_Search ( $search ) {
		# Prepare
		$xhtml = '';
		$model = array();
		
		# flickr.photos.search
		$params = array(
			'api_key' => $this->_flickr_key,
			'method' => 'flickr.photos.search',
			'format' => 'php_serial',
			'text' => $search,
			'extras' => 'url_sq, url_t, url_s, url_m, url_o',
			'privacy_filter' => 1,
			'sort' => 'interestingness-desc'
		);
		$response = $this->_requestFlickr($params);
		
		# Apply the Model
		$model = array('flickr' => $response, 'search'=>$search);
		$model = array_merge($params, $model);
		
		# Render Widget
		$xhtml = $this->view->getHelper('widget')->renderWidgetView(delve($params,'partial','gallery/gallery/flickr/search'), $model);
		
		# Return xhtml
		return $xhtml;
	}
	
}