<?php

/**
 * BaseArticle
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @property timestamp $sent_at
 * @property integer $sent_all
 * @property integer $sent_remaining
 * @property enum $satus
 * @property Doctrine_Collection $Subscribers
 * @property Doctrine_Collection $ArticleSubscriber
 * 
 * @package    ##PACKAGE##
 * @subpackage ##SUBPACKAGE##
 * @author     ##NAME## <##EMAIL##>
 * @version    SVN: $Id: Builder.php 6508 2009-10-14 06:28:49Z jwage $
 */
abstract class BaseArticle extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('article');
        $this->hasColumn('sent_at', 'timestamp', null, array(
             'type' => 'timestamp',
             ));
        $this->hasColumn('sent_all', 'integer', 4, array(
             'type' => 'integer',
             'length' => '4',
             ));
        $this->hasColumn('sent_remaining', 'integer', 4, array(
             'type' => 'integer',
             'length' => '4',
             ));
        $this->hasColumn('satus', 'enum', null, array(
             'type' => 'enum',
             'values' => 
             array(
              0 => 'unsent',
              1 => 'sending',
              2 => 'sent',
             ),
             'default' => 'unsent',
             'notblank' => true,
             ));
    }

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('Subscriber as Subscribers', array(
             'refClass' => 'ArticleSubscriber',
             'local' => 'article_id',
             'foreign' => 'subscriber_id'));

        $this->hasMany('ArticleSubscriber', array(
             'local' => 'id',
             'foreign' => 'article_id'));

        $balcontentextension0 = new BALContentExtension();
        $this->actAs($balcontentextension0);
    }
}