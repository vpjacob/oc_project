var userid;
var referrerMobile;
var referrerName;
var proId;
var cityId;
var userinfoid;
apiready = function() {
	userid = api.pageParam.userid;
	referrerMobile = api.pageParam.referrerMobile;
	referrerName = api.pageParam.referrerName;
	api.showProgress();
	api.ajax({//获取推荐人姓名
		url : rootUrl + '/api/commmonweal/toPerfectInfo',
		method : 'post',
		data : {
			values : {
				userid : userid,
				referrerName : referrerName,
				referrerMobile : referrerMobile
			}
		}
	}, function(ret, err) {
//		alert($api.jsonToStr(ret));
		api.hideProgress();
		if (ret) {
			if (ret.execStatus == "true") {
				referrerName = ret.formDataset.entity.referrerName;
				userinfoid = ret.formDataset.entity.userid;
			} else {
				api.toast({
					msg : "数据请求失败，请重试"
				});
			}
		} else {
			api.toast({
				msg : "数据请求失败，请重试"
			});
		}
	});
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.paddingTwo');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}
	locationPro();
	$('#proname').change(changecity);

	$('#commit').click(function() {
		completeMsg();
	});

};

/**
 *加载省份
 */
function locationPro() {
	var provinceSelect = document.getElementById("proname");

	provinceSelect.innerHTML = "";
	var province = new Option();
	province.value = "请选择省";
	province.text = "请选择省";
	provinceSelect.options.add(province);
	for (var i = 0; i < city.length; i++) {
		var province = new Option();
		province.value = city[i].name;
		province.text = city[i].name;
		$(province).attr('id', city[i].id);
		provinceSelect.options.add(province);
	}
}

/**
 *省份改变加载城市
 */
function changecity() {
	var myselect = document.getElementById("proname");
	var index = myselect.selectedIndex;
	var province = myselect.options[index].text;
	var citySelect = document.getElementById("cityname");
	citySelect.innerHTML = "";
	var cityOption = new Option();
	cityOption.value = "请选择市";
	cityOption.text = "请选择市";
	citySelect.options.add(cityOption);
	for (var i = 0; i < city.length; i++) {
		if (city[i].name == province) {
			for (var j = 0; j < city[i].chindren.length; j++) {
				var cityOption = new Option();
				cityOption.value = city[i].chindren[j].name;
				cityOption.text = city[i].chindren[j].name;
				$(cityOption).attr('id', city[i].chindren[j].id);
				citySelect.options.add(cityOption);
			}
		}
	}
}

/**
 *验证邮箱
 */
function testEmail() {
	var temp = $api.val($api.byId('personEmail'));
	//对电子邮件的验证
	var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if (!myreg.test(temp)) {
		showALert('请输入有效的邮箱地址');
		return false;
	} else {
		return true;
	}
}

/**
 * 验证身份证号码
 */
function IdentityCodeValid(code) {
	var city = {
		11 : "北京",
		12 : "天津",
		13 : "河北",
		14 : "山西",
		15 : "内蒙古",
		21 : "辽宁",
		22 : "吉林",
		23 : "黑龙江 ",
		31 : "上海",
		32 : "江苏",
		33 : "浙江",
		34 : "安徽",
		35 : "福建",
		36 : "江西",
		37 : "山东",
		41 : "河南",
		42 : "湖北 ",
		43 : "湖南",
		44 : "广东",
		45 : "广西",
		46 : "海南",
		50 : "重庆",
		51 : "四川",
		52 : "贵州",
		53 : "云南",
		54 : "西藏 ",
		61 : "陕西",
		62 : "甘肃",
		63 : "青海",
		64 : "宁夏",
		65 : "新疆",
		71 : "台湾",
		81 : "香港",
		82 : "澳门",
		91 : "国外 "
	};
	var tip = "";
	var pass = true;
	var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;

	if (!code || reg.test(code) === false) {
		tip = "身份证号格式错误";
		pass = false;
	} else if (!city[code.substr(0, 2)]) {
		tip = "地址编码错误";
		pass = false;
	} else {
		//18位身份证需要验证最后一位校验位
		if (code.length == 18) {
			code = code.split('');
			//∑(ai×Wi)(mod 11)
			//加权因子
			var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
			//校验位
			var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
			var sum = 0;
			var ai = 0;
			var wi = 0;
			for (var i = 0; i < 17; i++) {
				ai = code[i];
				wi = factor[i];
				sum += ai * wi;
			}
			var last = parity[sum % 11];
			if (parity[sum % 11] != code[17]) {
				tip = "校验位错误";
				pass = false;
			}
		}
	}
	if (!pass)
		showALert(tip);
	return pass;
}

function completeMsg() {
	var personName = $api.val($api.byId('personName'));
	var personGender = $api.val($api.byId('personGender'));
	var personDate = $api.val($api.byId('personDate'));
	var proname = $api.val($api.byId('proname'));
	var cityname = $api.val($api.byId('cityname'));
	var personIdentfy = $api.val($api.byId('personIdentfy'));
	var identifyNumber = $api.val($api.byId('identifyNumber'));
	var personWork = $api.val($api.byId('personWork'));
	var personEmail = $api.val($api.byId('personEmail'));
	var personKey = $api.val($api.byId('personKey'));
	var personKeyAgain = $api.val($api.byId('personKeyAgain'));
	if (!personName) {
		showALert('请填写您的姓名');
		return false;
	}
	if (!personDate) {
		showALert('请输入您的出生日期');
		return false;
	}
	var provinceIndex = document.getElementById("proname").selectedIndex;
	proId = city[provinceIndex - 1].id;
	var cityIndex = document.getElementById("cityname").selectedIndex;
	cityId = city[provinceIndex-1].chindren[cityIndex - 1].id;
	if (proname == '请选择省') {
		showALert('请选择省');
		return false;
	}
	if (cityname == '请选择市') {
		showALert('请选择市');
		return false;
	}
	if (personIdentfy == '0') {
		showALert('请选择证件类型');
		return false;
	}
	if (!identifyNumber) {
		showALert('请填写身份证号码');
		return false;
	} else if (personIdentfy == '1' && !IdentityCodeValid(identifyNumber)) {
		return false
	}
	if (personWork == '请选择') {
		showALert('请输入行业');
		return false;
	}
	if (!personEmail) {
		showALert('请输入邮箱');
		return false;
	} else if (!testEmail()) {
		return false;
	}
	//	var patrn = /^[a-zA-Z0-9]{8,26}$/;
	var patrn = /^\d{6}$/;
	if (personKey.replace(/(^s*)|(s*$)/g, "").length == 0 || personKeyAgain.replace(/(^s*)|(s*$)/g, "").length == 0) {
		api.alert({
			msg : '输入的密码不能为空'
		});
		return false;
	} else if (personKey.replace(/(^s*)|(s*$)/g, "").length != 6) {
		api.alert({
			msg : '输入的密码长度为6位'
		});
		return false;
	} else if (personKey != personKeyAgain) {
		api.alert({
			msg : '两次输入的密码必须保持一致'
		});
		return false;
	} else if (!patrn.test(personKey)) {
		api.alert({
			msg : '密码只能由数字组成'
		});
		return false;
	}
	api.showProgress();
	api.ajax({
		url : rootUrl + '/api/commmonweal/checkIdCard',
		method : 'post',
		data : {
			values : {
				idCard : identifyNumber,
			}
		}
	}, function(ret, err) {
		api.hideProgress();
		console.log($api.jsonToStr(ret));
		if (ret) {
			if (ret.execStatus == "true") {
				if (ret.formDataset.entity.code == "2") {//身份证已存在
					showALert("身份证已存在");
				} else if (ret.formDataset.entity.code == "0") {//身份证可用
					api.showProgress();
					api.ajax({
						url : rootUrl + '/api/commmonweal/perfectInfo',
						method : 'post',
						data : {
							values : {
								userid : userinfoid,
								realname : personName,
								birth_day : personDate,
								sex : personGender,
								idcardtype : personIdentfy,
								idcard : identifyNumber,
								industry : personWork,
								password2 : personKey,
								email : personEmail,
								provinceid : proId,
								cityid : cityId,
								referrerName : referrerName
							}
						}
					}, function(ret, err) {
						api.hideProgress();
						if (ret) {
							if (ret.execStatus == "true") {
								api.alert({
									msg : ret.formDataset.entity.msg
								}, function(ret, err) {
									api.openWin({
										name : 'mywallet',
										url : 'mywallet.html',
										slidBackEnabled : true,
										animation : {
											type : "push", //动画类型（详见动画类型常量）
											subType : "from_right", //动画子类型（详见动画子类型常量）
											duration : 300 //动画过渡时间，默认300毫秒
										}
									});
									api.closeWin();
								});
							} else {
								showALert("数据请求失败，请重试");
							}
						} else {
							showALert("数据请求失败，请重试");
						}
					});
				}
			} else {
				showALert("数据请求失败，请重试");
			}
		} else {
			showALert("数据请求失败，请重试");
		}
	});

}

function showALert(msg) {
	api.alert({
		title : '提示',
		msg : msg,
	}, function(ret, err) {
	});
}
