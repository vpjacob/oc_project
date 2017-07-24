
var memberid;
apiready = function() {
	var header = $api.byId('header');
	var content = $api.dom('.content');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
		$api.css(content, 'margin-top:20px;');
	}
	memberid = api.getPrefs({
		sync : true,
		key : 'memberid'
	});
	$("#back").bind("click", function() {
		api.closeWin();
	});
	$("#Carcorder").bind("click", function() {
		api.openWin({//添加设备
			name : 'addequipment',
			url : 'addequipment.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	
	$("#menjin").bind("click", function() {
		showRoomPage();
	});
};

/**
 * 获取当前登录的用户id，并且跳到我的房间页面
 */
function showRoomPage() {
//	api.showProgress({
//	});
//	AjaxUtil.exeScript({
//		script : "mobile.center.room.roomindex",
//		needTrascation : false,
//		funName : "getroomById",
//		form : {
//			memberid : memberid
//		},
//		success : function(data) {
//			api.hideProgress();
//			if (data.execStatus == 'false') {
//				api.alert({
//					title : '提示',
//					msg : '对不起，加载房间信息失败，请您重新加载',
//				}, function(ret, err) {
//				});
//			} else {
//				roomLength = data.datasources[0].rows.length;
//				if (roomLength != 0) {
//					api.openWin({//打开我的房间界面列表
//						name : 'my_adress',
//						url : '../personal/my_adress.html',
//						pageParam : {
//							memberid : memberid
//						},
//						slidBackEnabled : true,
//						animation : {
//							type : "push", //动画类型（详见动画类型常量）
//							subType : "from_right", //动画子类型（详见动画子类型常量）
//							duration : 300 //动画过渡时间，默认300毫秒
//						}
//					});
//				} else {
					api.openWin({
						name : 'addroom',
						url : '../personal/roominfo.html',
						slidBackEnabled : true,
						animation : {
							type : "push", //动画类型（详见动画类型常量）
							subType : "from_right", //动画子类型（详见动画子类型常量）
							duration : 300 //动画过渡时间，默认300毫秒
						}
					});
					
//				}
//			}
//		}
//	});
}