var g_parse_error;

function parseRawData(raw_string) {
	// parse raw string to object
	var raw;
	try{
		eval("raw = [" + raw_string + "]");
	} catch (e) {
		console.error("Parsing error:", e);
	}
	console.log(raw);

	// parse object to keys
	var keys = [];
	var c_x = 0;
	var c_y = 0;
	var c_w = 1;
	var c_h = 1;
	if (!(raw instanceof Array)) { return keys; }
	for (var i = 0; i < raw.length; i++) {
		if (!(raw[i] instanceof Array)) { continue; }
		c_x = 0;
		for (var j = 0; j < raw[i].length; j++) {
			var el = raw[i][j];
			if (typeof(el) === 'object') {
				if (el.x) { c_x += el.x; }
				if (j == 0 && el.y) { c_y += el.y; }
				if (el.w) { c_w = el.w; }
				if (el.h) { c_h = el.h; }
			}
			else if (typeof(el) === 'string') {
				var label = parseLabel(el);
				keys.push({
					"label": label,
					"x": c_x,
					"y": c_y,
					"w": c_w,
					"h": c_h
				});
				c_x += c_w;
				c_w = 1;
				c_h = 1;
			}
		}
		c_y += 1;
	}
	return keys;
}

function parseKeycode(keys, keycode_map) {
	if (!(keys instanceof Array)) { return; }
	for (var i = 0; i < keys.length; i++) {
	}
}

function parseLabel(label_string) {
	var strings = label_string.split("\n");
	var label = {};
	if (strings[0]) { label.top = strings[0]; }
	if (strings[1]) { label.bottom = strings[1]; }
	if (strings[2]) { label.top_secondary = strings[2]; }
	if (strings[3]) { label.bottom_secondary = strings[3]; }
	if (strings[4]) { label.side_print = strings[4]; }
	if (strings[5]) { label.side_print_secondary = strings[5]; }
	if (strings[6]) { label.center = strings[6]; }
	if (strings[7]) { label.center_secondary = strings[7]; }
	return label;
}
