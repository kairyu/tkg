var Programmer = function(object, callback) {
	this._port = null;
	this._detecting = false;
	this._done = null;
	this._fail = null;
	this._device = null;
	this._targetName = '';
	this._bootloader = '';
	this._bootloaderReady = false;
	this._message = callback.message;
	this._heartbeat = callback.heartbeat;
	this._progress = callback.progress;
	this.lastError = null;
	this.setBootloader(object);
	this._heartbeatTask();
	this._heartbeatSuspend = false;
	return this;
};

Programmer.prototype = {
	constructor: Programmer,
	_appIds: [
		'bfocfdombeaehbdbobmeljgofafkbned',
		'clijbellammajbodikfacoomakbhhmpb',
		'kmbmjdabhpdnpeobnbdchihdcdaccidi'
	],
	_APP_URL: 'https://chrome.google.com/webstore/detail/tkg-chrome-app/kmbmjdabhpdnpeobnbdchihdcdaccidi',
	isAvailable: function() {
		return this._port != null;
	},
	needHEX: function() {
		switch (this._bootloader) {
			case "DFU":
				return true;
			case "RawHID":
				return false;
			case "HID":
				return false;
			case "Printer":
				return false;
			case "MassStorage":
				return false;
			default:
				return false;
		}
	},
	setBootloader: function(object) {
		this._bootloader = object["name"] || "";
		switch (this._bootloader) {
			case "DFU":
				this._targetName = object["mcu"] || "";
				break;
			case "RawHID":
				this._targetName = { "mcu": object["mcu"], "vendorId": object["vid"], "productId": object["pid"] };
				break;
			case "HID":
				this._targetName = { "mcu": object["mcu"], "vendorId": object["vid"], "productId": object["pid"] };
				break;
			case "Printer":
				this._targetName = object["printer_name"] || "";
				break;
			case "MassStorage":
				this._targetName = object["volume_label"] || "";
				break;
			default:
				this._targetName = "";
				break;
		}
		if (this._port) {
			this._port.postMessage({ "request": "set", "bootloader": this._bootloader, "target": this._targetName });
		}
	},
	prepare: function(done, fail) {
		if (this._port) {
			this._heartbeatSuspend = true;
			this._done = done;
			this._fail = fail;
			this._port.postMessage({ "request": "get", "name": "bootloader" });
		}
	},
	burnHEX: function(hex, done, fail) {
		if (this._port) {
			this._heartbeatSuspend = true;
			this._done = done;
			this._fail = fail;
			this._port.postMessage({ "request": "reflash", "hex": hex });
		}
	},
	burnEEP: function(hex, eep, done, fail) {
		if (this._port) {
			this._heartbeatSuspend = true;
			this._done = done;
			this._fail = fail;
			if (hex) {
				this._port.postMessage({ "request": "reflash", "hex": hex, "eep": eep });
			}
			else {
				this._port.postMessage({ "request": "reflash", "eep": eep });
			}
		}
	},
	_heartbeatTask: function() {
		var self = this;
		var callback = (typeof self._heartbeat === 'function')? self._heartbeat: function() {};
		if (!self._heartbeatSuspend) {
			if (self._port) {
				try {
					self._port.postMessage({ "request": "device" });
				}
				catch (e) {
					console.log(e);
					console.log("lost connection");
					self._onAppNotFound();
					callback(false);
				}
			}
			if (!self._port) {
				//console.log("detecting");
				//console.log(self._port);
				if (!self._detecting) {
					self._detect(function(found) {
						if (!found) {
							self._onAppNotFound();
						}
						callback(found);
					});
				}
			}
		}
		setTimeout(function() {
			self._heartbeatTask();
		}, 1000);
	},
	_detect: function(callback) {
		var self = this;
		self._detecting = true;
		if (typeof chrome !== 'undefined') {
			// async.js v1.5
			async.detectSeries(self._appIds, function(appId, _callback) {
				chrome.runtime.sendMessage(appId, { "request": "test", "appId": appId }, function(response) {
					//console.log(response);
					_callback(response && response.response == "ok");
				});
			}, function(result) {
				self._detecting = false;
				if (result) {
					if (!self._port) {
						console.log("connected to " + result);
						self._port = chrome.runtime.connect(result);
						self._port.onMessage.addListener(self._onMessage.bind(self));
						self._port.postMessage({ "request": "set", "bootloader": self._bootloader, "target": self._targetName });
					}
					callback.call(self, true);
				}
				else {
					callback.call(self, false);
				}
			});
		}
	},
	_onAppNotFound: function() {
		var self = this;
		self.lastError = new Error("App not found");
		var more = 'Please install the latest version of <b>TKG Chrome App</b> from ' +
			'<a href="' + self._APP_URL + '" target="_blank">Chrome Web Store</a> or ' +
			'download it from <a href="tkg-chrome-app.crx">here</a> and install it manually ' +
			'to activate this feature.';
		self._message(self.lastError.message, "danger", more);
		self._port = null;
	},
	_onMessage: function(msg) {
		if (msg.request != 'device') {
			console.log(msg);
		}
		if (msg) {
			if ("error" in msg) {
				console.error(msg.error);
				this.lastError = new Error(msg.error);
				this._message(this.lastError.message, "danger");
				switch (msg.request) {
					case "set":
						this._bootloaderReady = false;
						break;
					case "get":
					case "flash":
					case "reflash":
						(typeof this._fail === 'function') && this._fail();
						this._fail = null;
						this._heartbeatSuspend = false;
						break;
				}
			}
			else {
				this.lastError = null;
				switch (msg.request) {
					case "progress":
						this._progress(msg.response);
						break;
					case "device":
						var device = msg.response;
						this._device = device;
						if (this._bootloaderReady) {
							if (device) {
								this._message(device, "info");
							}
							else {
								this._message("No devices found", "danger");
							}
						}
						break;
					case "set":
						this._bootloaderReady = true;
						break;
					case "get":
						var data = msg.response;
						console.log("Bootloader Version: 0x" + data.toString(16) + " (" + data + ")");
						(typeof this._done === 'function') && this._done();
						this._done = null;
						this._heartbeatSuspend = false;
						break;
					case "flash":
						//alert("Completed");
						(typeof this._done === 'function') && this._done();
						this._done = null;
						this._heartbeatSuspend = false;
						break;
					case "reflash":
						//alert("Completed");
						(typeof this._done === 'function') && this._done();
						this._done = null;
						this._heartbeatSuspend = false;
						break;
				}
			}
		}
	}
};
