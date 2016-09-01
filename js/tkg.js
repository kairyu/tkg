function TKG() {

	const _NONE = 0;
	const _ERROR = 1;
	const _WARNING = 2;
	const _DEBUG = 4;
	const _INFO = 8;
	const _LAYER_NORMAL = 0;
	const _LAYER_SIMPLE = 1;
	const _LAYER_ALL_IN_ONE = 2;
	var _log = _ERROR | _WARNING | _DEBUG | _INFO;
	var _keycode_map = {};
	var _keycode_map_reversed = {};
	var _action_map = {};
	var _lr_map = {};
	var _mod_map = {};
	var _on_map = {};
	var _af_map = [];
	var _am_map = [];
	var _binding_map = {};
	var _reverse_map = {};
	var _backlight_map = {};
	var _fn_options = {};
	var _led_options = {};
	var _max_layers = 0;
	var _max_fns = 0;
	var _matrix_rows = 0;
	var _matrix_cols = 0;
	var _matrix_map = {};
	var _led_count = 0;
	var _layers = [];
	var _fns = [];
	var _leds = [];
	var _matrices = [];
	var _keymaps_hex = [];
	var _keymaps_symbol = {};
	var _fn_actions_hex = [];
	var _fn_actions_symbol = {};
	var _led_hex = [];
	var _led_symbol = {};
	var _matrix_map_layer = {};

	var _setKeycodeMap = function(keycode_map) {
		_consoleInfoGroup("setKeycodeMap");
		_keycode_map = keycode_map;
		_consoleInfo("keycode_map:");
		_consoleInfo(_keycode_map);
		_keycode_map_reversed = _generateReversedKeycodeMap(_keycode_map);
		_consoleInfo("keycode_map_reversed:");
		_consoleInfo(_keycode_map_reversed);
		_fn_options["key"] = _generateKeyOptions(_keycode_map);
		_consoleInfoGroupEnd();
	}

	var _setFnMaps = function(object) {
		_consoleInfoGroup("setFnMaps");
		_action_map = object["action_map"];
		_lr_map = object["lr_map"];
		_mod_map = object["mod_map"];
		_on_map = object["on_map"];
		_af_map = object["af_map"] || [];
		_am_map = object["am_map"] || [];
		_consoleInfo("action_map:");
		_consoleInfo(_action_map);
		_consoleInfo("lr_map:");
		_consoleInfo(_lr_map);
		_consoleInfo("mod_map:");
		_consoleInfo(_mod_map);
		_consoleInfo("on_map:");
		_consoleInfo(_on_map);
		_consoleInfo("af_map:");
		_consoleInfo(_af_map);
		_consoleInfo("am_map:");
		_consoleInfo(_am_map);
		_fn_options["action"] = _generateActionOptions(_action_map);
		_fn_options["lr"] = _generateLrOptions(_lr_map);
		_fn_options["mod"] = _generateModOptions(_mod_map);
		_fn_options["on"] = _generateOnOptions(_on_map);
		_fn_options["af_id"] = _generateAfIdOptions(_af_map);
		_fn_options["af_opt"] = _generateAfOptOptions(_af_map);
		_fn_options["am_id"] = _generateAmIdOptions(_am_map);
		_fn_options["am_opt"] = _generateAmOptOptions(_am_map);
		_consoleInfoGroupEnd();
	}

	var _setLedMaps = function(binding_map, reverse_map, backlight_map) {
		_consoleInfoGroup("setLedMap");
		_binding_map = binding_map;
		_reverse_map = reverse_map;
		_backlight_map = backlight_map;
		_consoleInfo("binding_map:");
		_consoleInfo(_binding_map);
		_consoleInfo("reverse map:");
		_consoleInfo(_reverse_map);
		_consoleInfo("backlight map:");
		_consoleInfo(_backlight_map);
		_led_options["binding"] = _generateBindingOptions(_binding_map);
		_led_options["reverse"] = _generateBindingOptions(_reverse_map);
		_led_options["backlight"] = _generateBacklightOptions(_backlight_map);
		_consoleInfoGroupEnd();
	}

	var _init = function(object) {
		// get parameters
		if ("max_layers" in object) _max_layers = object["max_layers"] || 0;
		if ("max_fns" in object) _max_fns = object["max_fns"] || 0;
		if ("matrix_rows" in object) _matrix_rows = object["matrix_rows"] || 0;
		if ("matrix_cols" in object) _matrix_cols = object["matrix_cols"] || 0;
		if ("matrix_map" in object) _matrix_map = object["matrix_map"] || {};
		if ("led_count" in object) _led_count = object["led_count"] || 0;
		// init variables
		if ("max_layers" in object ||
		"matrix_rows" in object ||
		"matrix_cols" in object ||
		"matrix_map" in object) {
			_initLayerVariables();
		}
		if ("max_fns" in object) {
			_initFnVariables();
		}
		if ("led_count" in object) {
			_initLedVariables();
		}
		// generate options
		_fn_options["layer"] = _generateLayerOptions(_max_layers);
	}

	var _initVariables = function() {
		_initLayerVariables();
		_initFnVariables();
	}

	var _initLayerVariables = function() {
		_layers = [];
		_matrices = [];
		_initKeymaps();
	}

	var _initFnVariables = function() {
		_fns = [];
		_initFnActions();
	}

	var _initLedVariables = function() {
		_leds = [];
		_initLeds();
	}

	var _initKeymaps = function(layer_number) {
		if (layer_number === undefined) {
			_keymaps_symbol = {};
			_keymaps_hex = [];
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
		_fn_actions_hex = [];
		for (var i = 0; i < _max_fns; i++) {
			_fn_actions_hex[i] = 0;
		}
	}

	var _initLeds = function() {
		_led_symbol = {};
		_led_hex = [];
		for (var i = 0; i < _led_count; i++) {
			_leds[i] = {}
			_led_hex[i] = 0;
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
									if (keycode_map_reversed[label].indexOf(symbol) == -1) {
										conflicted = true;
									}
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

	var _generateGroupedOptions = function(map) {
		var options = {};
		for (var symbol in map) {
			var item = map[symbol];
			var group = item["group"];
			var name = item["name"];
			var description = item["description"];
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

	var _generateUngroupedOptions = function(map) {
		var options = [];
		for (var symbol in map) {
			var item = map[symbol];
			options.push({
				"value": symbol,
				"text": item["name"],
				"title": item["description"]
			});
		}
		return options;
	}

	var _generateActionOptions = function(action_map) {
		return _generateGroupedOptions(action_map);
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
		return _generateUngroupedOptions(on_map);
	}

	var _generateLrOptions = function(lr_map) {
		return _generateUngroupedOptions(lr_map);
	}

	var _generateModOptions = function(mod_map) {
		return _generateUngroupedOptions(mod_map);
	}

	var _generateAfIdOptions = function(af_map) {
		var options = [];
		for (var i = 0; i < af_map.length; i++) {
			var item = af_map[i];
			options.push({
				"value": i,
				"text": item["name"],
				"title": item["description"]
			});
		}
		return options;
	}

	var _generateAfOptOptions = function(af_map) {
		var options_array = [];
		for (var i = 0; i < af_map.length; i++) {
			var opt = af_map[i]["opt"] || [];
			var options = [];
			for (var j = 0; j < opt.length; j++) {
				options.push({
					"value": j,
					"text": opt[j],
					"title": opt[j]
				});
			}
			options_array.push(options);
		}
		return options_array;
	}

	var _generateAmOptOptions = function(am_map) {
		var options = [];
		for (var i = 0; i < am_map.length; i++) {
			options.push(am_map[i]["opt"]);
		}
		return options;
	}

	var _generateAmIdOptions = function(am_map) {
		var options = [];
		for (var i = 0; i < am_map.length; i++) {
			var item = am_map[i];
			options.push({
				"value": i,
				"text": item["name"],
				"title": item["description"]
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

	var _generateBindingOptions = function(binding_map) {
		return _generateGroupedOptions(binding_map);
	}

	var _generateReverseOptions = function(reverse_map) {
		return _generateUngroupedOptions(reverse_map);
	}

	var _generateBacklightOptions = function(backlight_map) {
		return _generateUngroupedOptions(binding_map);
	}

	var _smartPush = function(target, value) {
		if (target) {
			if (_.isArray(target)) {
				if (target.indexOf(value) == -1) {
					target.push(value);
				}
			}
			else {
				if (target != value) {
					target = [ target, value ];
				}
			}
		}
		else {
			target = value;
		}
		return target;
	}

	var _worseState = function(state, state_2) {
		switch (state) {
			case _ERROR:
				return state;
			case _WARNING:
				switch (state_2) {
					case _ERROR:
						return _ERROR;
					case _WARNING:
						return _WARNING;
					case _NONE:
						return _WARNING;
				}
			case _NONE:
				return state_2;
		}
		return _NONE;
	}

	var _parseLayer = function(layer_number, raw_string, layer_mode, block_rows) {
		// console log
		switch (layer_mode) {
			case LAYER_NORMAL:
				_consoleInfo("Parse layer normal mode");
				break;
			case LAYER_SIMPLE:
				_consoleInfo("Parse layer simple mode");
				break;
			case LAYER_ALL_IN_ONE:
				_consoleInfo("Parse layer all-in-one mode");
				break;
		}

		// check layer_number parameter
		layer_number = Number(layer_number);
		switch (layer_mode) {
			case LAYER_NORMAL:
				if (layer_number >= _max_layers) {
					_consoleError("Layer number out of bounds");
					return _ERROR;
				}
				break;
			case LAYER_SIMPLE:
			case LAYER_ALL_IN_ONE:
				if (layer_number != 0) {
					_consoleError("Invalid layer number: " + layer_number);
					return _ERROR;
				}
				break;
		}


		if (raw_string) {
			if (layer_mode == LAYER_NORMAL || layer_mode == LAYER_SIMPLE) {
				// parse raw string to keys
				var layer = _parseRawData(raw_string);
				if (layer_mode == LAYER_SIMPLE) {
					// copy to layer_2
					var layer_2 = JSON.parse(JSON.stringify(layer));
					var layer_3 = JSON.parse(JSON.stringify(layer));
				}
				// parse keys
				layer = _parseKeycode(layer, "top", "bottom");
				var state = _postParseLayer(layer_number, layer);
				if (layer_mode == LAYER_SIMPLE) {
					layer_2 = _parseKeycode(layer_2, "side_print", "side_print_secondary");
					var state_2 = _postParseLayer(layer_number + 1, layer_2);
					layer_3 = _parseKeycode(layer_3, "top_secondary", "bottom_secondary");
					var state_3 = _postParseLayer(layer_number + 2, layer_3);
					// fn hack
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
					if (_fns[4] && _fns[4]["action"] == "ACTION_NO") {
						_setFns(4, { "action": "ACTION_LAYER_TOGGLE", "args": [ layer_number + 2 ] });
					}
					state = _worseState(state, state_2);
					state = _worseState(state, state_3);
				}
				// return state
				return state;
			}
			else if (layer_mode == LAYER_ALL_IN_ONE) {
				// parse raw string to keys
				var layers = _parseRawData(raw_string, block_rows);
				var state = _NONE;
				for (var i = 0; i < layers.length; i++) {
					layers[i] = _parseKeycode(layers[i], "top", "bottom");
					var state_2 = _postParseLayer(layer_number + i, layers[i]);
					state = _worseState(state, state_2);
				}
				// return state
				return state;
			}
		}
		else {
			// clear when raw string is empty
			if (layer_mode == LAYER_NORMAL) {
				var layer = {};
				var state = _postParseLayer(layer_number, layer);
				return state;
			}
			else if (layer_mode == LAYER_SIMPLE || layer_mode == LAYER_ALL_IN_ONE) {
				_initVariables();
				return _NONE;
			}
		}

		return _NONE;
	}

	var _postParseLayer = function(layer_number, layer) {
		_consoleInfoGroup("parseLayer");
		_consoleInfo("layer_number: " + layer_number);

		var fns = [];
		var matrix = [];
		var keymap_hex = [];
		var keymap_symbol = [];

		// set layer
		_layers[layer_number] = layer;

		// parse fns from layer
		fns = _parseFns(layer);
		fns = _mergeFns(_fns, fns);
		_fns = _cleanFns(fns, _layers);
		_consoleInfo("fns:");
		_consoleInfo(fns);
		_consoleInfo(_fns);

		// parse matrix from position
		matrix = _parseMatrix(layer);
		_consoleInfo("matrix:");
		_consoleInfo(matrix);

		// generate keymap from matrix
		keymap_hex = _generateKeymapHex(matrix);
		keymap_symbol = _generateKeymapSymbol(matrix);
		_consoleInfo("keymap_hex:");
		_consoleInfo(keymap_hex);
		_consoleInfo("keymap_symbol:");
		_consoleInfo(keymap_symbol);

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

		// return state
		var state = _NONE;
		if (!_.isEmpty(layer["warn"])) {
			state = _WARNING;
		}
		if (!_.isEmpty(layer["error"])) {
			state = _ERROR;
		}
		_consoleInfoGroupEnd();
		return state;
	}

	var _parseMatrixMapLayer = function(raw_string, combining, parse_keycode, parser) {
		_consoleInfoGroup("parseMatrixMapLayer");
		_consoleInfo("Parse matrix map layer");
		var layer = {};

		// parse raw string to keys
		if (raw_string) {
			layer = _parseRawData(raw_string);
		}

		if (parse_keycode) {
			_parseKeycode(layer, "top", "bottom");
		}

		// parse keys to matrix map
		var matrix_map = _parseMatrixMap(layer, combining, parser);
		_matrix_map = matrix_map;
		_matrix_map_layer = layer;
		_consoleInfo("matrix_map:");
		_consoleInfo(_matrix_map);

		// return state
		var state = _NONE;
		if (!_.isEmpty(layer["warn"])) {
			state = _WARNING;
		}
		if (!_.isEmpty(layer["error"])) {
			state = _ERROR;
		}
		_consoleInfoGroupEnd();
		return state;
	}

	var _parseRowCount = function(raw_string) {
		// parse raw string to array
		var raw = _parseRawString(raw_string);
		return raw.length || 0;
	}

	var _parseRawData = function(raw_string, block_rows) {
		// parse raw string to array
		var raw = _parseRawString(raw_string);
		if (_.isEmpty(raw)) {
			var message = "Invalid raw data";
			var error = {};
			_raiseError(error, "general", message, message, raw_string);
			if (arguments.length == 1) {
				return { "error": error, "warn": {}, "info": {} };
			}
			else {
				return [{ "error": error, "warn": {}, "info": {} }];
			}
		}

		// parse object to keys
		if (arguments.length == 1 || block_rows == 0) {
			return _parseRawObject(raw);
		}
		else {
			var layers = [];
			for (var i = 0; i < raw.length; i += block_rows) {
				var raw_object = raw.slice(i, i + block_rows);
				layers.push(_parseRawObject(raw_object));
			}
			return layers;
		}
	}

	var _parseRawString = function(raw_string) {
		try {
			eval("var raw = [" + raw_string + "];");
		} catch (e) {
			return {};
		}

		if (!_.isArray(raw)) {
			return {};
		}

		// remove useless property
		for (var i = 0; i < raw.length; i++) {
			if (!_.isArray(raw[i])) {
				raw.splice(i, 1);
				i = 0;
			}
		}

		return raw;
	}

	var _parseRawObject = function(raw_object) {
		var layer = {};
		var error = {};
		var warn = {};
		var info = {};

		var keys = [];
		var c_x = 0;
		var c_y = 0;
		var c_w = 1;
		var c_h = 1;
		var c_x2 = 0;
		var c_w2 = 0;
		var c_r = 0;
		var c_rx = 0;
		var c_ry = 0;
		var before_first_key = true;
		var stepped = false;
		var rowspan = false;
		for (var i = 0; i < raw_object.length; i++) {
			if (!_.isArray(raw_object[i])) { continue; }
			c_x = 0;
			for (var j = 0; j < raw_object[i].length; j++) {
				var el = raw_object[i][j];
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
							c_x += el.x || 0;
							c_x2 = c_x;
						}
						if (el.w2) {
							c_w2 = el.w;
							c_w = el.w2;
						}
						else {
							if (el.x2) {
								c_w = el.w - el.x2;
								c_w2 = el.w;
							}
							else {
								c_w2 = c_w;
							}
						}
					}
					if (el.r) {
						c_r = el.r;
						c_rx = el.rx || c_rx || 0;
						c_ry = el.ry || c_ry || 0;
						c_y = el.y;
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
					if (c_r) {
						key["r"] = c_r;
						key["rx"] = c_rx;
						key["ry"] = c_ry;
						key["x"] += c_rx;
						key["y"] += c_ry;
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
			_raiseError(error, "general", message, message, raw_object);
		}
		else {
			layer["keys"] = keys;
		}
		layer["error"] = error;
		layer["warn"] = warn;
		layer["info"] = info;
		return layer;
	}

	var _parseMatrixMap = function(layer, combining, parser) {
		var error = layer["error"];
		var warn = layer["warn"];
		var info = layer["info"];
		var matrix_map = {};

		if (combining) {
			if (combining == 1) {
				// col combining
				var half_rows = parseInt((_matrix_rows + 1) / 2);
				var half_cols = _matrix_cols;
			}
			else if (combining == 2) {
				// row combining
				var half_rows = _matrix_rows;
				var half_cols = parseInt((_matrix_cols + 1) / 2);
			}
		}

		// check keys property
		if (!layer["keys"] || !_.isArray(layer["keys"])) {
			return layer;
		}

		// check label parameter
		/*
		if (!label_property) {
			_consoleError("Wrong function call");
			return false;
		}
		*/

		// parse matrix map from key labels
		var keys = layer["keys"];
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			// check label property
			/*
			var label;
			if (key["label"][label_property] || key["label"][label_property] == "") {
				label = key["label"][label_property].toLowerCase();
			}
			else {
				label = "";
				_consoleDebug("No valid label: " + key["x"] + "," + key["y"]);
				_consoleDebug(key);
			}
			*/
			var result = parser(key);
			// get row col mapping
			//var mapping = /^(\d+),(\d+)$/.exec(label);
			if (result) {
				//var index = _positionToIndex(key["x"], key["y"], key["w"], key["h"], key["x2"], key["w2"]);
				var index = _positionToIndex(key);
				// check existence
				if (index in matrix_map) {
					_raiseWarn(warn, "matrix_map_overlapping", key, index, key);
				}
				else {
					// check validness
					/*
					var row = parseInt(mapping[1]) - 1;
					var col = parseInt(mapping[2]) - 1;
					*/
					var row = parseInt(result["row"]);
					var col = parseInt(result["col"]);
					if (combining == 1) {
						if (row >= 0 && row < half_rows && col >= 0 && col < half_cols) {
							matrix_map[index] = {};
							matrix_map[index]["row"] = row;
							matrix_map[index]["col"] = col;
						}
						else if (row >= half_rows && row < _matrix_rows && col >= half_cols && (col - half_cols) < _matrix_cols) {
							matrix_map[index] = {};
							matrix_map[index]["row"] = row;
							matrix_map[index]["col"] = col - half_cols;
						}
						else {
							_raiseError(error, "matrix_map_invalid_mapping", key, row + ',' + col, key);
						}
					}
					else if (combining == 2) {
						if (row >= 0 && row < half_rows && col >= 0 && col < half_cols) {
							matrix_map[index] = {};
							matrix_map[index]["row"] = row;
							matrix_map[index]["col"] = col;
						}
						else if (row >= half_rows && (row - half_rows) < _matrix_rows && col >= half_cols && col < _matrix_cols) {
							matrix_map[index] = {};
							matrix_map[index]["row"] = row - half_rows;
							matrix_map[index]["col"] = col;
						}
						else {
							_raiseError(error, "matrix_map_invalid_mapping", key, row + ',' + col, key);
						}
					}
					else {
						if (row >= 0 && row < _matrix_rows && col >= 0 && col < _matrix_cols) {
							matrix_map[index] = {};
							matrix_map[index]["row"] = row;
							matrix_map[index]["col"] = col;
						}
						else {
							_raiseError(error, "matrix_map_invalid_mapping", key, row + ',' + col, key);
						}
					}
				}
			}
			else {
				_raiseError(error, "matrix_map_incorrect_format", key, label, key);
			}
		}

		return matrix_map;
	}

	var _parseKeycode = function(layer, label_property, label_property_2) {
		// parse keycode from label
		layer = _parseKeycodeSub(layer, label_property, label_property_2);
		_consoleInfo("layer:");
		_consoleInfo(layer);

		// check warning
		layer = _scanWarn(layer, label_property, label_property_2);

		return layer;
	}

	var _parseKeycodeSub = function(layer, label_property, label_property_2) {
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

		if (_isLayerEmpty(layer, label_property, label_property_2)) {
			return layer;
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
				if (!key["label"][label_property_2]) {
					_consoleDebug("No valid label: " + key["x"] + "," + key["y"]);
					_consoleDebug(key);
				}
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
						var weight = _matchLabelsWithSymbol(label, label_2, symbol);
						if (weight) {
							alt_symbols.push([symbol, weight]);

						}
					}
					// check alternative symbols
					if (alt_symbols.length == 0) {
						var message = label + (label_2 ? "\n" + label_2 : "");
						_raiseError(error, "no_matching_keycode", key, message, key);
					}
					// solved
					else if (alt_symbols.length == 1) {
						alt_symbol = alt_symbols[0][0];
					}
					else {
						// look for high weight
						var alt_symbol_high_weight = _.filter(alt_symbols, function(pair) { return pair[1] > 1; });
						if (alt_symbol_high_weight.length == 1) {
							alt_symbol = alt_symbol_high_weight[0][0];
						}
						// unsolved conflict
						else {
							var alt_symbols_round2 = [];
							for (var j = 0; j < alt_symbols.length; j++) {
								if (_matchLabelsWithSymbol(label, label_2, alt_symbols[j][0], "label_priority")) {
									alt_symbols_round2.push(alt_symbols[j][0]);
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

	var _isLayerEmpty = function(layer, label_property, label_property_2) {
		var keys = layer["keys"];
		for (var i = 0; i < keys.length; i++) {
			var label = keys[i]["label"];
			if (label[label_property] || (label_property_2 && label[label_property_2])) {
				return false;
			}
		}
		return true;
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
						return 2;
					}
				}
				else {
					if (_matchLabels(label, target_labels[i])) {
						return 1;
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
						return 1;
					}
					// match with label_2
					if (_.indexOf(target_labels_2, label_2) != -1) {
						return 2;
					}
					else {
						return false;
					}
				}
				// only match label
				else {
					return 1;
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
			//var index = _positionToIndex(key["x"], key["y"], key["w"], key["h"], key["x2"], key["w2"]);
			var index = _positionToIndex(key);
			if (_matrix_map[index]) {
				var row = _matrix_map[index]["row"];
				var col = _matrix_map[index]["col"];
				//var symbol = key["short_name"] ? key["short_name"] : key["symbol"];
				var symbol = key["symbol"];
				key["matrix"] = {
					"row": row,
					"col": col
				};
				if ((matrix[row][col] && matrix[row][col] == "KC_NO") || !matrix[row][col]) {
					matrix[row][col] = symbol;
				}
				else {
					_raiseWarn(warn, "matrix_overlapping", key, index, key);
				}
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
			var fn_actions = {};
			for (var i in fn) {
				fn_actions[i] = _generateFnActionsSymbol(fn[i]);
			}
			return fn_actions;
		}
	}

	var _generateLedHex = function(led) {
		if (led["binding"]) {
			var hex = "0x0000";
			var binding = led["binding"];
			if (_binding_map[binding]) {
				var code = _binding_map[binding]["code"];
				if (_.isFunction(code)) {
					hex = code.apply(code, led["args"]);
				}
				else {
					hex = code;
				}
			}
			var dec =  parseInt(hex, 16);
			var reverse = led["reverse"] | 0;
			var backlight = led["backlight"] | 0;
			var code;
			code = _reverse_map["LEDMAP_REVERSE"]["code"];
			dec |= code.apply(code, [ reverse ]);
			code = _backlight_map["LEDMAP_BACKLIGHT"]["code"];
			dec |= code.apply(code, [ backlight ]);
			return dec;
		}
		else {
			var leds = [];
			for (var i = 0; i < _led_count; i++) {
				if (led[i]) {
					leds[i] = _generateLedHex(led[i]);
				}
			}
			return leds;
		}
	}

	var _generateLedSymbol = function(led, index) {
		if (led["binding"]) {
			var binding = led["binding"];
			var array = [ binding ];
			if (led["args"]) {
				array = array.concat(led["args"]);
			}
			return array;
		}
		else {
			var leds = {};
			for (var i in led) {
				leds[i] = _generateLedSymbol(led[i]);
			}
			return leds;
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

	//var _positionToIndex = function(x, y, w, h, x2, w2) {
	var _positionToIndex = function(key) {
		var index = key.x + "," + key.y;
		if (key.w > 1 || key.h > 1) {
			index += "," + key.w;
		}
		if (key.h > 1) {
			index += "," + key.h;
		}
		if (key.x2 || key.w2) {
			index += "," + key.x2;
		}
		if (key.w2) {
			index += "," + key.w2;
		}
		if (key.r) {
			index += ":" + key.r + "," + key.rx + "," + key.ry;
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
				console.debug(message);
			}
			else {
				console.debug("DEBUG: " + message);
			}
		}
	}

	var _consoleInfo = function(message) {
		if (Boolean(_log & _INFO)) {
			if (_.isObject(message)) {
				console.info(message);
			}
			else {
				console.info("INFO: " + message);
			}
		}
	}

	var _consoleInfoGroup = function(message) {
		if (Boolean(_log & _INFO)) {
			console.groupCollapsed(message);
		}
	}

	var _consoleInfoGroupEnd = function() {
		if (Boolean(_log & _INFO)) {
			console.groupEnd();
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
		if (arguments.length) {
			return _getLayerElement("error", layer_number);
		}
		else {
			return _getLayerElement("error");
		}
	}

	var _getWarning = function(layer_number) {
		if (arguments.length) {
			return _getLayerElement("warn", layer_number);
		}
		else {
			return _getLayerElement("warn");
		}
	}

	var _getInfo = function(layer_number) {
		if (arguments.length) {
			return _getLayerElement("info", layer_number);
		}
		else {
			return _getLayerElement("info");
		}
	}

	var _getLayerElement = function(element_name, layer_number) {
		if (arguments.length > 1) {
			layer_number = Number(layer_number);
			if (layer_number > _max_layers) { return false; }
			return _layers[layer_number][element_name] || {};
		}
		else {
			var elements = [];
			for (var i = 0; i < _layers.length; i++) {
				elements.push(_getLayerElement(element_name, i));
			}
			return elements;
		}
	}

	var _getMatrixMap = function() {
		return _matrix_map;
	}

	var _getMatrixMapError = function() {
		return _matrix_map_layer["error"] || {};
	}

	var _getMatrixMapWarning = function() {
		return _matrix_map_layer["warn"] || {};
	}

	var _getMatrixMapInfo = function() {
		return _matrix_map_layer["info"] || {};
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
		_consoleInfoGroup("setFns");
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
		_consoleInfoGroupEnd();
		return fn;
	}

	var _exportFns = function() {
		return JSON.stringify(_fn_actions_symbol).slice(1, -1);
	}

	var _importFns = function(data) {
		try {
			data = JSON.parse('{' + data + '}');
		}
		catch (e) {
			_consoleError(e);
			return false;
		}
		_consoleDebug("Import Fns:");
		_consoleDebug(data);
		for (var index in data) {
			index = Number(index);
			if (index >= _max_fns) {
				_consoleWarn("Fn index out of bounds");
				_consoleWarn(index);
				continue;
			}
			array = data[index];
			if (_.isArray(array)) {
				if (_fns[index]) {
					var action = array.shift();
					var args = array;
					_setFns(index, {
						"action": action,
						"args": args
					});
				}
				else {
					_consoleWarn("Fn not exist");
					_consoleWarn(index);
					continue;
				}
			}
			else {
				_consoleError("Invalid Fn data");
				_consoleError(array);
				return false;
			}
		}
		return true;
	}

	var _getFnOptions = function(item) {
		if (item) {
			return _fn_options[item];
		}
		else {
			return _fn_options;
		}
	}

	var _getLeds = function(index) {
		if (arguments.length) {
			return _leds[index];
		}
		else {
			return _leds;
		}
	}

	var _setLeds = function(index, object) {
		_consoleInfoGroup("setLeds");
		var led = _leds[index];
		_consoleInfo("Set Led" + index + ":");
		_consoleInfo(object);
		if (object["binding"]) {
			var symbol = object["binding"];
			if (led["binding"] != symbol || object["args"]) {
				led["binding"] = symbol;
				if (_binding_map[symbol]) {
					var binding = _binding_map[symbol];
					if (binding["param"]) {
						led["param"] = binding["param"];
						if (object["args"]) {
							led["args"] = object["args"];
						}
						else {
							led["args"] = binding["default"];
						}
					}
					else {
						delete led["param"];
						delete led["args"];
					}
				}
				_led_hex[index] = _generateLedHex(led);
				_led_symbol[index] = _generateLedSymbol(led);
			}
		}
		if (object["reverse"] !== undefined) {
			if (led["reverse"] != object["reverse"]) {
				led["reverse"] = object["reverse"];
				_led_hex[index] = _generateLedHex(led);
				_led_symbol[index] = _generateLedSymbol(led);
			}
		}
		if (object["backlight"] !== undefined) {
			if (led["backlight"] != object["backlight"]) {
				led["backlight"] = object["backlight"];
				_led_hex[index] = _generateLedHex(led);
				_led_symbol[index] = _generateLedSymbol(led);
			}
		}
		_consoleInfoGroupEnd();
		return led;
	}

	var _getLedOptions = function(item) {
		if (item) {
			return _led_options[item];
		}
		else {
			return _led_options;
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

	var _getLedsHex = function() {
		return _led_hex;
	}

	var _getLedsSymbol = function() {
		return _led_symbol;
	}

	var _getLayersCount = function() {
		var count = 0;
		for (var i = 0; i < _layers.length; i++) {
			if (_getNonBlankKeyCount(i)) {
				count = i + 1;
			}
		}
		return count;
	}

	var _getFnsCount = function() {
		var count = 0;
		for (var i = 0; i < _fns.length; i++) {
			if (_fns[i]) {
				count++;
			}
		}
		return count;
	}

	var _getKeysCount = function() {
		var max = 0;
		for (var i = 0; i < _layers.length; i++) {
			var count = _getNonBlankKeyCount(i);
			max = Math.max(max, count);
		}
		return max;
	}

	var _getNonBlankKeyCount = function(layer) {
		if (!_layers[layer]) {
			return 0;
		}
		if (!_layers[layer]["keys"]) {
			return 0;
		}
		var keys = _layers[layer]["keys"];
		var count = 0;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i]["keycode"] > 1) {
				count++;
			}
		}
		return count;
	}

	// public methods
	this.NONE = _NONE;
	this.ERROR = _ERROR;
	this.WARNING = _WARNING;
	this.DEBUG = _DEBUG;
	this.INFO = _INFO;
	this.init = _init;
	this.initVariables = _initVariables;
	this.setKeycodeMap = _setKeycodeMap;
	this.setFnMaps = _setFnMaps;
	this.setLedMaps = _setLedMaps;
	this.parseRowCount = _parseRowCount;
	this.parseLayer = _parseLayer;
	this.parseMatrixMapLayer = _parseMatrixMapLayer;
	this.getError = _getError;
	this.getWarning = _getWarning;
	this.getInfo = _getInfo;
	this.getMatrixMap = _getMatrixMap;
	this.getMatrixMapError = _getMatrixMapError;
	this.getMatrixMapWarning = _getMatrixMapWarning;
	this.getMatrixMapInfo = _getMatrixMapInfo;
	this.getFns = _getFns;
	this.setFns = _setFns;
	this.exportFns = _exportFns;
	this.importFns = _importFns;
	this.getFnOptions = _getFnOptions;
	this.getLeds = _getLeds;
	this.setLeds = _setLeds;
	this.getLedOptions = _getLedOptions;
	this.getKeymapsHex = _getKeymapsHex;
	this.getKeymapsSymbol = _getKeymapsSymbol;
	this.getFnActionsHex = _getFnActionsHex;
	this.getFnActionsSymbol = _getFnActionsSymbol;
	this.getLedsHex = _getLedsHex;
	this.getLedsSymbol = _getLedsSymbol;
	this.getLayersCount = _getLayersCount;
	this.getFnsCount = _getFnsCount;
	this.getKeysCount = _getKeysCount;
	this.parseRawData = _parseRawData;
	this.postParseLayer = _postParseLayer;
	this.positionToIndex = _positionToIndex;
}
