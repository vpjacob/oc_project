apiready = function() {
	//关闭指定window，若待关闭的window不在最上面，则无动画
	api.closeWin({
		name : 'equipment_index'
	});
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}

	$("#back").bind("click", function() {
		api.closeWin();
	});
	$("#add").bind("click", function() {
		api.openWin({//添加设备
			name : 'equipmentType',
			url : 'equipmentType.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
		
	});

};
