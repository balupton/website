<?php
class Bal_View_Helper_FormTinyMce extends Zend_View_Helper_FormTextarea {
	// http://steven.macintyre.name/zend-framework-tinymce-view-helper/
	
	protected $_tinyMce;

	public function FormTinyMce ($name, $value = null, $attribs = null)
	{
		$info = $this->_getInfo($name, $value, $attribs);
		extract($info); // name, value, attribs, options, listsep, disable

		$disabled = '';
		if ($disable) {
			$disabled = ' disabled="disabled"';
		}

		if (empty($attribs['rows'])) {
			$attribs['rows'] = (int) $this->rows;
		}
		if (empty($attribs['cols'])) {
			$attribs['cols'] = (int) $this->cols;
		}

		if (isset($attribs['editorOptions'])) {
			if ($attribs['editorOptions'] instanceof Zend_Config) {
				$attribs['editorOptions'] = $attribs['editorOptions']->toArray();
			}
			$this->view->tinyMce()->setOptions($attribs['editorOptions']);
			unset($attribs['editorOptions']);
		}
		$this->view->tinyMce()->render();

		$xhtml = '<textarea name="' . $this->view->escape($name) . '"'
		. ' id="' . $this->view->escape($id) . '"'
		. $disabled
		. $this->_htmlAttribs($attribs) . '>'
		. $this->view->escape($value) . '</textarea>';

		return $xhtml;
	}
}
