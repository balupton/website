<?php
require_once 'Zend/View/Helper/Abstract.php';
abstract class Bal_View_Helper_RenderPartialAbstract extends Zend_View_Helper_Abstract {
	
    /**
     * Partial view script to use for rendering menu
     * @var string|array
     */
    protected $_partial = null;
	
    /**
     * Sets which partial view script to use for rendering menu
     *
     * @param  string|array $partial             partial view script or null. If
     *                                           an array is given, it is
     *                                           expected to contain two values;
     *                                           the partial view script to use,
     *                                           and the module where the script
     *                                           can be found.
     * @return Zend_View_Helper_Navigation_Menu  fluent interface, returns self
     */
    public function setPartial($partial)
    {
        if (null === $partial || is_string($partial) || is_array($partial)) {
            $this->_partial = $partial;
        }
        return $this;
    }

    /**
     * Returns partial view script to use for rendering menu
     *
     * @return string|array|null
     */
    public function getPartial()
    {
        return $this->_partial;
    }

    /**
     * Renders the given $container by invoking the partial view helper
     *
     * The container will simply be passed on as a model to the view script
     * as-is, and will be available in the partial script as 'container', e.g.
     * <code>echo 'Number of pages: ', count($this->container);</code>.
     *
     * @param  array					$model		 [optional] view model to pass to the partial
     * @param  string|array             $partial     [optional] partial view
     *                                               script to use. Default is to
     *                                               use the partial registered
     *                                               in the helper. If an array
     *                                               is given, it is expected to
     *                                               contain two values; the
     *                                               partial view script to use,
     *                                               and the module where the
     *                                               script can be found.
     * @return string                                helper output
     */
    public function renderPartial($model = array(), $partial = null) {
        if (empty($partial)) {
            require_once 'Zend/View/Exception.php';
            throw new Zend_View_Exception('Unable to render partial: No partial view script provided');
        }
		
        if (is_array($partial)) {
            if (count($partial) != 2) {
                require_once 'Zend/View/Exception.php';
                throw new Zend_View_Exception(
                        'Unable to render partial: A view partial supplied as ' .
                        'an array must contain two values: partial view ' .
                        'script and module where script can be found');
            }
            return $this->view->partial($partial[0], $partial[1], $model);
        }

        return $this->view->partial($partial, null, $model);
    }
    
}