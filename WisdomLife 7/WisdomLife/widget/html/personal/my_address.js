//用户id
var memberid;
apiready = function() {
var header = $api.byId('header');
	if(api.systemType=='ios')
	{	  
	    var cc=$api.dom('.add_adress');
		$api.css(header,'margin-top:20px;');
		$api.css(cc,'margin-top:3.2rem;');		
	}

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
				var memberRoomMap = data.datasources[0].rows;
				if (memberRoomMap.length != 0) {
					for (var i = 0; i < memberRoomMap.length; i++) {
						getroomPlaceByRoomid(memberRoomMap[i].roomid);
					}
				} else {
					api.openWin({
						name : 'personalpage',
						url : 'personal.html',
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
//				ProgressUtil.hideProgress();
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

};

/**
 *返回 
 */
function goback(){
	api.closeWin();
}


/**
 * 根据房间id查询房间信息
 * @param {Object} roomid
 */
function getroomPlaceByRoomid(roomid) {
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
			place = roomPlaceInfo.city + roomPlaceInfo.area + roomPlaceInfo.name +roomPlaceInfo.fno+roomPlaceInfo.roomno;
			var roomList = $api.byId('addressList');
			$api.append(roomList, '<li abbr="' + roomid + '" onclick="toroomindexPage(this)"><p>' + place + '</p><i class="icon iconfont icon-xiangyou1" style="margin-right:5px;line-height:50px;float:right;"></i></li>');
			ProgressUtil.hideProgress();
		}
	});
	
}

/**
 *跳转到编辑房间页面
 * @param {Object} th
 */
function toroomindexPage(th) {
	var roomid = $api.attr(th, 'abbr');
	api.openWin({
		name : 'addroom',
		url : 'change_addr.html',
		slidBackEnabled : true,
		pageParam : {
			roomid : roomid,
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
 * 跳转到新增页面
 */
function addHousepage() {
	api.openWin({
		name : 'addroom',
		url : 'roominfo.html',
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}

function refresh() {
	location.reload();
}

