function emptyFns() {
	$('#fn-wrapper').empty();
}

function appendFns() {
	emptyFns();
	var fns = tkg.getFns();
	for (var index in fns) {
		var fn = fns[index];
		$('#fn-wrapper').append(
			$('<div>').attr({ "class": "form-group"  }).append(
				$('<label>').attr({ "for": "fn" + index + "-action", "class": "col-md-2 control-label" }).text("Fn" + index)
			).append(
				$('<div>').attr({ "id": "fn" + index, "class": "fn-row col-md-10" })
			)
		);
	}
	$('#fn-wrapper .fn-row').fn();
}

$.fn.fn = function() {
	return this.each(function() {
		var $row = $(this);
		var id = $row.attr('id');
		var index = Number(id.slice(2));
		var fn = tkg.getFns(index);
		var action = fn["action"];
		$row.removeData();
		$row.data('index', index);
		$row.data('action', action);
		var $action = $('<div>').attr({ "class": "fn-action" }).append(
			makeSelect({ "id": id + "-action", "class": "multiselect" }, tkg.getFnOptions("action"), action)
		);
		$row.empty().append($action);
		window.lang.run();
		$row.find('.fn-action select').multiselect({
			buttonText: function(options, select) {
				var $selected = $(options[0]);
				var group = $selected.parent().attr('label');
				var value = $selected.attr('value');
				return (value != 'ACTION_NO' ? '<span lang="en">' + group + '</span> > ' : '') +
					'<span lang="en">' + $selected.text() + '</span> <b class="caret"></b>';
			},
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(element, checked) {
				$row.data('action', $(element).val());
				onFnActionChange(id);
			},
		});
		onFnActionChange(id);
	});
}

function onFnActionChange(id) {
	var $row = $('#fn-wrapper #' + id);
	var index = $row.data('index');
	var action = $row.data('action');
	$row.removeData();
	$row.data('index', index);
	$row.data('action', action);
	tkg.setFns(index, {
		"action": action
	});
	appendFnParams(id);
}

function appendFnParams(id) {
	var $row = $('#fn-wrapper #' + id);
	var $action = $row.find('.fn-action');
	$action.nextAll().remove();
	var index = $row.data('index');
	var fn = tkg.getFns(index);
	var action = fn["action"];
	if (fn["param"]) {
		var param = fn["param"];
		var args = fn["args"];
		var lr;
		var $params = $();
		for (var i = 0; i < param.length; i++) {
			var arg = args[i];
			$row.data(param[i], arg);
			switch (param[i]) {
				case "layer":
					$params = $params.add($('<div>').attr({ "class": "fn-param fn-param-layer" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("layer")
						).append(
							makeSelect({ "id": id + "-param-layer" }, tkg.getFnOptions("layer"), arg)
						)
					));
					break;
				case "on":
					$params = $params.add($('<div>').attr({ "class": "fn-param fn-param-on" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("when")
						).append(
							makeSelect({ "id": id + "-param-on" }, tkg.getFnOptions("on"), arg)
						)
					));
					break;
				case "lr":
					lr = arg;
					continue;
				case "mods":
					$params = $params.add($('<div>').attr({ "class": "fn-param fn-param-mods" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("modifier")
						).append(
							makeSelect({ "id": id + "-param-lr", "class": "btn" }, tkg.getFnOptions("lr"), lr)
						).append(
							makeSelect({ "id": id + "-param-mods", "class": "btn", "multiple": "multiple" },
								tkg.getFnOptions("mod"),
								arg,
								function(value, current) { return _.indexOf(current, value) != -1; }
							)
						)
					));
					break;
				case "key":
					$params = $params.add($('<div>').attr({ "class": "fn-param fn-param-key" }).append(
						$('<div>').attr({ "class": "input-group btn-group" }).append(
							$('<span>').attr({ "class": "input-group-addon", "lang": "en" }).text("key")
						).append(
							makeSelect({ "id": id + "-param-key" }, tkg.getFnOptions("key"), arg)
						)
					));
					break;
			}
		}
		$row.append($params);
		window.lang.run();
		// layer param
		$row.find('.fn-param-layer select').multiselect({
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(option, checked) {
				$row.data('layer', $(option).val());
				onFnParamsChange(id);
			}
		});
		// on param
		$row.find('.fn-param-on select').multiselect({
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(option, checked) {
				$row.data('on', $(option).val());
				onFnParamsChange(id);
			}
		});
		// lr param
		$row.find('.fn-param-mods select:first').multiselect({
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(option, checked) {
				$row.data('lr', $(option).val());
				onFnParamsChange(id);
			}
		});
		// mods param
		$row.find('.fn-param-mods select:last').multiselect({
			buttonText: function(options, select) {
				if (options.length == 0) {
					return '<span lang="en">None</span> <b class="caret"></b>';
				}
				else {
					var selected = '';
					options.each(function() {
						selected += $(this).attr('title') + '+';
					});
					return selected.substr(0, selected.length - 1) + ' <b class="caret"></b>';
				}
			},
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			afterChange: function() {
				window.lang.run();
			},
			onChange: function(option, checked) {
				var mods = [];
				this.$select.find('option:selected').each(function() {
					mods.push($(this).val());
				});
				$row.data('mods', mods);
				onFnParamsChange(id);
			}
		});
		// key param
		$row.find('.fn-param-key select').multiselect({
			enableCaseInsensitiveFiltering: true,
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(option, checked) {
				$row.data('key', $(option).val());
				onFnParamsChange(id);
			}
		});
		onFnParamsChange(id);
	}
}

function onFnParamsChange(id) {
	window.lang.run();
	var $row = $('#fn-wrapper #' + id);
	var index = $row.data('index');
	var action = $row.data('action');
	var fn = tkg.getFns(index);
	var param = fn["param"];
	var args = [];
	for (var i = 0; i < param.length; i++) {
		args.push($row.data(param[i]));
	}
	tkg.setFns(index, {
		"action": action,
		"args": args
	});
}

function makeSelect(attr, data, current, selected) {
	return $('<select>').attr(attr).append(
		(function() {
			function makeOption(data, current, selected) {
				var value;
				var text;
				if (_.isObject(data)) {
					value = data["value"];
					text = data["text"];
					title = data["title"];
				}
				else {
					value = data;
					text = data;
					title = data;
				}
				if (!_.isFunction(selected)) {
					selected = function(value, current) {
						return value == current;
					};
				}
				return $('<option>').attr({
					"value": value,
					"title": title,
					"lang": "en",
					"selected": selected.call(selected, value, current)
				}).text(text);
			}
			var $options = $();
			for (var index in data) {
				if (_.isArray(data[index])) {
					var $optgroup = $('<optgroup>', { "label": index, "lang": "en" });
					var $sub_options = $();
					for (var i = 0; i < data[index].length; i++) {
						$sub_options = $sub_options.add(makeOption(data[index][i], current, selected));
					}
					$optgroup.append($sub_options);
					$options = $options.add($optgroup);
				}
				else {
					$options = $options.add(makeOption(data[index], current, selected));
				}
			}
			return $options;
		})());
}

function rebuildSelect() {
	$('.fn-action select').multiselect('rebuild');
	$('.fn-param select').multiselect('rebuild');
}
