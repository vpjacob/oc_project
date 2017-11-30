var tabTop = "6";
//默认
var page1 = true;
var page2 = true;
var page3 = true;
var pageNum1 = 1;
var pageNum2 = 1;
var pageNum3 = 1;
var userInfo = {
};
var winHeight;
var nowli;
var flag = true;
var sflag=true;
var temptop;
var templeft;
//控制刷新方法的触发
var isRefresh = true;
var urId;
var hisNo="";
apiready = function() {
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    hisNo=api.pageParam.otherId;
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
		api.execScript({//刷新person界面数据
				name : 'listFriendInfo',
				script : 'refresh();'
			});
	})

	//返回刷新
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
			api.closeWin();
	});
	$('.infinite-scroll-preloader').hide();
	//同步返回结果：
	var open = api.getPrefs({
		sync : true,
		key : 'open'
	});
	var header = $api.byId('title');
	var miancss = $api.dom('.content');
	if (api.systemType == 'ios') {
		
        if (api.screenHeight == 2436){
            $api.css(header, 'padding-top:1.6rem;');
            $api.css(header, 'height:3.7rem;');
            $api.css(miancss, 'margin-top:1.5rem;');
        }else{
            $api.css(header, 'padding-top:1.1rem;');
            $api.css(header, 'height:3.2rem;');
            $api.css(miancss, 'margin-top:1.0rem;');
        }
	}

	winHeight = api.winHeight;
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
	friendIsStealAndUserInfo();
	$(window).resize(function(e) {
		wh();
	});
	wh();
	$.init();
	
	//好友信息及是否可砸
	function friendIsStealAndUserInfo() {
		AjaxUtil.exeScript({
			script : "mobile.myegg.stealegg",
			needTrascation : true,
			funName : "friendIsStealAndUserInfo",
			form : {
				yourNo : urId,
				hisNo :hisNo
			},
			success : function(data) {
				console.log("好友信息及是否可偷"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var isSteal=data.formDataset.isSteal;
					if (String(data.formDataset.headImage) == "" || String(data.formDataset.headImage) == "null" || String(data.formDataset.headImage) == "undefined") {
						headImage = "../../image/eggList/icon_c.png"
					} else {
						headImage = rootUrl + data.formDataset.headImage;
					};
					$("#headImage").attr("src",headImage);	
					if(String(data.formDataset.isSteal) == "0"){
						$(".imgtop").css({"background":"url('../../image/bgcGold.jpg') no-repeat center",
						"width":"100%;",
						"height":"200px;",
						"text-align:":"center;",
						"background-size":"cover;"});
						$('#showGoldEgg').show();
					}
				} else {
					alert(data.formDataset.errorMsg);
				}
			}
		});
	}
//	friendIsStealAndUserInfo();
	//他的被偷金蛋记录
	function friendStealRecord() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.stealegg",
			needTrascation : false,
			funName : "friendStealRecord",
			form : {
				yourNo :urId,
				hisNo:hisNo,
				page:1
			},
			success : function(data) {
				console.log("他的被偷金蛋记录" + $api.jsonToStr(data));
				api.hideProgress();
				if (data.formDataset.checked == 'true') {
					var accont = data.formDataset.hisStealRecord;	
					var arr=$api.strToJson(accont);
//					var arr=list;
					var map = {};
			        var dest = [];
			        //按时间顺序进行分类
			        if(String(arr.length)=="undefined" || String(arr.length)=="null" || String(arr.length)=="0"){
						$(".hoderimg").show();
					}else{
			        for(var i = 0; i < arr.length; i++){
			            var ai = arr[i];
			            if(!map[ai.steal_day]){
			                dest.push({
			                    id: ai.steal_day,
			                    data: [ai]
			                });
			                map[ai.steal_day] = ai;
			            }else{
			                for(var j = 0; j < dest.length; j++){
			                    var dj = dest[j];
			                    if(dj.id == ai.steal_day){
			                        dj.data.push(ai);
			                        break;
			                    }
			                }
			            }
			        }
					var changeJson=dest;
					console.log("转化为以后的json" + $api.jsonToStr(changeJson));
					for(var j=0;j<changeJson.length;j++){
						var list=changeJson[j].data;
						var dataId=changeJson[j].id;
						var outModel='<div class="same">'
									+'<div class="date">'
									+''+(changeJson[j].id).substring(5)+''
									+'</div>'
									+'<img src="../../image/stealEgg/border.png" alt="" class="theTop"/>';
//									+'</div>';
						for(var i=0;i<list.length;i++){
							var nickName="";
	                      	var eggMoney="";
//	                      	var model="";
	                      		if(String(list[i].username)=="" || String(list[i].username)=="null" || String(list[i].username)=="undefined"){
	                      			nickName="昵称暂无"
	                      		}else{
	                      			nickName=list[i].username;
	                      		};
	                      		if(String(list[i].egg_money)=="" || String(list[i].egg_money)=="null" || String(list[i].egg_money)=="undefined"){
	                      			eggMoney="暂无"
	                      		}else{
	                      			eggMoney=list[i].egg_money;
	                      		};
							var model='<div class="context">'
								+'<img src="../../image/stealEgg/dot.png" alt="" class="dot"/>'
								+'<span class="name">'+nickName+'</span>'
								+'<span class="spanSame">砸出</span>'
								+'<span class="gold">'+eggMoney+'</span>'
								+'<span class="spanSame">枚金币</span>'
								+'<span class="time">'+(list[i].create_time).split(" ")[1]+'</span>'
								+'</div>'
								+'<img src="../../image/stealEgg/border.png" alt="" class="border"/>';
							outModel = outModel + model;
						}	
						outModel = outModel+'</div>';
						$("#hisStealList").append(outModel);								
//						pageCount = data.formDataset.count > 10 ? Math.ceil(data.formDataset.count / 10) : 1;
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
	friendStealRecord()
	
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
				stealFriendEgg();
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
					//8.程序处理
					$(obj).attr("data-flag", "1");
					//已砸的状态
					api.setPrefs({
						key : 'open',
						value : '1'
					});
				});
			});
		}
		 $("#jcz").position().top=temptop;
		 $("#jcz").position().left=templeft;
	}
	
}

//偷金蛋的金额方法
function stealFriendEgg() {
	AjaxUtil.exeScript({
		script : "mobile.myegg.stealegg",
		needTrascation : true,
		funName : "stealFriendEgg",
		form : {
			userNo : urId,
			friendNo : hisNo
		},
		success : function(data) {
			console.log("偷金蛋的金额方法"+$api.jsonToStr(data));
			if (data.formDataset.checked == 'true') {
				$('#showBox').css('display','');
				$('#smashCount').html(data.formDataset.money+'枚金币');
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}



//检验是否有蛋
//function isHaveEgg(obj) {
//	AjaxUtil.exeScript({
//		script : "mobile.myegg.myegg",
//		needTrascation : true,
//		funName : "checkIsHaveGoldEgg",
//		form : {
//			userNo : urId
//		},
//		success : function(data) {
//			console.log("输出：" + $api.jsonToStr(data));
//			if (data.formDataset.checked == 'true') {
//				if (data.formDataset.isHaveEgg == 'true') {
//					isBeat(obj);
//				} else {
//					//alert("您已经没了金蛋可砸啦！")
//					noEgg();
//				}
//
//			} else {
//				alert(data.formDataset.errorMsg);
//			}
//		}
//	});
//}

//检验是否可砸
//function isBeat(obj) {
//	AjaxUtil.exeScript({
//		script : "mobile.myegg.myegg",
//		needTrascation : true,
//		funName : "checkIsBeatGoldEgg",
//		form : {
//			userNo : urId
//		},
//		success : function(data) {
//			//    	console.log("输出："+$api.jsonToStr(data));
//			if (data.formDataset.checked == 'true') {
//				if (data.formDataset.isBeat == 'true') {
//					console.log("进来了")
////					eggClick(obj);
//				$(".imgtop").css({"background":"url('../../image/bgcGold.jpg') no-repeat center",
//						"width":"100%;",
//						"height":"200px;",
//						"text-align:":"center;",
//						"background-size":"cover;"});
//				$('#showGoldEgg').show();
//				} else {
//					//     			alert("今天已砸金蛋")
//					noEgg();
//				}
//
//			} else {
//				alert(data.formDataset.errorMsg);
//			}
//		}
//	});
//}

//没有金蛋方法
//function noEgg(obj) {
//	$("#egg").remove();
//	$(".fanzt-chuizi").hide();
//
//	$(".fanzt-message").show(200);
//	$($api.dom('#jd')).attr("data-flag", "1");
//	$(".imgtop").css({"background":"url('../../image/bgcLast.jpg') no-repeat center",
//						"width":"100%;",
//						"height":"200px;",
//						"text-align:":"center;",
//						"background-size":"cover;"});
//}


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
	api.closeWin({});
}
