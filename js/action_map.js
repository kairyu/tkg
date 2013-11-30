var action_map = {
	"ACTION_NO": {
		"description": "",
		"code": "0x0000"
	},
	"ACTION_TRANSPARENT": {
		"description": "",
		"code": "0x0001"
	},
	"ACTION_KEY": {
		"description": "Send key",
		"code": function(key) {
			return "0x00" + dechex(key, 2);
		},
		"param": [ "key" ]
	},
	"ACTION_MODS": {
		"description": "Send modifier",
		"code": function(mods, lr) {
			if (lr) {
				return "0x01" + dechex(mods & 0xF);
			}
			else {
				return "0x00" + dechex(mods & 0xF);
			}
		},
		"param": [ "mods", "lr" ]
	},
	"ACTION_MODS_KEY": {
		"description": "Send modifier and key",
		"code": function(key, mods, lr) {
			if (lr) {
				return "0x01" + dechex(mods & 0xF) + dechex(key, 2);
			}
			else {
				return "0x00" + dechex(mods & 0xF) + dechex(key, 2);
			}
		},
		"param": [ "key", "mods", "lr" ]
	},
	"ACTION_DEFAULT_LAYER_SET": {
		"description": "Set default layer",
		"code": function(layer) {
			if (validLayer(layer)) {
				return "0x8C" + dechex((layer / 4) << 1) + dechex(1 << (layer % 4));
			}
			else {
				return "";
			}
		},
		"param": [ "layer" ]
	},
	"ACTION_LAYER_CLEAR": {
		"description": "Clear state of all layers",
		"code": function(on) {
			if (validOn(on)) {
				return "0x8" + on + "00";
			}
		},
		"param": [ "on" ]
	},
	"ACTION_LAYER_MOMENTARY": {
		"description": "Turn layer momentarily on",
		"code": function(layer) {
			if (layer >= 0 && layer < 16) {
				return "0xA" + dechex(layer) + "F1";
			}
			else if (layer < 32) {
				layer -= 16;
				return "0xB" + dechex(layer) + "F1";
			}
			else {
				return "";
			}
		},
		"param": [ "layer" ]
	},
	"ACTION_LAYER_TOGGLE": {
		"description": "Turn layer on/off",
		"code": function(layer) {
			if (validLayer(layer)) {
				return "0x8A" + dechex((layer / 4) << 1) + dechex(1 << (layer % 4));
			}
			else {
				return "";
			}
		},
		"param": [ "layer" ]
	},
	"ACTION_LAYER_INVERT": {
		"description": "Invert current state of layer",
		"code": function(layer, on) {
			if (validLayer(layer) && validOn(on)) {
				return "0x8" + dechex(8 + on) + dechex((layer / 4) << 1) + dechex(1 << (layer % 4));
			}
			else {
				return "";
			}
		},
		"param": [ "layer", "on" ]
	},
	"ACTION_LAYER_ON": {
		"description": "Turn layer on",
		"code": function(layer, on) {
			if (validLayer(layer) && validOn(on)) {
				return "0x8" + dechex(4 + on) + dechex((layer / 4) << 1) + dechex(1 << (layer % 4));
			}
			else {
				return "";
			}
		},
		"param": [ "layer", "on" ]
	},
	"ACTION_LAYER_OFF": {
		"description": "Turn layer off",
		"code": function(layer, on) {
			if (validLayer(layer) && validOn(on)) {
				return "0x8" + dechex(0 + on) + dechex((layer / 4) << 1) + dechex(15 - (1 << (layer % 4)));
			}
			else {
				return "";
			}
		},
		"param": [ "layer", "on" ]
	},
	"ACTION_LAYER_SET": {
		"description": "Turn on layer only",
		"code": function (layer) {
			if (validLayer(layer)) {
				return "0x8" + dechex(12 + on) + dechex((layer / 4) << 1) + dechex(1 << (layer % 4));
			}
			else {
				return "";
			}
		},
		"param": [ "layer" ]
	},
	"ACTION_LAYER_ON_OFF": {
		"description": "Turn on layer on press and turn off on release",
		"code": function (layer) {
			if (layer >= 0 && layer < 16) {
				return "0xA" + dechex(layer) + "F1";
			}
			else if (layer < 32) {
				layer -= 16;
				return "0xB" + dechex(layer) + "F1";
			}
			else {
				return "";
			}
		},
		"param": [ "layer" ]
	},
	"ACTION_LAYER_OFF_ON": {
		"description": "Turn off layer on press and turn on on release",
		"code": function (layer) {
			if (layer >= 0 && layer < 16) {
				return "0xA" + dechex(layer) + "F2";
			}
			else if (layer < 32) {
				layer -= 16;
				return "0xB" + dechex(layer) + "F2";
			}
			else {
				return "";
			}
		},
		"param": [ "layer" ]
	},
	"ACTION_LAYER_SET_CLEAR": {
		"description": "Set layer state on press and clear on release",
		"code": function (layer) {
			if (layer >= 0 && layer < 16) {
				return "0xA" + dechex(layer) + "F3";
			}
			else if (layer < 32) {
				layer -= 16;
				return "0xB" + dechex(layer) + "F3";
			}
			else {
				return "";
			}
		},
		"param": [ "layer" ]
	},
	"ACTION_BACKLIGHT_INCREASE": {
		"description": "Increase backlight brightness",
		"code": "0xD000"
	},
	"ACTION_BACKLIGHT_DECREASE": {
		"description": "Decrease backlight brightness",
		"code": "0xD001"
	},
	"ACTION_BACKLIGHT_TOGGLE": {
		"description": "Turn backlight on/off",
		"code": "0xD002"
	},
	"ACTION_BACKLIGHT_STEP": {
		"description": "Step through backlight levels",
		"code": "0xD003"
	}
}

function dechex(dec, pad) {
	var hex = Number(dec).toString(16).toUpperCase();
	pad = typeof(pad) === "undefined" || pad == null ? pad = 1 : pad;
	while (hex.length < pad) {
		hex = "0" + hex;
	}
	return hex;
}

function validLayer(layer) {
	return (layer >= 0 && layer < 32);
}

function validOn(on) {
	return (on >= 1 && on <= 3);
}
