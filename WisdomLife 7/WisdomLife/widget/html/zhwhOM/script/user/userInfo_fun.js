//个人信息首页
function init_user_info_main(userID) {
	var _data = {
		script: "managers.om.user_moble.user",
		needTrascation: false,
		funName: "userinfomain",
		form: "{ownerId: '" + uid + "',userID: '" + userID + "',userLat: " + user_lat + ",userLon: " + user_lon + "}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		timeout: 5000,
		success: function(data) {
			var resultbase = data.datasources[0].rows[0];
			var resultvisitnum = data.datasources[1].rows[0].c_visitornum;
			var resultdynamicnum = data.datasources[2].rows[0].dynamicnum;
			var resultimage = data.datasources[3].rows;
			init_user_info_data(JSON.stringify(resultbase), resultvisitnum, resultdynamicnum, JSON.stringify(resultimage));
		},
		error: function(xhr, type) {
			alert("请求失败");
		}
	});
}

//查看个人详细信息
function init_user_info_view(userID, type) {

	var _data = {
		script: "managers.om.user.user",
		needTrascation: true,
		funName: "getUserInfo",
		form: "{userID: '" + userID + "',uid: '" + uid + "',userLat: " + user_lat + ",userLon: " + user_lon + "}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			init_user_info_view_data(data, type);
		},
		error: function(xhr, type) {
			toast.show("请求失败");
		}
	});
}

//修改用户详细信息
function init_user_info_edit(type) {

	var _data = {
		script: "managers.om.user_moble.user",
		needTrascation: false,
		funName: "userinfo",
		form: "{userID: '" + uid + "'}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		timeout: 5000,
		success: function(data) {
			init_user_info_edit_data(data, type);
		},
		error: function(xhr, type) {
			alert("请求失败");
		}
	});

}

//清除看过我的人员列表
function user_info_visitor_clear() {
	var myApp = new Framework7({
		modalButtonOk: '确定',
		modalButtonCancel: '取消'
	});

	myApp.confirm('确定要清除所有看过我人？', '',
		function() {
			var _data = {
				script: "managers.om.user_moble.user",
				needTrascation: true,
				funName: "deleteUserVisitor",
				form: "{userID: '" + uid + "'}"
			};

			$$.ajax({
				url: rootUrl + "/api/execscript",
				method: 'post',
				dataType: 'json',
				data: _data,
				success: function(data) {
					mainView.router.reloadPage('html/user/user_info_visitor.html');
				},
				error: function(xhr, type) {
					alert("请求失败");
				}
			});
		},
		function() {}
	);
}

//清除查看过我的动态的人员列表
function user_info_visitor_dynamic_clear() {
	var myApp = new Framework7({
		modalButtonOk: '确定',
		modalButtonCancel: '取消'
	});

	myApp.confirm('确定要清除所有看过我动态的人？', '  ',
		function() {
			var _data = {
				script: "managers.om.user_moble.user",
				needTrascation: true,
				funName: "deleteUserDynamicVisitor",
				form: "{userID: '" + uid + "'}"
			};

			$$.ajax({
				url: rootUrl + "/api/execscript",
				method: 'post',
				dataType: 'json',
				data: _data,
				success: function(data) {
					mainView.router.reloadPage('html/user/user_info_visitor.html');
				},
				error: function(xhr, type) {
					alert("请求失败");
				}
			});
		},
		function() {}
	);
}

//删除个人动态
function user_info_deleteSelfDynamic(dynamicId) {
	myApp.confirm('确定删除吗?', '提示', function() {
		$$('#' + dynamicId).remove();
		var dnum = $$('#user_info_dynamicNum').html();
		dnum = dnum * 1 - 1;
		$$('#user_info_dynamicNum').html(dnum);
		var _data = {
			script: "managers.om.user_moble.user",
			needTrascation: true,
			funName: "delSelfDynamic",
			form: "{dynamicId: '" + dynamicId + "'}"
		};

		$$.ajax({
			url: rootUrl + "/api/execscript",
			method: 'post',
			dataType: 'json',
			data: _data,
			success: function(data) {
				toast.show('删除成功');
			},
			error: function(xhr, type) {
				toast.show("删除失败");
			}
		}, function() {});
	});
}

//查看用户图片大图
function user_info_edit_showImage(num) {
	user_info_edit_imageView.open(num);
}

//聊天  statu = 1 单聊   statu ＝ 3 群聊
function user_info_chat(userID, statu, username) {
	$$('#user_info_view_chat').attr('disabled', 'true');
	var _data = {
		script: "managers.om.user_moble.user",
		needTrascation: true,
		funName: "getUserChat",
		form: "{userID: '" + userID + "',uid: '" + uid + "'}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			var counselId = data.formDataset.c_id;
			mainView.router.loadPage('html/service/servicechat.html?counselId=' + counselId + '&targetId=' + userID + '&statu=' + statu + '&conversationtype=1&name=' + username);
			$$('#user_info_view_chat').removeAttr('disabled');
		},
		error: function(xhr, type) {
			toast.show('请求失败！');
		}
	});
}

//关注用户
function user_info_follow(userID) {
	
	var myApp = new Framework7({
		modalButtonOk: '确定',
		modalButtonCancel: '取消'
	});
	var reName = $$('#user_info_view_userName').prop()[0].innerText;
	myApp.confirm('关注TA可查看并接受TA的全部动态，确定关注TA？', '',
		
		function() {
			
			var _data = {
				script: "managers.om.user.user",
				needTrascation: true,
				funName: "addRelation",
				form: "{fromUserID: '" + uid + "',toUserID: '" + userID + "',reName: '" + reName + "'}"
			};

			$$.ajax({
				url: rootUrl + "/api/execscript",
				method: 'post',
				dataType: 'json',
				data: _data,
				success: function(data) {
					if(data.execStatus == 'true') {
						toast.show('关注成功！');
						$$("#follow").css('display','none');
						
					}

				},
				error: function(xhr, type) {
					toast.show('关注失败！');
				}
			});
		},
		function() {}
	);
}

//拉黑或者举报用户
function user_info_Report(userID, innertype) {
	var buttons1 = [{
			text: '    ',
			label: false
		}, {
			text: '<span style="color:#0EAAE3;font-weight:600">拉黑</span>',
			onClick: function() {
				var myApp = new Framework7({
					modalButtonOk: '确定',
					modalButtonCancel: '取消'
				});

				myApp.confirm('拉黑后将不会收到对方发来的消息，可在“设置->黑名单”中解除。是否确认？', '',
					function() {
						var _data = {
							script: "managers.om.user.user",
							needTrascation: false,
							funName: "insertDefriend",
							form: "{userID: '" + uid + "',toUserID: '" + userID + "'}"
						};

						$$.ajax({
							url: rootUrl + "/api/execscript",
							method: 'post',
							dataType: 'json',
							data: _data,
							success: function(data) {
								if(data.formDataset.checked == 'true') {
									toast.show("拉黑成功");
									if(innertype == 1) {
										mainView.router.loadPage('html/nearby/nearbyMain.html');
										getNearbyPersonnelList('0', $$('#personnel_time').val(), $$('#personnel_gender').val(), $$('#personnel_ageMin').val(), $$('#personnel_ageMax').val(), $$('#personnel_con').val());
									} else if(innertype == 3) {
										mainView.router.back({
											url: 'html/maillist/maillist.html',
											force: true
										});
									} else if(innertype == 5) {
										mainView.router.back({
											url: 'html/maillist/maillist.html?type=1',
											force: true
										});
									} else if(innertype == 4) {
										mainView.router.back({
											url: 'html/maillist/addfriends.html',
											force: false
										});
									}
								} else if(data.formDataset.checked == 'false') {
									toast.show("已经拉黑过了！");
								}
							},
							error: function(xhr, type) {
								toast.show("拉黑失败");
							}
						});
					},
					function() {}
				);
			}
		}, {
			text: '<span style="color:#0EAAE3 ;font-weight:600">举报</span>',
			onClick: function() {
				mainView.router.loadPage('html/nearby/nearbyReport.html?userID=' + userID + '&type=' + innertype);
			}
		}

	];
	var buttons2 = [{
		text: '<span style="color:#0EAAE3;font-weight: 600;">取消</span>',
	}];
	var groups = [buttons1, buttons2];
	myApp.actions(groups);
}

//移除黑名单
$$(document).on('delete', '#user_setting_blackList .swipeout', function() {
	var tid = $$(this).children('.swipeout-actions-right').children('a').data('id');
	var _data = {
		script: "managers.om.user_moble.user",
		needTrascation: true,
		funName: "deleteDefriend",
		form: "{userID: '" + tid + "',uid: '" + uid + "'}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			toast.show('移除成功');
		},
		error: function(xhr, type) {
			alert("移除失败");
		}
	});
});

//收藏列表
function dataCollectionList(cur_page) {
	var _data = {
		script: "managers.om.user_moble.user",
		needTrascation: false,
		funName: "userCollection",
		form: "{userID: '" + uid + "',cur_page: " + cur_page + "}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		timeout: 5000,
		success: function(data) {
			showCollectionList(data);
		},
		error: function(xhr, type) {
			alert("请求失败");
		}
	});
}

//移除收藏
function removeCollection(pkid) {
	myApp.confirm('确定要移除这条收藏吗?', function() {
		var _data = {
			script: "managers.om.user_moble.user",
			needTrascation: true,
			funName: "removeCollection",
			form: "{pkid: '" + pkid + "'}"
		};

		$$.ajax({
			url: rootUrl + "/api/execscript",
			method: 'post',
			dataType: 'json',
			data: _data,
			success: function(data) {
				if(data.formDataset.checked == 'true') {
					toast.show('移除成功');
					$$('#' + pkid).remove();
				}
			},
			error: function(xhr, type) {
				alert("移除失败");
			}
		});
	});
}

//删除本地JSON文件目录
function removeFsDir(filename) {
	var fs = api.require('fs');
	var cacheDir = api.cacheDir;

	fs.rmdir({
		path: cacheDir + '/' + filename
	}, function(ret, err) {
		if(ret.status) {} else {}
	});
}

//城市选择器
function info_edit_home() {
	UIActionSelector.open({
		datas: 'widget://html/zhwhOM/res/city.json',
		layout: {
			row: 7,
			col: 3,
			height: 30,
			size: 15,
			sizeActive: 16,
			rowSpacing: 5,
			colSpacing: 10,
			maskBg: 'rgba(0,0,0,0.2)',
			bg: '#fff',
			color: '#888',
			colorActive: '#f00',
			colorSelected: '#0EAAE3'
		},
		animation: true,
		cancel: {
			text: '取消',
			size: 14,
			w: 60,
			h: 40,
			bg: '#fff',
			bgActive: '#ccc',
			color: '#0EAAE3',
			colorActive: '#fff'
		},
		ok: {
			text: '确定',
			size: 14,
			w: 60,
			h: 40,
			bg: '#fff',
			bgActive: '#ccc',
			color: '#0EAAE3',
			colorActive: '#fff'
		},
		title: {
			text: '',
			size: 14,
			h: 44,
			bg: '#fff',
			color: '#eee'
		},
		fixedOn: api.frameName
	}, function(ret, err) {
		if(ret) {
			if(ret.eventType != 'cancel') {
				if(typeof ret.level3 == 'undefined') {
					ret.level3 = '';
				}
				if(typeof ret.level2 == 'undefined') {
					ret.level2 = '';
				}
				$$('#user_info_edit_home').html(JSON.stringify(ret.level1 + ret.level2 + ret.level3).replace(/"/g, ''));
			}
		} else {
			alert(JSON.stringify(err));
		}
	});
}

//时间比较
function compareTime(value){
	var today = new Date();
	var fullyear = today.getFullYear();
	var month = today.getMonth() * 1 + 1;
	var day = today.getDate() * 1;
	if(month < 10){
		month = '0' + month;
	}
	if(day < 10){
		day = '0' + day;
	}
	var todays = (fullyear + month + day) * 1;
	var birthday = value.replace(/-/g, '');
	birthday = birthday * 1;
	var flag = false;
	
	if(todays >= birthday){
		flag = true;
	}else{
	}
	return flag;
}
