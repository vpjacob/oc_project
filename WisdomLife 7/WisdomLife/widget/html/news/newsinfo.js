$.init();
/**
 * 保存数据的key
 * hasLogon:是否登陆
 * memberid：账号ID
 */
//新闻的id
var fid;
var feeddiv = "<li class='main'><div style='display: inline-block;' class='head'>" + "</div><div style='display: inline-block; margin-left: 8px;'>" + "<p class='thumbNam' style='margin: 0'>\"[member]\"</p><p class='thumbTime' style='margin: 0'>\"[time]\"</p>" + "</div><div class='write' style='margin-left: 8px;'>\"[content]\"</div></li>";
//评论数量
var feedcount;
//点赞数量
var count;
var hasLogon;
//用户id
var memberid;
//点赞按钮是否被按下
var hasPre = false;

var page = 1;
var time;
var oldpage = 0;
var islocation = false;
apiready = function() {
	// 注册'infinite'事件处理函数
	$(document).on('infinite', function() {
		oldpage += 1;
		$('.noneCot').css("display", "none");
		//		alert(oldpage+"------"+page+"------"+time);
		if (oldpage >= 2) {
			return;
		}
		if (page > time) {
			// 加载完毕，则注销无限加载事件，以防不必要的加载
			$.detachInfiniteScroll($('.infinite-scroll'));
			// 删除加载提示符
			$('.infinite-scroll-preloader').remove();
			//			api.hideProgress();
			if ($('.noneCot').css("display") == 'none') {//如果show是隐藏的
				$('.noneCot').css("display", "block");
			}
			return;
		} else {
			//			oldpage = page;
			checkFeedCount(page, "no");
			api.showProgress({
			});
		}
	});
	fid = api.pageParam.fid;
	if (fid == "" || fid == null) {
		api.alert({
			title : '温馨提示：',
			msg : '您的新闻还在路上，请重试... ...',
		}, function(ret, err) {
			api.closeWin();
		});
	}
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}

	showProgress();
	/**
	 * 读取info.json文件
	 * 判断是否登陆，若登陆则检查是否对该新闻点赞
	 */
	FileUtils.readFile("info.json", function(info, err) {
		PrefsUtil.setPrefs("hasLogon", info.hasLogon);
		PrefsUtil.setPrefs("memberid", info.memberid);
		hasLogon = info.hasLogon;
		memberid = info.memberid;
		if (hasLogon == true) {//如果登陆过了，则查询是否对该新闻点过赞
			AjaxUtil.exeScript({//新闻点赞数量
				script : "managers.news.newlistme",
				needTrascation : false,
				funName : "supportNum2",
				async : false,
				form : {
					memberid : memberid,
					newsid : fid
				},
				success : function(data) {//请求成功
					var count = data.datasources[0].rows.length;
					if (count != 0) {//对该新闻点过赞,设置为红色
						//						$('.ChangeGood').css('background', 'url(../../image/upnow.png) no-repeat left center')
						$('.ChangeGood i').removeClass("icon-zantong").addClass("icon-zantongfill");
						$('.ChangeGood .icon-zantongfill').css("color", "#e04023");
						$(".thumbNum").css('color', '#e04023');
						hasPre = true;
					}
				}
			});
		}
	});
	AjaxUtil.exeScript({//新闻详情
		script : "managers.news.newslist",
		needTrascation : true,
		funName : "info",
		async : false,
		form : {
			fid : fid
		},
		success : function(data) {//请求成功
			if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
				var res = data.datasources[0].rows[0];
				$("#title").html(res.title);
				$("#issuetime").html(res.issuetime);
				$("#typename").html(res.source);
				$("#content").html(res.content);
				if (res.supportcount == null || res.supportcount == "") {
					$("#supportNum").html('0');
					count = 0;
				} else {
					$("#supportNum").html(res.supportcount);
					count = res.supportcount;
				}
				if (res.feedcount == null || res.feedcount == "") {
					feedcount = 0;
					$("#count_feed").html("(0)");
				} else {
					feedcount = res.feedcount;
					$("#count_feed").html("(" + res.feedcount + ")");
				}
				if (feedcount != 0) {//如果有评论，查询评论信息
					checkFeedCount(1, "no");
				} else {
					api.hideProgress();
					//feiqp
					// 加载完毕，则注销无限加载事件，以防不必要的加载
					$.detachInfiniteScroll($('.infinite-scroll'));
					// 删除加载提示符
					$('.infinite-scroll-preloader').remove();
					//feiqp
					if ($('.noneCot').css("display") == 'none') {//如果show是隐藏的
						$('.noneCot').css("display", "block");
					}
				}
			} else {
				api.alert({
					msg : '数据请求失败'
				}, function(ret, err) {
					//coding...
				});
			}
		}
	});
	$('a').each(function() {
		$(this).attr('href', '#');
		$(this).click(function(event) {
			event.preventDefault();
		});
	});
	//点赞按钮
	$('.ChangeGood').click(function() {
		if (hasLogon != true) {//用户没有登陆
			api.confirm({
				title : '温馨提示：',
				msg : '您还没有登陆，是否去登陆？',
				buttons : ['确定', '取消']
			}, function(ret, err) {
				var index = ret.buttonIndex;
				if (index == 1) {//确定
					api.setPrefs({
						key : 'isnew',
						value : true
					});
					api.openWin({//打开登录界面
						name : 'login',
						url : '../registe/logo.html',
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
		} else {//已经登陆的用户
			var num = parseInt($(".thumbNum").html());
			showProgress();
			if (hasPre == false) {//没有点击
				AjaxUtil.exeScript({
					script : "managers.news.newlistme",
					needTrascation : false,
					funName : "supportNum3",
					async : false,
					form : {
						memberid : memberid,
						newsid : fid
					},
					success : function(data) {//请求成功
						if (data.execStatus == 'true') {
							updateSupNum(num + 1);
							hasPre = true;
							//							$('.ChangeGood').css('background', 'url(../../image/upnow.png) no-repeat left center')
							$('.ChangeGood i').removeClass("icon-zantong").addClass("icon-zantongfill");
							$('.ChangeGood .icon-zantongfill').css("color", "#e04023");
							$(".thumbNum").css('color', '#e04023');
							$(".thumbNum").html(num + 1);
							api.hideProgress();
						}
					}
				});
			} else {//已经点击但是想取消
				AjaxUtil.exeScript({
					script : "managers.news.newlistme",
					needTrascation : false,
					funName : "delsupport",
					async : false,
					form : {
						memberid : memberid,
						newsid : fid
					},
					success : function(data) {//请求成功
						if (data.execStatus == 'true') {
							updateSupNum(num - 1);
							hasPre = false;
							//							$('.ChangeGood').css('background', 'url(../../image/upedd.png) no-repeat left center')
							$('.ChangeGood i').removeClass("icon-zantongfill").addClass("icon-zantong");
							$('.ChangeGood .icon-zantong').css("color", "#acafb6");
							$(".thumbNum").css('color', '#acafb6');
							$(".thumbNum").html(num - 1);
							api.hideProgress();
						}
					}
				});
			}
		}
	});
	$(document).on("click", "img", function() {
		$('.zzc').show(500);
		$('.main').css("overflow-y", "hidden");
		var imgSrc = $(this).attr('src');
		$(".zzc .center .dt").attr('src', imgSrc);
	});
	$(document).on("click", ".zzc", function() {
		$('.zzc').hide(500);
		$('.main').css("overflow-y", "scroll");
	});
	$('#back').click(function() {
		api.execScript({
			sync : true,
			name : 'root',
			frameName : 'weather',
			script : 'writeandreadNews()'
		});
		setTimeout(function() {
			api.closeWin();
		}, 500);
	});
};

/**
 * 发送评论
 */
function sendFeed() {
	var inputfeed = $("#inputfeed").val();
	var input = /^[\s]*$/;
	if (hasLogon == false) {
		api.confirm({
			title : '温馨提示：',
			msg : '您还没有登陆，是否去登陆？',
			buttons : ['确定', '取消']
		}, function(ret, err) {
			var index = ret.buttonIndex;
			if (index == 1) {//确定
				api.setPrefs({
					key : 'isnew',
					value : true
				});
				api.openWin({//打开登录界面
					name : 'login',
					url : '../registe/logo.html',
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
	} else if (input.test(inputfeed)) {
		api.alert({
			msg : "评论内容不能为空"
		}, function(ret, err) {
			//coding...
		});
	} else {
		showProgress();

		AjaxUtil.exeScript({//更新评论数量
			script : "managers.news.newlistme",
			needTrascation : false,
			funName : "updatefeedCount",
			async : false,
			form : {
				fid : fid,
				feedcount : Number(feedcount) + 1
			},
			success : function(data) {//请求成功
				if (data.execStatus == 'true') {
					AjaxUtil.exeScript({//插入一条评论数据
						script : "managers.news.newlistme",
						needTrascation : false,
						funName : "insertNewsFeed",
						async : false,
						form : {
							memberid : memberid,
							content : inputfeed,
							newsid : fid
						},
						success : function(data) {//请求成功
							feedcount = Number(feedcount) + 1;
							checkFeedCount(1, "yes");
							islocation = true;
							page = 1;
							api.toast({
								msg : '评论发表成功',
								duration : 2000,
								location : 'bottom'
							});
							$("#inputfeed").val('');
						}
					});
				}
			}
		});
	}
}

/**
 * 点赞数改变
 */
function updateSupNum(countNum) {
	AjaxUtil.exeScript({
		script : "managers.news.newlistme",
		needTrascation : false,
		funName : "supportNum4",
		async : false,
		form : {
			fid : fid,
			supportcount : countNum
		},
		success : function(data) {//请求成功
			if (data.execStatus == 'true') {

			}
		}
	});
}

/**
 * 查询评论信息
 */
function checkFeedCount(nowpage, reset) {
	var newresult = "";
	AjaxUtil.exeScript({
		script : "managers.news.newlistme",
		needTrascation : false,
		funName : "list",
		async : false,
		form : {
			fid : fid,
			p : nowpage
		},
		success : function(data) {//请求成功
			oldpage = 0;
			api.hideProgress();
			page = page + 1;
			//			alert(page+"======"+time);
			var feedcon = data.datasources[0].rows;
			if (reset == "yes") {
				$.attachInfiniteScroll($('.infinite-scroll'));
				$('li').remove();
			}
			if (page > time + 1) {
				// 加载完毕，则注销无限加载事件，以防不必要的加载
				$.detachInfiniteScroll($('.infinite-scroll'));
				// 删除加载提示符
				$('.infinite-scroll-preloader').remove();
				//			api.hideProgress();
				if ($('.noneCot').css("display") == 'none') {//如果show是隐藏的
					$('.noneCot').css("display", "block");
				}
				return;
			}

			for ( a = 0; a < feedcon.length; a++) {
				var rows = feedcon[a];
				var nick = rows.nick;
				if (nick == null || nick == "") {
					nick = "匿名";
				}
				var nowli = feeddiv.replace("\"[member]\"", nick);
				nowli = nowli.replace("\"[time]\"", rows.feedtime);
				nowli = nowli.replace("\"[content]\"", rows.content);
				newresult += nowli;
			}
			$("ul").append(newresult);
			//feiqp
			if (data.datasources[0].rowCount - (page - 2) * 5 < 5) {
				// 加载完毕，则注销无限加载事件，以防不必要的加载
				$.detachInfiniteScroll($('.infinite-scroll'));
				// 删除加载提示符
				$('.infinite-scroll-preloader').remove();
				if ($('.noneCot').css("display") == 'none') {//如果show是隐藏的
					$('.noneCot').css("display", "block");
				}
			}
			//feiqp
			time = Math.ceil(data.datasources[0].rowCount / 5);
			$("#count_feed").html(data.datasources[0].rowCount);
			if (islocation == true) {
				window.location.hash = "#ul";
				islocation = false;
			}
		}
	});
}

function showProgress() {
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '努力加载中...',
		text : '先喝杯茶...',
		modal : true
	});
}

function refresh() {
	api.setPrefs({
		key : 'isnew',
		value : false
	});
	location.reload();
}
