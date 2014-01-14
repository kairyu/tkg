function TKG() {

	const _NONE = 0;
	const _ERROR = 1;
	const _WARNING = 2;
	const _DEBUG = 4;
	const _INFO = 8;
	var _log = _ERROR | _WARNING | _DEBUG | _INFO;
	var _simple_mode = true;
	var _keycode_map = {};
	var _keycode_map_reversed = {};
	var _action_map = {};
	var _lr_map = {};
	var _mod_map = {};
	var _on_map = {};
	var _fn_options = {}
	var _action_options = [];
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

	var _setSimpleMode = function(simple_mode) {
		if (_simple_mode != simple_mode) {
			_simple_mode = simple_mode;
			_initVariables();
		}
	}

	var _setKeycodeMap = function(keycode_map) {
		_keycode_map = keycode_map;
		_consoleInfo("keycode_map:");
		_consoleInfo(_keycode_map);
		_keycode_map_reversed = _generateReversedKeycodeMap(_keycode_map);
		_consoleInfo("keycode_map_reversed:");
		_consoleInfo(_keycode_map_reversed);
		_fn_options["key"] = _generateKeyOptions(_keycode_map);
	}

	var _setFnMaps = function(action_map, lr_map, mod_map, on_map) {
		_action_map = action_map;
		_lr_map = lr_map;
		_mod_map = mod_map;
		_on_map = on_map;
		_consoleInfo("action_map:");
		_consoleInfo(_action_map);
		_consoleInfo("lr_map:");
		_consoleInfo(_lr_map);
		_consoleInfo("mod_map:");
		_consoleInfo(_mod_map);
		_consoleInfo("on_map:");
		_consoleInfo(_on_map);
		_fn_options["action"] = _generateActionOptions(_action_map);
		_fn_options["lr"] = _generateLrOptions(_lr_map);
		_fn_options["mod"] = _generateModOptions(_mod_map);
		_fn_options["on"] = _generateOnOptions(_on_map);
	}

	var _init = function(object) {
		// get parameters
		_max_layers = object["max_layers"];
		_max_fns = object["max_fns"];
		_matrix_rows = object["matrix_rows"];
		_matrix_cols = object["matrix_cols"];
		_matrix_map = object["matrix_map"];
		// init variables
		_initVariables();
		// generate options
		_fn_options["layer"] = _generateLayerOptions(_max_layers);
	}

	var _initVariables = function() {
		_layers = [];
		_fns = [];
		_matrices = [];
		_initKeymaps();
		_initFnActions();
	}

	var _initKeymaps = function(layer_number) {
		if (layer_number === undefined) {
			_keymaps_symbol = {};
			for (var i = 0; i < _max_layers; i++) {
				_initKeymaps(i);
			}
		}
		else {
			_keymaps_hex[layer_number] = _generateKeymapHex([]);
		}
	}

	var _initFnActions = function() {
		_fn_actions_symbol = {};
		for (var i = 0; i < _max_fns; i++) {
			_fn_actions_hex[i] = 0;
		}
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
									_consoleDebug("Conflicted label: " + label);
									_consoleDebug(keycode_map_reversed[label]);
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
								_consoleDebug("Conflicted label: " + label);
								_consoleDebug(keycode_map_reversed[label]);
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

	var _generateActionOptions = function(action_map) {
		var options = {};
		for (var symbol in action_map) {
			var action = action_map[symbol];
			var group = action["group"];
			var name = action["name"];
			var description = action["description"];
			if (options[group]) {
				options[group].push({
					"value": symbol,
					"text": name,
					"title": description
				});
			}
			else {
				options[group] = [{
					"value": symbol,
					"text": name,
					"title": description
				}];
			}
		}
		return options;
	}

	var _generateLayerOptions = function(max_layers) {
		var options = [];
		for (var i = 0; i < max_layers; i++) {
			options.push({
				"value": i,
				"text": i,
				"title": i
			});
		}
		return options;
	}

	var _generateOnOptions = function(on_map) {
		var options = [];
		for (var symbol in on_map) {
			var on = on_map[symbol];
			options.push({
				"value": symbol,
				"text": on["name"],
				"title": on["description"]
			});
		}
		return options;
	}

	var _generateLrOptions = function(lr_map) {
		var options = [];
		for (var symbol in lr_map) {
			var lr = lr_map[symbol];
			options.push({
				"value": symbol,
				"text": lr["name"],
				"title": lr["description"]
			});
		}
		return options;
	}

	var _generateModOptions = function(mod_map) {
		var options = [];
		for (var symbol in mod_map) {
			var mod = mod_map[symbol];
			options.push({
				"value": symbol,
				"text": mod["description"],
				"title": mod["name"]
			});
		}
		return options;
	}

	var _generateKeyOptions = function(keycode_map) {
		var key_options = [];
		for (var symbol in keycode_map) {
			var key = keycode_map[symbol];
			var code = parseInt(key["keycode"], 16);
			if (code == 0 || (code >= parseInt("0x04", 16) && code <= parseInt("0x65", 16))) {
				key_options.push({
					"value": symbol,
					"text": key["name"],
					"title": key["description"]
				});
			}
		}
		return key_options;
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
		// console log
		if (!_simple_mode) {
			_consoleInfo("Parse layer");
			_consoleInfo("layer_number: " + layer_number);
		}
		else {
			_consoleInfo("Parse layer simple mode");
		}

		// check layer_number parameter
		layer_number = Number(layer_number);
		if (_simple_mode) {
			if (layer_number != 0) {
				_consoleError("Invalid layer number: " + layer_number);
				return _ERROR;
			}
		}
		else {
			if (layer_number >= _max_layers) {
				_consoleError("Layer number out of bounds");
				return _ERROR;
			}
		}

		var layer = {};
		var fns = [];
		var matrix = [];
		var keymap_hex = [];
		var keymap_symbol = [];
		if (_simple_mode) {
			var layer_2 = {}
			var fns_2 = [];
			var matrix_2 = [];
			var keymap_hex_2 = [];
			var keymap_symbol_2 = [];
		}

		if (raw_string) {
			// parse raw string to keys
			layer = _parseRawString(raw_string);
			if (_simple_mode) {
				layer_2 = _parseRawString(raw_string);
			}
			/*
			if (!_.isEmpty(layer["error"])) {
				_layers[layer_number] = layer;
				if (_simple_mode) {
					_layers[layer_number + 1] = layer_2;
				}
				return _ERROR;
			}
			*/

			// parse keycode from label
			layer = _parseKeycode(layer, "top", "bottom");
			_consoleInfo("layer:");
			_consoleInfo(layer);
			if (_simple_mode) {
				layer_2 = _parseKeycode(layer_2, "side_print", "side_print_secondary");
				_consoleInfo("layer_2:");
				_consoleInfo(layer_2);
			}

			// check warning
			layer = _scanWarn(layer, "top", "bottom");
			if (_simple_mode) {
				layer_2 = _scanWarn(layer_2, "side_print", "side_print_secondary");
			}
		}
		else {
			// clear when raw string is empty
		}

		// set layer
		_layers[layer_number] = layer;
		if (_simple_mode) {
			_layers[layer_number + 1] = layer_2;
		}
		
		// parse fns from layer
		fns = _parseFns(layer);
		fns = _mergeFns(_fns, fns);
		_fns = _cleanFns(fns, _layers);
		_consoleInfo("fns:");
		_consoleInfo(fns);
		_consoleInfo(_fns);
		if (_simple_mode) {
			fns_2 = _parseFns(layer_2);
			fns_2 = _mergeFns(_fns, fns_2);
			_fns = _cleanFns(fns_2, _layers);
			_consoleInfo("fns_2:");
			_consoleInfo(fns_2);
			_consoleInfo(_fns);
			if (_fns[0] && _fns[0]["action"] == "ACTION_NO") {
				_setFns(0, { "action": "ACTION_LAYER_MOMENTARY", "args": [ layer_number + 1 ] });
			}
			if (_fns[1] && _fns[1]["action"] == "ACTION_NO") {
				_setFns(1, { "action": "ACTION_BACKLIGHT_TOGGLE" });
			}
			if (_fns[2] && _fns[2]["action"] == "ACTION_NO") {
				_setFns(2, { "action": "ACTION_BACKLIGHT_DECREASE" });
			}
			if (_fns[3] && _fns[3]["action"] == "ACTION_NO") {
				_setFns(3, { "action": "ACTION_BACKLIGHT_INCREASE" });
			}
		}

		// parse matrix from position
		matrix = _parseMatrix(layer);
		_consoleInfo("matrix:");
		_consoleInfo(matrix);
		if (_simple_mode) {
			matrix_2 = _parseMatrix(layer_2);
			_consoleInfo("matrix_2:");
			_consoleInfo(matrix_2);
		}

		// generate keymap from matrix
		keymap_hex = _generateKeymapHex(matrix);
		keymap_symbol = _generateKeymapSymbol(matrix);
		_consoleInfo("keymap_hex:");
		_consoleInfo(keymap_hex);
		_consoleInfo("keymap_symbol:");
		_consoleInfo(keymap_symbol);
		if (_simple_mode) {
			keymap_hex_2 = _generateKeymapHex(matrix_2);
			keymap_symbol_2 = _generateKeymapSymbol(matrix_2);
			_consoleInfo("keymap_hex_2:");
			_consoleInfo(keymap_hex_2);
			_consoleInfo("keymap_symbol_2:");
			_consoleInfo(keymap_symbol_2);
		}

		// generate fn actions
		_fn_actions_hex = _generateFnActionsHex(_fns);
		_fn_actions_symbol = _generateFnActionsSymbol(_fns);
		_consoleInfo("fn_actions_hex:");
		_consoleInfo(_fn_actions_hex);
		_consoleInfo("fn_actions_symbol:");
		_consoleInfo(_fn_actions_symbol);

		// set variables
		_matrices[layer_number] = matrix;
		_keymaps_hex[layer_number] = keymap_hex;
		_keymaps_symbol[layer_number] = keymap_symbol;
		if (_simple_mode) {
			_matrices[layer_number + 1] = matrix_2;
			_keymaps_hex[layer_number + 1] = keymap_hex_2;
			_keymaps_symbol[layer_number + 1] = keymap_symbol_2;
		}

		// return state
		var state = _NONE;
		if (!_.isEmpty(layer["warn"])) {
			state = _WARNING;
			if (_simple_mode) {
				if (!_.isEmpty(layer_2["warn"])) {
					state = _WARNING;
				}
			}
		}
		if (!_.isEmpty(layer["error"])) {
			state = _ERROR;
			if (_simple_mode) {
				if (!_.isEmpty(layer_2["error"])) {
					state = _ERROR;
				}
			}
		}
		return state;
	}

	var _parseRawString = function(raw_string) {
		var layer = {};
		var error = {};
		var warn = {};
		var info = {};

		// parse raw string to object
		var raw;
		try{
			eval("raw = [" + raw_string + "]");
		} catch (e) {
			var message = "Invalid raw data";
			_raiseError(error, "general", message, message, raw_string);
			layer["error"] = error;
			layer["warn"] = warn;
			layer["info"] = info;
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
			var message = "Invalid raw data";
			_raiseError(error, "general", message, message, raw_string);
			layer["error"] = error;
			layer["warn"] = warn;
			layer["info"] = info;
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

		if (keys.length == 0) {
			var message = "Invalid raw data";
			_raiseError(error, "general", message, message, raw_string);
		}
		else {
			layer["keys"] = keys;
		}
		layer["error"] = error;
		layer["warn"] = warn;
		layer["info"] = info;
		return layer;
	}

	var _parseKeycode = function(layer, label_property, label_property_2) {
		var error = layer["error"];
		var warn = layer["warn"];
		var info = layer["info"];

		// check keys property
		if (!layer["keys"] || !_.isArray(layer["keys"])) {
			//var message = "Invalid key data";
			//_raiseError(error, "general", message, message, layer["keys"]);
			return layer;
		}
		
		// check label parameter
		if (!label_property) {
			_consoleError("Wrong function call");
			return false;
		}

		// guess keycode from label
		var keys = layer["keys"];
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			// select label to be used for matching
			var label;
			var label_2;
			if (key["label"][label_property] || key["label"][label_property] == "") {
				label = key["label"][label_property].toLowerCase();
			}
			else {
				label = "";
				_consoleDebug("No valid label: " + key["x"] + "," + key["y"]);
				_consoleDebug(key);
			}
			if (label_property_2 && key["label"][label_property_2]) {
				label_2 = key["label"][label_property_2].toLowerCase();
			}
			else {
				label_2 = "";
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
						_raiseError(error, "no_matching_keycode", key, message, key);
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
						var message = label + (label_2 ? "\n" + label_2 : "");
						_raiseError(error, "no_matching_keycode", key, message, key);
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
							var message = label + " -> " + alt_symbol;
							_raiseInfo(info, "solved_conflict", key, message, alt_symbols);
						}
						else {
							_raiseError(error, "unsolved_conflict", key, label, key);
						}
					}
				}
				// set key properties
				if (alt_symbol) {
					_setKeyPropertiesBySymbol(key, alt_symbol);
				}
			}
			// unknown label
			else {
				_raiseError(error, "unknown_label", key, label, key);
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
				_consoleDebug("No such label property: " + property_name);
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

	var _scanWarn = function(layer, label_property, label_property_2) {
		var keys = layer["keys"] || [];
		var warn = layer["warn"];
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (key["symbol"]) {
				var symbol = key["symbol"];
				var target = _keycode_map[symbol];
				if (key["label"][label_property_2]) {
					var label = key["label"][label_property];
					var label_2 = key["label"][label_property_2];
					var target_labels = target["label"];
					if (_.isArray(target_labels[0])) {
						for (var j = 0; j < target_labels.length; j++) {
							if (_.indexOf(target_labels[j], label) != -1) {
								if (!target["label_2"][j]) {
									_raiseWarn(warn, "label_2_ignored", key, label_2, key);
								}
							}
						}
					}
					else if (_.isString(target_labels[0])) {
						if (!target["label_2"]) {
							_raiseWarn(warn, "label_2_ignored", key, label_2, key);
						}
					}
				}
			}
		}

		return layer;
	}

	var _parseFns = function(layer) {
		var fns = [];
		var keys = layer["keys"] || [];
		var error = layer["error"];
		var warn = layer["warn"];
		var info = layer["info"];
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (key["symbol"]) {
				var symbol = key["symbol"];
				// if is fn key
				if (symbol.search(/^KC_FN/) != -1) {
					var fn_number = symbol.slice(5);
					// fn out of bounds
					if (fn_number >= _max_fns) {
						_raiseWarn(warn, "fn_out_of_bounds", key, symbol, key);
						symbol = "KC_TRANSPARENT";
						_setKeyPropertiesBySymbol(key, symbol);
					}
					else {
						fns[fn_number] = {};
						_setKeyPropertiesBySymbol(fns[fn_number], symbol);
						_setFnPropertiesBySymbol(fns[fn_number], "ACTION_NO");
					}
				}
			}
		}
		return fns;
	}

	var _mergeFns = function(fns1, fns2) {
		var fns = fns1;
		for (var index in fns2) {
			var fn = fns[index] || false;
			var fn2 = fns2[index];
			if (!fn || fn2["action"] != "ACTION_NO") {
				fns[index] = fn2;
			}
		}
		return fns;
	}

	var _cleanFns = function(fns, layers) {
		var fns_cleaned = [];
		for (var layer_number in layers) {
			var layer = layers[layer_number];
			if (layer["keys"]) {
				var keys = layer["keys"];
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					if (key["symbol"]) {
						var symbol = key["symbol"];
						if (symbol.search(/^KC_FN/) != -1) {
							var fn_number = symbol.slice(5);
							if (fns[fn_number]) {
								fns_cleaned[fn_number] = fns[fn_number];
							}
						}
					}
				}
			}
		}
		return fns_cleaned;
	}

	var _parseMatrix = function(layer) {
		var matrix = [];
		var error = layer["error"];
		var warn = layer["warn"];
		var info = layer["info"];
		var keys = layer["keys"] || [];

		// init matrix
		if (keys) {
			for (var i = 0; i < _matrix_rows; i++) {
				matrix[i] = [];
			}
		}

		// parse matrix from position
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
				_raiseError(error, "matrix_missmapping", key, index, key);
			}
		}

		return matrix;
	}

	var _generateKeymapHex = function(matrix) {
		var keymap = [];
		var default_keycode = 0;
		for (var row = 0; row < _matrix_rows; row++) {
			keymap.push([]);
			for (var col = 0; col < _matrix_cols; col++) {
				if (matrix.length && matrix[row][col]) {
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
		var default_symbol = "KC_NO";
		for (var row = 0; row < _matrix_rows; row++) {
			keymap.push([]);
			for (var col = 0; col < _matrix_cols; col++) {
				if (matrix.length && matrix[row][col]) {
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

	var _generateFnActionsHex = function(fn) {
		if (fn["action"]) {
			var hex = "0x0000";
			var action = fn["action"];
			if (_action_map[action]) {
				var code = _action_map[action]["code"];
				if (_.isFunction(code)) {
					hex = code.apply(code, fn["args"]);
				}
				else {
					hex = code;
				}
			}
			return parseInt(hex, 16);
		}
		else {
			var fn_actions = [];
			for (var i = 0; i < _max_fns; i++) {
				if (fn[i]) {
					fn_actions[i] = _generateFnActionsHex(fn[i]);
				}
			}
			return fn_actions;
		}
	}

	var _generateFnActionsSymbol = function(fn, index) {
		if (fn["action"]) {
			var action = fn["action"];
			var array = [ action ];
			if (fn["args"]) {
				array = array.concat(fn["args"]);
			}
			return array;
		}
		else {
			var fn_actions = [];
			for (var i in fn) {
				fn_actions[i] = _generateFnActionsSymbol(fn[i]);
			}
			return fn_actions;
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

	var _setKeyPropertiesBySymbol = function(key, symbol) {
		key["symbol"] = symbol;
		key["keycode"] = _keycode_map[symbol]["keycode"];
		key["description"] = _keycode_map[symbol]["description"];
		if (_keycode_map[symbol]["short_name"]) {
			key["short_name"] = _keycode_map[symbol]["short_name"];
		}
		return key;
	}

	var _setFnPropertiesBySymbol = function(fn, symbol) {
		fn["action"] = symbol;
		if (_action_map[symbol]["param"]) {
			fn["param"] = _action_map[symbol]["param"];
			fn["default"] = _action_map[symbol]["default"];
			fn["args"] = [];
		}
		return fn;
	}

	var _consoleError = function(message) {
		if (Boolean(_log & _ERROR)) {
			if (_.isObject(message)) {
				console.error(message);
			}
			else {
				console.error("ERROR: " + message);
			}
		}
	}

	var _consoleWarn = function(message) {
		if (Boolean(_log & _WARNING)) {
			if (_.isObject(message)) {
				console.warn(message);
			}
			else {
				console.warn("WARN: " + message);
			}
		}
	}

	var _consoleDebug = function(message) {
		if (Boolean(_log & _DEBUG)) {
			if (_.isObject(message)) {
				console.log(message);
			}
			else {
				console.log("DEBUG: " + message);
			}
		}
	}

	var _consoleInfo = function(message) {
		if (Boolean(_log & _INFO)) {
			if (_.isObject(message)) {
				console.log(message);
			}
			else {
				console.log("INFO: " + message);
			}
		}
	}

	var _raiseError = function(object, type, push, message, dump) {
		if (!object[type]) {
			object[type] = [];
		}
		object[type].push(push);
		_consoleError(type + ": " + message);
		if (dump) {
			_consoleError(dump);
		}
	}

	var _raiseWarn = function(object, type, push, message, dump) {
		if (!object[type]) {
			object[type] = [];
		}
		object[type].push(push);
		_consoleWarn(type + ": " + message);
		if (dump) {
			_consoleWarn(dump);
		}
	}

	var _raiseInfo = function(object, type, push, message, dump) {
		if (!object[type]) {
			object[type] = [];
		}
		object[type].push(push);
		_consoleInfo(type + ": " + message);
		if (dump) {
			_consoleInfo(dump);
		}
	}

	var _getError = function(layer_number) {
		layer_number = Number(layer_number);
		if (layer_number > _max_layers) { return false; }
		if (_simple_mode) {
			return [ _layers[layer_number]["error"] || {},
				_layers[layer_number + 1]["error"] || {} ];
		}
		else {
			return _layers[layer_number]["error"] || {};
		}
	}

	var _getWarning = function(layer_number) {
		layer_number = Number(layer_number);
		if (layer_number > _max_layers) { return false; }
		if (_simple_mode) {
			return [ _layers[layer_number]["warn"] || {},
				_layers[layer_number + 1]["warn"] || {} ];
		}
		else {
			return _layers[layer_number]["warn"] || {};
		}
	}

	var _getInfo = function(layer_number) {
		layer_number = Number(layer_number);
		if (layer_number > _max_layers) { return false; }
		if (_simple_mode) {
			return [ _layers[layer_number]["info"] || {},
				_layers[layer_number + 1]["info"] || {} ];
		}
		else {
			return _layers[layer_number]["info"] || {};
		}
		return _layers[layer_number]["info"] || {};
	}

	var _getFns = function(index) {
		if (arguments.length) {
			return _fns[index];
		}
		else {
			return _fns;
		}
	}

	var _setFns = function(index, object) {
		var fn = _fns[index];
		_consoleInfo("Set Fn" + index + ":");
		_consoleInfo(object);
		if (object["action"]) {
			var symbol = object["action"];
			if (fn["action"] == symbol && !object["args"]) {
				return fn;
			}
			fn["action"] = symbol;
			if (_action_map[symbol]) {
				var action = _action_map[symbol];
				if (action["param"]) {
					fn["param"] = action["param"];
					if (object["args"]) {
						fn["args"] = object["args"];
					}
					else {
						fn["args"] = action["default"];
					}
				}
				else {
					delete fn["param"];
					delete fn["args"];
				}
			}
			_fn_actions_hex[index] = _generateFnActionsHex(fn);
			_fn_actions_symbol[index] = _generateFnActionsSymbol(fn);
		}
		return fn;
	}

	var _getFnOptions = function(item) {
		if (item) {
			return _fn_options[item];
		}
		else {
			return _fn_options;
		}
	}

	var _getKeymapsHex = function() {
		return _keymaps_hex;
	}

	var _getKeymapsSymbol = function() {
		return _keymaps_symbol;
	}

	var _getFnActionsHex = function() {
		return _fn_actions_hex;
	}

	var _getFnActionsSymbol = function() {
		return _fn_actions_symbol;
	}

	// public methods
	this.NONE = _NONE;
	this.ERROR = _ERROR;
	this.WARNING = _WARNING;
	this.DEBUG = _DEBUG;
	this.INFO = _INFO;
	this.init = _init;
	this.setKeycodeMap = _setKeycodeMap;
	this.setFnMaps = _setFnMaps;
	this.setSimpleMode = _setSimpleMode;
	this.parseLayer = _parseLayer;
	this.getError = _getError;
	this.getWarning = _getWarning;
	this.getInfo = _getInfo;
	this.getFns = _getFns;
	this.setFns = _setFns;
	this.getFnOptions = _getFnOptions;
	this.getKeymapsHex = _getKeymapsHex;
	this.getKeymapsSymbol = _getKeymapsSymbol;
	this.getFnActionsHex = _getFnActionsHex;
	this.getFnActionsSymbol = _getFnActionsSymbol;

}
