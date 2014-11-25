var binding_map = {
	"LEDMAP_NO": {
		"group": "None",
		"name": "None",
		"description": "Binding to nothing",
		"code": 0
	},
	"LEDMAP_DEFAULT_LAYER": {
		"group": "Layer",
		"name": "Bind to default layer",
		"description": "Binding to state of default layer",
		"code": function(layer) {
			return "0x01" + dechex(layer, 2);
		},
		"param": [ "layer" ],
		"default": [ 0 ]
	},
	"LEDMAP_LAYER": {
		"group": "Layer",
		"name": "Bind to layer",
		"description": "Binding to state of layer",
		"code": function(layer) {
			return "0x02" + dechex(layer, 2);
		},
		"param": [ "layer" ],
		"default": [ 0 ]
	},
	"LEDMAP_NUM_LOCK": {
		"group": "Indicator",
		"name": "Num Lock",
		"description": "Indicate state of Num Lock",
		"code": "0x0300"
	},
	"LEDMAP_CAPS_LOCK": {
		"group": "Indicator",
		"name": "Caps Lock",
		"description": "Indicate state of Caps Lock",
		"code": "0x0301"
	},
	"LEDMAP_SCROLL_LOCK": {
		"group": "Indicator",
		"name": "Scroll Lock",
		"description": "Indicate state of Scroll Lock",
		"code": "0x0302"
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

var reverse_map = {
	"LEDMAP_REVERSE": {
		"name": "Reverse",
		"description": "Reverse binding state",
		"code": function(reverse) {
			return 0x1000 * reverse;
		},
		"param": [ "reverse" ],
		"default": [ 0 ]
	}
}

var backlight_map = {
	"LEDMAP_BACKLIGHT": {
		"name": "Backlight",
		"description": "Force on when backlight is on",
		"code": function(backlight) {
			return 0x2000 * backlight;
		},
		"param": [ "backlight" ],
		"default": [ 0 ]
	}
}
