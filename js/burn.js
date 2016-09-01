var _programmer = null;
var _firmware = "";
var _step = {};

function BurnFile(id) {
	if (!_programmer) {
		return;
	}

	changeBurnButtonPending();
	setProgress("Waiting for device...", 'info', -1);
	showProgress();
	_programmer.prepare(function() {
		setTimeout(function() {
			if (id == 'burn_eep') {
				setProgress("Preparing files...", 'info', -1);
				getEEP(function(eep) {
					console.log(eep);
					if (_programmer.needHEX()) {
						_step = {
							totalSteps: 2,
							currentStep: 0,
							messages: [ "Burning .hex file", "Burning .eep file" ]
						};
						getHEX(function(hex) {
							_programmer.burnEEP(hex, eep, _onBurnFileDone, _onBurnFileFail);
						});
					}
					else {
						_step = {
							totalSteps: 1,
							currentStep: 0,
							messages: [ "Burning .eep file" ]
						};
						_programmer.burnEEP(null, eep, _onBurnFileDone, _onBurnFileFail);
					}
				});
			}
			else if (id == 'burn_hex') {
				setProgress("Preparing files...", 'info', -1);
				getHEX(function(hex) {
					_step = {
						totalSteps: 1,
						currentStep: 0,
						messages: [ "Burning .hex file" ]
					};
					console.log(hex);
					_programmer.burnHEX(hex, _onBurnFileDone, _onBurnFileFail);
				});
			}
			else {
				closeProgress();
				changeBurnButtonReady();
			}
		}, 100);
	}, function() {
		setProgress(100, "Device is not ready", 'danger');
		closeProgress();
		changeBurnButtonReady();
	});
}

function _onProgrammerProgress(progress) {
	setProgress(null, null, progress);
	if (_step && progress == 0) {
		if (_step.currentStep < _step.totalSteps) {
			setTimeout(function() {
				setProgress(_step.currentStep + '/' + _step.totalSteps + " " + _step.messages[_step.currentStep - 1] + "...", 'info', 0);
			}, 100);
			_step.currentStep++;
		}
	}
}

function _onBurnFileDone() {
	setProgress("Completed.", 'success', -1);
	closeProgress(function() {
		setTimeout(changeBurnButtonReady, 100);
	});
}

function _onBurnFileFail() {
	setProgress("Unknown error.", 'danger', 0);
	closeProgress(function() {
		setTimeout(changeBurnButtonReady, 100);
	});
}

function preparePostData(type) {
	var keymaps = [];
	var fn_actions = [];
	var leds = [];

	if (type == 'eep') {
		keymaps = tkg.getKeymapsHex();
		fn_actions = tkg.getFnActionsHex();
		leds = tkg.getLedsHex();
	}

	var post_data = {
		"matrix_rows": _keyboard["matrix_rows"],
		"matrix_cols": _keyboard["matrix_cols"],
		"matrix_size": _keyboard["matrix_size"],
		"max_layers": _keyboard["max_layers"],
		"max_fns": _keyboard["max_fns"],
		"eep_size": _keyboard["eep_size"],
		"eep_start": _keyboard["eep_start"],
		"keymaps": JSON.stringify(keymaps),
		"fn_actions": JSON.stringify(fn_actions)
	};

	var has_additional = false;
	if (type == 'eep' && _keyboard['led_count']) {
		_keyboard["additional"][_keyboard["led_additional_index"]]["data"] = leds;
		has_additional = true;
	}
	if (has_additional) {
		post_data["additional"] = JSON.stringify(_keyboard['additional']);
	}

	return post_data;
}

function getEEP(done) {
	var post_data = preparePostData('eep');
	$.post("download.php?file=eep", post_data, function(data) {
		done.apply(this, [ data ]);
	}).fail(function(d, textStatus, error) {
		console.error("post failed, status: " + textStatus + ", error: "+error)
	});
}

function getHEX(done) {
	if (_firmware["hex"]) {
		done.apply(this, [ _firmware["hex"] ]);
		return;
	}
	var result = parseKeyboardName(_keyboardName);
	var main = result["main"];
	var variant = result["variant"];
	var url = "keyboard/firmware/" + main;
	if (variant) {
		url += "-" + variant;
	}
	if (_firmware["name"]) {
		url += "-" + normalizeString(_firmware["name"]);
	}
	url += ".hex";
	$.get(url, function(data) {
		done.apply(this, [ data ]);
	}).fail(function(d, textStatus, error) {
		console.error("get failed, status: " + textStatus + ", error: "+error)
	});
}

function appendBurnButton(bootloaders, firmwares) {
	if (typeof chrome === 'undefined') {
		// Only support chrome at this moment
		return;
	}
	if ($('#burn_btn').length == 0) {
		$('#dl_eep').parent().prepend(
			$('<div>').attr({
				"id": "burn_btn",
				"class": "btn-group"
			}).append(
				$('<button>').attr({
					"id": "burn_eep",
					"type": "button",
					"class": "dl-btn burn-btn btn btn-default disabled"
				}).append(
					$('<i>').attr({ "id": "burn_icon" }),
					" ",
					$('<span>').attr({ "lang": "en" }).text("Burn .eep file")
				)
				,
				$('<button>').attr({
					"type": "button",
					"class": "dl-btn btn btn-default dropdown-toggle",
					"data-toggle": "dropdown",
					"aria-expanded": "false"
				}).append(
					$('<span>').attr({ "class": "caret" }),
					$('<span>').attr({ "class": "sr-only" }).text("Toggle Dropdown")
				),
				$('<ul>').attr({ "id": "burn_dropdown", "class": "dropdown-menu", "role": "menu" })
			)
		).on('click', '.burn-btn', function() {
			BurnFile($(this).attr('id'));
		});
		changeBurnButtonReady();

		$('#burn_btn').on('click', '#burn_dropdown a.burn_bootloader', function() {
			selectBootloader(this);
		}).on('click', '#burn_dropdown a.burn_firmware', function(e) {
			e.preventDefault();
			selectFirmware(this);
		});

		$('#burn_btn').popover({
			html: true,
			trigger: 'manual',
			placement: 'top',
			content: '<span class="text-info" lang="en"></span><br/>' +
				'<span class="burn-message-tooltip" lang="en">Open dropdown for more information.</span>'
		});
	}

	$('#burn_dropdown').empty();

	$('#burn_dropdown').append($('<li>').append(
		$('<a>').attr({
			"id": "burn_message",
			"href": "javascript:void(0)"
		}).append(
			$('<i>').attr({
				"class": "glyphicon glyphicon-info-sign",
				"style": "visibility:hidden;"
			}),
			$('<span>').attr({
				"class": "text-info",
				"lang": "en"
			}).text('')
		)
	));

	$('#burn_dropdown').append($('<li>').attr({
		"role": "presentation",
		"class": "dropdown-header",
		"lang": "en"
	}).text("Bootloader"));
	for (var i = 0; i < bootloaders.length; i++) {
		$('#burn_dropdown').append($('<li>').append(
			$('<a>').attr({
				"class": "burn_bootloader",
				"href": "javascript:void(0)"
			}).append(
				$('<i>').attr({
					"class": "glyphicon glyphicon-ok",
					"style": "visibility:hidden;"
				}),
				" ",
				$('<span>').attr({
					"lang": "en"
				}).text(bootloaders[i]["name"])
			).data("param", bootloaders[i])
		));
	}

	$('#burn_dropdown').append(
		$('<li>').attr({
			"role": "presentation",
			"class": "dropdown-header",
			"lang": "en"
		}).text("Firmware"),
		$('<li>').append(
			$('<a>').attr({
				"class": "burn_firmware",
				"href": "javascript:void(0)"
			}).append(
				$('<i>').attr({
					"class": "glyphicon glyphicon-ok",
					"style": "visibility:hidden;"
				}),
				" ",
				$('<span>').attr({
					"lang": "en",
				}).text("Default")
			).data("param", "")
		)
	);
	if (firmwares) {
		for (var i = 0; i < firmwares.length; i++) {
			$('#burn_dropdown').append($('<li>').append(
				$('<a>').attr({
					"class": "burn_firmware",
					"href": "javascript:void(0)"
				}).append(
					$('<i>').attr({
						"class": "glyphicon glyphicon-ok",
						"style": "visibility:hidden;"
					}),
					" ",
					$('<span>').attr({
						"lang": "en"
					}).text(firmwares[i]["name"])
				).data("param", firmwares[i])
			));
		}
	}
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		$('#burn_dropdown').append(
			$('<li>').append(
				$('<a>').attr({
					"id": "burn_firmware_custom",
					"class": "burn_firmware",
					"href": "javascript:void(0)"
				}).append(
					$('<i>').attr({
						"class": "glyphicon glyphicon-ok",
						"style": "visibility:hidden;"
					}),
					" ",
					$('<span>').attr({
						"lang": "en"
					}).text("Custom")
				).data("param", { "name": "Custom" }),
				$('<input>').attr({
					"id": "input_firmware_custom",
					"type": "file",
					"style": "visibility:hidden; position:absolute;"
				})
			)
		);
	}

	selectBootloader($('#burn_dropdown a.burn_bootloader:first'));
	selectFirmware($('#burn_dropdown a.burn_firmware:first'));
}

function selectBootloader(a) {
	var $a = $(a);
	$('#burn_dropdown .burn_bootloader i').css('visibility', 'hidden');
	$a.find('i').css('visibility', 'visible');
	if (!_programmer) {
		_programmer = new Programmer($a.data("param"), {
			"message": _onProgrammerMessage,
			"heartbeat": _onProgrammerHeartbeat,
			"progress": _onProgrammerProgress
		});
	}
	else {
		_programmer.setBootloader($a.data("param"));
	}
}

function _onProgrammerMessage(msg, cls, more) {
	var $burn_btn = $('.burn-btn');
	var $burn_msg = $('#burn_message');
	if (msg) {
		if (msg && msg != $burn_msg.data('message')) {
			$burn_msg.data('message', msg);
			$burn_msg.find('span').remove();
			$burn_msg.append($('<span>').attr({
				"class": "text-" + cls,
				"lang": "en"
			}).text(msg));
			$burn_msg.show();
			$burn_btn.parent().popover('destroy');
			if (cls == 'danger') {
				setTimeout(function() {
					$burn_btn.parent().popover({
						html: true,
						trigger: 'hover',
						placement: 'top',
						content: '<span class="text-' + cls + '" lang="en">' + msg + '</span><br/>' +
							'<span class="burn-message-tooltip" lang="en">Open dropdown for more information.</span>'
					});
				}, 200);
				if (!$burn_btn.data('error')) {
					$burn_btn.data('error', true);
					updateBurnButton();
				}
			}
			else {
				if ($burn_btn.data('error')) {
					$burn_btn.data('error', false);
					updateBurnButton();
				}
			}
			$('#burn_message_more').remove();
			if (more) {
				$burn_msg.tooltip({
					html: true,
					trigger: 'hover',
					placement: 'right',
					title: '<span class="burn-message-tooltip" lang="en">Click for more information.</span>'
				}).show();
				$burn_msg.unbind('click').on('click', function() {
					$('#burn_message_more').modal('show');
				});
				$('body').append(
					$('<div>').attr({
						"id": "burn_message_more",
						"class": "modal fade",
						"tabindex": "-1",
						"role": "dialog"
					}).append(
						$('<div>').attr({ "class": "modal-dialog" }).append(
							$('<div>').attr({ "class": "modal-content" }).append(
								$('<div>').attr({
									"class": "modal-header"
								}).append(
									$('<button>').attr({
										"type": "button",
										"class": "close",
										"data-dismiss": "modal",
										"aria-label": "Close"
									}).html('<span aria-hidden="true">&times;</span>'),
									$('<h4>').attr({
										"class": "modal-title",
										"lang": "en"
									}).text("Burn")
								),
								$('<div>').attr({
									"class": "modal-body",
									"lang": "en"
								}).html(more),
								$('<div>').attr({
									"class": "modal-footer"
								}).append(
									$('<button>').attr({
										"type": "button",
										"class": "btn btn-default",
										"data-dismiss": "modal",
										"lang": "en"
									}).text("Close")
								)
							)
						)
					)
				);
			}
			else {
				$burn_msg.tooltip('destroy');
				$burn_msg.unbind('click');
			}
		}
	}
	else {
		if (!msg && msg != $burn_msg.data()) {
			$burn_msg.data('message', msg);
			$burn_msg.find('span').remove();
			$burn_msg.hide();
			$burn_msg.tooltip('destroy');
			$burn_btn.parent().popover('destroy');
			if ($burn_btn.data('error')) {
				$burn_btn.data('error', false);
				updateBurnButton();
			}
		}
	}
}

function _onProgrammerHeartbeat(alive) {
	var $burn_btn = $('.burn-btn');
	if ($burn_btn.data('alive') != alive) {
		$burn_btn.data('alive', alive);
		updateBurnButton();
	}
}

function selectFirmware(a) {
	var $a = $(a);
	if ($a.attr('id') == 'burn_firmware_custom') {
		var $input = $('#input_firmware_custom');
		$input.trigger('click').change(function() {
			var file = $(this).prop('files')[0];
			if (file) {
				var reader = new FileReader();
				reader.onload = function(event) {
					if (event.target.readyState == FileReader.DONE) {
						_firmware = $a.data("param");
						_firmware["hex"] = event.target.result;
						console.log(event.target.result);
						$('#burn_dropdown .burn_firmware i').css('visibility', 'hidden');
						$a.find('i').css('visibility', 'visible');
					}
				}
				reader.readAsText(file, "utf-8");
			}
		});
	}
	else {
		$('#burn_dropdown .burn_firmware i').css('visibility', 'hidden');
		$a.find('i').css('visibility', 'visible');
		_firmware = $a.data("param");
	}
}

function removeBurnButton() {
	if (_programmer) {
		_programmer = null;
	}
	if ($('#burn_btn').length != 0) {
		$('#burn_btn').remove();
	}
}

function changeBurnButtonPending() {
	if (!$('.burn-btn').data("pending")) {
		$('.burn-btn').data("pending", true);
		updateBurnButton();
	}
}

function changeBurnButtonReady() {
	if ($('.burn-btn').data("pending")) {
		$('.burn-btn').data("pending", false);
		updateBurnButton();
	}
}

function changeBurnButtonHEX() {
	if ($('.burn-btn').data("file") != "hex") {
		$('.burn-btn').data("file", "hex").attr("id", "burn_hex");
		updateBurnButton();
	}
}

function changeBurnButtonEEP() {
	if ($('.burn-btn').data("file") != "eep") {
		$('.burn-btn').data("file", "eep").attr("id", "burn_eep");
		updateBurnButton();
	}
}

function updateBurnButton() {
	var $container = $('#burn_btn');
	var $button = $('.burn-btn');
	var $icon = $('#burn_icon');
	var $text = $('.burn-btn span');
	var pending = $button.data('pending');
	var alive = $button.data('alive');
	var error = $button.data('error');
	var file = $button.data('file');
	var icon = '';
	var disabled = false;
	if (alive) {
		if (pending) {
			icon = 'pending';
			disabled = true;
		}
		else {
			icon = 'normal';
			disabled = false;
		}
		if (error) {
			disabled = true;
		}
	}
	else {
		icon = 'dead';
		disabled = true;
	}
	if (!pending) {
		var text = $text.text() || '';
		if (file == 'hex') {
			$text.text(text.replace(".eep", ".hex"));
		}
		else {
			$text.text(text.replace(".hex", ".eep"));
			if ($button.is(".btn-default,.btn-danger")) {
				disabled = true;
			}
		}
	}
	switch (icon) {
		case 'pending':
			if (!$icon.is('.fa-spinner')) {
				$('#burn_icon').removeAttr("class").addClass("fa fa-spinner spin");
			}
			break;
		case 'dead':
			if (!$icon.is('.glyphicon-ban-circle')) {
				$('#burn_icon').removeAttr("class").addClass("glyphicon glyphicon-ban-circle");
			}
			break;
		default:
			if (!$icon.is('.glyphicon-fire')) {
				$('#burn_icon').removeAttr("class").addClass("glyphicon glyphicon-fire");
			}
			break;
	}
	if (disabled) {
		$button.addClass('disabled');
	}
	else {
		$button.removeClass('disabled');
	}
}
