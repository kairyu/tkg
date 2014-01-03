<?php

define('TKG', true);
define('CACHE_DIR', './cache');
include_once('functions.php');

$filetype = '';
$matrix_rows = 0;
$matrix_cols = 0;
$max_layers = 0;
$max_fns = 0;
$keymaps = array();
$fn_actions = array();
$eeprom_size = 0;
$file = '';
$header = '';
$filename = '';

// check get
if (isset($_GET['file'])) {
	$filetype = $_GET['file'];
	if (!in_array($filetype, array('eep', 'c'))) {
		die('Invalid Parameter');
	}
}
else {
	die('Invalid Parameter');
}

disable_magic_quotes();

// check post data
if (
	isset($_POST['matrix_rows']) &&
	isset($_POST['matrix_cols']) &&
	isset($_POST['max_layers']) &&
	isset($_POST['max_fns']) &&
	isset($_POST['keymaps']) &&
	isset($_POST['fn_actions'])
) {
	$matrix_rows = intval($_POST['matrix_rows']);
	$matrix_cols = intval($_POST['matrix_cols']);
	$max_layers = intval($_POST['max_layers']);
	$max_fns = intval($_POST['max_fns']);
	$keymaps = json_decode($_POST['keymaps']);
	$fn_actions = json_decode($_POST['fn_actions']);
	if ($filetype == 'eep') {
		if (isset($_POST['eep_size']) && isset($_POST['eep_start'])) {
			$eep_size = intval($_POST['eep_size']);
			$eep_start = intval($_POST['eep_start']);
		}
		else {
			die('Invalid EEP Data');
		}
	}
}
else {
	die('Invalid Data');
}

// make eep file
if ($filetype == 'eep') {
	$filename = 'keymap.eep';
	$hash = sha1(serialize(array(
		'matrix_rows' => $matrix_rows,
		'matrix_cols' => $matrix_cols,
		'max_layers' => $max_layers,
		'max_fns' => $max_fns,
		'keymaps' => $keymaps,
		'fn_actions' => $fn_actions,
		'eep_size' => $eep_size,
		'eep_start' => $eep_start
	)));
	// check cache
	$cache = check_cache('eep', $hash);
	if (is_null($cache)) {
		// no cache
		$file = generate_eep_file($matrix_rows, $matrix_cols, $max_layers, $max_fns, $keymaps, $fn_actions, $eep_size, $eep_start);
		write_cache('eep', $hash, $file);
	}
	else {
		// has cache
		$file = $cache;
	}
}

// make c file
if ($filetype == 'c') {
	$filename = 'keymap.c';
	$hash = sha1(serialize(array(
		'matrix_rows' => $matrix_rows,
		'matrix_cols' => $matrix_cols,
		'max_layers' => $max_layers,
		'max_fns' => $max_fns,
		'keymaps' => $keymaps,
		'fn_actions' => $fn_actions
	)));
	// check cache
	$cache = check_cache('c', $hash);
	$cache = null; //debug
	if (is_null($cache)) {
		// no cache
		$file = generate_c_file($matrix_rows, $matrix_cols, $max_layers, $max_fns, $keymaps, $fn_actions);
		write_cache('c', $hash, $file);
	}
	else {
		// has cache
		$file = $cache;
	}
	// prepend header
	$header = generate_c_header();
	$file = $header . $file;
}

// download
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . strlen($file));
echo($file);
//var_dump($keymaps);

exit();

?>
