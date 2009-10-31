<?php
require_once 'Zend/View/Helper/Partial.php';
class Bal_View_Helper_Show extends Zend_View_Helper_Partial {

    /**
     * Redirectes to Partial
     * @return string|Zend_View_Helper_Partial
     */
	public function show ($name = null, $module = null, $model = null) {
		return $this->partial($name, $module, $model);
	}
	
    /**
     * Clone the current View
     * @return Zend_View_Interface
     */
    public function cloneView() {
        $view = clone $this->view;
        // $view->clearVars();
        return $view;
    }
	
}
