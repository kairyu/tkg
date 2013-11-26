function TKG() {

	var _debug = 1;
	var _keycode_map = {};
	var _keycode_map_reversed = {};
	var _max_layers = 0;
	var _max_fns = 0;
	var _matrix_rows = 0;
	var _matrix_cols = 0;
	var _matrix_map = {};
	var _layers = [];
	var _fns = [];
	var _matrices = [];
	var _keymaps_hex = [];
	var _keymaps_symbol = [];
	var _fn_actions_hex = [];
	var _fn_actions_symbol = [];

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
			// if has label property
			if (value["label"]) {
				var labels = value["label"];
				// if label is array as expected
				if (_.isArray(labels)) {
					for (var i = 0; i < labels.length; i++) {
						// 2d array
						if (_.isArray(labels[i])) {
							for (var j = 0; j < labels[i].length; j++) {
								var label = labels[i][j].toLowerCase();
								var conflicted = false;
								if (keycode_map_reversed[label]) {
									conflicted = true;
								}
								keycode_map_reversed[label] = _smartPush(keycode_map_reversed[label], symbol);
								if (conflicted) {
									_consoleWarn("Conflicted label: " + label);
									_consoleWarn(keycode_map_reversed[label]);
								}
							}
						}
						// 1d array
						else if (_.isString(labels[i])) {
							var label = labels[i].toLowerCase();
							var conflicted = false;
							if (keycode_map_reversed[label]) {
								conflicted = true;
							}
							keycode_map_reversed[label] = _smartPush(keycode_map_reversed[label], symbol);
							if (conflicted) {
								_consoleWarn("Conflicted label: " + label);
								_consoleWarn(keycode_map_reversed[label]);
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
		return target;
	}

	var _parseLayer = function(layer_number, raw_string) {
		if (layer_number >= _max_layers) {
			_consoleError("Layer number out of bounds");
			return false;
		}

		var layer = _layers[layer_number];
		var matrix = _matrices[layer_number];

		// parse raw string to keys
		layer = _parseRawString(raw_string);
		if (!_.isEmpty(layer["error"])) {
			return false;
		}

		// parse keycode from label
		layer = _parseKeycode(layer);
		console.log(layer);
		
		// parse fns from layer
		_fns = _parseFns(layer);
		console.log(_fns);

		// parse matrix from position
		matrix = _parseMatrix(layer);
		console.log(matrix);

		// generate keymap from matrix

	}

	var _parseRawString = function(raw_string) {
		var layer = {};
		var error = {};
		var warn = {};

		// parse raw string to object
		var raw;
		try{
			eval("raw = [" + raw_string + "]");
		} catch (e) {
			_raiseError(error, "general", "Invalid raw data", raw_string);
			return layer;
		}

		// parse object to keys
		var keys = [];
		var c_x = 0;
		var c_y = 0;
		var c_w = 1;
		var c_h = 1;
		var before_first_key = true;
		if (!_.isArray(raw)) {
			_raiseError(error, "general", "Invalid raw data", raw);
			return layer;
		}
		for (var i = 0; i < raw.length; i++) {
			if (!_.isArray(raw[i])) { continue; }
			c_x = 0;
			for (var j = 0; j < raw[i].length; j++) {
				var el = raw[i][j];
				// a property object
				if (_.isObject(el)) {
					if (el.x) { c_x += el.x; }
					if (!before_first_key && j == 0 && el.y) { c_y += el.y; }
					if (el.w) { c_w = el.w; }
					if (el.h) { c_h = el.h; }
				}
				// a key
				else if (_.isString(el)) {
					if (before_first_key) { before_first_key = false; }
					var label = _parseLabelString(el);
					if (_.isEmpty(label)) {
						label["top"] = "";
					}
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
		layer["error"] = error;
		layer["warn"] = warn;
		return layer;
	}

	var _parseKeycode = function(layer) {
		var error = layer["error"];
		var warn = layer["warn"];

		// check keys property
		if (!layer["keys"] || !_.isArray(layer["keys"])) {
			_raiseError(error, "general", "Invalid key data", layer["keys"]);
			layer["error"] = error;
			return layer;
		}

		// parse keycode from label
		var keys = layer["keys"];
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			// select label to be used for matching
			var label;
			var label_2;
			if (key["label"]["top"] || key["label"]["top"] == "") {
				label = key["label"]["top"].toLowerCase();
				if (key["label"]["bottom"]) {
					label_2 = key["label"]["bottom"].toLowerCase();
				}
				else {
					label_2 = "";
				}
			}
			else {
				_raiseError(error, "no_valid_label", key["x"] + "," + key["y"], key);
			}
			// if is a known label
			if (_keycode_map_reversed[label]) {
				var symbol = _keycode_map_reversed[label];
				var alt_symbol = "";
				// unique
				if (_.isString(symbol)) {
					alt_symbol = symbol;
				}
				// conflicted
				else if (_.isArray(symbol)) {
					var alt_symbols = [];
					// parse each symbols
					for (var j = 0; j < symbol.length; j++) {
						// get labels in map
						var labels_in_map = _keycode_map[symbol[j]]["label"];
						if (_keycode_map[symbol[j]]["label_2"]) {
							var labels_2_in_map = _keycode_map[symbol[j]]["label_2"];
						}
						else {
							var labels_2_in_map = [];
						}
						var is_found = false;
						// labels in keycode map should be array
						if (_.isArray(labels_in_map) && labels_in_map.length > 0) {
							for (var k = 0; k < labels_in_map.length; k++) {
								var label_in_map = labels_in_map[k];
								// multi group labels
								if (_.isArray(label_in_map)) {
									// if in this group
									if (_.indexOf(label_in_map, label) != -1) {
										is_found = true;
										if (label_2 == "" && labels_in_map[k].length == 0) {
											alt_symbols.push(symbol[j]);
										}
										else if (label_2 || label_2 == "") {
											if (_.indexOf(labels_2_in_map[k], label_2) != -1) {
												alt_symbols.push(symbol[j]);
											}
										}
									}
								}
								// single group labels
								else if (_.isString(label_in_map)) {
									if (_.indexOf(labels_in_map, label) != -1) {
										is_found = true;
										if (label_2 == "" && labels_2_in_map.length == 0) {
											alt_symbols.push(symbol[j]);
										}
										else if (label_2 || label_2 == "") {
											if (_.indexOf(labels_2_in_map, label_2) != -1) {
												alt_symbols.push(symbol[j]);
											}
										}
									}
									break;
								}
							}
							// label not found in any groups
							if (!is_found) {
								_consoleError("Unexpected error: label not found");
							}
						}
						else {
							_consoleError("Invalid label data");
						}
					}
					// check alternative symbols
					if (alt_symbols.length == 0) {
						_consoleError("Unexpected error: no alternative symbols");
						_consoleError(symbol);
					}
					else if (alt_symbols.length == 1) {
						alt_symbol = alt_symbols[0];
					}
					// unsolved conflict
					else {
						var alt_symbols_2 = [];
						for (var m = 0; m < alt_symbols.length; m++) {
							if (_keycode_map[alt_symbols[m]]["label_priority"]) {
								var label_priority = _keycode_map[alt_symbols[m]]["label_priority"];
								if (_.indexOf(label_priority, label) != -1) {
									alt_symbols_2.push(alt_symbols[m]);
								}
							}
						}
						if (alt_symbols_2.length == 1) {
							alt_symbol = alt_symbols_2[0];
							_raiseWarn(warn, "solved_conflict", label + " -> " + alt_symbol, alt_symbols);
						}
						else {
							_raiseError(error, "unsolved_conflict", label, key);
						}
					}
				}
				// set key properties
				if (alt_symbol) {
					_setPropertiesBySymbol(key, alt_symbol);
				}
			}
			// unknown label
			else {
				_raiseError(error, "unknown_label", label, key);
			}
		}

		return layer;
	}

	var _parseFns = function(layer) {
		var fns = [];
		var keys = layer["keys"];
		var error = layer["error"];
		var warn = layer["warn"];
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (key["symbol"]) {
				var symbol = key["symbol"];
				// if is fn key
				if (symbol.search(/^KC_FN/) != -1) {
					var fn_number = symbol.slice(5);
					// fn out of bounds
					if (fn_number >= _max_fns) {
						_raiseError(error, "fn_out_of_bounds", symbol, key);
						symbol = "KC_TRANSPARENT";
						_setPropertiesBySymbol(key, symbol);
					}
					else {
						fns[fn_number] = {};
						_setPropertiesBySymbol(fns[fn_number], symbol);
					}
				}
			}
		}
		return fns;
	}

	var _parseMatrix = function(layer) {
		var matrix = [];
		var error = layer["error"];
		var warn = layer["warn"];

		// check keys property
		if (!layer["keys"] || !_.isArray(layer["keys"])) {
			_raiseError(error, "general", "Invalid key data", layer["keys"]);
			return matrix;
		}

		// init matrix
		for (var i = 0; i < _matrix_rows; i++) {
			matrix[i] = [];
		}

		// parse matrix from position
		var keys = layer["keys"];
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			var index = _positionToIndex(key["x"], key["y"], key["w"], key["h"]);
			if (_matrix_map[index]) {
				var row = _matrix_map[index]["row"];
				var col = _matrix_map[index]["col"];
				var symbol = key["short_name"] ? key["short_name"] : key["symbol"];
				key["matrix"] = {
					"row": row,
					"col": col
				};
				matrix[row][col] = symbol;
			}
			else {
				_raiseError(error, "matrix_missmapping", i, key);
			}
		}

		return matrix;
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

	var _positionToIndex = function(x, y, w, h) {
		var index = x + "," + y;
		if (w > 1) {
			index += "," + w;
		}
		if (h > 1) {
			index += "," + h;
		}
		return index;
	}

	var _setPropertiesBySymbol = function(object, symbol) {
		object["symbol"] = symbol;
		object["keycode"] = _keycode_map[symbol]["keycode"];
		if (_keycode_map[symbol]["short_name"]) {
			object["short_name"] = _keycode_map[symbol]["short_name"];
		}
		return object;
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
		_consoleError(type + ": " + message);
		if (dump) {
			_consoleError(dump);
		}
	}

	var _raiseWarn = function(object, type, message, dump) {
		if (!object[type]) {
			object[type] = [];
		}
		object[type].push(message);
		_consoleWarn(type + ": " + message);
		if (dump) {
			_consoleWarn(dump);
		}
	}

	var _clearError = function(object) {
		object = {};
	}

	// public methods
	this.init = _init;
	this.parseLayer = _parseLayer;
}
