apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	//
//	$('#test').click(function(){
//		api.openWin({
//			name : 'myPay',
//			url : 'myPay.html',
//			slidBackEnabled : true,
//			animation : {
//				type : "push", //动画类型（详见动画类型常量）
//				subType : "from_right", //动画子类型（详见动画子类型常量）
//				duration : 300 //动画过渡时间，默认300毫秒
//			}
//		})
//	});
	//支付记录
	$('#payRecord').click(function(){
		api.openWin({
			name : 'payRecord',
			url : 'payRecord.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		})
	});
	$('#scanId').click(function(){
		var scanner = api.require('scanner');
		scanner.open(function(ret, err) {
			if (ret) {
				var content = ret.msg.split(",");
				api.openWin({//详情界面
					name : 'myPay',
					url : 'myPay.html',
					slidBackEnabled : true,
					animation : {
						type : "push", //动画类型（详见动画类型常量）
						subType : "from_right", //动画子类型（详见动画子类型常量）
						duration : 300 //动画过渡时间，默认300毫秒
					},
					pageParam : {
						merchantNo : content[0],
						merchantName : content[1],
						type : content[2]
					}
				});

			} else {
				api.alert({
					msg : "扫描失败！" + JSON.stringify(err)
				});
			}
		});
	});
}
function goBack() {
	api.closeWin({
	});
}
