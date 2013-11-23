window.lang = new jquery_lang_js();

$(function() {

	window.lang.run();

	// initialize touch spin
	$('#layer-num').TouchSpin({
		min: 1,
		max: 8,
		boostat: 5,
		stepinterval: 200,
		booster: false
	});
	
	// on change
	$('#layer-num').on( 'change', function() {
		var count = $('.layer').length;
		var num = $('#layer-num').val();

		// add layers
		if ( num > count ) {
			for ( var i = count + 1; i <= num; i++ ) {
				$('.layer:last').after( 
				'<div class="layer form-group">' +
					'<label for="layer' + (i - 1) + '" class="col-md-2 control-label" lang="en">Layer' + (i - 1) + '</label>' +
					'<div class="col-md-4">' +
						'<textarea id="layer' + (i - 1) + '" class="form-control" rows="4"></textarea>' +
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
});
