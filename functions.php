<?php

if (!defined('TKG')) {
	exit();
}

function calc_checksum_word($bin, $checksum = 0) {
	for ($i = 0; $i < strlen($bin); $i += 2) {
		list(,$word) = unpack('v', substr($bin, $i, 2));
		$checksum = ($checksum + $word) % 0x100;
	}
	return $checksum;
}

function bin_to_intel_hex($bin, $byte_count = 16) {
	$hex = '';
	for ($i = 0; $i < strlen($bin); $i += $byte_count) {
		$block = substr($bin, $i, $byte_count);
		$row = sprintf("%02X%04X00%s",
			$byte_count,
			(int)($i / $byte_count) * $byte_count,
			strtoupper(bin2hex($block)));
		$bytes = unpack('C*', pack("H*", $row));
		$checksum = 0;
		foreach ($bytes as $byte) {
			$checksum = ($checksum + $byte) % 0x100;
		}
		$checksum = (0x100 - $checksum) % 0x100;
		$hex .= sprintf(":%s%02X\n", $row, $checksum);
	}
	$hex .= ':00000001FF';
	return $hex;
}

function parse_blank_entries($matrices) {
	$blanks = array();
	for ($row = 0; $row < count($matrices[0]); $row++) {
		for ($col = 0; $col < count($matrices[0][i]); $col++) {
			if ($matrices[0][$row][$col] == 0) {
				array_push($blanks, "$row,$col");
			}
		}
	}
	for ($i = 1; $i < count($matrices); $i++) {
		for ($j = 0; $j < count($blanks); $j++) {
			list($row, $col) = explode(',', $blanks[$j]);
			if ($matrices[$i][$row][$col] != 0) {
				array_slice($blanks, $j, 1);
			}
		}
	}
	return $blanks;
}

function join_with_callback($callback, $array) {
	$join = '';
	$end = end(array_keys($array));
	foreach ($array as $key => $value) {
		$join .= $value;
		if ($key != $end) {
			$join .= call_user_func($callback, $value);
		}
	}
	return $join;
}

function generate_keymap_macro($macro_name, $matrix_rows, $matrix_cols, $blank_entries = array()) {
	// prepare symbols
	$symbols = array();
	for ($row = 0; $row < $matrix_rows; $row++) {
		array_push($symbols, array());
		for ($col = 0; $col < $matrix_cols; $col++) {
			if (!in_array("$row,$col", $blank_entries)) {
				$symbols[$row][$col] = "K$row" . chr(ord("A" + $col));
			}
			else {
				$symbols[$row][$col] = "";
			}
		}
	}
	// generate macro
	$macro = "#define $macro_name( ";
	$macro .= $join("\\\n    ", array_map(function($array) {
			return $join_with_callback(function($val) {
				$glue = "";
				if (!empty($val)) { $glue .= ","; }
				return $glue . str_repeat(" ", 4 - strlen($val));
			}, $array);
		}, $symbols));
	$macro .= "  \\\n) { \\\n    {";
	$macro .= $join("}, \\\n    { ", array_map(function($array) {
			return $join_with_callback(function($val) {
				return "," . str_repeat(" ", 9 - strlen($val));
			}, $array_map(function($val) {
				return empty($val) ? "KC_NO" : "KC_##$val";
			}, $array));
		}, $symbols));
	$macro .= "}\n";
	return $macro;
}

?>
