var _keyboard_config = {};

function initKeyboardConfig(name) {
	if (name == "Kimera") {
		$('#kbd-cfg').show();
		$('#kbd-cfg-container').show();
		initKeyboardConfigPopover(name);
		_keyboard_config = loadKeyboardConfig(name);
		afterLoadKeyboardConfig(name);
		window.lang.run();
	}
	else {
		$('#kbd-cfg').hide();
		$('#kbd-cfg-container').hide();
	}
}

function loadKeyboardConfig(name) {
	var config = {};
	$.ajaxSetup({ async: false, cache: false });
	$.getJSON("keyboard/" + name.toLowerCase() + "_config.json", function(json) {
		config = json;
	}).fail(function(d, textStatus, error) {
		console.error("getJSON failed, status: " + textStatus + ", error: "+error)
	});
	$.ajaxSetup({ async: true });
	return config;
}

function initKeyboardConfigPopover(name) {
	$('#kbd-cfg-btn').popover('destroy').popover({
		animation: false,
		html: true,
		placement: 'bottom',
		trigger: 'manual',
		content: function() {
			return $('#' + name.toLowerCase() + '-config').html();
		},
		container: '#kbd-cfg-container'
	}).unbind('click').click(function() {
		$(this).popover('toggle');
	}).on('shown.bs.popover', function() {
		initKeyboardConfigPanel(name);
	});
}

function afterLoadKeyboardConfig(name) {
	if (name == "Kimera") {
		tkg.init({
			"matrix_rows": _keyboard_config["matrix_rows"],
			"matrix_cols": _keyboard_config["matrix_cols"]
		});
		_keyboard_config["matrix_map_state"] = tkg.parseMatrixMapLayer(_keyboard_config["matrix_map_raw"]);
		_keyboard_config["matrix_map"] = tkg.getMatrixMap();
		kimeraConfigUpdate(true);
	}
}

function initKeyboardConfigPanel(name) {
	if (name == "Kimera") {
		// mux mapping
		var $mux_sels = $('#kbd-cfg-container #kimera-mux select');
		$mux_sels.multiselect({
			buttonWidth: "100%",
			buttonContainer: '<div class="btn-group" style="width:25%" />',
			onChange: function(option, checked) {
				kimeraMuxMappingChange();
			}
		});
		if (!_.isEmpty(_keyboard_config)) {
			var mux_count = _keyboard_config["mux_count"];
			for (var i = 0; i < $mux_sels.length; i++) {
				$mux_sels.eq(i).val(_keyboard_config["mux_mapping"][i]).multiselect('refresh');
			}
		}
		kimeraMuxMappingRefresh();

		// row col mapping
		var $row_input = $('#kbd-cfg-container #kimera-row-val');
		var $col_input = $('#kbd-cfg-container #kimera-col-val');
		if ("row_mapping" in _keyboard_config) {
			if ("row_mapping_input" in _keyboard_config) {
			}
			else {
				_keyboard_config["row_mapping_input"] = _keyboard_config["row_mapping"];
			}
			$row_input.val(_keyboard_config["row_mapping_input"].join(','));
		}
		if ("col_mapping" in _keyboard_config) {
			if ("col_mapping_input" in _keyboard_config) {
			}
			else {
				_keyboard_config["col_mapping_input"] = _keyboard_config["col_mapping"];
			}
			$col_input.val(_keyboard_config["col_mapping_input"].join(','));
		}
		$row_input.data('role', 'tagsinput').tagsinput({
			tagClass: function(item) { 
				if (_.contains($row_input.data('available_ports'), parseInt(item))) {
					return 'label label-primary';
				}
				else {
					return 'label label-danger';
				}
			},
			typeahead: {
				source: function(query) {
					return $row_input.data('available_ports');
				}
			},
		});
		$row_input.change(function() {
			//kimeraRowMappingChange();
		});
		$col_input.data('role', 'tagsinput').tagsinput({
			tagClass: function(item) {
				if (_.contains($col_input.data('available_ports'), parseInt(item))) {
					return 'label label-primary';
				}
				else {
					return 'label label-danger';
				}
			},
			typeahead: {
				source: function(query) {
					return $col_input.data('available_ports');
				}
			},
		});
		$col_input.change(function() {
			//kimeraColMappingChange();
		});
		$($row_input.tagsinput('input')).attr('lang', $row_input.attr('lang')).blur(function() {
			kimeraRowMappingChange();
		});
		$($col_input.tagsinput('input')).attr('lang', $col_input.attr('lang')).blur(function() {
			kimeraColMappingChange();
		});
		kimeraRowColMappingRefresh();

		// matrix mapping
		var $matrix_textarea = $("#kbd-cfg-container #kimera-matrix-val");
		$matrix_textarea.val(_keyboard_config["matrix_map_raw"]);
		$matrix_textarea.blur(function() {
			kimeraMatrixMappingChange();
		});
		kimeraMatrixMappingRefresh();
	}
}

function kimeraMuxMappingChange() {
	var $mux_sels = $('#kbd-cfg-container #kimera-mux select');
	var mux_mapping = _keyboard_config["mux_mapping"];
	for (var i = 0; i < $mux_sels.length; i++) {
		mux_mapping[i] = $($mux_sels[i]).val();
	}

	var row_max_count = 0;
	var col_max_count = 0;
	var mux_mapping = _keyboard_config["mux_mapping"];
	var mux_ports = _keyboard_config["mux_ports"] | 0;
	for (var i = 0; i < mux_mapping.length; i++) {
		if (mux_mapping[i] == "row") {
			row_max_count += mux_ports;
		}
		else if (mux_mapping[i] == "col") {
			col_max_count += mux_ports;
		}
	}
	_keyboard_config["matrix_max_rows"] = row_max_count;
	_keyboard_config["matrix_max_cols"] = col_max_count;

	kimeraConfigUpdate(true);
	kimeraMuxMappingRefresh();
	kimeraRowColMappingRefresh();
	kimeraMatrixMappingChange(true);
}

function kimeraMuxMappingRefresh() {
	var $mux_error = $('#kbd-cfg-container #kimera-mux').next('div');
	var mux_mapping = _keyboard_config["mux_mapping"];
	if (_.indexOf(mux_mapping, "row") == -1 || _.indexOf(mux_mapping, "col") == -1) {
		$mux_error.show();
	}
	else {
		$mux_error.hide();
	}
}

function kimeraRowMappingChange(force) {
	var $row_input = $('#kbd-cfg-container #kimera-row-val');
	var val = $row_input.val();
	var last = $row_input.data('last') || "";
	if (force) {
		last = "";
	}
	if (val == last) {
		return;
	}
	$row_input.data('last', val);
	var input_ports = _.map(val.split(','), function(e) {
		return parseInt(e);
	});
	_keyboard_config["row_mapping_input"] = input_ports;
	_keyboard_config["row_mapping"] = _.intersection(input_ports, $row_input.data('available_ports'));
	_keyboard_config["matrix_rows"] = _keyboard_config["row_mapping"].length;
	kimeraConfigUpdate(true);
	kimeraMatrixMappingChange(true);
}

function kimeraColMappingChange(force) {
	var $col_input = $('#kbd-cfg-container #kimera-col-val');
	var val = $col_input.val();
	var last = $col_input.data('last') || "";
	if (force) {
		last = "";
	}
	if (val == last) {
		return;
	}
	$col_input.data('last', val);
	var input_ports = _.map(val.split(','), function(e) {
		return parseInt(e);
	});
	_keyboard_config["col_mapping_input"] = input_ports;
	_keyboard_config["col_mapping"] = _.intersection(input_ports, $col_input.data('available_ports'));
	_keyboard_config["matrix_cols"] = _keyboard_config["col_mapping"].length;
	kimeraConfigUpdate(true);
	kimeraMatrixMappingChange(true);
}

function kimeraRowColMappingRefresh() {
	var $row_input = $('#kbd-cfg-container #kimera-row-val');
	var $col_input = $('#kbd-cfg-container #kimera-col-val');
	var mux_mapping = _keyboard_config["mux_mapping"];
	var mux_ports = _keyboard_config["mux_ports"] | 0;
	var row_ports = [];
	var col_ports = [];
	for (var i = 0; i < mux_mapping.length; i++) {
		if (mux_mapping[i] == "row") {
			for (var j = 0; j < mux_ports; j++) {
				row_ports.push(parseInt(i * mux_ports + j + 1));
			}
		}
		else if (mux_mapping[i] == "col") {
			for (var j = 0; j < mux_ports; j++) {
				col_ports.push(parseInt(i * mux_ports + j + 1));
			}
		}
	}
	$row_input.data('available_ports', row_ports);
	$col_input.data('available_ports', col_ports);
	if ($row_input.data('role') == 'tagsinput') {
		$row_input.tagsinput('refresh');
		kimeraRowMappingChange(true);
	}
	if ($col_input.data('role') == 'tagsinput') {
		$col_input.tagsinput('refresh');
		kimeraColMappingChange(true);
	}
}

function kimeraMatrixMappingChange(force) {
	var $matrix_textarea = $("#kbd-cfg-container #kimera-matrix-val");
	var raw = $matrix_textarea.val();
	var last = $matrix_textarea.data('last') || "";
	if (force) {
		last = "";
	}
	if (last == raw) {
		return;
	}
	_keyboard_config["matrix_map_state"] = tkg.parseMatrixMapLayer(raw);
	_keyboard_config["matrix_map"] = tkg.getMatrixMap();
	kimeraMatrixMappingRefresh();
	kimeraConfigUpdate(true);
	updateLayers();
}

function kimeraMatrixMappingRefresh() {
	var $matrix_textarea = $("#kbd-cfg-container #kimera-matrix-val");
	var raw = $matrix_textarea.val();
	var state = _keyboard_config["matrix_map_state"];
	$matrix_textarea.data('last', raw);

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
			window.lang.run();
		});
	}
}

function kimeraConfigUpdate(init) {
	_keyboard["matrix_rows"] = _keyboard_config["matrix_max_rows"];
	_keyboard["matrix_cols"] = _keyboard_config["matrix_max_cols"];
	_keyboard["matrix_size"] = _keyboard_config["matrix_size"];
	_keyboard["additional"][0]["data"] = kimeraMakeConfigData();
	if (init) {
		tkg.init({
			"max_layers": _keyboard["max_layers"],
			"max_fns": _keyboard["max_fns"],
			"matrix_rows": _keyboard_config["matrix_rows"],
			"matrix_cols": _keyboard_config["matrix_cols"],
			"matrix_map": _keyboard_config["matrix_map"]
		});
	}
}

function kimeraMakeConfigData() {
	var data = [];
	var mux_ports = _keyboard_config["mux_ports"] | 0;
	var mux_count = _keyboard_config["mux_count"];
	var mux_mapping = _keyboard_config["mux_mapping"];
	var row_max_count = _keyboard_config["matrix_max_rows"];
	var col_max_count = _keyboard_config["matrix_max_cols"];
	var row_mapping = _keyboard_config["row_mapping"];
	var col_mapping = _keyboard_config["col_mapping"];

	var mux_config = 0;
	for (var i = 0; i < mux_count; i++) {
		if (mux_mapping[i] == "row") {
			mux_config |= (1 << i);
		}
	}
	data.push(mux_config);

	for (var i = 0; i < row_max_count; i++) {
		if (row_mapping[i]) {
			data.push(row_mapping[i] - 1);
		}
		else {
			data.push(parseInt('0xFF', 16));
		}
	}
	for (var i = 0; i < col_max_count; i++) {
		if (col_mapping[i]) {
			data.push(col_mapping[i] - 1);
		}
		else {
			data.push(parseInt('0xFF', 16));
		}
	}
	
	return data;
}
