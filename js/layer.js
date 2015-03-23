const LAYER_NORMAL = 0;
const LAYER_SIMPLE = 1;
const LAYER_ALL_IN_ONE = 2;

function emptyLayers() {
	$('#layer-wrapper').empty();
}

function appendLayers(layer_mode) {
	var default_layer_num = 2;
	emptyLayers();
	switch (layer_mode) {
		case LAYER_SIMPLE:
		case LAYER_ALL_IN_ONE:
			// add controls
			$('#layer-wrapper').append(
				// composite layer
				$('<div>').attr({ "class": "layer-row form-group" }).append(
					$('<label>').attr({
						"for": "composite-layer",
						"class": "col-md-2 control-label",
						"lang": "en"
					}).text("Composite Layer"),
					$('<div>').attr({ "class": "layer col-md-5" }).append(
						$('<textarea>').attr({
							"spellcheck": false,
							"id": "composite-layer",
							"class": "form-control composite-layer-raw kle-layer",
							"rows": 4,
							"lang": "en",
							"placeholder": "Paste URL or Raw Data here"
						})
					)
				)
			);
			break;
		case LAYER_NORMAL:
			// add controls
			$('#layer-wrapper').append(
				// layer number
				$('<div>').attr({ "id": "layer-num-row", "class": "form-group" }).append(
					$('<label>').attr({
						"for": "layer-num",
						"class": "col-md-2 control-label",
						"lang": "en"
					}).text("Number of Layers"),
					$('<div>').attr({ "class": "col-md-2" }).append(
						$('<input>').attr({
							"id": "layer-num",
							"class": "form-control",
							"type": "text",
							"name": "layer-num",
							"value": default_layer_num
						})
					)
				)
			).append(
				// layers
				(function (layer_num) {
					var $layers = $();
					for (var i = 0; i < layer_num; i++) {
						$layers = $layers.add(makeLayer(i));
					}
					return $layers;
				})(default_layer_num)
			);
			// initialize touch spin
			$('#layer-num').TouchSpin({
				min: 1,
				max: _keyboard['max_layers'],
				boostat: 5,
				stepinterval: 200,
				booster: false
			});
			$('#layer-num').val(default_layer_num);
			$('#layer-num').change(function() {
				var count = $('.layer-row').length;
				var num = $('#layer-num').val();

				for (var i = 0; i < Math.abs(num - count); i++) {
					if (num > count) {
						addAfterLastLayer();
					}
					else {
						removeLastLayer();
					}
				}
			});
			break;
	}
}

function makeLayer(index) {
	return $('<div>').attr({ "class": "layer-row form-group" }).append(
		$('<label>').attr({
			"for": "layer" + index,
			"class": "col-md-2 control-label",
			"lang": "en"
		}).text("Layer" + index),
		$('<div>').attr({ "class": "layer col-md-5" }).append(
			$('<textarea>').attr({
				"spellcheck": false,
				"id": "layer" + index,
				"class": "form-control layer-raw kle-layer",
				"rows": 4,
				"lang": "en",
				"placeholder": "Paste URL or Raw Data here"
			})
		)
	);
}

function addAfterLastLayer() {
	var index = $('.layer-row').length;
	$('.layer-row:last').after(makeLayer(index));
}

function removeLastLayer() {
	$('.layer-row:last').remove();
}

function onLayerChange($layer, layer_mode, block_rows) {
	var id = $layer.attr('id')
	var last = $layer.data('last') || "";
	var raw = $layer.val();
	if (last != raw) {
		$layer.data('last', raw);
	}
	else {
		return;
	}

	var layer_number;
	if (id == "composite-layer") {
		layer_number = 0;
	}
	else {
		layer_number = id.slice(5);
	}
	var state = tkg.parseLayer(layer_number, raw, layer_mode, block_rows);
	var $div = $layer.parent();
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
	switch (layer_mode) {
		case LAYER_NORMAL:
			$layer.data('error', tkg.getError(layer_number));
			$layer.data('warning', tkg.getWarning(layer_number));
			$layer.data('info', tkg.getInfo(layer_number));
			break;
		case LAYER_SIMPLE:
		case LAYER_ALL_IN_ONE:
			$layer.data('error', tkg.getError());
			$layer.data('warning', tkg.getWarning());
			$layer.data('info', tkg.getInfo());
			break;
	}
	setupLayerPopover(id, layer_mode);

	appendFns();
	updateDownloadButtonState();
}

function setupLayerPopover(id, layer_mode) {
	var $layer = $('#' + id);
	var has_popover = false;
	var error = $layer.data('error');
	var warning = $layer.data('warning');
	var info = $layer.data('info');
	var top_prop = [ "top", "side_print", "top_secondary" ];
	var bottom_prop = [ "bottom", "side_print_secondary", "bottom_secondary" ];
	var $content = $('<div>');
	var max_layers = 0;

	switch (layer_mode) {
		case LAYER_NORMAL:
			max_layers = 1;
			break;
		case LAYER_SIMPLE:
			max_layers = 3;
			break;
		case LAYER_ALL_IN_ONE:
			max_layers = _keyboard['max_layers'];
			break;
	}

	var sub_contents = [];
	for (var i = 0; i < max_layers; i++) {
		var has_layer = false;
		var label_index = (layer_mode == LAYER_SIMPLE) ? i : 0;
		var $sub_content = $('<div>');
		var sub_error;
		var sub_warning;
		var sub_info;
		if (layer_mode == LAYER_SIMPLE || layer_mode == LAYER_ALL_IN_ONE) {
			$sub_content.append($('<h4>').attr({ "class": "", "lang": "en" }).text("Layer" + i));
			sub_error = error[i];
			sub_warning = warning[i];
			sub_info = info[i];
		}
		else {
			sub_error = error;
			sub_warning = warning;
			sub_info = info;
		}
		if (sub_error && !_.isEmpty(sub_error)) {
			$sub_content.append(appendLayerError(sub_error, top_prop[label_index], bottom_prop[label_index]));
			has_layer = true;
		}
		if (sub_warning && !_.isEmpty(sub_warning)) {
			$sub_content.append(appendLayerWarning(sub_warning, top_prop[label_index], bottom_prop[label_index]));
			has_layer = true;
		}
		if (sub_info && !_.isEmpty(sub_info)) {
			$sub_content.append(appendLayerInfo(sub_info, top_prop[label_index], bottom_prop[label_index]));
			has_layer = true;
		}
		if (has_layer) {
			sub_contents.push($sub_content);
			has_popover = true;
		}
	}
	for (var i = 0; i < sub_contents.length; i++) {
		$content.append(sub_contents[i]);
		if (i != sub_contents.length - 1) {
			$content.append($('<hr>'));
		}
	}

	$layer.popover('destroy');
	$layer.nextAll().remove();
	if (has_popover) {
		// setup popover
		$layer.popover({
			animation: false,
			html: true,
			trigger: 'focus',
			//trigger: 'manual',
			content: $content.html(),
			container: '#layer-info-container',
		});//.popover('show');

		$layer.on('shown.bs.popover', function() {
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

function appendLayerError(error, top_prop, bottom_prop) {
	var $content = $('<h4>').attr({ "class": "text-danger", "lang": "en" }).text("ERROR");
	for (var type in error) {
		switch (type) {
			case "general":
				$content.append(
					$('<h5>').attr({ "class": "text-danger", "lang": "en" }).text("General"),
					$('<p>').attr({ "class": "general" }).append($('<span>').attr({ "lang": "en" }).text(error[type]))
				);
				break;
			case "unknown_label":
				var keys = error[type];
				$content.append(
					$('<h5>').attr({ "class": "text-danger", "lang": "en" }).text("Unknown label"),
					$('<div>').attr({ "class": "unknown-label" }).append(makeKeyList(keys, function(key) {
						return "x: " + key["x"] + "<br>" + "y: " + key["y"];
					}, top_prop, bottom_prop))
				);
				break;
			case "no_matching_keycode":
				var keys = error[type];
				$content.append(
					$('<h5>').attr({ "class": "text-danger", "lang": "en" }).text("No matching key"),
					$('<div>').attr({ "class": "no-matching-keycode" }).append(makeKeyList(keys, function(key) {
						return "x: " + key["x"] + "<br>" + "y: " + key["y"];
					}, top_prop, bottom_prop))
				);
				break;
			case "matrix_missmapping":
				var keys = error[type];
				$content.append(
					$('<h5>').attr({ "class": "text-danger", "lang": "en" }).text("Position mismatch"),
					$('<div>').attr({ "class": "matrix-missmapping" }).append(makeKeyList(keys, function(key) {
						return "x: " + key["x"] + "<br>" + "y: " + key["y"];
					}, top_prop, bottom_prop))
				);
				break;
			case "matrix_map_incorrect_format":
				var keys = error[type];
				$content.append(
					$('<h5>').attr({ "class": "text-danger", "lang": "en" }).text("Incorrect format"),
					$('<div>').attr({ "class": "matrix-map-incorrect-format" }).append(makeKeyList(keys, function(key) {
						return "x: " + key["x"] + "<br>" + "y: " + key["y"];
					}, top_prop, bottom_prop))
				);
				break;
			case "matrix_map_invalid_mapping":
				var keys = error[type];
				$content.append(
					$('<h5>').attr({ "class": "text-danger", "lang": "en" }).text("Invalid row or col"),
					$('<div>').attr({ "class": "matrix-map-invalid-mapping" }).append(makeKeyList(keys, function(key) {
						return "x: " + key["x"] + "<br>" + "y: " + key["y"];
					}, top_prop, bottom_prop))
				);
				break;
		}
	}
	return $content;
}

function appendLayerWarning(warning, top_prop, bottom_prop) {
	var $content = $('<h4>').attr({ "class": "text-warning", "lang": "en" }).text("WARNING");
	for (var type in warning) {
		switch (type) {
			case "matrix_overlapping":
				var keys = warning[type];
				$content.append(
					$('<h5>').attr({ "class": "text-warning", "lang": "en" }).text("Overlapping key ignored"),
					$('<div>').attr({ "class": "matrix-overlapping" }).append(makeKeyList(keys, function(key) {
						return "x: " + key["x"] + "<br>" + "y: " + key["y"];
					}, top_prop, bottom_prop))
				);
				break;
			case "label_2_ignored":
				var keys = warning[type];
				$content.append(
					$('<h5>').attr({ "class": "text-warning", "lang": "en" }).text("Secondary label ignored"),
					$('<div>').attr({ "class": "label-2-ignored" }).append(makeKeyList(keys, function(key) {
						return "x: " + key["x"] + "<br>" + "y: " + key["y"];
					}, top_prop, bottom_prop))
				);
				break;
			case "fn_out_of_bounds":
				var keys = warning[type];
				$content.append(
					$('<h5>').attr({ "class": "text-warning", "lang": "en" }).text("Invalid Fn key"),
					$('<div>').attr({ "class": "fn-out-of-bounds" }).append(makeKeyList(keys, function(key) {
						return "x: " + key["x"] + "<br>" + "y: " + key["y"];
					}, top_prop, bottom_prop))
				);
				break;
			case "matrix_map_overlapping":
				var keys = warning[type];
				$content.append(
					$('<h5>').attr({ "class": "text-warning", "lang": "en" }).text("Overlapping matrix mapping ignored"),
					$('<div>').attr({ "class": "matrix-map-overlapping" }).append(makeKeyList(keys, function(key) {
						return "x: " + key["x"] + "<br>" + "y: " + key["y"];
					}, top_prop, bottom_prop))
				);
				break;
		}
	}
	return $content;
}

function appendLayerInfo(info, top_prop, bottom_prop) {
	var $content = $('<h4>').attr({ "class": "text-info", "lang": "en" }).text("INFO");
	for (var type in info) {
		switch (type) {
			case "solved_conflict":
				var keys = info[type];
				var keys_for_popover = reduceDuplicatedObjects(keys, function(source, target) {
					if (source["symbol"] == target["symbol"]) {
						if (source["label"][top_prop] == target["label"][top_prop]) {
							if (source["label"][bottom_prop] && target["label"][bottom_prop]) {
								return source["label"][bottom_prop] == target["label"][bottom_prop];
							}
							else {
								return true;
							}
						}
					}
					return false;
				}, [ "label", "symbol", "description" ]);
				$content.append(
					$('<h5>').attr({ "class": "text-info", "lang": "en" }).text("Solved conflict"),
					$('<div>').attr({ "class": "solved-conflicit" }).append(makeKeyList(keys_for_popover, function(key) {
						return key["description"];
					}, top_prop, bottom_prop))
				);
				break;
		}
	}
	return $content;
}

function reduceDuplicatedObjects(objects, equal, properties) {
	var reduced = [];
	for (var i = 0; i < objects.length; i++) {
		var found = false;
		for (var j = 0; j < reduced.length; j++) {
			if (equal.call(equal, objects[i], reduced[j])) {
				found = true;
				break;
			}
		}
		if (!found) {
			var object = {};
			for (var j = 0; j < properties.length; j++) {
				var prop = properties[j];
				object[prop] = objects[i][prop];
			}
			reduced.push(object);
		}
	}
	return reduced;
}

function makeKeyList(keys, tooltip, top_prop, bottom_prop) {
	top_prop = top_prop || "top";
	bottom_prop = bottom_prop || "bottom";
	var $list = $('<ul>');
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		if (_.isFunction(tooltip)) {
			$list.append(makeKey(key, tooltip.call(key, key), top_prop, bottom_prop));
		}
		else {
			$list.append(makeKey(key, tooltip, top_prop, bottom_prop));
		}
	}
	return $list;
}

function makeKey(key, tooltip, top_prop, bottom_prop) {
	var label = key["label"];
	var top_label = label[top_prop] || "";
	var bottom_label = label[bottom_prop] || "";
	return $('<li>').attr({
			"class": "key",
			"data-title": tooltip
		}).append(
			$('<span>').attr({ "class": "top-label" }).text(top_label),
			$('<span>').attr({ "class": "bottom-label" }).text(bottom_label)
		);
}
