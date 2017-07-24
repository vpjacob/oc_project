var memberid;
var telphone;
var code;
var wait = 60;
//用户信息
var userInfo = {
};
apiready = function() {
	memberid = api.pageParam.memberid;
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}

}
function goback() {
	api.closeWin();
}

function closePage() {
	api.closeWin();
}

function showPro() {
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '努力加载中...',
		text : '先喝杯茶...'
	});
}

//function xiaoxi() {
//	api.openWin({
//		name : 'messagelist',
//		url : '../personal/messagelist.html',
//		pageParam : {
//			memberid : memberid
//		},
//		slidBackEnabled : true,
//		animation : {
//			type : "push", //动画类型（详见动画类型常量）
//			subType : "from_right", //动画子类型（详见动画子类型常量）
//			duration : 300 //动画过渡时间，默认300毫秒
//		}
//	});
//}

function xiaoxi() {
	api.openWin({
		name : 'messagelist',
		url : '../personal/messagedetail.html',
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

function shezhi() {
	api.openWin({//打开意见反馈
		name : 'shezhi',
		url : '../home/shezhi.html',
		slidBackEnabled : true,
		pageParam : {
			memberid : memberid
		},
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}