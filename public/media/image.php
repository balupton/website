<?php
# Init
$bootstrap = $run = false;
require_once (dirname(__FILE__) . '/../../index.php');

# Requires
require_once (BALPHP_PATH . '/core/functions/_image.funcs.php');
require_once (BALPHP_PATH . '/core/functions/_files.funcs.php');

# Config
global $Application;
$Application->bootstrap('config');
$applicationConfig = Zend_Registry::get('applicationConfig');

var_dump(PUBLIC_URL, MEDIA_URL, IMAGES_URL);
die;

# Fetch
$image_location = ltrim($_GET['image'], '/');
$height = intval(!empty($_GET['height']) ? $_GET['height'] : (!empty($_GET['h']) ? $_GET['h'] : 0));
$width = intval(!empty($_GET['width']) ? $_GET['width'] : (!empty($_GET['w']) ? $_GET['w'] : 0));
$quality = intval(!empty($_GET['quality']) ? $_GET['quality'] : (!empty($_GET['q']) ? $_GET['q'] : 90));

# Prepare
$image_path = realpath(MEDIA_PATH . DIRECTORY_SEPARATOR . $image_location);
if ( strpos($image_path, $media_path) !== 0 ) {
	throw new Exception('Invalid image location was attempted. <' . $image_path . ' | ' . $image_location . '>');
}
$image_filename_new = get_filename($image_location, true) . '-' . $height . 'x' . $width . 'q' . $quality . '.' . get_extension($image_location);
$image_path_new = IMAGES_PATH . DIRECTORY_SEPARATOR . $image_filename_new;
$image_url_new = IMAGES_URL . '/' . $image_filename_new;

# URL
$image_url = MEDIA_URL . '/' . $image_location;

# Prepare
$image_url_to_use = $image_url_new;

# Check
if ( is_file($image_path_new) ) {
	# Done already
} else {
	# Create
	

	# Arguments
	$image_args = array('image' => $image_path, 'resize_mode' => 'area', 'width_new' => $width, 'height_new' => $height, 'quality' => $quality);
	
	# Resize
	$image = image_remake($image_args);
	if ( !$image ) {
		# Failed
		$image_url_to_use = $image_url;
	} else {
		# Save
		file_put_contents($image_path_new, $image);
	}
}

# Redirect
header('Location: ' . $image_url_to_use);
die();
