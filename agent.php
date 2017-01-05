<?php
$hash = '';
$response = '';
$error = true;

if (isset($_GET['layouts'])) {
	$hash = $_GET['layouts'];
	if (preg_match("/^[0-9a-z]+$/i", $hash)) {
	}
	else {
		die('Invalid Parameter');
	}
}
else {
	die('Invalid Parameter');
}

$url = 'http://www.keyboard-layout-editor.com.s3.amazonaws.com/layouts/' . $hash;
$response = file_get_contents($url);
if ($response) {
	$json = @json_decode($response);
	if ($json) {
		$error = false;
	}
}

if ($error) {
	header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404);
}
else {
	header('Content-Type: application/json');
	echo($response);
}

exit();
?>
