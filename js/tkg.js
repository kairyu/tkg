function TKG() {

	var _debug = 1;
	var _keycode_map = {};
	var _keycode_map_reversed = {};
	var _matrix_rows = 0;
	var _matrix_cols = 0;
	var _matrix_map = 0;
	var _max_layers = 0;
	var _max_fns = 0;
	var _layers = [];
	var _keymaps = [];

	var _init = function(object) {
		_keycode_map = object["keycode_map"];
		console.log(_keycode_map);
		_keycode_map_reversed = _generateReversedKeycodeMap(_keycode_map);
		console.log(_keycode_map_reversed);
		_max_layers = object["max_layers"];
		_max_fns = object["max_fns"];
		_matrix_rows = object["matrix_rows"];
		_matrix_cols = object["matrix_cols"];
		_matrix_map = object["matrix_map"];
	}

	var _generateReversedKeycodeMap = function(keycode_map) {
		var keycode_map_reversed = {};
		for (var symbol in keycode_map) {
			var value = keycode_map[symbol];
			if (value["label"]) {
				var labels = value["label"];
				if (_.isArray(labels)) {
					for (var i = 0; i < labels.length; i++) {
						if (_.isArray(labels[i])) {
							for (var j = 0; j < labels[i].length; j++) {
								var label = labels[i][j];
								var conflicted = false;
								if (keycode_map_reversed[label]) {
									conflicted = true;
								}
								_smartPush(keycode_map_reversed[label], symbol);
								if (conflicted) {
									_consoleWarn("Conflicted label: " + label);
									_consoleWare(keycode_map_reversed[label]);
								}
							}
						}
						else if (_.isString(labels[i])) {
							var label = labels[i];
							var conflicted = false;
							if (keycode_map_reversed[label]) {
								conflicted = true;
							}
							_smartPush(keycode_map_reversed[label], symbol);
							if (conflicted) {
								_consoleWarn("Conflicted label: " + label);
								_consoleWare(keycode_map_reversed[label]);
							}
						}
						else {
							_consoleError("Unknown label type");
						}
					}
				}
				else {
					_consoleError("Invalid label data");
				}
			}
		}
		return keycode_map_reversed;
	}

	var _smartPush = function(target, value) {
		if (target) {
			if (_.isArray(target)) {
				target.push(value);
			}
			else {
				target = [ target, value ];
			}
		}
		else {
			target = value;
		}
	}

	var _parseLayer = function(layer_number, raw_string) {
		if (layer_number >= _max_layers) {
			return false;
		}
		var layer = _layers[layer_number];

		layer = _parseRawString(raw_string);
		if (layer["error"]) {
			return false;
		}
	}

	var _parseRawString = function(raw_string) {
		var layer;

		// parse raw string to object
		var raw;
		try{
			eval("raw = [" + raw_string + "]");
		} catch (e) {
			_raiseError(layer["error"], "general", "Invalid raw data", raw_string);
			return layer;
		}

		// parse object to keys
		var keys = [];
		var c_x = 0;
		var c_y = 0;
		var c_w = 1;
		var c_h = 1;
		var before_first_key = false;
		if (!_.isArray(raw)) {
			_raiseError(layer["error"], "general", "Invalid raw data", raw);
			return layer;
		}
		for (var i = 0; i < raw.length; i++) {
			if (!_.isArray(raw[i])) { continue; }
			c_x = 0;
			for (var j = 0; j < raw[i].length; j++) {
				var el = raw[i][j];
				if (_.isObject(el)) {
					if (el.x) { c_x += el.x; }
					if (!before_first_key && j == 0 && el.y) { c_y += el.y; }
					if (el.w) { c_w = el.w; }
					if (el.h) { c_h = el.h; }
				}
				else if (_.isString(el)) {
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
		layer["keys"] = keys;
		return layer;
	}

	var _parseKeycode = function(layer) {
		// check keys
		if (!layer["keys"] || !_.isArray(layer["keys"])) {
			_raiseError(layer["error"], "general", "Invalid key data", layer["keys"]);
			return layer;
		}

		// parse keycode from label
		var keys = layer["keys"];
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

	var _consoleError = function(message) {
		if (_debug) {
			console.error(message);
		}
	}

	var _consoleWarn = function(message) {
		if (_debug) {
			console.warn(message);
		}
	}

	var _raiseError = function(object, type, message, dump) {
		if (!object[type]) {
			object[type] = [];
		}
		object[type].push(message);
		_consoleError(message);
		if (dump) {
			_consoleError(dump);
		}
	}

	var _clearError = function(object) {
		object = {};
	}

	// public methods
	this.init = _init;
	this.parseLayer = _parseLayer;
}
