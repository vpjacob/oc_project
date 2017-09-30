var urId = '';
var userRole = false;
apiready = function(){
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    queryUserRoleInfo(urId);
    	//查询用户角色
	function queryUserRoleInfo(urId) {
		var data = {
			"userNo" : urId,
		};
		$.ajax({
			url : rootUrls + '/xk/queryUserRoleInfo.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				var data = result.data;
				console.log($api.jsonToStr(result));
				if (result.state == 1) {
					if (data.userRole == 6) {
						userRole = true;
					} else if (data.userRole == 8) {
						userRole = true;
					} else if (data.userRole == 9) {
						userRole = true;
					}
				} else {
					//alert(data.msg);
				}
			}
		});
	};
	//	点击开门记录跳转
	$('#jilu').click(function() {
		api.accessNative({
			name : 'OpenRecord',
			extra : {

			}
		}, function(ret, err) {
			if (ret) {
			
			} else {
				
			}
		});
	});
	//	一键开门
	$('#onceopen').click(function() {
		//一键开门
		api.accessNative({
			name : 'Onceopen',
			extra : {

			}
		}, function(ret, err) {
			if (ret) {
				
			} else {
			
			}
		});
	});
	//	点击门口视频跳转
	$('#shipin').click(function() {
		api.accessNative({
			name : 'DoorVideoList',
			extra : {

			}
		}, function(ret, err) {
			if (ret) {
				//                                    alert(JSON.stringify(ret));
			} else {
				//                                    alert(JSON.stringify(err));
			}
		});
	});
	//门禁钥匙
	$('#yaoshi').click(function() {
		//进入设备列表
		api.accessNative({
			name : 'DeviceList',
			extra : {

			}
		}, function(ret, err) {
			if (ret) {
				//                                    alert(JSON.stringify(ret));
			} else {
				//                                    alert(JSON.stringify(err));
			}
		});
	});	
	//	点击公告进行跳转
	$('#gonggao').click(function() {
		if (userRole == true) {
			api.openWin({
				name : 'gonggao',
				url : '../guanjia/html/guanjia/gonggao/gonggao.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else {
			alert('您暂时没有此权限,不能使用该功能');
		}
	});
	//联系物业页面跳转

	$("#callWy").click(function() {
		if (userRole == true) {
			api.openWin({
				name : 'estateContact',
				url : '../guanjia/html/guanjia/estateContact/estateContact.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else {
			alert('您暂时没有此权限,不能使用该功能');
		}
	});
	//维修
	$('#weixiu').click(function() {
		if (userRole == true) {
			api.openWin({
				name : 'wywx',
				url : '../guanjia/html/guanjia/wywx/wywx.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else {
			alert('您暂时没有此权限,不能使用该功能');
		}
	});
	$("#more").click(function(){
		api.toast({
	        msg:'敬请期待！'
        });
	})
	//	房屋
	$('#fangwu').click(function() {
			api.openWin({
				name : 'myhouse',
				url : '../guanjia/html/guanjia/fangwu/myhouse.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
	});
	//访客
	$('#fangke').click(function() {
		api.accessNative({
			name : 'VisitorPass',
			extra : {

			}
		}, function(ret, err) {
			if (ret) {
				//                                    alert(JSON.stringify(ret));
			} else {
				//                                    alert(JSON.stringify(err));
			}
		});

	});
	//我是成员
	$('#familyNum').click(function() {
			api.openWin({
				name : 'familyNum',
				url : '../guanjia/html/guanjia/familyNum/familyNum.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
	});
	//	进入设置界面
	$('#setting').click(function() {
		//进入设置界面
		api.accessNative({
			name : 'Setting',
			extra : {

			}
		}, function(ret, err) {
			if (ret) {
				//                                    alert(JSON.stringify(ret));
			} else {
				//                                    alert(JSON.stringify(err));
			}
		});
	});
};