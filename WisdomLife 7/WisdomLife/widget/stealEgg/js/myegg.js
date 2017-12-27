var userInfo = {
};
var nowli;
var flag = true;
var sflag=true;
var temptop;
var templeft;
//控制刷新方法的触发
var isRefresh = true;
var urId;
var clickMoney="";
apiready = function() {
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    isHaveEgg();
	reacd();	
	
	//弹出中奖结果  确认按钮关闭
	$('.closeTan').click(function(){
		$('#showBox').hide();
		api.openWin({
			name : 'buylist',
			url : '../../shangjia/html/buyList.html',
			reload : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	})
	//跳转到金蛋记录页面
	$(".topLeft").click(function(){
		api.openWin({
			name : 'eggRecord',
			url : 'eggRecord.html',
			reload : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//金蛋排行榜
	$('.eggList').click(function(){
		api.openWin({
			name : 'eggList',
			url : '../../html/wallet/eggList.html',
			reload : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//跳转到更多动态页面
	$(".moreDynamic").click(function(){
		api.openWin({
			name : 'moreDynamic',
			url : 'moreDynamic.html',
			reload : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//跳转到偷金蛋秘籍页面
	$(".cheats").click(function(){
		api.openWin({
			name : 'stealEggGe',
			url : 'stealEggGe.html',
			reload : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
//跳转到更多好友
	$("#moreFriend").click(function(){
		api.openWin({
			name : 'friendList',
			url : 'friendList.html',
			reload : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	})
//点击好友列表进行跳转
	$(".boxBot").on("click",".boxBotSame",function(){
		api.openWin({
				name : 'stealEgg',
				url : 'stealEgg.html',
				reload : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				},
				pageParam : {
					otherId:$(this).attr("datas")
				}
			});
	})	
		
	//返回刷新
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		api.execScript({//刷新我的界面金币总数的数据
				name : 'root',
				frameName : 'room',
				script : 'refresh();'
			});
			api.execScript({//从主页回来进行刷新
				name : 'root',
				script : 'openmain();'
			});
			api.closeWin();
	});
	$('.infinite-scroll-preloader').hide();
	//同步返回结果：
	var open = api.getPrefs({
		sync : true,
		key : 'open'
	});

	console.log('校验是否打开：  ' + open);
	var header = $api.byId('title');
	var miancss = $api.dom('.content');
	if (api.systemType == 'ios') {
        
        if (api.screenHeight == 2436){
            $api.css(header, 'padding-top:1.6rem;');
            $api.css(header, 'height:3.9rem;');
            $api.css(miancss, 'margin-top:2.0rem;');
        }else{
            $api.css(header, 'padding-top:1.1rem;');
            $api.css(header, 'height:3.2rem;');
            $api.css(miancss, 'margin-top:1.0rem;');
        }
        
	};
	$("#back").bind("click", function() {
		api.execScript({//刷新person界面数据
				name : 'my-qianbao',
				script : 'refresh();'
			});
			api.execScript({//从主页回来进行刷新
				name : 'root',
				script : 'openmain();'
			});
		api.closeWin();
	});

	$(window).resize(function(e) {
		wh();
	});
	wh();
	$.init();
	//最新动态
	function newDynamicList() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.stealegg",
			needTrascation : false,
			funName : "newDynamicList",
			form : {
				userNo:urId
			},
			success : function(data) {
				console.log("最新动态" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var accont = data.formDataset.newDynamicList;	
					var list=$api.strToJson(accont);
					var model="";
					if(String(list.length)=="undefined" || String(list.length)=="null" ||String(list.length)==""){
						$(".hoderimg").show();
					}else{
						for(var i=0;i<list.length;i++){
							var nickName="";
	                      	var eggMoney="";
	                      	var model="";
	                      		if(String(list[i].user_name)=="" || String(list[i].user_name)=="null" || String(list[i].user_name)=="undefined"){
	                      			nickName="昵称暂无"
	                      		}else{
	                      			nickName=list[i].user_name;
	                      		};
	                      		if(String(list[i].egg_money)=="" || String(list[i].egg_money)=="null" || String(list[i].egg_money)=="undefined"){
	                      			eggMoney="暂无"
	                      		}else{
	                      			eggMoney=list[i].egg_money;
	                      		};
							model+='<div class="boxTopSame">'
									+'<span>'+nickName+'</span>'
									+'<span>偷了</span>'			
									+'<span>'+eggMoney+'</span>'		
									+'<span>枚金币</span>'		
									+'<span>'+list[i].create_time+'</span>'		
									+'</div>'	
							$("#newDynamicLis").append(model);								
						}	
					}
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
	};
	//加载好友动态
	newDynamicList();
	//加载好友列表和昨日砸蛋情况
	function newFriendEggList() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.stealegg",
			needTrascation : false,
			funName : "newFriendEggList",
			form : {
				userNo:urId
			},
			success : function(data) {
				console.log("加载好友列表和昨日砸蛋情况" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var accont = data.formDataset.newFriendEggList;	
					var list=$api.strToJson(accont);
					var model="";
					if(String(list.length)=="undefined" || String(list.length)=="null" ||String(list.length)==""){
						api.toast({
	                        msg:'暂无相关好友'
                        });
					}else{
	                      	var model="";
						for(var i=0;i<list.length;i++){
							var nickName="";
	                      	var eggMoney="";
	                      	var headImage="";
	                      	var realName="";
	                      	var rankImg="";
	                      		if(String(list[i].username)=="" || String(list[i].username)=="null" || String(list[i].username)=="undefined"){
	                      			nickName="昵称暂无"
	                      		}else{
	                      			nickName=list[i].username;
	                      		};
	                      		if(String(list[i].beat_money)=="" || String(list[i].beat_money)=="null" || String(list[i].beat_money)=="undefined"){
	                      			eggMoney="暂无"
	                      		}else{
	                      			eggMoney=list[i].beat_money;
	                      		};
	                      		if(String(list[i].head_image)=="" || String(list[i].head_image)=="null" || String(list[i].head_image)=="undefined"){
	                      			headImage="../../image/eggList/icon_c.png"
	                      		}else{
	                      			headImage=rootUrl+list[i].head_image;
	                      		};
	                      		if(String(list[i].real_name)=="" || String(list[i].real_name)=="null" || String(list[i].real_name)=="undefined"){
	                      			realName="暂无"
	                      		}else{
	                      			realName=list[i].real_name;
	                      		};
	                      		if(i==0){
	                      			rankImg='<img src="../../image/stealEgg/gold.png" alt="" class="topImg"/>'
	                      		}else if(i==1){
	                      			rankImg='<img src="../../image/stealEgg/sliver.png" alt="" class="topImg"/>'
	                      		}else if(i==2){
	                      			rankImg='<img src="../../image/stealEgg/copper.png" alt="" class="topImg"/>'
	                      		}else{
	                      			rankImg="";
	                      		}
							model+='<div class="boxBotSame" data="'+list[i].steal_gold_status+'" datas="'+list[i].friend_no+'">'
								+''+rankImg+''
								+'<div class="main">'
								+'<img src="'+headImage+'" alt="" class="mainImg"/>'			
								+'<span class="nickName">'+nickName+'</span>'				
								+'<span class="realName">真实姓名:'+realName+'</span>'				
								+'<span class="last">枚</span>'				
								+'<span class="mid">'+eggMoney+'</span>'				
								+'<img src="../../image/eggList/icon_a.png" alt="" class="botGold"/>'				
								+'</div>'				
								+'</div>'	
						}	
							$("#newFriendEggList").html(model);	
						}							
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
	};
	newFriendEggList();
	//获取个人头像
	function myEggRecordMyInfo() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.stealegg",
			needTrascation : false,
			funName : "myEggRecordMyInfo",
			form : {
				userNo:urId
			},
			success : function(data) {
				console.log("获取金币综合" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {		
                      	var headImage="";
                      		if(String(data.formDataset.headImage)=="" || String(data.formDataset.headImage)=="null" || String(data.formDataset.headImage)=="undefined"){
                      			headImage="../../image/stealEgg/defaultImg.png"
                      		}else{
                      			headImage=rootUrl+data.formDataset.headImage;
                      		};
                      		$("#headImage").attr("src",headImage);
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
	};
	myEggRecordMyInfo();
	//分享给微信
	$(".shareWx").bind("click", function() {
		var wx = api.require('wx');
		var wxUrl=""
		wx.isInstalled(function(ret, err) {
			if (ret.installed) {
				$('#showBox').hide();
//				wxUrl=rootUrl + "/jsp/recommendmobile?userNo=" + urId + "&userType=1";
				wxUrl=rootUrl+"/jsp/manager/mobile/shareWeiXin?userNo=" + urId + "&money="+clickMoney+"";
				wx.shareWebpage({
					apiKey : '',
					scene : 'session',
					title : '购物送金蛋，金蛋砸不停',
					description : '来小客商城购物，天天砸金蛋',
					thumb : 'widget://image/shareWx.jpg',
					contentUrl :wxUrl,
//					userName : 'A6921550712789',
//					path : '',
				}, function(ret, err) {
					console.log($api.jsonToStr(ret))
					if (ret.status) {
						alert('分享成功');
					} else {
						alert(err.code);
					}
				});
			} else {
				api.alert({
					msg : "当前设备未安装微信客户端"
				});
			}
		});

	});
}
function refresh() {
	location.reload();
}

//点击砸金蛋
function eggClick(obj) {
	if (flag) {
		flag = false;
		if ($(obj).attr("data-flag") == "0") {
			$("#jcz").show();
		    temptop=$("#jcz").position().top;
			templeft=$("#jcz").position().left;
			var ctop = $("#jcz").position().top - 20;
			var cleft = $("#jcz").position().left + 30;
			
			setTimeout(function() {
				test();
			}, 1300)
			//1.锤子抬起的动作
			$(".fanzt-chuizi").animate({
				"top" : ctop + "px",
				"left" : cleft + "px"
			}, 1000, function() {
				//2.锤子抬起达到最顶点的动作
				$(".fanzt-chuizi").css({
					"-webkit-transform" : "rotate(80deg)",
					"-moz-transform" : "rotate(80deg)",
					"-o-transform" : "rotate(80deg)",
					"transform" : "rotate(80deg)",
					"-webkit-transition" : "all 0.8s ease",
					"-moz-transition" : "all 0.8s ease",
					"-o-transition" : "all 0.8s ease",
					"transition" : "all 0.8s ease"
				});
				//3.锤子落下的动作
				$("#jcz").animate({
					"top" : (ctop + 25) + "px",
					"left" : (cleft - 50) + "px"
				}, 300, function() {
					api.startPlay({
						path : 'widget://res/gold.mp3'
					}, function(ret, err) {
						if (ret) {
							//						alert('播放完成');
						} else {
							alert(JSON.stringify(err));
						}
					});
					//4.锤子落下到达最低点
					$("#jcz").css({
						"-webkit-transform" : "rotate(5deg)",
						"-moz-transform" : "rotate(5deg)",
						"-o-transform" : "rotate(5deg)",
						"transform" : "rotate(5deg)",
						"-webkit-transition" : "all 0.1s ease",
						"-moz-transition" : "all 0.1s ease",
						"-o-transition" : "all 0.1s ease",
						"transition" : "all 0.1s ease"
					});
					//5.金蛋破碎
					$("#egg").attr("src", "../../image/egg_2.png");
					$("#jcz").hide();
					//6.金花溅出
					$("#jinhua").show(200);
					//7.中奖结果
					$(".fanzt-message").show(200);
					
					//				location.reload();

					//8.程序处理
					$(obj).attr("data-flag", "1");
					//已砸的状态
					api.setPrefs({
						key : 'open',
						value : '1'
					})
				});
			});
		}
		 $("#jcz").position().top=temptop;
		 $("#jcz").position().left=templeft;
	}
	
}

//砸金蛋的金额方法
function test() {
	AjaxUtil.exeScript({
		script : "mobile.myegg.myegg",
		needTrascation : true,
		funName : "beatGoldEgg",
		form : {
			userNo : urId
		},
		success : function(data) {
			if (data.formDataset.checked == 'true') {
				$('#showBox').css('display','');
				$('#smashCount').html(data.formDataset.money+'枚金币');
				clickMoney=data.formDataset.money;
				reacd();
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}

//砸金蛋的记录方法
function reacd() {
	AjaxUtil.exeScript({
		script : "mobile.myegg.myegg",
		needTrascation : true,
		funName : "queryBeatGoldEggRecord",
		form : {
			userNo : urId
		},
		success : function(data) {
			var listInfo = data.formDataset.recordList;
			var list = eval(listInfo);
			console.log('金蛋记录' + $api.jsonToStr(data));
			if (data.formDataset.checked == 'true') {
				if(data.formDataset.gold_freeze_auto=="" || String(data.formDataset.gold_freeze_auto)=="undefined" || String(data.formDataset.gold_freeze_auto)=="null"){
					$("#freezeGold").html("0颗");//待激活
				}else if(data.formDataset.gold_egg_count =="" || String(data.formDataset.gold_egg_count )=="undefined" || String(data.formDataset.gold_egg_count )=="null"){
					$("#commonEgg").html("0颗");//普通金蛋
				}else if(data.formDataset.selected_egg  =="" || String(data.formDataset.selected_egg  )=="undefined" || String(data.formDataset.selected_egg  )=="null"){
					$("#goodEgg").html("0颗");//优选金蛋
				}else if(data.formDataset.change_egg   =="" || String(data.formDataset.change_egg   )=="undefined" || String(data.formDataset.change_egg   )=="null"){
					$("#exchangeEgg").html("0颗");//兑换金蛋
				}else{
					$("#commonEgg").html(data.formDataset.gold_egg_count+"颗");
					$("#goodEgg").html(data.formDataset.selected_egg +"颗");
					$("#exchangeEgg").html(data.formDataset.change_egg +"颗");
					$("#freezeGold").html(data.formDataset.gold_freeze_auto+"颗");
				}
				$('#ul_tab1 ').empty();
				for (var i = 0; i < list.length; i++) {
					var nowli = '<li class="item-content"><div class="item-inner"><div class="item-title">' + list[i].beat_time + '</div><div class="item-mid">' + '<img src="../../image/jin.png" alt="" class="img1"/><span  class="span1">' + list[i].egg_count + '</span></div><div class="item-last"><img src="../../image/jinbi.png" alt="" class="img2"/>' + '<span class="span2">' + list[i].beat_money + '</span></div></div></li>';
					//     			var nowli = '<span>'+list[i].create_time +'</span><span>'+list[i].beat_money+'</span>'
					$('#ul_tab1').append(nowli);

				}

			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}

//检验是否有蛋
function isHaveEgg(obj) {
	AjaxUtil.exeScript({
		script : "mobile.myegg.myegg",
		needTrascation : true,
		funName : "checkIsHaveGoldEgg",
		form : {
			userNo : urId
		},
		success : function(data) {
			console.log("输出：" + $api.jsonToStr(data));
			if (data.formDataset.checked == 'true') {
				if (data.formDataset.isHaveEgg == 'true') {
					isBeat(obj);
				} else {
					noEgg();
				}

			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}

//检验是否可砸
function isBeat(obj) {
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
					console.log("进来了")
				$(".imgtop").css({"background":"url('../../image/bgcGold.jpg') no-repeat center",
						"width":"100%;",
						"height":"200px;",
						"text-align:":"center;",
						"background-size":"cover;"});
				$('#showGoldEgg').show();
				} else {
					noEgg();
				}

			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}

//没有金蛋方法
function noEgg(obj) {
	$("#egg").remove();
	$(".fanzt-chuizi").hide();
	$(".fanzt-message").show(200);
	$($api.dom('#jd')).attr("data-flag", "1");
	$(".imgtop").css({"background":"url('../../image/bgcLast.jpg') no-repeat center",
						"width":"100%;",
						"height":"200px;",
						"text-align:":"center;",
						"background-size":"cover;"});
}

//跳转到砸金蛋规则页面
$('.guize').click(function() {
		api.openWin({
			name : 'zadange',
			url : '../../html/wallet/zadange.html',
			reload : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});

//控制宽高
function wh() {
	var eggh = 158 / 2;
	var eggw = 170 / 2;
	$(".fanzt-egg-img").css({
		"top" : (($('.imgtop').height() - eggh) / 2) + "px",
		"left" : (($('.imgtop').width() - eggw) / 2) + "px"
	});
	$(".fanzt-chuizi").css({
		"top" : (($('.imgtop').height() - eggh) / 2) - 15 + "px",
		"left" : (($('.imgtop').width() - eggw) / 2) + 65 + "px"
	});
	$(".fanzt-hua").css({
		"top" : (($('.imgtop').height() - eggh) / 2 - 25) + "px",
		"left" : (($('.imgtop').width()) / 2 - 58) + "px"
	});
	$(".fanzt-message").css({
		"top" : (($('.imgtop').height() - eggh) / 2 - 30) + "px",
		"left" : (($('.imgtop').width() - eggw) / 2 + 10) + "px"
	});

}
function goBack() {
	api.execScript({//刷新我的界面金币总数的数据
		name : 'root',
		frameName : 'room',
		script : 'refresh();'
	}); 
	api.execScript({//从主页回来进行刷新
		name : 'root',
		script : 'openmain();'
	});
	api.closeWin({});
	
}
