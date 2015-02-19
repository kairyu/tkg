var BootloaderDfu = function(object) {
	this._targetName = object["mcu"] || "";
	this._div = null;
	this._flop = null;
	return this;
};

BootloaderDfu.prototype.appendTo = function(selector, ready) {
	if ($(selector).length) {
		var self = this;
		window["flopInit"] = function(success) {
			self._div.css('visibility', 'hidden');
			ready.apply(self, [ success ]);
			window["flopInit"] = null;
		};
		this._flop = $('<applet>').attr({
			"id": "flop",
			"name": "Flop Plugin",
			"code": ".",
			"archive": "./plugin/flop.jar",
			"width": "14",
			"height": "16",
			"border": "0"
		}).append(
			$('<param>').attr({ "name": "jnlp_href", "value": "./plugin/flop_jnlp.jnlp" })
		);
		this._div = $('<div>').attr({
			"id": "flop_div",
			"style": "position: absolute;"
		}).append(this._flop);
		$(selector).append(this._div);
	}
};

BootloaderDfu.prototype.moveTo = function(top, left) {
	if (this._div && this._div.length) {
		this._div.offset({ top: top, left: left } );
	}
};

BootloaderDfu.prototype.remove = function() {
	if (this._div && this._div.length) {
		this._div.remove();
		this._div = null;
		this._flop = null;
	}
};

BootloaderDfu.prototype.isAvailable = function() {
	if (this._flop && this._flop.length) {
		try {
			this._flop.flopSetTarget(this._targetName);
		}
		catch (e) {
			return false;
		}
		return true;
	}
	return false;
};

BootloaderDfu.prototype.prepare = function(done, fail) {
	if (this._flop && this._flop.length) {
		this._flop.flopSetDebug(200);
		if (this._flop.flopGet() >= 0) {
			done.apply(this);
		}
		else {
			alert("No device present");
			fail.apply(this);
		}
	}
	else {
		fail.apply(this);
	}
};

BootloaderDfu.prototype.burnHEX = function(hex, done, fail) {
	if (!this._flop.flopErase()) {
		fail.apply(this);
		return;
	}
	if (!this._flop.flopFlash(hex)) {
		fail.apply(this);
		return;
	}
	if (!this._flop.flopReset()) {
		fail.apply(this);
		return;
	}
	done.apply(this);
};

BootloaderDfu.prototype.needHEX = function() {
	return true;
};

BootloaderDfu.prototype.burnEEP = function(hex, eep, done, fail) {
	if (!this._flop.flopErase()) {
		fail.apply(this);
		return;
	}
	if (!this._flop.flopFlash(hex)) {
		fail.apply(this);
		return;
	}
	if (!this._flop.flopFlashEEPROM(eep)) {
		fail.apply(this);
		return;
	}
	if (!this._flop.flopReset()) {
		fail.apply(this);
		return;
	}
	done.apply(this);
};

$.fn.flopSetDebug = function(debug) {
	return this[0].setDebug(debug);
};

$.fn.flopSetTarget = function(name) {
	return this[0].setTarget(name);
};

$.fn.flopGet = function(name) {
	if (arguments.length) {
		return this[0].get(name);
	}
	else {
		return this[0].get();
	}
};

$.fn.flopErase = function() {
	var result = this[0].erase();
	return (result == this[0].SUCCESS) || (result == this[0].ERASE_ALREADY_BLANK);
};

$.fn.flopFlash = function(hex) {
	return (this[0].flash(hex) == this[0].SUCCESS);
};

$.fn.flopFlashEEPROM = function(hex) {
	return (this[0].flashEEPROM(hex) == this[0].SUCCESS);
};

$.fn.flopReset = function() {
	return (this[0].reset() == this[0].SUCCESS);
};
