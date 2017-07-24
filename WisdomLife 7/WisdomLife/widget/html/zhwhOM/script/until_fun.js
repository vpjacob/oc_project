//根据出生日期计算年龄
function ages(str) {
	var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
	if (r == null) return false;
	var d = new Date(r[1], r[3] - 1, r[4]);
	if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
		var Y = new Date().getFullYear();
		return ((Y - r[1]));
	}
	return ("输入的日期格式错误！");
}
//根据出生月份和年份计算星座
function getAstro(month, day) {
	var s = "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
	var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
	return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2);
}

//密码复杂度校验
function checkPass(pass) {
	if (pass.length < 8) {
		return 0;
	}
	var ls = 0;
	if (pass.match(/([a-z])+/)) {
		ls++;
	}
	if (pass.match(/([0-9])+/)) {
		ls++;
	}
	if (pass.match(/([A-Z])+/)) {
		ls++;
	}
	if (pass.match(/[^a-zA-Z0-9]+/)) {
		ls++;
	}
	return ls
}

//获取图片本地地址
function getImageLocationURL(server_url) {
	api.imageCache({
		url: server_url,
	}, function(ret, err) {
		if (ret) {
			return ret.url;
		}
	});

}