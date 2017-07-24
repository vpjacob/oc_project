apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:22px;');
	};

	$("#back").bind("click", function() {
		api.closeWin();
	});
	$('#toBuy').click(function() {
		api.openWin({
			name : 'juicingInfo',
			url : 'juicingInfo.html',
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	})
};
