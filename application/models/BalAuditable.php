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
 * Easily track a balFramework changes
 *
 * @package     Doctrine
 * @subpackage  Template
 * @license     http://www.opensource.org/licenses/lgpl-license.php LGPL
 * @link        www.phpdoctrine.org
 * @since       1.0
 * @version     $Revision$
 * @author      Benjamin "balupton" Lupton <contact@balupton.com>
 */
class BalAuditable extends BalTemplate {
	
    /**
     * Array of options
     * @var string
     */
    protected $_options = array(
		'created_at' => array(
			'disabled'		=>	false,
        	'name'			=>	'created_at',
			'type'			=>	'timestamp'
		),
		'updated_at' => array(
			'disabled'		=>	false,
        	'name'			=>	'updated_at',
			'type'			=>	'timestamp'
		),
		'published_at' => array(
			'disabled'		=>	false,
        	'name'			=>	'published_at',
	        'alias'         =>  null,
			'type'			=>	'timestamp',
			'length'		=>	null,
	        'options'       =>  array(
				'notblank'	=>	true
			)
		),
		'status' => array(
			'disabled'		=>	false,
	        'name'          =>  'status',
	        'alias'         =>  null,
	        'type'          =>  'enum',
	        'length'        =>  10,
	        'options'       =>  array(
				'values'	=>	array('pending','published','deprecated'),
				'default'	=>	'published',
				'notnull'	=>	true
			)
		),
		'enabled' => array(
			'disabled'		=>	false,
	        'name'          =>  'enabled',
	        'alias'         =>  null,
	        'type'          =>  'boolean',
	        'length'        =>  1,
	        'options'       =>  array(
				'default'	=>	true,
				'notnull'	=>	true
			)
		),
		'author' => array(
			'disabled'		=>	false,
	        'relation'     	=>  'Author',
	        'class'     	=>  'User',
	        'name'          =>  'user_id',
	        'alias'         =>  null,
	        'type'          =>  'integer',
	        'length'        =>  2,
	        'options'       =>  array(
				'unsigned'	=>	true
			)
		)
    );

    /**
     * Set table definition
     * @return void
     */
    public function setTableDefinition() {
		$this->hasColumnHelper($this->_options['published_at']);
		$this->hasColumnHelper($this->_options['author']);
		$this->hasColumnHelper($this->_options['enabled']);
		$this->hasColumnHelper($this->_options['status']);
		// // Behaviours
        $timestampable0 = new Doctrine_Template_Timestampable(array(
			'created' => $this->_options['created_at'],
			'updated' => $this->_options['updated_at']
		));
        $this->actAs($timestampable0);
        // Listener
        $this->addListener(new BalAuditableListener($this->_options));
    }
	
    /**
     * Setup table relations
     * @return void
     */
    public function setUp(){
        $this->hasOneHelper($this->_options['author']);
	}
	
}
