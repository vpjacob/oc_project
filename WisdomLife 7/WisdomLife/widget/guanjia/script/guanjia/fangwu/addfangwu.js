apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}

$('#tj').click(function() {
		var xiaoqu = $("#xiaoqu").val();
		var loudong = $("#loudong").val();
		var fangjian = $("#fangjian").val();
		var name = $("#name").val();
		var tel = $("#tel").val();
		var ranzheng = $("#ranzheng").val();
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if (xiaoqu == "" || xiaoqu == 0) {
			alert("请选择所在小区");
			return false;
		} else if (loudong == null || loudong == 0) {
			alert("请选择楼栋号");
			return false;
		} else if (fangjian == null || fangjian == 0) {
			alert("请选择房间号");
			return false;
		} else if (name == null || name == "") {
			alert("请填写申请人");
			return false;
		} else if (tel == null || tel == "") {
			alert("联系电话不能为空");
			return false;
		} else if (!mobileReg.test(tel)) {
			alert("联系电话格式有误");
			return false;
		} else if (ranzheng == null || ranzheng == "") {
			alert("验证码不能为空");
			return false;
		} else {
			alert("提交成功");
		api.openWin({
			name : 'fangwu',
			url : 'fangwu.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		})
		}
	});
$('#first').click(function() {
		api.openWin({
			name : 'fangwuInf',
			url : 'fangwuInf.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//二维码扫描
	$("#ewm").click(function(){
		var scanner = api.require('scanner');
		scanner.open(function(ret, err) {
   		 if (ret) {
    	} else {
       	 alert(JSON.stringify(err));
    	}
		});
	});
}
function goBack() {
	api.closeWin({
	});
}






