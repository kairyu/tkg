window.lang = new jquery_lang_js();
var tkg = new TKG();
var keyboard = {};

$(function() {

	showNotification();

	initialize( $('#keyboard-sel:first-child').val() );
	
	$('#keyboard-sel').on('change', function() {
		var name = this.value;
		initialize( name );
	});
	
	// on change
	$('#layer-num').on('change', function() {
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
		var layer_number = id.slice(5);
		var raw_string = $("#" + id).val();
		if (raw_string) {
			tkg.parseLayer(layer_number, raw_string);
		}
	});

	// download
	$('#dl_eep, #dl_h').click(function() {
		var id = $(this).attr('id');
		var type = '';
		var keymaps = [];
		var fn_actions = [];
		console.log(id);

		if ( id == 'dl_eep' ) {
			type = 'eep';
			keymaps = tkg.getKeymapsHex();
			fn_actions = tkg.getFnActionsHex();
		}
		else if ( id == 'dl_h' ) {
			type = 'h';
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

	// initialize touch spin
	$('#layer-num').TouchSpin({
		min: 1,
		max: keyboard['max_layers'],
		boostat: 5,
		stepinterval: 200,
		booster: false
	});

	$('#layer-num').val('2');

	$('#kbd-info').popover('destroy');

	// show keyboard help info
	$('#kbd-info').popover({
		html: true,
		trigger: 'hover',
		content: '<strong><span lang="en">Name: </span></strong>' + keyboard['name'] + '<br/>' +
				'<strong><span lang="en">Description: </span></strong>' + keyboard['description'] + '<br/>' +
				'<strong><span lang="en">Max Layers: </span></strong>' + keyboard['max_layers'] + '<br/>' + 
				'<strong><span lang="en">Max Fns: </span></strong>' + keyboard['max_fns']
	});

	if ( $('.layer').length > 0 )
		$('.layer').remove();

	$('#layer-control').after('<div class="layer form-group">' +
					'<label for="layer0" class="col-md-2 control-label" lang="en">Layer0</label>' +
					'<div class="col-md-5">' +
						'<textarea id="layer0" class="form-control layer-raw" rows="4"></textarea>' +
					'</div>' +
				'</div>' + 
				'<div class="layer form-group">' +
					'<label for="layer1" class="col-md-2 control-label" lang="en">Layer1</label>' +
					'<div class="col-md-5">' +
						'<textarea id="layer1" class="form-control layer-raw" rows="4"></textarea>' +
					'</div>' +
				'</div>' );

	window.lang.run();
}

function loadKeyboard( name ) {
	$.ajaxSetup({ async: false });
	$.getJSON("keyboard/" + name.toLowerCase() + ".json", function(json) {
		keyboard = json;
		tkg.init({
			"keycode_map": keycode_map,
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
