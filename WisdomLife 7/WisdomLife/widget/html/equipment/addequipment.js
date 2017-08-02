var xmlhttp;
var ssid;
var pwd;
var name;
var jsonOfData;
/*
 * 测试WiFi和获得连接WiFi密码
 */
var url_test = "http://192.168.1.254/?custom=1&cmd=3029";
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.main');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:80px;');
	}

	$("#back").bind("click", function() {
		api.closeWin();
	});
	$("#complete").bind("click", function() {//完成按钮
		var connectionType = api.connectionType;
		name = $("#name").val();
		if (name.length >= 10) {
			api.alert({
				msg : '您的设备名称过长'
			});
			return;
		}
		if (name == "" || name == null) {
			api.alert({
				msg : '设备名称不能为空'
			});
		} else {
			if (connectionType == "wifi" || api.systemType == 'ios') {
				api.showProgress({
				});
				api.ajax({
					url : url_test,
					method : 'get'
				}, function(ret, err) {
					api.hideProgress();
					if (err.code != 3) {
//						api.alert({
//							msg : '请您连接上指定设备WiFi'
//						});
                         api.confirm({
                                     msg : '未连接指定WiFi，现在就去？',
                                     buttons : ['设置', '取消']
                                     }, function(ret, err) {
                                     var index = ret.buttonIndex;
                                     if (index == 1) {
                                     api.accessNative({
                                                      name : 'ConnetToWiFi',
                                                      extra : {
                                                      }
                                                      }, function(ret, err) {
                                                      if (ret) {
                                                      //                                    alert(JSON.stringify(ret));
                                                      } else {
                                                      //                                    alert(JSON.stringify(err));
                                                      }
                                                      });
                                     } else if(index == 2){
                                     api.closeWin();
                                     }
                                     });
					} else {
						if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
							xmlhttp = new XMLHttpRequest();
						} else {// code for IE6, IE5
							xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
						}
						xmlhttp.onreadystatechange = function() {
							if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
								var trans = api.require('trans');
								trans.parse({
									data : xmlhttp.responseText
								}, function(ret, err) {
									ssid = ret.LIST.SSID;
									pwd = ret.LIST.PASSPHRASE;
									//同步返回结果：
									var data = api.readFile({
										sync : true,
										path : 'fs://wisdomLifeData/equipment.json'
									});
									jsonOfData = $api.strToJson(data);
									length = jsonOfData.length;
									if (length == 1) {//默认的长度为1，所以长度唯一的时候要判断是有还是没有
										var hasEq = jsonOfData[0].hasEq;
										if (hasEq == false || hasEq == 'false') {//没有可用设备重写写入
											var obj = [];
											var equipmentinfo = {};
											equipmentinfo.hasEq = true;
											equipmentinfo.name = name;
											equipmentinfo.wifiName = ssid;
											equipmentinfo.pwd = pwd;
											equipmentinfo.isRecode = 0;
											obj.push(equipmentinfo);
											FileUtils.writeFile(obj, "equipment.json", function(info, err) {
												api.closeWin({
													name : 'my_equipment'
												});
												//在名为winName的window中找到
												//名为frmName的frame，并在该frame中执行jsfun脚本
												var jsfun = 'refresh();';
												api.execScript({
													name : 'equipment_index',
													frameName : 'equipment_1',
													script : jsfun
												});
												api.openWin({//我的设备
													name : 'equipment_index',
													url : 'equipment_index.html',
													slidBackEnabled : true,
													animation : {
														type : "push", //动画类型（详见动画类型常量）
														subType : "from_right", //动画子类型（详见动画子类型常量）
														duration : 300 //动画过渡时间，默认300毫秒
													}
												});
												setTimeout(function() {
													closeBeforeWin();
												}, 800);
											});
										} else {
											writeFile();
										}

									} else {
										writeFile();
									}
								});
							} else if (xmlhttp.readyState == 4 && xmlhttp.status == 0) {
								api.alert({
									msg : "请连接设备的指定WIFI"
								});
							}
						}
						xmlhttp.open("GET", url_test, true);
						xmlhttp.send();
					}
				});
			} else {
//				api.alert({
//					msg : '请您连接上指定设备WiFi'
//				});
                        api.confirm({
                                    msg : '未连接指定WiFi，现在就去？',
                                    buttons : ['设置', '取消']
                                    }, function(ret, err) {
                                    var index = ret.buttonIndex;
                                    if (index == 1) {
                                    api.accessNative({
                                                     name : 'ConnetToWiFi',
                                                     extra : {
                                                     }
                                                     }, function(ret, err) {
                                                     if (ret) {
                                                     //                                    alert(JSON.stringify(ret));
                                                     } else {
                                                     //                                    alert(JSON.stringify(err));
                                                     }
                                                     });
                                    } else if(index == 2){
                                    api.closeWin();
                                    }
                                    });
                        }
		}
	});

};
function writeFile() {
	var equipmentinfo = {};
	equipmentinfo.hasEq = true;
	equipmentinfo.name = name;
	equipmentinfo.wifiName = ssid;
	equipmentinfo.pwd = pwd;
	equipmentinfo.isRecode = 0;
	jsonOfData.push(equipmentinfo);
	FileUtils.writeFile(jsonOfData, "equipment.json", function(info, err) {
		api.closeWin({
			name : 'my_equipment'
		});
		//在名为winName的window中找到
		//名为frmName的frame，并在该frame中执行jsfun脚本
		var jsfun = 'refresh();';
		api.execScript({
			name : 'equipment_index',
			frameName : 'equipment_1',
			script : jsfun
		});
		api.openWin({//我的设备
			name : 'equipment_index',
			url : 'equipment_index.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
		setTimeout(function() {
			closeBeforeWin();
		}, 800);
	});
}

function closeBeforeWin() {
	api.closeWin({
		name : 'equipmentType'
	});
	api.closeWin();
}
