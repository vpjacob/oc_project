var memberid;
apiready = function() {
	var header = $api.byId('title');
	var miancss = $api.dom('.box');
	if (api.systemType == 'ios') {
		$api.css(header, 'padding-top:1.0rem;');
		$api.css(header, 'height:3.2rem;');
		$api.css(miancss, 'margin-top:3.2rem;');
	};
	memberid = api.getPrefs({
		sync : true,
		key : 'memberid'
	});
    //记录仪被点击事件
	$("#recorde").bind("click", function() {
		//同步返回结果：
		var data = api.readFile({
			sync : true,
			path : 'fs://wisdomLifeData/equipment.json'
		});
		if (data) {
			//同步返回结果：
			var hasEq = $api.strToJson(data)[0];
			if (hasEq == false || hasEq == 'false') {
				api.openWin({//打开我的设备
					name : 'my_equipment',
					url : '../equipment/my_equipment.html',
					slidBackEnabled : true,
					animation : {
						type : "push", //动画类型（详见动画类型常量）
						subType : "from_right", //动画子类型（详见动画子类型常量）
						duration : 300 //动画过渡时间，默认300毫秒
					}
				});

			} else {
				api.openWin({//打开有设备的界面
					name : 'equipment_index',
					url : '../equipment/equipment_index.html',
					slidBackEnabled : true,
					animation : {
						type : "push", //动画类型（详见动画类型常量）
						subType : "from_right", //动画子类型（详见动画子类型常量）
						duration : 300 //动画过渡时间，默认300毫秒
					}
				});
			}
		} else {
			alert("没有设备，请先添加设备");
		}

	}); 


	$("#myroom").bind("click", function() {
		showRoomPage();
	});

	$("#regist").bind("click", function() {
		api.openWin({//打开有设备的界面
			name : 'equipmentType',
			url : './equipmentType.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
//打开门锁界面
$("#myLock").bind("click", function() {
		api.openWin({//打开有设备的界面
			name : 'myLock',
			url : './myLock.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});	
};
function goBack() {
	api.closeWin({
	});
}
/**
 * 获取当前登录的用户id，并且跳到我的房间页面
 */
function showRoomPage() {
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getroomById",
		form : {
			memberid : memberid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'false') {
				api.alert({
					title : '提示',
					msg : '对不起，加载房间信息失败，请您重新加载',
				}, function(ret, err) {
				});
			} else {
				roomLength = data.datasources[0].rows.length;
				if (roomLength != 0) {
					api.openWin({
						name : 'managerRoom',
						url : '../personal/select_adress.html',
						slidBackEnabled : true,
						pageParam : {
							memberid : memberid
						},
						animation : {
							type : "push", //动画类型（详见动画类型常量）
							subType : "from_right", //动画子类型（详见动画子类型常量）
							duration : 300 //动画过渡时间，默认300毫秒
						}
					});
				} else {
					api.openWin({
						name : 'addhouse',
						url : '../../guanjia/html/guanjia/fangwu/addhouse.html',
						slidBackEnabled : true,
						animation : {
							type : "push", //动画类型（详见动画类型常量）
							subType : "from_right", //动画子类型（详见动画子类型常量）
							duration : 300 //动画过渡时间，默认300毫秒
						}
					});
				}
			}
		}
	});
}
