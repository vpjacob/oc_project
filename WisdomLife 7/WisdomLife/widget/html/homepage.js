var urId = "";
var cityname="";
var lat="";
var lon="";
var weatherInfo={};
var FirWeaInfoReal={};
//默认的用户信息
var newsTypes = new Array('guonei', 'shehui', 'yule', 'caijing', 'junshi');
//新闻页数
var page = 1;
var x = '';
var secWeaInfo={};
//默认的用户信息数量
var msgnum = 0;
apiready = function() {
	bMap = api.require('bMap');
	var cc = $api.dom('.address');
	systemType = api.systemType;
	if (systemType == 'ios') {
		
        if (api.screenHeight == 2436){
            headerH = 44;
            $api.css(cc, 'margin-top:1.5rem;');
        }else{
            headerH = 20;
            $api.css(cc, 'margin-top:0.8rem;');
        }
	} else {
		headerH = 0;
	}
	//footer高度为css样式中声明的30px
//	footerH = $("#footer").css("height").split("px")[0];
	footerH=50;
//	alert($("#footer").css("height").split("px")[0]);
	//frame的高度为当前window高度减去header和footer的高
	frameH = api.winHeight - headerH - footerH;

	api.setPrefs({
		key : 'headerH',
		value : headerH
	});
	api.setPrefs({
		key : 'footerH',
		value : footerH
	});
	api.setPrefs({
		key : 'frameH',
		value : frameH
	});
	urId = api.getPrefs({
		sync : true,
		key : 'userNo'
	});
	//下拉刷新
	api.setRefreshHeaderInfo({
		loadingImg : '../image/mainbus.jpg',
		bgColor : '#ccc',
		textColor : '#fff',
		textDown : '下拉刷新...',
		textUp : '松开刷新...',
		showTime : false
	}, function(ret, err) {
		if(ret){
			location.reload();
			//清空当前的城市名字
			api.setPrefs({
				key : 'cityname',
				value : ''
			});
			api.refreshHeaderLoadDone();
		}else{
			api.toast({
	            msg:err
            });
		}
		
	}); 
	//地址
	$(document).on('click', '#location', function() {
		api.openWin({
			name : 'add_city',
			url : 'home/add_city.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	isHaveEgg(urId);
	//检查是否为新人
	checkIsNewUser();
	hasLogon = api.getPrefs({
		sync : true,
		key : 'hasLogon'
	});
	memberid = api.getPrefs({
		sync : true,
		key : 'memberid'
	});
	//回到应用事件
	api.addEventListener({
		name : 'resume'
	}, function(ret, err) {

		connectionType = api.connectionType;
		//比如： wifi
		if (connectionType == 'none' || connectionType == "unknown") {
			
		} else {
			setUserKeyInfos();

		}

	});
	api.addEventListener({
		name : 'pause'
	}, function(ret, err) {
		api.removeEventListener({
			name : 'shake'
		});
	});

	connectionType = api.connectionType;
	//比如： wifi
	if (connectionType == 'none' || connectionType == "unknown") {
			$('.key').hide();
	} else {
		//有网进行定位
		setUserKeyInfos();
	}
	//读取news.json中的新闻列表
	FileUtils.readFile("news.json", function(data) {
		if (data == undefined || data.length == undefined) {
			writeandreadNews();
		} else {
			loadmainNews(data);
		};

	});
	//加载日期
	$("#todayDay").html(DateUtils.getTodayDate());
	$("#todayWeek").html(DateUtils.getWeekDay(0));
	
	//设备开门钥匙
	if (String(hasLogon) == 'true') {
//		setUserKeyInfos();
		api.accessNative({
			name : 'ShowKey',
			extra : { }
		}, function(ret, err) {
			if (ret) {
				if (ret.msg == 'true') {
					$('#key').show();
				} else {
					$('#key').hide();
				}
			} else {
			}
		});
	};
	/**
	 * 点击钥匙图标进行开门按钮
	 */
	$(".key").click(function() {
		//智果开门
		api.accessNative({
			name : 'Onceopen',
			extra : { },
		}, function(ret, err) {
			if (ret) {
			
			} else {
				
			}
		});
	});
	/**
	 *极光的初始化和设置监听
	 */
	var systemType = api.systemType;
	var ajpush = api.require('ajpush');
	ajpush.setListener(function(ret) {
		var content = ret.content;
		if (systemType == 'ios') {
			api.notification({
				notify : {
					content : content
				}
			}, function(ret, err) {
				var id = ret.id;
			});
		}

	});
	if (systemType == 'android') {
		api.addEventListener({
			name : 'appintent'
		}, function(ret, err) {
			if (ret) {
				console.log($api.jsonToStr(ret));
				api.openWin({
					name : 'myMessage',
					url : 'personal/myMessage.html',
					pageParam : {
						relateid : urId
					},
					slidBackEnabled : true,
					animation : {
						type : "push", //动画类型（详见动画类型常量）
						subType : "from_right", //动画子类型（详见动画子类型常量）
						duration : 300 //动画过渡时间，默认300毫秒
					}
				});
			}
		});
	} else if (systemType == 'ios') {
		api.addEventListener({
			name : 'noticeclicked'
		}, function(ret, err) {
			if (ret) {
				api.openWin({
					name : 'myMessage',
					url : 'personal/myMessage.html',
					pageParam : {
						relateid : urId
					},
					slidBackEnabled : true,
					animation : {
						type : "push", //动画类型（详见动画类型常量）
						subType : "from_right", //动画子类型（详见动画子类型常量）
						duration : 300 //动画过渡时间，默认300毫秒
					}
				});
			}
		})
	};
	//扫一扫支付跳转	
	$('#scan').click(function() {
		var scanner = api.require('scanner');
		if (String(hasLogon) != 'true') {
			api.openWin({//打开登录界面
				name : 'login',
				url : 'registe/logo.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else {
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
								api.alert({
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
		}
	});

	//检验是否有蛋
	function isHaveEgg(urId) {
		AjaxUtil.exeScript({
			script : "mobile.myegg.myegg",
			needTrascation : true,
			funName : "checkIsHaveGoldEgg",
			form : {
				userNo : urId
			},
			success : function(data) {
				if (data.formDataset.checked == 'true') {
					if (data.formDataset.isHaveEgg == 'true') {
						isBeat(urId);
					} else {
						noEgg();
					}

				} else {
					//alert(data.formDataset.errorMsg);
				}
			}
		});
	}

	//检验是否可砸
	function isBeat(urId) {
		AjaxUtil.exeScript({
			script : "mobile.myegg.myegg",
			needTrascation : true,
			funName : "checkIsBeatGoldEgg",
			form : {
				userNo : urId
			},
			success : function(data) {
				if (data.formDataset.checked == 'true') {
					if (data.formDataset.isBeat == 'true') {
//						$('#mainEgg').show();
						$('.showEgg').show();
						$('#mainEgg').attr('src', '../image/mainEgg.jpg');
					} else {
						noEgg();
					}

				} else {
					//	alert(data.formDataset.errorMsg);
				}
			}
		});
	}

	//没有金蛋方法
	function noEgg() {
		$('.showEgg').show();
		$('#mainEgg').attr('src', '../image/mainEggGraey.jpg');
	};
	//点击金蛋进行跳转
	$('#mainEgg').click(function() {
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
	//点击商城进行跳转
	$(".gotoBus").click(function() {
		api.openWin({
			name : 'buyList',
			url : '../shangjia/html/buyList.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//新人奖
	$(".goToAward").click(function() {
		$(".tankuang_box").css("display", "none");
		api.openWin({
			name : 'clickAward',
			url : 'award/clickAward.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//检测是否为新用户
	function checkIsNewUser() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myaward",
			needTrascation : true,
			funName : "checkIsNewUser",
			form : {
				userNo : urId
			},
			success : function(data) {
				api.hideProgress();
				console.log("检测是否为新用户" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var list = data.formDataset.isNewUser;
					if (list == 1) {
						queryIsGetAward();
					}

				} else {
					//					alert(data.formDataset.errorMsg);
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
	//检测是否已抽奖
	function queryIsGetAward() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myaward",
			needTrascation : true,
			funName : "queryIsGetAward",
			form : {
				userNo : urId
			},
			success : function(data) {
				api.hideProgress();
				console.log("检测是否已抽奖" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var list = data.formDataset.isGet;
					if (list == 1) {
						$(".tankuang_box").show();
					}
				} else {
					//					alert(data.formDataset.errorMsg);
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
	
	//homwpage轮播图
	function queryHomePageInfo(){
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.center.homepage.homepage",
			needTrascation : true,
			funName : "queryHomePageInfo",
			form : {},
			success : function(data) {
				api.hideProgress();
				console.log("homwpage轮播图" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					//走标题的
					$("#placeOneName").html(data.formDataset.placeOneName);
					$("#placeTwoName").html(data.formDataset.placeTwoName);
					$("#placeThreeName").html(data.formDataset.placeThreeName);
					//weather天气部分
					$("#weatherback").css('background', 'url('+rootUrl+$api.strToJson(data.formDataset.weather).img_url+') no-repeat 0 0');
					$("#weatherback").css('background-size', '100% 100%');
					$("#weatherback").attr('data',''+$api.strToJson(data.formDataset.weather).skip_no+'');
					$("#weatherback").attr('datas',''+$api.strToJson(data.formDataset.weather).skip_url+'');
					//商城本月精选
					var placeOneList=$api.strToJson(data.formDataset.placeOneList);
					var nowli = "";
					for(var i=0;i<placeOneList.length;i++){
						nowli+='<div class="swiper-slide" data="'+placeOneList[i].skip_no+'" datas="'+placeOneList[i].skip_url+'" ><img src="'+rootUrl+placeOneList[i].img_url+'" alt="" /></div>'	     
					}
					$('#adver').html(nowli);
					var swiper = new Swiper('.swiper-containerlrf', {
					    paginationClickable: true,
					    autoplayDisableOnInteraction: false,
					    centeredSlides: true,
					    slidesPerView: 1,
					    watchActiveIndex: true,
					    initialSlide: 1,
					    spaceBetween : -50,
					    autoplay : 2500,
						loop : true,
						observer:true,//修改swiper自己或子元素时，自动初始化swiper
					   	observeParents:true//修改swiper的父元素时，自动初始化swiper
					});
					//第一部分
					var placeTwoList=$api.strToJson(data.formDataset.placeTwoList);
					for(var i=0;i<placeTwoList.length;i++){
						if(String(placeTwoList[i].place_no)=="1"){
							$("#firTopLef").attr("src",''+rootUrl+placeTwoList[i].img_url+'');
							$("#firTopLef").attr("data",''+placeTwoList[i].skip_no+'');
							$("#firTopLef").attr("datas",''+placeTwoList[i].skip_url+'');
						};
						if(String(placeTwoList[i].place_no)=="2"){
							$("#firTopRig").attr("src",''+rootUrl+placeTwoList[i].img_url+'');
							$("#firTopRig").attr("data",''+placeTwoList[i].skip_no+'');
							$("#firTopRig").attr("datas",''+placeTwoList[i].skip_url+'');
						};
						if(String(placeTwoList[i].place_no)=="3"){
							$("#firBotLef").attr("src",''+rootUrl+placeTwoList[i].img_url+'');
							$("#firBotLef").attr("data",''+placeTwoList[i].skip_no+'');
							$("#firBotLef").attr("datas",''+placeTwoList[i].skip_url+'');
						};
						if(String(placeTwoList[i].place_no)=="4"){
							$("#firBotRig").attr("src",''+rootUrl+placeTwoList[i].img_url+'');
							$("#firBotRig").attr("data",''+placeTwoList[i].skip_no+'');
							$("#firBotRig").attr("datas",''+placeTwoList[i].skip_url+'');
						};
					};
					//第二部分
					var placeThreeList=$api.strToJson(data.formDataset.placeThreeList);
					for(var i=0;i<placeThreeList.length;i++){
						if(String(placeThreeList[i].place_no)=="1"){
							$("#secTopLef").attr("src",''+rootUrl+placeThreeList[i].img_url+'');
							$("#secTopLef").attr("data",''+placeThreeList[i].skip_no+'');
							$("#secTopLef").attr("datas",''+placeThreeList[i].skip_url+'');
						};
						if(String(placeThreeList[i].place_no)=="2"){
							$("#secTopRig").attr("src",''+rootUrl+placeThreeList[i].img_url+'');
							$("#secTopRig").attr("data",''+placeThreeList[i].skip_no+'');
							$("#secTopRig").attr("datas",''+placeThreeList[i].skip_url+'');
						};
						if(String(placeThreeList[i].place_no)=="3"){
							$("#secMidLef").attr("src",''+rootUrl+placeThreeList[i].img_url+'');
							$("#secMidLef").attr("data",''+placeThreeList[i].skip_no+'');
							$("#secMidLef").attr("datas",''+placeThreeList[i].skip_url+'');
						};
						if(String(placeThreeList[i].place_no)=="4"){
							$("#secMidRig").attr("src",''+rootUrl+placeThreeList[i].img_url+'');
							$("#secMidRig").attr("data",''+placeThreeList[i].skip_no+'');
							$("#secMidRig").attr("datas",''+placeThreeList[i].skip_url+'');
						};
						if(String(placeThreeList[i].place_no)=="5"){
							$("#secBotLef").attr("src",''+rootUrl+placeThreeList[i].img_url+'');
							$("#secBotLef").attr("data",''+placeThreeList[i].skip_no+'');
							$("#secBotLef").attr("datas",''+placeThreeList[i].skip_url+'');
						};
						if(String(placeThreeList[i].place_no)=="6"){
							$("#secBotMid").attr("src",''+rootUrl+placeThreeList[i].img_url+'');
							$("#secBotMid").attr("data",''+placeThreeList[i].skip_no+'');
							$("#secBotMid").attr("datas",''+placeThreeList[i].skip_url+'');
						};
						if(String(placeThreeList[i].place_no)=="7"){
							$("#secBotRig").attr("src",''+rootUrl+placeThreeList[i].img_url+'');
							$("#secBotRig").attr("data",''+placeThreeList[i].skip_no+'');
							$("#secBotRig").attr("datas",''+placeThreeList[i].skip_url+'');
						};
					};
					//第三部分
					var placeFourList=$api.strToJson(data.formDataset.placeFourList);
					for(var i=0;i<placeFourList.length;i++){
						if(String(placeThreeList[i].place_no)=="1"){
							$("#threeTop").attr("src",''+rootUrl+placeFourList[i].img_url+'');
							$("#threeTop").attr("data",''+placeFourList[i].skip_no+'');
							$("#threeTop").attr("datas",''+placeFourList[i].skip_url+'');
							$("#threeTop").siblings().html(placeFourList[i].title);
						};
						if(String(placeThreeList[i].place_no)=="2"){
							$("#threeBot").attr("src",''+rootUrl+placeFourList[i].img_url+'');
							$("#threeBot").attr("data",''+placeFourList[i].skip_no+'');
							$("#threeBot").attr("datas",''+placeFourList[i].skip_url+'');
							$("#threeBot").siblings().html(placeFourList[i].title);
						};
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
	queryHomePageInfo();
	var browser = api.require('webBrowser');
//	$("#weatherback").click(function(){
//		var skipNo=$(this).attr("data");
//		var skipurl=$(this).attr("datas");
//		if(skipNo!=""){
//			//获取商品或商家id
//			queryGoodOrMerchantByNo(skipNo);
//		}else if(skipurl!=""){
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
//
//		};
//	});
	$("#weatherback").click(function(){
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
				},
				pageParam : {
		          prefShop : true
		        },
			});
		} else if(String(skipurl) == "222222") {
			api.openWin({//金蛋商城列表
				name : 'eggstore',
				url : '../shangjia/eggstore/eggMain.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else if(String(skipurl) == "333333") {
			api.openWin({//积分商城列表
				name : 'integralStore',
				url : '../shangjia/integralStore/eggMain.html',
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
	//本月精选
	$("#adver").on("click",".swiper-slide",function(){
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
				},
				pageParam : {
		          prefShop : true
		        },
			});
		} else if(String(skipurl) == "222222") {
			api.openWin({//金蛋商城列表
				name : 'integralStore',
				url : '../shangjia/eggstore/eggMain.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else if(String(skipurl) == "333333") {
			api.openWin({//积分商城列表
				name : 'integralStore',
				url : '../shangjia/integralStore/eggMain.html',
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
	//第一部分
	$("#first").on("click","img",function(){
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
				},
				pageParam : {
		          prefShop : true
		        },
			});
		} else if(String(skipurl) == "222222") {
			api.openWin({//金蛋商城列表
				name : 'busList',
				url : '../shangjia/eggstore/eggMain.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else if(String(skipurl) == "333333") {
			api.openWin({//积分商城列表
				name : 'busList',
				url : '../shangjia/integralStore/eggMain.html',
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
	
	//第二部分
	$("#second").on("click","img",function(){
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
				},
				pageParam : {
		          prefShop : true
		        },
			});
		} else if(String(skipurl) == "222222") {
			api.openWin({//金蛋商城列表
				name : 'busList',
				url : '../shangjia/eggstore/eggMain.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else if(String(skipurl) == "333333") {
			api.openWin({//积分商城列表
				name : 'busList',
				url : '../shangjia/integralStore/eggMain.html',
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
	//第三部分
	$("#third").on("click","img",function(){
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
				},
				pageParam : {
		          prefShop : true
		        },
			});
		} else if(String(skipurl) == "222222") {
			api.openWin({//金蛋商城列表
				name : 'busList',
				url : '../shangjia/eggstore/eggMain.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else if(String(skipurl) == "333333") {
			api.openWin({//积分商城列表
				name : 'busList',
				url : '../shangjia/integralStore/eggMain.html',
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
	//获取商品id
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
	//点击消息图标跳转消息列表
	$("#message").click(function() {
		if (String(hasLogon) != 'true') {
			api.openWin({//打开登录界面
				name : 'login',
				url : 'registe/logo.html',
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else {
			api.openWin({
				name : 'messagelist',
				url : '../html/personal/myMessage.html',
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
		}
	});

}
//地址定位 天气
function setUserKeyInfos() {
	//通过baidumap进行定位
	loadLocationFormMap("yes");
};
/**
 * 从地图中加载位置
 */
function loadLocationFormMap(remind) {
//	var lat;
//	var lon;
	var Url;
	cityname = api.getPrefs({
		sync : true,
		key : 'cityname'
	});
	//获取经纬度
	var nowlon;
	var nowlat;
	bMap.getLocation({
		accuracy : '10m',
		autoStop : true,
		filter : 1
	}, function(ret, err) {
		if (ret.status) {
			nowlat = ret.lat;
			nowlon = ret.lon;

			// 创建地址解析器实例，使用的时百度js api
			var point = new BMap.Point(nowlon, nowlat);
			var geoc = new BMap.Geocoder();
			geoc.getLocation(point, function(rs) {
				var addComp = rs.addressComponents;
				var address = addComp.district + addComp.street + addComp.streetNumber;
				/**
				 *当前定位城市和选择城市重复的时候,使用当前定位结果
				 */
				if (rs.address.indexOf(cityname) >= 0) {
					getLonAndLat();
				} else {
					if (api.systemType == 'ios') {
						Url = "http://api.map.baidu.com/geocoder?address=" + cityname + "&output=json&key=QvDbrHPdxEEUHzzBY46xTX2A";
					} else {
						Url = "http://api.map.baidu.com/geocoder?address=" + cityname + "&output=json&key=T4z2UcibGDBOQaXhjB5zC8hU";
					}
					api.ajax({
						url : Url,
						method : 'get'
					}, function(ret, err) {
						if (ret) {
							if (ret.status == "OK") {
								if (ret.result.length == 0) {
									$("#location").html(cityname);
									if (remind == 'no') {
										api.toast({
	                                        msg:'无法获取该城市天气'
                                        });
									}
								} else {
									lat = ret.result.location.lat;
									lon = ret.result.location.lng;

									api.setPrefs({
										key : 'nowaddr',
										value : cityname
									});
									api.setPrefs({
										key : 'nowLon',
										value : lon
									});
									api.setPrefs({
										key : 'nowLat',
										value : lat
									});
									$("#location").html(cityname);
									getCurrentWeatherAndForecast(lon, lat);
								}
							}
						} else {
							api.ale
							api.toast({
	                            msg:'地址获取失败'
                            });
						}
					});
				}

			});
		} else {
			api.toast({
				msg : "定位失败，请检查手机设置"
			});
		}
	});

};
/**
 *根据百度地图模块获取经纬度
 */
function getLonAndLat() {
	//读取地图位置
	bMap.getLocation({
		accuracy : '100m',
		autoStop : true,
		filter : 1
	}, function(ret, err) {
		if (ret.status) {
			lat = ret.lat;
			lon = ret.lon;
			getNameFromLocation(lon, lat);
		} else {
			api.toast({
				msg : "定位失败，请检查手机设置"
			});
		}
	});
};
/**
 * 根据定位获得名字
 * @param {Object} lon 经度
 * @param {Object} lat 纬度
 */
function getNameFromLocation(lon, lat) {
	// 创建地址解析器实例，使用的时百度js api
	var point = new BMap.Point(lon, lat);
	var geoc = new BMap.Geocoder();
	geoc.getLocation(point, function(rs) {
		var addComp = rs.addressComponents;
		var address = addComp.district + addComp.street + addComp.streetNumber;
		$("#location").html(address);
	});
	getCurrentWeatherAndForecast(lon, lat);
};

function getCurrentWeatherAndForecast(lon, lat) {
	//天气预报
	var forecastUrl = "https://api.caiyunapp.com/v2/86KXV9NFzE9Urpn1/" + lon + "," + lat + "/forecast.json";
	$.ajax({
		type : "GET",
		url : forecastUrl,
		success : function(data) {
			console.log("当天天气"+$api.jsonToStr(data));
			if (data.status == "ok") {
				var daily = data.result.daily;
				
				console.log($api.jsonToStr(data));
				//未来10分钟的天气描述
				var tempMinToday = daily.temperature[0].min.toString();
				var tempMaxToday = daily.temperature[0].max.toString();
				var tempMinTomorrow = daily.temperature[1].min.toString();
				var tempMaxTomorrow = daily.temperature[1].max.toString();
				var tempMinAfter = daily.temperature[2].min.toString();
				var tempMaxAfter = daily.temperature[2].max.toString();

				if (tempMinToday.indexOf(".") != -1) {
					tempMinToday = tempMinToday.substring(0, tempMinToday.indexOf("."));
				}
				if (tempMaxToday.indexOf(".") != -1) {
					tempMaxToday = tempMaxToday.substring(0, tempMaxToday.indexOf("."));
				}
				if (tempMinTomorrow.indexOf(".") != -1) {
					tempMinTomorrow = tempMinTomorrow.substring(0, tempMinTomorrow.indexOf("."));
				}
				if (tempMaxTomorrow.indexOf(".") != -1) {
					tempMaxTomorrow = tempMaxTomorrow.substring(0, tempMaxTomorrow.indexOf("."));
				}
				if (tempMinAfter.indexOf(".") != -1) {
					tempMinAfter = tempMinAfter.substring(0, tempMinAfter.indexOf("."));
				}
				if (tempMaxAfter.indexOf(".") != -1) {
					tempMaxAfter = tempMaxAfter.substring(0, tempMaxAfter.indexOf("."));
				}

				var todayTemperature = tempMinToday + "~" + tempMaxToday + "°";
				//更换天气图片显示
				replaceSkycon("todaySky", daily.skycon[0].value);
				//今日最高温度
				$("#maxTemperature").html(tempMinToday+'~'+tempMaxToday + "℃");
				//为weatherInfo内赋值
				weatherInfo.currentMax = tempMaxToday;
				weatherInfo.currentMin = tempMinToday;
				FileUtils.writeFile(daily,"FirWeaInfo.json"); 
			}else{
				FileUtils.readFile("FirWeaInfo.json", function(result) {
					if (result == "" || String(result) == "undefined" || String(result) == "null") {
//						api.toast({
//	               		 msg:'当前查看天气人数较多'
//              		});
					}else{
						var daily=result;
//						var minuteDescription = data.result.minutely.description;
						var tempMinToday = daily.temperature[0].min.toString();
						var tempMaxToday = daily.temperature[0].max.toString();
						var tempMinTomorrow = daily.temperature[1].min.toString();
						var tempMaxTomorrow = daily.temperature[1].max.toString();
						var tempMinAfter = daily.temperature[2].min.toString();
						var tempMaxAfter = daily.temperature[2].max.toString();
		
						if (tempMinToday.indexOf(".") != -1) {
							tempMinToday = tempMinToday.substring(0, tempMinToday.indexOf("."));
						}
						if (tempMaxToday.indexOf(".") != -1) {
							tempMaxToday = tempMaxToday.substring(0, tempMaxToday.indexOf("."));
						}
						if (tempMinTomorrow.indexOf(".") != -1) {
							tempMinTomorrow = tempMinTomorrow.substring(0, tempMinTomorrow.indexOf("."));
						}
						if (tempMaxTomorrow.indexOf(".") != -1) {
							tempMaxTomorrow = tempMaxTomorrow.substring(0, tempMaxTomorrow.indexOf("."));
						}
						if (tempMinAfter.indexOf(".") != -1) {
							tempMinAfter = tempMinAfter.substring(0, tempMinAfter.indexOf("."));
						}
						if (tempMaxAfter.indexOf(".") != -1) {
							tempMaxAfter = tempMaxAfter.substring(0, tempMaxAfter.indexOf("."));
						}
		
						var todayTemperature = tempMinToday + "~" + tempMaxToday + "°";
						//更换天气图片显示
						replaceSkycon("todaySky", daily.skycon[0].value);
						//今日最高温度
						$("#maxTemperature").html(tempMinToday+'~'+tempMaxToday + "℃");
						//为weatherInfo内赋值
						weatherInfo.currentMax = tempMaxToday;
						weatherInfo.currentMin = tempMinToday;
					
					}
				}
			)}
		}
	});

	//实时天气
	var realtimeUrl = "https://api.caiyunapp.com/v2/86KXV9NFzE9Urpn1/" + lon + "," + lat + "/realtime.json";
	$.ajax({
		type : "GET",
		url : realtimeUrl,
		success : function(data) {
			console.log("实时天气"+$api.jsonToStr(data));
			if (data.status == "ok") {
				var realTemperature = data.result.temperature;
				var pm25 = data.result.pm25;
				var wind = data.result.wind.speed;
				var humidity=((data.result.humidity)*100).toFixed(1);
				$("#humidity").html(humidity+"%");
				$("#pm25").html("pm2.5:"+ pm25);
				//当前温度
				$("#currentTemperature").html(realTemperature + "°");
				if (wind < 1) {//当前风速
					$("#wind").html("无风");
				} else if (wind < 5) {
					$("#wind").html("软风，1级");
				} else if (wind < 11) {
					$("#wind").html("轻风，2级");
				} else if (wind < 19) {
					$("#wind").html("微风，3级");
				} else if (wind < 28) {
					$("#wind").html("和风，4级");
				} else if (wind < 38) {
					$("#wind").html("清风，5级");
				} else if (wind < 49) {
					$("#wind").html("强风，6级");
				} else if (wind < 61) {
					$("#wind").html("疾风，7级");
				} else if (wind < 74) {
					$("#wind").html("大风，8级");
				} else if (wind < 88) {
					$("#wind").html("烈风，9级");
				} else if (wind < 102) {
					$("#wind").html("狂风，10级");
				} else if (wind < 117) {
					$("#wind").html("暴风，11级");
				} else {
					$("#wind").html("飓风，12级");
				};
				FirWeaInfoReal.realTemperature = realTemperature;
				FirWeaInfoReal.pm25 = pm25;
				FirWeaInfoReal.wind = wind;
				FirWeaInfoReal.humidity = humidity;
				FileUtils.writeFile(FirWeaInfoReal,"FirWeaInfoReal.json"); 
			}else{
				FileUtils.readFile("FirWeaInfoReal.json", function(data) {
					var realTemperature =  data.realTemperature;
					var pm25 = data.pm25;
					var wind = data.wind;
					var humidity=(data.humidity);
					$("#humidity").html(humidity+"%");
					$("#pm25").html("pm2.5:"+ pm25);
					//当前温度
					$("#currentTemperature").html(realTemperature + "°");
					if (wind < 1) {//当前风速
						$("#wind").html("无风");
					} else if (wind < 5) {
						$("#wind").html("软风，1级");
					} else if (wind < 11) {
						$("#wind").html("轻风，2级");
					} else if (wind < 19) {
						$("#wind").html("微风，3级");
					} else if (wind < 28) {
						$("#wind").html("和风，4级");
					} else if (wind < 38) {
						$("#wind").html("清风，5级");
					} else if (wind < 49) {
						$("#wind").html("强风，6级");
					} else if (wind < 61) {
						$("#wind").html("疾风，7级");
					} else if (wind < 74) {
						$("#wind").html("大风，8级");
					} else if (wind < 88) {
						$("#wind").html("烈风，9级");
					} else if (wind < 102) {
						$("#wind").html("狂风，10级");
					} else if (wind < 117) {
						$("#wind").html("暴风，11级");
					} else {
						$("#wind").html("飓风，12级");
					};
				})
			}
		}
	});
	};
/**
 * 更换天气图标
 */
	function replaceSkycon(elementId, skycon) {
		if (skycon == "CLEAR_DAY" || skycon == "CLEAR_NIGHT") {
			$("#" + elementId).html("<img src='../image/mainimg/clear_day1.png'/>");
		} else if (skycon == "PARTLY_CLOUDY_DAY" || skycon == "PARTLY_CLOUDY_NIGHT") {
			$("#" + elementId).html("<img src='../image/mainimg/partly_cloudy_day1.png'/>");
		} else if (skycon == "CLOUDY") {
			$("#" + elementId).html("<img src='../image/mainimg/cloudy_day1.png'/>");
		} else if (skycon == "RAIN") {
			$("#" + elementId).html("<img src='../image/mainimg/rain_day1.png'/>");
		} else if (skycon == "SLEET") {
			$("#" + elementId).html("<img src='../image/mainimg/sleet_day1.png'/>");
		} else if (skycon == "SNOW") {
			$("#" + elementId).html("<img src='../image/mainimg/snow_day1.png'/>");
		} else if (skycon == "WIND") {
			$("#" + elementId).html("<img src='../image/mainimg/wind_day1.png'/>");
		} else if (skycon == "FOG") {
			$("#" + elementId).html("<img src='../image/mainimg/fog_day1.png'/>");
		} else if (skycon == "HAZE") {
			$("#" + elementId).html("<img src='../image/mainimg/haze_day1.png'/>");
		}
		return $("#" + elementId).html();
	};
//天气详情
$(".weatherInfo").click(function(){
	 futureWeather(lon,lat);
});
$(".close").click(function(){
	$(".weatherSec").hide();
});

function futureWeather(lon,lat){
	//天气预报
	var forecastUrl = "https://api.caiyunapp.com/v2/86KXV9NFzE9Urpn1/" + lon + "," + lat + "/forecast.json";
	$.ajax({
		type : "GET",
		url : forecastUrl,
		success : function(data) {
			console.log("详情页当天天气"+$api.jsonToStr(data));
			if (data.status == "ok") {
				$(".weatherSec").show();
				var daily = data.result.daily;
				
				var tempMinToday = daily.temperature[0].min.toString();
				var tempMaxToday = daily.temperature[0].max.toString();
				if (tempMinToday.indexOf(".") != -1) {
					tempMinToday = tempMinToday.substring(0, tempMinToday.indexOf("."));
				}
				if (tempMaxToday.indexOf(".") != -1) {
					tempMaxToday = tempMaxToday.substring(0, tempMaxToday.indexOf("."));
				}
				//第二页温度 和最高温
				$("#secTemperature").html(tempMinToday+'~'+tempMaxToday + "℃");
//				$("#secMaxTemp").html(tempMaxToday + "°");
				//更换天气显示字段
				changeField("#todayweaInfo", daily.skycon[0].value);
				var nowList="";
				for(var i=0;i<5;i++){
					nowList+='<div class="future">'
						+'<div class="futureSameTop">'
//						+'<span>今天</span>'
						+weekInfo(i)
						+'<span class="botDate">'+(daily.temperature[i].date).replace(/-/g,"/").substr(5)+'</span>'
						+changeWeaImg("sky",daily.skycon[i].value)
						+'<span class="futureMax">'+daily.temperature[i].max+'</span>'
						+'<span class="futureMin">'+daily.temperature[i].min+'</span>'
						+changeWeaImgBot("futureLast",daily.skycon[i].value)
						+windInfo(daily.wind[i].avg.speed)
						+'</div>'
						+'</div>'
				}
				$("#futureInfo").html(nowList);
				$(".weatherSecBot").find(".futureSameTop").eq(4).css("border","none");
				//调用成功 写文件
				secWeaInfo=daily
				FileUtils.writeFile(secWeaInfo,"secWeaInfo.json"); 
			}else{
				FileUtils.readFile("secWeaInfo.json", function(result) {
					if (result == "" || String(result) == "undefined" || String(result) == "null") {
						api.toast({
	               		 msg:'当前查看天气人数较多,请稍后点击，谢谢您的理解！'
                		});
					}else{
						$(".weatherSec").show();
//						alert(typeof(result));
						var daily = result;
						var tempMinToday = daily.temperature[0].min.toString();
						var tempMaxToday = daily.temperature[0].max.toString();
						if (tempMinToday.indexOf(".") != -1) {
							tempMinToday = tempMinToday.substring(0, tempMinToday.indexOf("."));
						}
						if (tempMaxToday.indexOf(".") != -1) {
							tempMaxToday = tempMaxToday.substring(0, tempMaxToday.indexOf("."));
						}
						//第二页温度 和最高温
						$("#secTemperature").html(tempMinToday + '~' + tempMaxToday + "℃");
//						$("#secMaxTemp").html(tempMaxToday + "°");
						//更换天气显示字段
						changeField("#todayweaInfo", daily.skycon[0].value);
						var nowList = "";
						for (var i = 0; i < 5; i++) {
							nowList += '<div class="future">' + '<div class="futureSameTop">'
							// + '<span>今天</span>'
							+weekInfo(i) + '<span class="botDate">' + (daily.temperature[i].date).replace(/-/g, "/").substr(5) + '</span>' + changeWeaImg("sky", daily.skycon[i].value) + '<span class="futureMax">' + daily.temperature[i].max + '</span>' + '<span class="futureMin">' + daily.temperature[i].min + '</span>' + changeWeaImgBot("futureLast", daily.skycon[i].value) + windInfo(daily.wind[i].avg.speed) + '</div>' + '</div>'
						}
						$("#futureInfo").html(nowList);
						$(".weatherSecBot").find(".futureSameTop").eq(4).css("border", "none")
					}

				});


			}
		}
	});
	//更改日期
	
	function weekInfo(i){
		var weekInfo=""
		if(i==0){
			weekInfo='<span>今天</span>'
		}else if(i==1){
			weekInfo='<span>明天</span>'
		}else if(i==2){
			weekInfo='<span>'+DateUtils.getWeekDay(2)+'</span>'
		}else if(i==3){
			weekInfo='<span>'+DateUtils.getWeekDay(3)+'</span>'
		}else if(i==4){
			weekInfo='<span>'+DateUtils.getWeekDay(4)+'</span>'
		};
		return weekInfo;
	}
	
	//实时天气
	var realtimeUrl = "https://api.caiyunapp.com/v2/86KXV9NFzE9Urpn1/" + lon + "," + lat + "/realtime.json";
	$.ajax({
		type : "GET",
		url : realtimeUrl,
		success : function(data) {
			console.log("详情页实时天气"+$api.jsonToStr(data));
			if (data.status == "ok") {
				var realTemperature = data.result.temperature.toString();
				if (realTemperature.indexOf(".") > 0) {
					realTemperature = realTemperature.substring(0, realTemperature.indexOf("."));
				}
				//当前温度
				$("#secMaxTemp").html(realTemperature + "°");
				var SecWeaInfoReal={};
				SecWeaInfoReal.secMaxTemp=realTemperature;
				FileUtils.writeFile(SecWeaInfoReal,"SecWeaInfoReal.json"); 
			}else{
				FileUtils.readFile("SecWeaInfoReal.json", function(data) {
					var secMaxTemp=data.secMaxTemp;
					$("#secMaxTemp").html(secMaxTemp+ "°");
				})
			}
		}
	});
	//更改天气显示字段
	function changeField(elementId, skycon) {
		if (skycon == "CLEAR_DAY" || skycon == "CLEAR_NIGHT") {
			$(elementId).html("晴");
		} else if (skycon == "PARTLY_CLOUDY_DAY" || skycon == "PARTLY_CLOUDY_NIGHT") {
			$(elementId).html("多云");
		} else if (skycon == "CLOUDY") {
			$(elementId).html("阴");
		} else if (skycon == "RAIN") {
			$(elementId).html("雨");
		} else if (skycon == "SLEET") {
			$(elementId).html("冻雨");
		} else if (skycon == "SNOW") {
			$(elementId).html("雪");
		} else if (skycon == "WIND") {
			$(elementId).html("风");
		} else if (skycon == "FOG") {
			$(elementId).html("雾");
		} else if (skycon == "HAZE") {
			$(elementId).html("霾");
		};
		return $(elementId).html();
	};
	//未来五天天气详情
	function changeWeaImg(elementId,skycon) {
		var changeWeaImg=""
		if (skycon == "CLEAR_DAY" || skycon == "CLEAR_NIGHT") {
			changeWeaImg='<span class="'+elementId+'">晴</span><img src="../image/mainimg/fine.png" alt="" />'
		} else if (skycon == "PARTLY_CLOUDY_DAY" || skycon == "PARTLY_CLOUDY_NIGHT") {
			changeWeaImg='<span class="'+elementId+'">多云</span><img src="../image/mainimg/partly_cloudy_day.png" alt="" />'
		} else if (skycon == "CLOUDY") {
			changeWeaImg='<span class="'+elementId+'">阴</span><img src="../image/mainimg/cloudy_day.png" alt="" />'
		} else if (skycon == "RAIN") {
			changeWeaImg='<span class="'+elementId+'">雨</span><img src="../image/mainimg/rain_day.png" alt="" />'
		} else if (skycon == "SLEET") {
			changeWeaImg='<span class="'+elementId+'">冻雨</span><img src="../image/mainimg/sleet_day.png" alt="" />'
		} else if (skycon == "SNOW") {
			changeWeaImg='<span class="'+elementId+'">雪</span><img src="../image/mainimg/snow_day.png" alt="" />'
		} else if (skycon == "WIND") {
			changeWeaImg='<span class="'+elementId+'">风</span><img src="../image/mainimg/wind_day.png" alt="" />'
		} else if (skycon == "FOG") {
			changeWeaImg='<span class="'+elementId+'">雾</span><img src="../image/mainimg/fog_day.png" alt="" />'
		} else if (skycon == "HAZE") {
			changeWeaImg='<span class="'+elementId+'">霾</span><img src="../image/mainimg/haze_day.png" alt="" />'
		};
		return changeWeaImg;
	};
	//未来五天天气详情下
	function changeWeaImgBot(elementId,skycon) {
		var changeWeaImg=""
		if (skycon == "CLEAR_DAY" || skycon == "CLEAR_NIGHT") {
			changeWeaImg='<img src="../image/mainimg/fine.png" alt="" /><span class="'+elementId+'">晴</span>'
		} else if (skycon == "PARTLY_CLOUDY_DAY" || skycon == "PARTLY_CLOUDY_NIGHT") {
			changeWeaImg='<img src="../image/mainimg/partly_cloudy_day.png" alt="" /><span class="'+elementId+'">多云</span>'
		} else if (skycon == "CLOUDY") {
			changeWeaImg='<img src="../image/mainimg/cloudy_day.png" alt="" /><span class="'+elementId+'">阴</span>'
		} else if (skycon == "RAIN") {
			changeWeaImg='<img src="../image/mainimg/rain_day.png" alt="" /><span class="'+elementId+'">雨</span>'
		} else if (skycon == "SLEET") {
			changeWeaImg='<img src="../image/mainimg/sleet_day.png" alt="" /><span class="'+elementId+'">冻雨</span>'
		} else if (skycon == "SNOW") {
			changeWeaImg='<img src="../image/mainimg/snow_day.png" alt="" /><span class="'+elementId+'">雪</span>'
		} else if (skycon == "WIND") {
			changeWeaImg='<img src="../image/mainimg/wind_day.png" alt="" /><span class="'+elementId+'">风</span>'
		} else if (skycon == "FOG") {
			changeWeaImg='<img src="../image/mainimg/fog_day.png" alt="" /><span class="'+elementId+'">雾</span>'
		} else if (skycon == "HAZE") {
			changeWeaImg='<img src="../image/mainimg/haze_day.png" alt="" /><span class="'+elementId+'">霾</span>'
		};
		return changeWeaImg;
	};
	function windInfo(wind) {
		var windList=""
		if (wind < 1) {//当前风速
			windList='<span class="futureLast">无风</span><span class="futureLast">0级</span>'
		} else if (wind < 5) {
			windList='<span class="futureLast">软风</span><span class="futureLast">1级</span>'
		} else if (wind < 11) {
			windList='<span class="futureLast">轻风</span><span class="futureLast">2级</span>'
		} else if (wind < 19) {
			windList='<span class="futureLast">微风</span><span class="futureLast">3级</span>'
		} else if (wind < 28) {
			windList='<span class="futureLast">和风</span><span class="futureLast">4级</span>'
		} else if (wind < 38) {
			windList='<span class="futureLast">清风</span><span class="futureLast">5级</span>'
		} else if (wind < 49) {
			windList='<span class="futureLast">强风</span><span class="futureLast">6级</span>'
		} else if (wind < 61) {
			windList='<span class="futureLast">疾风</span><span class="futureLast">7级</span>'
		} else if (wind < 74) {
			windList='<span class="futureLast">大风</span><span class="futureLast">8级</span>'
		} else if (wind < 88) {
			windList='<span class="futureLast">烈风</span><span class="futureLast">9级</span>'
		} else if (wind < 102) {
			windList='<span class="futureLast">狂风</span><span class="futureLast">10级</span>'
		} else if (wind < 117) {
			windList='<span class="futureLast">暴风</span><span class="futureLast">11级</span>'
		} else {
			windList='<span class="futureLast">飓风</span><span class="futureLast">12级</span>'
		};
		return windList;
	}


}
//------------------------------新闻列表方法--------------------------------------------------------------

/**
 * 加载news.json中的新闻信息
 * @param newsdata 新闻数据json串
 */
function loadmainNews(newsdata) {
	var screenWidth = api.screenWidth;
	//根据新闻类型遍历json
	for (var j = 0; j < newsdata.length; j++) {
		//获取新闻类型
		var newstype = newsdata[j].dsName;
		//获取当前类的新闻列表
		var rows = newsdata[j].rows;
		for (var k = 0; k < rows.length; k++) {
			for (var i = 0; i < newsTypes.length; i++) {
				if (newsdata[j].dsName == newsTypes[i]) {
					//获取新闻对象
					var row = rows[k];
					if (k == 0) {
						newsFirstByType(newstype);
					}
					//设置发布时间
					$api.text($api.byId(newstype + 'NewsTime' + (k + 2)), row.issuetime);
					//设置图片
					if (row.imgurl == undefined || row.imgurl == null || row.imgurl == '') {
						$api.attr($api.byId(newstype + 'NewsImg' + (k + 2)), 'src', 'http://pic002.cnblogs.com/images/2011/358804/2011122613501726.jpg');
					} else {
						$api.attr($api.byId(newstype + 'NewsImg' + (k + 2)), 'src', rootUrl + row.imgurl);
					}
					//设置新闻id
					$api.val($api.byId(newstype + 'NewsFid' + (k + 2)), row.fid);
					//新闻标题

					if (screenWidth == '320') {
						row.title = row.title.substring(0, 20) + "......";
					} else {
						row.title = row.title.substring(0, 22) + "......";
					}

					var title_news = row.title.length;

					$api.text($api.byId(newstype + 'NewsTitle' + (k + 2)), row.title);
					//评论数
					$api.text($api.byId(newstype + 'NewBmessage' + (k + 2)), row.feedcount);

				}
			}
		}
	}
}

/**
 *
 * @param newstype 根据新闻类型加载置顶新闻
 */
function newsFirstByType(newstype) {
	var newsData;
	AjaxUtil.exeScript({
		script : "managers.news.newslist",
		needTrascation : false,
		//		funName : "listForapp",
		funName : "newsFirstByType",
		form : {
			typeid : newstype
		},
		success : function(data) {
			if (data.execStatus === "true" && data.datasources[0].rows.length > 0) {
				newsData = data.datasources[0].rows[0];
				//设置图片
				if (newsData.imgurl == undefined || newsData.imgurl == null || newsData.imgurl == '') {
					$api.attr($api.byId(newstype + 'NewsImg1'), 'src', 'http://pic002.cnblogs.com/images/2011/358804/2011122613501726.jpg');
				} else {
					$api.attr($api.byId(newstype + 'NewsImg1'), 'src', rootUrl + newsData.imgurl);
				}
				//设置新闻id
				$api.val($api.byId(newstype + 'NewsFid1'), newsData.fid);
				//新闻标题
				$api.text($api.byId(newstype + 'NewsTitle1'), newsData.title);
				//评论数
				$api.text($api.byId(newstype + 'NewBmessage1'), newsData.feedcount);
			}
		}
	});
}

function writeandreadNews() {
	AjaxUtil.exeScript({
		script : "managers.news.newslist",
		needTrascation : false,
		funName : "loadmainNews",
		success : function(data) {
			newsInfos = data.datasources;
			FileUtils.writeFile(newsInfos, "news.json");
			FileUtils.readFile("news.json", function(data) {
				if (data != undefined) {
					loadmainNews(data);
				}
			});
		}
	});
}

/**
 *写入新闻信息到news.json
 */
function writeNews() {
	AjaxUtil.exeScript({
		script : "managers.news.newslist",
		needTrascation : false,
		funName : "loadmainNews",
		success : function(data) {
			newsInfos = data.datasources;
			FileUtils.writeFile(newsInfos, "news.json");
		}
	});
}

/**
 * 根据新闻类型刷新主页新闻列表
 * @param newstype 新闻类型
 */
function newsListPage(newstype) {

	connectionType = api.connectionType;
	//比如： wifi
	if (connectionType == 'none' || connectionType == "unknown") {
		api.toast({
	        msg:'当前网络不可用'
        });
		return false;
	}

	//写入新闻信息到news.json
	writeNews();
	//获取当前页数
	var page = $api.attr($api.byId(newstype + 'NewsPage'), 'abbr');
	page++;
	//设置新闻页数
	$api.attr($api.byId(newstype + 'NewsPage'), 'abbr', page);
	//刷新新闻列表
	newsListexeScript(newstype, page);
}

/**
 * 根据新闻类型获  第N页，取新闻数据，并填充到首页列表（按照时间排序 4条）
 * @param newstype  新闻类型
 * @param page     第几页
 */
function newsListexeScript(newstype, page) {

	var screenWidth = api.screenWidth;
	api.showProgress();
	AjaxUtil.exeScript({
		script : "managers.news.newslist",
		needTrascation : false,
		funName : "listForapp",
		form : {
			typeid : newstype,
			p : page
		},
		success : function(data) {
			api.hideProgress();
			//获取新闻总数
			var count = data.datasources[0].rowCount;
			//设置新闻总页数
			var countpage = 0;
			//根据每页长度取模
			var mo = count % 4;
			//取总页数
			if (mo != 0) {
				countpage = (count - mo) / 4
			} else {
				countpage = count / 4
			}
			//判断当前要跳转的页数是否大于总页数
			if (page > countpage) {
				//提示新闻已经展示到尾部
				api.alert({
					title : '提示',
					msg : '该类新闻已经展示到尾部,接下来将从头开始！',
				}, function(ret, err) {
				});
				//				//获取第一页新闻
				//				newsListexeScript(newstype, 1);
				//读取news.json中的新闻列表
				FileUtils.readFile("news.json", function(data) {
					loadmainNews(data);
				});
				//设置页码为1
				$api.attr($api.byId(newstype + 'NewsPage'), 'abbr', 1);
				return false;
			}
			//新闻数据
			rows = data.datasources[0].rows;
			for (var j = 0; j < rows.length; j++) {
				var row = rows[j];
				for (var i = 0; i < newsTypes.length; i++) {
					if (newstype == newsTypes[i]) {
						if (j != 0) {
							//发布时间
							$api.text($api.byId(newstype + 'NewsTime' + (j + 2)), row.issuetime);
						}
						//新闻图片
						if (row.imgurl == undefined || row.imgurl == null || row.imgurl == '') {
							$api.attr($api.byId(newstype + 'NewsImg' + (j + 2)), 'src', 'http://pic002.cnblogs.com/images/2011/358804/2011122613501726.jpg');
						} else {
							$api.attr($api.byId(newstype + 'NewsImg' + (j + 2)), 'src', rootUrl + row.imgurl);
						}
						//新闻id
						$api.val($api.byId(newstype + 'NewsFid' + (j + 2)), row.fid);
						//新闻标题
						if (screenWidth == '320') {
							row.title = row.title.substring(0, 20) + "......";
						} else {
							row.title = row.title.substring(0, 22) + "......";
						}
						$api.text($api.byId(newstype + 'NewsTitle' + (j + 2)), row.title);
						//评论总数
						$api.text($api.byId(newstype + 'NewBmessage' + (j + 2)), row.feedcount);
					}
				}

			}

		}
	});
}

/**
 * 点击新闻，进入新闻详情
 * @param {Object} th 当前点击对象
 */
function newsdetails(th) {
	//获取点击对象
	var el = $api.first(th, 'input');
	//获取新闻id
	var fid = $api.val(el);
	api.openWin({
		//打开新闻详情界面
		name : 'newsinfo',
		url : 'news/newsinfo.html',
		pageParam : {
			fid : fid
		},
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}

/**
 *下拉刷新新闻列表
 */
function selectNewsList() {
	//从数据库中查询主页新闻列表
	for (var i = 0; i < newsTypes.length; i++) {
		var newstype = newsTypes[i];
		//根据新闻发布时间刷新新闻列表
		newsListexeScript(newstype, 1);
		//设置为第一页
		$api.attr($api.byId(newstype + 'NewsPage'), 'abbr', 1);
	}
}

/**
 *点击获取更多新闻
 * @param {Object} th 点击对象
 */
function selectMoreNews(th) {
	var typeid = $api.attr(th, 'abbr');
	api.openWin({
		name : 'news',
		url : 'news/news.html',
		pageParam : {
			typeid : typeid
		},
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}
//jsruntime中的
function hidepot() {
	//	$('#msgnum').hide();
	msgnum = api.getPrefs({
		sync : true,
		key : 'msgnum'
	});
};
function setmsgnum() {
	msgnum = api.getPrefs({
		sync : true,
		key : 'msgnum'
	});
};
function hideKey() {
	var userInfo = {
		"hasRegist" : false,
		"hasLogon" : false,
		"memberid" : "memberid",
		"account" : "account",
		"nickname" : "nickname",
		"telphone" : "telphone",
		"location" : {
			"lon" : 0,
			"lat" : 0,
			"address" : ""
		}
	};
	userKeyInfos = {};
	$(".key").hide();
};
function refresh() {
	location.reload();
}
function close() {
	api.closeFrame({
	});
}
