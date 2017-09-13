var urId = '';
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	var roomId = api.pageParam.id;
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
	$("#back").bind("click", function() {
		api.closeWin();
	});
	//门锁
	$('#lock').bind("click",function() {
		api.openWin({
			name : 'lock',
			url : 'lock.html',
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//门禁
	$('#entranceGuard').bind("click",function() {
		api.openWin({
			name : 'entranceGuard.html',
			url : 'entranceGuard.html',
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//牙刷
	$('#toothbrush').bind("click",function() {
		api.openWin({
			name : 'toothbrush.html',
			url : 'toothbrush.html',
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	
	//榨汁机
	$('#juicing').bind("click",function() {
		api.openWin({
			name : 'juicing.html',
			url : 'juicing.html',
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
};

