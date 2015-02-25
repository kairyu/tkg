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
					$('<label>').attr({ "for": "led" + index + '-binding', "class": "col-md-2 control-label" })
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
		var binding = led["binding"];
		var reverse = led["reverse"] | 0;
		var backlight = led["backlight"] | 0;
		$row.removeData();
		$row.data('index', index);
		$row.data('binding', binding);
		$row.data('reverse', reverse);
		$row.data('backlight', backlight);
		var $binding = $('<div>').attr({ "class": "led-param led-binding" }).append(
			makeSelect({ "id": id + "-binding", "class": "multiselect" }, tkg.getLedOptions("binding"), binding)
		);
		var $reverse = $('<div>').attr({ "class": "led-param led-reverse" }).append(
			$('<div>').attr({ "class": "checkbox" }).append(
				$('<label>').append(
					$('<input>').attr({ "id": id + "-reverse", "type": "checkbox" }).prop('checked', reverse)
				).append(
					$('<span>').attr({ "lang": "en" }).text("Reverse")
				)
			)
		);
		var $backlight = $('<div>').attr({ "class": "led-param led-backlight" }).append(
			$('<div>').attr({ "class": "checkbox" }).append(
				$('<label>').append(
					$('<input>').attr({ "id": id + "-backlight", "type": "checkbox" }).prop('checked', backlight)
				).append(
					$('<span>').attr({ "lang": "en" }).text("Backlight")
				)
			)
		);
		$row.empty().append($binding).append($reverse).append($backlight);
		$row.find('.led-binding select').multiselect({
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(element, checked) {
				$row.data('binding', $(element).val());
				onLedChange(id);
			},
		});
		$row.find('.led-backlight input').change(function() {
			$row.data('backlight', $(this).is(':checked') ? 1 : 0);
			onLedChange(id);
		});
		$row.find('.led-reverse input').change(function() {
			$row.data('reverse', $(this).is(':checked') ? 1 : 0);
			onLedChange(id);
		});
		onLedChange(id);
	});
}

function onLedChange(id) {
	var $row = $('#led-wrapper #' + id);
	var index = $row.data('index');
	var binding = $row.data('binding');
	var reverse = $row.data('reverse');
	var backlight = $row.data('backlight');
	$row.removeData();
	$row.data('index', index);
	$row.data('binding', binding);
	$row.data('reverse', reverse);
	$row.data('backlight', backlight);
	tkg.setLeds(index, {
		"binding": binding,
		"reverse": reverse,
		"backlight": backlight
	});
	appendLedParams(id);
}

function appendLedParams(id) {
	var $row = $('#led-wrapper #' + id);
	var $binding = $row.find('.led-binding');
	$binding.nextAll('.led-param-layer').remove();
	var index = $row.data('index');
	var led = tkg.getLeds(index);
	var binding = led["binding"];
	if (led["param"]) {
		var param = led["param"];
		var args = led["args"];
		var $params = $();
		for (var i = 0; i < param.length; i++) {
			var arg = args[i];
			$row.data(param[i], arg);
			switch (param[i]) {
				case "layer":
					$params = $params.add($('<div>').attr({ "class": "led-param led-param-layer" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("layer")
						).append(
							makeSelect({ "id": id + "-param-layer" }, tkg.getFnOptions("layer"), arg, false)
						)
					));
					break;
			}
		}
		$row.find('.led-reverse').before($params);
		// layer param
		$row.find('.led-param-layer select').multiselect({
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(option, checked) {
				$row.data('layer', $(option).val());
				onLedParamsChange(id);
			}
		});
		onLedParamsChange(id);
	}
}

function onLedParamsChange(id) {
	var $row = $('#led-wrapper #' + id);
	var index = $row.data('index');
	var binding = $row.data('binding');
	var reverse = $row.data('reverse');
	var backlight = $row.data('backlight');
	var led = tkg.getLeds(index);
	var param = led["param"];
	var args = [];
	for (var i = 0; i < param.length; i++) {
		args.push($row.data(param[i]));
	}
	tkg.setLeds(index, {
		"binding": binding,
		"args": args,
		"reverse": reverse,
		"backlight": backlight
	});
}

function rebuildLedSelect() {
	$('.led-param select').multiselect('rebuild');
}
