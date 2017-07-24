var memberid;
var roomid;
var placeTojump;//获得跳转传递过来的地址
apiready = function() {
	memberid = api.pageParam.memberid;
	roomid = api.pageParam.roomid;	
	placeTojump = api.pageParam.placeTojump;
	$('#address').html(placeTojump);
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}

	$('#baoxiu').click(function() {
		api.openWin({
			name : 'maintainbase',
			url : 'maintainbase.html',
			pageParam : {
				memberid : memberid,
				roomid : roomid
			},
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#back').click(function() {
		api.closeWin();
	});
}; 