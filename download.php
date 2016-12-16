<?php

define('TKG', true);
define('CACHE_DIR', './cache');
include_once('functions.php');

$filetype = '';
$matrix_rows = 0;
$matrix_cols = 0;
$matrix_size = 0;
$max_layers = 0;
$max_fns = 0;
$keymaps = array();
$fn_actions = array();
$additional = array();
$eeprom_size = 0;
$file = '';
$header = '';
$filename = '';
$name_main = '';
$name_variant = '';

// check get
if (isset($_GET['file'])) {
	$filetype = $_GET['file'];
	if (!in_array($filetype, array('bin', 'hex', 'eep', 'c'))) {
		die('Invalid Parameter');
	}
}
else {
	die('Invalid Parameter');
}

disable_magic_quotes();

// check post data
if ($filetype == 'bin' || $filetype == 'eep' || $filetype == 'c') {
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
		if ($filetype == 'bin' || $filetype == 'eep') {
			if (isset($_POST['eep_size']) && isset($_POST['eep_start'])) {
				$eep_size = intval($_POST['eep_size']);
				$eep_start = intval($_POST['eep_start']);
			}
			else {
				die('Invalid EEP Data');
			}
			if (isset($_POST['additional'])) {
				$additional = json_decode($_POST['additional'], true);
			}
		}
		if (isset($_POST['matrix_size'])) {
			$matrix_size = intval($_POST['matrix_size']);
		}
	}
	else {
		die('Invalid Data');
	}
}
else if ($filetype == 'hex') {
	if (
		isset($_POST['name_main']) &&
		isset($_POST['name_variant'])
	) {
		$name_main = str_replace('./\\', '', $_POST['name_main']);
		$name_variant = str_replace('./\\', '', $_POST['name_variant']);
	}
	else {
		die('Invalid Data');
	}
}

// make bin file
if ($filetype == 'bin') {
	$filename = 'EEPROM.BIN';
	$hash = sha1(serialize(array(
		'matrix_rows' => $matrix_rows,
		'matrix_cols' => $matrix_cols,
		'max_layers' => $max_layers,
		'max_fns' => $max_fns,
		'keymaps' => $keymaps,
		'fn_actions' => $fn_actions,
		'eep_size' => $eep_size,
		'eep_start' => $eep_start,
		'additional' => $additional
	)));
	// check cache
	$cache = check_cache('bin', $hash);
	if (is_null($cache)) {
		// no cache
		$file = generate_bin_file($matrix_rows, $matrix_cols, $matrix_size, $max_layers, $max_fns, $keymaps, $fn_actions, $eep_size, $eep_start, $additional);
		write_cache('bin', $hash, $file);
	}
	else {
		// has cache
		$file = $cache;
	}
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
		'eep_start' => $eep_start,
		'additional' => $additional
	)));
	// check cache
	$cache = check_cache('eep', $hash);
	if (is_null($cache)) {
		// no cache
		$file = generate_eep_file($matrix_rows, $matrix_cols, $matrix_size, $max_layers, $max_fns, $keymaps, $fn_actions, $eep_size, $eep_start, $additional);
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

// make hex file
if ($filetype == 'hex') {
	$filename = $name_main;
	if (!empty($name_variant)) {
		$filename .= '-' . $name_variant;
	}
	$filename .= '.hex';
	$file = file_get_contents('keyboard/firmware/' . $filename);
}

// download
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . strlen($file));
echo($file);
//var_dump($keymaps);

exit();

?>
