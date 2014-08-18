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
			return 1 + layer;
		},
		"param": [ "layer" ],
		"default": [ 0 ]
	},
	"LEDMAP_LAYER": {
		"group": "Layer",
		"name": "Bind to layer",
		"description": "Binding to state of layer",
		"code": function(layer) {
			return 33 + layer;
		},
		"param": [ "layer" ],
		"default": [ 0 ]
	},
	"LEDMAP_NUM_LOCK": {
		"group": "Indicator",
		"name": "Num Lock",
		"description": "Indicate state of Num Lock",
		"code": 65
	},
	"LEDMAP_CAPS_LOCK": {
		"group": "Indicator",
		"name": "Caps Lock",
		"description": "Indicate state of Caps Lock",
		"code": 66
	},
	"LEDMAP_SCROLL_LOCK": {
		"group": "Indicator",
		"name": "Scroll Lock",
		"description": "Indicate state of Scroll Lock",
		"code": 67
	}
}

var backlight_map = {
	"LEDMAP_BACKLIGHT": {
		"name": "Backlight",
		"description": "Backlight",
		"code": function(backlight) {
			return 0x80 * backlight;
		},
		"param": [ "backlight" ],
		"default": [ 0 ]
	}
}
