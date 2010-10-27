<?php

if ( empty($_SERVER['HTTP_HOST']) ) {
	// We are running in the cli
	var_dump($_SERVER);
}