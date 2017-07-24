$.init();
var memberid;
var roomid;
apiready = function() {
var header = $api.byId('header');
	if(api.systemType=='ios')
	{	  
	    var cc=$api.dom('.content');
		$api.css(header,'margin-top:20px;');
		$api.css(cc,'margin-top:20px;');		
	}
	
memberid = api.pageParam.memberid;
roomid=api.pageParam.roomid;
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '努力加载中...',
		text : '先喝杯茶...'
	});
	getList();
	$(document).on('touchstart', '.changeC', function() {
		$(this).css({
			"background-color" : "#fff",
			"color" : "#1fb8f0"
		});
	});
	$(document).on('touchend', '.changeC', function() {
		$(this).css({
			"background-color" : "#1fb8f0",
			"color" : "#fff"
		});
	});
	$('#back').click(function() {
		api.closeWin();
	});
	// 添加'refresh'监听器
	$(document).on('refresh', '.pull-to-refresh-content', function(e) {
			getList();
	});
};
/**
 * 保修列表
 */
function getList() {
	AjaxUtil.exeScript({
		script : "managers.home.home",
		needTrascation : false,
		funName : "fixlist",
		form : {
			memberid : memberid,
			roomid : roomid
		},
		success : function(data) {
			api.hideProgress();
			// 加载完毕需要重置
			$.pullToRefreshDone('.pull-to-refresh-content');
			$('li').remove();
			if (data.execStatus == 'true') {
				var tdstr = "";
				var res = data.datasources[0].rows;
				if (res.length == 0) {
					tdstr += "<a style='display:block;text-align: center; padding: 20px; width: 100%;'><li style='width: 100%; height: auto; font-size: 14px; color:#777; letter-spacing: 1px;'>暂无数据</li></a>";
				} else {
					for (var i = 0; i < res.length; i++) {
						var nowid = res[i].fid;
						tdstr += "<a  id='" + nowid + "' style='display:block; width: 100%;' onclick='jump(this)'><li class='styleLine' ontouchstart='touchstart(this)'>";
						if (res[i].status == 1 || res[i].status == null)
							tdstr += "<div  class='aa noneR'>";
						else if (res[i].status == 2)
							tdstr += "<div  class='aa nowGre'>";
						else
							tdstr += "<div  class='aa finGray'>";

						tdstr += res[i].descript + "<span class='things'></span></div>";
						tdstr += "<div class='times'>" + res[i].reporttime + "</div>";
						tdstr += "</li></a>";
					}
				}
				//加载列表
				$(".item-ul").html(tdstr);
				//$("#back").bind('val','/jsp/center?fid='+fid);
			} else {
			api.alert({
				msg : "请求失败"
			}, function(ret, err) {
				//coding...
			});
			}
		}
	});
}

/**
 *点击跳转到报修详情
 * @param {Object} fid
 */
function jump(attr) {
	api.openWin({
		name : 'maintaininfo',
		url : 'maintaininfo.html',
		pageParam : {
			fid : $(attr).attr('id')
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
 *跳转到添加保修
 * @param {Object} o
 */
function goadd() {
	api.openWin({
		name : 'maintainadd',
		url : 'maintainadd.html',
		pageParam : {
			memberid : memberid,
			roomid: roomid
		},
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}

function touchstart(o) {
	o.style.backgroundColor = '#eaeaea';
	var aDiv = document.getElementsByTagName('li');
	for (var i = 0; i < aDiv.length; i++) {
		aDiv[i].id = 'li' + i;
		// var aa=aDiv.setAttribute("id",'li'+i);
		if (aDiv[i].id == o.id) {
			setTimeout(function() {
				test(o.id);
			}, 1000 * 0.2);
		}
	}
}

function test(ss) {
	var aa = document.getElementById(ss);
	aa.style.background = "#fff";
}