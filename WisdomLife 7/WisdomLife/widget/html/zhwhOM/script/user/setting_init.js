//用户设置主页面初始化
myApp.onPageInit('user_setting_main',function(page){
	$$('#setting_back').on('click', function (){
		mainView.router.back({
			url : 'html/user/userInfo.html',
			force : true
		});
	});
});

//消息提醒页面初始化
myApp.onPageInit('user_setting_message', function(page) {
	//新消息提醒
	api.getPrefs({
		key: 'user_setting_new_message_check'
	}, function(ret, err) {
		if (ret.value) {
			$$('input[name="user_setting_new_message_check"]').prop('checked', true);
		} else {
			$$('input[name="user_setting_new_message_check"]').prop('checked', false);
		}
	});
	//声音
	api.getPrefs({
		key: 'user_setting_sound_message_check'
	}, function(ret, err) {
		if (ret.value) {
			$$('input[name="user_setting_sound_message_check"]').prop('checked', true);
		} else {
			$$('input[name="user_setting_sound_message_check"]').prop('checked', false);
		}
	});
	//震动
	api.getPrefs({
		key: 'user_setting_shock_message_check'
	}, function(ret, err) {
		if (ret.value) {
			$$('input[name="user_setting_shock_message_check"]').prop('checked', true);
		} else {
			$$('input[name="user_setting_shock_message_check"]').prop('checked', false);
		}
	});
});

//消息提醒页面返回上一页
myApp.onPageBack('user_setting_message', function(page) {
	api.setPrefs({
		key: 'user_setting_new_message_check',
		value: $$('input[name="user_setting_new_message_check"]').prop('checked')
	});
	api.setPrefs({
		key: 'user_setting_sound_message_check',
		value: $$('input[name="user_setting_sound_message_check"]').prop('checked')
	});
	api.setPrefs({
		key: 'user_setting_shock_message_check',
		value: $$('input[name="user_setting_shock_message_check"]').prop('checked')
	});

});

myApp.onPageInit('feedback', function(page) {
	//初始化发布动态页监听
	feedbackinitListener();
})

myApp.onPageInit('edition',function(page){
	edition_init();
	
})

myApp.onPageInit('help',function(page){
	edition_init();	
})
