var urId;
apiready = function() {
	var back = $api.byId('back');
	var titleName = $api.byId('titleName');
	var share = $api.byId('share');
	var header = $api.byId('header');
	var cc = $api.dom('.iosBox');
	if (api.systemType == 'ios') {
		
        if (api.screenHeight == 2436){
            $api.css(back, 'margin-top:44px;');
            $api.css(titleName, 'margin-top:44px;');
            $api.css(share, 'margin-top:44px;');
            $api.css(cc, 'margin-top:3.8rem;');
            $api.css(header, 'height:3.3rem');
        }else{
            $api.css(back, 'margin-top:22px;');
            $api.css(titleName, 'margin-top:22px;');
            $api.css(share, 'margin-top:22px;');
            $api.css(cc, 'margin-top:3.3rem;');
            $api.css(header, 'height:3.3rem');
        }
	};
	
	var busid = api.pageParam.id;
	$("#back").bind("click", function() {
		api.closeWin();
	});
	$('#toBuy').click(function() {
		urId = api.getPrefs({
			sync : true,
			key : 'userNo'
		}); 
		//如果用户没有登录，先去登录页面
		if (urId == '' || urId == 'userNo' || urId == 'undefined' || urId == null) {
			api.openWin({
				name : 'login',
				url : '../../html/registe/logo.html',
				bounces : false,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : 'from_right', //动画子类型（详见动画子类型常量）
					duration : 300
				}
			});
			return false;
		}
		api.openWin({
			name : 'eggPay',
			url : 'eggPay.html',
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			},
			pageParam : {
				id : busid,
				surplusCount : $("#toBuy").attr("datas")
			}

		});
	}); 

function queryShoppingDeatilById() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.shopping.shopping",
			needTrascation : false,
			funName : "queryShoppingDeatilById",
	        form:{
	           id:busid
	        },
			success : function(data) {
				console.log("金蛋商品详情" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.shopping;
					var list = $api.strToJson(account);
					var listImg = $api.strToJson(data.formDataset.carouselList);
					var nowlist="";
					$("#countAll").html(list.price_discount+'颗');
					$("#title").html(list.title);
					$("#sub_title").html(list.sub_title);
					$("#price").html(list.price_discount+'颗');
					$("#buy_count").html(list.buy_count+"人已购买");
					$("#description").html(list.description);
					$("#toBuy").attr("data",list.good_no);
					$("#toBuy").attr("datas",list.surplus_count);
//					$("#mainImg").attr("src",rootUrl+($api.strToJson(data.formDataset.detail).name));
					$("#mainImg").html($api.strToJson(data.formDataset.detail).name);
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
queryShoppingDeatilById()
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
