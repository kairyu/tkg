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
	$blank_symbol = "KC_NO";
	$blanks = array();
	foreach ($matrices as $matrix) {
		for ($row = 0; $row < count($matrix); $row++) {
			for ($col = 0; $col < count($matrix[$row]); $col++) {
				if ($matrix[$row][$col] == $blank_symbol) {
					array_push($blanks, "$row,$col");
				}
			}
		}
		break;
	}
	foreach ($matrices as $matrix) {
		$alt_blanks = array();
		foreach ($blanks as $blank) {
			list($row, $col) = explode(',', $blank);
			if ($matrix[$row][$col] == $blank_symbol) {
				array_push($alt_blanks, $blank);
			}
		}
		$blanks = $alt_blanks;
	}
	return $blanks;
}

function join_with_func_glur() {
	$params = func_get_args();
	$callback = array_shift($params);
	$array = array_shift($params);
	$join = '';
	$end = end(array_keys($array));
	foreach ($array as $key => $value) {
		$join .= $value;
		if ($key != $end) {
			$join .= call_user_func_array($callback, array_merge(array($value), $params));
		}
	}
	return $join;
}

function str_patch($input, $length, $patch_string = " ") {
	return str_repeat($patch_string, $length - strlen($input));
}

function generate_keymap_macro($macro_name, $matrix_rows, $matrix_cols, $blank_entries = array()) {
	// prepare symbols
	$symbols = array();
	for ($row = 0; $row < $matrix_rows; $row++) {
		array_push($symbols, array());
		for ($col = 0; $col < $matrix_cols; $col++) {
			if (!in_array("$row,$col", $blank_entries)) {
				$symbols[$row][$col] = "K$row" . chr(ord("A") + $col);
			}
			else {
				$symbols[$row][$col] = "";
			}
		}
	}
	// generate macro
	$macro = "#define $macro_name( \\\n    ";
	$macro .= join_with_func_glur(function($val, $width) {
			$glur = preg_match('/,\s*$/', $val) ? " " : ",";
			return $glur . str_patch($val, $width - 1) . " \\\n    ";
		}, array_map(function($array) {
			return join_with_func_glur(function($val) {
				$glue = empty($val) ? " " : ",";
				return $glue . str_patch($val, 4);
			}, $array);
		}, $symbols), $matrix_cols * 5 - 1);
	$macro .= "  \\\n) { \\\n    { ";
	$macro .= join_with_func_glur(function($val, $width) {
			return str_patch($val, $width - 1) . " }, \\\n    { ";
		}, array_map(function($array) {
			return join_with_func_glur(function($val) {
				return "," . str_patch($val, 9);
			}, array_map(function($val) {
				return empty($val) ? "KC_NO" : "KC_##$val";
			}, $array));
		}, $symbols), $matrix_cols * 10 - 1);
	$macro .= " }  \\\n}\n\n";
	return $macro;
}

function generate_keymaps_content($macro_name, $matrix_rows, $matrix_cols, $matrices, $blank_entries = array()) {
	// prepare symbols
	foreach ($matrices as &$matrix) {
		foreach ($blank_entries as $blank) {
			list($row,$col) = explode(",", $blank);
			$matrix[$row][$col] = "";
		}
	}
	unset($matrix);
	// generate array content
	$content = "";
	foreach ($matrices as $layer => $matrix) {
		$content .= "    [$layer] = $macro_name(\n        ";
		$content .= join_with_func_glur(function($val, $width) {
			$glur = preg_match('/,\s*$/', $val) ? " " : ",";
			return $glur . str_patch($val, $width) . " \\\n        ";
		}, array_map(function($array) {
			return join_with_func_glur(function($val) {
				$glue = empty($val) ? " " : ",";
				return $glue . str_patch($val, 4);
			}, array_map(function($val) {
				return substr($val, 3);
			}, $array));
		}, $matrix), $matrix_cols * 5 - 1);
		$content .= "),\n";
	}
	return $content;
}

?>
