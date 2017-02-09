var led_map = {
	"LEDMAP_ACTIVE_LOW": {
		"name": "Active Low",
		"description": "",
		"code": function(binding, reverse, backlight) {
			if (reverse != 0) {
				reverse = 0x1000;
			}
			if (backlight != 0) {
				backlight = 0x2000;
			}
			console.log(binding);
			return "0x" + dechex(backlight + reverse + binding, 4);
		},
		"param": [ "binding", "reverse", "backlight" ],
		"default": [ "LEDMAP_BINDING_NO", 0, 0 ]
	},
	"LEDMAP_ACTIVE_HIGH": {
		"name": "Active High",
		"description": "",
		"code": function(binding, reverse, backlight) {
			if (reverse != 0) {
				reverse = 0x1000;
			}
			if (backlight != 0) {
				backlight = 0x2000;
			}
			return "0x" + dechex(0x4000 + backlight + reverse + binding, 4);
		},
		"param": [ "binding", "reverse", "backlight" ],
		"default": [ "LEDMAP_BINDING_NO", 0, 0 ]
	},
	"LEDMAP_RGB_LED": {
		"name": "RGB LED",
		"description": "",
		"code": function(led_count) {
			return "0x80" + dechex(led_count, 2);
		},
		"param": [ "led_count" ],
		"default": [ 16 ]
	}
}

var binding_map = {
	"LEDMAP_BINDING_NO": {
		"group": "None",
		"name": "None",
		"description": "Binding to nothing",
		"code": 0
	},
	"LEDMAP_BINDING_DEFAULT_LAYER": {
		"group": "Layer",
		"name": "Default layer",
		"description": "Binding to state of default layer",
		"code": function(layer) {
			layer = Number(layer);
			if (layer < 0) {
				layer = 0;
			}
			if (layer > 31) {
				layer = 31;
			}
			return 0x0100 + layer;
		},
		"param": [ "layer" ],
		"default": [ 0 ]
	},
	"LEDMAP_BINDING_LAYER": {
		"group": "Layer",
		"name": "Layer",
		"description": "Binding to state of layer",
		"code": function(layer) {
			layer = Number(layer);
			if (layer < 0) {
				layer = 0;
			}
			if (layer > 31) {
				layer = 31;
			}
			return 0x0200 + layer;
		},
		"param": [ "layer" ],
		"default": [ 0 ]
	},
	"LEDMAP_BINDING_INDICATOR": {
		"group": "Indicator",
		"name": "Indicator",
		"description": "Binding to state of indicator",
		"code": function(ind) {
			ind = Number(ind);
			if (ind < 0) {
				ind = 0;
			}
			if (ind > 2) {
				ind = 2;
			}
			return 0x0300 + ind;
		},
		"param": [ "ind" ],
		"default": [ "LEDMAP_NUM_LOCK" ]
	}
}

var ind_map = {
	"LEDMAP_NUM_LOCK": {
		"name": "Num Lock",
		"description": "Indicate state of Num Lock",
		"code": 0
	},
	"LEDMAP_CAPS_LOCK": {
		"name": "Caps Lock",
		"description": "Indicate state of Caps Lock",
		"code": 1
	},
	"LEDMAP_SCROLL_LOCK": {
		"name": "Scroll Lock",
		"description": "Indicate state of Scroll Lock",
		"code": 2
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
