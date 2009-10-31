<?php
require_once 'Zend/Cotnroller/Action/Helper/Abstract.php';
/**
 * AJAXY Zend Plugin
 * Copyright (C) 2009 Benjamin Arthur Lupton
 * http://www.balupton.com/projects/ajaxy/
 *
 * This file is part of Balupton's Resource Library (balPHP).
 *
 * Balupton's Resource Library (balPHP) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * Balupton's Resource Library (balPHP)is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Balupton's Resource Library (balPHP).  If not, see <http://www.gnu.org/licenses/>.
 *
 * @uses Zend_Controller_Action_Helper_Abstract
 * @package balphp
 * @version 0.1.0-final, August 3, 2009
 * @since 0.1.0-final, August 3, 2009
 * @author Benjamin "balupton" Lupton <contact@balupton.com> - {@link http://www.balupton.com/}
 * @copyright Copyright (c) 2009, Benjamin Arthur Lupton - {@link http://www.balupton.com/}
 * @license http://www.gnu.org/licenses/agpl.html GNU Affero General Public License
 */
class Bal_Controller_Action_Helper_Ajaxy extends Zend_Controller_Action_Helper_Abstract
{
	// Reference Variables
	protected $_actionController = null;
	protected $_actionView = null;
	protected $_actionRequest = null;
	protected $_json = null;
	protected $_session = null;
	protected $_xhr = null;
	
	protected $_data = array(
		'redirected' => false
	);
	
	/**
	 * Initialise Ajaxy
	 * @return
	 */
	public function init(){
		$this->configure($this->getActionController(), $this->_actionController->view, $this->_actionController->getRequest());
		$this->_json = Zend_Controller_Action_HelperBroker::getStaticHelper('json');
		$this->_session = new Zend_Session_Namespace('Ajaxy');
		// Store whether we are a ajax request
		$this->_session->xhr = $this->isAjax();
		$this->_session->served = false;
		$this->_session->last_url = $this->getURL();
		$this->_session->last_hit = time();
	}
	
	/**
	 * Configure Ajaxy
	 * @param object $actionController
	 * @param object $actionView
	 * @param object $actionRequest
	 * @return
	 */
	public function configure($actionController, $actionView, $actionRequest) {
		$this->_actionController = $actionController;
		$this->_actionView = $actionView;
		$this->_actionRequest = $actionRequest;
	}
	
	/**
	 * Get URL
	 * @return
	 */
	public function getURL ( ) {
		return $_SERVER['REQUEST_URI'] ? $_SERVER['REQUEST_URI'] : $_SERVER['SCRIPT_NAME'].'?'.$_SERVER['QUERY_STRING'];
	}
	
	/**
	 * Check if we are a Ajaxy request
	 * @return
	 */
	public function isAjax ( ) {
		if ( $this->_xhr === null ) {
			$xhr = $this->_actionRequest->isXmlHttpRequest();
			if ( !$xhr && !empty($_REQUEST['ajax']) ) $xhr = 'param';
			if ( !$xhr ) {
				// We are definitly not a AJAX request
				// But perhaps we have come from a redirect of a AJAX request
				// So check if the last request was an ajax request
				// And check if the last request was not sent
				// And that we have been accessed in an appropriate redirect timeframe
				if ( $this->_session->xhr && !$this->_session->served && strtotime('-5 seconds', time()) < $this->_session->last_hit ) {
					// We came from a redirect from a ajaxy request
					$xhr = true;
					// Save some data into data
					$this->_data['redirected']['to'] = $this->getURL();
				}
			}
			// Log the XHR into the Session
			$this->_xhr = $xhr;
		}
		return $this->_xhr;
	}
	
	/**
	 * Send JSON Data
	 * @param object $data
	 * @return
	 */
	public function send ( $data ) {
		$this->_json->sendJson($data);
	}
	
	/**
	 * Render our Action, via html or json depending on request
	 * @param string $html_view
	 * @param array $ajaxy_levels
	 * @return
	 */
    public function render($html_view, $ajaxy_levels, $ajaxy_data = array()){
		// Render
		
		// Cycle through levels independent arrays
		$routes = $controllers = array();
		foreach ( $ajaxy_levels as $route => $controller ) {
			// Populate with view variables
			$route = preg_replace('/:(\w+)/ie', '\$this->_actionView->${1}', $route);
			$controller = preg_replace('/:(\w+)/ie', '\$this->_actionView->${1}', $controller);
			// Update
			$routes[] = $route;
			$controllers[] = $controller;
		}
		
		// Fetch
		$ajaxy_options = !empty($_REQUEST['Ajaxy']) ? $_REQUEST['Ajaxy'] : array();
		
    	// Save
		$routes_old = $this->_session->ajaxy_routes;
		$this->_session->ajaxy_routes = $routes;
		$this->_session->served = true;
		
		$xhr = $this->isAjax();
		if ( $xhr ) {
			// JSON
			
			// Discover controller
			$controller = '';
			foreach ( $routes as $i => $route ) {
				// Check old part
				if ( !isset($routes_old[$i]) ) {
					break;
				}
				
				// Save the current controller
				$controller = $controllers[$i];
				
				// We have the old part
				$route_old = $routes_old[$i];
				
				// Compare old with new
				if ( $route_old != $route ) {
					// Mismatch
					break;
				}
			}
			
			// Data
			if ( is_string($ajaxy_data) ) {
				$ajaxy_data = explode(',', $ajaxy_data);
				$ajaxy_data_new = array();
				foreach ( $ajaxy_data as $item ) {
					$ajaxy_data_new[$item] = $this->_actionView->$item;
				}
				$ajaxy_data = $ajaxy_data_new;
				unset($ajaxy_data_new);
			}
			$ajaxy_data['Ajaxy'] = $this->_data;
			
			// Dispatch
            $zend_controller = $this->_actionRequest->getControllerName();
            $viewScript = $zend_controller.DIRECTORY_SEPARATOR.$controller.'.'.$this->_actionController->viewSuffix;
			
			// Perform
			$zend_view = $this->_actionView->render($viewScript);
			$zend_title = html_entity_decode(strip_tags($this->_actionView->headTitle()->toString()));
			$data = array_merge(array(
				'controller' => $controller,
				'title' => $zend_title,
				'view' => $zend_view,
			), $ajaxy_data);
			
			// Send
			if ( !empty($ajaxy_options['form'])) {
				// Form
				$val = json_encode($data);
      			$response = $this->_json->getResponse();
				$response->clearHeaders()->clearBody();
				$response->setBody('<html><head></head><body><textarea class="response">'.$val.'</textarea></body></html>');
				$response->sendResponse();
				exit;
			}  elseif ( $xhr === 'param' ) {
				// Sepecial
				$this->_json->suppressExit = true;
				$this->_json->sendJson($data);
      			$response = $this->_json->getResponse();
				$response->setHeader('Content-Type', 'text/plain; charset=utf-8');
            	$response->sendResponse();
            	exit;
			} else {
				// Normal
				$this->_json->sendJson($data);
			}
			
			
		} else {
			// HTML
			$this->_actionController->render($html_view);
		}
    }
}

