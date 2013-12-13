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
