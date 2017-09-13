var xmlhttp;
var trans;
var url = "http://192.168.1.254/?custom=1&cmd=3004&str=";
var ReconnectWiFi = "http://192.168.1.254/?custom=1&cmd=3018";
apiready = function() {
	//	var data = api.readFile({
	//		sync : true,
	//		path : 'fs://wisdomLifeData/equipment.json'
	//	});
	//	ssid = $api.strToJson(data).wifiName;
	//	pwd = $api.strToJson(data).pwd;
	//	$("#oldpwd").val(pwd);
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.paddingTwo');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:80px;');
	}
	
	$("#submit").bind("click", function() {
		var num = $("#num").val();
		var vCode = $("#vCode").val();
		var patrn = /^[a-zA-Z0-9]{8,26}$/;
		if (num.replace(/(^s*)|(s*$)/g, "").length == 0 || vCode.replace(/(^s*)|(s*$)/g, "").length == 0) {
			api.alert({
				msg : '输入的密码不能为空'
			});
		} else if (num.replace(/(^s*)|(s*$)/g, "").length < 8) {
			api.alert({
				msg : '输入的密码长度不能少于八位'
			});
		} else if (num != vCode) {
			api.alert({
				msg : '两次输入的密码必须保持一致'
			});
		} else if (!patrn.test(num)) {
			api.alert({
				msg : '密码只能由数字和字母组成'
			});
		} else {
			trans = api.require('trans');
			if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
				xmlhttp = new XMLHttpRequest();
			} else {// code for IE6, IE5
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					trans.parse({
						data : xmlhttp.responseText
					}, function(ret, err) {
						console.log(JSON.stringify(ret));
						if (ret.Function.Status == 0) {
							xmlhttp.onreadystatechange = function() {
								if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
									trans.parse({
										data : xmlhttp.responseText
									}, function(ret, err) {
										console.log(JSON.stringify(ret));
										api.alert({
											msg : '密码设置成功，请您重新连接设备WIFI',
										}, function(ret, err) {
											api.closeWin();
										});
									});
								} else if (xmlhttp.readyState == 4 && xmlhttp.status == 0) {
									api.alert({
										msg : "请连接设备的指定WIFI"
									});
									console.log(xmlhttp.readyState + "---" + xmlhttp.status);
								}
							}
							xmlhttp.open("GET", ReconnectWiFi, true);
							xmlhttp.send();
						}
					});
				} else if (xmlhttp.readyState == 4 && xmlhttp.status == 0) {
					api.alert({
						msg : "请连接设备的指定WIFI"
					});
					console.log(xmlhttp.readyState + "---" + xmlhttp.status);
				}
			}
			xmlhttp.open("GET", url + "num", true);
			xmlhttp.send();
		}
	});
	$("#back").bind("click", function() {
		api.closeWin();
	});
};
