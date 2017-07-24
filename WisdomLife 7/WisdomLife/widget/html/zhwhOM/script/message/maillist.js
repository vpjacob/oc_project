myApp.params.modalButtonCancel = '取消';
myApp.params.modalButtonOk = '确定';
var myPersonPhotoBrowser = null;

myApp.onPageInit('maillist', function(page) {
	var noticestat = 1;
	var fansstat = 1;

	initFriendList(uid);
	initNoticList(uid, 1);
	initFansList(uid);

	if(page.query.type != null) {
		if(page.query.type == 1) {
			clickFansList();
			$$('#tabmessage3').addClass('active');
			$$('#tabmessage1').removeClass('active');
			$$('#tabmessage2').removeClass('active');
		}
	}

	$$('.div-yichufans').attr('style', 'display:none;');
	sortableContainer = $$('.list-block.sortable');

	$$('#goodfriend').on('click', function() {
		initFriendList(uid);
		goodfriendstat = 0;
		myApp.showTab('#tabmessage1');
		$$('.right i').addClass('icon-user-plus');
		$$('.right a').attr('id', 'tianjia');
		$$('.right span').html('');
		if($$('#goodfriend').hasClass('active') == false) {
			$$('#goodfriend').addClass('active');
		}
		if($$('#notice').hasClass('active')) {
			$$('#notice').removeClass('active');
		}
		if($$('#fans').hasClass('active')) {
			$$('#fans').removeClass('active');
		}
		$$('.list-index.transparent_class').attr('style', 'color:#777777;');
		$$('.div-yichufans').attr('style', 'display:none;');
	});
	$$('#notice').on('click', function() {
		if(noticestat == 0) {
			initNoticList(uid, 1);
		}
		noticestat = 0;
		$$('.icon-user-plus').removeClass('icon-user-plus');
		$$('.right span').html('排序');
		$$('.right a').attr('id', 'paixu');
		if($$('#notice').hasClass('active') == false) {
			$$('#notice').addClass('active');
		}
		if($$('#goodfriend').hasClass('active')) {
			$$('#goodfriend').removeClass('active');
		}
		if($$('#fans').hasClass('active')) {
			$$('#fans').removeClass('active');
		}
		$$('.div-yichufans').attr('style', 'display:none;');
//		$$('.list-index.transparent_class').attr('style', 'display: none;');
	});
	$$('#chaxun').on('focus', function() {
		$$('.toolbar').hide();
	});
	$$('#chaxun').on('blur', function() {
			$$('.toolbar').show();
	});
	//- Two groups
	$$('.right a').on('click', function() {
		var state = '';
		state = $$(this).attr('id');
        androidBack = 'rankPage';
		if(state == 'paixu') {
			var buttons1 = [{
				text: '排序',
				label: true
			}, {
				text: '按距离',
				bold: true,
				onClick: function() {
					initNoticList(uid, 4);
				}
			}, {
				text: '按最后活跃时间',
				bold: true,
				onClick: function() {
					initNoticList(uid, 3);
				}
			}, {
				text: '按添加关注时间',
				bold: true,
				onClick: function() {
					initNoticList(uid, 1);
				}
			}, {
				text: '按首字母',
				bold: true,
				onClick: function() {
					initNoticList(uid, 2);
				}
			}];
			var buttons2 = [{
				text: '取消',
				bold: true
			}];
			var groups = [buttons1, buttons2];
			myApp.actions(groups);
		} else if(state == 'tianjia') {
			mainView.router.load({
				url: "html/maillist/addfriends.html"
			});
		} else if(state == 'bianji') {
			$$('#mailist .toolbar').hide();
			$$('.right span').html('取消');
			$$('.right a').attr('id', 'quxiao');
			$$('.fs_selector').css('display', 'block');

			$$('#mailist .div-yichufans span').html('移除粉丝(0)');
			$$('#mailist .label-checkbox').on('click', function() {
				if(!$$(this).children('input').prop('checked')) {
					var perNum = parseInt($$('input[name="my-checkbox"]:checked').length) + 1;
					$$('#mailist .div-yichufans span').html('移除粉丝(' + perNum + ')');
				} else {
					var perNum = parseInt($$('input[name="my-checkbox"]:checked').length) - 1;
					$$('#mailist .div-yichufans span').html('移除粉丝(' + perNum + ')');
				}
			});
			$$('.div-yichufans').attr('style', 'display:block;');
			$$('.right span').html('取消');
		} else if(state == 'quxiao') {
			$$('#mailist .toolbar').show();
			$$('.right span').html('编辑');
			$$('.fs_selector').css('display', 'none');
			$$('.right a').attr('id', 'bianji');
			$$('input[type="checkbox"]').prop('checked', false);
			$$('.div-yichufans').attr('style', 'display:none;');
		}
	});
});

//粉丝列表点击事件
function clickFansList() {
	var fansstatus = $$('#fansstatus').val();
	if(fansstatus == 0) {
		initFansList(uid);
	}
	$$('#fansstatus').val('0');
	myApp.showTab('#tab3');
	$$('.icon-user-plus').removeClass('icon-user-plus');
	$$('.right span').html('编辑');
	$$('.right a').attr('id', 'bianji');
	$$('.fs_selector').css('display', 'none');
	$$('input[type="checkbox"]').prop('checked', false);

	if($$('#fans').hasClass('active') == false) {
		$$('#fans').addClass('active');
	}
	if($$('#goodfriend').hasClass('active')) {
		$$('#goodfriend').removeClass('active');
	}
	if($$('#notice').hasClass('active')) {
		$$('#notice').removeClass('active');
	}
	if(sortableContainer.hasClass('sortable-opened')) {
		sortableContainer.removeClass('sortable-opened');
	}
	sortableContainer.trigger('close');
	$$('.div-yichufans').attr('style', 'display:none;');
//	$$('.list-index.transparent_class').attr('style', 'display: none;');
}

//添加好友列表
myApp.onPageInit('friendlSearchList', function(page) {
	prame = page.query.searchItem;
	$$('#searchkey').append(prame + '查询');
	getMessByOidByUname(prame);

});

//查询用户
myApp.onPageInit('addfriends', function(page) {
//	$$('#myoid').html(omcode);
	$$('#addfri').on('keyup keydown change', function(e) {

		var searchitem = $$('#addfri').val();

		if(searchitem.length != 0) {
			if(e.keyCode == 13) {
				$$('#addfri').blur();

				var _data = {
					script: "managers.om.maillist.maillist",
					needTrascation: false,
					funName: "getMessByOidByName",
					form: "{pramter:'" + searchitem + "'}"
				};

				$$.ajax({
					url: rootUrl + "/api/execscript",
					method: 'post',
					dataType: 'json',
					data: _data,
					success: function(data) {
						var mess = data.datasources[0].rows;
						if(mess.length > 0) {
							mainView.router.loadPage('html/maillist/searchFriendList.html?searchItem=' + searchitem);
						} else {
							myApp.alert('查无此人，请重新输入');
						}
					}
				});
			};
		}
	});
});

//修改备注名
myApp.onPageInit('remarkName', function(page) {

	var tid = page.query.userID;
	var remarkname = page.query.username;
	$$('input#remarkname').val(remarkname);

	$$('#reNameSave').on('click', function() {
		$$('#reNameSave').attr('disabled', 'disabled');

		var rkName = $$('#remName input[type="text"]').prop()[0].value.replace(/(^\s*)|(\s*$)/g, "");
		rkNameLength = rkName.replace(/[^\x00-\xff]/g, "0101").length;

		if(rkName != "") {
			if(rkNameLength <= 40) {
				var _data = {
					script: "managers.om.maillist.maillist",
					needTrascation: true,
					funName: "updateRemarkName",
					form: "{uid: '" + uid + " ',tid: '" + tid + "',c_remark_name: '" + rkName + "'}"
				};

				$$.ajax({
					url: rootUrl + "/api/execscript",
					method: 'post',
					dataType: 'json',
					data: _data,
					success: function(data) {
						if(data.formDataset.checked == 'true') {
							toast.show("修改成功！");
							$$('#user_info_view_editLink').attr('href', 'html/maillist/remarKname.html?type=3&userID=' + tid + '&username=' + rkName);
							mainView.router.back({
								url: 'html/user/userinfo_view.html?type=3&userID=' + tid,
								force: false
							});
						}
					},
					error: function(xhr, type) {
						toast.show("修改失败！");
					}
				});
			} else {
				toast.show('备注名不能多于10个字！');
				$$('#reNameSave').removeAttr('disabled');
			}
		} else {
			toast.show('备注名不能为空！');
			$$('#reNameSave').removeAttr('disabled');
		}
	});
});

//获取好友列表
function initFriendList(uid) {

	var _data = {
		script: "managers.om.maillist.maillist",
		needTrascation: false,
		funName: "getFriendList",
		form: "{uid: '" + uid + "',frendType: 2}"
	};
	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {

			getFriendList(data);

		},
		error: function(xhr, type) {
			alert("请求失败！");
		}
	});
}

//好友列表加载
function getFriendList(data) {
//	//查询好友列表
//	var frimess = data.datasources[0].rows;
//	//按首字母分组
//	var frifname = data.datasources[1].rows;
//	var div = $$('#friendlist');
//	var template_abc = ''
//	var template = "";
//	div.html('');
//	for(var i = 0; i < frifname.length; i++) {
//		template += '<div class="list-group">';
//		template += '<ul>';
//		template += '<li class="list-group-title" >' + frifname[i].fnamepy + '</li>';
//		for(var j = 0; j < frimess.length; j++) {
//			var FName = frimess[j].fnamepy;
//			var userName = frimess[j].c_user_name;
//			var userrelName = frimess[j].c_rel_name;
//			var un = (userName == '' || userName == null) ? userrelName : userName;
//
//			if(FName == frifname[i].fnamepy) {
//				template += '<li class="swipeout">';
//				template += '	<a href="html/user/userinfo_view.html?type=3&userID=' + frimess[j].c_user_id + '&username=' + un + '" class="item-link">';
//				template += '		<div class="swipeout-content item-content">';
//				template += '			<div class="item-inner paddingstate">';
//				template += '				<div class="item-media mediastate"><img src=\"' + rootUrl + frimess[j].c_user_image + ' \"  width="60px" height="60px">&nbsp;&nbsp;<font color="#000;" style="font-weight:300;font-size: 16px;">' + un + '</font></div>';
//				template += '			</div>';
//				template += '		</div>';
//				template += '	</a>';
//				template += '<div class="swipeout-actions-right">';
//				template += '	<a href="#" class="swipeout-delete" data-confirm="确定要取消关注该好友吗?" data-confirm-title="哦脉" data-id="' + frimess[j].c_user_id + '">删除好友</a>';
//				template += '</div>';
//				template += '</li>';
//			}
//		}
//		template += '</ul>';
//		template += '</div>';
//		template_abc += '<li data-index-letter=\"' + frifname[i].fnamepy + '\">' + frifname[i].fnamepy + '</li>';
//	}
//	div.append(template);
//	$$('#mailist .transparent_class').html('');
//	$$('#mailist .transparent_class').append(template_abc);
	$$('#goodfriend').html('邻里好友&nbsp;(' + 0 + ')');
}

////获取关注列表
//function initNoticList(uid, state) {
//
//	var _data = {
//		script: "managers.om.maillist.maillist",
//		needTrascation: false,
//		funName: "getNoticeList",
//		form: "{uid: '" + uid + "',attentiontype: 1,seach_index: 0, page_num: 1000,state: " + state + "}"
//	};
//
//	$$.ajax({
//		url: rootUrl + "/api/execscript",
//		method: 'post',
//		dataType: 'json',
//		data: _data,
//		success: function(data) {
//
//			getNoticList(data);
//
//		},
//		error: function(xhr, type) {
//			alert("请求失败！");
//		}
//	});
//}

function initNoticList(uid, state) {

	var _data = {
		script: "managers.om.maillist.maillist",
		needTrascation: false,
		funName: "getFriendList",
		form: "{uid: '" + uid + "',frendType: 2}"
	};
	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {

			getNoticList(data);

		},
		error: function(xhr, type) {
			alert("请求失败！");
		}
	});
}

//关注列表加载
//function getNoticList(data) {
//	var notilismess = data.datasources[0].rows;
//	var div = $$('#noticeList');
//	var template = "";
//	div.html('');
//	if(notilismess.length > 0) {
//		$$('#tabmessage2 .page-content').removeAttr('style');
//		$$('#tabmessage2 .page-content').attr('style', 'padding-top: 0px;');
//		var namewidth = api.winWidth - 240;
//		var template = '<ul>';
//		for(var i = 0; i < notilismess.length; i++) {
//
//			var userID = notilismess[i].c_user_id;
//			var userrelName = notilismess[i].c_rel_name;
//			var userName = notilismess[i].c_user_name;
//			var userImg = notilismess[i].c_user_image;
//			var userAge = notilismess[i].c_user_age;
//			var userGender = notilismess[i].c_user_gender;
//			var userSign = notilismess[i].c_user_sign;
//			var userLevel = notilismess[i].c_user_level;
//			var userLevelImg = notilismess[i].c_level_image;
//			var creatTime = notilismess[i].beforemin;
//			var distance = notilismess[i].distance;
//			var un = (userName == '' || userName == null) ? userrelName : userName;
//			template += '<li class="swipeout" id="swipeout111">';
//			template += '	<a href="html/user/userinfo_view.html?type=3&userID=' + userID + '&relation=1&username=' + un + '" class="swipeout-content item-link item-content">';
//			template += '		<div class="item-media"><img src=\"' + rootUrl + userImg + ' \" ></div>';
//			template += '		<div class="item-inner" style="padding-right: 0px; margin-left: 5px;padding-top: 0px;padding-bottom: 0px;">';
//			template += '			<div class="item-title-row" style="background-image: none;padding-right: 0px;margin-bottom: 4px;">';
//			template += '				<div class="item-title">';
//			template += '					<div style="font-size: 16px;font-weight: 400;max-width: ' + namewidth + 'px;">' + un + '</div>';
//			template += '					<div style="margin-top: 4px;margin-left: 6px;">';
//
//			if(userGender == 1) {
//				template += '					<div style="background-color: #4AAEF3; width: 24px;height:12px;border-radius: 2px;">';
//				template += '						<img src="image/nearby/ic_user_male.png" style="width:30%;padding-left: 1px;" />';
//			} else {
//				template += '					<div style="background-color: #FA94AA; width: 24px;height:12px;border-radius: 2px;">';
//				template += '						<img src="image/nearby/ic_user_famale.png" style="width:30%;padding-left: 1px;" />';
//			}
//
//			template += '							<span style="width: 50%;height: 12px;color: white;text-align: center;font-size: 10px;margin-left: -2px;">' + userAge + '</span>';
//			template += '						</div>';
//			template += '						<div style="width: 36px;height:12px;padding-left: 2px;">';
//			template += '							<img src=\"' + userLevelImg + ' \" style="height: 100%;width: 100%;	" />';
//			template += '						</div>';
//			template += '					</div>';
//			template += '				</div>';
//			if(parseInt(creatTime) / 60 > 1 && parseInt(creatTime) / 60 < 24) {
//				creatTime = Math.round(parseInt(creatTime) / 60) + '小时前';
//			} else if(parseInt(creatTime) / 60 >= 24) {
//				creatTime = Math.round(parseInt(creatTime) / (60 * 24)) + '天前';
//			} else {
//				creatTime = creatTime + '分钟前';
//			}
//			template += '				<div class="item-after" style="margin-right: 10px;"><span style="font-size: 10px;">' + distance + 'km&nbsp;|&nbsp;' + creatTime + '</span></div>';
//			template += '			</div>';
//			template += '			<div class="item-text"><span style="padding-bottom: 0px;">' + userSign + '</span></div>';
//			template += '		</div>';
//			template += '	</a>';
//			template += '	<div class="swipeout-actions-right">';
//			template += '		<a href="#" class="swipeout-delete" data-confirm="确定要取消关注吗?" data-id="' + userID + '">取消关注</a>';
//			template += '	</div>';
//			template += '</li>';
//		}
//		template += '</ul>';
//		div.append(template);
//	}
//	$$('#notice').html('生活好友&nbsp;(' + notilismess.length + ')');
//}

function getNoticList(data) {
	//查询好友列表
	var frimess = data.datasources[0].rows;
	//按首字母分组
	var frifname = data.datasources[1].rows;
	var div = $$('#noticeList');
	var template_abc = ''
	var template = "";
	div.html('');
//	$$('#tabmessage2 .page-content').removeAttr('style');
//	$$('#tabmessage2 .page-content').attr('style', 'padding-top: 0px;');
	for(var i = 0; i < frifname.length; i++) {
		template += '<div class="list-group">';
		template += '<ul>';
		template += '<li class="list-group-title" >' + frifname[i].fnamepy + '</li>';
		for(var j = 0; j < frimess.length; j++) {
			var FName = frimess[j].fnamepy;
			var userName = frimess[j].c_user_name;
			var userrelName = frimess[j].c_rel_name;
			var un = (userName == '' || userName == null) ? userrelName : userName;

			if(FName == frifname[i].fnamepy) {
				template += '<li class="swipeout">';
				template += '	<a href="html/user/userinfo_view.html?type=3&userID=' + frimess[j].c_user_id + '&username=' + un + '" class="item-link">';
				template += '		<div class="swipeout-content item-content">';
				template += '			<div class="item-inner paddingstate">';
				template += '				<div class="item-media mediastate"><img src=\"' + rootUrl + frimess[j].c_user_image + ' \"  width="60px" height="60px">&nbsp;&nbsp;<font color="#000;" style="font-weight:300;font-size: 16px;">' + un + '</font></div>';
				template += '			</div>';
				template += '		</div>';
				template += '	</a>';
				template += '<div class="swipeout-actions-right">';
				template += '	<a href="#" class="swipeout-delete" data-confirm="确定要取消关注该好友吗?" data-confirm-title="哦脉" data-id="' + frimess[j].c_user_id + '">删除好友</a>';
				template += '</div>';
				template += '</li>';
			}
		}
		template += '</ul>';
		template += '</div>';
		template_abc += '<li data-index-letter=\"' + frifname[i].fnamepy + '\">' + frifname[i].fnamepy + '</li>';
	}
	div.append(template);
	$$('#mailist .transparent_class').html('');
	$$('#mailist .transparent_class').append(template_abc);
	$$('#notice').html('生活好友&nbsp;(' + frimess.length + ')');
}

//获取粉丝列表
function initFansList(uid) {

	var _data = {
		script: "managers.om.maillist.maillist",
		needTrascation: false,
		funName: "getFansList",
		form: "{uid: '" + uid + "',attentiontype: 1,seach_index: 0, page_num: 1000}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			getFansList(data);

		},
		error: function(xhr, type) {
			alert("请求失败！");
		}
	});
}
//function initFansList(uid) {
//
//	var _data = {
//		script: "managers.om.maillist.maillist",
//		needTrascation: false,
//		funName: "getFriendList",
//		form: "{uid: '" + uid + "',frendType: 2}"
//	};
//	$$.ajax({
//		url: rootUrl + "/api/execscript",
//		method: 'post',
//		dataType: 'json',
//		data: _data,
//		success: function(data) {
//
//			getFansList(data);
//
//		},
//		error: function(xhr, type) {
//			alert("请求失败！");
//		}
//	});
//}

//粉丝列表加载
function getFansList(data) {
	var fanslismess = data.datasources[0].rows;
	var div = $$('#fanslist');
	var template = "";
	div.html('');
	var namewidth = api.winWidth - 240;

	if(fanslismess.length > 0) {
		var template = "<ul>";
		for(var i = 0; i < fanslismess.length; i++) {
			var beforemin = parseInt(fanslismess[i].beforemin);
			template += '<li class="swipeout" id="fs' + fanslismess[i].c_user_id + '" margin-left: 15px;>';
			template += '	<div style="left: 0;background: none;margin-left: 20px;display:none;" class="fs_selector">';
			template += '		<label class="label-checkbox ">';
			template += '			<input type="checkbox" name="my-checkbox" value="' + fanslismess[i].c_user_id + '">';
			template += '			<div class="item-media" style="margin-left:-10px;margin-top:5%;float:left;"><i class="icon icon-form-checkbox"></i></div>';
			template += '		</label>';
			template += '	</div>';
			template += '	<a href="html/user/userinfo_view.html?type=5&userID=' + fanslismess[i].c_user_id + '&relation=3" class="swipeout-content item-content " style=" padding-left: 0px;">';
			template += '		<div class="item-inner" style="padding-right: 0px; margin-left: 5px;padding-top: 0px;padding-bottom: 0px;">';
			template += '			<div class="item-title-row" style="background-image: none;padding-right: 0px;margin-bottom: 4px;padding-bottom: 0px;">';
			template += '				<div class="item-title" style="margin-bottom: 0px;">';
			template += '					<div><img src=\"' + rootUrl + fanslismess[i].c_user_image + ' \" style="height:60px;width:60px;-webkit-border-radius: 6px;"></div>';
			template += '					<div style="font-size: 16px;font-weight: 400;color: #000;margin-left: 8px;margin-top: 10px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;max-width: ' + namewidth + 'px;">' + fanslismess[i].c_user_name + '</div>';
			template += '					<div style="margin-top: 4px;margin-left: 2px;">';
			if(fanslismess[i].c_user_gender == 1) {
				template += '						<div style="background-color: #4AAEF3; width:24px;height:12px;border-radius:2px;margin-top:10px;">';
				template += '							<img src="image/nearby/ic_user_male.png" style="width:30%;float:left;margin-top:3px;margin-left:1px;" />';
			} else {
				template += '						<div style="background-color: #FA94AA; width:24px;height:12px;border-radius:2px;margin-top:10px;">';
				template += '							<img src="image/nearby/ic_user_famale.png" style="width:30%;float:left;margin-top:3px;margin-left:1px;" />';
			}
			template += '								<div style="width: 50%;height: 12px;color: white;text-align: center;font-size: 10px;margin-top: -0.5px;">' + fanslismess[i].c_user_age + '</div>';
			template += '							</div>';
			template += '							<div style="width: 36px;height:12px;padding-left: 2px;margin-top:9px;">';
			template += '								<img src=\"' + fanslismess[i].c_level_image + ' \" style="height: 100%;width: 100%;	" />';
			template += '							</div>';
			template += '						</div>';
			template += '					</div>';

			if(parseInt(beforemin) / 60 > 1 && parseInt(beforemin) / 60 < 24) {
				beforemin = Math.round(parseInt(beforemin) / 60) + '小时前';
			} else if(parseInt(beforemin) / 60 >= 24) {
				beforemin = Math.round(parseInt(beforemin) / (60 * 24)) + '天前';
			} else {
				beforemin = beforemin + '分钟前';
			}

			if(fanslismess[i].c_user_sign == '') {
				template += '				<div style="margin-top: -35px;font-size: 15px;color: #8e8e93;position: relative; margin-left: 67px; height: 20px;"><span></span></div>';
			} else {
				template += '				<div style="margin-top: -35px;font-size: 15px;color: #8e8e93;position: relative; margin-left: 67px; padding-right: 10px;padding-bottom: 0px;"><span>' + fanslismess[i].c_user_sign + '</span></div>';
			}
			template += '				</div>';
			template += '				<div class="item-after" style="position: absolute;top: 10px;right: 10px;"><span style="font-size: 10px;">' + fanslismess[i].distance + 'km&nbsp;|&nbsp;' + beforemin + '</span></div>';
			template += '			</div>';

			template += '		</a>';
			template += '		<div class="swipeout-actions-right">';
			template += '			<a href="#" class="swipeout-delete" data-confirm="确定要移除粉丝吗?" data-id="' + fanslismess[i].c_user_id + '">移除粉丝</a>';
			template += '		</div>';
			template += '</li>';
		}
		template += '</ul>';
		div.append(template);
	}
	$$('#fans').html('新朋友&nbsp;(' + fanslismess.length + ')');
}


//function getFansList(data) {
//	//查询好友列表
//	var frimess = data.datasources[0].rows;
//	//按首字母分组
//	var frifname = data.datasources[1].rows;
//	var div = $$('#fanslist');
//	var template_abc = ''
//	var template = "";
//	div.html('');
//	for(var i = 0; i < frifname.length; i++) {
//		template += '<div class="list-group">';
//		template += '<ul>';
//		template += '<li class="list-group-title" >' + frifname[i].fnamepy + '</li>';
//		for(var j = 0; j < frimess.length; j++) {
//			var FName = frimess[j].fnamepy;
//			var userName = frimess[j].c_user_name;
//			var userrelName = frimess[j].c_rel_name;
//			var un = (userName == '' || userName == null) ? userrelName : userName;
//
//			if(FName == frifname[i].fnamepy) {
//				template += '<li class="swipeout">';
//				template += '	<a href="html/user/userinfo_view.html?type=3&userID=' + frimess[j].c_user_id + '&username=' + un + '" class="item-link">';
//				template += '		<div class="swipeout-content item-content">';
//				template += '			<div class="item-inner paddingstate">';
//				template += '				<div class="item-media mediastate"><img src=\"' + rootUrl + frimess[j].c_user_image + ' \"  width="60px" height="60px">&nbsp;&nbsp;<font color="#000;" style="font-weight:300;font-size: 16px;">' + un + '</font></div>';
//				template += '			</div>';
//				template += '		</div>';
//				template += '	</a>';
//				template += '<div class="swipeout-actions-right">';
//				template += '	<a href="#" class="swipeout-delete" data-confirm="确定要取消关注该好友吗?" data-confirm-title="哦脉" data-id="' + frimess[j].c_user_id + '">删除</a>';
//				template += '</div>';
//				template += '</li>';
//			}
//		}
//		template += '</ul>';
//		template += '</div>';
//		template_abc += '<li data-index-letter=\"' + frifname[i].fnamepy + '\">' + frifname[i].fnamepy + '</li>';
//	}
//	div.append(template);
//	$$('#mailist .transparent_class').html('');
//	$$('#mailist .transparent_class').append(template_abc);
//	$$('#fans').html('新朋友&nbsp;(' + frimess.length + ')');
//}


//根据哦脉号和姓名查询
function getMessByOidByUname(prame) {

	var _data = {
		script: "managers.om.maillist.maillist",
		needTrascation: false,
		funName: "getMessByOidByName",
		form: "{pramter:'" + prame + "'}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			var mess = data.datasources[0].rows;
			var div = $$('#searchList');
			for(var i = 0; i < mess.length; i++) {
				var template = "";
				var userID = mess[i].c_user_id == null ? '' : mess[i].c_user_id;
				var userName = mess[i].c_user_name == null ? '' : mess[i].c_user_name;
				var userImg = mess[i].c_user_image == null ? '' : mess[i].c_user_image;
				var userAge = mess[i].c_user_age == null ? '' : mess[i].c_user_age;
				var userGender = mess[i].c_user_gender == null ? '' : mess[i].c_user_gender;
				var userSign = mess[i].c_user_sign == null ? '' : mess[i].c_user_sign;
				var userLevel = mess[i].c_user_level == null ? '' : mess[i].c_user_level;
				var userLevelImg = mess[i].c_level_image == null ? '' : mess[i].c_level_image;
				var userKeyWord = mess[i].c_key_keyword == null ? '' : mess[i].c_key_keyword;

				template += '<li>';
				template += '	<a href="html/user/userinfo_view.html?type=4&userID=' + userID + '" class="item-link">';
				template += '		<div class="item-link item-content">';
				template += '			<div class="item-media"><img src=\"' + rootUrl + userImg + ' \" style="width: 80px;height: 80px;"></div>';
				template += '			<div class="item-inner">';
				template += '				<div class="item-title-row" style="background-image:none;float: left;">';
				template += '					<div class="item-title"><span>' + userName + '</span>';

				if(userGender == 1) {
					template += '					<div class="communityDetal-mars l_float" style="margin-top: 2px;margin-left: 5px;">';
					template += '						<img src="image/nearby/ic_user_male.png" style="width:30%;margin-left:2px;margin-top: 1px;float: left;"> ';
				} else {
					template += '					<div class="communityDetal-marss l_float" style="margin-top: 2px;margin-left: 5px;">';
					template += '						<img src="image/nearby/ic_user_famale.png" style="width:30%;margin-left:2px;margin-top: 1px;float: left;"> ';
				}
				template += '							<span style="color: white;font-size: 12px;margin-top: 1px;">' + userAge + '</span>';
				template += '						</div>';
				template += '						<div class="communityDetal-vip l_float">';
				template += '							<img src=\"' + userLevelImg + ' \" width="100%" style="height: 14px;">';
				template += '						</div>';
				template += '					</div>';
				template += '				</div>';
				template += '				<div class="item-after"><span></span></div>';
				template += '				<br />';
				template += '				<div class="item-text">';
				template += '					<span>' + userSign + '</span>';
				template += '				</div>';
				template += '				<div class="item-subtitle" style="margin-top: 4px;">';
				template += '					<div class="row no-gutter" style="margin-top: 10px;width: 7em;display: inline;">';

				if(userKeyWord.indexOf(',') > 0) {
					var keywords = userKeyWord.split(",");
					for(var j = 0; j < keywords.length; j++) {
						var keyword = keywords[j];
						template += '<div class="key-keyword-search" style="font-size: 0.8em;margin-bottom: 2px;"><span>' + keyword + '</span></div>';
					}
				} else {
					template += '<div class="key-keyword-search" style="font-size: 0.8em;margin-bottom: 2px;"><span>' + userKeyWord + '</span></div>';
				}
				template += '					</div>';
				template += '				</div>';
				template += '			</div>';
				template += '		</div>';
				template += '	</a>';
				template += '</li>';

				div.append(template);
			}

		},
		error: function(xhr, type) {
			alert("请求失败！");
		}
	});
}

//扫一扫
$$(document).on('click', '#fnsAddF', function() {
	var fun_url = "";
	Auto517.FNScanner.openScanner(function(fun_url) {
		if(fun_url.eventType == "success") {

			var _data = {
				script: "managers.om.maillist.maillist",
				needTrascation: true,
				funName: "saoyisao",
				form: "{uid: '" + uid + "',dfid: '" + fun_url.content + "'}"
			};

			$$.ajax({
				url: rootUrl + "/api/execscript",
				method: 'post',
				dataType: 'json',
				data: _data,
				success: function(data) {

					var rusult1 = data.formDataset.count;

					if(rusult1 == '0') {
						alert("已经是好友！");
					} else if(rusult1 == '-1') {
						alert("没有找到该用户！");
					} else if(rusult1 == '1') {
						if(data.formDataset.checked == 'true') {
							alert("添加好友成功！");
							mainView.router.load({
								url: "html/maillist/maillist.html",
								force: true
							});
						}
					} else {
						alert("添加好友失败！");
					}
				},

				error: function(xhr, type) {
					myApp.confirm("添加好友失败！");
				}
			});
		}
	});
});

//取消关注(关注)
$$(document).on('delete', '#tabmessage2 .swipeout', function() {
	var notiNumtext = $$('#notice').prop()[0].innerText;
	var value = notiNumtext.replace(/[^0-9]/ig, "");
	var notiNumtextLast = notiNumtext.replace(/\d+/g, value - 1);
	$$('#notice').html('' + notiNumtextLast + '');
	var tid = $$(this).find('.swipeout-actions-right a').data('id');
	var _data = {
		script: "managers.om.maillist.maillist",
		needTrascation: true,
		funName: "cancelAtten",
		form: "{c_from_user_id: '" + uid + " ',c_to_user_id: '" + tid + " '}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			myApp.toast("移除成功！");
		},
		error: function(xhr, type) {
			myApp.toast("移除失败！");
		}
	});

});

//取消关注(好友)
$$(document).on('delete', '#tabmessage1 .swipeout', function() {
	var friNumtext = $$('#goodfriend').html();
	var gvalue = friNumtext.replace(/[^0-9]/ig, "");
	var friNumtextLast = friNumtext.replace(/\d+/g, gvalue * 1 - 1);
	var fansNumtext = $$('#fans').html();
	var fvalue = fansNumtext.replace(/[^0-9]/ig, "");
	var fansNumtextLast = fansNumtext.replace(/\d+/g, fvalue * 1 + 1);

	$$('#goodfriend').html('' + friNumtextLast + '');
	$$('#fans').html('' + fansNumtextLast + '');

	var tid = $$(this).find('.swipeout-actions-right a').data('id');
	var _data = {
		script: "managers.om.maillist.maillist",
		needTrascation: true,
		funName: "removeNotis",
		form: "{c_from_user_id: '" + uid + " ',c_to_user_id: '" + tid + " '}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			if(data.formDataset.checked == 'true') {
				initFriendList(uid);
				initFansList(uid);
				mainView.router.refreshPage();
				myApp.toast("移除成功！");
			}
		},
		error: function(xhr, type) {
			myApp.toast("移除失败！");
		}
	});

});

//移除粉丝
$$(document).on('delete', '#tabmessage3 .swipeout', function() {
	var fanNumtext = $$('#fans').prop()[0].innerText;
	var value = fanNumtext.replace(/[^0-9]/ig, "");
	var fanNumtextLast = fanNumtext.replace(/\d+/g, value - 1);
	$$('#fans').html('' + fanNumtextLast + '');
	var tid = $$(this).find('.swipeout-actions-right a').data('id');
	var _data = {
		script: "managers.om.maillist.maillist",
		needTrascation: true,
		funName: "removeFans",
		form: "{c_from_user_id: '" + tid + "',c_to_user_id: '" + uid + " '}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			myApp.toast("移除成功！");
		},
		error: function(xhr, type) {
			myApp.toast("移除失败！");
		}
	});
});

//批量移除粉丝
$$(document).on('click', '#mailist .div-yichufans', function() {
	var idobj = $$('#mailist input[name="my-checkbox"]:checked');
	if(idobj.length > 0) {
		myApp.confirm('确定要移除多名粉丝吗?', function() {
			$$('#mailist .toolbar').show();
			var batid = [];
			for(var i = 0; i < idobj.length; i++) {
				batid[i] = idobj[i].value;
				myApp.swipeoutDelete('#fs' + batid[i]);
			}
			var list = JSON.stringify(batid);

			var _data = {
				script: "managers.om.maillist.maillist",
				needTrascation: true,
				funName: "removeBatchFans",
				form: "{c_from_user_id: '" + list + "',c_to_user_id: '" + uid + " '}"
			};

			$$.ajax({
				url: rootUrl + "/api/execscript",
				method: 'post',
				dataType: 'json',
				data: _data,
				success: function(data) {
					$$('#mailist .div-yichufans span').html('移除粉丝(0)');
					myApp.toast("移除成功！");
				},
				error: function(xhr, type) {
					myApp.toast("移除失败！");
				}
			});

		});
	}
});