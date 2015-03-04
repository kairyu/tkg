var _tour_version = "1.0";
var _tour_once = false;

$(function() {
	if ($.cookie) {
		if ($.cookie('tkg_tour')) {
			var tour_version = $.cookie('tkg_tour');
			if (versionCompare(tour_version, _tour_version) < 0) {
				$.cookie('tkg_tour', _tour_version, {
					expires: 365,
					path: '/'
				});
				_tour_once = true;
			}
		}
		else {
			$.cookie('tkg_tour', _tour_version, {
				expires: 365,
				path: '/'
			});
			_tour_once = true;
		}
	}

	$('body').on('chardinJs:stop', function() {
		removeTour();
	});
});


function showTour() {
	appendTour();
	$('body').chardinJs('start');
	$(document).click(function() {
		$('body').chardinJs('stop');
	});
}

function appendTour() {
	$('#logo')
		.attr('data-intro', window.lang.translate('Title of this site, aka TKG.'))
		.attr('data-position', 'right');
	$('#keyboard-sel').parent()
		.attr('data-intro', window.lang.translate('1. Select your keyboard here.'))
		.attr('data-position', 'right');
	$('#layer-mode-normal').parent()
		.attr('data-intro', window.lang.translate('2. Select proper layer mode.'))
		.attr('data-position', 'right');
	$('#layer0,#composite-layer')
		.attr('data-intro', window.lang.translate('3. Make your layout at <a href="http://www.keyboard-layout-editor.com" target="_blank">keyboard-layout-editor</a> and paste it here.'))
		.attr('data-position', 'right');
	if ($('#fn-legend').parent().is(':hidden')) {
		$('#fn-legend').parent().data('visible', 'hidden').show();
	}
	$('#fn-legend')
		.attr('data-intro', window.lang.translate('4. Fn settings show here if your layout contains Fn keys.'))
		.attr('data-position', 'bottom');
	$('#dl_eep')
		.attr('data-intro', window.lang.translate('5. Download your keymap.'))
		.attr('data-position', 'bottom');
	$('#tools').parent().addClass('open');
	$('#tools-show-tour').parent()
		.attr('data-intro', window.lang.translate('Show this tour again.'))
		.attr('data-position', 'left');
	$('#tools-import-fn').parent()
		.attr('data-intro', window.lang.translate('You can import and export Fn settings from here.'))
		.attr('data-position', 'bottom');
	$('#change-lan').parent()
		.attr('data-intro', 'Change UI language here.<br>ここで言語を選びます。<br>在此处更改界面语言。')
		.attr('data-position', 'left');
	// fix color
	$('#logo, #change-lan, #tools-show-tour, #tools-import-fn, #fn-legend>span')
		.css('color', 'white');
	// fix z-index issue
	$('.navbar-fixed-top, #tools+.dropdown-menu')
		.css('z-index', 'auto')
		.css('position', 'absolute');
}

function removeTour() {
	if ($('#fn-legend').parent().data('visible') == 'hidden') {
		$('#fn-legend').parent().data('visible', '').hide();
	}
	$('#tools').parent().removeClass('open')
	$('#logo, #change-lan, #tools-show-tour, #tools-import-fn, #fn-legend>span')
		.css('color', '');
	$('.navbar-fixed-top, #tools+.dropdown-menu')
		.css('z-index', '')
		.css('position', '');
}
