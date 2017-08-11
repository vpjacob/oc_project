$.init();
var memberid;
var p = 1;
var urId;
var nowli = "<li class='item-content' onclick='messagedetail(\"[fid]\");' style='border-bottom: 12px solid #f6f6f6;'><div class='item-inner'>" + "<div class='title-mid'><h1>\"[title]\"</h1><span>\"[broadtime]\"</span></div></div></li>";
apiready = function() {
	api.setPrefs({
		key : 'msgnum',
		value : 0
	});
	api.execScript({
		name : 'root',
		frameName : 'weather',
		script : 'hidepot();'
	});
	api.execScript({
		name : 'root',
		frameName : 'room',
		script : 'hidepot();'
	});
	memberid = api.pageParam.memberid;
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}
	var newsResult = "";
	// 注册'infinite'事件处理函数
	$(document).on('infinite', '.infinite-scroll-bottom', function() {
		p = p + 1;
		getList();
		//			alert('加载完成');
		//			// 加载完毕，则注销无限加载事件，以防不必要的加载
		//			$.detachInfiniteScroll($('.infinite-scroll'));
		//			// 删除加载提示符
		//			$('.infinite-scroll-preloader').remove();
	});
	FileUtils.readFile("info.json", function(info, err) {
			urId=info.userNo;
			getList(urId);
			
		});
	

function getList(urId) {
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.message.message",
		needTrascation : false,
		funName : "getmessageList",
		form : {
			userNo:urId,
			p:p
		},
		success : function(data) {
		console.log($api.jsonToStr(data));
			ProgressUtil.hideProgress();
			var newsResult = "";
			if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
				for ( a = 0; a < data.datasources[0].rows.length; a++) {
					var rows = data.datasources[0].rows[a];
					var result = nowli.replace("[fid]", rows.relateid);
					result = result.replace("\"[title]\"", rows.title);
					result = result.replace("\"[broadtime]\"", rows.broadtime);
					newsResult += result;
				}
				$('ul').append(newsResult);
				if (data.datasources[0].rows.length <= 10) {
					// 加载完毕，则注销无限加载事件，以防不必要的加载
					$.detachInfiniteScroll($('.infinite-scroll'));
					// 删除加载提示符
					$('.infinite-scroll-preloader').remove();
				}
				//					var result = nowli.replace("[fid]", rows.fid);
			} else if (data.execStatus == 'true' && data.datasources[0].rows.length == 0) {
				api.alert({
					msg : '没有消息可以查看......'
				}, function(ret, err) {
					api.closeWin();
					// 加载完毕，则注销无限加载事件，以防不必要的加载
					$.detachInfiniteScroll($('.infinite-scroll'));
					// 删除加载提示符
					$('.infinite-scroll-preloader').remove();
				});
			} else {
				api.alert({
					msg : '没有查到您的信息或者您的网络出问题了!'
				}, function(ret, err) {
					// 加载完毕，则注销无限加载事件，以防不必要的加载
					$.detachInfiniteScroll($('.infinite-scroll'));
					// 删除加载提示符
					$('.infinite-scroll-preloader').remove();
				});
			}
		}
	});
}



}
function goback() {
	api.closeWin({
	});
}
function messagedetail(relateid) {
	api.openWin({
		name : 'messagedetail',
		url : 'messagedetail.html',
		pageParam : {
			relateid : relateid
		},
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}
//function getList() {
//	api.showProgress({
//	});
//	AjaxUtil.exeScript({
//		script : "managers.home.person",
//		needTrascation : false,
//		funName : "getmemberinfo",
//		form : {
//			memberid : memberid
//		},
//		success : function(data) {
//			api.hideProgress();
//			if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
//
//			} else {
//				api.alert({
//					msg : '没有查到您的信息或者您的网络出问题了!'
//				}, function(ret, err) {
//					//coding...
//				});
//			}
//		}
//	});
//}