function emptyLayers() {
	$('#layer-wrapper').empty();
}

function appendLayers(simple_mode) {
	var default_layer_num = 2;
	emptyLayers();
	if (simple_mode) {
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
						"class": "form-control composite-layer-raw",
						"rows": 4,
						"lang": "en",
						"placeholder": "Paste raw data here"
					})
				)
			)
		);
	}
	else {
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

			// translate
			window.lang.run();
		});
	}
	// translate popover
	$('#layer-wrapper .layer').on('shown.bs.popover', function() {
		window.lang.run();
	});
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
				"class": "form-control layer-raw",
				"rows": 4,
				"lang": "en",
				"placeholder": "Paste raw data here"
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

function onLayerChange(event) {
	var id = event.target.id;
	var $layer = $('#' + id);
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
	var state = tkg.parseLayer(layer_number, raw);
	var div = $(this).parent();
	// clear validation states
	var class_names = [ "has-success", "has-warning", "has-error" ];
	for (var i in class_names) {
		var class_name = class_names[i];
		if (div.hasClass(class_name)) {
			div.removeClass(class_name);
		}
	}
	// set validation state
	if (raw != "") {
		switch (state) {
			case tkg.NONE:
				div.addClass("has-success");
				break;
			case tkg.WARNING:
				div.addClass("has-warning");
				break;
			case tkg.ERROR:
				div.addClass("has-error");
				break;
		}
	}

	// set data for popover
	$layer.data('error', tkg.getError(layer_number));
	$layer.data('warning', tkg.getWarning(layer_number));
	$layer.data('info', tkg.getInfo(layer_number));
	setupLayerPopover(id);

	appendFns();
	updateDownloadButtonState();
}

function setupLayerPopover(id) {
	var $layer = $('#' + id);
	var has_popover = false;
	var error = $layer.data('error');
	var warning = $layer.data('warning');
	var info = $layer.data('info');
	var $content = $('<div>');
	if (error && !_.isEmpty(error)) {
		$content.append(appendLayerError(error));
		has_popover = true;
	}
	if (warning && !_.isEmpty(warning)) {
		$content.append(appendLayerWarning(warning));
		has_popover = true;
	}
	$layer.popover('destroy');
	if (has_popover) {
		// setup popover
		$layer.popover({
			html: true,
			trigger: 'focus',
			//trigger: 'manual',
			content: $content.html()
		});//.popover('show');

		// setup tooltip of keys
		$('.popover li.key').tooltip({
			trigger: 'hover',
			placement: 'bottom',
			html: true,
			delay: { show: 500, hide: 100 }
		});
	}

}

function appendLayerError(error) {
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
					$('<div>').attr({ "class": "unknown-label" }).append(makeKeyList(keys))
				);
				break;
			case "no_matching_keycode":
				var keys = error[type];
				$content.append(
					$('<h5>').attr({ "class": "text-danger", "lang": "en" }).text("No matching key"),
					$('<div>').attr({ "class": "no-matching-keycode" }).append(makeKeyList(keys))
				);
				break;
			case "matrix_missmapping":
				var keys = error[type];
				$content.append(
					$('<h5>').attr({ "class": "text-danger", "lang": "en" }).text("Position mismatch"),
					$('<div>').attr({ "class": "matrix-missmapping" }).append(makeKeyList(keys))
				);
				break;
		}
	}
	return $content;
}

function appendLayerWarning(warning) {
	var $content = $('<h4>').attr({ "class": "text-warning", "lang": "en" }).text("WARNING");
	for (var type in warning) {
		switch (type) {
			case "fn_out_of_bounds":
				var keys = warning[type];
				$content.append(
					$('<h5>').attr({ "class": "text-warning", "lang": "en" }).text("Invalid Fn key"),
					$('<div>').attr({ "class": "fn-out-of-bounds" }).append(makeKeyList(keys))
				);
				break;
		}
	}
	return $content;
}

function makeKeyList(keys, top_property, bottom_property) {
	top_property = top_property || "top";
	bottom_property = bottom_property || "bottom";
	var $list = $('<ul>');
	for (var i = 0; i < keys.length; i++) {
		$list.append(makeKey(keys[i], top_property, bottom_property));
	}
	return $list;
}

function makeKey(key, top_property, bottom_property) {
	var label = key["label"];
	var top_label = label[top_property] || "";
	var bottom_label = label[bottom_property] || "";
	var tooltip = "x: " + key["x"] + "<br>" + "y: " + key["y"];
	return $('<li>').attr({
			"class": "key",
			"data-title": tooltip
		}).append(
			$('<span>').attr({ "class": "top-label" }).text(top_label),
			$('<span>').attr({ "class": "bottom-label" }).text(bottom_label)
		);
}
