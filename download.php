<?php

define('TKG', true);
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
$filename = '';

// check get
if (isset($_GET['file'])) {
	$filetype = $_GET['file'];
	if (!in_array(array('eep', 'h'), $filetype)) {
		die('Invalid Parameter');
	}
}
else {
	die('Invalid Parameter');
}

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
			die('Invalid Data');
		}
	}
}
else {
	die('Invalid Data');
}

// make eep file
if ($filetype == 'eep') {

	// generate binary data
	$keymap_bin = '';
	// fn actions
	for ($fn = 0; $fn < $max_fns; $fn++) {
		$keymap_bin .= pack('v', $fn_actions[$fn]);
	}
	// keymaps
	for ($layer = 0; $layer < $max_layers; $layers++) {
		for ($row = 0; $row < $matrix_rows; $row++) {
			for ($col = 0; $col < $matrix_cols; $col++) {
				$keymap_bin .= pack('C', $keymaps[$layer][$row][$col]);
			}
		}
	}
	// checksum
	$checksum = 0xFEED;
	for ($i = 0; $i < strlen($keymap_bin); $i += 2) {
		list(,$word) = unpack('v', substr($keymap_bin, $i, 2));
		$checksum ^= $word;
	}
	$keymap_bin = pack('v', $checksum) . $keymap_bin;

	// fill eeprom
	$eep_bin = '';
	$eep_bin .= str_repeat(pack('C', 0xFF), $eep_start);
	$eep_bin .= $keymap_bin;
	$eep_bin .= str_repeat(pack('C', 0xFF), $eep_size - $eep_start - strlen($keymap_bin));

	// generate to hex
	$file = bin_to_intel_hex($eep_bin);
	$filename = 'keymap.eep';
	
}

// download
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . strlen($file));
echo($file);

exit();

?>
