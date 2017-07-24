//用户id
var memberid;
//向下跳转时保存的参数
var placeTojump = "";
apiready = function() {
	memberid = api.pageParam.memberid;
	ProgressUtil.showProgress();

	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:40px;');
	}
	//加载房间
	loadRoom();
	var stepW = 24;
	var stars = $("#star > li");
	var descriptionTemp;
	$("#showb").css("width", 0);
	//	stars.each(function(i) {
	//		$(stars[i]).click(function(e) {
	//			var n = i + 1;
	//			$("#showb").css({
	//				"width" : stepW * n
	//			});
	//			descriptionTemp = description[i];
	//			$(this).find('a').blur();
	//			return stopDefault(e);
	//			return descriptionTemp;
	//		});
	//	});

	//	//生成二维码
	//	$("#propertymanager").bind("click", function() {
	//
	//	});

	$("#goback").click(function() {
		goback();
	});

	//	$("#propertymanager").bind("click", function() {
	//		api.alert({
	//			msg : "该模块暂未开放"
	//		}, function(ret, err) {
	//			//coding...
	//		});
	//	});
	//	$("#leaseofhouses").bind("click", function() {
	//		api.alert({
	//			msg : "该模块暂未开放"
	//		}, function(ret, err) {
	//			//coding...
	//		});
	//	});
	//	$("#secondhandexchange").bind("click", function() {
	//		api.alert({
	//			msg : "该模块暂未开放"
	//		}, function(ret, err) {
	//			//coding...
	//		});
	//	});
	//	$("#xiaokesport").bind("click", function() {
	//		api.alert({
	//			msg : "该模块暂未开放"
	//		}, function(ret, err) {
	//			//coding...
	//		});
	//	});
	//	$("#visitorinvitation").bind("click", function() {
	//		api.alert({
	//			msg : "该模块暂未开放"
	//		}, function(ret, err) {
	//			//coding...
	//		});
	//	});
	//	$("#parcel").bind("click", function() {
	//		api.alert({
	//			msg : "该模块暂未开放"
	//		}, function(ret, err) {
	//			//coding...
	//		});
	//	});
	//	$("#myrecord").bind("click", function() {
	//		api.alert({
	//			msg : "该模块暂未开放"
	//		}, function(ret, err) {
	//			//coding...
	//		});
	//	});
};

/**
 *我的管家
 */
function getmySteward(roomid) {
	api.openWin({
		name : 'roomindex',
		url : '../personal/steward.html',
		pageParam : {
			memberid : memberid,
			roomid : roomid,
			placeTojump : placeTojump
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
	setTimeout(function() {
		o.style.backgroundColor = '#fff';
	}, 1000 * 0.2);
}

function stopDefault(e) {
	if (e && e.preventDefault)
		e.preventDefault();
	else
		window.event.returnValue = false;
	return false;
}

/**
 *加载房间数
 */
function loadRoom() {
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getroomById",
		form : {
			memberid : memberid
		},
		success : function(data) {
			if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
				var memberRoomMap = data.datasources[0].rows;
				var dotindex = $api.byId('dotindex');
				var swiperdiv = $api.byId('swiperdiv');
				//填充房间数据
				for (var i = 0; i < memberRoomMap.length; i++) {
					if (i == 0) {
						$api.append(dotindex, '<span name="dot_focus" class="dot_focus" id = "dot_focus' + i + '" abbr ="' + memberRoomMap[i].roomid + '"></span>&nbsp');
					} else {
						$api.append(dotindex, '<span name="dot_focus" id = "dot_focus' + i + '" abbr ="' + memberRoomMap[i].roomid + '"></span>&nbsp');
					}
					//					$api.append(swiperdiv, '<div class="swiper-slide"><img src="../../image/temp/wodetouxiang.png" width="100" height="100" style="margin-left: 130px" onclick="tomyManagerPage()"/></div>')
					$api.append(swiperdiv, '<div class="swiper-slide"><img src="../../image/temp/wodetouxiang.png" width="100" height="100" style="margin-left: 130px" /></div>');
				}
				loadSwiper(i-1);
			} else {
				api.alert({
					title : '提示',
					msg : '对不起，加载房间信息失败，请您重新加载',
				}, function(ret, err) {
				});
			}
			ProgressUtil.hideProgress();
		}
	});
}

/**
 *加载平滑图片效果
 */

function loadSwiper(lastIndex) {
	var changedot_focus = '';
	var mySwiper = new Swiper('.swiper-container', {
		pagination : '.swiper-pagination',
		observer : true,
		//初始化加载
		onInit : function(swiper) {
			//位置
			var activeIndex = swiper.activeIndex;
			//房间id
			var roomid = $api.attr($api.byId('dot_focus' + activeIndex), 'abbr');
			//根据房间id获取房间位置信息（并且填充位置信息）
			getRoomPlaceByroomId(roomid);
			var roomPlace = document.getElementById('roomPlace');
			$api.attr(roomPlace, 'abbr', roomid);
		},
		//滑动开始
		onTouchStart : function(swiper, even) {
			//位置
			var activeIndex = swiper.activeIndex;
			//设置位置样式
			var nowDot_focus = $api.byId('dot_focus' + activeIndex);
			changedot_focus = nowDot_focus;
			//房间id
			var roomid = $api.attr(nowDot_focus, 'abbr');
			if(activeIndex!=0 && activeIndex!=lastIndex){
			   api.showProgress({});
			}
			

		},
		//滑动结束
		onSlideChangeEnd : function(swiper) {
		    api.hideProgress();
			//删除上一个位置的样式
			$api.removeCls(changedot_focus, 'dot_focus');
			//          $(".dot_focus").removeClass("dot_focus");
			var activeIndex = swiper.activeIndex;
			var nowDot_focus = $api.byId('dot_focus' + activeIndex);
			$api.addCls(nowDot_focus, 'dot_focus');
			var roomid = $api.attr(nowDot_focus, 'abbr');
			//根据房间id获取房间位置信息（并且填充位置信息）
			getRoomPlaceByroomId(roomid);
			var roomPlace = document.getElementById('roomPlace');
			$api.attr(roomPlace, 'abbr', roomid);

		}
	});
	//当前房间的房间id
	var pageRoomid;
	if (api.pageParam.roomid != null || api.pageParam.roomid != undefined) {
		pageRoomid = api.pageParam.roomid;
		var rooms = document.getElementsByName('dot_focus');
		//获取当前房间的位置
		for (var i = 0; i < rooms.length; i++) {
			//获取当前位置
			var nowDot_focus = $api.byId('dot_focus' + i);
			//删除当前位置样式
			$api.removeCls(nowDot_focus, 'dot_focus');
			//获取房间id
			var roomid = $api.attr(rooms[i], 'abbr');
			//如果房间id等于当前房间的id则定位到当前位置
			if (roomid == pageRoomid) {
				getRoomPlaceByroomId(roomid);
				$api.addCls(nowDot_focus, 'dot_focus');
				mySwiper.slideTo(i, 1000, false);
			}
		}

	}

}

/**
 *根据房间id获取房间位置信息
 */
function getRoomPlaceByroomId(roomid) {
	api.showProgress({
	});
	//位置信息
	var place;
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getRoomInfoByid",
		form : {
			roomid : roomid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
				var roomPlaceInfo = data.datasources[0].rows[0];

				//获取当前房间的位置信息
				place = roomPlaceInfo.city + roomPlaceInfo.area + roomPlaceInfo.name + roomPlaceInfo.fno + roomPlaceInfo.roomno;
				placeTojump = place;
				//填充位置
				var roomPlaceInfoSpan = document.getElementById('roomPlace');
				$api.text(roomPlaceInfoSpan, place);
			} else {
				api.alert({
					msg : '没有查到您的信息或者您的网络出问题了!'
				}, function(ret, err) {
					//coding...
				});
			}
		}
	});
}

/**
 * 跳转到房间管理页面
 */
function managerRoomAddress() {
	var roomid = $api.attr(document.getElementById('roomPlace'), 'abbr');
	api.openWin({
		name : 'managerRoom',
		url : '../personal/select_adress.html',
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
 *跳转到家庭成员界面
 */
function tofamily() {

	var roomid = $api.attr(document.getElementById('roomPlace'), 'abbr');
	api.openWin({
		name : 'managerRoom',
		url : '../personal/addfamily.html',
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
 *跳转到 我的管家页面
 */
function tomyManagerPage() {
	var roomPlace = document.getElementById('roomPlace');
	var roomid = $api.attr(roomPlace, 'abbr');
	AjaxUtil.exeScript({
		script : "managers.home.home",
		needTrascation : false,
		funName : "getKeyBaseInfo",
		form : {
			memberid : memberid,
			roomid : roomid
		},
		success : function(data) {
			if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
				var isauthorize = data.datasources[0].rows[0].isauthorize;
				if (isauthorize == false) {
					api.alert({
						msg : "抱歉，您的房间还未通过审核！"
					}, function(ret, err) {
						//coding...
					});
				} else
					getmySteward(roomid);
			} else {
				api.alert({
					msg : '没有查到您的信息或者您的网络出问题了!'
				}, function(ret, err) {
					//coding...
				});
			}
		}
	});
}

/**
 * 二维码界面
 */
function toqrcodePage() {
	var address = $("#roomPlace").html();
	var roomid = $api.attr(document.getElementById('roomPlace'), 'abbr');
	var scanner = api.require('scanner');
	scanner.encode({
		string : memberid + "," + roomid,
		save : {
			imgPath : 'fs://',
			imgName : 'myroominfo.png'
		}
	}, function(ret, err) {
		//	alert($api.jsonToStr(ret));
		if (ret.status) {
			api.openWin({
				name : 'house_codes',
				url : '../personal/house_codes.html',
				pageParam : {
					address : address,
					imgpath : ret.savePath
				},
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else {
			api.alert({
				msg : JSON.stringify(err)
			}, function(ret, err) {
				//coding...
			});
		}
	});

	//	var scanner = api.require('scanner');
	//	scanner.encode({
	//	    string: '123456789',
	//	    save: {
	//	        imgPath: 'fs://',
	//	        imgName: 'album.png'
	//	    }
	//	}, function(ret, err) {
	//	    if (ret.status) {
	//	        api.openWin({
	//				name : 'house_codes',
	//				url : '../personal/house_codes.html',
	//				pageParam : {
	//					address : address,
	//					imgpath : ret.savePath
	//				},
	//				slidBackEnabled : true,
	//				animation : {
	//					type : "push", //动画类型（详见动画类型常量）
	//					subType : "from_right", //动画子类型（详见动画子类型常量）
	//					duration : 300 //动画过渡时间，默认300毫秒
	//				}
	//			});
	//	    } else {
	//	        alert(JSON.stringify(err));
	//	    }
	//	});

	//	var address = $("#roomPlace").html();
	//	var roomid = $api.attr(document.getElementById('roomPlace'), 'abbr');
	////	alert(roomid);
	//	FNScanner.encodeImg({
	//		content : memberid+","+roomid,
	////		roomid : roomid ,
	//		saveToAlbum : true,
	//		saveImg : {
	//			path : 'fs://myroominfo.png',
	//			w : 200,
	//			h : 200
	//		}
	//	}, function(ret, err) {
	//		if (ret.status) {
	//			api.openWin({
	//				name : 'house_codes',
	//				url : '../personal/house_codes.html',
	//				pageParam : {
	//					address : address,
	//					imgpath : ret.imgPath
	//				},
	//				slidBackEnabled : true,
	//				animation : {
	//					type : "push", //动画类型（详见动画类型常量）
	//					subType : "from_right", //动画子类型（详见动画子类型常量）
	//					duration : 300 //动画过渡时间，默认300毫秒
	//				}
	//			});
	//		} else {
	//			alert(JSON.stringify(err));
	//		}
	//	});
}

/**
 *刷新页面
 */
function refresh() {
	location.reload();
}

function goback() {
	api.closeWin();
}