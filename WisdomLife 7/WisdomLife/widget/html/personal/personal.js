var memberid;
var roomLength = 0;
var roomReviewed = false;
var membercode;
var isIos;

var referrer;
var referrerType = 1;
var referrerName;
var satatus;
var headurls='';
var userInfo = {
};
var urId;
apiready = function() {

	$('.myAccount').hide();
	//异步返回结果：

	//	获取用户id、金银蛋 金币数据统计
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		count(urId);
		getUesrInfo(urId);
		$('.name').html('用户id：' + urId);

	});

	api.readFile({
		path : 'fs://wisdomLifeData/equipment.json'
	}, function(ret, err) {
		if (ret.status) {
			var hasEq = $api.strToJson(ret.data)[0].hasEq;
			api.setPrefs({
				key : 'hasEq',
				value : hasEq
			});
		} else {
			api.setPrefs({
				key : 'hasEq',
				value : false
			});
			var obj = [];
			//			for (var i = 0; i < 2; i++) {
			var equipmentinfo = {};
			equipmentinfo.hasEq = false;
			equipmentinfo.name = "";
			equipmentinfo.wifiName = "";
			equipmentinfo.pwd = "";
			equipmentinfo.isRecode = 0;
			obj.push(equipmentinfo);
			//			}
			FileUtils.writeFile(obj, "equipment.json", function(info, err) {
				//				alert('写入成功'); 在写入的时候会自动新建文件
			});
		}
	});
	setmsgnum();
	hiddenphoto();
	if ($('.guest').html() == '小客用户') {
		$('.blackbox').show();
	} else {
		$('.blackbox').hide();
		$('.jianr').css('padding-bottom', '25px');
	}
	/**
	 * 获取memberid，并获取个人的相关信息
	 */
	memberid = api.getPrefs({
		sync : true,
		key : 'memberid'
	});
//	getUesrInfo();
	api.closeWin({
		name : 'register'
	});
	//获取遮罩是否显示===start
	var isFirst = api.getPrefs({
		sync : true,
		key : 'isFirst'
	});
	var telphone = api.getPrefs({
		sync : true,
		key : 'telphone'
	});
	//加载蒙版
	//	if (isFirst == "YES") {
	//		$(".hint").css("display", "");
	//	}
	$("#messageStatus").prop("checked", satatus);

	$(".hint").bind("click", function() {
		$(".hint").css("display", "none");
		api.setPrefs({
			key : 'isFirst',
			value : 'NO'
		});
	});
	//获取遮罩是否显示===end

	if (api.systemType == 'ios') {
		var cc = $api.dom('.jianr');
		$api.css(cc, 'margin-top:-2px;');
		isIos = true;
	}

	//绑定进入我的房间点击事件
	$("#myroom").bind("click", function() {
		showRoomPage();
	});
	//点击我的设备
	$("#mydevice").bind("click", function() {
		api.openWin({//打开有设备的界面
			name : 'allType',
			url : '../equipment/allType.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});

	$("#messageStatus").bind("change", function() {
		var messageStatus = $("#messageStatus").prop("checked")
		//		alert(messageStatus);
		//		alert(memberid);
		AjaxUtil.exeScript({
			script : "mobile.center.message.message",
			needTrascation : true,
			funName : "changeStatus",
			form : {
				memberid : memberid,
				messageStatus : messageStatus
			},
			success : function(data) {
				ProgressUtil.hideProgress();
				if (data.execStatus == 'true') {
					api.toast({
						msg : '设置成功',
						duration : 2000,
						location : 'bottom'
					});
				} else {
					api.alert({
						msg : '系统出错,请您从新设置!'
					}, function(ret, err) {
						//coding...
					});
				}
			}
		});
	})
	//绑定我的访客点击时间
	$("#myvisitor").bind("click", function() {
		//判断当前用户是否已经存在房间钥匙 start
		AjaxUtil.exeScriptSync({
			script : "mobile.center.room.roomindex",
			needTrascation : false,
			funName : "getRoomAndKeyInfoById",
			form : {
				memberid : memberid
			},
			success : function(data) {
				if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
					api.openWin({
						name : 'visitor',
						url : 'visitor.html',
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
					api.alert({
						msg : '有了自己的房子才能邀请访客哦!'
					}, function(ret, err) {
					});
				}
			}
		});
		//判断当前用户是否已经存在房间钥匙 end
	});
	$("#myfeedback").bind("click", function() {
		api.openWin({//打开意见反馈
			name : 'feedback',
			url : 'feedback.html',
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

	});

	$("#recommend").bind("click", function() {
		api.openWin({//打开推荐记录
			name : 'recommend',
			url : 'recommend.html',
			slidBackEnabled : true,
			pageParam : {
				membercode : membercode
			},
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});

	$('.changeNick').click(function() {
		api.openWin({
			name : 'changename',
			url : 'changename.html',
			reload : true,
			pageParam : {
				memberid : memberid,
				name : name
			},
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#buyback').click(function() {
		api.openWin({
			name : 'buyback',
			url : '../wallet/buyback.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#remind').click(function() {
		api.openWin({
			name : 'xiaoxi',
			url : '../wallet/xiaoxi.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#myrecord').click(function() {
		api.openWin({
			name : 'myrecord',
			url : '../wallet/myrecord.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#myegg').click(function() {
		api.openWin({
			name : 'myegg',
			url : '../wallet/myegg.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	
	$('#payMoney').click(function() {
		api.openWin({
			name : 'payMoney',
			url : 'payMoney.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//我的推荐
	$('#myReferer').click(function() {
		//拼接服务器地址端口、执行方法、传递参数
		var address = rootUrl + "/jsp/recommendmobile?userNo=" + urId + "&userType=1";
		//请求二维码模块
		var scanner = api.require('scanner');
		scanner.encode({
			string : address,
			save : {
				imgPath : 'fs://',
				imgName : 'referUser.png'
			}
		}, function(ret, err) {
			if (ret.status) {
				api.openWin({
					name : 'myReferer',
					url : 'myReferer.html',
					pageParam : {
						imgpath : ret.savePath
					},
					slidBackEnabled : true,
					animation : {
						type : "push", //动画类型（详见动画类型常量）
						subType : "from_right", //动画子类型（详见动画子类型常量）
						duration : 300 //动画过渡时间，默认300毫秒
					}

				});
			} else {
				api.alert({
					msg : JSON.stringify(err)
				}, function(ret, err) {
					//coding...
				});
			}
		});
	});
};
//金币总数的页面跳转
$('#goldCount').click(function() {
		api.openWin({
			name : 'goldCount',
			url : 'goldCount.html',
			reload : true,
			pageParam : {
				memberid : memberid,
				name : name
			},
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	
//收益明细跳转
$('#incomeInfo').click(function() {
		api.openWin({
			name : 'goldCount',
			url : 'goldCount.html',
			reload : true,
			pageParam : {
				memberid : memberid,
				name : name
			},
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});	

//	$(document).on('click', '#shareAll', function() {
//		$('#photo').show();
//	});
//	$(document).on('click', '.share_sub', function() {
//		$('#photo').hide();
//	});
//	$(document).on('click', '.zzc', function() {
//		$('.zzc').hide();
//	});
//	$(document).on("click", "#headurl", function() {
//		$('.zzc').show();
//		var imgSrc = $(this).attr('src');
//		$(".zzc .center").css('backgroundImage', 'url(' + imgSrc + ')');
//	});
$(document).on('click', '.pic', function() {
	$("#photo").css("display", "block");
});
$("#photo .photo_bottom").on("click", function() {//弹出选择头像
	$("#photo").css("display", "none");
});
$('#album').click(function() {//选择相册
	getPicture(0);
	$("#photo").css("display", "none");
});
$('#tackpic').click(function() {//选择照相
	getPicture(1);
	$("#photo").css("display", "none");
});
//	//从数据库获取推荐人信息====start
//	api.showProgress();
//	AjaxUtil.exeScriptSync({
//		script : "mobile.share.appshare",
//		needTrascation : true,
//		funName : "serachCommWealInfoByMembId",
//		form : {
//			memberid : memberid
//		},
//		success : function(data) {
//			api.hideProgress();
//			if (data.execStatus == 'true' && data.formDataset.checked == 'true') {
//				referrer = data.formDataset.referrer;
//				referrerName = data.formDataset.username;
//				api.setPrefs({
//					key : 'referrer',
//					value : referrer
//				});
//				api.setPrefs({
//					key : 'referrerName',
//					value : referrerName
//				});
//				AjaxUtil.exeScript({
//					script : "managers.mywallet.mywallet",
//					needTrascation : true,
//					funName : "getwalletInfo",
//					form : {
//						memberid : memberid
//					},
//					success : function(data) {
//						if (data.execStatus == "true" && data.datasources[0].rows.length > 0) {
//							var rows = data.datasources[0].rows[0];
//							$("#dotleft").html(rows.hartcount);
//							$("#dotmidd").html(rows.ordinarybean);
//							$("#dotright").html(rows.wptbean);
//						} else {
//							api.alert({
//								msg : "一点公益数据请求失败，请重试"
//							});
//						}
//					}
//				});
//			} else {
////				$('.dot').show();
////				$('#mywallet').show();
//			}
//		}
//	});

//	$(document).on('click', '#message', function() {
//		api.openWin({
//			name : 'messagelist',
//			url : 'messagelist.html',
//			pageParam : {
//				memberid : memberid
//			},
//			slidBackEnabled : true,
//			animation : {
//				type : "push", //动画类型（详见动画类型常量）
//				subType : "from_right", //动画子类型（详见动画子类型常量）
//				duration : 300 //动画过渡时间，默认300毫秒
//			}
//		});
//	});

function count(urId) {
	AjaxUtil.exeScript({
		script : "mobile.myegg.myegg",
		needTrascation : true,
		funName : "queryEggInfo",
		form : {
			userNo : urId
		},
		success : function(data) {
			if (data.formDataset.checked == 'true') {
				var account = data.formDataset.account;
				var list = $api.strToJson(account);
				$("#dotleft").html(list.gold_egg_count);
				$("#dotmidd").html(list.silver_egg_count);
				$("#dotright").html(list.balance_gold);

			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}

//我的钱包点击事件
$(document).on('click', '#mywallet', function() {
	//验证码弹出层
	//		$("#code").val("");
	//		$(".completeMess").show();
	//		getidentify();
	//		$('.cancle').click(function() {
	//			$(".completeMess").hide();
	//		})
	
//	$('.shebei').hide();
//	$('.qianbao').show();
//	$('.top-bar-right').hide();
//	$('.changemain').hide();
//	$('.changeback').show();
//	$('.myAccount').show();
//	$("#mywalletBack").show();
//	$('#mywallet').hide();
//	$('#myBack').hide();
	api.openWin({
		name : 'my-qianbao',
		url : '../../newMy/my-qianbao.html',
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	}); 
});

$(document).on('click', '#mywalletBack', function() {
	//验证码弹出层
	//		$("#code").val("");
	//		$(".completeMess").show();
	//		getidentify();
	//		$('.cancle').click(function() {
	//			$(".completeMess").hide();
	//		})
	$('#my').hide();
	$('.shebei').show();
	$('.qianbao').hide();
	$('.top-bar-right').show();
	$('.changemain').show();
	$('.changeback').hide();
	$('.myAccount').hide();
	$("#mywalletBack").hide();
	$('#mywallet').show();
});

$('.changeback').click(function() {
	$('.shebei').show();
	$('.qianbao').hide();
	$('.top-bar-right').show();
	$('.changemain').show();
	$('.changeback').hide();
})

$(".change").click(function() {
	getidentify();
});
//输入验证码，点击确认进入我的钱包
$('#commit').click(function() {
	var code = $("#code").val();
	var reg = /^[0-9]{4}$/;
	if (code.length != 4 || !reg.test(code)) {
		api.alert({
			msg : '请输入正确的验证码'
		}, function(ret, err) {

		});
		return;
	}

	api.showProgress();
	AjaxUtil.exeScript({
		script : "managers.mywallet.mywallet",
		needTrascation : true,
		funName : "getCommmonwealuserInfo",
		form : {
			memberid : memberid
		},
		success : function(data) {
			if (data.execStatus == "true" && data.datasources[0].rows.length > 0) {
				var rows = data.datasources[0].rows[0];
				var comusername = api.getPrefs({
					sync : true,
					key : 'account'
				});
				var comuserpwd = data.datasources[0].rows[0].password;
				api.ajax({
					url : rootUrl + '/api/commmonweal/login',
					method : 'post',
					data : {
						values : {

							//								username : '13301213926',
							//								userpwd : '654321',
							//																username : '15801366284',
							//																userpwd : 'zwxzwx123',
							//								username : '18741897711',
							//								userpwd : '0000qqqq',

							username : comusername,
							userpwd : comuserpwd,
							usertype : '1',
							validCode : code,
						}
					}
				}, function(ret, err) {
					api.hideProgress();
					if (ret) {
						if (ret.execStatus == "true") {
							if (ret.formDataset.entity.code == "0") {//登录成功
								$(".completeMess").hide();
								api.openWin({
									name : 'mywallet',
									url : '../wallet/mywallet.html',
									slidBackEnabled : true,
									animation : {
										type : "push", //动画类型（详见动画类型常量）
										subType : "from_right", //动画子类型（详见动画子类型常量）
										duration : 300 //动画过渡时间，默认300毫秒
									}
								});
							} else if (ret.formDataset.entity.code == "1") {//验证码错误
								api.alert({
									msg : "验证码错误，请重试"
								}, function(ret, err) {
									getidentify();
									//重新获取验证码
								});
							} else if (ret.formDataset.entity.code == "4") {//没有完善信息
								$(".completeMess").hide();
								var userid = ret.formDataset.entity.user.userid;
								var referrerMobile = ret.formDataset.entity.user.referrerMobile;
								var referrerName = ret.formDataset.entity.user.referrerName;
								api.openWin({
									name : 'completeMess',
									url : '../wallet/completeMess.html',
									slidBackEnabled : true,
									pageParam : {
										userid : userid,
										referrerName : referrerName,
										referrerMobile : referrerMobile
									},
									animation : {
										type : "push", //动画类型（详见动画类型常量）
										subType : "from_right", //动画子类型（详见动画子类型常量）
										duration : 300 //动画过渡时间，默认300毫秒
									}
								});
							} else {
								$(".completeMess").hide();
								api.alert({
									msg : "数据请求失败，请重试"
								});
							}
						} else {
							$(".completeMess").hide();
							api.alert({
								msg : "数据请求失败，请重试"
							});
						}
					} else {
						api.alert({
							msg : "数据请求失败，请重试"
						});
					}
				});

			} else {
				api.alert({
					msg : "数据请求失败，请重试"
				});
			}
		}
	});
});

//点击我的二维码名片
$('#mycard').click(function() {
	//api.showProgress();
	//通过memberid获取uid
	api.toast({
	    msg:'此功能暂时未开通'
    });
//	AjaxUtil.exeScript({
//		script : "managers.home.person",
//		needTrascation : false,
//		funName : "getUserIdByWisdomId",
//		form : {
//			fid : memberid
//		},
//		success : function(data) {
//			api.hideProgress();
//			if (data.execStatus == 'true') {
//				var address = data.datasources[0].rows[0].c_user_id;
//				console.log('获取个人信息' + address);
//				//					var address = "测试数据——我的钱包里作为推荐人的ID";
//				var scanner = api.require('scanner');
//				scanner.encode({
//					string : address,
//					save : {
//						imgPath : 'fs://',
//						imgName : 'referID.png'
//					}
//				}, function(ret, err) {
//					if (ret.status) {
//						api.openWin({
//							name : 'house_codes',
//							url : 'house_codes.html',
//							pageParam : {
//								address : address,
//								imgpath : ret.savePath
//							},
//							slidBackEnabled : true,
//							animation : {
//								type : "push", //动画类型（详见动画类型常量）
//								subType : "from_right", //动画子类型（详见动画子类型常量）
//								duration : 300 //动画过渡时间，默认300毫秒
//							}
//						});
//					} else {
//						api.alert({
//							msg : JSON.stringify(err)
//						}, function(ret, err) {
//							//coding...
//						});
//					}
//				});
//			} else {
//				api.alert({
//					msg : '没有查到您的信息或者您的网络出问题了!'
//				});
//			}
//		}
//	});

});
///////////////////////我是萌萌的分割线/////////////////////////////////////////////
function getUesrInfo(urId) {
	api.showProgress();
	//获取设置推送是否开启
	$('.name').html('用户id：' + urId);
	AjaxUtil.exeScript({
		script : "mobile.center.message.message",
		needTrascation : false,
		funName : "getmessageStatus",
		form : {
			memberid : memberid
//			"userNo":urId
		},
		success : function(data) {

			if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
				satatus = data.datasources[0].rows[0].messagestatus;
				//获取个人信息
				AjaxUtil.exeScript({
					script : "managers.home.person",
					needTrascation : false,
					funName : "getmemberinfo",
					form : {
//						memberid : memberid
						"userNo":urId
					},
					success : function(data) {
						api.hideProgress();
						if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
							var result = data.datasources[0].rows[0];
//							membercode = result.membercode;
							//		membercode			var name = result.nick == null ? result.telphone : result.nick;
							//$('.name').html('用户id：' + userInfo.userNo);
							$('.guest').html(result.nickname);
							if (result.head_image != null) {
								$('#headurl').attr('src', rootUrl + result.head_image);
							}
//							api.setPrefs({
//								key : 'membercode',
//								value : membercode
//							});
						} else {
							api.alert({
								msg : '没有查到您的信息或者您的网络出问题了!'
							});
						}
					}
				});
			} else {
				api.alert({
					msg : '获取个人信息失败,请您重新加载！'
				});
			}
			api.hideProgress();
		}
	})
}

function touchstart(o) {
	o.style.backgroundColor = '#eaeaea';
	setTimeout(function() {
		aa.style.background = "#fff";
	}, 1000 * 0.2);
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
					api.openWin({//打开我的房间界面
						name : 'roomIndex',
						url : '../home/roomindex.html',
						pageParam : {
							memberid : memberid
						},
						slidBackEnabled : true,
						animation : {
							type : "push", //动画类型（详见动画类型常量）
							subType : "from_right", //动画子类型（详见动画子类型常量）
							duration : 300 //动画过渡时间，默认300毫秒
						}
					});
				} else {
					api.openWin({
						name : 'addroom',
						url : 'roominfo.html',
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

/**
 *重新刷新页面
 */
function refresh() {
	location.reload();
}

function close() {
	api.closeFrame({
	});
}

/**
 *铃铛上面小红点
 */
function setmsgnum() {
	//同步返回结果：
	var msgnum = api.getPrefs({
		sync : true,
		key : 'msgnum'
	});
	if (msgnum == 0) {
		$('#msgnum').hide();
	} else {
		$('#msgnum').show();
		$('#msgnum').html(msgnum);
	}
}

function hidepot() {
	$('#msgnum').hide();
	msgnum = api.getPrefs({
		sync : true,
		key : 'msgnum'
	});
}

/**
 *从新刷新头像
 */
function reloadheaderurl() {
	FileUtils.readFile("info.json", function(info, err) {
		PrefsUtil.setPrefs("hasLogon", info.hasLogon);
		PrefsUtil.setPrefs("memberid", info.memberid);
		memberid = info.memberid;
		//获得个人信息
		ProgressUtil.showProgress();
		AjaxUtil.exeScript({
			script : "managers.home.person",
			needTrascation : false,
			funName : "getmemberinfo",
			form : {
				memberid : memberid
			},
			success : function(data) {
				ProgressUtil.hideProgress();
				if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
					var result = data.datasources[0].rows[0];
					membercode = result.membercode;
					//					var name = result.nick == null ? result.telphone : result.nick;
					$('.name').html('用户id：' + userInfo.userNo);
					if (result.head_image != null) {
						$('#headurl').attr('src', rootUrl + result.head_image);
					}
					api.setPrefs({
						key : 'membercode',
						value : membercode
					});
				} else {
					api.alert({
						msg : '没有查到您的信息或者您的网络出问题了!'
					}, function(ret, err) {
						//coding...
					});
				}
			}
		});
	});
}

function hiddenphoto() {
	$(".zzc").hide();
	$(".completeMess").hide();
}

function getidentify() {
	api.showProgress();
	api.ajax({
		url : rootUrl + '/api/commmonweal/getimgcode',
		method : 'get',
		data : {
			values : {
				memberid : memberid
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.execStatus == 'false') {
				api.hideProgress();
				api.toast({
					msg : '验证码信息获取失败，请重试',
					duration : 2000,
					location : 'bottom'
				});
			} else {
				setTimeout(function() {
					setTimeout(function() {
						$(".verification img").attr('src', rootUrl + '/vcode/' + ret.formDataset.destfilename);
						api.hideProgress();
					}, 3000);
				}, 1000);
			}
		}
	})
}

function udateBeans() {
	var hartcount = api.getPrefs({
		sync : true,
		key : 'hartcount'
	});
	var ordinarybean = api.getPrefs({
		sync : true,
		key : 'ordinarybean'
	});
	var wptbean = api.getPrefs({
		sync : true,
		key : 'wptbean'
	});
	$("#dotleft").html(hartcount);
	$("#dotmidd").html(ordinarybean);
	$("#dotright").html(wptbean);
}

//function xiaoxi() {
//	api.openWin({//打开意见反馈
//		name : 'xiaoxi',
//		url : '../home/xiaoxi.html',
//		slidBackEnabled : true,
//		pageParam : {
//			memberid : memberid
//		},
//		animation : {
//			type : "push", //动画类型（详见动画类型常量）
//			subType : "from_right", //动画子类型（详见动画子类型常量）
//			duration : 300 //动画过渡时间，默认300毫秒
//		}
//	});
//}
function xiaoxi() {
	api.openWin({//打开意见反馈
		name : 'xiaoxi',
		url : 'myMessage.html',
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
}

function shezhi() {
	api.openWin({//打开意见反馈
		name : 'shezhi',
		url : '../home/shezhi.html',
		slidBackEnabled : true,
		pageParam : {
			memberid : memberid,
			uer:urId
		},
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}

/**
 *本地图片和拍照  0：本地，1：拍照
 * @param {Object} type
 */
function getPicture(type) {
	if (type == 0) {//本地相册
		api.getPicture({
			sourceType : 'library',
			mediaValue : 'pic',
			destinationType : 'url',
			allowEdit : true,
			quality : 100,
			//			targetWidth : 100,
			//			targetHeight : 100,
			saveToPhotoAlbum : false
		}, function(ret, err) {
			if (ret) {
				
				compress(ret.data);
			} else {
				//				alert(JSON.stringify(err));
				//				api.alert({
				//					msg : JSON.stringify(err)
				//				});
			}
		});
	} else {//拍照
		api.getPicture({
			sourceType : 'camera',
			encodingType : 'jpg',
			mediaValue : 'pic',
			destinationType : 'url',
			allowEdit : true,
			quality : 100,
			//			targetWidth : 100,
			//			targetHeight : 100,
			saveToPhotoAlbum : false
		}, function(ret, err) {
			if (ret) {
				compress(ret.data);
			} else {
				//				alert(JSON.stringify(err));
				//				api.alert({
				//					msg : JSON.stringify(err)
				//				});
			}
		});
	}
}

//图片压缩
function compress(compressPic) {
		var imgTempPath = compressPic.substring(compressPic.lastIndexOf("/"));
		var imageFilter = api.require('imageFilter');
		imageFilter.compress({
			img : compressPic,
			quality : 0.05,
			save : {
				imgPath : "fs://imgtemp",
				imgName : imgTempPath
			}
		}, function(ret, err) {
			if (ret.status) {
				headurls= "fs://imgtemp" + imgTempPath;
				changeheadurl(headurls);
			} else {
				alert(JSON.stringify(err));
			}
		});
	}


function changeheadurl(headurl) {
	if (headurl) {
		ProgressUtil.showProgress();
		api.ajax({
			url : rootUrl + '/api/upload',
			method : 'post',
			data : {
				files : {
					file : headurl
				},
			}
		}, function(ret, err) {
			api.hideProgress();
			if (ret.execStatus == 'true') {
				headurl = ret.formDataset.saveName;
				AjaxUtil.exeScript({
					script : "managers.home.person",
					needTrascation : false,
					funName : "updatememberinfo",
					form : {
						headurl : headurl,
						nick : "",
						sex : "",
						birthday : "",
						address : "",
						telphone : "",
						pwd : "",
						memberid : memberid,
						userNo:urId.substr(0,1)
					},
					success : function(data) {
						api.hideProgress();
						if (data.execStatus == 'true') {
							$('#headurl').attr('src', headurl);
							api.execScript({//刷新person界面数据
								name : 'root',
								frameName : 'room',
								script : 'refresh();'
							});
						}
					}
				});

			} else {
				api.alert({
					msg : '上传图片失败,请您从新上传'
				});
			}
		});
	}
}
