<?php
/*
 *  $Id$
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * This software consists of voluntary contributions made by many individuals
 * and is licensed under the LGPL. For more information, see
 * <http://www.phpdoctrine.org>.
 */

/**
 * Doctrine_Template_Item
 *
 * Easily create a balFramework Page
 *
 * @package     Doctrine
 * @subpackage  Template
 * @license     http://www.opensource.org/licenses/lgpl-license.php LGPL
 * @link        www.phpdoctrine.org
 * @since       1.0
 * @version     $Revision$
 * @author      Benjamin "balupton" Lupton <contact@balupton.com>
 */
class BalContentExtension extends BalTemplate {
	
    /**
     * Array of options
     * @var string
     */
    protected $_options = array(
		'content_id' => array(
	        'relation'     	=>  'Content',
	        'class'     	=>  'Content',
	        'name'          =>  'content_id',
	        'alias'         =>  null,
	        'type'          =>  'integer',
	        'length'        =>  4,
	        'options'       =>  array(
				'unsigned'	=>	true,
				'notnull'	=>	true
			)
		),
		'id' => array(
	        'name'          =>  'id',
	        'alias'         =>  null,
	        'type'          =>  'integer',
	        'length'        =>  4,
	        'options'       =>  array(
				'primary'	=>	true,
				'unsigned'	=>	true,
				'notnull'	=>	true
			)
		),
		'content' => array(
	        'name'          =>  'content',
	        'alias'         =>  null,
	        'type'          =>  'string',
	        'length'        =>  null,
	        'options'       =>  array(
				'extra'		=>	array(
					'html'	=>	true
				)
			)
		),
    );

    /**
     * Set table definition for Sluggable behavior
     * @return void
     */
    public function setTableDefinition() {
    	// column: content_id
		$this->hasColumnHelper($this->_options['content_id']);
		
		// column: id
		$this->hasColumnHelper($this->_options['id']);
		
		// column: content
		$this->hasColumnHelper($this->_options['content']);
		
		//
        //$this->addListener(new Doctrine_Template_Listener_BALContent($this->_options));
    }
	
    public function setUp(){
        $this->hasOneHelper($this->_options['content_id']);
	}
	
}
