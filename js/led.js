function emptyLeds() {
	$('#led-wrapper').empty();
	$('#led-field').parent().hide();
}

function appendLeds() {
	emptyLeds();
	var leds = tkg.getLeds();
	if (leds.length) {
		for (var index in leds) {
			var led = leds[index];
			$('#led-wrapper').append(
				$('<div>').attr({ "class": "form-group"  }).append(
					$('<label>').attr({ "for": "led" + index + '-map', "class": "col-md-2 control-label", "title": _keyboard["led_map"][index]["description"] })
					.text(_keyboard["led_map"][index]["name"])
				).append(
					$('<div>').attr({ "id": "led" + index, "class": "led-row col-md-10" })
				)
			);
		}
		$('#led-wrapper .led-row').led();
		$('#led-field').parent().show();
	}
	else {
		$('#led-field').parent().hide();
	}
}

$.fn.led = function() {
	return this.each(function() {
		var $row = $(this);
		var id = $row.attr('id');
		var index = Number(id.slice('led'.length));
		var led = tkg.getLeds(index);
		var value = led["value"];
		var param = led["param"];
		$row.removeData();
		$row.data('index', index);
		$row.data('value', value);
		$row.data('param', param);
		var $map = $('<div>').attr({ "class": "led-param led-map" }).append(
			makeSelect({ "id": id + "-map", "class": "multiselect" }, tkg.getLedOptions("led"), value)
		);
		$row.empty().append($map);
		$row.find('.led-map select').multiselect({
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(element, checked) {
				$row.data('value', $(element).val());
				onLedChange(id);
			},
		});
		appendLedParams(id);
		updateLedMapState();
	});
}

function onLedChange(id) {
	var $row = $('#led-wrapper #' + id);
	var index = $row.data('index');
	var value = $row.data('value');
	$row.removeData();
	$row.data('index', index);
	$row.data('value', value);
	var led = tkg.getLeds(index);
	led["value"] = value;
	tkg.setLeds(index, led);
	appendLedParams(id);
}

function appendLedParams(id) {
	var $row = $('#led-wrapper #' + id);
	var $map = $row.find('.led-map');
	$map.nextAll().remove();
	var index = $row.data('index');
	var led = tkg.getLeds(index);
	var value = led["value"];
	if (led["param"]) {
		var param = led["param"];
		var binding = param["binding"];
		var reverse = param["reverse"];
		var backlight = param["backlight"];
		var led_count = param["led_count"];
		var $params = $();
		for (var key in param) {
			switch (key) {
				case "binding":
					$params = $params.add($('<div>').attr({ "class": "led-param led-param-binding" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("binding")
						).append(
							makeSelect({ "id": id + "-param-binding" }, tkg.getLedOptions("binding"), binding["value"])
						)
					));
					break;
				case "reverse":
					$params = $params.add($('<div>').attr({ "class": "led-param led-param-reverse" }).append(
						$('<div>').attr({ "class": "checkbox" }).append(
							$('<label>').append(
								$('<input>').attr({ "id": id + "-param-reverse", "type": "checkbox" }).prop('checked', reverse)
							).append(
								$('<span>').attr({ "lang": "en" }).text("reverse")
							)
						)
					));
					break;
				case "backlight":
					$params = $params.add($('<div>').attr({ "class": "led-param led-param-backlight" }).append(
						$('<div>').attr({ "class": "checkbox" }).append(
							$('<label>').append(
								$('<input>').attr({ "id": id + "-param-backlight", "type": "checkbox" }).prop('checked', backlight)
							).append(
								$('<span>').attr({ "lang": "en" }).text("backlight")
							)
						)
					));
					break;
				case "led_count":
					$params = $params.add($('<div>').attr({ "class": "led-param led-param-led-count" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("number of led")
						).append(
							makeSelect({ "id": id + "-param-led-count" }, tkg.getLedOptions("led_count"), led_count)
						)
					));
					break;
			}
		}
		$row.append($params);
		$row.find('.led-param-binding select').multiselect({
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(option, checked) {
				$row.data('binding', $(option).val());
				onLedParamsChange(id);
			}
		});
		$row.find('.led-param-backlight input').change(function() {
			$row.data('backlight', $(this).is(':checked') ? 1 : 0);
			onLedParamsChange(id);
		});
		$row.find('.led-param-reverse input').change(function() {
			$row.data('reverse', $(this).is(':checked') ? 1 : 0);
			onLedParamsChange(id);
		});
		$row.find('.led-param-led-count select').multiselect({
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(option, checked) {
				$row.data('led_count', $(option).val());
				onLedParamsChange(id);
			}
		});
		appendLedSubParams(id);
	}
}

function onLedParamsChange(id) {
	var $row = $('#led-wrapper #' + id);
	var index = $row.data('index');
	var value = $row.data('value');
	var binding = $row.data('binding');
	var reverse = $row.data('reverse');
	var backlight = $row.data('backlight');
	var led_count = $row.data('led_count');
	var led = tkg.getLeds(index);
	$row.removeData();
	$row.data('index', index);
	$row.data('value', value);
	if (binding) {
		if (_.isObject(led["param"]["binding"])) {
			led["param"]["binding"]["value"] = binding;
		}
		else {
			led["param"]["binding"] = { "value": binding };
		}
		$row.data('binding', binding);
	}
	if (backlight !== undefined) {
		led["param"]["backlight"] = backlight;
		$row.data('backlight', backlight);
	}
	if (reverse !== undefined) {
		led["param"]["reverse"] = reverse;
		$row.data('reverse', reverse);
	}
	if (led_count !== undefined) {
		led["param"]["led_count"] = led_count;
		$row.data('led_count', led_count);
	}
	tkg.setLeds(index, led);
	appendLedSubParams(id);
}

function appendLedSubParams(id) {
	var $row = $('#led-wrapper #' + id);
	var $binding = $row.find('.led-param-binding');
	$row.find('.led-sub-param').remove();
	var index = $row.data('index');
	var led = tkg.getLeds(index);
	var binding = led["param"]["binding"];
	if (binding && binding["param"]) {
		var param = binding["param"];
		var layer = param["layer"];
		var ind = param["ind"];
		var $params = $();
		for (var key in param) {
			switch (key) {
				case "layer":
					$params = $params.add($('<div>').attr({ "class": "led-param led-sub-param led-param-layer" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("layer")
						).append(
							makeSelect({ "id": id + "-param-layer" }, tkg.getFnOptions("layer"), param[key])
						)
					));
					break;
				case "ind":
					$params = $params.add($('<div>').attr({ "class": "led-param led-sub-param led-param-ind" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("indicator")
						).append(
							makeSelect({ "id": id + "-param-ind" }, tkg.getLedOptions("ind"), param[key])
						)
					));
					break;
			}
		}
		$binding.after($params);
		$row.find('.led-param-layer select').multiselect({
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(option, checked) {
				$row.data('layer', Number($(option).val()));
				onLedSubParamsChange(id);
			}
		});
		$row.find('.led-param-ind select').multiselect({
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(option, checked) {
				$row.data('ind', $(option).val());
				onLedSubParamsChange(id);
			}
		});
	}
}

function onLedSubParamsChange(id) {
	var $row = $('#led-wrapper #' + id);
	var index = $row.data('index');
	var value = $row.data('value');
	var layer = $row.data('layer');
	var ind = $row.data('ind');
	var led = tkg.getLeds(index);
	$row.removeData();
	$row.data('index', index);
	$row.data('value', value);
	if (layer) {
		led["param"]["binding"]["param"]["layer"] = layer;
		$row.data('layer', layer);
	}
	if (ind) {
		led["param"]["binding"]["param"]["ind"] = ind;
		$row.data('ind', ind);
	}
	tkg.setLeds(index, led);
}

function rebuildLedSelect() {
	$('.led-param select').multiselect('rebuild');
}

function updateLedMapState() {
	var result = parseKeyboardName(_keyboardName);
	var main = result['main'];
	var variant = result['variant'];
	if (_advanced_mode || main.match(/^(kimera.*)/)) {
		$('.led-map').show();
	}
	else {
		$('.led-map').hide();
	}
}
