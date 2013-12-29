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
	var retval = tkg.parseLayer(layer_number, raw);
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
		switch (retval) {
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
	appendFns();
	updateDownloadButtonState();
}
