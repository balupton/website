<?php
require_once 'Zend/Form/Element/Textarea.php';
class Bal_Form_Element_TinyMce extends Zend_Form_Element_Textarea {
	// http://steven.macintyre.name/zend-framework-tinymce-view-helper/
	
	/**
	* Use formTextarea view helper by default
	* @var string
	*/
	public $helper = 'formTinyMce';
}
