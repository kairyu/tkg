window.lang = new jquery_lang_js();
var tkg = new TKG();
var _keyboard = {};
var _simple_mode = false;

$(function() {

	switchPage(location.hash.slice(1));

	window.lang.beforeChange = function() {
		detachLinks();
	}
	window.lang.afterChange = function() {
		attachLinks();
	}

	$('.btn').button();

	showNotification();

	tkg.setKeycodeMap(keycode_map);
	tkg.setFnMaps(action_map, lr_map, mod_map, on_map);
	tkg.setSimpleMode(_simple_mode);

	$('#keyboard-sel').multiselect({
		buttonWidth: "100%"
	});
	$('#keyboard-sel').change(function() {
		var name = this.value;
		initialize(name, _simple_mode);
	}).change();

	updateDownloadButtonState();

	// on page change
	$('.navbar-brand').click(function() {
		switchPage($(this).attr('id'));
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

		$("body").append("<form id='dl_form' action='download.php?file=" + type + "' method='POST'>" +
			"<input type='hidden' name='matrix_rows' value='" + _keyboard['matrix_rows'] + "'>" +
			"<input type='hidden' name='matrix_cols' value='" + _keyboard['matrix_cols'] + "'>" +
			"<input type='hidden' name='max_layers' value='" + _keyboard['max_layers'] + "'>" +
			"<input type='hidden' name='max_fns' value='" + _keyboard['max_fns'] + "'>" +
			"<input type='hidden' name='eep_size' value='" + _keyboard['eep_size'] + "'>" +
			"<input type='hidden' name='eep_start' value='" + _keyboard['eep_start'] + "'>" +
			"<input type='hidden' name='keymaps' value='" + JSON.stringify(keymaps) + "'>" +
			"<input type='hidden' name='fn_actions' value='" + JSON.stringify(fn_actions) + "'>" +
			"</form>");
		console.log(keymaps);
		console.log(fn_actions);
		console.log($('#dl_form').html());
		$('#dl_form').submit();
	});
});

function switchPage(id) {
	if (id == 'home') id = '';
	$('.page').hide();
	$('#pg-' + (id || 'home')).show();
	location.hash = '#' + id;
}

function initialize(name, simple_mode) {
	var keyboard = loadKeyboard(name);
	_keyboard = keyboard;
	initKeyboardInfo(keyboard);
	initForm(simple_mode);
}

function loadKeyboard(name) {
	var keyboard = {};
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
	}).fail(function(d, textStatus, error) {
		console.error("getJSON failed, status: " + textStatus + ", error: "+error)
	});
	$.ajaxSetup({ async: true });
	return keyboard;
}

function initKeyboardInfo(keyboard) {
	// remove old
	$('#kbd-info').popover('destroy');

	$('#kbd-info-dummy').html(
		'<strong><span lang="en">Name</span>: </strong>' + keyboard['name'] + '<br/>' +
		'<strong><span lang="en">Description</span>: </strong>' + keyboard['description'] + '<br/>' +
		'<strong><span lang="en">Max Layers</span>: </strong>' + keyboard['max_layers'] + '<br/>' + 
		'<strong><span lang="en">Max Fns</span>: </strong>' + keyboard['max_fns']
	);

	// show keyboard info
	$('#kbd-info').popover({
		html: true,
		trigger: 'hover',
		//content: (function() { $('#kbd-info-dymmy').html(); })()
		content: 
			'<strong><span lang="en">Name</span>: </strong>' + keyboard['name'] + '<br/>' +
			'<strong><span lang="en">Description</span>: </strong>' + keyboard['description'] + '<br/>' +
			'<strong><span lang="en">Max Layers</span>: </strong>' + keyboard['max_layers'] + '<br/>' + 
			'<strong><span lang="en">Max Fns</span>: </strong>' + keyboard['max_fns']
	});

	// translate when shown
	$('#kbd-info').on('shown.bs.popover', function() {
		window.lang.run();
	});
}

function initForm(simple_mode) {
	// append layers
	emptyLayers();
	appendLayers(simple_mode);
	
	// clear fns
	emptyFns();

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
	$('.fn-action select').multiselect('rebuild');
	$('.fn-param select').multiselect('rebuild');
}

function updateDownloadButtonState() {
	var empty_count = 0;
	var has_error = false;
	$('.layer').each(function() {
		if (!has_error) {
			if ($(this).hasClass('has-error')) {
				has_error = true;
			}
			if (!$(this).find('textarea').val()) {
				empty_count++;
			}
		}
	});
	var enabled = !has_error && (empty_count < $('.layer').length);
	if (enabled) {
		$('.dl-btn').removeClass('disabled');
	}
	else {
		$('.dl-btn').addClass('disabled');
	}
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

