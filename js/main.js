window.lang = new jquery_lang_js();
var tkg = new TKG();
var keyboard = {};

$(function() {

	window.lang.run();

	function loadKeyboard(name) {
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

	loadKeyboard("GH60");

	// initialize touch spin
	$('#layer-num').TouchSpin({
		min: 1,
		max: 8,
		boostat: 5,
		stepinterval: 200,
		booster: false
	});
	
	$('#keyboard-sel').on('change', function() {
		var name = this.value;
		loadKeyboard(name);
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
					'<div class="col-md-4">' +
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

	// show keyboard help info
	$('#kbd-info').tooltip({
		placement: 'right',
		title:	'Name:' +
				'Description:' +
				'Max Layers:' +
				'Max Fns:'
	});

	$('#layer-form').on('blur', 'textarea', function(event) {
		var id = event.target.id;
		var layer_number = id.slice(5);
		var raw_string = $("#" + id).val();
		if (raw_string) {
			tkg.parseLayer(layer_number, raw_string);
		}
	});

});
