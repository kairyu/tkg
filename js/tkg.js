function TKG() {

	var _debug = 3;
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
		_consoleLog("keycode_map:");
		_consoleLog(_keycode_map);
		_keycode_map_reversed = _generateReversedKeycodeMap(_keycode_map);
		_consoleLog("keycode_map_reversed:");
		_consoleLog(_keycode_map_reversed);
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
									_consoleLog("Conflicted label: " + label);
									_consoleLog(keycode_map_reversed[label]);
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
								_consoleLog("Conflicted label: " + label);
								_consoleLog(keycode_map_reversed[label]);
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
		var keymap_hex = _keymaps_hex[layer_number];
		var keymap_symbol = _keymaps_symbol[layer_number];

		// parse raw string to keys
		layer = _parseRawString(raw_string);
		if (!_.isEmpty(layer["error"])) {
			return false;
		}

		// parse keycode from label
		layer = _parseKeycode(layer);
		_consoleLog("layer:");
		_consoleLog(layer);
		
		// parse fns from layer
		_fns = _parseFns(layer);
		_consoleLog("fns:");
		_consoleLog(_fns);

		// parse matrix from position
		matrix = _parseMatrix(layer);
		_consoleLog("matrix:");
		_consoleLog(matrix);

		// generate keymap from matrix
		keymap_hex = _generateKeymapHex(matrix);
		keymap_symbol = _generateKeymapSymbol(matrix);
		_consoleLog("keymap_hex:");
		_consoleLog(keymap_hex);
		_consoleLog("keymap_symbol:");
		_consoleLog(keymap_symbol);
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
		var c_x2 = 0;
		var c_w2 = 0;
		var before_first_key = true;
		var stepped = false;
		var rowspan = false;
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
					if (el.l) { stepped = true; }
					if (el.h && el.h > 1) { rowspan = true; }
					if (el.x) {
						if (stepped) {
							stepped = false;
						}
						else if (rowspan) {
						}
						else {
							c_x += el.x;
						}
					}
					if (!before_first_key && j == 0 && el.y) { c_y += el.y; }
					if (el.w) { c_w = el.w; }
					if (el.h) { c_h = el.h; }
					if (stepped && el.w2) { c_w = el.w2; }
					if (rowspan) {
						if (el.x2) {
							c_x2 = c_x + el.x;
							c_x = c_x2 + el.x2;
						}
						else {
							c_x2 = c_x;
						}
						if (el.w2) {
							c_w2 = el.w;
							c_w = el.w2;
						}
						else {
							c_w2 = c_w;
						}
					}
				}
				// a key
				else if (_.isString(el)) {
					if (before_first_key) { before_first_key = false; }
					var label = _parseLabelString(el);
					if (_.isEmpty(label)) {
						label["top"] = "";
					}
					var key = {
						"label": label,
						"x": c_x,
						"y": c_y,
						"w": c_w,
						"h": c_h
					};
					if (rowspan) {
						if (c_x2 != c_x || c_w2 != c_w) { key["x2"] = c_x2; }
						if (c_w2 != c_w) { key["w2"] = c_w2; }
						rowspan = false;
					}
					keys.push(key);
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

		// guess keycode from label
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
					if (_matchLabelsWithSymbol(label, label_2, symbol)) {
						alt_symbol = symbol;
					}
					else {
						var message = label + (label_2 ? "\n" + label_2 : "");
						_raiseError(error, "no_matching_keycode", message, key);
					}
				}
				// conflicted
				else if (_.isArray(symbol)) {
					var symbols = symbol;
					var alt_symbols = [];
					// parse each symbol
					for (var j = 0; j < symbols.length; j++) {
						var symbol = symbols[j];
						if (_matchLabelsWithSymbol(label, label_2, symbol)) {
							alt_symbols.push(symbol);
						}
					}
					// check alternative symbols
					if (alt_symbols.length == 0) {
						_consoleError("Unexpected error: no alternative symbols");
						_consoleError(symbol);
					}
					// solved
					else if (alt_symbols.length == 1) {
						alt_symbol = alt_symbols[0];
					}
					// unsolved conflict
					else {
						var alt_symbols_round2 = [];
						for (var j = 0; j < alt_symbols.length; j++) {
							if (_matchLabelsWithSymbol(label, label_2, alt_symbols[j], "label_priority")) {
								alt_symbols_round2.push(alt_symbols[j]);
							}
						}
						if (alt_symbols_round2.length == 1) {
							alt_symbol = alt_symbols_round2[0];
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

	var _matchLabelsWithSymbol = function(label, label_2, symbol, property_name) {
		// check arguments
		if (arguments.length == 3) {
			property_name = "label";
		}
		else if (arguments.length == 4) {
		}
		else {
			_consoleError("Wrong function call");
			return false;
		}
		var property_name_2 = property_name + "_2";

		// try to find symbol in keycode map
		if (_keycode_map[symbol]) {
			var element = _keycode_map[symbol];
			// has label property
			if (element[property_name]) {
				// has label_2 property
				if (element[property_name_2]) {
					return _matchLabels(label, element[property_name], label_2, element[property_name_2]);
				}
				else {
					return _matchLabels(label, element[property_name]);
				}
			}
			else {
				_consoleWarn("No such label property: " + property_name);
				return false;
			}
		}
		// not found
		else {
			_consoleError("Symbol not found");
			return false;
		}
	}

	var _matchLabels = function(label, target_labels, label_2, target_labels_2) {
		var match_2;
		// check arguments
		if (arguments.length == 2) {
			match_2 = false;
		}
		else if (arguments.length == 4) {
			match_2 = true;
		}
		else {
			_consoleError("Wrong function call");
			return false;
		}

		// if is not array
		if (!_.isArray(target_labels)) {
			_consoleError("Unknown label type");
			return false;
		}
		// if is empty array
		if (target_labels.length == 0) {
			_consoleError("Unknown label type");
			return false;
		}

		// 2d array
		if (_.isArray(target_labels[0])) {
			for (var i = 0; i < target_labels.length; i++) {
				if (match_2) {
					if (_matchLabels(label, target_labels[i], label_2, target_labels_2[i])) {
						return true;
					}
				}
				else {
					if (_matchLabels(label, target_labels[i])) {
						return true;
					}
				}
			}
			return false;
		}
		// 1d array
		else if (_.isString(target_labels[0])) {
			// label found
			if (_.indexOf(target_labels, label) != -1) {
				// if match with label_2
				if (match_2) {
					// not a array
					if (!_.isArray(target_labels_2)) {
						_consoleError("Unknown label type");
						return false;
					}
					// ignore label_2
					if (target_labels_2.length == 0) {
						return true;
					}
					// match with label_2
					if (_.indexOf(target_labels_2, label_2) != -1) {
						return true;
					}
					else {
						return false;
					}
				}
				// only match label
				else {
					return true;
				}
			}
			// not found
			else {
				return false;
			}
		}
		// unknown type
		else {
			_consoleError("Unknown label type");
			return false;
		}
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
			var index = _positionToIndex(key["x"], key["y"], key["w"], key["h"], key["x2"], key["w2"]);
			if (_matrix_map[index]) {
				var row = _matrix_map[index]["row"];
				var col = _matrix_map[index]["col"];
				//var symbol = key["short_name"] ? key["short_name"] : key["symbol"];
				var symbol = key["symbol"];
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

	var _generateKeymapHex = function(matrix) {
		var keymap = [];
		var default_keycode = 1;
		for (var row = 0; row < _matrix_rows; row++) {
			keymap.push([]);
			for (var col = 0; col < _matrix_cols; col++) {
				if (matrix[row][col]) {
					var symbol = matrix[row][col];
					keymap[row].push(parseInt(_keycode_map[symbol]["keycode"], 16));
				}
				else {
					keymap[row].push(default_keycode);
				}
			}
		}
		return keymap;
	}

	var _generateKeymapSymbol = function(matrix) {
		var keymap = [];
		var default_symbol = "KC_TRANS";
		for (var row = 0; row < _matrix_rows; row++) {
			keymap.push([]);
			for (var col = 0; col < _matrix_cols; col++) {
				if (matrix[row][col]) {
					var symbol = matrix[row][col];
					symbol = _keycode_map[symbol]["short_name"] ? _keycode_map[symbol]["short_name"] : symbol;
					keymap[row].push(symbol);
				}
				else {
					keymap[row].push(default_symbol);
				}
			}
		}
		return keymap;
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

	var _positionToIndex = function(x, y, w, h, x2, w2) {
		var index = x + "," + y;
		if (w > 1 || h > 1) {
			index += "," + w;
		}
		if (h > 1) {
			index += "," + h;
		}
		if (x2 || w2) {
			index += "," + x2;
		}
		if (w2) {
			index += "," + w2;
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
		if (_debug > 0) {
			console.error(message);
		}
	}

	var _consoleWarn = function(message) {
		if (_debug > 1) {
			console.warn(message);
		}
	}

	var _consoleLog = function(message) {
		if (_debug > 2) {
			console.log(message);
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

	var _getError = function(layer_number) {
		if (layer_number > _max_layers) { return false; }
		return _layers[layer_number]["error"];
	}

	var _getWarn = function(layer_number) {
		if (layer_number > _max_layers) { return false; }
		return _layers[layer_number]["warn"];
	}

	var _getFns = function() {
		return _fns;
	}

	// public methods
	this.init = _init;
	this.parseLayer = _parseLayer;
	this.getError = _getError;
	this.getWarn = _getWarn;
	this.getFns = _getFns;
}
