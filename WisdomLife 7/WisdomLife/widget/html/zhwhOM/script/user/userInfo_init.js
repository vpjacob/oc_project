//员工管理模块常量初始化
var user_info_view_imageView = null;
var user_info_edit_imageView = null;

//用户信息主页面初始化
myApp.onPageInit('user_info_main', function(page) {
	var userID = uid;
	init_user_info_main(userID);
});

//个人动态详情页面初始化
myApp.onPageInit('user_info_dynamic', function(page) {
	var userID = page.query.userID;
	if(userID != uid) {
		$$('#user_info_send_dynamic').html('');
	}
	init_user_dynamic(userID);
});

//查看用户详细信息
myApp.onPageInit('user_info_view', function(page) {
	var type = page.query.type;
	var userID = page.query.userID;
	var username = null != page.query.username ? page.query.username : '';
	$$("#usertype").val(type);
	$$('input#userrename').val(username);
	
	if(userID == uid){
		$$('#user_info_view_optionDiv').hide();
	}
	
	if(type == '2') {
		//从个人信息页查看个人详情页
		$$("#follow").attr('display', 'none');
		$$('#user_info_view_optionDiv').hide();
		$$('#user_info_view_backLink').attr('href', '#');
		$$('#user_info_view_backLink').on('click', function() {
			mainView.router.back({
				force: false,
				url: 'html/user/userInfo.html'
			});
		});
		userID = uid;
	} else if(type == '1') {
		//从附近的人查看个人详情页
		$$('#user_info_view_editLink').html('');
		$$('#user_info_view_backLink').on('click', function() {
			mainView.router.back();
		})
	} else if(type == '3') {
		//从好友列表查看个人详情页
		var hqid = page.query.userID

		$$('#user_info_view_editLink').html('<span style="color: rgba(255, 255, 255, 0.79);">修改备注名</span>');
		$$('#user_info_view_editLink').attr('href', 'html/maillist/remarKname.html?type=3&userID=' + hqid + '&username=' + $$('input#userrename').val());
		$$('#user_info_view_backLink').attr('href', '#');
		$$('#user_info_view_backLink').on('click', function() {
			mainView.router.back({
				url: 'html/maillist/maillist.html',
				force: false
			});
		})
	} else if(type == '4') {
		//从搜索查看个人详情
		$$('#user_info_view_editLink').html('');
		$$('#user_info_view_backLink').on('click', function() {
			mainView.router.back({
				url: 'html/maillist/addfriends.html',
				force: false
			});
		})
	} else if(type == '5') {
		//从粉丝列表查看个人详情
		$$('#user_info_view_editLink').html('');
		$$('#user_info_view_backLink').on('click', function() {
			mainView.router.back({
				url: 'html/maillist/maillist.html?type=1',
				force: true
			});
		})
	}
	$$("#personId").val(userID);

	init_user_info_view(userID,type);
});

//用户设置黑名单列表
myApp.onPageInit('user_setting_backList', function(page) {
	init_user_setting_blackList();
});

//谁看过我
myApp.onPageInit('user_info_visitor', function(page) {
	$$('.seeMeTab').on('click', function() {
		$$('.seeMeTab').removeClass('tabButtonActivity');
		$$(this).toggleClass('tabButtonActivity');

		$$('.seeMeSpan1').removeClass('seeMeSpanActivity').addClass('seeMeSpan');
		$$(this).find('.seeMeSpan1').removeClass('seeMeSpan')
		$$(this).find('.seeMeSpan1').addClass('seeMeSpanActivity')
	});
	int_user_info_visitorList();
	$$('#user_inf_visitor_list').on('click', function() {
		int_user_info_visitorList();
		$$('#user_info_visitor_clear').attr('onclick', 'user_info_visitor_clear()');
	});
	$$('#user_inf_visitor_dynamic').on('click', function() {
		int_user_info_visitorDynamic();
		$$('#user_info_visitor_clear').attr('onclick', 'user_info_visitor_dynamic_clear()');
	});
});

//修改用户信息
myApp.onPageInit('user_info_edit', function(page) {
	var type = page.query.type;
	var keyWords = page.query.keyWord;
	$$('#del_img_space').html('');
	if(type == '1') {
		init_user_info_edit('1');
	} else {
		init_user_info_edit(keyWords);
	}
	
	//保存个人信息
	$$('#save_user_edit').on('click', function() {

		$$('#save_user_edit').attr('disabled','disabled');
		var userName = $$('#user_info_edit_userName').html();
		var userAge = $$('#user_info_edit_age').html();
		var userAstro = $$('#user_info_edit_astro').html();
		var userBrithday = $$('#user_info_edit_brithday').html();
		var userSign = $$('#user_info_edit_sign').html();
		var userEmstate = $$('#user_info_edit_emstate').html();
		var userHome = $$('#user_info_edit_home').html();
		var userArea = $$('#user_info_edit_area').html();
		var userRemark = $$('#user_info_edit_remark').html();

		var userKeyWords = $$('#user_info_edit_keywords').html();
		var delImg = $$('#del_img_space').html();
		if(delImg != '') {
			delImg = delImg.replace(/,$/, "");
		}
		var userImageObj = $$('.sharkInfoImage.ui-state-default');
		var userNewImage = $$('.sharkInfoImage.ui-state-default.user_info_edit_newImage');

		var newImages = '';
		var oldimg = '';
		var newimg = '';
		var newimgArr = [];
		var returnimg = [];
		var newimgsrc = '';

		if(userKeyWords.substr(0, 1) == ','){ 
			userKeyWords = userKeyWords.substr(1)
		};
		userKeyWords = userKeyWords.replace(/,$/, "");
		
		if(userImageObj.length > 0) {
//			sort.destroy();
			myApp.showIndicator();
			if(userNewImage.length > 0) {
				for(var i = 0; i < userNewImage.length; i++) {
					newimgArr.push($$(userNewImage[i]).attr('src'));
				}
				$$.each(newimgArr, function(index, value) {
					uploadimage(value, function(path) {
						newImages += path;
					});
				});

				setTimeout(function() {
					newImages = newImages.replace(/,$/, "");
					returnimg = newImages.split(',');
					$$.each(userImageObj, function(i, val) {
						if($$(userImageObj[i]).hasClass('user_info_edit_newImage')) {
							newimgsrc = $$(userImageObj[i]).attr('src');
							$$.each(returnimg, function(j, v) {
								if(newimgsrc.split('/')[newimgsrc.split('/').length - 1] == v.split('/')[v.split('/').length - 1]) {
									newimg += v + '-_-' + i + ',';
									return false;
								}else{
									return true;
								}
							});
						} else {
							oldimg += $$(userImageObj[i]).attr('src').split(rootUrl)[1] + '-_-' + i + ',';
						}
					});
				}, 1300);
			} else {
				$$.each(userImageObj, function(k, p) {
					oldimg += $$(userImageObj[k]).attr('src').split(rootUrl)[1] + '-_-' + k + ',';
				});
			}

			setTimeout(function() {
				var _data = {
					script: "managers.om.user_moble.user",
					needTrascation: true,
					funName: "saveUserInfo",
					form: "{userID: '" + uid + "',userName: '" + userName + "',userAge: '" + userAge + "',userAstro: '" + userAstro +
						"',userBrithday: '" + userBrithday + "',userSign: '" + userSign + "',userEmstate: '" + userEmstate +
						"',userHome: '" + userHome + "',userArea: '" + userArea + "',userRemark: '" + userRemark +
						"',userKeyWords: '" + userKeyWords + "',userImgNew: '" + newimg + "',userImgOld: '" + oldimg + "',delImg: '" + delImg + "'}"
				};

				$$.ajax({
					url: rootUrl + "/api/execscript",
					method: 'post',
					dataType: 'json',
					data: _data,
					timeout: 5000,
					success: function(data) {
						if(data.execStatus == 'true') {
							myApp.hideIndicator();
							toast.show('更新成功！');
							mainView.router.loadPage('html/user/userinfo_view.html?type=2&userID=' + uid);
						}
					},
					error: function(xhr, status) {
						alert(status);
					}
				});
			}, 1500);
		} else {
			myApp.alert('请至少添加一张图片作为头像');
			$$('#save_user_edit').removeAttr('disabled');
		}
	});
	
	$$('#userinfo_edit_back').on('click', function() {
		mainView.router.back({
			url: 'html/user/userinfo_view.html?type=2',
			force: false
		});
	});
});

//修改用户名
myApp.onPageInit('user_info_edit_userName', function(page) {
	var userName = page.query.value;
	$$('#user_info_edit_userName_input').val(userName);
	$$('#bcuserName').on('click', function() {

		nameLength = $$('#user_info_edit_userName_input').val().replace(/[^\x00-\xff]/g, "0101").length;
		if(nameLength > 40) {
			myApp.alert('用户名不能超过10个字！');
			return false;
		} else {
			$$('#user_info_edit_userName').html($$('#user_info_edit_userName_input').val());
			mainView.router.back({
				url: 'html/user/userinfo_edit.html',
				force: false
			});
		}
	});
});

//编辑个人情感状态
myApp.onPageInit('user_info_edit_emState', function(page) {

	$$('.col-25').on('click', function() {
		$$('.col-25').removeClass('btnbg-selected').addClass('btnbg');
		$$(this).addClass('btnbg-selected');
	});
	$$('#bcemState').on('click', function() {

		$$('#user_info_edit_emstate').html($$('.btnbg-selected').text());
		mainView.router.back({
			url: 'html/user/userinfo_edit.html',
			force: false
		});
	});
});

//编辑用户年龄
myApp.onPageInit('user_info_edit_age', function(page) {
	var brithDay = page.query.value;
	var today;
	if(brithDay != null && brithDay != '' && brithDay != 'null') {
		today = new Date(brithDay);
	} else {
		today = new Date();
	}

	var pickerInline = myApp.picker({
		container: '#picker-date-container',
		toolbar: false,
		rotateEffect: true,
		value: [today.getFullYear(), today.getMonth(), today.getDate()],
		onChange: function(picker, values, displayValues) {
			var daysInMonth = new Date(picker.value[0], picker.value[1] * 1 + 1, picker.value[2]).getDate();
			if(values[2] > daysInMonth) {
				picker.cols[1].setValue(daysInMonth);
			}
			var checkYear = picker.value[0];
			var checkMonth = picker.value[1] * 1 + 1;
			var checkMonth1 = checkMonth;
			if(checkMonth < 10){
				checkMonth1 = '0' + checkMonth;
			}
			var checkDate = picker.value[2];
			$$('#user_info_edit_age_value').html('');
			$$('#user_info_edit_age_value').html(ages(checkYear + '-' + checkMonth + '-' + checkDate));
			$$('#user_info_edit_astro_value').html('');
			$$('#user_info_edit_astro_value').html(getAstro(checkMonth, checkDate) + '座');
			$$('#user_info_edit_birthday_value').html(checkYear + '-' + checkMonth1 + '-' + checkDate);
		},
		formatValue: function(p, values, displayValues) {
			return displayValues[0] + ' ' + displayValues[1] + ', ' + displayValues[2];
		},
		cols: [
			// Years
			{
				values: (function() {
					var arr = [];
					for(var i = 1950; i <= 2030; i++) {
						arr.push(i);
					}
					return arr;
				})(),
				displayValues: (function() {
					var arrYear = [];
					for(var i = 1950; i <= 2030; i++) {
						arrYear.push(i + '年');
					}
					return arrYear;
				})(),
			},
			// Months
			{
				textAlign: 'left',
				values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
				displayValues: ('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月').split(' ')
			},
			// Days
			{
				values: ('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31').split(','),
				displayValues: ('1日,2日,3日,4日,5日,6日,7日,8日,9日,10日,11日,12日,13日,14日,15日,16日,17日,18日,19日,20日,21日,22日,23日,24日,25日,26日,27日,28日,29日,30日,31日').split(',')
			}
		]
	});
	$$('#bcage').on('click', function() {

		//myApp.onPageBack('user_info_edit_age', function(page) {
		var userAge = $$('#user_info_edit_age_value').html();
		var userAstro = $$('#user_info_edit_astro_value').html();
		var userBirthday = $$('#user_info_edit_birthday_value').html();
		
		if(compareTime(userBirthday)){
			$$('#user_info_edit_age').html(userAge);
			$$('#user_info_edit_astro').html(userAstro);
			$$('#user_info_edit_brithday').html(userBirthday);
	
			mainView.router.back({
				url: 'html/user/userinfo_edit.html',
				force: false
			});
		}else{
			toast.show('生日不要作假哦！');
		}
	});
});

//修改用户关键字
myApp.onPageInit('user_info_edit_keyword', function(page) {

	var userKeyWord = page.query.value;

	if(userKeyWord != '') {
		var userKeyWords = userKeyWord.split(',');
		var count = 0;
		for(var j = 0; j < userKeyWords.length; j++) {
			count = j + 1;
			$$('#user_inf_key' + count).val(userKeyWords[j]);
		}
	}
	$$('#bckeyword').on('click', function() {
		var formData = myApp.formToJSON('#user_info_edit_keyword_form');
		var user_keyword1 = formData.user_inf_key1;
		var user_keyword2 = formData.user_inf_key2;
		var user_keyword3 = formData.user_inf_key3;
		var user_keyword4 = formData.user_inf_key4;
		var user_keyword5 = formData.user_inf_key5;

		var keyWordLength = "";
		var count = 0;
		var keyWords = '';
		$$('#user_info_edit_keyword').html('');
		if(user_keyword1 != null && user_keyword1 != '' && user_keyword1 != 'null') {
			keyWordLength = user_keyword1.replace(/[^\x00-\xff]/g, "0101").length;
			if(keyWordLength > 40) {
				myApp.alert('关键字不能超过10个字！');
				count++;
				return false;
			} else {
				$$('#user_info_edit_keyword').append('<div class="key-keyword-search" style="font-size: 0.8em;margin: 2px 2px;"><span style="padding:5px;">' + user_keyword1 + '</span></div>');
				keyWords += user_keyword1;
			}

		}
		if(user_keyword2 != null && user_keyword2 != '' && user_keyword2 != 'null') {
			keyWordLength = user_keyword2.replace(/[^\x00-\xff]/g, "0101").length;
			if(keyWordLength > 40) {
				myApp.alert('关键字不能超过10个字！');
				count++;
				return false;
			} else {
				$$('#user_info_edit_keyword').append('<div class="key-keyword-search" style="font-size: 0.8em;margin: 2px 2px;"><span style="padding:5px;">' + user_keyword2 + '</span></div>');
				keyWords = keyWords + ',' + user_keyword2;
			}
		}
		if(user_keyword3 != null && user_keyword3 != '' && user_keyword3 != 'null') {
			keyWordLength = user_keyword3.replace(/[^\x00-\xff]/g, "0101").length;
			if(keyWordLength > 40) {
				myApp.alert('关键字不能超过10个字！');
				count++;
				return false;
			} else {
				$$('#user_info_edit_keyword').append('<div class="key-keyword-search" style="font-size: 0.8em;margin: 2px 2px;"><span style="padding:5px;">' + user_keyword3 + '</span></div>');
				keyWords = keyWords + ',' + user_keyword3;
			}
		}
		if(user_keyword4 != null && user_keyword4 != '' && user_keyword4 != 'null') {
			keyWordLength = user_keyword4.replace(/[^\x00-\xff]/g, "0101").length;
			if(keyWordLength > 40) {
				myApp.alert('关键字不能超过10个字！');
				count++;
				return false;
			} else {
				$$('#user_info_edit_keyword').append('<div class="key-keyword-search" style="font-size: 0.8em;margin: 2px 2px;"><span style="padding:5px;">' + user_keyword4 + '</span></div>');
				keyWords = keyWords + ',' + user_keyword4;
			}
		}
		if(user_keyword5 != null && user_keyword5 != '' && user_keyword5 != 'null') {
			keyWordLength = user_keyword5.replace(/[^\x00-\xff]/g, "0101").length;
			if(keyWordLength > 40) {
				myApp.alert('关键字不能超过10个字！');
				count++;
				return false;
			} else {
				$$('#user_info_edit_keyword').append('<div class="key-keyword-search" style="font-size: 0.8em;margin: 2px 2px;"><span style="padding:5px;">' + user_keyword5 + '</span></div>');
				keyWords = keyWords + ',' + user_keyword5;
			}
		}
		if(keyWords.substr(0, 1) == ',') keyWords = keyWords.substr(1);
		keyWords = keyWords.replace(/,$/, "");
		$$('#user_info_edit_keywords').html(keyWords);
		mainView.router.back({
			url: 'html/user/userinfo_edit.html',
			force: false
		});
	});

});

//修改用户个性签名
myApp.onPageInit('user_info_edit_sign', function(page) {
	var userSign = page.query.value;
	$$('#user_info_edit_sign_value').val(userSign);
	$$('#bcsign').on('click', function() {
		$$('#user_info_edit_sign').html($$('#user_info_edit_sign_value').val());
		$$('#user_info_edit_sign_link').attr('href', 'html/user/userinfo_edit_sign.html?value=' + $$('#user_info_edit_sign_value').val());
		mainView.router.back({
			url: 'html/user/userinfo_edit.html',
			force: false
		});
	});
});

//修改常出没地
myApp.onPageInit('user_info_edit_area', function(page) {
	var area = page.query.value;
	$$('#user_info_edit_area_input').val(area);
	$$('#bcarea').on('click', function() {
		$$('#user_info_edit_area').html($$('#user_info_edit_area_input').val());
		$$('#user_info_edit_area_link').attr('href', 'html/user/userinfo_edit_area.html?value=' + $$('#user_info_edit_area_input').val());
		mainView.router.back({
			url: 'html/user/userinfo_edit.html',
			force: false
		});
	});
});

//修改备注信息
myApp.onPageInit('user_info_edit_explain', function(page) {
	var explain = page.query.value;
	$$('#user_info_edit_explain_input').val(explain);
	$$('#bcexplain').on('click', function() {
		$$('#user_info_edit_remark').html($$('#user_info_edit_explain_input').val());
		$$('#user_info_edit_remark_link').attr('href', 'html/user/userinfo_edit_explain.html?value=' + $$('#user_info_edit_explain_input').val());
		mainView.router.back({
			url: 'html/user/userinfo_edit.html',
			force: false
		});
	});
});

//收藏列表
myApp.onPageInit('user_collection', function() {
	dataCollectionList(1);
	var loading = false;
	var load_page = 1;
	//加载收藏列表
	$$('#collection_page').on('infinite', function() {

		if(loading) {
			return;
		}
		loading = true;
		load_page++;
		setTimeout(function() {
			dataCollectionList(load_page);
			loading = false;
		}, 1000);

	});

	$$('#collection_back').on('click', function() {
		mainView.router.back({
			url: 'html/user/userInfo.html',
			force: false
		});
	});
});
