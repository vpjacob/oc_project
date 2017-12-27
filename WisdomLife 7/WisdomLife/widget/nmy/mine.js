var memberid = "";
var urId = "";
apiready = function() {
	if (api.systemType == 'ios') {
		var cc = $api.dom('.bar');
		var bb = $api.dom('.topImg');
		var aa = $api.dom('.justify');
//		$api.css(cc, 'line-height:3.2rem');
//		$api.css(cc, 'height:2.45rem');
		$("#shareToContact").show();
     if (api.screenHeight == 2436){
            $api.css(cc, ' top: 1.45rem');
        }else{
            $api.css(cc, ' top: 0.45rem');
        }
		$api.css(bb, ' top: 2.2rem');
		$api.css(aa, ' top: 2.2rem');
	};
	urId = api.getPrefs({
		sync : true,
		key : 'userNo'
	});
	systemType = api.systemType;
	if (systemType == 'ios') {
		headerH = 20;
	} else {
		headerH = 0;
	}
	footerH=50;
	frameH = api.winHeight - headerH - footerH;
	/**
	 * 获取memberid，并获取个人的相关信息
	 */
	memberid = api.getPrefs({
		sync : true,
		key : 'memberid'
	});
	function init(){
		getUesrInfo(memberid);
		count(urId);
		//调用可用积分
		queryAllAccountInfo(urId);
		//进入我的主页查看是否有未读消息 
		checkIsHaveMsg(urId);
	}
	init();
	$('#name').html('id:' + urId);
	//获取用户个人信息和推送状态
	function getUesrInfo(memberid) {
		AjaxUtil.exeScript({
			script : "mobile.center.message.message",
			needTrascation : false,
			funName : "getmessageStatus",
			form : {
				memberid : memberid
			},
			success : function(data) {
				if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
					//推送状态值
					satatus = data.datasources[0].rows[0].messagestatus;
					//获取个人信息
					AjaxUtil.exeScript({
						script : "managers.home.person",
						needTrascation : false,
						funName : "getmemberinfo",
						form : {
							"userNo" : urId
						},
						success : function(data) {
							console.log('用户信息'+$api.jsonToStr(data));
							if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
								var result = data.datasources[0].rows[0];
								if (result.head_image == null || result.head_image=="" ||  result.head_image=="undefined") {
									$('#headurl').attr('src', "images/myHold.jpg");
								} else {
									$('#headurl').attr('src', rootUrl + result.head_image);
								};
								if (result.sexname == null || result.sexname=="" ||  result.sexname=="undefined") {
									$('#sex').attr('src', "images/my-man.png");
								} else if(result.sexname=="男"){
									$('#sex').attr('src', "images/my-man.png");
								} else if(result.sexname=="女"){
									$('#sex').attr('src', "images/mu-girl.png");
								};
//								if (result.nickname == null || result.nickname=="" ||  result.nickname=="undefined") {
//									$('#name').html('小客');
//								}else{
//									$('#name').html(result.nickname);
//								};
								if(result.my_level==0){
									$("#lv").attr("src","images/lv0.png");
									$("#lv").show();
								}else if(result.my_level==1){
									$("#lv").attr("src","images/lv1.png");
									$("#lv").show();
								}else if(result.my_level==2){
									$("#lv").attr("src","images/lv2.png");
									$("#lv").show();
								}else if(result.my_level==3){
									$("#lv").attr("src","images/lv3.png");
									$("#lv").show();
								}else if(result.my_level==4){
									$("#lv").attr("src","images/lv4.png");
									$("#lv").show();
								}else if(result.my_level==5){
									$("#lv").attr("src","images/lv5.png");
									$("#lv").show();
								}else if(result.my_level==6){
									$("#lv").attr("src","images/lv6.png");
									$("#lv").show();
								}
							} else {
								api.toast({
									msg : '没有查到您的信息或者您的网络出问题了!'
								});
							}
						}
					});
				} else {
					api.toast({
						msg : '没有查询到推送状态！'
					});
				}
			}
		})
	}
	//进入我的主页查看是否有未读消息
	function checkIsHaveMsg(urId) {
//		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.center.message.message",
			needTrascation : true,
			funName : "checkIsHaveMsg",
			form : {
				userNo : urId
			},
			success : function(data) {
				console.log('进入我的主页查看是否有未读消息'+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.isHave;
//					alert(account);
					if(String(account)=='1'){
						$("#message").attr("src","images/hasMessage.png");
					}else if(String(account)=='0'){
						$("#message").attr("src","images/mineMessage.png");
					}
				} else {
					api.toast({
	                    msg:data.formDataset.errorMsg
                    });
				}
			}
		});
	};
	//更换头像
	$(".pic").click(function() {
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
				saveToPhotoAlbum : false
			}, function(ret, err) {
				if (ret) {
					compress(ret.data);
				} else {
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
				saveToPhotoAlbum : false
			}, function(ret, err) {
				if (ret) {
					api.showProgress();
					compress(ret.data);
					api.hideProgress();
				} else {
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
			quality : 0.3,
			save : {
				imgPath : "fs://imgtemp",
				imgName : imgTempPath
			}
		}, function(ret, err) {
			if (ret.status) {
				headurls = "fs://imgtemp" + imgTempPath;
				changeheadurl(headurls);
			} else {
				api.toast({
	                msg:JSON.stringify(err)
                });
			}
		});
	}
	//图片上传	
	function changeheadurl(headurl) {
		if (headurl) {
			api.showProgress();
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
							userNo : urId.substr(0, 1)
						},
						success : function(data) {
							api.hideProgress();
							console.log($api.jsonToStr(data));
							if (data.execStatus == 'true') {
								$('#headurl').attr('src', rootUrl + headurl);
								location.reload();
							}
						}
					});

				} else {
					api.toast({
						msg : '上传图片失败,请您从新上传'
					});
				}
			});
		}
	}

	//总计的方法
	function count(urId) {
//		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myegg",
			needTrascation : true,
			funName : "queryEggInfo",
			form : {
				userNo : urId
			},
			success : function(data) {
//				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.account;
					var list = $api.strToJson(account);
					console.log($api.jsonToStr(list));
					$("#dotleft").html(list.gold_egg_count);
					$("#dotmidd").html(list.silver_egg_count);
					$("#dotright").html(list.may_buyback);
				} else {
					api.toast({
	                    msg:data.formDataset.errorMsg
                    });
				}
			}
		});
	};
	
	
	function queryAllAccountInfo(urId) {
		AjaxUtil.exeScript({
			script : "mobile.accountdetail.accountdetail",
			needTrascation : true,
			funName : "queryAllAccountInfo",
			form : {
				userNo : urId
			},
			success : function(data) {
				console.log("可用积分"+$api.jsonToStr(data));
				var listInfo = data.formDataset;
				var list = $api.jsonToStr(data.formDataset);
				if (data.formDataset.checked == 'true') {
					data.formDataset.integral_balance  == 0 ? $('#usableIntegral').html(0) : $('#usableIntegral').html(data.formDataset.integral_balance);
				} else {
					api.toast({
	                    msg:data.formDataset.errorMsg
                    });
				}
			}
		});
	}
	
//扫一扫支付跳转
$('#payMoney').click(function() {
	var scanner = api.require('scanner');
	scanner.open(function(ret, err) {
		if (ret.eventType == 'success') {
			var content = ret.msg.split(",");
			AjaxUtil.exeScript({
				script : "mobile.center.pay.pay",
				needTrascation : true,
				funName : "getMerchantNo",
				form : {
					merchantNo : content[0],
//					merchantName : content[1],
				},
				success : function(formset) {
					console.log($api.jsonToStr(formset));
					if (formset.execStatus == "true") {
						var mNo = formset.formDataset.mNo;
						var mName = formset.formDataset.mName;
						if (mNo == '9999' && (content[2] != '1' || content[2] != '2')) {
							api.toast({
								msg : "扫描信息不正确，请扫描正确的二维码！"
							});
						} else {
							api.openWin({//详情界面
								name : 'myPay',
								url : '../html/personal/myPay.html',
								slidBackEnabled : true,
								animation : {
									type : "push", //动画类型（详见动画类型常量）
									subType : "from_right", //动画子类型（详见动画子类型常量）
									duration : 300 //动画过渡时间，默认300毫秒
								},
								pageParam : {
									merchantNo : mNo,
									merchantName : mName,
									type : content[2]
								}
							});
						}
					} else {
						api.toast({
							msg : "操作失败，请重新扫描一下试试！"
						});
						return false;
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					api.alert({
						msg : "您的网络是否已经连接上了，请检查一下！"
					});
				}
			});

		} else {
			console.log("扫描支付二维码返回：" + JSON.stringify(err));
		}
	});
});

//我的订单跳转
	$('#myrecord').click(function() {
		api.openWin({
			name : 'myrecord',
			url : '../html/wallet/myrecord.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
//会员规则跳转
$('#lv').click(function() {
		api.openWin({
			name : 'vipGz',
			url : 'vipGz.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
    //shareToContact
	$('#shareToContact').click(function() {
			api.accessNative({
				name : 'shareToContact',
				extra : {

				}
			}, function(ret, err) {
				if (ret) {
					// alert(JSON.stringify(ret));
				} else {
					//  alert(JSON.stringify(err));
				}
			});

		});
	//我的金蛋   
//	$('#myegg').click(function() {
//		api.openWin({
//			name : 'myegg',
//			url : '../html/wallet/myegg.html',
//			reload : true,
//			slidBackEnabled : true,
//			animation : {
//				type : "push", //动画类型（详见动画类型常量）
//				subType : "from_right", //动画子类型（详见动画子类型常量）
//				duration : 300 //动画过渡时间，默认300毫秒
//			}
//		});
//	});
	$('#myegg').click(function() {
		api.openWin({
			name : 'myegg',
			url : '../stealEgg/html/myegg.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//金蛋购买
	$('#buyEgg').click(function() {
		api.openWin({
			name : 'buyEgg',
			url : '../html/wallet/buyEgg.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//回购
	$('#buyback').click(function() {
		checkBuyback();
	});
	//查询回购开关是否开启
	function checkBuyback() {
		AjaxUtil.exeScript({
			script : "mobile.buyback.buyback",
			needTrascation : true,
			funName : "queryBuyBackIsOpen",
			form : {
				userNo : urId
			},
			success : function(data) {
				console.log("查询回购开关是否开启"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					if(String(data.formDataset.isOpen) == "1" ){
						checkIsMayBuyBack();
					}else if(String(data.formDataset.isOpen) == "0"){
						api.openWin({
							name : 'buyback',
							url : '../html/wallet/buyback.html',
							reload : true,
							slidBackEnabled : true,
							animation : {
								type : "push", //动画类型（详见动画类型常量）
								subType : "from_right", //动画子类型（详见动画子类型常量）
								duration : 300 //动画过渡时间，默认300毫秒
							}
						});
					}else if(String(data.formDataset.isOpen) == "3"){
						api.alert({
	                        msg:data.formDataset.errorMsg
                        });
					}
				} else {
					console.log(data.formDataset.errorMsg);
				}
			}
		});
	};
	
	//回购显示状态
	function checkIsMayBuyBack() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.buyback.buyback",
			needTrascation : true,
			funName : "checkIsMayBuyBack",
			form : {
				userNo : urId
			},
			success : function(data) {
				api.hideProgress();
				console.log("回购回显状态"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					//校验通过
					if(String(data.formDataset.status)=="1"){
						api.openWin({
							name : 'buyback',
							url : '../html/wallet/buyback.html',
							reload : true,
							slidBackEnabled : true,
							animation : {
								type : "push", //动画类型（详见动画类型常量）
								subType : "from_right", //动画子类型（详见动画子类型常量）
								duration : 300 //动画过渡时间，默认300毫秒
							}
						});
					}else if(String(data.formDataset.status)=="2"){//回购资格不够
						$("#buyBackImg").attr("src","../image/award/bjNot.png");
						$(".tankuang_box").show();
					}else if(String(data.formDataset.status)=="3"){//已经回购了
						$("#buyBackImg").attr("src","../image/award/bjHade.png");
						$(".tankuang_box").show();
					}
				} else {
					console.log(data.formDataset.errorMsg);
				}
			},
			error : function(xhr, type) {
				api.hideProgress();
				api.toast({
	                msg:'您的网络不给力啊，检查下是否连接上网络了！'
                });
			}
		});
	};
	//跳转商城
	$(".gotoBus").click(function(){
		api.openWin({
			name : 'goldCount',
			url : '../shangjia/html/buyList.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
		$(".tankuang_box").hide();
	});
	//关闭当前弹出框
	$("#close").click(function(){
		$(".tankuang_box").hide();
	});
	
	//金明细跳转
	$('#incomeInfo').click(function() {
		api.openWin({
			name : 'goldCount',
			url : '../html/personal/goldCount.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//支付明细
	$('#payRecord').click(function() {
		api.openWin({
			name : 'payRecord',
			url : '../html/personal/payRecord.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		})
	}); 
	//物流跳转
	$('#myDeal').click(function() {
		api.openWin({
			name : 'payRecord',
			url : '../html/personal/mydeal.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		})
	});
	//兑换记录
	$('#eggDh').click(function() {
		api.openWin({
			name : 'payRecord',
			url : '../html/personal/eggDh.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		})
	});
	//小客福利
	$("#welfare").bind("click", function() {
		api.openWin({//打开有设备的界面
			name : 'allType',
			url : '../html/award/welfare.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//点击我的设备
	$("#mydevice").bind("click", function() {
		api.openWin({//打开有设备的界面
			name : 'allType',
			url : '../html/equipment/allType.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//我的收藏
	$("#more").click(function(){
		api.openWin({
			name : 'payRecord',
			url : '../html/personal/myCollect.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		})
	})
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
					url : '../html/personal/myReferer.html',
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
	//意见反馈
	$("#myfeedback").bind("click", function() {
		api.openWin({//打开意见反馈
			name : 'feedback',
			url : '../html/personal/feedback.html',
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
	
	//好友管理
	$("#addressBook").bind("click", function() {
		api.openWin({
			name : 'addressBook',
			url : '../friendManage/html/addressBook.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
};

//跳转消息列表
function xiaoxi() {
	api.openWin({//打开意见反馈
		name : 'xiaoxi',
		url : '../html/personal/myMessage.html',
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

//跳转设置
function shezhi() {
	api.openWin({//打开意见反馈
		name : 'shezhi',
		url : '../html/home/shezhi.html',
		slidBackEnabled : true,
		pageParam : {
			memberid : memberid,
			uer : urId
		},
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
};
function refresh() {
	location.reload();
}
function close() {
	api.closeFrame({
	});
}
