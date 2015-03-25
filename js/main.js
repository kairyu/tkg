window.lang = new Lang('en', undefined, undefined, {
	"ja": "js/lang/ja.json",
	"zh_sc": "js/lang/zh_sc.json",
	"zh_tc": "js/lang/zh_tc.json"
});
var tkg = new TKG();
var _keyboard = {};
var _layer_mode = LAYER_NORMAL;
var _advanced_mode = false;

$(function() {

	changeFont();

	Lang.prototype.attrList.push('label');
	$(window.lang).on('afterUpdate', function(e, currentLang, lang) {
		afterLangChange(lang);
	});

	$(window).on('hashchange', function() {
		switchPage(location.hash.slice(1));
	}).trigger('hashchange');

	$('.btn').button();

	if ($.cookie && $.cookie('tkg_advancedMode')) {
		_advanced_mode = JSON.parse($.cookie('tkg_advancedMode'));
	}

	if ($.cookie && $.cookie('tkg_keyboardName')) {
		$('#keyboard-sel').val($.cookie('tkg_keyboardName')).multiselect('refresh');
	}
	else {
		$('#keyboard-sel').multiselect('refresh');
	}

	showNotification();

	appendAvailableLabelTable();

	tkg.setKeycodeMap(keycode_map);
	tkg.setLedMaps(binding_map, reverse_map, backlight_map);

	// select keyboard
	$('#keyboard-sel').multiselect({
		buttonContainer: '<div class="btn-group" />'
	});
	$('#keyboard-sel').change(function() {
		var name = this.value;
		if ($.cookie) {
			$.cookie('tkg_keyboardName', name, {
				expires: 365,
				path: '/'
			});
		}
		initialize(name, _layer_mode);
	});

	$(window).load(function() {
		$('#keyboard-sel').change();
		if (_tour_once) {
			showTour();
		}
	});

	// on navbar click
	$('.navbar-brand').click(function(e) {
		if ($(this).attr('href') == (location.hash || '#')) {
			switchPage(location.hash.slice(1));
			//e.preventDefault();
			//return false;
		}
		$('.page:visible').data('scroll', $(window).scrollTop());
	});

	// collapse
	$('.collapse').on('hide.bs.collapse', function() {
		$(this).parent().find('legend span.glyphicon').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
	}).on('show.bs.collapse', function() {
		$(this).parent().find('legend span.glyphicon').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
	});

	// show tour
	$('#tools-show-tour').click(function(e) {
		setTimeout(showTour, 100);
	});

	// import fn dialog
	$('#tools-import-fn').click(function(e) {
		if ($(this).parent().hasClass('disabled')) {
			e.preventDefault();
			return false;
		}
		$('#import-fn-dialog').modal('show');
	});
	$('#import-fn-dialog').on('show.bs.modal', function() {
		$('#import-fn-val').val('');
		$('#import-fn-button').addClass('disabled');
		$('#import-fn-error').addClass('hide');
		$('#import-fn-val').parent().removeClass('has-error');
	}).on('shown.bs.modal', function() {
		$('#import-fn-val').focus();
	});

	// export fn dialog
	$('#tools-export-fn').click(function(e) {
		if ($(this).parent().hasClass('disabled')) {
			e.preventDefault();
			return false;
		}
		$('#export-fn-dialog').modal('show');
	});
	$('#export-fn-dialog').on('show.bs.modal', function() {
		$('#export-fn-val').val(tkg.exportFns());
	}).on('shown.bs.modal', function() {
		$('#export-fn-val').focus().select();
	});

	// import and export fn dialog contents
	$('#import-fn-val, #export-fn-val').focus(function() {
		var $textarea = $(this);
		$textarea.select().mouseup(function() {
			$textarea.unbind('mouseup');
			return false;
		});
	});
	$('#import-fn-val').bind('input propertychange', function() {
		if ($(this).val().length) {
			$('#import-fn-button').removeClass('disabled');
		}
		else {
			$('#import-fn-button').addClass('disabled');
		}
	}).trigger('input');

	// import fn
	$('#import-fn-button').click(function() {
		if ($(this).hasClass('disabled')) {
			return false;
		}
		var result = tkg.importFns($('#import-fn-val').val());
		if (result) {
			appendFns();
			$('#import-fn-dialog').modal('hide');
		}
		else {
			$('#import-fn-error').removeClass('hide');
			$('#import-fn-val').focus().parent().addClass('has-error');
		}
	});

	// advanced mode
	$('#tools-advanced-mode').click(function() {
		_advanced_mode = !_advanced_mode;
		if ($.cookie) {
			$.cookie('tkg_advancedMode', _advanced_mode, {
				expires: 365,
				path: '/'
			});
		}
		updateAdvancedModeState();
		updateBurnButtonState();
	});
	updateAdvancedModeState();

	// get raw data from server
	$('body').on('blur', '.kle-layer', function(event) {
		var $this = $(this);
		if (isKLEUrl($this.val())) {
			$this.attr('disabled', 'disabled');
			getKLERawData($this.val(), function(data) {
				$this.val(data);
				$this.removeAttr('disabled');
				$this.trigger('blur_custom', [ $this ]);
			}, function() {
				$(this).removeAttr('disabled');
				$(this).trigger('blur_custom', [ $this ]);
			});
		}
		else {
			$this.trigger('blur_custom', [ $this ]);
		}
	});

	// parse layer
	$('#layer-wrapper').on('blur_custom', 'textarea', function(event, $layer) {
		onLayerChange($layer, _layer_mode, _keyboard['physical_rows']);
	});

	// layer mode switch
	$('#layer-mode-normal, #layer-mode-simple, #layer-mode-allinone').click( function() {
		if ($(this).hasClass('active')) {
			return false;
		}
		$('#layer-mode button').removeClass('btn-primary active').addClass('btn-default');
		$(this).removeClass('btn-default').addClass('btn-primary active');
		switch ($(this).attr('id').slice('layer-mode-'.length)) {
			case 'normal': _layer_mode = LAYER_NORMAL; break;
			case 'simple': _layer_mode = LAYER_SIMPLE; break;
			case 'allinone': _layer_mode = LAYER_ALL_IN_ONE; break;
		}
		initForm(_layer_mode);
		tkg.initVariables();
		return false;	// no submit
	});

	// download
	$('#dl_eep, #dl_c').click(function() {
		download($(this).attr('id'));
	});
});

function download(id) {
	var type = '';
	var keymaps = [];
	var fn_actions = [];
	var leds = [];

	if (id == 'dl_eep') {
		type = 'eep';
		keymaps = tkg.getKeymapsHex();
		fn_actions = tkg.getFnActionsHex();
		leds = tkg.getLedsHex();
	}
	else if (id == 'dl_c') {
		type = 'c';
		keymaps = tkg.getKeymapsSymbol();
		fn_actions = tkg.getFnActionsSymbol();
		leds = tkg.getLedsSymbol();
	}

	if ($('#dl_form').length > 0) {
		$('#dl_form').remove();
	}

	var $form = $("<form>").attr({ "id": "dl_form", "action": "download.php?file=" + type, "method": "POST" }).append(
			$("<input>").attr({ "type": "hidden", "name": "matrix_rows", "value": _keyboard['matrix_rows'] }),
			$("<input>").attr({ "type": "hidden", "name": "matrix_cols", "value": _keyboard['matrix_cols'] }),
			$("<input>").attr({ "type": "hidden", "name": "matrix_size", "value": _keyboard['matrix_size'] }),
			$("<input>").attr({ "type": "hidden", "name": "max_layers", "value": _keyboard['max_layers'] }),
			$("<input>").attr({ "type": "hidden", "name": "max_fns", "value": _keyboard['max_fns'] }),
			$("<input>").attr({ "type": "hidden", "name": "eep_size", "value": _keyboard['eep_size'] }),
			$("<input>").attr({ "type": "hidden", "name": "eep_start", "value": _keyboard['eep_start'] }),
			$("<input>").attr({ "type": "hidden", "name": "keymaps", "value": JSON.stringify(keymaps) }),
			$("<input>").attr({ "type": "hidden", "name": "fn_actions", "value": JSON.stringify(fn_actions) })
		);

	var has_additional = false;
	if (id == 'dl_eep' && _keyboard['name'].match(/^Kimera.*/i)) {
		has_additional = true;
	}
	if (id == 'dl_eep' && _keyboard['led_count']) {
		_keyboard['additional'][_keyboard['led_additional_index']]['data'] = leds;
		console.log(leds);
		has_additional = true;
	}
	if (has_additional) {
		$form = $form.append($("<input>", {
			"type": "hidden", "name": "additional", "value": JSON.stringify(_keyboard['additional'])
		}));
	}

	$("body").append($form);

	console.log(keymaps);
	console.log(fn_actions);
	console.log(leds);
	console.log($('#dl_form').html());
	$('#dl_form').submit();
}

function switchPage(id) {
	if (id == '') {
		id = 'home';
	}
	else if (id == 'home') {
		id = '';
	}
	$next_page = $('#pg-' + id);
	if ($next_page.length) {
		$('.navbar-brand').parent().removeClass('active');
		$('#' + id).parent().addClass('active');
		$pre_page = $('.page:visible');
		$next_page.show();
		if ($pre_page.attr('id') != $next_page.attr('id')) {
			$pre_page.hide();
		}
		setTimeout(function() {
			$(window).scrollTop($next_page.data('scroll') || 0);
		}, 0);
	}
	else {
		location = '#';
	}
}

function initialize(keyboard_name, layer_mode) {
	var keyboard = loadKeyboard(keyboard_name);
	_keyboard = keyboard;
	initKeyboardConfig(keyboard_name);
	initKeyboardInfo(keyboard);
	initForm(layer_mode);
	appendLeds();
	updateDownloadButtonState();
	updateBurnButtonState();
}

function loadKeyboard(keyboard_name) {
	var keyboard = {};
	var result = parseKeyboardName(keyboard_name);
	var main = result["main"];
	var variant = result["variant"];
	$.ajaxSetup({ async: false, cache: false });
	$.getJSON("keyboard/config/" + main + ".json", function(json) {
		keyboard = json;
		if (variant) {
			$.getJSON("keyboard/config/" + main + "-" + variant + ".json", function(json) {
				keyboard = _.extend(keyboard, json);
			}).fail(function(d, textStatus, error) {
				console.error("getJSON failed, status: " + textStatus + ", error: "+error)
			});
		}
		tkg.init({
			"max_layers": keyboard["max_layers"],
			"max_fns": keyboard["max_fns"],
			"matrix_rows": keyboard["matrix_rows"],
			"matrix_cols": keyboard["matrix_cols"],
			"matrix_map": keyboard["matrix_map"],
			"led_count": keyboard["led_count"]
		});
		var fn_maps = {
			"action_map": action_map,
			"lr_map": lr_map,
			"mod_map": mod_map,
			"on_map": on_map
		}
		if (keyboard["action_functions"]) {
			fn_maps["af_map"] = keyboard["action_functions"];
		}
		if (keyboard["action_macros"]) {
			fn_maps["am_map"] = keyboard["action_macros"];
		}
		tkg.setFnMaps(fn_maps);
		if (keyboard["led_count"] && keyboard["led_map"]) {
			for (var i = 0; i < keyboard["led_count"]; i++) {
				tkg.setLeds(i, keyboard["led_map"][i]["default"]);
			}
		}
	}).fail(function(d, textStatus, error) {
		console.error("getJSON failed, status: " + textStatus + ", error: "+error)
	});
	$.ajaxSetup({ async: true });
	return keyboard;
}

function initKeyboardInfo(keyboard) {
	// remove old
	$('#kbd-info').popover('destroy');

	// show keyboard info
	$('#kbd-info').popover({
		animation: false,
		html: true,
		trigger: 'hover',
		container: '#kbd-info-container',
		content:
			'<strong><span lang="en">Name</span>: </strong>' + keyboard['name'] + '<br/>' +
			'<strong><span lang="en">Description</span>: </strong><span lang="en">' + keyboard['description'] + '</span><br/>' +
			'<strong><span lang="en">Max Layers</span>: </strong>' + keyboard['max_layers'] + '<br/>' +
			'<strong><span lang="en">Max Fns</span>: </strong>' + keyboard['max_fns']
	});
}

function initForm(layer_mode) {
	// append layers
	emptyLayers();
	appendLayers(layer_mode);

	// clear fns
	clearFns();

	// update buttons
	updateDownloadButtonState();
}

function appendNotification() {
	$('.navbar-fixed-top').prepend('<div id="notification"><div id="notification-inner" lang="en">This website is under construction, any feature will be removed or be modified at any time without advance notice.</div></div>');
}

function showNotification() {
	appendNotification();
	$('.navbar-fixed-top').css('top', '29px');
	$('body').css('padding-top', '79px');
}

function onLangChange(lang) {
	detachLinks();
	console.groupCollapsed("lang");
	window.lang.change(lang, undefined, function() {
		console.groupEnd("lang");
	});
}

function afterLangChange(lang) {
	attachLinks();
	changeFont(lang);
	rebuildFnSelect();
	rebuildLedSelect();
}

function changeFont(lang) {
	var font = '"Helvetica Neue","Segoe UI",Helvetica,Arial';
	switch (lang) {
		case 'en':
			break;
		case 'ja':
			font += ',"Hiragino Kaku Gothic",Meiryo,"MS UIGothic"';
			break;
		case 'zh_sc':
			font += ',"Hiragino Sans GB","Microsoft YaHei UI","Microsoft YaHei"';
			break;
		case 'zh_tc':
			font += ',"Microsoft JhengHei"';
			break;
	}
	font += ',sans-serif';
	$('body').css('font-family', font);
	$('h1, h2, h3, h4, h5').css('font-family', font);
}

function updateDownloadButtonState() {
	var empty_count = 0;
	var has_error = false;
	var has_warning = false;
	$('.layer').each(function() {
		if (!$(this).find('textarea').val()) {
			empty_count++;
		}
		if (!has_error) {
			if ($(this).hasClass('has-error')) {
				has_error = true;
			}
		}
		if (!has_warning) {
			if ($(this).hasClass('has-warning')) {
				has_warning = true;
			}
		}
	});

	var $dl_btn = $('.dl-btn');
	$dl_btn.removeClass('btn-default btn-success btn-warning btn-danger');
	if (has_error) {
		$dl_btn.addClass('btn-danger');
	}
	else if (has_warning) {
		$dl_btn.addClass('btn-warning');
	}
	else if (empty_count == $('.layer').length) {
		$dl_btn.addClass('btn-default');
	}
	else {
		$dl_btn.addClass('btn-success');
	}
	var enabled = !has_error && (empty_count < $('.layer').length);
	if (enabled) {
		$('.dl-btn-restrict').removeClass('disabled');
	}
	else {
		$('.dl-btn-restrict').addClass('disabled');
	}
}

function updateBurnButtonState() {
	if ((_keyboard['bootloader'] && _keyboard['bootloader'].length) &&
	(_keyboard['name'].match(/^RedScarfIII/i) || _advanced_mode)) {
		appendBurnButton(_keyboard['bootloader'], _keyboard['firmware']);
	}
	else {
		removeBurnButton();
	}
}

function updateToolsMenuState() {
	if ($('#fn-wrapper').html().length) {
		$('#tools-import-fn, #tools-export-fn').parent().removeClass('disabled');
	}
	else {
		$('#tools-import-fn, #tools-export-fn').parent().addClass('disabled');
	}
}

function updateAdvancedModeState() {
	if (_advanced_mode) {
		$('#tools-advanced-mode').parent().find('i').css('visibility', 'visible');
	}
	else {
		$('#tools-advanced-mode').parent().find('i').css('visibility', 'hidden');
	}
}

function updateLayers() {
	$('#layer-wrapper textarea').data('last', "");
	$('#layer-wrapper textarea').trigger('blur');
}

var links = {
	"a-kle": "http://www.keyboard-layout-editor.com",
	"a-tmk": "https://github.com/tmk/tmk_keyboard",
	"a-tkg": "https://github.com/kairyu/tkg",
	"a-kle-author": "https://github.com/ijprest",
	"a-tmk-author": "https://github.com/tmk",
	"a-wife": "https://github.com/claireyu0328",
	"a-mail": "mailto:kai1103@gmail.com",
	"a-issue": "https://github.com/kairyu/tkg/issues",
}

function attachLinks() {
	$('#pg-about a').each(function() {
		var id = $(this).attr('id');
		if (links[id]) {
			$(this).attr('href', links[id]);
			$(this).attr('target', '_blank');
		}
	});
}

function detachLinks() {
	$('#pg-about a').each(function() {
		var id = $(this).attr('id');
		if (links[id]) {
			$(this).removeAttr('href');
			$(this).removeAttr('target');
		}
	});
}

function appendAvailableLabelTable() {
	if (!appendAvailableLabelTable.low_priority_labels) {
		appendAvailableLabelTable.low_priority_labels = {};
		var priority_labels = {};
		for (var symbol in keycode_map) {
			var key = keycode_map[symbol];
			if (key["label_priority"]) {
				var labels = key["label_priority"];
				for (var i = 0; i < labels.length; i++) {
					priority_labels[labels[i]] = symbol;
				}
			}
		}
		for (var symbol in keycode_map) {
			var key = keycode_map[symbol];
			if (key["label"]) {
				var labels = key["label"];
				for (var i = 0; i < labels.length; i++) {
					if (_.isArray(labels[i])) {
						for (var j = 0; j < labels[i].length; j++) {
							if (priority_labels[labels[i][j]]) {
								if (priority_labels[labels[i][j]] != symbol) {
									appendAvailableLabelTable.low_priority_labels[labels[i][j]] = symbol;
								}
							}
						}
					}
					else {
						if (priority_labels[labels[i]]) {
							if (priority_labels[labels[i]] != symbol) {
								appendAvailableLabelTable.low_priority_labels[labels[i]] = symbol;
							}
						}
					}
				}
			}
		}
	}
	$('#pg-help #available-labels').empty().append(
		$('<div>').attr({ "class": "alert alert-info", "style": "padding: 5px 15px;" }).append(
			$('<span>').attr({ "lang": "en" }).text('Case-insensitive')
		),
		$('<table>').attr({ "class": "table table-striped table-bordered table-condensed" }).append(
			$('<thead>').append(
				$('<tr>').append(
					$('<th>').attr({ "lang": "en" }).text('Key'),
					$('<th>').attr({ "lang": "en" }).text('Labels')
				)
			),
			$('<tbody>').append(
				(function() {
					var $tbody = $();
					for (var symbol in keycode_map) {
						var key = keycode_map[symbol];
						if (key["label"]) {
							$tbody = $tbody.add($('<tr>').append(
								$('<td>').attr({ "title": key["description"] }).text(key["name"]),
								$('<td>').html(makeAvailableLabelTableCell(symbol, key))
							));
						}
					}
					return $tbody;
				})()
			)
		)
	);
}

function makeAvailableLabelTableCell(symbol, key) {
	var $cell = $();
	if (key["label"]) {
		var label = key["label"];
		if (_.isArray(label[0])) {
			label = label[0];
		}
		for (var i = 0; i < label.length; i++) {
			if (appendAvailableLabelTable.low_priority_labels[label[i]] == symbol) {
				$cell = $cell.add($('<code>').attr({ "class": "low-priority", "title": "low priority" }).text(label[i]));
			}
			else {
				$cell = $cell.add($('<code>').text(label[i]));
			}
		}
		if (key["label_2"]) {
			$cell = $cell.add($('<hr>'));
			var label = key["label_2"];
			if (_.isArray(label[0])) {
				label = label[0];
			}
			for (var i = 0; i < label.length; i++) {
				$cell = $cell.add($('<code>').text(label[i]));
			}
		}
	}
	return $cell;
}

function adjustPopoverPosition($popover) {
	var popover_top = parseInt($popover.css('top'));
	var popover_top_org = popover_top;
	var popover_height = parseInt($popover.height());
	var window_top = parseInt($(window).scrollTop());
	var window_height = parseInt($(window).height());
	var margin = 10;
	if (popover_top + popover_height > window_top + window_height - margin) {
		popover_top = window_top + window_height - margin - popover_height;
	}
	if (popover_top < window_top + margin) {
		popover_top = window_top + margin;
	}
	$popover.css('top', popover_top + 'px');
	var arrow_top = popover_height / 2 + (popover_top_org - popover_top);
	var arrow_margin = 12;
	if (arrow_top < arrow_margin) {
		arrow_top = arrow_margin;
	}
	if (arrow_top > popover_height - arrow_margin) {
		arrow_top = popover_height - arrow_margin;
	}
	$popover.find('.arrow').css('top', arrow_top + 'px');
}

function isKLEUrl(url) {
	return /^(http:\/\/)?www\..*\/layouts\/[0-9a-z]+$/.test(url);
}

function getKLERawData(url, success, fail) {
	var match = /layouts\/([0-9a-z]+)$/.exec(url);
	if (match) {
		var hash = match[1];
		$.get("http://www.keyboard-layout-editor.com.s3.amazonaws.com/layouts/" + hash,  function(data) {
			if (data.substr(0, 1) == '[' && data.substr(-1, 1) == ']') {
				success.call(this, data.slice(1, -1));
			}
			else {
				fail.call(this);
			}
		}, "text").fail(function() {
			fail.call(this);
		});
	}
	else {
		fail.call(this);
	}
}

function parseKeyboardName(name) {
	var result = name.match(/^(.*)\((.*)\)$/);
	if (result) {
		var main = normalizeString(result[1]);
		var variant = normalizeString(result[2]);
	}
	else {
		var main = normalizeString(name);
	}
	return { "main": main, "variant": variant };
}

function normalizeString(str) {
	var rsc = /[\s\/-]/g;
	return str.trim().replace(rsc, '_').toLowerCase();
}

versionCompare = function(left, right) {
	if (typeof left + typeof right != 'stringstring')
		return false;

	var a = left.split('.')
		,   b = right.split('.')
		,   i = 0, len = Math.max(a.length, b.length);

	for (; i < len; i++) {
		if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
			return 1;
		} else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
			return -1;
		}
	}

	return 0;
}
