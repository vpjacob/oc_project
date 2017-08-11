var memberid;
apiready = function() {
	var header = $api.byId('header');
	var content = $api.dom('.content');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
		$api.css(content, 'margin-top:20px;');
	}
	$("#back").bind("click", function() {
		api.closeWin();
	});
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
		//同步返回结果：
		var hasEq = $api.strToJson(data)[0].hasEq;
		console.log(data);
		console.log(hasEq);
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
					//					api.openWin({//打开我的房间界面
					//						name : 'roomIndex',
					//						url : '../home/roomindex.html',
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
						name : 'addroom',
						url : '../personal/roominfo.html',
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