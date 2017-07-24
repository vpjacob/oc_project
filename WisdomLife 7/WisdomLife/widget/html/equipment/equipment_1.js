var wifiName;
var ssid;
var name;
var isRecode;
var length;
//记录本地保存的数据
var jsonOfData;

var liHtml = '<li><div class="videoplay"><div class="play" onclick="play(' + "'\"[position0]\"'" + ')"><img src="../../image/temp/play66.png"/>' + '</div>' + '<div class="videoicon" style="border-top:1px solid #dcdcdc"><p id="name" style="width:60%;overflow:hidden;">\"[name]\"</p><i class="icon iconfont icon-wechaticon16" onclick="download(' + "'\"[position1]\"'" + ')" style="font-size: 24px;"></i>' + '<i class="icon iconfont icon-delete" onclick="deleteLi(' + "'\"[position2]\"'" + ')" style="font-size: 24px;"></i></div></div></li>';

apiready = function() {
	readFile();
	var html = "";
	for (var i = 0; i < length; i++) {
		var newli = liHtml.replace("\"[name]\"", jsonOfData[i].name);
		newli = newli.replace("\"[position0]\"", i);
		newli = newli.replace("\"[position1]\"", i);
		newli = newli.replace("\"[position2]\"", i);
		html += newli;
	}
	$api.append(document.getElementById("con"), html);
	var header = $api.byId('header');
//	if (api.systemType == 'ios') {
//		var cc = $api.dom('.section');
//		$api.css(header, 'margin-top:20px;');
//		$api.css(cc, 'margin-top:64px;');
//	}

	$("#back").bind("click", function() {
		api.alert({
			msg : "请记得切换您的网络连接，继续享受小客为您带来的服务"
		}, function(ret, err) {
			api.closeWin();
		});
	});
	$("#add").bind("click", function() {
		api.openWin({//打开我的设备
			name : 'equipmentType',
			url : 'equipmentType.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
};
function play(position1) {
	readFile();
	ssid = jsonOfData[position1].wifiName;
	name = jsonOfData[position1].name;
	isRecode = jsonOfData[position1].isRecode;
	var systemType = api.systemType;
	if (systemType != "ios") {//只限Android系统
		var moduleTest = api.require('movies');
		moduleTest.get(function(ret) {
			if (ret.ssid == ssid) {
				var param = {
					paramInt : isRecode
				};
				moduleTest.show(param);
			} else {
				api.alert({
					msg : "请连接设备指定WiFi"
				});
			}
		});
	} else {
		var moduleTest = api.require('movies');
		var retWifiName = moduleTest.get();
		if (retWifiName == ssid) {
			var appPath = api.fsDir;
			var param = {
				ImagePath : appPath
			};
			moduleTest.show(param);
		} else {
			api.alert({
				msg : "请连接设备指定WiFi"
			});
		}

	}
}

function download(position2) {
	readFile();
	ssid = jsonOfData[position2].wifiName;
	api.openWin({//打开我的设备
		name : 'download',
		url : 'download.html',
		pageParam : {
			ssid : ssid
		},
		slidBackEnabled : true,
		animation : {
			type : "push", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});
}

function deleteLi(position) {
	api.confirm({
		title : '提示',
		msg : '确定要删除该设备吗？',
		buttons : ['确定', '取消']
	}, function(ret, err) {
		var index = ret.buttonIndex;
		if (index == 1) {//确定
			if (length == 1) {
				var obj = [];
				var equipmentinfo = {};
				equipmentinfo.hasEq = false;
				equipmentinfo.name = "";
				equipmentinfo.wifiName = "";
				equipmentinfo.pwd = "";
				equipmentinfo.isRecode = 0;
				obj.push(equipmentinfo);
				//		alert(JSON.stringify(obj));
				FileUtils.writeFile(obj, "equipment.json", function(info, err) {
					//在名为winName的window中执行jsfun脚本
					var jsfun = 'refreshFile();';
					api.execScript({
						name : 'room',
						script : jsfun
					});
					api.openWin({
						name : 'my_equipment',
						url : 'my_equipment.html',
						slidBackEnabled : true,
						animation : {
							type : "push", //动画类型（详见动画类型常量）
							subType : "from_right", //动画子类型（详见动画子类型常量）
							duration : 300 //动画过渡时间，默认300毫秒
						}
					});
					setTimeout(function() {
						var jsfun = 'close();';
						api.execScript({
							name : 'equipment_index',
							script : jsfun
						});
					}, 800);
				});
			} else {//不止一个设备
				var html = "";
				var newObj = [];
				for (var i = 0; i < length; i++) {
					if (i != position) {//首先把界面上的去掉，然后在文件里去掉
						var newli = liHtml.replace("\"[name]\"", jsonOfData[i].name);
						newli = newli.replace("\"[position0]\"", i);
						newli = newli.replace("\"[position1]\"", i);
						newli = newli.replace("\"[position2]\"", i);
						html += newli;
						var newJson = jsonOfData[i];
						newObj.push(newJson);
					}
				}
				$("li").remove();
				$api.append(document.getElementById("con"), html);
				//		alert("newObj"+JSON.stringify(newObj));
				FileUtils.writeFile(newObj, "equipment.json", function(info, err) {
					readFile();
				});
			}
		}
	});

}

function readFile() {
	var data = api.readFile({
		sync : true,
		path : 'fs://wisdomLifeData/equipment.json'
	});
	jsonOfData = $api.strToJson(data);
	length = jsonOfData.length;
}

function refresh() {
	location.reload();
}