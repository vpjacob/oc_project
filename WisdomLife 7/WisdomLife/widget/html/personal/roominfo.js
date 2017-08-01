var identifyingCode = "";
var wait = 60;
var tenantwait = 60;
//var subdid;
//var roomid;
var memberid;
var scanner;
var isRegister = 0;
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}

	//获取当前时间
	//	var nowDate = new Date();
	//	var fnowDate = '';
	////  nowDate = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
	//  if(nowDate.getMonth() < 9){
	//  	fnowDate = fnowDate + nowDate.getFullYear() + "-" + '0'+(nowDate.getMonth() + 1);
	//  }else{
	//  	fnowDate = fnowDate + nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1);
	//  }
	//
	//  if(nowDate.getDate() <10 ){
	//  	fnowDate = fnowDate + "-" +'0'+nowDate.getDate();
	//  }else{
	//  	fnowDate = fnowDate + "-" + nowDate.getDate();
	//  }
	//
	//  //设置当前时间之前不能选择
	//	$api.attr($api.byId('duetime'), 'min', fnowDate);

	$("#duetime").calendar({
		value : [curDateTime()],
		minDate : curDateTime(),
		onChange : function(p, values, displayValues) {
			if (curDateTime() != displayValues) {
				$("#duetime").val(displayValues);
			}
		}
	});

	//	alert($api.attr($api.byId('duetime'), 'min'));
	scanner = api.require('scanner');
	memberid = api.getPrefs({
		sync : true,
		key : 'memberid'
	});
	locationAddress();
	tenantlocationAddress();
}
function curDateTime() {
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var date = d.getDate();
	var day = d.getDay();
	var curDateTime = year;
	if (month > 9)
		curDateTime = curDateTime + "-" + month;
	else
		curDateTime = curDateTime + "-" + "0" + month;
	if (date > 9)
		curDateTime = curDateTime + "-" + date;
	else
		curDateTime = curDateTime + "-" + "0" + date;
	return curDateTime;
}

function sendCode(th) {
	var telphone = $api.val($api.byId('telphone'));
	if (telphone != '') {
		$(".btn-yz").removeClass("sure-y").addClass("sure-n");
		sendIdentifyingCode();
		time();
	} else {
		api.alert({
			title : '系统提示',
			msg : '手机号不可以为空!'
		}, function(ret, err) {
		});
	}
}

/**
 * 发送验证码
 */
function sendIdentifyingCode() {
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "sendIdentifyingCode",
		form : {
			telphone : $("#telphone").val()
		},
		success : function(data) {
			if (data.formDataset.checked === "true") {
				identifyingCode = data.formDataset.code;
				//				alert(identifyingCode);
				if (identifyingCode != "") {
					api.alert({
						title : '系统提示',
						msg : '验证码发送成功!'
					}, function(ret, err) {

					});
				} else {
					api.alert({
						title : '系统提示',
						msg : '验证码发送失败!'
					}, function(ret, err) {
						//coding...
					});
				}
			} else {
				api.alert({
					title : '系统提示',
					msg : '您的账号尚未注册,请您先注册!'
				}, function(ret, err) {
					//coding...
				});
			}
		}
	});

}

function time() {
	var o = $api.byId('identifyingCodeBtn')
	if (wait == 0) {
		o.removeAttribute("disabled");
		o.value = "获取验证码";
		o.style.background = "#fff";
		wait = 60;
		$(".btn-yz").removeClass("sure-n").addClass("sure-y");
	} else {
		o.setAttribute("disabled", true);
		o.value = "重新发送(" + wait + ")";
		o.style.background = "#bfbfbf";
		wait--;
		setTimeout(function() {
			time(o)
		}, 1000)
	}
}

/**
 *加载省份
 */
function locationAddress() {
	var telphone = api.getPrefs({
		sync : true,
		key : 'telphone'
	});
	$api.val($api.byId('telphone'), telphone);
	var provinceSelect = document.getElementById("province");
	provinceSelect.innerHTML = "";
	var province = new Option();
	province.value = "请选择省";
	province.text = "请选择省";
	provinceSelect.options.add(province);
	for (var i = 0; i < data.length; i++) {
		var province = new Option();
		province.value = data[i].name;
		province.text = data[i].name;
		provinceSelect.options.add(province);
	}
}

/**
 *省份改变加载城市
 */
function changep() {
	var myselect = document.getElementById("province");
	var index = myselect.selectedIndex;
	var province = myselect.options[index].text;
	var citySelect = document.getElementById("city");
	citySelect.innerHTML = "";
	var city = new Option();
	city.value = "请选择市";
	city.text = "请选择市";
	citySelect.options.add(city);

	var areaSelect = document.getElementById("area");
	areaSelect.innerHTML = "";
	var area = new Option();
	area.value = "请选择区";
	area.text = "请选择区";
	areaSelect.options.add(area);

	var subSelect = document.getElementById("subDistrict");
	subSelect.innerHTML = "";
	var sub = new Option();
	sub.value = "请选择小区";
	sub.text = "请选择小区";
	subSelect.options.add(sub);

	var subidSelect = document.getElementById("subdistrictid");
	subidSelect.innerHTML = "";
	var subid = new Option();
	subid.value = "请选择楼栋号";
	subid.text = "请选择楼栋号";
	subidSelect.options.add(subid);

	var roomidSelect = document.getElementById("roomid");
	roomidSelect.innerHTML = "";
	var room = new Option();
	room.value = "请选择房间号";
	room.text = "请选择房间号";
	roomidSelect.options.add(room);

	//	alert(province);
	for (var i = 0; i < data.length; i++) {
		if (data[i].name == province) {
			for (var j = 0; j < data[i].city.length; j++) {
				var city = new Option();
				city.value = data[i].city[j].name;
				city.text = data[i].city[j].name;
				citySelect.options.add(city);
			}
		}
	}
}

/**
 *城市改变加载区域
 */
function changec() {
	var provinceSelect = document.getElementById("province");
	var provinceIndex = provinceSelect.selectedIndex;
	var province = provinceSelect.options[provinceIndex].text;
	var myselect = document.getElementById("city");
	var index = myselect.selectedIndex;
	var city = myselect.options[index].text;
	var areaSelect = document.getElementById("area");
	areaSelect.innerHTML = "";
	var area = new Option();
	area.value = "请选择区";
	area.text = "请选择区";
	areaSelect.options.add(area);

	var subSelect = document.getElementById("subDistrict");
	subSelect.innerHTML = "";
	var sub = new Option();
	sub.value = "请选择小区";
	sub.text = "请选择小区";
	subSelect.options.add(sub);

	var subidSelect = document.getElementById("subdistrictid");
	subidSelect.innerHTML = "";
	var subid = new Option();
	subid.value = "请选择楼栋号";
	subid.text = "请选择楼栋号";
	subidSelect.options.add(subid);

	var roomidSelect = document.getElementById("roomid");
	roomidSelect.innerHTML = "";
	var room = new Option();
	room.value = "请选择房间号";
	room.text = "请选择房间号";
	roomidSelect.options.add(room);

	for (var i = 0; i < data.length; i++) {
		if (data[i].name == province) {
			for (var j = 0; j < data[i].city.length; j++) {
				if (data[i].city[j].name == city) {
					for (var k = 0; k < data[i].city[j].area.length; k++) {
						var area = new Option();
						area.value = data[i].city[j].area[k];
						area.text = data[i].city[j].area[k];
						areaSelect.options.add(area);
					}
				}
			}
		}
	}
}

/**
 *区域改变加载小区
 */
function changeSubd() {
	var provinceSelect = document.getElementById("province");
	var provinceIndex = provinceSelect.selectedIndex;
	var province = provinceSelect.options[provinceIndex].text;

	var citySelect = document.getElementById("city");
	var cityIndex = citySelect.selectedIndex;
	var city = citySelect.options[cityIndex].text;

	var areaSelect = document.getElementById("area");
	var areaIndex = areaSelect.selectedIndex;
	var area = areaSelect.options[areaIndex].text;

	var subSelect = document.getElementById("subDistrict");
	subSelect.innerHTML = "";
	var sub = new Option();
	sub.value = "请选择小区";
	sub.text = "请选择小区";
	subSelect.options.add(sub);

	var subidSelect = document.getElementById("subdistrictid");
	subidSelect.innerHTML = "";
	var subid = new Option();
	subid.value = "请选择楼栋号";
	subid.text = "请选择楼栋号";
	subidSelect.options.add(subid);

	var roomidSelect = document.getElementById("roomid");
	roomidSelect.innerHTML = "";
	var room = new Option();
	room.value = "请选择房间号";
	room.text = "请选择房间号";
	roomidSelect.options.add(room);
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "managers.subdistrict.subdistrictlist",
		needTrascation : false,
		//		funName : "listForapp",
		funName : "subdistrictList",
		form : {
			prince : province,
			city : city,
			area : area
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				if (data.datasources[0].rows.length == 0) {
					api.alert({
						title : '提示',
						msg : '该地区没有小区信息',
					}, function(ret, err) {
					});
				} else {
					var rows = data.datasources[0].rows;
					for (var i = 0; i < rows.length; i++) {
						var subDistrict = new Option();
						subDistrict.value = rows[i].fid;
						subDistrict.text = rows[i].name;
						subSelect.options.add(subDistrict);
					}
				}
			} else {
				api.alert({
					title : '提示',
					msg : '获取小区列表失败 ',
				}, function(ret, err) {
				});
				return false;
			}

		}
	});

}

/**
 *小区改变加载楼栋
 */
function changesubDistrict() {
	var subSelect = document.getElementById("subDistrict");
	var subIndex = subSelect.selectedIndex;
	var subid = subSelect.options[subIndex].value;

	var subdistrictidSelect = document.getElementById("subdistrictid");
	subdistrictidSelect.innerHTML = "";
	var subidOption = new Option();
	subidOption.value = "请选择楼栋号";
	subidOption.text = "请选择楼栋号";
	subdistrictidSelect.options.add(subidOption);

	var roomidSelect = document.getElementById("roomid");
	roomidSelect.innerHTML = "";
	var room = new Option();
	room.value = "请选择房间号";
	room.text = "请选择房间号";
	roomidSelect.options.add(room);

	//	var subdistrictidSelect = document.getElementById("subdistrictid");
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		//		funName : "listForapp",
		funName : "selectsubd",
		form : {
			subdistrictid : subid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				if (data.datasources[0].rows.length == 0) {
					api.alert({
						title : '提示',
						msg : '该小区没有楼栋信息',
					}, function(ret, err) {
					});
				} else {
					var rows = data.datasources[0].rows;
					for (var i = 0; i < rows.length; i++) {
						var subdistrictidOption = new Option();
						subdistrictidOption.value = rows[i].fid;
						subdistrictidOption.text = rows[i].fno;
						subdistrictidSelect.options.add(subdistrictidOption);
					}
				}
			} else {
				api.alert({
					title : '提示',
					msg : '获取楼栋列表失败 ',
				}, function(ret, err) {
				});
				return false;
			}

		}
	});

}

/**
 *楼栋改变加载房间
 */
function changeSubdistrictid() {
	var subidSelect = document.getElementById("subdistrictid");
	var subidIndex = subidSelect.selectedIndex;
	var mansionid = subidSelect.options[subidIndex].value;

	var roomidSelect = document.getElementById("roomid");
	roomidSelect.innerHTML = "";
	var room = new Option();
	room.value = "请选择房间号";
	room.text = "请选择房间号";
	roomidSelect.options.add(room);

	var roomidSelect = document.getElementById("roomid");
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		//		funName : "listForapp",
		funName : "selectroom",
		form : {
			mansionid : mansionid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				if (data.datasources[0].rows.length == 0) {
					api.alert({
						title : '提示',
						msg : '该楼栋没有房间信息',
					}, function(ret, err) {
					});
				} else {
					var rows = data.datasources[0].rows;
					for (var i = 0; i < rows.length; i++) {
						var roomOption = new Option();
						roomOption.value = rows[i].fid;
						roomOption.text = rows[i].roomno;
						roomidSelect.options.add(roomOption);
					}
				}
			} else {
				api.alert({
					title : '提示',
					msg : '获取房间列表失败 ',
				}, function(ret, err) {
				});
				return false;
			}

		}
	});
}

/**
 *检查房间是否已经增加 (业主)
 */
function checkroom() {
	//	alert('sdfsdfdsdfs');
	var roomid = $api.val($api.byId('roomid'));
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getRoomBymemberidAndRoomid",
		form : {
			memberid : memberid,
			roomid : roomid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				isRegister = data.datasources[0].rows.length;
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
	//	alert(isRegister);
}

/**
 *保存房间
 */
function addroominfo() {
	var input = /^[\s]*$/;
	var province = $api.val($api.byId('province'));
	if (province == '请选择省 ') {
		api.alert({
			title : '提示',
			msg : '请选择省份或者直辖市！',
		}, function(ret, err) {
		});
		return false;
	}
	var city = $api.val($api.byId('city'));
	if (city == '请选择市') {
		api.alert({
			title : '提示',
			msg : '请选择城市！',
		}, function(ret, err) {
		});
		return false;
	}
	var area = $api.val($api.byId('area'));
	if (area == '请选择区') {
		api.alert({
			title : '提示',
			msg : '请选择区域！',
		}, function(ret, err) {
		});
		return false;
	}
	var subDistrict = $api.val($api.byId('subDistrict'));
	if (subDistrict == '请选择小区') {
		api.alert({
			title : '提示',
			msg : '请选择小区名称！',
		}, function(ret, err) {
		});
		return false;
	}

	var subdistrictid = $api.val($api.byId('subdistrictid'));
	if (subdistrictid == '请选择楼栋号') {
		api.alert({
			title : '提示',
			msg : '请选择楼栋号！',
		}, function(ret, err) {
		});
		return false;
	}

	var roomid = $api.val($api.byId('roomid'));
	if (roomid == '请选择房间号') {
		api.alert({
			title : '提示',
			msg : '请选择房间号！',
		}, function(ret, err) {
		});
		return false;
	}

	var applyPerson = $api.val($api.byId('applyPerson'));
	if (input.test(applyPerson)) {
		api.alert({
			title : '提示',
			msg : '请输入申请人名称！',
		}, function(ret, err) {
		});
		return false;
	}
	var telphone = $api.val($api.byId('telphone'));
	if (input.test(telphone)) {
		api.alert({
			title : '提示',
			msg : '请输入手机号！',
		}, function(ret, err) {
		});
		return false;
	}

	var vaildCode = $api.val($api.byId('vaildCode'));
	if (input.test(vaildCode)) {
		api.alert({
			title : '提示',
			msg : '请输入验证码！',
		}, function(ret, err) {
		});
		return false;
	}

	if (identifyingCode != vaildCode) {
		api.alert({
			title : '提示',
			msg : '您的验证码有误，请您从新输入！',
		}, function(ret, err) {
		});
		return false;
	}

	if (isRegister > 0) {
		api.alert({
			title : '提示',
			msg : '对不起，您已经添加过此房间，请您从新选择',
		}, function(ret, err) {
		});
		return false;
	}
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "saveRoom",
		form : {
			memberid : memberid,
			roomid : roomid,
			isowner : false,
			mansionid : subdistrictid,
			applyPerson : applyPerson
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				if (data.formDataset.checked == 'true') {
					$api.css($api.byId('addOwnerSuccess'), 'display:block');
					//					alert('添加房间成功');
					api.execScript({
						sync : true,
						name : 'roomIndex',
						script : 'refresh();'
					});
					setTimeout(function() {
						$api.css($api.byId('addOwnerSuccess'), 'display:none');
						setTimeout(function() {
							api.closeWin({
								name : 'managerRoom'
							});
							api.closeWin({
								name : 'myaddressPage'
							});
							api.closeWin();
						}, 800)
					}, 3000)

				} else {
					$api.css($api.byId('addOwnerFail'), 'display:block');
					//					alert('添加房间失败');
					setTimeout(function() {
						$api.css($api.byId('addOwnerFail'), 'display:none');
					}, 3000)
				}
			} else {
				api.alert({
					title : '提示',
					msg : '添加房间失败，请您从新添加',
				}, function(ret, err) {
				});
				return false;
			}

		}
	});

}

/*
 * 点击关闭提示
 */
function closeSuccess() {

	//	$api.css($api.byId('addOwnerSuccess'), 'display:none');
	//	api.openWin({
	//		name : 'myaddressPage',
	//		url : 'my_adress.html',
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
	$api.css($api.byId('addOwnerSuccess'), 'display:none');
	api.execScript({
		sync : true,
		name : 'myaddressPage',
		script : 'refresh();'
	});
	setTimeout(function() {
		api.closeWin({
			name : 'managerRoom'
		});
		api.closeWin({
			name : 'myaddressPage'
		});
		api.closeWin();
	}, 800)
}

//-------------------------------------------------------租户----------------------------------------
/**
 *省份改变加载城市(租户)
 */
function tenantlocationAddress() {
	var telphone = api.getPrefs({
		sync : true,
		key : 'telphone'
	});
	$api.val($api.byId('tenanttelphone'), telphone);
	var provinceSelect = document.getElementById("tenantprovince");
	provinceSelect.innerHTML = "";
	var province = new Option();
	province.value = "请选择省";
	province.text = "请选择省";
	provinceSelect.options.add(province);
	for (var i = 0; i < data.length; i++) {
		var province = new Option();
		province.value = data[i].name;
		province.text = data[i].name;
		provinceSelect.options.add(province);
	}
}

/**
 *省份改变加载城市(租户)
 */
function tenantchangep() {
	var myselect = document.getElementById("tenantprovince");
	var index = myselect.selectedIndex;
	var province = myselect.options[index].text;
	var citySelect = document.getElementById("tenantcity");
	citySelect.innerHTML = "";
	var city = new Option();
	city.value = "请选择市";
	city.text = "请选择市";
	citySelect.options.add(city);

	var areaSelect = document.getElementById("tenantarea");
	areaSelect.innerHTML = "";
	var area = new Option();
	area.value = "请选择区";
	area.text = "请选择区";
	areaSelect.options.add(area);

	var subSelect = document.getElementById("tenantsubDistrict");
	subSelect.innerHTML = "";
	var sub = new Option();
	sub.value = "请选择小区";
	sub.text = "请选择小区";
	subSelect.options.add(sub);

	var subidSelect = document.getElementById("tenantsubdistrictid");
	subidSelect.innerHTML = "";
	var subid = new Option();
	subid.value = "请选择楼栋号";
	subid.text = "请选择楼栋号";
	subidSelect.options.add(subid);

	var roomidSelect = document.getElementById("tenantroomid");
	roomidSelect.innerHTML = "";
	var room = new Option();
	room.value = "请选择房间号";
	room.text = "请选择房间号";
	roomidSelect.options.add(room);

	for (var i = 0; i < data.length; i++) {
		if (data[i].name == province) {
			for (var j = 0; j < data[i].city.length; j++) {
				var city = new Option();
				city.value = data[i].city[j].name;
				city.text = data[i].city[j].name;
				citySelect.options.add(city);
			}
		}
	}
}

/**
 *城市改变加载区域(租户)
 */
function tenantchangec() {
	var provinceSelect = document.getElementById("tenantprovince");
	var provinceIndex = provinceSelect.selectedIndex;
	var province = provinceSelect.options[provinceIndex].text;
	var myselect = document.getElementById("tenantcity");
	var index = myselect.selectedIndex;
	var city = myselect.options[index].text;
	var areaSelect = document.getElementById("tenantarea");
	areaSelect.innerHTML = "";
	var area = new Option();
	area.value = "请选择区";
	area.text = "请选择区";
	areaSelect.options.add(area);

	var subSelect = document.getElementById("tenantsubDistrict");
	subSelect.innerHTML = "";
	var sub = new Option();
	sub.value = "请选择小区";
	sub.text = "请选择小区";
	subSelect.options.add(sub);

	var subidSelect = document.getElementById("tenantsubdistrictid");
	subidSelect.innerHTML = "";
	var subid = new Option();
	subid.value = "请选择楼栋号";
	subid.text = "请选择楼栋号";
	subidSelect.options.add(subid);

	var roomidSelect = document.getElementById("tenantroomid");
	roomidSelect.innerHTML = "";
	var room = new Option();
	room.value = "请选择房间号";
	room.text = "请选择房间号";
	roomidSelect.options.add(room);

	for (var i = 0; i < data.length; i++) {
		if (data[i].name == province) {
			for (var j = 0; j < data[i].city.length; j++) {
				if (data[i].city[j].name == city) {
					for (var k = 0; k < data[i].city[j].area.length; k++) {
						var area = new Option();
						area.value = data[i].city[j].area[k];
						area.text = data[i].city[j].area[k];
						areaSelect.options.add(area);
					}
				}
			}
		}
	}
}

/**
 *区域改变加载小区（租户）
 */
function tenantchangeSubd() {
	var provinceSelect = document.getElementById("tenantprovince");
	var provinceIndex = provinceSelect.selectedIndex;
	var province = provinceSelect.options[provinceIndex].text;

	var citySelect = document.getElementById("tenantcity");
	var cityIndex = citySelect.selectedIndex;
	var city = citySelect.options[cityIndex].text;

	var areaSelect = document.getElementById("tenantarea");
	var areaIndex = areaSelect.selectedIndex;
	var area = areaSelect.options[areaIndex].text;

	var subSelect = document.getElementById("tenantsubDistrict");
	subSelect.innerHTML = "";
	var sub = new Option();
	sub.value = "请选择小区";
	sub.text = "请选择小区";
	subSelect.options.add(sub);

	var subidSelect = document.getElementById("tenantsubdistrictid");
	subidSelect.innerHTML = "";
	var subid = new Option();
	subid.value = "请选择楼栋号";
	subid.text = "请选择楼栋号";
	subidSelect.options.add(subid);

	var roomidSelect = document.getElementById("tenantroomid");
	roomidSelect.innerHTML = "";
	var room = new Option();
	room.value = "请选择房间号";
	room.text = "请选择房间号";
	roomidSelect.options.add(room);
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "managers.subdistrict.subdistrictlist",
		needTrascation : false,
		//		funName : "listForapp",
		funName : "subdistrictList",
		form : {
			prince : province,
			city : city,
			area : area
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				if (data.datasources[0].rows.length == 0) {
					api.alert({
						title : '提示',
						msg : '该地区没有小区信息',
					}, function(ret, err) {
					});
				} else {
					var rows = data.datasources[0].rows;
					for (var i = 0; i < rows.length; i++) {
						var subDistrict = new Option();
						subDistrict.value = rows[i].fid;
						subDistrict.text = rows[i].name;
						subSelect.options.add(subDistrict);
					}
				}
			} else {
				api.alert({
					title : '提示',
					msg : '获取小区列表失败 ',
				}, function(ret, err) {
				});
				return false;
			}

		}
	});

}

/**
 *小区改变加载楼栋 （租户）
 */
function tenantchangesubDistrict() {
	var subSelect = document.getElementById("tenantsubDistrict");
	var subIndex = subSelect.selectedIndex;
	var subid = subSelect.options[subIndex].value;

	var subdistrictidSelect = document.getElementById("tenantsubdistrictid");
	subdistrictidSelect.innerHTML = "";
	var subidOption = new Option();
	subidOption.value = "请选择楼栋号";
	subidOption.text = "请选择楼栋号";
	subdistrictidSelect.options.add(subidOption);

	var roomidSelect = document.getElementById("tenantroomid");
	roomidSelect.innerHTML = "";
	var room = new Option();
	room.value = "请选择房间号";
	room.text = "请选择房间号";
	roomidSelect.options.add(room);

	//	var subdistrictidSelect = document.getElementById("subdistrictid");
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		//		funName : "listForapp",
		funName : "selectsubd",
		form : {
			subdistrictid : subid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				if (data.datasources[0].rows.length == 0) {
					api.alert({
						title : '提示',
						msg : '该小区没有楼栋信息',
					}, function(ret, err) {
					});
				} else {
					var rows = data.datasources[0].rows;
					for (var i = 0; i < rows.length; i++) {
						var subdistrictidOption = new Option();
						subdistrictidOption.value = rows[i].fid;
						subdistrictidOption.text = rows[i].fno;
						subdistrictidSelect.options.add(subdistrictidOption);
					}
				}
			} else {
				api.alert({
					title : '提示',
					msg : '获取楼栋列表失败 ',
				}, function(ret, err) {
				});
				return false;
			}

		}
	});

}

/**
 *楼栋改变加载房间 （租户）
 */
function tenantchangeSubdistrictid() {
	var subidSelect = document.getElementById("tenantsubdistrictid");
	var subidIndex = subidSelect.selectedIndex;
	var mansionid = subidSelect.options[subidIndex].value;

	var roomidSelect = document.getElementById("tenantroomid");
	roomidSelect.innerHTML = "";
	var room = new Option();
	room.value = "请选择房间号";
	room.text = "请选择房间号";
	roomidSelect.options.add(room);

	//	var roomidSelect = document.getElementById("tenantroomid");
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		//		funName : "listForapp",
		funName : "selectroom",
		form : {
			mansionid : mansionid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				if (data.datasources[0].rows.length == 0) {
					api.alert({
						title : '提示',
						msg : '该楼栋没有房间信息',
					}, function(ret, err) {
					});
				} else {
					var rows = data.datasources[0].rows;
					for (var i = 0; i < rows.length; i++) {
						var roomOption = new Option();
						roomOption.value = rows[i].fid;
						roomOption.text = rows[i].roomno;
						roomidSelect.options.add(roomOption);
					}
				}
			} else {
				api.alert({
					title : '提示',
					msg : '获取房间列表失败 ',
				}, function(ret, err) {
				});
				return false;
			}

		}
	});
}

/**
 * 发送验证码（租户）
 */
function tenantsendIdentifyingCode() {
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "sendIdentifyingCode",
		form : {
			telphone : $("#tenanttelphone").val()
		},
		success : function(data) {
			api.hideProgress();
			if (data.formDataset.checked === "true") {
				identifyingCode = data.formDataset.code;
				//				alert(identifyingCode);
				if (identifyingCode != "") {
					api.alert({
						title : '系统提示',
						msg : '验证码发送成功!'
					}, function(ret, err) {

					});
				} else {
					api.alert({
						title : '系统提示',
						msg : '验证码发送失败!'
					}, function(ret, err) {
						//coding...
					});
				}
			} else {
				api.alert({
					title : '系统提示',
					msg : '您的账号尚未注册,请您先注册!'
				}, function(ret, err) {
					//coding...
				});
			}

		}
	});

}

/**
 *检查房间是否已经增加 (业主)
 */
function tenantcheckroom() {
	//	alert('sdfsdfdsdfs');
	//	var roomid = $api.val($api.byId('roomid'));
	var roomid = $api.val($api.byId('tenantroomid'));
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getRoomBymemberidAndRoomid",
		form : {
			memberid : memberid,
			roomid : roomid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				isRegister = data.datasources[0].rows.length;
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
	//	alert(isRegister);
}

/**
 *保存租户信息
 */
function tenantaddroominfo() {
	var input = /^[\s]*$/;
	var province = $api.val($api.byId('tenantprovince'));
	if (province == '请选择省 ') {
		api.alert({
			title : '提示',
			msg : '请选择省份或者直辖市！',
		}, function(ret, err) {
		});
		return false;
	}
	var city = $api.val($api.byId('tenantcity'));
	if (city == '请选择市') {
		api.alert({
			title : '提示',
			msg : '请选择城市！',
		}, function(ret, err) {
		});
		return false;
	}
	var area = $api.val($api.byId('tenantarea'));
	if (area == '请选择区') {
		api.alert({
			title : '提示',
			msg : '请选择区域！',
		}, function(ret, err) {
		});
		return false;
	}
	var subDistrict = $api.val($api.byId('tenantsubDistrict'));
	if (subDistrict == '请选择小区') {
		api.alert({
			title : '提示',
			msg : '请选择小区名称！',
		}, function(ret, err) {
		});
		return false;
	}

	var subdistrictid = $api.val($api.byId('tenantsubdistrictid'));
	if (subdistrictid == '请选择楼栋号') {
		api.alert({
			title : '提示',
			msg : '请选择楼栋号！',
		}, function(ret, err) {
		});
		return false;
	}

	var roomid = $api.val($api.byId('tenantroomid'));
	if (roomid == '请选择房间号') {
		api.alert({
			title : '提示',
			msg : '请选择房间号！',
		}, function(ret, err) {
		});
		return false;
	}

	var timelimit = $api.val($api.byId('duetime'));
	if (input.test(timelimit)) {
		api.alert({
			title : '提示',
			msg : '请选择到期时间！',
		}, function(ret, err) {
		});
		return false;
	}

	var applyPerson = $api.val($api.byId('tenantapplyPerson'));
	if (input.test(applyPerson)) {
		api.alert({
			title : '提示',
			msg : '请输入申请人名称！',
		}, function(ret, err) {
		});
		return false;
	}
	var telphone = $api.val($api.byId('tenanttelphone'));
	if (input.test(telphone)) {
		api.alert({
			title : '提示',
			msg : '请输入手机号！',
		}, function(ret, err) {
		});
		return false;
	}

	var vaildCode = $api.val($api.byId('tenantvaildCode'));
	if (input.test(vaildCode)) {
		api.alert({
			title : '提示',
			msg : '请输入验证码！',
		}, function(ret, err) {
		});
		return false;
	}

	if (identifyingCode != vaildCode) {
		api.alert({
			title : '提示',
			msg : '您的验证码有误，请您从新输入！',
		}, function(ret, err) {
		});
		return false;
	}

	if (isRegister > 0) {
		api.alert({
			title : '提示',
			msg : '对不起，您已经添加过此房间，请您从新选择',
		}, function(ret, err) {
		});
		return false;
	}
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "saveRoom",
		form : {
			memberid : memberid,
			roomid : roomid,
			isowner : true,
			mansionid : subdistrictid,
			timelimit : timelimit,
			applyPerson : applyPerson
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				if (data.formDataset.checked == 'true') {
					$api.css($api.byId('addOwnerSuccess'), 'display:block');
					//					alert('添加房间成功');
					api.execScript({
						sync : true,
						name : 'roomIndex',
						script : 'refresh();'
					});
					setTimeout(function() {
						$api.css($api.byId('addOwnerSuccess'), 'display:none');
						setTimeout(function() {
							api.closeWin({
								name : 'managerRoom'
							});
							api.closeWin({
								name : 'myaddressPage'
							});
							api.closeWin();
						}, 800)
					}, 3000)

				} else {
					$api.css($api.byId('addOwnerFail'), 'display:block');
					//					alert('添加房间失败');
					setTimeout(function() {
						$api.css($api.byId('addOwnerFail'), 'display:none');
					}, 3000)
				}
			} else {
				api.alert({
					title : '提示',
					msg : '添加房间失败，请您从新添加',
				}, function(ret, err) {
				});
				return false;
			}

		}
	});
}

function tenantsendCode(th) {
	var telphone = $api.val($api.byId('tenanttelphone'));
	if (telphone != '') {
		$(".btn-zh").removeClass("sure-y").addClass("sure-n");
		tenantsendIdentifyingCode();
		tenanttime();
	} else {
		api.alert({
			title : '系统提示',
			msg : '手机号不可以为空!'
		}, function(ret, err) {
		});
	}
}

function tenanttime() {
	var o = $api.byId('tenantidentifyingCodeBtn')
	if (tenantwait == 0) {
		o.removeAttribute("disabled");
		o.value = "获取验证码";
		o.style.background = "#fff";
		$(".btn-zh").removeClass("sure-n").addClass("sure-y");
		tenantwait = 60;
	} else {
		o.setAttribute("disabled", true);
		o.value = "重新发送(" + tenantwait + ")";
		o.style.background = "#bfbfbf";
		tenantwait--;
		setTimeout(function() {
			tenanttime()
		}, 1000)
	}
}

//同步用户信息
function syncUserInfo(parentId, subId, roomid) {
	if (parentId != "" && subId != null) {
		api.showProgress({
		});
		AjaxUtil.exeScript({
			script : "login.login", //need to do
			needTrascation : false,
			funName : "syncUserInfo",
			form : {
				parentId : parentId,
				subId : subId,
				roomid : roomid
			},
			success : function(data) {
				api.hideProgress();
				if (data.execStatus === "true" && data.formDataset.checked === "true" && data.formDataset.isExist === "false") {
					api.alert({
						msg : "钥匙授权成功,您可以开门了!"
					}, function(ret, err) {
						//刷新
						api.execScript({
							sync : true,
							name : "root",
							frameName : 'weather',
							script : 'setUserKeyInfos();'
						});

						//						api.openWin({
						//							name : 'personal',
						//							url : 'personal.html',
						//							pageParam : {
						//								memberid : memberid
						//							},
						//							slidBackEnabled : true,
						//							animation : {
						//								type : "push", //动画类型（详见动画类型常量）
						//								subType : "from_right", //动画子类型（详见动画子类型常量）
						//								duration : 300 //动画过渡时间，默认300毫秒
						//							}
						//						});
						//						setTimeout(function() {
						api.closeWin({
							name : 'managerRoom'
						});
						api.closeWin({
							name : 'myaddressPage'
						});
						api.closeWin();
						//						}, 800)

					});
				} else if (data.execStatus === "true" && data.formDataset.checked === "false" && data.formDataset.isExist === "true") {
					api.alert({
						msg : "您已经扫描过了,可以直接开门!"
					}, function(ret, err) {
						//刷新
						api.execScript({
							sync : true,
							name : "root",
							frameName : 'weather',
							script : 'setUserKeyInfos();'
						});

						api.openWin({
							name : 'personal',
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
						setTimeout(function() {
							api.closeWin({
								name : 'managerRoom'
							});
							api.closeWin({
								name : 'myaddressPage'
							});
							api.closeWin();
						}, 800)

					});
				}
			}
		});
	}
}

//二维码扫描
function qrcode() {
	scanner.open(function(ret, err) {
		if (ret.eventType == "success") {
			var arr = ret.msg.split(",");
			var parentId = arr[0];
			var roomid = arr[1];
			syncUserInfo(parentId, memberid, roomid);
		}
	});
}

/**
 *返回
 */
function goback() {
	api.closeWin();
}

