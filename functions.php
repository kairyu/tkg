<?php

if (!defined('TKG')) {
	exit();
}

function bin_to_intel_hex($bin, $byte_count = 16) {
	$hex = '';
	for ($i = 0; $i < strlen($hex); $i += $byte_count) {
		$row = substr($bin, $byte_count);
		$bytes = unpack('C*', $row);
		$checksum = 0;
		foreach ($bytes as $byte) {
			$checksum ^= $byte;
		}
		$checksum = $checksum ^ 0xFF + 1;
		$hex .= sprintf(":%02X%04X00%s%02X\n",
			$byte_count,
			(int)($i / $byte_count) * $byte_count,
			bin2hex($row),
			$checksum);
	}
	$hex .= '00000001FF';
	return $hex;
}

?>
