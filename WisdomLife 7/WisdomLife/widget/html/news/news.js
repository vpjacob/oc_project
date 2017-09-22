$.init();
var page = 1;
//加载次数
var maxpage;
//var nowli = "<li onclick='newsNext(\"[fid]\")'  class='lis' >" + "<img src='\"[src]\"' height='63' width='63' />" + "<div class='licenter'><div class='titles' id='txt'>" + "<h1 class='titleh'>\"[title]\"</h1></div><div class='tips'><div class='tipsleft'><div class='tltime'>\"[time]\"</div>" + "</div><div class='tipsright'><div class='tecontent'>\"[feedcount]\"</div></div></div></div><div class='toright'>" + "<a href='#' class='tra'><img src='../../image/jiantou.png' height='16' width='9' /></a></div></li>";
var nowli = "<li onclick='newsNext(\"[fid]\")'  class='lis' >" + "<img id='imgId' src='../image/2.png' height='63' width='63' />" + "<div class='licenter'><div class='titles' id='txt'>" + "<h1 class='titleh'>\"[title]\"</h1></div><div class='tips'><div class='tipsleft'><div class='tltime'>\"[time]\"</div>" + "</div><div class='tipsright'><i class='iconfont icon-liuyan' style='color:#cccccc'></i><div style='padding-top:3px'>\"[feedcount]\"</div></div></div></div><div class='toright'>" + "<a href='#' class='tra'></a><i class='iconfont icon-xiangyou1' style='color:#cccccc'></i></div></li>";

apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}


	check();
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '努力加载中...',
		text : '先喝杯茶...',
		modal : true
	});
	addLi();
	$('#back').click(function() {
		api.closeWin();
	});
	// 注册'infinite'事件处理函数
	$(document).on('infinite', '.infinite-scroll-bottom', function() {

		if (page > maxpage) {
			// 加载完毕，则注销无限加载事件，以防不必要的加载
			$.detachInfiniteScroll($('.infinite-scroll'));
			// 删除加载提示符
			$('.infinite-scroll-preloader').remove();
			return;
		} else
			addLi();
	});
};
/**
 * 新闻列表
 */
function addLi() {
	var screenWidth = api.screenWidth;
	AjaxUtil.exeScript({
		script : "managers.news.newslist",
		needTrascation : false,
		funName : "list_mobile",
		form : {
			p : page,
			typeid : api.pageParam.typeid,
			title : "",
			recordtype : "",
			starttime : "",
			endtime : "",
			istop : ""
		},
		success : function(data) {
			page = page + 1;
			api.hideProgress();
			if (data.execStatus == 'true') {
				if (data.datasources[0].rows.length == 0) {
					// 加载完毕，则注销无限加载事件，以防不必要的加载
					$.detachInfiniteScroll($('.infinite-scroll'));
					// 删除加载提示符
					$('.infinite-scroll-preloader').remove();

					api.alert({
						msg : '该类型新闻没有更多了。。。'
					}, function(ret, err) {
						//coding...
					});
					api.closeWin();
				} else {
					var newsResult = "";
					for ( a = 0; a < data.datasources[0].rows.length; a++) {
						var rows = data.datasources[0].rows[a];
						var result = nowli.replace("[fid]", rows.fid);
						if (screenWidth == '320') {
							rows.title = rows.title.substring(0, 20) + "......";
						} else {
							rows.title = rows.title.substring(0, 22) + "......";
						}
						result = result.replace("\"[title]\"", rows.title);
						result = result.replace("\"[feedcount]\"", rows.feedcount);
						result = result.replace("\"[time]\"", rows.issuetime);
						if (rows.imgurl != null){
							result = result.replace("../image/2.png", rootUrl + rows.imgurl);
						}
						newsResult += result;
					}
					$('ul').append(newsResult);

					maxpage = Math.ceil(data.datasources[0].rowCount / 10);
					if (maxpage == 1) {
					
//					var imgdefereds=[];
//					$('#imgId').each(function(){
//						 var dfd=$.Deferred();
//						 $(this).bind('load',function(){
//							 dfd.resolve();
//						 }).bind('error',function(){
//						 //图片加载错误，加入错误处理
//						 // dfd.resolve();
//						 })
//						 if(this.complete) setTimeout(function(){
//						 	dfd.resolve();
//						 },5000);
//						 imgdefereds.push(dfd);
//					})
//					$.when.apply(null,imgdefereds).done(function(){
//					  callback();
//					});
						
						// 加载完毕，则注销无限加载事件，以防不必要的加载
						$.detachInfiniteScroll($('.infinite-scroll'));
						// 删除加载提示符
						$('.infinite-scroll-preloader').remove();
					}
				}
			} else {
				alert("请求失败");
			}
		}
	});
}

function newsNext(fid) {//点击查看新闻详情

	api.openWin({//打开新闻详情界面
		name : 'newsinfo',
		url : 'newsinfo.html',
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

function check() {
	var op = document.getElementsByTagName('h1');
	for (var i = 0; i < op.length; i++) {
		var text = document.getElementsByTagName('h1')[i];
		var str = text.innerHTML;
		if (str.length > 23) {
			text.innerHTML = str.substring(0, 23) + '...'
		}
	}
}
