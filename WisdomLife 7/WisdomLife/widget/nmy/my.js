var memberid = "";
var urId = "";
apiready = function() {
	if (api.systemType == 'ios') {
		var cc = $api.dom('.bar');
		var bb = $api.dom('.topImg');
		var aa = $api.dom('.justify');
//		$api.css(cc, 'line-height:3.2rem');
//		$api.css(cc, 'height:2.45rem');
		$api.css(cc, ' top: 0.45rem');
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
	}
	init();
	$('#name').html('用户id：' + urId);
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
							console.log($api.jsonToStr(data));
							if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
								var result = data.datasources[0].rows[0];
								if (result.head_image == null || result.head_image=="" ||  result.head_image=="undefined") {
									$('#headurl').attr('src', "images/my-header.png");
								} else {
									$('#headurl').attr('src', rootUrl + result.head_image);
								}
								if (result.sexname == null || result.sexname=="" ||  result.sexname=="undefined") {
									$('#sex').attr('src', "images/my-man.png");
								} else if(result.sexname=="男"){
									$('#sex').attr('src', "images/my-man.png");
								} else if(result.sexname=="女"){
									$('#sex').attr('src', "images/mu-girl.png");
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
	//我的金蛋   
	$('#myegg').click(function() {
		api.openWin({
			name : 'myegg',
			url : '../html/wallet/myegg.html',
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
		api.openWin({
			name : 'myegg',
			url : '../html/wallet/buyback.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
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
	$("#more").click(function(){
		api.toast({
	        msg:'敬请期待！'
        });
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
	//调用图片
	function queryMyCenterCarousel() {
		AjaxUtil.exeScript({
			script : "mobile.center.homepage.homepage",
			needTrascation : true,
			funName : "queryMyCenterCarousel",
			form : {},
			success : function(data) {
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var placeTwoList=$api.strToJson(data.formDataset.carouselList);
					for(var i=0;i<placeTwoList.length;i++){
						if(String(placeTwoList[i].place_no)=="1"){
							$("#firTopLef").attr("src",''+rootUrl+placeTwoList[i].img_url+'');
							$("#firTopLef").attr("data",''+placeTwoList[i].skip_no+'');
							$("#firTopLef").attr("datas",''+placeTwoList[i].skip_url+'');
//							$("#firTopLef").siblings().html(placeTwoList[i].title);
						};
						if(String(placeTwoList[i].place_no)=="2"){
							$("#firTopMid").attr("src",''+rootUrl+placeTwoList[i].img_url+'');
							$("#firTopMid").attr("data",''+placeTwoList[i].skip_no+'');
							$("#firTopMid").attr("datas",''+placeTwoList[i].skip_url+'');
							$("#firTopMid").siblings().html(placeTwoList[i].title);
						};
						if(String(placeTwoList[i].place_no)=="3"){
							$("#firTopRig").attr("src",''+rootUrl+placeTwoList[i].img_url+'');
							$("#firTopRig").attr("data",''+placeTwoList[i].skip_no+'');
							$("#firTopRig").attr("datas",''+placeTwoList[i].skip_url+'');
							$("#firTopRig").siblings().html(placeTwoList[i].title);
						};
					};
				} else {
//					alert(data.formDataset.errorMsg);
				}
			}
		});
	};
	queryMyCenterCarousel();
	//获取商品id
	var browser = api.require('webBrowser');
	function queryGoodOrMerchantByNo(skipNo){
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.center.homepage.homepage",
			needTrascation : true,
			funName : "queryGoodOrMerchantByNo",
			form : {
				skipNo: skipNo
			},
			success : function(data) {
				api.hideProgress();
				console.log("获取商家或商品Id" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					//走商家
					if(data.formDataset.skipType=="1"){
						api.openWin({//商家详情界面
							name : 'business-man-list',
							url : '../sjDetail/business-man-list.html',
							slidBackEnabled : true,
							animation : {
								type : "push", //动画类型（详见动画类型常量）
								subType : "from_right", //动画子类型（详见动画子类型常量）
								duration : 300 //动画过渡时间，默认300毫秒
							},
							pageParam : {
								id : data.formDataset.skipId,
								companytype : data.formDataset.skipId
							}
						});
										
					}else if(data.formDataset.skipType=="2"){
						api.openWin({//详情界面
							name : 'buyListInfo',
							url : '../shangjia/html/buyListInfo.html',
							slidBackEnabled : true,
							animation : {
								type : "push", //动画类型（详见动画类型常量）
								subType : "from_right", //动画子类型（详见动画子类型常量）
								duration : 300 //动画过渡时间，默认300毫秒
							},
							pageParam : {
								id : data.formDataset.skipId
							}
						});
					
					}
				
				} else {
					
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
	//第一部分
//	$("#firstImgBox").on("click","img",function(){
//		var skipNo=$(this).attr("data");
//		var skipurl=$(this).attr("datas");
////		alert(skipurl);
//		if(skipNo=="" || String(skipNo)=="null" || String(skipNo)=="undefined"){
//			api.confirm({
//				title : '提示',
//				msg : '您即将跳转到' + skipurl,
//				buttons : ['确定', '取消']
//			}, function(ret, err) {
//				var index = ret.buttonIndex;
//				if (index == 1) {
//					browser.open({
//						url : skipurl
//					});
//				}
//			})
//		}else if(skipurl=="" || String(skipurl)=="null" || String(skipurl)=="undefined"){
//			//获取商品或商家id
//			queryGoodOrMerchantByNo(skipNo);
//		};
//	});
	$("#firstImgBox").on("click","img",function(){
		var skipNo=$(this).attr("data");
		var skipurl=$(this).attr("datas");
		console.log("**********"+skipNo+"**"+skipurl);
		if (String(skipurl) == "000000") {
			api.openFrame({//商家列表
				name : 'commonProvider',
				url : '../shangjia/html/newIndex.html',
				bounces : false,
				reload : true,
				rect : {
					x : 0,
					y : 0,
					w : 'auto',
					h : frameH + headerH,
				}
			});

		} else if(String(skipurl) == "111111") {
			api.openWin({//商城列表
				name : 'busList',
				url : '../shangjia/html/buyList.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		}else if(skipNo=="" || String(skipNo)=="null" || String(skipNo)=="undefined"){
			api.confirm({
				title : '提示',
				msg : '您即将跳转到' + skipurl,
				buttons : ['确定', '取消']
			}, function(ret, err) {
				var index = ret.buttonIndex;
				if (index == 1) {
					browser.open({
						url : skipurl
					});
				}
			})
		}else if(skipurl=="" || String(skipurl)=="null" || String(skipurl)=="undefined"){
			//获取商品或商家id
			queryGoodOrMerchantByNo(skipNo);
		};
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
