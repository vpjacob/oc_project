function user_setting_changePassword() {
	var formData = myApp.formToJSON('#user_setting_changePassword');
	var old_password = formData.old_password;
	var new_password_1 = formData.new_password_1;
	var new_password_2 = formData.new_password_2;

	if (old_password == null || new_password_1 == null || new_password_2 == null||old_password == '' || new_password_1 == '' || new_password_2 == '') {
		myApp.alert('密码输入不能为空');
	}
	
	var _data = {
		script: "managers.om.user_moble.user",
		needTrascation: true,
		funName: "getUserPassWord",
		form: "{userID: '" + uid + "'}"
	};
		
	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'get',
		dataType: 'json',
		data: _data,
		success: function(data) {
			if (data.datasources[0].rows[0].c_user_password != hex_md5(old_password)) {
				myApp.alert('原密码输入错误，请重新输入！');
			} else {
				if (checkPass(new_password_1) < 3) {
					myApp.alert('新密码不符合密码规则，请重新输入！');
					return false;
				}
				if (new_password_1 != new_password_2) {
					myApp.alert('两次输入的密码不一致，请核对后输入！');
					return false;
				}
				
				var _datapwd = {
					script: "managers.om.user_moble.user",
					needTrascation: true,
					funName: "updateUserPassWord",
					form: "{userID: '" + uid + "',password: '" + hex_md5(new_password_1) + "'}"
				};
				
				$$.ajax({
					url: rootUrl + "/api/execscript",
					data: _datapwd,
					dataType: 'json',
					method: 'post',
					timeout: 5000,
					success: function(data) {
						if(data.execStatus == 'true'){
							myApp.alert('密码修改成功！');
							mainView.router.loadPage('html/user/setting.html');
						}
					}
				});
			}
		}
	});
}