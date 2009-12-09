<?php

/**
 * Base_ContentAndSubscriber
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @property integer $id
 * @property integer $content_id
 * @property integer $subscriber_id
 * @property enum $status
 * @property Content $Content
 * @property Subscriber $Subscriber
 * 
 * @package    ##PACKAGE##
 * @subpackage ##SUBPACKAGE##
 * @author     ##NAME## <##EMAIL##>
 * @version    SVN: $Id: Builder.php 6820 2009-11-30 17:27:49Z jwage $
 */
abstract class Base_ContentAndSubscriber extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('content_and_subscriber');
        $this->hasColumn('id', 'integer', 2, array(
             'primary' => true,
             'type' => 'integer',
             'unsigned' => true,
             'autoincrement' => true,
             'length' => '2',
             ));
        $this->hasColumn('content_id', 'integer', 2, array(
             'type' => 'integer',
             'unsigned' => true,
             'length' => '2',
             ));
        $this->hasColumn('subscriber_id', 'integer', 2, array(
             'type' => 'integer',
             'unsigned' => true,
             'length' => '2',
             ));
        $this->hasColumn('status', 'enum', null, array(
             'type' => 'enum',
             'values' => 
             array(
              0 => 'pending',
              1 => 'sending',
              2 => 'delivered',
              3 => 'failed',
             ),
             'default' => 'pending',
             'notnull' => true,
             ));
    }

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('Content', array(
             'local' => 'content_id',
             'foreign' => 'id'));

        $this->hasOne('Subscriber', array(
             'local' => 'subscriber_id',
             'foreign' => 'id'));
    }
}