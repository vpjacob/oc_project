var urId = '';
var userRole = false;
apiready = function() {
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    queryUserRoleInfo(urId);
	//获得商品主页轮播图
	function queryCarouselList() {
		AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "queryCarouselList",
			//        form:{
			//           userNo:urId
			//        },
			success : function(data) {
				console.log("商品轮播图片" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.carouselList;
					var list = $api.strToJson(account);
					var nowli = "";
					for (var i = 0; i < list.length; i++) {
						nowli += '<div class="swiper-slide"><img src="' + rootUrl + list[i].image_url + '"></img></div>'
					}
					$('#mainShowImg').html(nowli);
					var swiper = new Swiper('.swiper-container', {
						pagination : '.swiper-pagination',
						paginationClickable : true,
						spaceBetween : 3,
						centeredSlides : true,
						autoplayDisableOnInteraction : false,
						autoplay : 2500,
						loop : true,
						observer : true, //修改swiper自己或子元素时，自动初始化swiper
						observeParents : true//修改swiper的父元素时，自动初始化swiper
					}); 

					//跳转到商品列表页
					$('.swiper-wrapper img').click(function() {
						api.openWin({
							name : 'buyList',
							url : '../../../shangjia/html/buyList.html',
							animation : {
								type : "push", //动画类型（详见动画类型常量）
								subType : "from_right", //动画子类型（详见动画子类型常量）
								duration : 300 //动画过渡时间，默认300毫秒
							}
						});
					});
				} else {
					alert(data.formDataset.errorMsg);
				}
			},
			error : function() {
				api.hideProgress();
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
	}

	queryCarouselList();
	
	
	
	//跳转轮播到商品
	$('.header img').click(function() {
			api.openWin({
				name : 'buyList',
				url : '../../../shangjia/html/buyList.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
	});
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
	}


	$('footer div').click(function() {
		$(this).addClass("special").siblings().removeClass("special");
	})
	//	点击公告进行跳转
	$('#gonggao').click(function() {
		if (userRole == true) {
			api.openWin({
				name : 'gonggao',
				url : 'gonggao/gonggao.html',
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
				url : 'estateContact/estateContact.html',
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

	//我是成员
	$('#familyNum').click(function() {
			api.openWin({
				name : 'familyNum',
				url : 'familyNum/familyNum.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
	});
	//我是成员
	$('#tempManage').click(function() {
		api.openWin({
			name : 'tempManage',
			url : 'tempManage/tempManage.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//
	//	生活缴费
	$('#jiaofei').click(function() {
		api.openWin({
			name : 'jiaofei',
			url : 'shenghuojiaofei/shenghuojiaofei.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//维修
	$('#weixiu').click(function() {
		if (userRole == true) {
			api.openWin({
				name : 'wywx',
				url : 'wywx/wywx.html',
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

	//	房屋
	$('#fangwu').click(function() {
			api.openWin({
				name : 'myhouse',
				url : 'fangwu/myhouse.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
	});

	//邻里呼叫
	$('#linCall').click(function() {
		api.toast({
			msg : "此功能暂未开通！"
		});
	});

	//联系客服
	$('#customer').click(function() {
		api.toast({
			msg : "此功能暂未开通！"
		});
	});
	//房屋租售
	$('#rent').click(function() {
		api.toast({
			msg : "此功能暂未开通！"
		});
	});
	$('#rent').click(function() {
		api.openWin({
				name : 'myhouse',
				url : 'test.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
	});
	//家政保洁
	$('#homeClear').click(function() {
		api.toast({
			msg : "此功能暂未开通！"
		});
	});
	//保姆月嫂
	$('#moonMoman').click(function() {
		api.toast({
			msg : "此功能暂未开通！"
		});
	});
	//鲜花绿植
	$('#flower').click(function() {
		api.toast({
			msg : "此功能暂未开通！"
		});
	});
	//房屋维修
	$('#decoration').click(function() {
		api.toast({
			msg : "此功能暂未开通！"
		});
	});
	//家电维修
	$('#maintain').click(function() {
		api.toast({
			msg : "此功能暂未开通！"
		});
	});
	//环保回收
	$('#recycle').click(function() {
		api.toast({
			msg : "此功能暂未开通！"
		});
	});
	//更多服务
	$('#moreServer').click(function() {
		api.toast({
			msg : "此功能暂未开通！"
		});
	});

	//	点击历史记录跳转
	$('#jilu').click(function() {
		api.accessNative({
			name : 'OpenRecord',
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

	//	一键开门
	$('#onceopen').click(function() {
		//一键开门
		api.accessNative({
			name : 'Onceopen',
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

	//	点击门禁钥匙跳转
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

}
