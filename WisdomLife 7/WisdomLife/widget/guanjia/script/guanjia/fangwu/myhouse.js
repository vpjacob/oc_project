var urId = '';
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		//		checkUserIsHouseOwner(urId);
		//		queryUserRoleInfo(urId);
		queryMyHouseInfo(urId);
		//deleteTenementApplyById(urId);
		//updateHouseApply(urId);
		//		updateTenementHouseApply(urId);
		//我是租户房屋接口
		//		queryMyTenementInfo(urId);
	});
	$(function() {
		$(".Personal_centent").hide().first().show();
		$(".step").hide().first().show();
		$(".span1").click(function() {
			$("#apply").hide();
			$("#zuhu").show();
			queryMyTenementInfo(urId);
		})
		$(".span0").click(function() {
			$("#apply").show();
			$("#zuhu").hide();
			queryMyHouseInfo(urId);
		})
		$(".Personal_title span").click(function() {
			$(this).addClass("special").siblings().removeClass("special");
			$(".Personal_centent").hide().eq($(this).index()).show();
		});

	})
	//2.查找我的所有的房屋信息
	function queryMyHouseInfo(urId) {
		var data = {
			"userNo" : urId,
		};
		$.ajax({
			url : rootUrls + '/xk/queryMyHouseInfo.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				var data = result.data;
				if (result.state == 1) {
					if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
						api.toast({
							msg : '暂无您的房屋信息'
						});
						return false;
					} else {
						var nowli = '';
						for (var i = 0; i < data.length; i++) {
							var test = data[i].communityName + "&nbsp" + data[i].buildingName + data[i].unitName + "&nbsp" + data[i].roomName;

							nowli += '<div class="same">' + '<div class="sameBox slide">' + '<div class="top">' + '<span>' + data[i].ownerName + '</span>' + '<span>' + data[i].ownerPhone + '</span>' + '</div>' + '<div class="mid">' + '<span>' + test + '</span>' + '</div>' + '<div class="last">' + '<div class="last_left biandel">' + '<img src="../../../image/tempcheng.png" alt=""/>' + '<span class="compile" value="' + data[i].roomId + '">租户申请</span>' + '</div>' + '<div class="last_right">' + '<img src="../../../image/bianji.png" alt=""/>' + '<span class="change" value="' + data[i].roomId + '">编辑</span>' + '<img src="../../../image/chengy.png" alt=""/>' + '<span class="family" value="' + data[i].id + '" data="' + data[i].roomId + '">家庭成员</span>' + '</div>' + '</div>' + '</div>' + '<span class="delInfo" value="' + data[i].id + '">删除</span>' + '</div>'
						}
						$('#showList').html(nowli);
						//租户审核
						$('.biandel').on('click', '.compile', function() {
							api.openWin({
								name : 'tempManage',
								url : '../tempManage/tempManage.html',
								slidBackEnabled : true,
								animation : {
									type : "push", //动画类型（详见动画类型常量）
									subType : "from_right", //动画子类型（详见动画子类型常量）
									duration : 300 //动画过渡时间，默认300毫秒
								},
								pageParam : {
									id : $(this).attr('value'),
								}
							});
						});
						//编辑功能
						$('.last_right').on('click', '.change', function() {
							var bianId = $(this).attr('value');
							api.openWin({
								name : 'editHouse',
								url : 'editHouse.html',
								slidBackEnabled : true,
								animation : {
									type : "push", //动画类型（详见动画类型常量）
									subType : "from_right", //动画子类型（详见动画子类型常量）
									duration : 300 //动画过渡时间，默认300毫秒
								},
								pageParam : {
									id : $(this).attr('value'),
								}
							});
						});
						//业主删除功能
						$('.same').on('click', '.delInfo', function() {
							var delInfoId = $(this).attr('value');
							api.confirm({
								title : '提示',
								msg : '您要删除吗？',
								buttons : ['确定', '取消']
							}, function(ret, err) {
								var index = ret.buttonIndex;
								if (index == 1) {
									deleteHouseById(delInfoId);
									
								}
							});

						});
						//业主家庭成员
						$('.last').on('click', '.family', function() {
							queryRoomInfoByroomId($(this).attr('data'),$(this).attr('value'));

						});
						//滑动删除功能
						var expansion = null;
						//是否存在展开的list
						var container = document.querySelectorAll('.slide');
						for (var i = 0; i < container.length; i++) {
							var x, y, X, Y, swipeX, swipeY;
							container[i].addEventListener('touchstart', function(event) {
								x = event.changedTouches[0].pageX;
								y = event.changedTouches[0].pageY;
								swipeX = true;
								swipeY = true;
								if (expansion) {//判断是否展开，如果展开则收起
									$(this).parent().removeClass('swipeleft');
								}
							});
							container[i].addEventListener('touchmove', function(event) {

								X = event.changedTouches[0].pageX;
								Y = event.changedTouches[0].pageY;
								// 左右滑动
								if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
									// 阻止事件冒泡
									event.stopPropagation();
									if (X - x > 10) {//右滑
										event.preventDefault();
										$(this).parent().removeClass('swipeleft');
										//右滑收起
									}
									if (x - X > 10) {//左滑
										event.preventDefault();
										$(this).parent().addClass('swipeleft');
										//左滑展开
										expansion = this;
									}
									swipeY = false;
								}
							});
						}
					}
				} else {
					alert(result.msg);
				}
			}
		});
	}

	//回显房屋信息
	function queryRoomInfoByroomId(roomId,ownerId) {
		var data = {
			"roomId" : roomId
		};
		$.ajax({
			url : rootUrls + '/xk/queryRoomInfoByroomId.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				var data = result.data;
				if (result.state == 1) {
					if (data.type != 3) {
						api.openWin({
							name : 'family',
							url : 'family.html',
							slidBackEnabled : true,
							animation : {
								type : "push", //动画类型（详见动画类型常量）
								subType : "from_right", //动画子类型（详见动画子类型常量）
								duration : 300 //动画过渡时间，默认300毫秒
							},
							pageParam : {
								id : ownerId,
							}
						});
					} else {
						alert('请去编辑保存你的房屋信息');
					}
				} else {
					alert(data.msg);
				}
			}
		});
	}

	//9.删除房屋申请信息  业主
	function deleteHouseById(delId) {
		var data = {
			"id" : delId,
		};
		$.ajax({
			url : rootUrls + '/xk/deleteHouseById.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				var data = result.data;
				if (result.state == 1) {
					alert(result.msg);
					location.reload();
				} else {
					alert(result.msg);
				}
			}
		});
	}

	//10，根据房屋申请id查找房屋信息
//	function queryhouseApplyById(bianId) {
//		var data = {
//			"id" : bianId,
//		};
//		$.ajax({
//			url : rootUrls + '/xk/queryhouseApplyById.do',
//			type : 'post',
//			dataType : 'json',
//			data : JSON.stringify(data),
//			contentType : "application/json;charset=utf-8",
//			success : function(result) {
//				console.log($api.jsonToStr(result));
//				if (result.state == 1) {
//					//                      alert(result.msg);
//				} else {
//					//                        alert("2");
//				}
//			}
//		});
//	}

	//queryhouseApplyById();

	//12，查找我的所有的租房信息
	function queryMyTenementInfo(urId) {
		var data = {
			"userNo" : urId,
		};
		$.ajax({
			url : rootUrls + '/xk/queryMyTenementInfo.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				var data = result.data;
				if (result.state == 1) {
					if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
						api.toast({
							msg : '暂无您的相关租房信息'
						});
						return false;
					} else {
						var nowli = '';
						for (var i = 0; i < data.length; i++) {
							function statuses() {//认证的状态
								var ren = ''
								if (data[i].status == 0) {//已认证
									ren = '<div class="last">' + '<div class="last_left">' + '<img src="../../../image/reny.png" alt="" />' + '<span>已认证</span>' + '</div>' + '<div class="last_right familys" id="' + data[i].id + '">' + '</div>' + '</div>'
								}
								if (data[i].status == 3) {//认证失败
									ren = '<div class="last">' + '<div class="last_left">' + '<img src="../../../image/renw.png" alt="" />' + '<span>认证失败</span>' + '</div>' + '<div class="last_right biandelTemp" style="margin-right:2%" >' + '<div style="display: inline-block" class="compiles"  value="' + data[i].id + '">' + '<img src="../../../image/bianji.png" alt="" />' + '<span>编辑</span>' + '</div>' + '<div style="display: inline-block" class="delInfos" value="' + data[i].id + '">'+'<img src="../../../image/del.png" alt="" />'+'<span>删除</span>' + '</div>' + '</div>' + '</div>'
//									ren ='<div class="last">'+'<div class="last_left">'+'<img src="../../../image/renw.png" alt="" />'+'<span>认证失败</span>'+'</div>'+'<div class="last_right biandel" style="margin-right:2%">'+'<img src="../../../image/bianji.png" alt="" />'+'<span>编辑</span>'+'<img src="../../../image/del.png" alt="" />'+'<span>删除</span>'+'</div>'+'</div>'
								
								}
								if (data[i].status == 2) {//认证中
									ren = '<div class="last">' + '<div class="last_left">' + '<img src="../../../image/renw.png" alt="" />' + '<span>认证中</span>' + '</div>' + '<div class="last_right">' + '</div>' + '</div>'
								}
								return ren;
							}

							var test = '';
							//地址信息

							test = data[i].communityName + "&nbsp" + data[i].buildingName + data[i].unitName + "&nbsp" + data[i].roomName;

							nowli += '<div class="same">' + '<div class="sameBox">' + '<div class="top">' + '<span>' + data[i].ownerName + '</span>' + '<span>' + data[i].ownerPhone + '</span>' + '</div>' + '<div class="mid">' + '<span>' + test + '</span>' + '</div>' + '' + statuses() + '' + '</div>' + '</div>'

						}
						$('#showTempList').html(nowli);
						//编辑功能
						$('.biandelTemp').on('click', '.compiles', function() {
							var bianId = $(this).attr('value');
							api.openWin({
								name : 'bianhouse',
								url : 'bianhouse.html',
								slidBackEnabled : true,
								animation : {
									type : "push", //动画类型（详见动画类型常量）
									subType : "from_right", //动画子类型（详见动画子类型常量）
									duration : 300 //动画过渡时间，默认300毫秒
								},
								pageParam : {
									id : $(this).attr('value'),
								}
							});
						});
						//删除功能			
						$('.biandelTemp').on('click', '.delInfos', function() {
							var biandelTempId=$(this).attr('value');
							
							api.confirm({
								title : '提示',
								msg : '您要删除吗？',
								buttons : ['确定', '取消']
							}, function(ret, err) {
								var index = ret.buttonIndex;
								if (index == 1) {
//									alert(biandelTempId);
									deleteTenementApplyById(biandelTempId);
								}
							});
						}); 

						
					}
				} else {
					alert(result.msg);
				}
			}
		});
	}

	//13，删除租户申请信息
	function deleteTenementApplyById(delTempId) {
		var data = {
			"id" : delTempId,
		};
		$.ajax({
			url : rootUrls + '/xk/deleteTenementApplyById.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				if (result.state == 1) {
					 alert(result.msg);
					 location.reload();
				} else {
					 alert(result.msg);
				}
			}
		});
	}

	//14，根据租户房屋申请id查找租户信息
//	function queryTenementApplyById(urId) {
//		var data = {
//			"id" : urId,
//		};
//		$.ajax({
//			url : rootUrls + '/xk/queryTenementApplyById.do',
//			type : 'post',
//			dataType : 'json',
//			data : JSON.stringify(data),
//			contentType : "application/json;charset=utf-8",
//			success : function(result) {
//				console.log($api.jsonToStr(result));
//				if (result.state == 1) {
//					//                      alert(result.msg);
//				} else {
//					//                        alert("2");
//				}
//			}
//		});
//	}

//添加房屋 跳转
	$('#addFamily').click(function() {
		api.openWin({
			name : 'addhouse',
			url : 'addhouse.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});


}
function goBack() {
	api.closeWin({
	});
}
