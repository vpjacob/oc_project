apiready = function() {
	var back = $api.byId('back');
	var titleName = $api.byId('titleName');
	var share = $api.byId('share');
	var header = $api.byId('header');
	var cc = $api.dom('.iosBox');
	if (api.systemType == 'ios') {
		$api.css(back, 'margin-top:22px;');
		$api.css(titleName, 'margin-top:22px;');
		$api.css(share, 'margin-top:22px;');
		$api.css(cc, 'margin-top:3.3rem;');
		$api.css(header, 'height:3.3rem');
	};
	FileUtils.readFile("info.json", function(info, err) {
		userInfo = info;
	});
	var busid = api.pageParam.id;
	$("#back").bind("click", function() {
		api.closeWin();
	});
	$('#toBuy').click(function() {
	if (userInfo.userNo == '' || userInfo.userNo == null) {
			api.alert({
				msg : "您是否登录了？请先去登录吧！"
			});
			return false;
		};
		api.openWin({
			name : 'entranceGuardInfo',
			url : 'entranceGuardInfo.html',
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : { 
				id :busid,
				surplusCount:$("#toBuy").attr("datas")
			}

		});
	});
function queryProductDeatilById() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "queryProductDeatilById",
			        form:{
			           id:busid
			        },
			success : function(data) {
				console.log("商品详情" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.product;
					var list = $api.strToJson(account);
					var listImg = $api.strToJson(data.formDataset.carouselList);
					var nowlist="";
					
					if (list.price_discount == "" || list.price_discount == null || list.price_discount == undefined || list.price_discount == 0) {
						price = list.price;
						$(".yh").hide();
						$(".initprice").hide();
					} else {
						price = list.price_discount;
						
					}
					$("#countAll").html('¥'+price);
					$("#title").html(list.title);
					$("#sub_title").html(list.sub_title);
					$("#price").html('¥'+list.price);
					$("#price_discount").html(price);
					$("#buy_count").html(list.buy_count+"人已购买");
					$("#description").html(list.description);
					$("#toBuy").attr("data",list.good_no);
					$("#toBuy").attr("datas",list.surplus_count);
					$("#mainImg").attr("src",rootUrl+($api.strToJson(data.formDataset.detail).name));
					api.hideProgress();
					for(var i=0;i<listImg.length;i++){
						nowlist+='<div class="swiper-slide"><img src="'+rootUrl+listImg[i].name+'"></div>'
					}
					$("#showPic").append(nowlist);
					var swiper = new Swiper('.swiper-containerlrf', {
						pagination : '.swiper-pagination',
						paginationClickable : true,
						spaceBetween : 3,
						centeredSlides : true,
						autoplayDisableOnInteraction : false,
						autoplay : 2500,
						loop : true,
						observer:true,//修改swiper自己或子元素时，自动初始化swiper
			   			observeParents:true//修改swiper的父元素时，自动初始化swiper
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
queryProductDeatilById()
	//分享与取消代码
	$("#share").click(function(){
		$('#photo').show();
	}); 
	$(document).on('click', '.share_sub', function() {
		$('#photo').hide();
	});
	//分享到相应的
$("#qq_share").bind("click", function() {
		var qq = api.require('qq');
		qq.installed(function(ret, err) {
			if (ret.status) {
				$('#photo').hide();
				qq.shareNews({
					type : 'QFriend',
					url : rootUrl + "/jsp/share",
					title : '小客智慧生活',
					description : '史上最好用的物业管理软件，快来下载吧！！！',
					imgUrl : 'http://www.ppke.cn:8080/qrcode/a.png'
				}, function(ret, err) {
					if (ret.status) {
						api.alert({
							msg : "分享成功！"
						});
					} else {
					}
				});
			} else {
				api.alert({
					msg : "当前设备未安装QQ客户端"
				});
			}
		});
	});
	$("#wx_share").bind("click", function() {
		var wx = api.require('wx');
		wx.isInstalled(function(ret, err) {
			if (ret.installed) {
				$('#photo').hide();
				wx.shareWebpage({
					apiKey : '',
					scene : 'session',
					title : '小客智慧生活',
					description : '史上最好用的物业管理软件，快来下载吧！！！',
					thumb : 'widget://image/a.png',
					contentUrl : rootUrl + "/jsp/share",
				}, function(ret, err) {
					if (ret.status) {
						api.alert({
							msg : "分享成功！"
						});
					} else {
						//alert(err.code);
					}
				});
			} else {
				api.alert({
					msg : "当前设备未安装微信客户端"
				});
			}
		});

	});
	$("#sms_share").bind("click", function() {
		api.sms({
			text : '史上最好用的物业管理软件，快来下载吧！！！' + rootUrl + "/jsp/share",
		}, function(ret, err) {
			if (ret && ret.status) {
				//已发送
				$('#photo').hide();
			} else {
				//发送失败
			}
		});

	});
};
