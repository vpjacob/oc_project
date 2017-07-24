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
	api.showProgress();
	api.ajax({
		url : rootUrl + '/api/commmonweal/getExcitationList',
		method : 'post'
	}, function(ret, err) {
		api.hideProgress();
		console.log($api.jsonToStr(ret));
		if (ret) {
			if (ret.execStatus == "true") {
				var result=ret.formDataset;
				$("#lingshou12").html(result.lingshou12beansum);
				$("#lingshou24").html(result.lingshou24beansum);
				$("#lingshouTotal").html((Number(result.lingshou12beansum)+Number(result.lingshou24beansum)).toFixed(2));
				$("#pifa6").html(result.pifa6beansum);
				$("#pifa12").html(result.pifa12beansum);
				$("#pifa24").html(result.pifa24beansum);
				$("#pifaTotal").html((Number(result.pifa6beansum)+Number(result.pifa12beansum)+Number(result.pifa24beansum)).toFixed(2));
			} else {
				api.hideProgress();
				api.toast({
					msg : "数据请求失败，请重试"
				});
			}
		} else {
			api.hideProgress();
			api.toast({
				msg : "数据请求失败，请重试"
			});
		}
	});
}; 