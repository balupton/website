<?php
require_once 'Bal/View/Helper/RenderPartialAbstract.php';
class Bal_View_Helper_Editor extends Bal_View_Helper_RenderPartialAbstract {
	
    /**
     * Partial view script to use for rendering menu
     *
     * @var string|array
     */
    protected $_partial = 'editor/editor.phtml';
    
    /**
     * Self Referencing Chaining Function
     */
	public function editor ( ) {
		return $this;
	}
	
    /**
     * Renders menu
     *
     * Implements {@link Bal_View_Helper_RenderPartialAbstract::renderPartial()}.
     *
     * If a partial view is registered in the helper, the menu will be rendered
     * using the given partial script. If no partial is registered, the menu
     * will be rendered as an 'ul' element by the helper's internal method.
     *
     * @see renderPartial()
     */
	public function render(){
		$model = array();
		return $this->renderPartial($model, $this->getPartial());
	}
	
}