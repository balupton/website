<?php
class Bal_View_Helper_TinyMce extends Zend_View_Helper_Abstract {
	// http://steven.macintyre.name/zend-framework-tinymce-view-helper/
	
    protected $_enabled = false;
    protected $_defaultScript = '/scripts/tiny_mce/tiny_mce.js';

    protected $_supported = array(
        'mode'      => array('textareas', 'specific_textareas', 'exact', 'none'),
        'theme'     => array('simple', 'advanced'),
        'format'    => array('html', 'xhtml'),
        'languages' => array('en'),
        'plugins'   => array('style', 'layer', 'table', 'save',
                             'advhr', 'advimage', 'advlink', 'emotions',
                             'iespell', 'insertdatetime', 'preview', 'media',
                             'searchreplace', 'print', 'contextmenu', 'paste',
                             'directionality', 'fullscreen', 'noneditable', 'visualchars',
                             'nonbreaking', 'xhtmlxtras', 'imagemanager', 'filemanager','template'));

							 protected $_config = array('mode'  =>'textareas',
							'theme' => 'advanced',
                               'element_format' => 'html',
							   'skin' => "o2k7",
							   'skin_variant' => "silver",
							   'plugins' => "safari,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,imagemanager,filemanager",
							   'theme_advanced_resizing' => true,
							   'theme_advanced_buttons1'=>"cut,copy,paste,pastetext,pasteword,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,styleselect,formatselect,forecolor,backcolor",

							   'theme_advanced_buttons2' => "tablecontrols,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,",

							  'theme_advanced_buttons3' => "hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,fullscreen,insertlayer,moveforward,movebackward,absolute,|,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,blockquote,pagebreak",
							   );
    protected $_scriptPath;
    protected $_scriptFile;
    protected $_useCompressor = false;

    public function __set($name, $value)
    {
        $method = 'set' . $name;
        if (!method_exists($this, $method)) {
            throw new Zend_Exception('Invalid tinyMce property');
        }
        $this->$method($value);
    }

    public function __get($name)
    {
        $method = 'get' . $name;
        if (!method_exists($this, $method)) {
            throw new Zend_Exception('Invalid tinyMce property');
        }
        return $this->$method();
    }

    public function setOptions(array $options)
    {
        $methods = get_class_methods($this);
        foreach ($options as $key => $value) {
            $method = 'set' . ucfirst($key);
            if (in_array($method, $methods)) {
                $this->$method($value);
            } else {
                $this->_config[$key] = $value;
            }
        }
        return $this;
    }

    public function TinyMce ()
    {
        return $this;
    }

    public function setScriptPath ($path)
    {
        $this->_scriptPath = rtrim($path,'/');
        return $this;
    }

    public function setScriptFile ($file)
    {
        $this->_scriptFile = (string) $file;
    }

    public function useCompressor ($switch)
    {
        $this->_useCompressor = (bool) $switch;
        return $this;
    }

    public function render()
    {
        if (false === $this->_enabled) {
            $this->_renderScript();
            $this->_renderCompressor();
            $this->_renderEditor();
        }
        $this->_enabled = true;
    }

    protected function _renderScript ()
    {
        if (null === $this->_scriptFile) {
            $script = $this->_defaultScript;
        } else {
            $script = $this->_scriptPath . '/' . $this->_scriptFile;
        }

        $this->view->headScript()->appendFile($script);
        return $this;
    }

    protected function _renderCompressor ()
    {
        if (false === $this->_useCompressor) {
            return;
        }
        $script = 'tinyMCE_GZ.init({' . PHP_EOL
                . 'themes: "' . implode(',', $this->_supportedTheme) . '"' . PHP_EOL
                . 'plugins: "'. implode(',', $this->_supportedPlugins) . '"' . PHP_EOL
                . 'languages: "' . implode(',', $this->_supportedLanguages) . '"' . PHP_EOL
                . 'disk_cache: true' . PHP_EOL
                . 'debug: false' . PHP_EOL
                . '});';

        $this->view->headScript()->appendScript($script);
        return $this;
    }

    protected function _renderEditor ()
    {
        $script = 'tinyMCE.init({' . PHP_EOL;

        foreach ($this->_config as $name => $value) {
            if (is_array($value)) {
                $value = implode(',', $value);
            }
            if (!is_bool($value)) {
                $value = '"' . $value . '"';
            }
            $script .= $name . ': ' . $value . ',' . PHP_EOL;
        }

        $script .= '});';

        $this->view->headScript()->appendScript($script);
        return $this;
    }
}
