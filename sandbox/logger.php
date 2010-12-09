<?php

# Config
error_reporting(E_ALL);

# Set the headers
header( 'Expires: Mon, 26 Jul 1997 05:00:00 GMT' );
header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . ' GMT' );
header( 'Cache-Control: no-store, no-cache, must-revalidate' );
header( 'Cache-Control: post-check=0, pre-check=0', false );
header( 'Pragma: no-cache' );
header( 'Content-Type: text/plain' );

# Database vars
require_once(dirname(__FILE__).'/_db.config.php'); // include $db_config
$db_config['table'] = 'sandbox_logger';

# Connect
mysql_connect($db_config['host'], $db_config['user'], $db_config['password']);
mysql_select_db($db_config['name']);
if ( $mysql_error = mysql_error() ) die($mysql_error);

# Install Table if need be
function mysql_table_exists ( $table_name, $db_name )
{
	$tables = mysql_list_tables ($db_name); 
	while (list ($temp) = mysql_fetch_array ($tables)) {
		if ($temp === $table_name) {
			return TRUE;
		}
	}
	return FALSE;
}

if ( !mysql_table_exists($db_config['table'], $db_config['name']) )
{	// Table doesn't exist, create it
	mysql_query(
		'CREATE TABLE `'.$db_config['name'].'`.`'.$db_config['table'].'` (
			`id` INT( 11 ) NOT NULL AUTO_INCREMENT,
			`data` TEXT NOT NULL ,
			PRIMARY KEY ( `id` )
		) ENGINE = InnoDB'
	);
	if ( $mysql_error = mysql_error() ) die($mysql_error);
}

# Get Vars
$pass_code	= ( isset($_GET['pass_code'])	? stripslashes($_GET['pass_code'])	: NULL );
$notify_email	= ( isset($_GET['notify_email'])	? stripslashes($_GET['notify_email'])	: NULL );
$url		= ( isset($_GET['url'])			? stripslashes($_GET['url'])		: ( isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : NULL ) );
$ip			= $_SERVER['REMOTE_ADDR'] . ( isset($_SERVER['REMOTE_PORT']) ? ':'.$_SERVER['REMOTE_PORT'] : '' );
$time		= date('Y-m-d H:i:s');
$show_source = ( isset($_GET['show_source'])	? stripslashes($_GET['show_source'])	: NULL );

# Check that the user is authorized
if ( $pass_code !== 'secret_key' )
{	// User not authorized
	die('You are not authorized.');
}	unset($_GET['pass_code']);

# Show the source
if ( $show_source )
{	// Show it
	$source = file_get_contents(__FILE__);
	die($source);
}

# Create data
$data = array_merge($_GET, compact('url', 'ip', 'time')); // compact('variable', 'value', 'url', 'ip', 'time');

# Insert if needed
if ( !empty($_GET) )
{	
	mysql_query('INSERT INTO `'.$db_config['table'].'` (`data`) VALUES ("'.addslashes(serialize($data)).'") ');
	if ( $mysql_error = mysql_error() ) die($mysql_error);
	//
	if ( $notify_email )
	{	// Send email if needed
		if ( !mail($notify_email, 'LOGGER: A new log entry has occured', var_export($data, true)) )
		{
			echo 'failed sending email';
		}
	}
	die;
}

# Display
echo 'LOGGER'."\r\n".
	'Usage: http://www.balupton.com/sandbox/logger.php?pass_code=secret_key&var=value&notify_email=optional'."\r\n".
	'Source: http://localhost.balupton.com/sandbox/logger.php?pass_code=secret_key&show_source=true'."\r\n".
	'======================='."\r\n";

# Display rows
$mysql_result = mysql_query('SELECT * FROM `'.$db_config['table'].'` ORDER BY `id` DESC');
if ( $mysql_error = mysql_error() ) die($mysql_error);
while ( $row = mysql_fetch_assoc($mysql_result) )
{	// Display
	$data = unserialize($row['data']);
	var_dump($data);
	echo "\r\n".'======================='."\r\n";
}
mysql_free_result($mysql_result);

?>