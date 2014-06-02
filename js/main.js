window.lang = new jquery_lang_js();
var tkg = new TKG();
var _keyboard = {};
var _simple_mode = false;

$(function() {

	$(window).on('hashchange', function() {
		switchPage(location.hash.slice(1));
	}).trigger('hashchange');

	window.lang.beforeRun = function() {
		detachLinks();
	}
	window.lang.afterChange = function(lang) {
		attachLinks();
		changeFont(lang);
	}

	$('.btn').button();

	showNotification();

	appendAvailableLabelTable();

	tkg.setKeycodeMap(keycode_map);
	tkg.setFnMaps(action_map, lr_map, mod_map, on_map);
	tkg.setSimpleMode(_simple_mode);

	// select keyboard
	$('#keyboard-sel').multiselect({
		buttonContainer: '<div class="btn-group" />'
	});
	$('#keyboard-sel').change(function() {
		var name = this.value;
		initialize(name, _simple_mode);
	}).change();

	updateDownloadButtonState();

	// on navbar click
	$('.navbar-brand').click(function(e) {
		if ($(this).attr('href') == (location.hash || '#')) {
			switchPage(location.hash.slice(1));
			//e.preventDefault();
			//return false;
		}
		$('.page:visible').data('scroll', $(window).scrollTop());
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
		window.lang.run();
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
		window.lang.run();
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
			window.lang.run();
		}
	});
	
	// parse layer
	$('#layer-wrapper').on('blur', 'textarea', onLayerChange);

	// simple mode on off switch
	$('#switch-on, #switch-off').click( function() {
		$('#switch-on').toggleClass('btn-default active btn-primary');
		$('#switch-off').toggleClass('btn-default active btn-primary');
		if ($('#switch-on').hasClass('active')) {
			_simple_mode = true;
		}
		else if ($('#switch-off').hasClass('active')) {
			_simple_mode = false;
		}
		else {
			return false;
		}
		initForm(_simple_mode);
		tkg.setSimpleMode(_simple_mode);
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

		/*
		$("body").append("<form id='dl_form' action='download.php?file=" + type + "' method='POST'>" +
			"<input type='hidden' name='matrix_rows' value='" + _keyboard['matrix_rows'] + "'>" +
			"<input type='hidden' name='matrix_cols' value='" + _keyboard['matrix_cols'] + "'>" +
			"<input type='hidden' name='matrix_size' value='" + (_keyboard['matrix_size'] || (_keyboard['matrix_rows'] * _keyboard['matrix_cols'])) + "'>" +
			"<input type='hidden' name='max_layers' value='" + _keyboard['max_layers'] + "'>" +
			"<input type='hidden' name='max_fns' value='" + _keyboard['max_fns'] + "'>" +
			"<input type='hidden' name='eep_size' value='" + _keyboard['eep_size'] + "'>" +
			"<input type='hidden' name='eep_start' value='" + _keyboard['eep_start'] + "'>" +
			"<input type='hidden' name='keymaps' value='" + JSON.stringify(keymaps) + "'>" +
			"<input type='hidden' name='fn_actions' value='" + JSON.stringify(fn_actions) + "'>" +
			"</form>");
			*/
		var $form = $("<form>", {
			"id": "dl_form", "action": "download.php?file=" + type, "method": "POST"
		}).append($("<input>", {
			"type": "hidden", "name": "matrix_rows", "value": _keyboard['matrix_rows']
		})).append($("<input>", {
			"type": "hidden", "name": "matrix_cols", "value": _keyboard['matrix_cols']
		})).append($("<input>", {
			"type": "hidden", "name": "max_layers", "value": _keyboard['max_layers']
		})).append($("<input>", {
			"type": "hidden", "name": "max_fns", "value": _keyboard['max_fns']
		})).append($("<input>", {
			"type": "hidden", "name": "eep_size", "value": _keyboard['eep_size']
		})).append($("<input>", {
			"type": "hidden", "name": "eep_start", "value": _keyboard['eep_start']
		})).append($("<input>", {
			"type": "hidden", "name": "keymaps", "value": JSON.stringify(keymaps)
		})).append($("<input>", {
			"type": "hidden", "name": "fn_actions", "value": JSON.stringify(fn_actions)
		}));
		if (_keyboard['name'] == 'Kimera') {
			$form = $form.append($("<input>", {
				"type": "hidden", "name": "additional", "value": JSON.stringify(_keyboard['additional'])
			}));
		}
		$("body").append($form);

		console.log(keymaps);
		console.log(fn_actions);
		console.log($('#dl_form').html());
		$('#dl_form').submit();
	});
});

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

function initialize(name, simple_mode) {
	var keyboard = loadKeyboard(name);
	_keyboard = keyboard;
	initKeyboardConfig(name);
	initKeyboardInfo(keyboard);
	initForm(simple_mode);
}

function loadKeyboard(name) {
	var keyboard = {};
	$.ajaxSetup({ async: false, cache: false });
	$.getJSON("keyboard/" + name.toLowerCase() + ".json", function(json) {
		keyboard = json;
		tkg.init({
			"max_layers": keyboard["max_layers"],
			"max_fns": keyboard["max_fns"],
			"matrix_rows": keyboard["matrix_rows"],
			"matrix_cols": keyboard["matrix_cols"],
			"matrix_map": keyboard["matrix_map"]
		});
	}).fail(function(d, textStatus, error) {
		console.error("getJSON failed, status: " + textStatus + ", error: "+error)
	});
	$.ajaxSetup({ async: true });
	return keyboard;
}

function initKeyboardInfo(keyboard) {
	// remove old
	$('#kbd-info').popover('destroy');

	/*
	$('#kbd-info-dummy').html(
		'<strong><span lang="en">Name</span>: </strong>' + keyboard['name'] + '<br/>' +
		'<strong><span lang="en">Description</span>: </strong>' + keyboard['description'] + '<br/>' +
		'<strong><span lang="en">Max Layers</span>: </strong>' + keyboard['max_layers'] + '<br/>' + 
		'<strong><span lang="en">Max Fns</span>: </strong>' + keyboard['max_fns']
	);
	*/

	// show keyboard info
	$('#kbd-info').popover({
		animation: false,
		html: true,
		trigger: 'hover',
		container: '#kbd-info-container',
		//content: (function() { $('#kbd-info-dymmy').html(); })()
		content: 
			'<strong><span lang="en">Name</span>: </strong>' + keyboard['name'] + '<br/>' +
			'<strong><span lang="en">Description</span>: </strong>' + keyboard['description'] + '<br/>' +
			'<strong><span lang="en">Max Layers</span>: </strong>' + keyboard['max_layers'] + '<br/>' + 
			'<strong><span lang="en">Max Fns</span>: </strong>' + keyboard['max_fns']
	});

	// translate when shown
	$('#kbd-info').on('shown.bs.popover', function() {
		//$('#kbd-info-container .popover').css('top', $(this).offset().top + 'px');
		window.lang.run();
	});
}

function initForm(simple_mode) {
	// append layers
	emptyLayers();
	appendLayers(simple_mode);
	
	// clear fns
	emptyFns();

	// update buttons
	updateDownloadButtonState();

	// translate
	window.lang.run();
}

function appendNotification() {
	$('.navbar-fixed-top').prepend('<div id="notification"><div id="notification-inner" lang="en">This website is under construction, any feature will be removed or be modified at any time without advance notice.</div></div>');
	window.lang.run();
}

function showNotification() {
	appendNotification();
	$('.navbar-fixed-top').css('top', '29px');
	$('body').css('padding-top', '79px');
}

function onLangChange(lang) {
	window.lang.change(lang);
	rebuildSelect();
}

function changeFont(lang) {
	var font = '"Helvetica Neue",Helvetica,"Segoe UI",Arial';
	switch (lang) {
		case 'en':
			break;
		case 'ja':
			font += ',"MS UIGothic"';
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
		$('.dl-btn').removeClass('disabled');
	}
	else {
		$('.dl-btn').addClass('disabled');
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
