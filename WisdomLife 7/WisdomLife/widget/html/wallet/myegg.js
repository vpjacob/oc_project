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
//var nowli = '<li class="delete"><div class="detailone"><span class="detailLeft">消费日期：</span><span class="detailRight">\"[lastDay]\"</span></div>'
//+ '<span><i class="iconfont icon-moneybag"></i></span><span class="detailnumber">\"[tax]\"</span></li><li class="delete"><div class="detailone">'
//+ '<span class="detailLeft">爱心产生日期：</span><span class="detailRight">\"[reachtime]\"</span></div><span><i class="iconfont icon-aixin3"></i> </span>'
//+ '<span class="detailnumber">\"[totalnumber]\"</span></li><li class="delete"><div class="detailone"><span class="detailLeft">激励中的爱心</span>'
//+ '<span class="detailRight"></span></div><span><i class="iconfont icon-aixin3"></i> </span><span class="detailnumber">\"[lovenumber]\"</span></li>'
// + '<li class="delete"><div class="detailone"><span class="detailLeft">激励完成的爱心</span><span class="detailRight"></span></div>'
//+ '<span><i class="iconfont icon-aixin3"></i> </span><span class="detailnumber">\"[endnumber]\"</span></li><li class="delete"><div class="detailone">'
//+ '<span class="detailLeft">已激励信使豆</span><span class="detailRight"></span></div><span><i class="iconfont icon-meidou"></i> </span>'
//+ '<span class="detailnumber">+0.00</span></li><li class="delete bottomLi"><div class="detailone"><span class="detailLeft">平台管理费</span><span class="detailRight"></span>'
//+ '</div><span><i class="iconfont icon-meidou"></i> </span><span class="detailnumber">\"[totalnumber2]\"</span></li>';
//var nowli = '<li class="item-content"><div class="item-inner"><div class="item-title">2017-01-02</div><div class="item-after">' + '<i class="iconfont icon-aixin3"></i><span class="red">2000</span></div><div class="item-after"><i class="iconfont icon-meidou"></i>' + '<span class="orange">+1000</span></div></div></li>';
var winHeight;
var nowli;
var offsetTop;
var flag = true;
var sflag=true;
var temptop;
var templeft;
//控制刷新方法的触发
var isRefresh = true;
var urId;
apiready = function() {
	// 加载完毕，则注销无限加载事件，以防不必要的加载
	//	$.detachInfiniteScroll($('.infinite-scroll'));
	//	// 删除加载提示符
	
	FileUtils.readFile("info.json", function(info, err) {
			urId=info.userNo;
				//  加载银蛋记录
			//  silverReacd();
			//  加载银蛋是否可砸
	
			isHaveEgg();
			reacd();	
			isHaveSilverEgg();
		});
	
	//弹出中奖结果  确认按钮关闭
	$('.closeTan').click(function(){
		$('#showBox').hide();
	})
	

	//返回刷新
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		api.execScript({//刷新我的界面金币总数的数据
				name : 'my-qianbao',
//				frameName : 'room',
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
	//	if (open == '1') {//今日已经打开过金蛋
	//		$("#egg").attr("src", "../../image/egg_2.png");
	//		$(".fanzt-chuizi").hide();
	//		//6.金花溅出
	//		$(".fanzt-hua").show(200);
	//		//7.中奖结果
	//		$(".fanzt-message").show(200);
	//		//8.程序处理
	//		$($api.dom('.fanzt-egg-img')).attr("data-flag", "1");
	//		reacd();
	//
	//	}
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var content = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(content, 'margin-top:20px;');
	}

	winHeight = api.winHeight;
	offsetTop = $("#back_tab1").offset().top;

	$("#back").bind("click", function() {
//		alert('1')
		api.execScript({//刷新person界面数据
				name : 'my-qianbao',
//				frameName : 'room',
				script : 'refresh();'
			});
			api.execScript({//从主页回来进行刷新
				name : 'root',
				script : 'openmain();'
			});
//		alert('2')
		api.closeWin();
	});

	$(window).resize(function(e) {
		wh();
	});
	wh();

	//	$(document).on('pageInit', function(e, id, page) {
	//		$(page).on('infinite', function() {
	//
	//
	//		});
	//	});
	$.init();
}
function refresh() {
	location.reload();
//	alert(123);
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
					});
					//				addLi();
				});
			});
		}
//		console.log('之前top:'+$("#jcz").position().top);
//		console.log('之前left:'+$("#jcz").position().left);
//		console.log('原来left:'+templeft);
//		console.log('原来top:'+temptop);
		 $("#jcz").position().top=temptop;
		 $("#jcz").position().left=templeft;
//		 console.log('之后top:'+$("#jcz").position().top);
//		 console.log('之后left:'+$("#jcz").position().left);
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
			//    	console.log("输出："+$api.jsonToStr(data));
			if (data.formDataset.checked == 'true') {
				//$("#GoldEggB").find("b").text(data.formDataset.money);
				//           alert("获取的金额:"+data.formDataset.money);
				$('#showBox').css('display','');
				$('#smashCount').html(data.formDataset.money+'枚金币');
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
			console.log('list.length' + list.length);
			if (data.formDataset.checked == 'true') {
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
					//alert("您已经没了金蛋可砸啦！")
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
			//    	console.log("输出："+$api.jsonToStr(data));
			if (data.formDataset.checked == 'true') {
				if (data.formDataset.isBeat == 'true') {
					console.log("进来了")
//					eggClick(obj);
				$(".imgtop").css({"background":"url('../../image/bgcGold.jpg') no-repeat center",
						"width":"100%;",
						"height":"200px;",
						"text-align:":"center;",
						"background-size":"cover;"});
				$('#showGoldEgg').show();
				} else {
					//     			alert("今天已砸金蛋")
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
	//	if(obj.data-flag=="1"){
//	$("#egg").attr("src", "../../image/hui.png");
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

//没有银蛋方法
function nosilveregg(obj) {
	//	if(obj.data-flag=="1"){
//	$("#SEgg").attr("src", "../../image/hui.png");
	$("#SEgg").remove();
	$(".fanzt-chuizi").hide();

	$(".fanzt-message").show(200);
	$($api.dom('#yd')).attr("data-flag", "1");
	$(".imgtop").css({"background":"url('../../image/bgcLast.jpg') no-repeat center",
						"width":"100%;",
						"height":"200px;",
						"text-align:":"center;",
						"background-size":"cover;"});
}

//检验是否有银蛋

function isHaveSilverEgg(obj) {
	AjaxUtil.exeScript({
		script : "mobile.myegg.myegg",
		needTrascation : true,
		funName : "checkIsHaveSilverEgg",
		form : {
			userNo : urId
		},
		success : function(data) {
			console.log("输出：" + $api.jsonToStr(data));
			if (data.formDataset.checked == 'true') {
				if (data.formDataset.isHaveEgg == 'true') {
					IsBeatSilverEgg(obj);
				} else {
					//     			alert("您已经没了银蛋可砸啦！")
					nosilveregg();
				}

			} else {
				alert(data.formDataset.errorMsg);
			}
			
		}
	});
}

function IsBeatSilverEgg(obj) {
	AjaxUtil.exeScript({
		script : "mobile.myegg.myegg",
		needTrascation : true,
		funName : "checkIsBeatSilverEgg",
		form : {
			userNo : urId
		},
		success : function(data) {
			console.log("输出：isMayBeat" + $api.jsonToStr(data));
			if (data.formDataset.checked == 'true') {
				if (data.formDataset.isMayBeat == 'true') {
//					console.log("进来了")
//					clickSilverEgg(obj);
				$('#showSilverEgg').show();
				} else {
					//     			alert("今天已砸过银蛋")
					nosilveregg();
				}

			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}

function clickSilverEgg(obj) {
  if (sflag) {
		sflag = false;
	if ($(obj).attr("data-flag") == "0") {
		$("#ycz").show();
//		    temptop=$("#ycz").position().top;
//			templeft=$("#ycz").position().left;
			var ctop = $("#ycz").position().top - 20;
			var cleft = $("#ycz").position().left + 30;
		setTimeout(function() {
				beatSilverEggMoney();
			}, 1300)
		//1.锤子抬起的动作
		$("#ycz").animate({
			"top" : ctop + "px",
			"left" : cleft + "px"
		}, 1000, function() {
			//2.锤子抬起达到最顶点的动作
			$("#ycz").css({
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
			$("#ycz").animate({
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
				$("#ycz").css({
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
				$("#SEgg").attr("src", "../../image/egg4.png");
				
				
				
				$("#ycz").hide();
				//6.金花溅出
				$("#yinhua").show(200);
				//7.中奖结果
				$(".fanzt-message").show(200);
				
				//				location.reload();

				//8.程序处理
				$(obj).attr("data-flag", "1");
				//已砸的状态
				api.setPrefs({
					key : 'open',
					value : '1'
				});
				//				addLi();
			});
		});
	  }
//	  	console.log('之前top:'+$("#ycz").position().top);
//				console.log('之前left:'+$("#ycz").position().left);
//				console.log('原来left:'+templeft);
//				console.log('原来top:'+temptop);
//				 $("#ycz").position().top=temptop;
//				 $("#ycz").position().left=templeft;
//				 console.log('之后top:'+$("#ycz").position().top);
//				 console.log('之后left:'+$("#ycz").position().left);
	}
}

//砸银蛋的金额方法
function beatSilverEggMoney() {
	AjaxUtil.exeScript({
		script : "mobile.myegg.myegg",
		needTrascation : true,
		funName : "beatSilverEgg",
		form : {
			userNo : urId
		},
		success : function(data) {
			//    	console.log("输出："+$api.jsonToStr(data));
			if (data.formDataset.checked == 'true') {
				//$("#SilverEggB").find("b").text(data.formDataset.money);
				//           alert("获取的金额:"+data.formDataset.money);
				$('#showBox').css('display','');
				$('#smashCount').html(data.formDataset.money+'枚金币');
				silverReacd();
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}

//银蛋记录
function silverReacd() {
	AjaxUtil.exeScript({
		script : "mobile.myegg.myegg",
		needTrascation : true,
		funName : "queryBeatSilverEggRecord",
		form : {
			userNo : urId
		},
		success : function(data) {
			var listInfo = data.formDataset.recordList;
			var list = eval(listInfo);
			console.log('list.length' + list.length);

			if (data.formDataset.checked == 'true') {
				if (list.length == 0) {
					return false;
				} else {
					$('#ul_tab2').empty();
					for (var i = 0; i < list.length; i++) {
						var nowli = '<li class="item-content"><div class="item-inner"><div class="item-title">' + list[i].beat_time + '</div><div class="item-mid">' + '<img src="../../image/yin.png" alt="" class="img1"/><span class="span1">' + list[i].egg_count + '</span></div><div class="item-last"><img src="../../image/jinbi.png" alt="" class="img2"/>' + '<span class="span2">' + list[i].beat_money + '</span></div></div></li>';
						//     			var nowli = '<span>'+list[i].create_time +'</span><span>'+list[i].beat_money+'</span>'
						$('#ul_tab2').append(nowli);

					}
				}
			} else {
				alert(data.formDataset.errorMsg);
			}
		}
	});
}

function addLi() {
	$('#ul_tab1').append(nowli);
}

//跳转到砸金蛋规则页面
$('.guize').click(function() {
		api.openWin({
			name : 'zadange',
			url : 'zadange.html',
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
	var eggw = 170;
	//          $(".fanzt-egg").width($(window).width());
	//          $(".fanzt-egg").height($(window).height());
	$(".fanzt-egg-img").css({
		"top" : (($('.imgtop').height() - eggh) / 2) + "px",
		"left" : (($('.imgtop').width() - eggw) / 2) + "px"
	});
	$(".fanzt-chuizi").css({
		"top" : (($('.imgtop').height() - eggh) / 2) - 15 + "px",
		"left" : (($('.imgtop').width() - eggw) / 2) + 130 + "px"
	});
	$(".fanzt-hua").css({
		"top" : (($('.imgtop').height() - eggh) / 2 - 25) + "px",
		"left" : (($('.imgtop').width() - eggw) / 2 - 35) + "px"
	});
	$(".fanzt-message").css({
		"top" : (($('.imgtop').height() - eggh) / 2 - 30) + "px",
		"left" : (($('.imgtop').width() - eggw) / 2 + 10) + "px"
	});

}
