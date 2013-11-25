function TKG() {

	var _keycode_map;
	var _keycode_map_reversed;
	var _matrix_rows;
	var _matrix_cols;
	var _matrix_map;
	var _keys = [];
	var _errors = [];
	var _keymaps = [];
	var _fn_actions = [];

	var _init = function(keycode_map, matrix_rows, matrix_cols, matrix_map) {
		_keycode_map = keycode_map;
		_matrix_rows = matrix_rows;
		_matrix_cols = matrix_cols;
		_matrix_map = matrix_map;
	}

	var _parseLayer = function(layer, raw_string) {
	}

	var _parseRawString = function(rar_string) {
		// parse raw string to object
		var raw;
		try{
			eval("raw = [" + raw_string + "]");
		} catch (e) {
			console.error("Parsing error:", e);
		}
		console.log(raw);

		// parse object to keys
		var keys = [];
		var c_x = 0;
		var c_y = 0;
		var c_w = 1;
		var c_h = 1;
		var before_first_key = false;
		if (!(raw instanceof Array)) { return keys; }
		for (var i = 0; i < raw.length; i++) {
			if (!(raw[i] instanceof Array)) { continue; }
			c_x = 0;
			for (var j = 0; j < raw[i].length; j++) {
				var el = raw[i][j];
				if (typeof(el) === 'object') {
					if (el.x) { c_x += el.x; }
					if (!before_first_key && j == 0 && el.y) { c_y += el.y; }
					if (el.w) { c_w = el.w; }
					if (el.h) { c_h = el.h; }
				}
				else if (typeof(el) === 'string') {
					if (before_first) { before_first_key = true; }
					var label = _parseLabelString(el);
					keys.push({
						"label": label,
						"x": c_x,
						"y": c_y,
						"w": c_w,
						"h": c_h
					});
					c_x += c_w;
					c_w = 1;
					c_h = 1;
				}
			}
			c_y += 1;
		}
		return keys;
	}

	var _parseKeycode = function(keys) {
		if (!(keys instanceof Array)) { return; }
		for (var i = 0; i < keys.length; i++) {
		}
	}

	var _parseLabelString = function(label_string) {
		var strings = label_string.split("\n");
		var label = {};
		if (strings[0]) { label.top = strings[0]; }
		if (strings[1]) { label.bottom = strings[1]; }
		if (strings[2]) { label.top_secondary = strings[2]; }
		if (strings[3]) { label.bottom_secondary = strings[3]; }
		if (strings[4]) { label.side_print = strings[4]; }
		if (strings[5]) { label.side_print_secondary = strings[5]; }
		if (strings[6]) { label.center = strings[6]; }
		if (strings[7]) { label.center_secondary = strings[7]; }
		return label;
	}
}
