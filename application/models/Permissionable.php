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
 * Add permission capabilities to your models
 *
 * @package     Doctrine
 * @subpackage  Template
 * @license     http://www.opensource.org/licenses/lgpl-license.php LGPL
 * @link        www.phpdoctrine.org
 * @since       1.0
 * @version     $Revision$
 * @author      Benjamin "balupton" Lupton <contact@balupton.com>
 */
class Doctrine_Template_Permissionable extends Doctrine_Template
{
    /**
     * Array of options
     * @var string
     */
    protected $_options = array(
		'Permissions' => array(
	        'class'			=>  'PermissionablePermission',
	        'relation'		=>  'Permissions',
			'refClass'		=>	'%CLASS%PermissionablePermission',
			'generateFiles'	=>	false,
			'table'			=>	false,
			'pluginTable'	=>	false,
			'children'		=>	array()
		),
		'PermissionGroups' => array(
	        'class'			=>  'PermissionablePermissionGroup',
	        'relation'		=>  'PermissionGroups',
			'refClass'		=>	'%CLASS%PermissionGroups',
			'generateFiles'	=>	false,
			'table'			=>	false,
			'pluginTable'	=>	false,
			'children'		=>	array()
		)
    );

    /**
     * Setup table columns
     * @return void
     */
    public function setTableDefinition() {
    }
	
    /**
     * Setup table relations
     * @return void
     */
    public function setUp(){
        $this->hasManyHelper($this->_options['permissions']);
	}
	
}
