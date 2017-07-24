//11 means on 0 means off 自动录制的开启和关闭
var URL = "http://192.168.1.254/?custom=1&cmd=2012&par=";
//格式化删除全部
var URLDEL = "http://192.168.1.254/?custom=1&cmd=4004";
var state;
var data;
apiready = function() {
	data = api.readFile({
		sync : true,
		path : 'fs://wisdomLifeData/equipment.json'
	});
	if($api.strToJson(data).isRecode==1){
		$('#recording').prop("checked","true");
	}
//	var header = $api.byId('header');
//	if (api.systemType == 'ios') {
//		var cc = $api.dom('.maindown');
//		$api.css(header, 'margin-top:20px;');
//		$api.css(cc, 'margin-top:80px;');
//	}

	$("#back").bind("click", function() {
		api.alert({
		msg:"请记得切换您的网络连接，继续享受小客为您带来的服务"
        },function(ret,err){
		api.closeWin();
        });
	});
	
	$("#changekey").bind("click", function() {
		api.openWin({//添加设备
			name : 'changekey',
			url : 'changekey.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//	var a=$('#recording').prop("checked",false);
	//	alert(a);
	$("#recording").bind("change", function() {
		var a = $('#recording').prop("checked");
		if (a == true || a == "true") {
			state = 1;
		} else {
			state = 0;
		}
		setRecode(URL, state);
	});
	$("#format").bind("click", function() {
		//		$("#shadow").hide();
		$(".hide").show();
	});
	$(".hide").bind("click", function() {
		$(".hide").hide();
	});
	$("#comit").bind("click", function() {
		setRecode(URLDEL, 2);
	});

};
function setRecode(url, state2) {
	api.showProgress({
	});
	var xmlhttp;
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		api.hideProgress();
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//			if (state2 != 2) {//设置是否自动录制
//				var equipmentinfo = {
//				};
//				equipmentinfo.hasEq = $api.strToJson(data).hasEq;
//				equipmentinfo.name = $api.strToJson(data).name;
//				equipmentinfo.wifiName = $api.strToJson(data).wifiName;
//				equipmentinfo.pwd = $api.strToJson(data).pwd;
//				equipmentinfo.isRecode = state2;
//				alert(state2);
//				FileUtils.writeFile(equipmentinfo, "equipment.json", function(info, err) {
//					console.log('写入成功');
//				});
//			}
			var trans = api.require('trans');
			trans.parse({
				data : xmlhttp.responseText
			}, function(ret, err) {
				if (ret.Function.Status == 0) {
					var msg = "";
					if (state2 == 2) {
						msg = "格式化成功";
					} else if(state2 == 0){
						msg = "自动录制关闭，重新上电可用！";
					}else if(state2 == 1){
						msg = "自动录制开启，重新上电可用！";
					}
					api.alert({
						msg : msg
					});
				}
			});
		} else if (xmlhttp.readyState == 4 && xmlhttp.status == 0) {
			api.alert({
				msg : "请连接设备的指定WIFI"
			});
			console.log(xmlhttp.readyState + "---" + xmlhttp.status);
		}
	}
	if (state2 == 2) {//格式化
		xmlhttp.open("GET", url, true);
	} else {
		xmlhttp.open("GET", url + state2, true);
	}
	xmlhttp.send();
}
