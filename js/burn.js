var _bootloader = null;

function BurnFile(id) {
	if (!_bootloader) {
		return;
	}

	changeBurnButtonPending();
	_bootloader.prepare(function() {
		if (id == 'burn_eep') {
			getEEP(function(eep) {
				console.log(eep);
				if (_bootloader.needHEX()) {
					getHEX(function(hex) {
						_bootloader.burnEEP(hex, eep, function() {
							console.log("burn eep done");
							setTimeout(changeBurnButtonReady, 1000);
						}, function() {
							alert("Unknown error");
						});
					});
				}
				else {
					_bootloader.burnEEP(eep, function() {
						console.log("burn eep done");
						setTimeout(changeBurnButtonReady, 1000);
					}, function() {
						alert("Unknown error");
					});
				}
			});
		}
		else if (id == 'burn_hex') {
			getHEX(function(hex) {
				console.log(hex);
				_bootloader.burnHEX(hex, function() {
					console.log("burn hex done");
					setTimeout(changeBurnButtonReady, 1000);
				}, function() {
					alert("Unknown error");
				});
			});
		}
		else {
			changeBurnButtonReady();
		}
	}, function() {
		changeBurnButtonReady();
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
	var result = parseKeyboardName(_keyboard["name"]);
	var main = result["main"];
	var variant = result["variant"];
	var url = "keyboard/firmware/" + main;
	if (variant) {
		url += "-" + variant;
	}
	url += ".hex";
	$.get(url, function(data) {
		done.apply(this, [ data ]);
	}).fail(function(d, textStatus, error) {
		console.error("get failed, status: " + textStatus + ", error: "+error)
	});
}

function appendBurnButton(bootloaders) {
	if ($('#burn_btn').length == 0) {
		$('#dl_eep').parent().prepend(
			$('<div>').attr({ "id": "burn_btn", "class": "btn-group" }).append(
				$('<button>').attr({
					"id": "burn_eep",
					"type": "button",
					"class": "dl-btn dl-btn-restrict burn-btn btn btn-default disabled",
				}).append(
					$('<i>').attr({ "id": "burn_icon" }),
					" ",
					$('<span>').attr({ "lang": "en" }).text("Burn"),
					" .eep ",
					$('<span>').attr({ "lang": "en" }).text("file")
				),
				$('<button>').attr({
					"type": "button",
					"class": "dl-btn btn btn-default dropdown-toggle",
					"data-toggle": "dropdown",
					"aria-expanded": "false"
				}).append(
					$('<span>').attr({ "class": "caret" }),
					$('<span>').attr({ "class": "sr-only" }).text("Toogle Dropdown")
				),
				$('<ul>').attr({ "id": "bootloader_list", "class": "dropdown-menu", "role": "menu" }).append(
					$('<li>').attr({
						"role": "presentation",
						"class": "dropdown-header"
					}).text("Bootloader")
				)
			)
		).on('click', '.burn-btn', function() {
			BurnFile($(this).attr('id'));
		});
		window.lang.run();
		changeBurnButtonReady();

		for (var i = 0; i < bootloaders.length; i++) {
			$('#bootloader_list').append($('<li>').append(
				$('<a>').attr({
					"href": "javascript:void(0)"
				}).append(
					$('<i>').attr({
						"class": "glyphicon glyphicon-ok",
						"style": "visibility:hidden;"
					}),
					" " + bootloaders[i]["name"]
				).data("param", bootloaders[i])
			));
		}
		$('#btns').on('click', '#bootloader_list a', function() {
			selectBootloader(this);
		});

		selectBootloader($('#bootloader_list a:first'));
	}
}

function selectBootloader(a) {
	var $a = $(a);
	$('#bootloader_list i').css('visibility', 'hidden');
	$a.find('i').css('visibility', 'visible');
	return initBootloader($a.data("param"));
}

function initBootloader(object) {
	if (_bootloader) {
		_bootloader.remove();
	}
	switch (object["name"]) {
		case "Printer":
			_bootloader = new BootloaderPrinter(object);
			break;
		case "DFU":
			_bootloader = new BootloaderDfu(object);
			break;
		default:
			_bootloader = null;
			break;
	}
	if (_bootloader) {
		_bootloader.appendTo($('.burn-btn').parent(), function() {
			console.log("plugin ready");
			updateDownloadButtonState();
		});
		_bootloader.moveTo($('#burn_icon').offset().top - 1, $('#burn_icon').offset().left);
		return true;
	}
	return false;
}

function removeBurnButton() {
	if (_bootloader) {
		_bootloader.remove();
	}
	if ($('#burn_btn').length != 0) {
		$('#burn_btn').remove();
	}
}

function changeBurnButtonPending() {
	$('.burn-btn').data("pending", true).addClass("disabled");
	$('#burn_icon').removeAttr("class").addClass("fa fa-spinner spin");
}

function changeBurnButtonReady() {
	$('#burn_icon').removeAttr("class").addClass("glyphicon glyphicon-fire");
	if ($('.burn-btn').data("pending")) {
		$('.burn-btn').data("pending", false);
		switch ($('.burn-btn').data("file")) {
			case "eep":
				changeBurnButtonEEP();
				break;
			case "hex":
				changeBurnButtonHEX();
				break;
		}
	}
}

function changeBurnButtonHEX() {
	var $burn_btn = $('.burn-btn');
	if ($burn_btn.length && !$burn_btn.data("pending")) {
		var html = $burn_btn.html();
		$burn_btn.html(html.replace(".eep", ".hex")).attr("id", "burn_hex");
		if (!_bootloader.isAvailable()) {
			$burn_btn.addClass("disabled");
		}
		else {
			$burn_btn.removeClass("disabled");
		}
	}
}

function changeBurnButtonEEP() {
	var $burn_btn = $('.burn-btn');
	if ($burn_btn.length && !$burn_btn.data("pending")) {
		var html = $burn_btn.html();
		$burn_btn.html(html.replace(".hex", ".eep")).attr("id", "burn_eep");
		if (!_bootloader.isAvailable() || $burn_btn.is(".btn-default,.btn-danger")) {
			$burn_btn.addClass("disabled");
		}
		else {
			$burn_btn.removeClass("disabled");
		}

	}
}

$(window).keydown(function(e) {
	if (e.keyCode == 16) {
		$('.burn-btn').data("file", "hex");
		changeBurnButtonHEX();
	}
});

$(window).keyup(function(e) {
	if (e.keyCode == 16) {
		$('.burn-btn').data("file", "eep");
		changeBurnButtonEEP();
	}
});
