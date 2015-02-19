var BootloaderPrinter = function(object) {
	this._printer_name = object["printer_name"] || "";
	this._div = null;
	this._qz = null;
	return this;
};

BootloaderPrinter.prototype.appendTo = function(selector, ready) {
	if ($(selector).length) {
		var self = this;
		window["qzReady"] = function() {
			self._div.css('visibility', 'hidden');
			ready.apply(self);
			window["qzReady"] = null;
		};
		this._qz = $('<applet>').attr({
			"id": "qz",
			"name": "QZ Print Plugin",
			"code": "qz.PrintApplet.class",
			"archive": "./plugin/qz-print.jar",
			"width": "14",
			"height": "16",
			"border": "0"
		}).append(
			$('<param>').attr({ "name": "jnlp_href", "value": "./plugin/qz-print_jnlp.jnlp" }),
			$('<param>').attr({ "name": "printer", "value": this._printer_name })
		);
		this._div = $('<div>').attr({
			"id": "qz_div",
			"style": "position: absolute;"
		}).append(this._qz);
		$(selector).append(this._div);
	}
};

BootloaderPrinter.prototype.moveTo = function(top, left) {
	if (this._div && this._div.length) {
		this._div.offset({ top: top, left: left } );
	}
};

BootloaderPrinter.prototype.remove = function() {
	if (this._div && this._div.length) {
		this._div.remove();
		this._div = null;
		this._qz = null;
	}
};

BootloaderPrinter.prototype.isAvailable = function() {
	if (this._qz && this._qz.length) {
		try {
			this._qz.qzGetVersion();
		}
		catch (e) {
			return false;
		}
		return true;
	}
	return false;
};

BootloaderPrinter.prototype.prepare = function(done, fail) {
	var self = this;
	if (this._qz && this._qz.length) {
		this._qz.qzFindPrinter(this._printer_name, function() {
			if (this.getPrinter()) {
				done.apply(self);
			}
			else {
				alert('"' + self._printer_name + '" not found.');
				fail.apply(self);
			}
		});
	}
	else {
		fail.apply(this);
	}
};

BootloaderPrinter.prototype.burnHEX = function(hex, done) {
	this._print(hex, done);
};

BootloaderPrinter.prototype.needHEX = function() {
	return false;
};

BootloaderPrinter.prototype.burnEEP = function(eep, done) {
	this._print(eep, done);
};

BootloaderPrinter.prototype._print = function(data, done) {
	var self = this;
	self._qz.qzAppend(data, function() {
		self._qz.qzPrint(function() {
			done.apply(self);
		});
	});
};

$.fn.qzGetVersion = function() {
	return this[0].getVersion();
};

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
