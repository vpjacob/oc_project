var memberid;
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.text');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:4.2rem;');
	}
	//获取用户id
	 memberid = api.pageParam.memberid;
	ProgressUtil.showProgress();
	//根据用户id获取房间信息
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getroomById",
		form : {
			memberid : memberid
		},
		success : function(data) {
			if (data.execStatus == 'true') {
				//用户所有房间
				var memberRoomMap = data.datasources[0].rows;
				for (var i = 0; i < memberRoomMap.length; i++) {
					//根据房间id查询房间信息
					getroomPlaceByRoomid(memberRoomMap[i].roomid);
				}

			} else {
				api.alert({
					title : '提示',
					msg : '获取房间信息失败',
				}, function(ret, err) {
				});
				return false;
			}
		}
	});
}
/**
 *返回
 */
function goback() {
	api.closeWin();
}

/**
 * 点击一条房间信息进入房间管理页面
 */
function toroomindexPage(th) {
	api.execScript({
		sync : true,
		name : 'roomIndex',
		script : 'refresh();'
	});
	//	setTimeout(function() {
	//		api.closeWin();
	//	}, 800);
	api.openWin({//打开我的房间界面
		name : 'roomIndex',
		url : '../home/roomindex.html',
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

/**
 * 根据房间id查询房间信息
 * @param {Object} roomid
 */
function getroomPlaceByRoomid(roomid) {
	//	alert(roomid);
	var place;
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getRoomInfoByid",
		form : {
			roomid : roomid
		},
		success : function(roominfo) {
			var roomPlaceInfo = roominfo.datasources[0].rows[0];
			place = roomPlaceInfo.city + roomPlaceInfo.area + roomPlaceInfo.name + roomPlaceInfo.fno + roomPlaceInfo.roomno;
			var roomList = $api.byId('addressList');
			$api.append(roomList, '<li name="address" abbr="' + roomid + '" onclick="toroomindexPage(this)"><p>' + place + '</p></li>');
			ProgressUtil.hideProgress();
		}
	});

}

/**
 *跳转到我的地址页面
 */
function toMyaddressPage() {
	var memberid = api.pageParam.memberid;
	api.openWin({
		name : 'myaddressPage',
		url : 'my_adress.html',
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

/**
 *刷新页面
 */
function refresh() {
	location.reload();
}
