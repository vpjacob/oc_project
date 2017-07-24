var nowli = '<li><div class="item-content"><div class="item-inner"><div class="item-title">\"[title]\"</div></div>' + '</div><div class="guide"><span>\"[direction]\"</span></div></li>';
var nowli1 = '<li><div class="item-content"><div class="item-inner"><div class="item-title">\"[title]\"</div></div>' + '</div><div style="background-color:#0eaae0;color:#fff;" class="guide"><span>起</span></div></li>';
var nowli2 = '<li><div class="item-content"><div class="item-inner"><div class="item-title">\"[title]\"</div></div>' + '</div><div style="background-color:red;color:#fff;" class="guide"><span>终</span></div></li>';
var detail;
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}

	$("#back").bind("click", function() {
		api.closeWin();
	});
	$('#name').html(api.pageParam.name);
	if (api.pageParam.mon) {
		$('#mon').html(api.pageParam.mon);
	} else {
		$('#costMonAll').css('visibility','hidden');
	}
	detail = api.pageParam.detail;
	$('#ul').append(setLi(detail));
}
function setLi(info) {
	var length = info.length;
	var newsResult = "";
	for (var i = 0; i < length; i++) {
		if (i == 0) {
			var result = nowli1.replace("\"[title]\"", info[i].description);
		} else if (i == length - 1) {
			var result = nowli2.replace("\"[title]\"", info[i].description);
		} else {
			var result = nowli.replace("\"[title]\"", info[i].description);
			if (info[i].description.indexOf('左转') >= 0) {
				result = result.replace("\"[direction]\"", '↶');
			} else if (info[i].description.indexOf('右转') >= 0) {
				result = result.replace("\"[direction]\"", '↷');
			} else if (info[i].description.indexOf('直行') >= 0) {
				result = result.replace("\"[direction]\"", '↑');
			} else if (info[i].description.indexOf('左前方') >= 0) {
				result = result.replace("\"[direction]\"", '↖');
			} else if (info[i].description.indexOf('右前方') >= 0) {
				result = result.replace("\"[direction]\"", '↗');
			} else {
				result = result.replace("\"[direction]\"", '↑');
			}
		}
		newsResult += result;
	}
	return newsResult;
}

