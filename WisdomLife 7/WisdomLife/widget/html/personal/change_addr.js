//房间id
var roomid;
//用户id
var memberid;
//验证码
var identifyingCode = "";
//业主验证码等待时间
var wait = 60;
//租客验证码等待时间
var tenantwait = 60;
//是否是业主 true:租户  false：业主
var isowner;
//用户以前注册的房间id
var oldRoomid;
//用户以前的楼栋id
var oldmansionid;
//用户是否注册过
var isRegister = 0;
//用户钥匙信息
var userKeyInfos = {
};
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}

	//获取当前时间
	$("#duetime").calendar({
		value : [curDateTime()],
		minDate : curDateTime(),
		onChange : function(p, values, displayValues) {
			if (curDateTime() != displayValues) {
				$("#duetime").val(displayValues);
			}
		}
	});

	locationAddress();
	tenantlocationAddress();
	memberid = api.pageParam.memberid;
	roomid = api.pageParam.roomid;
	ProgressUtil.showProgress();
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getRoomInfoByRoomid",
		form : {
			roomid : roomid,
			memberid : memberid
		},
		success : function(data) {

			if (data.execStatus == 'true') {

				//是否是业主
				isowner = data.datasources[0].rows[0].isowner;
				//到期时间
				var timelimit = data.datasources[0].rows[0].timelimit;
				//省
				var prince = data.datasources[0].rows[0].prince;
				//市
				var city = data.datasources[0].rows[0].city;
				//区
				var area = data.datasources[0].rows[0].area;
				//小区名称
				var subdistrictbasename = data.datasources[0].rows[0].name;
				//小区id
				var subdistrictbaseid = data.datasources[0].rows[0].fid;
				//楼栋号
				var mansionfno = data.datasources[0].rows[0].mansionfno;
				//楼栋id
				var mansionid = data.datasources[0].rows[0].mansionid;
				oldmansionid = mansionid;
				//房间号
				var roomno = data.datasources[0].rows[0].roomno;
				//房间id
				var roomid = data.datasources[0].rows[0].roomid;
				oldRoomid = data.datasources[0].rows[0].roomid;
				//申请人
				var fname = data.datasources[0].rows[0].fname;
				//手机号
				var telphone = data.datasources[0].rows[0].memtelphone;
				//到期时间
				var duetime = data.datasources[0].rows[0].timelimit;
				var onwerdiv = $api.byId('tab1');
				var tenantdiv = $api.byId('tab2');
				var tab1active = $api.byId('tab1active');
				var tab2active = $api.byId('tab2active');

				if (!isowner) {
					$api.addCls(onwerdiv, 'active');
					$api.removeCls(tenantdiv, 'active');
					$api.addCls(tab1active, 'active');
					$api.removeCls(tab2active, 'active');

					//省
					var provinceSelect = document.getElementById("province");
					for (var i = 0; i < provinceSelect.options.length; i++) {
						if (provinceSelect.options[i].innerHTML == prince) {
							provinceSelect.options[i].selected = true;
							break;
						}
					}

					//市
					var citySelect = document.getElementById("city");
					citySelect.innerHTML = "";
					var cityOption = new Option();
					cityOption.value = city;
					cityOption.text = city;
					citySelect.options.add(cityOption);

					//地区
					var areaSelect = document.getElementById("area");
					areaSelect.innerHTML = "";
					var areaOption = new Option();
					areaOption.value = area;
					areaOption.text = area;
					areaSelect.options.add(areaOption);
					//小区
					var subDistrictSelect = document.getElementById("subDistrict");
					subDistrictSelect.innerHTML = "";
					var subDistrictOption = new Option();
					subDistrictOption.value = subdistrictbaseid;
					subDistrictOption.text = subdistrictbasename;
					subDistrictSelect.options.add(subDistrictOption);
					//楼栋
					var subdistrictidSelect = document.getElementById("subdistrictid");
					subdistrictidSelect.innerHTML = "";
					var subdistrictidOption = new Option();
					subdistrictidOption.value = mansionid;
					subdistrictidOption.text = mansionfno;
					subdistrictidSelect.options.add(subdistrictidOption);
					//房间
					var roomidSelect = document.getElementById("roomid");
					roomidSelect.innerHTML = "";
					var roomidOption = new Option();
					roomidOption.value = roomid;
					roomidOption.text = roomno;
					roomidSelect.options.add(roomidOption);
					//申请人
					$api.val($api.byId('applyPerson'), fname);
					//手机号
					$api.val($api.byId('telphone'), telphone);
				} else {
					$api.addCls(tenantdiv, 'active');
					$api.removeCls(onwerdiv, 'active');
					$api.addCls(tab2active, 'active');
					$api.removeCls(tab1active, 'active');
					var provinceSelect = document.getElementById("tenantprovince");
					for (var i = 0; i < provinceSelect.options.length; i++) {
						if (provinceSelect.options[i].innerHTML == prince) {
							provinceSelect.options[i].selected = true;
							break;
						}
					}

					//市
					var citySelect = document.getElementById("tenantcity");
					citySelect.innerHTML = "";
					var cityOption = new Option();
					cityOption.value = city;
					cityOption.text = city;
					citySelect.options.add(cityOption);
					//地区
					var areaSelect = document.getElementById("tenantarea");
					areaSelect.innerHTML = "";
					var areaOption = new Option();
					areaOption.value = area;
					areaOption.text = area;
					areaSelect.options.add(areaOption);
					//小区
					var subDistrictSelect = document.getElementById("tenantsubDistrict");
					subDistrictSelect.innerHTML = "";
					var subDistrictOption = new Option();
					subDistrictOption.value = subdistrictbaseid;
					subDistrictOption.text = subdistrictbasename;
					subDistrictSelect.options.add(subDistrictOption);
					//楼栋
					var subdistrictidSelect = document.getElementById("tenantsubdistrictid");
					subdistrictidSelect.innerHTML = "";
					var subdistrictidOption = new Option();
					subdistrictidOption.value = mansionid;
					subdistrictidOption.text = mansionfno;
					subdistrictidSelect.options.add(subdistrictidOption);
					//房间
					var roomidSelect = document.getElementById("tenantroomid");
					roomidSelect.innerHTML = "";
					var roomidOption = new Option();
					roomidOption.value = roomid;
					roomidOption.text = roomno;
					roomidSelect.options.add(roomidOption);
					//到期时间

					//					var date = new Date(duetime);
					//					duetime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
					duetime = duetime.substring(0, 10);
					$("#duetime").val(duetime);
					//申请人
					$api.val($api.byId('tenantapplyPerson'), fname);
					//手机号
					$api.val($api.byId('tenanttelphone'), telphone);
				}
				ProgressUtil.hideProgress();
			} else {
				api.alert({
					title : '提示',
					msg : '获取房间信息失败',
				}, function(ret, err) {
				});
			}

		}
	});
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

	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		//		funName : "listForapp",
		funName : "selectsubd",
		form : {
			subdistrictid : subid
		},
		success : function(data) {
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
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		//		funName : "listForapp",
		funName : "selectroom",
		form : {
			mansionid : mansionid
		},
		success : function(data) {
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
 *点击获取验证码
 */
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

/**
 *验证码倒计时
 */
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
 *加载省份（租户）
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

	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		//		funName : "listForapp",
		funName : "selectsubd",
		form : {
			subdistrictid : subid
		},
		success : function(data) {
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
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		//		funName : "listForapp",
		funName : "selectroom",
		form : {
			mansionid : mansionid
		},
		success : function(data) {
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
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "sendIdentifyingCode",
		form : {
			telphone : $("#tenanttelphone").val()
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

/**
 *租户点击发送验证码
 */
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

/**
 * 租户验证码倒计时
 */
function tenanttime() {
	var o = $api.byId('tenantidentifyingCodeBtn')
	if (tenantwait == 0) {
		o.removeAttribute("disabled");
		o.value = "获取验证码";
		o.style.background = "#fff";
		tenantwait = 60;
		$(".btn-zh").removeClass("sure-n").addClass("sure-y");
	} else {
		o.setAttribute("disabled", true);
		o.value = "重新发送(" + tenantwait + ")";
		o.style.background = "#bfbfbf";
		tenantwait--;
		setTimeout(function() {
			tenanttime(o)
		}, 1000)
	}
}

/**
 *保存编辑
 */
function edit() {
	var input = /^[\s]*$/;
	var isRegister = false;
	var roomid = $api.val($api.byId('roomid'));
	if (!isowner) {
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
		AjaxUtil.exeScript({
			script : "mobile.center.room.roomindex",
			needTrascation : false,
			funName : "editRoom",
			form : {
				memberid : memberid,
				roomid : roomid,
				mansionid : subdistrictid,
				applyPerson : applyPerson,
				oldRoomid : oldRoomid,
				oldmansionid : oldmansionid
			},
			success : function(data) {
				if (data.execStatus == 'true') {
					if (data.formDataset.checked == 'true') {
						$api.css($api.byId('addOwnerSuccess'), 'display:block');
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
						//					alert('添加房间');
						setTimeout(function() {
							$api.css($api.byId('addOwnerFail'), 'display:none');
						}, 3000)
					}
				} else {
					api.alert({
						title : '提示',
						msg : '修改房间失败，请您从新修改',
					}, function(ret, err) {
					});
					return false;
				}

			}
		});
	} else {
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

		AjaxUtil.exeScript({
			script : "mobile.center.room.roomindex",
			needTrascation : false,
			funName : "editRoom",
			form : {
				memberid : memberid,
				roomid : roomid,
				mansionid : subdistrictid,
				applyPerson : applyPerson,
				oldRoomid : oldRoomid,
				oldmansionid : oldmansionid,
				timelimit : timelimit
			},
			success : function(data) {
				if (data.execStatus == 'true') {
					if (data.formDataset.checked == 'true') {
						$api.css($api.byId('addOwnerSuccess'), 'display:block');
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
}

/*
 * 点击关闭提示
 */
function closeSuccess() {
	//	$(".show-success").css("display", "none");
	$api.css($api.byId('addOwnerSuccess'), 'display:none');

	//刷新
	api.execScript({
		sync : true,
		name : "root",
		frameName : 'weather',
		script : 'setUserKeyInfos();'
	});
	api.openWin({
		name : 'root',
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
	}, 800);
}

/**
 * 删除房间
 */
function delroom() {

	//	//读取用户的钥匙信息
	//	FileUtils.readFile("userkeyinfo.json", function(info, err) {
	//		userKeyInfos = info;
	//		var keyinfos = userKeyInfos.keyinfos;
	//		var newuserKeyInfos='';
	//				alert($api.jsonToStr(keyinfos));
	//		if (keyinfos.length == 1) {
	//			FileUtils.writeFile('{}', "userkeyinfo.json");
	//		} else if(keyinfos.length > 1){
	//			//
	//			var delkeyIndex;
	//			for (var i = 0; i < keyinfos.length; i++) {
	//				if (keyinfos[i].roomid == roomid) {
	//					delkeyIndex = i;
	//					//				FileUtils.writeFile(userKeyInfos, "userkeyinfo.json");
	//				}else{
	//					newuserKeyInfos = '"isauthorize":'+keyinfos[i].isauthorize+',"forbiddenmemid":'+keyinfos[i].forbiddenmemid+',"des":'+keyinfos[i].des;
	//					newuserKeyInfos = newuserKeyInfos + ',"isfirst":'+keyinfos[i].isfirst+',"devmac":'+keyinfos[i].devmac+',"isforbidden":'+keyinfos[i].isforbidden;
	//					newuserKeyInfos = newuserKeyInfos + ',"nolimit":'+keyinfos[i].nolimit+',"userid":'+keyinfos[i].userid+',"mansionid":'+keyinfos[i].mansionid;
	//					newuserKeyInfos = newuserKeyInfos + ',"authorizememid":'+keyinfos[i].authorizememid+',"roomid":'+keyinfos[i].roomid+',"createtime"：'+keyinfos[i].createtime;
	//					newuserKeyInfos = newuserKeyInfos + ',"phoneid":'+keyinfos[i].phoneid+',"timelimit":'+keyinfos[i].timelimit+',"devsn":'+keyinfos[i].devsn;
	//					newuserKeyInfos = newuserKeyInfos + ',"isdel":'+keyinfos[i].isdel+',"ekey":'+keyinfos[i].ekey+',"istemp":'+keyinfos[i].istemp+',"authortime":'+keyinfos[i].authortime;
	//				}
	//			}
	////			delete keyinfos[delkeyIndex];
	//		}
	//		alert($api.jsonToStr(keyinfos));
	//		alert('钥匙删除成功');
	//
	//	});
	//
	//	return false;
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "delroom",
		form : {
			memberid : memberid,
			roomid : roomid,
			mansionid : oldmansionid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				//刷新
				api.execScript({
					sync : true,
					name : "root",
					frameName : 'weather',
					script : 'setUserKeyInfos();'
				});
				//				api.openWin({
				//					name : 'room',
				//					slidBackEnabled : true,
				//					animation : {
				//						type : "push", //动画类型（详见动画类型常量）
				//						subType : "from_right", //动画子类型（详见动画子类型常量）
				//						duration : 300 //动画过渡时间，默认300毫秒
				//					}
				//				});
				api.closeWin({
					name : 'roomIndex'
				});
				api.closeWin({
					name : 'managerRoom'
				});
				api.closeWin({
					name : 'myaddressPage'
				});

				setTimeout(function() {
					api.closeWin();
				}, 800);
			} else {
				api.alert({
					title : '提示',
					msg : '删除房间失败，请您稍后再试',
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
 *检查房间是否已经增加 (业主)
 */
function tenantcheckroom() {
	var roomid = $api.val($api.byId('tenantroomid'));
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getRoomBymemberidAndRoomid",
		form : {
			memberid : memberid,
			roomid : roomid
		},
		success : function(data) {
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
}

/**
 *检查房间是否已经增加 (业主)
 */
function checkroom() {
	var roomid = $api.val($api.byId('roomid'));
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getRoomBymemberidAndRoomid",
		form : {
			memberid : memberid,
			roomid : roomid
		},
		success : function(data) {
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
}
