window.lang = new jquery_lang_js();
var tkg = new TKG();
var keyboard = {};
var simple_mode = false;

$(function() {

	$('.btn').button();

	showNotification();

	tkg.setKeycodeMap(keycode_map);
	tkg.setActionMap(action_map);
	tkg.setSimpleMode(simple_mode);
	initialize( $('#keyboard-sel:first-child').val() );
	
	$('#keyboard-sel').on('change', function() {
		var name = this.value;
		initialize( name );
	});

	// on page change
	$('#home').click( function() {
		location.hash = '';
		$('#pg-home').show();
		$('#pg-about').hide();
		$('#pg-help').hide();
	});

	$('#about').click( function() {
		location.hash = 'about';
		$('#pg-home').hide();
		$('#pg-about').show();
		$('#pg-help').hide();
	});

	$('#help').click( function() {
		location.hash = 'help';
		$('#pg-home').hide();
		$('#pg-about').hide();
		$('#pg-help').show();
	});
	
	// on change
	$('#layer-form').on('change', '#layer-num', function() {
		var count = $('.layer').length;
		var num = $('#layer-num').val();

		// add layers
		if ( num > count ) {
			for ( var i = count + 1; i <= num; i++ ) {
				$('.layer:last').after( 
				'<div class="layer form-group">' +
					'<label for="layer' + (i - 1) + '" class="col-md-2 control-label" lang="en">Layer' + (i - 1) + '</label>' +
					'<div class="col-md-5">' +
						'<textarea id="layer' + (i - 1) + '" class="form-control layer-raw" rows="4"></textarea>' +
					'</div>' +
				'</div>');
			}
		}

		// delete layers
		else if ( num < count ) {
			for ( var i = num; i <= count - 1; i++ ) {
				$('.layer:last').remove();
			}
		}
		
		// load translation
		window.lang.run();
	});

	// parse layer
	$('#layer-form').on('blur', 'textarea', function(event) {
		var id = event.target.id;
		var layer_number;
		if (id == "composite-layer") {
			layer_number = 0;
		}
		else {
			layer_number = id.slice(5);
		}
		var raw_string = $("#" + id).val();
		var retval = tkg.parseLayer(layer_number, raw_string);
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
		if (raw_string != "") {
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
	});

	// on off switch
	$('#switch-on, #switch-off').click( function() {
		$('#switch-on').toggleClass('btn-default active btn-primary');
		$('#switch-off').toggleClass('btn-default active btn-primary');
	});

	// simple mode on
	$('#switch-on').click( function() {
		$('#layer-control, .layer').remove();
		$('#simple-mode').after(
			'<div class="layer form-group">' +
				'<label for="composite-layer" class="col-md-2 control-label" lang="en">Composite Layer</label>' +
				'<div class="col-md-5">' +
					'<textarea spellcheck="false" id="composite-layer" class="form-control composite-layer-raw" rows="4"></textarea>' +
				'</div>' +
			'</div>');

		emptyFns();

		window.lang.run();
		tkg.setSimpleMode(true);

		return false;	// no submit
	});

	// simple mode off
	$('#switch-off').click( function() {
		var name = $('#keyboard-sel').val();
		initialize(name);
		tkg.setSimpleMode(false);

		return false;	// no submit
	});

	// download
	$('#dl_eep, #dl_c').click(function() {
		var id = $(this).attr('id');
		var type = '';
		var keymaps = [];
		var fn_actions = [];

		if ( id == 'dl_eep' ) {
			type = 'eep';
			keymaps = tkg.getKeymapsHex();
			fn_actions = tkg.getFnActionsHex();
		}
		else if ( id == 'dl_c' ) {
			type = 'c';
			keymaps = tkg.getKeymapsSymbol();
			fn_actions = tkg.getFnActionsSymbol();
		}

		if ( $('#dl_form').length > 0 ) {
			$('#dl_form').remove();
		}

		$("body").append("<form id='dl_form' action='download.php?file=" + type + "' method='POST'>" +
			"<input type='hidden' name='matrix_rows' value='" + keyboard['matrix_rows'] + "'>" +
			"<input type='hidden' name='matrix_cols' value='" + keyboard['matrix_cols'] + "'>" +
			"<input type='hidden' name='max_layers' value='" + keyboard['max_layers'] + "'>" +
			"<input type='hidden' name='max_fns' value='" + keyboard['max_fns'] + "'>" +
			"<input type='hidden' name='eep_size' value='" + keyboard['eep_size'] + "'>" +
			"<input type='hidden' name='eep_start' value='" + keyboard['eep_start'] + "'>" +
			"<input type='hidden' name='keymaps' value='" + JSON.stringify(keymaps) + "'>" +
			"<input type='hidden' name='fn_actions' value='" + JSON.stringify(fn_actions) + "'>" +
			"</form>");
		console.log(keymaps);
		console.log(fn_actions);
		console.log($('#dl_form').html());
		$('#dl_form').submit();
	});
});

function initialize( name ) {

	loadKeyboard( name );


	$('#kbd-info').popover('destroy');

	$('#kbd-info-dummy').html(
		'<strong><span lang="en">Name</span>: </strong>' + keyboard['name'] + '<br/>' +
		'<strong><span lang="en">Description</span>: </strong>' + keyboard['description'] + '<br/>' +
		'<strong><span lang="en">Max Layers</span>: </strong>' + keyboard['max_layers'] + '<br/>' + 
		'<strong><span lang="en">Max Fns</span>: </strong>' + keyboard['max_fns']
	);

	// show keyboard help info
	$('#kbd-info').popover({
		html: true,
		trigger: 'hover',
		//content: $('#kbd-info-dymmy').html()
		content: 
			'<strong><span lang="en">Name</span>: </strong>' + keyboard['name'] + '<br/>' +
			'<strong><span lang="en">Description</span>: </strong>' + keyboard['description'] + '<br/>' +
			'<strong><span lang="en">Max Layers</span>: </strong>' + keyboard['max_layers'] + '<br/>' + 
			'<strong><span lang="en">Max Fns</span>: </strong>' + keyboard['max_fns']
	});

	$('#kbd-info').on('shown.bs.popover', function() {
		window.lang.run();
	});

	if ($('#switch-off').hasClass('active')) {

		if ( $('#layer-control').length == 0 )
			$('#simple-mode').after(
						'<div id="layer-control" class="form-group">' +
							'<label for="layer-num" lang="en" class="col-md-2 control-label">Number of Layers</label>' +
							'<div class="col-md-2">' +
								'<input id="layer-num" class="form-control" type="text" name="layer-num" value="2">' +
							'</div>' +
						'</div>');

		// initialize touch spin
		$('#layer-num').TouchSpin({
			min: 1,
			max: keyboard['max_layers'],
			boostat: 5,
			stepinterval: 200,
			booster: false
		});

		$('#layer-num').val('2');

		if ( $('.layer').length > 0 )
			$('.layer').remove();

		$('#layer-control').after('<div class="layer form-group">' +
						'<label for="layer0" class="col-md-2 control-label" lang="en">Layer0</label>' +
						'<div class="col-md-5">' +
							'<textarea spellcheck="false" id="layer0" class="form-control layer-raw" rows="4"></textarea>' +
						'</div>' +
					'</div>' + 
					'<div class="layer form-group">' +
						'<label for="layer1" class="col-md-2 control-label" lang="en">Layer1</label>' +
						'<div class="col-md-5">' +
							'<textarea spellcheck="false" id="layer1" class="form-control layer-raw" rows="4"></textarea>' +
						'</div>' +
					'</div>' );
	}
	
	// clear fns
	emptyFns();

	window.lang.run();
}

function loadKeyboard( name ) {
	$.ajaxSetup({ async: false });
	$.getJSON("keyboard/" + name.toLowerCase() + ".json", function(json) {
		keyboard = json;
		tkg.init({
			"max_layers": keyboard["max_layers"],
			"max_fns": keyboard["max_fns"],
			"matrix_rows": keyboard["matrix_rows"],
			"matrix_cols": keyboard["matrix_cols"],
			"matrix_map": keyboard["matrix_map"]
		});
		console.log(keyboard);
	}).fail(function(d, textStatus, error) {
		console.error("getJSON failed, status: " + textStatus + ", error: "+error)
	});
	$.ajaxSetup({ async: true });
}

function appendNotification() {
	$('.navbar-fixed-top').prepend('<div id="notification"><div id="notification-inner">This website is under construction, any feature will be removed or be modified at any time without advance notice.</div></div>');
}

function showNotification() {
	appendNotification();
	$('.navbar-fixed-top').css('top', '29px');
	$('body').css('padding-top', '79px');
}

function emptyFns() {
	$('#fn-wrapper').empty();
}

function appendFns() {
	emptyFns();
	var fns = tkg.getFns();
	console.log(fns);
	for (var index in fns) {
		var fn = fns[index];
		$('#fn-wrapper').append(
			$('<div>').attr({ "class": "form-group"  }).append(
				$('<label>').attr({ "for": "fn" + index + "-action", "class": "col-md-2 control-label" }).text("Fn" + index)
			).append(
				$('<div>').attr({ "id": "fn" + index, "class": "fn-row col-md-10" })
			)
		);
	}
	$('#fn-wrapper .fn-row').fn();
}

function appendFnParams(id) {
	var $row = $('#fn-wrapper #' + id);
	var $action = $row.find('.fn-action');
	$action.nextAll().remove();
	var index = Number(id.slice(2));
	var fn = tkg.getFns(index);
	var action = fn["action"];
	if (fn["param"]) {
		var param = fn["param"];
		var args = fn["args"];
		var $params = $();
		for (var i = 0; i < param.length; i++) {
			var arg = args[i];
			switch (param[i]) {
				case "layer":
					$params = $params.add($('<div>').attr({ "class": "fn-param fn-param-layer" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("layer")
						).append(
							makeSelect({ "id": id + "-param-layer" }, tkg.getFnOptions("layer"), arg)
						)
					));
					break;
				case "on":
					$params = $params.add($('<div>').attr({ "class": "fn-param fn-param-on" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("when")
						).append(
							makeSelect({ "id": id + "-param-on" }, tkg.getFnOptions("on"), arg)
						)
					));
					break;
				case "lr":
					continue;
				case "mods":
					$params = $params.add($('<div>').attr({ "class": "fn-param fn-param-mods" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("modifier")
						).append(
							makeSelect({ "id": id + "-param-lr", "class": "btn" }, tkg.getFnOptions("lr"), arg)
						).append(
							makeSelect({ "id": id + "-param-mods", "class": "btn", "multiple": "multiple" }, tkg.getFnOptions("mods"), arg)
						)
					));
					break;
				case "key":
					$params = $params.add($('<div>').attr({ "class": "fn-param fn-param-key" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("key")
						).append(
							makeSelect({ "id": id + "-param-key" }, tkg.getFnOptions("key"), arg)
						)
					));
					break;
			}
		}
		$row.append($params);
		window.lang.run();
		$row.find('.fn-param-layer select').multiselect({
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			}
		});
		$row.find('.fn-param-on select').multiselect({
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			}
		});
		$row.find('.fn-param-mods select').multiselect({
			buttonText: function(options, select) {
				if (options.length == 0) {
					return '<span lang="en">None</span> <b class="caret"></b>';
				}
				else {
					var selected = '';
					options.each(function() {
						selected += $(this).attr('title') + '+';
					});
					return selected.substr(0, selected.length - 1) + ' <b class="caret"></b>';
				}
			},
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			afterChange: function() {
				window.lang.run();
			}
		});
		$row.find('.fn-param-key select').multiselect({
			enableCaseInsensitiveFiltering: true,
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			}
		});
		window.lang.run();
	}
}

function makeSelect(attr, data, current, breakword) {
	return $('<select>').attr(attr).append(
		(function() {
			function makeOption(data, current, breakword) {
				var value;
				var text;
				if (_.isObject(data)) {
					value = data["value"];
					text = data["text"];
					title = data["title"];
				}
				else {
					value = data;
					text = data;
					title = data;
				}
				/*
				if (breakword) {
					var words = text.split(" ");
					for (var i = 0; i < words.length; i++) {
						words[i] = '<span lang="en">' + words[i] + '<span>';
					}
					text = words.join(" ");
				}
				else {
					text = '<span lang="en">' + text + '</span>';
				}
				*/
				return $('<option>').attr({
					"value": value,
					"title": title,
					"lang": "en",
					"selected": (value == current)
				}).text(text);
			}
			var $options = $();
			for (var index in data) {
				if (_.isArray(data[index])) {
					var $optgroup = $('<optgroup>', { "label": index, "lang": "en" });
					var $sub_options = $();
					for (var i = 0; i < data[index].length; i++) {
						$sub_options = $sub_options.add(makeOption(data[index][i], current, breakword));
					}
					$optgroup.append($sub_options);
					$options = $options.add($optgroup);
				}
				else {
					$options = $options.add(makeOption(data[index], current, breakword));
				}
			}
			return $options;
		})());
}

$.fn.fn = function() {
	return this.each(function() {
		var id = $(this).attr('id');
		var index = Number(id.slice(2));
		var fn = tkg.getFns(index);
		var $action = $('<div>').attr({ "class": "fn-action" }).append(
			makeSelect({ "id": id + "-action", "class": "multiselect" }, tkg.getFnOptions("action"), fn["action"], true)
		);
		$(this).empty().append($action);
		window.lang.run();
		$(this).find('.fn-action select').multiselect({
			buttonText: function(options, select) {
				var $selected = $(options[0]);
				var group = $selected.parent().attr('label');
				var value = $selected.attr('value');
				return (value != 'ACTION_NO' ? '<span lang="en">' + group + '</span> > ' : '') +
					'<span lang="en">' + $selected.text() + '</span> <b class="caret"></b>';
			},
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(element, checked) {
				tkg.setFns(index, {
					"action": $(element).val()
				});
				appendFnParams(id);
			},
			buttonWidth: '100%'
		});
		//$(this).find('.fn-action .btn-group').css('width', '100%');
		appendFnParams(id);
	});
}

function onLangChange(lang) {
	window.lang.change(lang);
	$('.fn-action select').multiselect('rebuild');
	$('.fn-param select').multiselect('rebuild');
}
