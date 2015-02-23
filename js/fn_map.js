var action_map = {
	"ACTION_NO": {
		"group": "None",
		"name": "None",
		"description": "No action",
		"code": "0x0000"
	},
	/*
	"ACTION_TRANSPARENT": {
		"description": "",
		"code": "0x0001"
	},
	*/
	"ACTION_KEY": {
		"group": "Key action",
		"name": "Normal key",
		"description": "Send key",
		"code": function(key) {
			return "0x00" + keyCode(key);
		},
		"param": [ "key" ],
		"default": [ "KC_NO" ]
	},
	"ACTION_MODS": {
		"group": "Key action",
		"name": "Modifier key",
		"description": "Send modifier",
		"code": function(lr, mods) {
			if (lrCode(lr)) {
				return "0x1" + dechex(modsCode(mods) & 0xF) + "00";
			}
			else {
				return "0x0" + dechex(modsCode(mods) & 0xF) + "00";
			}
		},
		"param": [ "lr", "mods" ],
		"default": [ "LR_LEFT", [] ]
	},
	"ACTION_MODS_KEY": {
		"group": "Key action",
		"name": "Modified key",
		"description": "Send modifier and key",
		"code": function(lr, mods, key) {
			if (lrCode(lr)) {
				return "0x1" + dechex(modsCode(mods) & 0xF) + keyCode(key);
			}
			else {
				return "0x0" + dechex(modsCode(mods) & 0xF) + keyCode(key);
			}
		},
		"param": [ "lr", "mods", "key" ],
		"default": [ "LR_LEFT", [], "KC_NO" ]
	},
	"ACTION_DEFAULT_LAYER_SET": {
		"group": "Layer action",
		"name": "Set default",
		"description": "Set default layer",
		"code": function(layer) {
			if (validLayer(layer)) {
				return "0x8C" + dechex((layer / 4) << 1) + dechex(1 << (layer % 4));
			}
			else {
				return "";
			}
		},
		"param": [ "layer" ],
		"default": [ 0 ]
	},
	"ACTION_LAYER_MOMENTARY": {
		"group": "Layer action",
		"name": "Momentary",
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
		"param": [ "layer" ],
		"default": [ 1 ]
	},
	"ACTION_LAYER_TOGGLE": {
		"group": "Layer action",
		"name": "Toggle",
		"description": "Turn layer on/off",
		"code": function(layer) {
			if (validLayer(layer)) {
				return "0x8A" + dechex((layer / 4) << 1) + dechex(1 << (layer % 4));
			}
			else {
				return "";
			}
		},
		"param": [ "layer" ],
		"default": [ 1 ]
	},
	"ACTION_LAYER_ON": {
		"group": "Layer action",
		"name": "On",
		"description": "Turn layer on",
		"code": function(layer, on) {
			if (validLayer(layer) && validOn(on)) {
				return "0x8" + dechex(4 + onCode(on)) + dechex((layer / 4) << 1) + dechex(1 << (layer % 4));
			}
			else {
				return "";
			}
		},
		"param": [ "layer", "on" ],
		"default": [ 1, "ON_RELEASE" ]
	},
	"ACTION_LAYER_OFF": {
		"group": "Layer action",
		"name": "Off",
		"description": "Turn layer off",
		"code": function(layer, on) {
			if (validLayer(layer) && validOn(on)) {
				return "0x8" + dechex(0 + onCode(on)) + dechex((layer / 4) << 1) + dechex(15 - (1 << (layer % 4)));
			}
			else {
				return "";
			}
		},
		"param": [ "layer", "on" ],
		"default": [ 1, "ON_RELEASE" ]
	},
	"ACTION_LAYER_SET": {
		"group": "Layer action",
		"name": "Set",
		"description": "Turn on layer only",
		"code": function (layer, on) {
			if (validLayer(layer) && validOn(on)) {
				return "0x8" + dechex(12 + onCode(on)) + dechex((layer / 4) << 1) + dechex(1 << (layer % 4));
			}
			else {
				return "";
			}
		},
		"param": [ "layer", "on" ],
		"default": [ 1, "ON_RELEASE" ]
	},
	"ACTION_MODS_TAP_KEY": {
		"group": "Key advanced action",
		"name": "Dual role modifier",
		"description": "Works as modifier when holding, but registers normal key when tapping",
		"code": function(lr, mods, key) {
			if (lrCode(lr)) {
				return "0x3" + dechex(modsCode(mods) & 0xF) + keyCode(key);
			}
			else {
				return "0x2" + dechex(modsCode(mods) & 0xF) + keyCode(key);
			}
		},
		"param": [ "lr", "mods", "key" ],
		"default": [ "LR_LEFT", [], "KC_NO" ]
	},
	"ACTION_MODS_ONESHOT": {
		"group": "Key advanced action",
		"name": "Oneshot modifier",
		"description": "Workds as normal modifier key when holding down, while oneshot modifier when tapping",
		"code": function(lr, mods) {
			if (lrCode(lr)) {
				return "0x3" + dechex(modsCode(mods) & 0xF) + "00";
			}
			else {
				return "0x2" + dechex(modsCode(mods) & 0xF) + "00";
			}
		},
		"param": [ "lr", "mods" ],
		"default": [ "LR_LEFT", [] ]
	},
	"ACTION_MODS_TAP_TOGGLE": {
		"group": "Key advanced action",
		"name": "Tap toggle modifier",
		"description": "Works as a momentary modifier when holding, but toggles on with several taps",
		"code": function(lr, mods) {
			if (lrCode(lr)) {
				return "0x3" + dechex(modsCode(mods) & 0xF) + "01";
			}
			else {
				return "0x2" + dechex(modsCode(mods) & 0xF) + "01";
			}
		},
		"param": [ "lr", "mods" ],
		"default": [ "LR_LEFT", [] ]
	},
	"ACTION_LAYER_CLEAR": {
		"group": "Layer advanced action",
		"name": "Clear all",
		"description": "Clear state of all layers",
		"code": function(on) {
			if (validOn(on)) {
				return "0x8" + onCode(on) + "00";
			}
		},
		"param": [ "on" ],
		"default": [ "ON_RELEASE" ]
	},
	"ACTION_LAYER_INVERT": {
		"group": "Layer advanced action",
		"name": "Invert",
		"description": "Invert current state of layer",
		"code": function(layer, on) {
			if (validLayer(layer) && validOn(on)) {
				return "0x8" + dechex(8 + onCode(on)) + dechex((layer / 4) << 1) + dechex(1 << (layer % 4));
			}
			else {
				return "";
			}
		},
		"param": [ "layer", "on" ],
		"default": [ 1, "ON_PRESS" ]
	},
	"ACTION_LAYER_ON_OFF": {
		"group": "Layer advanced action",
		"name": "On then off",
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
		"param": [ "layer" ],
		"default": [ 1 ]
	},
	"ACTION_LAYER_OFF_ON": {
		"group": "Layer advanced action",
		"name": "Off then on",
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
		"param": [ "layer" ],
		"default": [ 1 ]
	},
	"ACTION_LAYER_SET_CLEAR": {
		"group": "Layer advanced action",
		"name": "Set then clear",
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
		"param": [ "layer" ],
		"default": [ 1 ]
	},
	"ACTION_LAYER_TAP_KEY": {
		"group": "Layer advanced action",
		"name": "Dual-role send key",
		"description": "Turns on layer momentary while holding, but registers key on tap (press and release quickly)",
		"code": function (layer, key) {
			if (layer >= 0 && layer < 16) {
				return "0xA" + dechex(layer) + keyCode(key);
			}
			else if (layer < 32) {
				layer -= 16;
				return "0xB" + dechex(layer) + keyCode(key);
			}
			else {
				return "";
			}
		},
		"param": [ "layer", "key" ],
		"default": [ 1, "KC_NO" ]
	},
	"ACTION_LAYER_TAP_TOGGLE": {
		"group": "Layer advanced action",
		"name": "Dual-role toggle layer",
		"description": "Turns on layer momentary while holding and toggles it with serial taps",
		"code": function (layer) {
			if (layer >= 0 && layer < 16) {
				return "0xA" + dechex(layer) + "F0";
			}
			else if (layer < 32) {
				layer -= 16;
				return "0xB" + dechex(layer) + "F0";
			}
			else {
				return "";
			}
		},
		"param": [ "layer" ],
		"default": [ 1 ]
	},
	"ACTION_BACKLIGHT_INCREASE": {
		"group": "Backlight action",
		"name": "Increase",
		"description": "Increase backlight brightness",
		"code": "0xD000"
	},
	"ACTION_BACKLIGHT_DECREASE": {
		"group": "Backlight action",
		"name": "Decrease",
		"description": "Decrease backlight brightness",
		"code": "0xD001"
	},
	"ACTION_BACKLIGHT_TOGGLE": {
		"group": "Backlight action",
		"name": "Toggle",
		"description": "Turn backlight on/off",
		"code": "0xD002"
	},
	"ACTION_BACKLIGHT_STEP": {
		"group": "Backlight action",
		"name": "Step",
		"description": "Step through backlight levels",
		"code": "0xD003"
	},
	"ACTION_MACRO": {
		"group": "Others",
		"name": "Built-in macro",
		"description": "Built-in macro (key sequence) in firmware",
		"code": function(id, opt) {
			if (opt >= 0 && opt < 16 && id >= 0 && id < 255) {
				return "0xC" + dechex(opt) + dechex(id, 2);
			}
			else {
				return "";
			}
		},
		"param": [ "am_id", "am_opt" ],
		"default": [ 0, 0 ]
	},
	"ACTION_FUNCTION": {
		"group": "Others",
		"name": "Built-in function",
		"description": "Built-in functions in firmware",
		"code": function(id, opt) {
			if (opt >= 0 && opt < 16 && id >= 0 && id < 255) {
				return "0xF" + dechex(opt) + dechex(id, 2);
			}
			else {
				return "";
			}
		},
		"param": [ "af_id", "af_opt" ],
		"default": [ 0, 0 ]
	}
}

function keyCode(key) {
	return keycode_map[key]["keycode"].slice(2);
}

function modsCode(mods) {
	var code = 0;
	for (var i = 0; i < mods.length; i++) {
		code |= mod_map[mods[i]]["code"];
	}
	return code;
}

function lrCode(lr) {
	return lr_map[lr]["code"];
}

function onCode(on) {
	return on_map[on]["code"];
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
	return (onCode(on) >= 1 && onCode(on) <= 3);
}

var lr_map = {
	"LR_LEFT": {
		"name": "Left",
		"description": "Left",
		"code": 0
	},
	"LR_RIGHT": {
		"name": "Right",
		"description": "Right",
		"code": 1
	}
}

var mod_map = {
	"MOD_CTL": {
		"name": "Ctrl",
		"description": "Ctrl",
		"code": 1,
		"fullname": "MOD_CTRL"
	},
	"MOD_SFT": {
		"name": "Shift",
		"description": "Shift",
		"code": 2,
		"fullname": "MOD_SHIFT"
	},
	"MOD_ALT": {
		"name": "Alt",
		"description": "Alt",
		"code": 4
	},
	"MOD_GUI": {
		"name": "GUI",
		"description": "Win/Command/Meta",
		"code": 8
	}
}

var on_map = {
	"ON_PRESS": {
		"name": "Press",
		"description": "On pressing key",
		"code": 1
	},
	"ON_RELEASE": {
		"name": "Release",
		"description": "On releasing key",
		"code": 2
	},
	"ON_BOTH": {
		"name": "Both",
		"description": "On both pressing and releasing",
		"code": 3
	}
}
