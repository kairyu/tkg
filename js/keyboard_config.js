var _keyboard_config = {};

const KIMERA_COL = 1;
const KIMERA_ROW = 2;

function initKeyboardConfig(name) {
	var result = parseKeyboardName(name);
	var main = result["main"];
	var variant = result["variant"];
	if (main.match(/^(kimera.*|usb2usb)/)) {
		_keyboard_config = loadKeyboardConfig(main, variant);
		$('#kbd-cfg').show();
		$('#kbd-cfg-container').show();
		initKeyboardConfigPopover(main, variant);
		afterLoadKeyboardConfig(main, variant);
	}
	else {
		$('#kbd-cfg').hide();
		$('#kbd-cfg-container').hide();
	}
}

function loadKeyboardConfig(main, variant) {
	var config = {};
	var name = "";
	if (variant) {
		name = main + "-" + variant + "-config.json";
	}
	else {
		name = main + "-config.json";
	}
	$.ajaxSetup({ async: false, cache: false });
	$.getJSON("keyboard/config/" + name.toLowerCase(), function(json) {
		config = json;
	}).fail(function(d, textStatus, error) {
		console.error("getJSON failed, status: " + textStatus + ", error: "+error)
	});
	$.ajaxSetup({ async: true });
	return config;
}

function initKeyboardConfigPopover(main, variant) {
	$('#kbd-cfg-btn').popover('destroy').popover({
		animation: false,
		html: true,
		placement: 'bottom',
		trigger: 'manual',
		content: function() {
			return $('#' + main.toLowerCase() + '-config').contents().filter(function() {
				return this.nodeType == 8;
			}).get(0).nodeValue;
		},
		container: '#kbd-cfg-container'
	}).unbind('click').click(function() {
		$(this).popover('toggle');
	}).on('shown.bs.popover', function() {
		$('#kbd-cfg-btn').text(window.lang.translate('Close'));
		initKeyboardConfigPanel(main, variant);
	}).on('hidden.bs.popover', function() {
		$('#kbd-cfg-btn').text(window.lang.translate('Config'));
	});;
}

function afterLoadKeyboardConfig(main, variant) {
	if (main.match(/^(kimera.*)/)) {
		tkg.init({
			"matrix_rows": _keyboard_config["matrix_rows"],
			"matrix_cols": _keyboard_config["matrix_cols"]
		});
		kimeraParseMatrixMapping(variant);
		/*
		_keyboard_config["matrix_map_state"] = tkg.parseMatrixMapLayer(_keyboard_config["matrix_map_raw"], (variant == "two_headed" ? 2 : 0));
		_keyboard_config["matrix_map"] = tkg.getMatrixMap();
		_keyboard_config["physical_rows"] = tkg.parseRowCount(_keyboard_config["matrix_map_raw"]);
		kimeraConfigUpdate(true, variant);
		*/
	}
	else if (main.match(/^(usb2usb)/)) {
		tkg.init({
			"matrix_rows": _keyboard_config["matrix_rows"],
			"matrix_cols": _keyboard_config["matrix_cols"]
		});
		usb2usbParseMatrixMapping(variant);
	}
}

function initKeyboardConfigPanel(main, variant) {
	if (main.match(/^(kimera.*)/)) {
		var $row_input = $('#kbd-cfg-container #kimera-row-val');
		var $col_input = $('#kbd-cfg-container #kimera-col-val');

		// row col mapping
		kimeraInitRowColInput(variant, KIMERA_ROW);
		kimeraInitRowColInput(variant, KIMERA_COL);

		// row col tags toggle
		var $row_tags_toggle = $('#kbd-cfg-container #kimera-row-tags-toggle');
		var $col_tags_toggle = $('#kbd-cfg-container #kimera-col-tags-toggle');
		$row_tags_toggle.click(function () {
			if ($row_input.data('role') == 'tagsinput') {
				kimeraDestoryRowColInput(variant, KIMERA_ROW);
				$row_tags_toggle.find('.glyphicon')
					.removeClass('glyphicon-eye-open')
					.addClass('glyphicon-eye-close');
			}
			else {
				kimeraInitRowColInput(variant, KIMERA_ROW);
				$row_tags_toggle.find('.glyphicon')
					.removeClass('glyphicon-eye-close')
					.addClass('glyphicon-eye-open');
			}
		});
		$col_tags_toggle.click(function () {
			if ($col_input.data('role') == 'tagsinput') {
				kimeraDestoryRowColInput(variant, KIMERA_COL);
				$col_tags_toggle.find('.glyphicon')
					.removeClass('glyphicon-eye-open')
					.addClass('glyphicon-eye-close');
			}
			else {
				kimeraInitRowColInput(variant, KIMERA_COL);
				$col_tags_toggle.find('.glyphicon')
					.removeClass('glyphicon-eye-close')
					.addClass('glyphicon-eye-open');
			}
		});

		// row col clear
		var $row_clear = $('#kbd-cfg-container #kimera-row-clear');
		var $col_clear = $('#kbd-cfg-container #kimera-col-clear');
		$row_clear.click(function () {
			if ($row_input.data('role') == 'tagsinput') {
				$row_input.data('last', '').tagsinput('removeAll');
			}
			else {
				$row_input.data('last', '').val('');
			}
			kimeraRowColMappingChange(variant);
		});
		$col_clear.click(function () {
			if ($col_input.data('role') == 'tagsinput') {
				$col_input.data('last', '').tagsinput('removeAll');
			}
			else {
				$col_input.data('last', '').val('');
			}
			kimeraRowColMappingChange(variant);
		});

		// matrix mapping
		var $matrix_textarea = $("#kbd-cfg-container #kimera-matrix-val");
		$matrix_textarea.val(_keyboard_config["matrix_map_raw"]);
		console.log($matrix_textarea.val());
		$matrix_textarea.data('last', $matrix_textarea.val());
		$matrix_textarea.on('blur_custom', function() {
			var $matrix_textarea = $("#kbd-cfg-container #kimera-matrix-val");
			var raw = $matrix_textarea.val();
			var last = $matrix_textarea.data('last') || "";
			if (last != raw) {
				$matrix_textarea.data('last', raw);
				kimeraMatrixMappingChange(variant);
			}
		});

		kimeraRowColMappingChange(variant);
		kimeraMatrixMappingRefresh();
	}
	else if (main.match(/^(usb2usb)/)) {
		var $orig_layout = $("#kbd-cfg-container #usb2usb-orig-layout-val");
		$orig_layout.val(_keyboard_config["original_layout"]);
		$orig_layout.data('last', $orig_layout.val());
		$orig_layout.on('blur_custom', function() {
			var $orig_layout = $("#kbd-cfg-container #usb2usb-orig-layout-val");
			var raw = $orig_layout.val();
			var last = $orig_layout.data('last') || "";
			if (last != raw) {
				$orig_layout.data('last', raw);
				usb2usbOriginalLayoutChange(variant);
			}
		});
		usb2usbOriginalLayoutChange(variant);
	}
}

function kimeraInitRowColInput(variant, row_col) {
	var $input;
	if (row_col == KIMERA_ROW) {
		$input = $('#kbd-cfg-container #kimera-row-val');
	}
	else if (row_col == KIMERA_COL) {
		$input = $('#kbd-cfg-container #kimera-col-val');
	}
	var key;
	if (row_col == KIMERA_ROW) {
		key = "row_mapping";
	}
	else if (row_col == KIMERA_COL) {
		key = "col_mapping";
	}
	if (key in _keyboard_config) {
		if (key + "_input" in _keyboard_config) {
		}
		else {
			_keyboard_config[key + "_input"] = _keyboard_config[key];
		}
		$input.val(_keyboard_config[key + "_input"].join(','));
		$input.data('last', $input.val());
	}
	$input.unbind().data('role', 'tagsinput').tagsinput({
		tagClass: function(item) {
			if (_.contains($input.data('valid_pins'), parseInt(item))) {
				if (variant == 'two_headed' && kimeraRowColIsRight($input.val(), item)) {
					return 'label label-success';
				}
				else {
					return 'label label-primary';
				}
			}
			else {
				return 'label label-danger';
			}
		},
		typeahead: {
			source: function(query) {
				return $input.data('available_pins');
			},
			matcher: function(item) {
				return (this.query.indexOf(item) === 0);
			}
		},
	});
	$input.change(function() {
		kimeraRowColMappingChange(variant);
	});
	$($input.tagsinput('input')).attr('lang', $input.attr('lang')).blur(function() {
		var val = $input.val();
		var last = $input.data('last') || '';
		if (val != last) {
			$input.data('last', val);
			$input.trigger('change');
		}
	});
}

function kimeraDestoryRowColInput(variant, row_col) {
	var $input;
	if (row_col == KIMERA_ROW) {
		$input = $('#kbd-cfg-container #kimera-row-val');
	}
	else if (row_col == KIMERA_COL) {
		$input = $('#kbd-cfg-container #kimera-col-val');
	}
	var key;
	if (row_col == KIMERA_ROW) {
		key = "row_mapping";
	}
	else if (row_col == KIMERA_COL) {
		key = "col_mapping";
	}
	if (key in _keyboard_config) {
		if (key + "_input" in _keyboard_config) {
		}
		else {
			_keyboard_config[key + "_input"] = _keyboard_config[key];
		}
		$input.val(_keyboard_config[key + "_input"].join(','));
		$input.data('last', $input.val());
	}
	$input.unbind().tagsinput('destroy');
	$input.data('role', '');
	$input.change(function() {
		kimeraRowColMappingChange(variant);
	});
	$input.blur(function() {
		var val = $input.val();
		var last = $input.data('last') || '';
		if (val != last) {
			$input.data('last', val);
			$input.trigger('change');
		}
	});
}

function kimeraRowColIsRight(vals, item) {
	if (!_.isArray(vals)) {
		vals = vals.split(',');
	}
	vals = _.without(_.map(vals, function(e) {
		return parseInt(e);
	}), NaN);
	item = parseInt(item);
	var len = vals.length;
	var pos = _.indexOf(vals, item);
	if (pos >= parseInt((len + 1) / 2)) {
		return true;
	}
	else {
		return false;
	}
}

function kimeraRowColMappingChange(variant) {
	var $row_input = $('#kbd-cfg-container #kimera-row-val');
	var $col_input = $('#kbd-cfg-container #kimera-col-val');
	var row_val = $row_input.val();
	var col_val = $col_input.val();
	var row_input_pins = [];
	var col_input_pins = [];
	if (row_val) {
		row_input_pins = _.without(_.map(row_val.split(','), function(e) {
			return parseInt(e);
		}), NaN);
	}
	if (col_val) {
		col_input_pins = _.without(_.map(col_val.split(','), function(e) {
			return parseInt(e);
		}), NaN);
	}

	var conflict_pins = _.intersection(row_input_pins, col_input_pins);
	var valid_pins = [];
	var available_pins = [];
	var row_pins = [];
	var col_pins = [];
	var pin_count = _keyboard_config["pin_count"] | 0;
	for (var i = 0; i < pin_count; i++) {
		valid_pins.push(i + 1);
	}
	valid_pins = _.difference(valid_pins, conflict_pins);
	row_valid_pins = _.intersection(row_input_pins, valid_pins);
	col_valid_pins = _.intersection(col_input_pins, valid_pins);
	available_pins = _.difference(valid_pins, row_valid_pins, col_valid_pins);
	_keyboard_config["row_mapping_input"] = row_input_pins;
	_keyboard_config["col_mapping_input"] = col_input_pins;
	_keyboard_config["row_mapping"] = row_valid_pins;
	_keyboard_config["col_mapping"] = col_valid_pins;
	_keyboard_config["matrix_cols"] = _keyboard_config["col_mapping"].length;
	if (variant == "two_headed") {
		_keyboard_config["matrix_rows"] = parseInt((_keyboard_config["row_mapping"].length + 1) / 2);
	}
	else {
		_keyboard_config["matrix_rows"] = _keyboard_config["row_mapping"].length;
	}
	kimeraConfigUpdate(true, variant);
	kimeraMatrixMappingChange(variant);

	$row_input.data('valid_pins', valid_pins);
	$col_input.data('valid_pins', valid_pins);
	$row_input.data('available_pins', available_pins);
	$col_input.data('available_pins', available_pins);
	if ($row_input.data('role') == 'tagsinput') {
		$row_input.tagsinput('refresh');
	}
	if ($col_input.data('role') == 'tagsinput') {
		$col_input.tagsinput('refresh');
	}
	if (!row_valid_pins.length || !col_valid_pins.length) {
		$('#kimera-error').show();
	}
	else {
		$('#kimera-error').hide();
	}
}

function kimeraMatrixMappingChange(variant) {
	var $matrix_textarea = $("#kbd-cfg-container #kimera-matrix-val");
	var raw = $matrix_textarea.val();
	_keyboard_config["matrix_map_raw"] = raw;
	kimeraParseMatrixMapping(variant);
}

function kimeraParseMatrixMapping(variant) {
	_keyboard_config["matrix_map_state"] = tkg.parseMatrixMapLayer(_keyboard_config["matrix_map_raw"],
			(variant == "two_headed" ? 2 : 0),
			false,
			function(key) {
				var label = key["label"]["top"];
				var mapping = /^(\d+),(\d+)$/.exec(label);
				if (mapping) {
					return {
						"row": parseInt(mapping[1]) - 1,
						"col": parseInt(mapping[2]) - 1
					};
				}
				else {
					return null;
				}
			});
	_keyboard_config["matrix_map"] = tkg.getMatrixMap();
	_keyboard_config["physical_rows"] = tkg.parseRowCount(_keyboard_config["matrix_map_raw"]);
	kimeraMatrixMappingRefresh();
	kimeraConfigUpdate(true, variant);
	updateLayers();
}

function kimeraMatrixMappingRefresh() {
	var $matrix_textarea = $("#kbd-cfg-container #kimera-matrix-val");
	var raw = $matrix_textarea.val();
	var state = _keyboard_config["matrix_map_state"];

	var $div = $matrix_textarea.parent();
	// clear validation states
	var class_names = [ "has-success", "has-warning", "has-error" ];
	for (var i in class_names) {
		var class_name = class_names[i];
		if ($div.hasClass(class_name)) {
			$div.removeClass(class_name);
		}
	}
	// set validation state
	if (raw != "") {
		switch (state) {
			case tkg.NONE:
				$div.addClass("has-success");
				break;
			case tkg.WARNING:
				$div.addClass("has-warning");
				break;
			case tkg.ERROR:
				$div.addClass("has-error");
				break;
		}
	}

	// set data for popover
	$matrix_textarea.data('error', tkg.getMatrixMapError());
	$matrix_textarea.data('warning', tkg.getMatrixMapWarning());
	$matrix_textarea.data('info', tkg.getMatrixMapInfo());
	kimeraSetupMatrixMappingPopover();
}

function kimeraSetupMatrixMappingPopover() {
	var $matrix_textarea = $("#kbd-cfg-container #kimera-matrix-val");
	var has_popover = false;
	var error = $matrix_textarea.data('error');
	var warning = $matrix_textarea.data('warning');
	var info = $matrix_textarea.data('info');
	var top_prop = [ "top", "side_print" ];
	var bottom_prop = [ "bottom", "side_print_secondary" ];
	var $content = $('<div>');

	if (error && !_.isEmpty(error)) {
		$content.append(appendLayerError(error, top_prop[0], bottom_prop[0]));
		has_popover = true;
	}
	if (warning && !_.isEmpty(warning)) {
		$content.append(appendLayerWarning(warning, top_prop[0], bottom_prop[0]));
		has_popover = true;
	}
	if (info && !_.isEmpty(info)) {
		$content.append(appendLayerInfo(info, top_prop[0], bottom_prop[0]));
		has_popover = true;
	}

	$matrix_textarea.popover('destroy');
	$matrix_textarea.nextAll().remove();
	if (has_popover) {
		// setup popover
		$matrix_textarea.popover({
			animation: false,
			html: true,
			trigger: 'focus',
			content: $content.html(),
			container: '#layer-info-container',
		});

		$matrix_textarea.on('shown.bs.popover', function() {
			var $popover = $('#layer-info-container .popover');
			adjustPopoverPosition($popover);

			// setup tooltip of keys
			$('#layer-info-container .popover').find('li.key').tooltip('destroy').tooltip({
				trigger: 'hover',
				placement: 'bottom',
				html: true,
				delay: { show: 500, hide: 100 },
				container: '#key-info-container',
			});
		});
	}
}

function kimeraConfigUpdate(init, variant) {
	_keyboard["matrix_rows"] = _keyboard_config["matrix_rows"];
	_keyboard["matrix_cols"] = _keyboard_config["matrix_cols"];
	_keyboard["matrix_size"] = _keyboard_config["matrix_size"];
	_keyboard["physical_rows"] = _keyboard_config["physical_rows"];
	_keyboard["matrix_map"] = _keyboard_config["matrix_map"];
	_keyboard["additional"][0]["data"] = kimeraMakeConfigData(variant);
	if (init) {
		tkg.init({
			"max_layers": _keyboard["max_layers"],
			"matrix_rows": _keyboard_config["matrix_rows"],
			"matrix_cols": _keyboard_config["matrix_cols"],
			"matrix_map": _keyboard_config["matrix_map"]
		});
	}
}

function kimeraMakeConfigData(variant) {
	var data = [];
	var row_mapping = _keyboard_config["row_mapping"];
	var col_mapping = _keyboard_config["col_mapping"];
	var row_count = row_mapping.length;
	var col_count = col_mapping.length;

	if (variant == 'two_headed') {
		data.push(row_count + 0x80, col_count);
	}
	else {
		data.push(row_count, col_count);
	}

	for (var i = 0; i < row_count; i++) {
		if (row_mapping[i]) {
			data.push(row_mapping[i] - 1);
		}
		else {
			data.push(parseInt('0xFF', 16));
		}
	}
	for (var i = 0; i < col_count; i++) {
		if (col_mapping[i]) {
			data.push(col_mapping[i] - 1);
		}
		else {
			data.push(parseInt('0xFF', 16));
		}
	}

	return data;
}

function usb2usbOriginalLayoutChange(variant) {
	var $orig_layout = $("#kbd-cfg-container #usb2usb-orig-layout-val");
	var raw = $orig_layout.val();
	_keyboard_config["original_layout"] = raw;
	usb2usbParseMatrixMapping(variant);
}

function usb2usbParseMatrixMapping(variant) {
	_keyboard_config["matrix_map_state"] = tkg.parseMatrixMapLayer(_keyboard_config["original_layout"],
			0,
			true,
			function(key) {
				var keycode = parseInt(key.keycode, 16);
				if (key.keycode) {
					return {
						"row": (keycode & 0xF0) >> 4,
						"col": keycode & 0x0F
					};
				}
				else {
					return null;
				}
			});
	_keyboard_config["matrix_map"] = tkg.getMatrixMap();
	_keyboard_config["physical_rows"] = tkg.parseRowCount(_keyboard_config["original_layout"]);
	usb2usbOriginalLayoutRefresh();
	usb2usbConfigUpdate(true, variant);
	updateLayers();
}

function usb2usbOriginalLayoutRefresh() {
	var $orig_layout = $("#kbd-cfg-container #usb2usb-orig-layout-val");
	var raw = $orig_layout.val();
	var state = _keyboard_config["matrix_map_state"];

	var $div = $orig_layout.parent();
	// clear validation states
	var class_names = [ "has-success", "has-warning", "has-error" ];
	for (var i in class_names) {
		var class_name = class_names[i];
		if ($div.hasClass(class_name)) {
			$div.removeClass(class_name);
		}
	}
	// set validation state
	if (raw != "") {
		switch (state) {
			case tkg.NONE:
				$div.addClass("has-success");
				break;
			case tkg.WARNING:
				$div.addClass("has-warning");
				break;
			case tkg.ERROR:
				$div.addClass("has-error");
				break;
		}
	}

	// set data for popover
	$orig_layout.data('error', tkg.getMatrixMapError());
	$orig_layout.data('warning', tkg.getMatrixMapWarning());
	$orig_layout.data('info', tkg.getMatrixMapInfo());
	usb2usbSetupOriginalLayoutPopover();
}

function usb2usbSetupOriginalLayoutPopover() {
	var $orig_layout = $("#kbd-cfg-container #usb2usb-orig-layout-val");
	var has_popover = false;
	var error = $orig_layout.data('error');
	var warning = $orig_layout.data('warning');
	var info = $orig_layout.data('info');
	var top_prop = [ "top", "side_print" ];
	var bottom_prop = [ "bottom", "side_print_secondary" ];
	var $content = $('<div>');

	if (error && !_.isEmpty(error)) {
		$content.append(appendLayerError(error, top_prop[0], bottom_prop[0]));
		has_popover = true;
	}
	if (warning && !_.isEmpty(warning)) {
		$content.append(appendLayerWarning(warning, top_prop[0], bottom_prop[0]));
		has_popover = true;
	}
	if (info && !_.isEmpty(info)) {
		$content.append(appendLayerInfo(info, top_prop[0], bottom_prop[0]));
		has_popover = true;
	}

	$orig_layout.popover('destroy');
	$orig_layout.nextAll().remove();
	if (has_popover) {
		// setup popover
		$orig_layout.popover({
			animation: false,
			html: true,
			trigger: 'focus',
			content: $content.html(),
			container: '#layer-info-container',
		});

		$orig_layout.on('shown.bs.popover', function() {
			var $popover = $('#layer-info-container .popover');
			adjustPopoverPosition($popover);

			// setup tooltip of keys
			$('#layer-info-container .popover').find('li.key').tooltip('destroy').tooltip({
				trigger: 'hover',
				placement: 'bottom',
				html: true,
				delay: { show: 500, hide: 100 },
				container: '#key-info-container',
			});
		});
	}
}

function usb2usbConfigUpdate(init, variant) {
	_keyboard["matrix_rows"] = _keyboard_config["matrix_rows"];
	_keyboard["matrix_cols"] = _keyboard_config["matrix_cols"];
	_keyboard["matrix_size"] = _keyboard_config["matrix_size"];
	_keyboard["physical_rows"] = _keyboard_config["physical_rows"];
	_keyboard["matrix_map"] = _keyboard_config["matrix_map"];
	if (init) {
		tkg.init({
			"max_layers": _keyboard["max_layers"],
			"matrix_rows": _keyboard_config["matrix_rows"],
			"matrix_cols": _keyboard_config["matrix_cols"],
			"matrix_map": _keyboard_config["matrix_map"]
		});
	}
}
