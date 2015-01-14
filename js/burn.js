const PRINTER_NAME = "Generic / Text Only"

function qzReady() {
	console.log("QZ Ready");
	updateDownloadButtonState();
	$('#qz_div').css('visibility', 'hidden');
}

function ConfirmQZ() {
	var qz = document.getElementById('qz');
	if (qz) {
		try {
			qz.getVersion();
		}
		catch (e) {
			return false;
		}
		return true;
	}
	return false;
}

function PreparePostData(id) {
	var keymaps = [];
	var fn_actions = [];
	var leds = [];

	if (id == 'burn_eep') {
		type = 'eep';
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
	if (id == 'burn_eep' && _keyboard['led_count']) {
		_keyboard["additional"][_keyboard["led_additional_index"]]["data"] = leds;
		has_additional = true;
	}
	if (has_additional) {
		post_data["additional"] = _keyboard["additional"];
	}

	return post_data;
}

function BurnFile(id) {
	var $qz = $('#qz');
	if ($qz.length == 0) {
		return;
	}

	changeBurnButtonPending();
	$qz.qzFindPrinter(PRINTER_NAME, function() {
		if (this.getPrinter()) {
			if (id == 'burn_eep') {
				var post_data = PreparePostData(id);
				$.post("download.php?file=eep", post_data, function(data) {
					console.log(data);
					$qz.qzAppend(data, function() {
						$qz.qzPrint(function() {
							console.log("burn eep done");
							setTimeout(changeBurnButtonReady, 1000);
						});
					});
				}).fail(function(d, textStatus, error) {
					console.error("post failed, status: " + textStatus + ", error: "+error)
				});
			}
			else if (id == 'burn_hex') {
				var result = parseKeyboardName(_keyboard["name"]);
				var main = result["main"];
				var variant = result["variant"];
				var url = "keyboard/firmware/" + main;
				if (variant) {
					url += "-" + variant;
				}
				url += ".hex";
				$.get(url, function(data) {
					console.log(data);
					$qz.qzAppend(data, function() {
						$qz.qzPrint(function() {
							console.log("burn hex done");
							setTimeout(changeBurnButtonReady, 1000);
						});
					});
				}).fail(function(d, textStatus, error) {
					console.error("get failed, status: " + textStatus + ", error: "+error)
				});
			}
			else {
				changeBurnButtonReady();
			}
		}
		else {
			alert('"' + PRINTER_NAME + '" not found.');
			changeBurnButtonReady();
		}
	});
}

function appendBurnButton() {
	if ($('.burn-btn').length == 0) {
		$('#dl_eep').parent().prepend(
			$('<button>').attr({
				"id": "burn_eep",
				"type": "button",
				"class": "dl-btn burn-btn btn btn-default",
			}).append(
				$('<i>').attr({ "id": "burn_icon" }),
				" ",
				$('<span>').attr({ "lang": "en" }).text("Burn"),
				" .eep ",
				$('<span>').attr({ "lang": "en" }).text("file")
			)
		).append(
			$('<div>').attr({ "id": "qz_div" }).append(
				$('<applet>').attr({
					"id": "qz",
					"name": "QZ Print Plugin",
					"code": "qz.PrintApplet.class",
					"archive": "./qz-print.jar",
					"width": "14",
					"height": "16"
				}).append(
					$('<param>').attr({ "name": "jnlp_href", "value": "qz-print_jnlp.jnlp" }),
					$('<param>').attr({ "name": "printer", "value": PRINTER_NAME })
				)
			)
		).on('click', '.burn-btn', function() {
			BurnFile($(this).attr('id'));
		});
		changeBurnButtonReady();
		$('#qz_div').offset($('#burn_icon').offset());
	}
}

function removeBurnButton() {
	if ($('.burn-btn').length) {
		$('.burn-btn').remove();
		$('#qz_div').remove();
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
		if (ConfirmQZ()) {
			$burn_btn.removeClass("disabled");
		}
	}
}

function changeBurnButtonEEP() {
	var $burn_btn = $('.burn-btn');
	if ($burn_btn.length && !$burn_btn.data("pending")) {
		var html = $burn_btn.html();
		$burn_btn.html(html.replace(".hex", ".eep")).attr("id", "burn_eep");
		if (!ConfirmQZ() || $burn_btn.is(".btn-default,.btn-danger")) {
			$burn_btn.addClass("disabled");
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

$.fn.qzGetPrinter = function() {
	return this[0].getPrinter();
};

$.fn.qzFindPrinter = function(name, done) {
	return this.each(function() {
		var self = this;
		self.findPrinter(name);
		window['qzDoneFinding'] = function() {
			done.apply(self);
			window["qzDoneFinding"] = null;
		};
	});
};

$.fn.qzAppend = function(data, done) {
	return this.each(function() {
		var self = this;
		this.append(data);
		done.apply(self);
	});
};

$.fn.qzAppendFile = function(name, done) {
	return this.each(function() {
		var self = this;
		this.appendFile(name);
		window['qzDoneAppending'] = function() {
			done.apply(self);
			window["qzDoneAppending"] = null;
		};
	});
};

$.fn.qzPrint = function(done) {
	return this.each(function() {
		this.print();
		window["qzDonePrinting"] = function() {
			done.apply(this);
			window["qzDonePrinting"] = null;
		};
	});
};
