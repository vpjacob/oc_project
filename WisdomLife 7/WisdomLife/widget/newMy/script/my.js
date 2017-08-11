var memberid;
var roomLength = 0;
var roomReviewed = false;
var membercode;
var isIos;
var satatus;
var headurls='';
var userInfo = {
};
var urId;
apiready = function() {
	//	获取用户id、金银蛋 金币数据统计
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		getUesrInfo(urId);
		$('#name').html('用户id：' + urId);
	});

	api.readFile({
		path : 'fs://wisdomLifeData/equipment.json'
	}, function(ret, err) {
		if (ret.status) {
			var hasEq = $api.strToJson(ret.data)[0].hasEq;
			api.setPrefs({
				key : 'hasEq',
				value : hasEq
			});
		} else {
			api.setPrefs({
				key : 'hasEq',
				value : false
			});
			var obj = [];
			var equipmentinfo = {};
			equipmentinfo.hasEq = false;
			equipmentinfo.name = "";
			equipmentinfo.wifiName = "";
			equipmentinfo.pwd = "";
			equipmentinfo.isRecode = 0;
			obj.push(equipmentinfo);
			//			}
			FileUtils.writeFile(obj, "equipment.json", function(info, err) {
				//				alert('写入成功'); 在写入的时候会自动新建文件
			});
		}
	});

	/**
	 * 获取memberid，并获取个人的相关信息
	 */
	memberid = api.getPrefs({
		sync : true,
		key : 'memberid'
	});
	api.closeWin({
		name : 'register'
	});
	 urId = api.getPrefs({
		sync : true,
		key : 'userNo'
	});
	
	//获取遮罩是否显示===start
	var isFirst = api.getPrefs({
		sync : true,
		key : 'isFirst'
	});
	var telphone = api.getPrefs({
		sync : true,
		key : 'telphone'
	});

	//点击我的设备
	$("#mydevice").bind("click", function() {
		api.openWin({//打开有设备的界面
			name : 'allType',
			url : '../html/equipment/allType.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});

	
	$("#myfeedback").bind("click", function() {
		api.openWin({//打开意见反馈
			name : 'feedback',
			url : '../html/personal/feedback.html',
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

	});

	//我的推荐
	$('#myReferer').click(function() {
		//拼接服务器地址端口、执行方法、传递参数
		var address = rootUrl + "/jsp/recommendmobile?userNo=" + urId + "&userType=1";
		//请求二维码模块
		var scanner = api.require('scanner');
		scanner.encode({
			string : address,
			save : {
				imgPath : 'fs://',
				imgName : 'referUser.png'
			}
		}, function(ret, err) {
			if (ret.status) {
				api.openWin({
					name : 'myReferer',
					url : '../html/personal/myReferer.html',
					pageParam : {
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
	});
};

$(document).on('click', '.pic', function() {
	$("#photo").css("display", "block");
});
$("#photo .photo_bottom").on("click", function() {//弹出选择头像
	$("#photo").css("display", "none");
});
$('#album').click(function() {//选择相册
	getPicture(0);
	$("#photo").css("display", "none");
});
$('#tackpic').click(function() {//选择照相
	getPicture(1);
	$("#photo").css("display", "none");
});


//我的钱包点击事件
$(document).on('click', '#mywallet', function() {
	api.openWin({
		name : 'my-qianbao',
		url : 'my-qianbao.html',
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	}); 
});


///////////////////////我是萌萌的分割线/////////////////////////////////////////////
function getUesrInfo(urId) {
//	alert(123);
//	api.showProgress();
	AjaxUtil.exeScript({
		script : "mobile.center.message.message",
		needTrascation : false,
		funName : "getmessageStatus",
		form : {
			memberid : memberid
//			"userNo":urId
		},
		success : function(data) {
//			api.hideProgress();
			console.log('检查推送状态' + $api.jsonToStr(data));
			if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
				satatus = data.datasources[0].rows[0].messagestatus;
				//获取个人信息
				AjaxUtil.exeScript({
					script : "managers.home.person",
					needTrascation : false,
					funName : "getmemberinfo",
					form : {
//						memberid : memberid
						"userNo":urId
					},
					success : function(data) {
						console.log('获取个人信息'+$api.jsonToStr(data));
//						api.hideProgress();
						if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
							var result = data.datasources[0].rows[0];
							if (result.head_image != null) {
								$('#headurl').attr('src', rootUrl + result.head_image);
							}
						} else {
							api.alert({
								msg : '没有查到您的信息或者您的网络出问题了!'
							});
						}
					}
				});
			} else {
				api.alert({
					msg : '获取个人信息失败,请您重新加载！'
				});
			}
//			api.hideProgress();
		}
	})
}

function touchstart(o) {
	o.style.backgroundColor = '#eaeaea';
	setTimeout(function() {
		aa.style.background = "#fff";
	}, 1000 * 0.2);
}



/**
 *重新刷新页面
 */
function refresh() {
	location.reload();
}

function close() {
	api.closeFrame({
	});
}

/**
 *从新刷新头像
 */
function reloadheaderurl() {
	FileUtils.readFile("info.json", function(info, err) {
		PrefsUtil.setPrefs("hasLogon", info.hasLogon);
		PrefsUtil.setPrefs("memberid", info.memberid);
		memberid = info.memberid;
		//获得个人信息
//		api.showProgress();
		AjaxUtil.exeScript({
			script : "managers.home.person",
			needTrascation : false,
			funName : "getmemberinfo",
			form : {
				memberid : memberid
			},
			success : function(data) {
				console.log($api.jsonToStr(data));
//				api.hideProgress();
				if (data.execStatus == 'true' && data.datasources[0].rows.length > 0) {
					var result = data.datasources[0].rows[0];
					membercode = result.membercode;
					if (result.head_image != null) {
						$('#headurl').attr('src', rootUrl + result.head_image);
					}
					api.setPrefs({
						key : 'membercode',
						value : membercode
					});
				} else {
					api.alert({
						msg : '没有查到您的信息或者您的网络出问题了!'
					}, function(ret, err) {
						//coding...
					});
				}
			}
		});
	});
}

function xiaoxi() {
	api.openWin({//打开意见反馈
		name : 'xiaoxi',
		url : '../html/personal/myMessage.html',
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

function shezhi() {
	api.openWin({//打开意见反馈
		name : 'shezhi',
		url : '../html/home/shezhi.html',
		slidBackEnabled : true,
		pageParam : {
			memberid : memberid,
			uer:urId
		},
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}

/**
 *本地图片和拍照  0：本地，1：拍照
 * @param {Object} type
 */
function getPicture(type) {
	if (type == 0) {//本地相册
		api.getPicture({
			sourceType : 'library',
			mediaValue : 'pic',
			destinationType : 'url',
			allowEdit : true,
			quality : 100,
			saveToPhotoAlbum : false
		}, function(ret, err) {
			if (ret) {
				compress(ret.data);
			} else {
			}
		});
	} else {//拍照
		api.getPicture({
			sourceType : 'camera',
			encodingType : 'jpg',
			mediaValue : 'pic',
			destinationType : 'url',
			allowEdit : true,
			quality : 100,
			saveToPhotoAlbum : false
		}, function(ret, err) {
			if (ret) {
				compress(ret.data);
			} else {
			}
		});
	}
}

//图片压缩
function compress(compressPic) {
		var imgTempPath = compressPic.substring(compressPic.lastIndexOf("/"));
		var imageFilter = api.require('imageFilter');
		imageFilter.compress({
			img : compressPic,
			quality : 0.05,
			save : {
				imgPath : "fs://imgtemp",
				imgName : imgTempPath
			}
		}, function(ret, err) {
			if (ret.status) {
				headurls= "fs://imgtemp" + imgTempPath;
				changeheadurl(headurls);
			} else {
				alert(JSON.stringify(err));
			}
		});
	}


function changeheadurl(headurl) {
	if (headurl) {
		api.showProgress();
		api.ajax({
			url : rootUrl + '/api/upload',
			method : 'post',
			data : {
				files : {
					file : headurl
				},
			}
		}, function(ret, err) {
			api.hideProgress();
			if (ret.execStatus == 'true') {
				headurl = ret.formDataset.saveName;
				AjaxUtil.exeScript({
					script : "managers.home.person",
					needTrascation : false,
					funName : "updatememberinfo",
					form : {
						headurl : headurl,
						nick : "",
						sex : "",
						birthday : "",
						address : "",
						telphone : "",
						pwd : "",
						memberid : memberid,
						userNo:urId.substr(0,1)
					},
					success : function(data) {
						api.hideProgress();
						console.log($api.jsonToStr(data));
						if (data.execStatus == 'true') {
							$('#headurl').attr('src', rootUrl + headurl);
//							console.log("地址：" + rootUrl + headurl);
							api.execScript({//刷新person界面数据
								name : 'root',
								frameName : 'room',
								script : 'refresh();'
							});
						}
					}
				});

			} else {
				api.alert({
					msg : '上传图片失败,请您从新上传'
				});
			}
		});
	}
}