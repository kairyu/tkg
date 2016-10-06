var _fn_clipboard = {};

function clearFns() {
	_fn_clipboard = {};
	emptyFns();
}

function emptyFns() {
	$('#fn-wrapper').empty();
	$('#fn-field').parent().hide();
}

function appendFns() {
	emptyFns();
	var fns = tkg.getFns();
	if (fns.length) {
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
		$('#fn-field').parent().show();
	}
	else {
		$('#fn-field').parent().hide();
	}

	updateToolsMenuState();
}

$.fn.fn = function() {
	return this.each(function() {
		var $row = $(this);
		var id = $row.attr('id');
		var index = Number(id.slice('fn'.length));
		var fn = tkg.getFns(index);
		var action = fn["action"];
		var action_options = tkg.getFnOptions("action");
		if (_keyboard["action_functions"] === undefined) {
			_.each(action_options, function(element) {
				var object = _.findWhere(element, { "value": "ACTION_FUNCTION" });
				if (object) {
					object["disabled"] = true;
				}
			});
		}
		if (_keyboard["action_macros"] === undefined) {
			_.each(action_options, function(element) {
				var object = _.findWhere(element, { "value": "ACTION_MACRO" });
				if (object) {
					object["disabled"] = true;
				}
			});
		}
		$row.removeData();
		$row.data('index', index);
		$row.data('action', action);
		var $action = $('<div>').attr({ "class": "fn-param fn-action" }).append(
			makeSelect({ "id": id + "-action", "class": "multiselect" }, action_options, action)
		);
		$row.empty().append($action);
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
		$row.append(
			$('<div>').attr({ "class": "fn-btn" }).hide().append(
				$('<a>').attr({
					"href": "javascript:void(0)",
					"class": "fn-copy btn btn-xs btn-default"
				}).append(
					$('<span>').attr({ "class": "glyphicon glyphicon-duplicate" })
				),
				$('<a>').attr({
					"href": "javascript:void(0)",
					"class": "fn-paste btn btn-xs btn-default"
				}).append(
					$('<span>').attr({ "class": "glyphicon glyphicon-paste" })
				)
			)
		);
		$row.parent().on('mouseover', function() {
			$(this).find('.fn-btn').show();
		}).on('mouseout', function() {
			$(this).find('.fn-btn').hide();
		});
		$row.on('click', '.fn-copy', function() {
			_fn_clipboard = tkg.getFns($row.data('index'));
		}).on('click', '.fn-paste', function() {
			tkg.setFns($row.data('index'), _fn_clipboard);
			$row.fn();
		});
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
	$action.nextAll('.fn-param').remove();
	var index = $row.data('index');
	var fn = tkg.getFns(index);
	var action = fn["action"];
	if (fn["param"]) {
		var param = fn["param"];
		var args = fn["args"];
		var lr = null;
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
							makeSelect({ "id": id + "-param-layer" }, tkg.getFnOptions("layer"), arg, false)
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
							//makeSelect({ "id": id + "-param-lr", "class": "btn" }, tkg.getFnOptions("lr"), lr)
							function() {
								if (lr) return makeSelect({ "id": id + "-param-lr", "class": "btn" }, tkg.getFnOptions("lr"), lr);
							}()
						).append(
							makeSelect({ "id": id + "-param-mods", "class": "btn", "multiple": "multiple" },
								tkg.getFnOptions("mod"),
								arg,
								true,
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
				case "af_id":
					var options = tkg.getFnOptions("af_id");
					if (options.length) {
						$params = $params.add($('<div>').attr({ "class": "fn-param fn-param-af-id" }).append(
							$('<div>').attr({ "class": "input-group" }).append(
								makeSelect({ "id": id + "-param-af-id" }, options, arg)
							)
						));
					}
					break;
				case "am_id":
					var options = tkg.getFnOptions("am_id");
					if (options.length) {
						$params = $params.add($('<div>').attr({ "class": "fn-param fn-param-am-id" }).append(
							$('<div>').attr({ "class": "input-group" }).append(
								makeSelect({ "id": id + "-param-am-id" }, options, arg)
							)
						));
					}
					break;
			}
		}
		$action.after($params);
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
		if ($row.find('.fn-param-mods select').length == 2) {
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
		}
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
		// af_id param
		$row.find('.fn-param-af-id select').multiselect({
			buttonText: function(options, select) {
				var $selected = $(options[0]);
				return $selected.html() + ' <b class="caret"></b>';
			},
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(option, checked) {
				$row.data('af_id', Number($(option).val()));
				appendFnSubParams(id);
			}
		});
		// am_id param
		$row.find('.fn-param-am-id select').multiselect({
			buttonText: function(options, select) {
				var $selected = $(options[0]);
				return $selected.html() + ' <b class="caret"></b>';
			},
			buttonTitle: function(options, select) {
				var $selected = $(options[0]);
				return $selected.attr('title');
			},
			onChange: function(option, checked) {
				$row.data('am_id', Number($(option).val()));
				appendFnSubParams(id);
			}
		});
		appendFnSubParams(id);
	}
}

function appendFnSubParams(id) {
	var $row = $('#fn-wrapper #' + id);
	var index = $row.data('index');
	var action = $row.data('action');
	var fn = tkg.getFns(index);
	var param = fn["param"];
	var args = fn["args"];
	switch (fn["param"][0]) {
		case 'af_id':
			var af_id = $row.data('af_id');
			var options = tkg.getFnOptions("af_opt")[af_id];
			var af_opt = args[1];
			if (options.length == 0) {
				$row.removeData('af_opt');
			}
			if (af_opt >= options.length) {
				af_opt = 0;
				$row.data('af_opt', af_opt);
			}
			$row.find('.fn-param-af-opt').remove();
			if (options.length) {
				$row.find('.fn-param').last().after($('<div>').attr({ "class": "fn-param fn-param-af-opt" }).append(
					$('<div>').attr({ "class": "input-group" }).append(
						makeSelect({ "id": id + "-param-af-opt" }, options, af_opt)
					)
				));
			}
			break;
	}
	// af_id param
	$row.find('.fn-param-af-opt select').multiselect({
		buttonTitle: function(options, select) {
			var $selected = $(options[0]);
			return $selected.attr('title');
		},
		onChange: function(option, checked) {
			$row.data('af_opt', Number($(option).val()));
			onFnParamsChange(id);
		}
	});
	onFnParamsChange(id);
}

function onFnParamsChange(id) {
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

function makeSelect(attr, data, current, lang, selected) {
	if (arguments.length < 4) {
		lang = true;
	}
	return $('<select>').attr(attr).append(
		(function() {
			function makeOption(data, current, selected) {
				var value;
				var text;
				var disabled = false;
				if (_.isObject(data)) {
					value = data["value"];
					text = data["text"];
					title = data["title"];
					if (data["disabled"]) {
						disabled = true;
					}
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
					"lang": lang ? "en" : undefined,
					"selected": selected.call(selected, value, current)
				}).prop('disabled', disabled).text(text);
			}
			var $options = $();
			for (var index in data) {
				if (_.isArray(data[index])) {
					var $optgroup = $('<optgroup>', { "label": index, "lang": lang ? "en" : undefined });
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

function rebuildFnSelect() {
	$('.fn-param select').multiselect('rebuild');
}
