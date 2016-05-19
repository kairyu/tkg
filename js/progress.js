function showProgress() {
	var $progress = $('#progress-dialog');
	$progress.modal('show');
}

function setProgress(msg, cls, value) {
	var $progress_msg = $('#progress_msg');
	var $progress_bar = $('#progress_bar');
	if (msg) {
		$progress_msg.empty().append(
			$('<p>').append(
				$('<span>').attr({
					"class": "text-" + cls,
					"lang": "en"
				}).text(msg)
			)
		);
	}
	if (cls) {
		$progress_bar.removeClass('progress-bar-success progress-bar-info progress-bar-warning progress-bar-danger')
			.addClass('progress-bar-' + cls);
	}
	if (arguments.length > 2) {
		if (value < 0 || value > 100) {
			$progress_bar.data('value', value);
			$progress_bar.css('transition', 'none');
			$progress_bar.width('100%');
			$progress_bar.css('transition', '');
			//$progress_bar.addClass('active');
		}
		else {
			value = Math.ceil(value / 10) * 10;
			if (value != $progress_bar.data('value')) {
				$progress_bar.data('value', value);
				if (value) {
					$progress_bar.css('transition', '');
				}
				else {
					$progress_bar.css('transition', 'none');
				}
				$progress_bar.width(value + '%');
				//$progress_bar.removeClass('active');
			}
		}
	}
}

function closeProgress(callback) {
	setTimeout(function() {
		$('#progress-dialog').modal('hide');
		callback && callback();
	}, 2000);
}
