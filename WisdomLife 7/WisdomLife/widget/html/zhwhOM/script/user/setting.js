//清除本地缓存数据
function user_clear_temp_file() {
	var myApp = new Framework7({
		modalButtonOk: '清除',
		modalButtonCancel: '取消'
	});

	myApp.confirm('根据缓存文件的大小，清理时间从几秒到几分钟不等，请耐心等待。', '清理缓存',
		function() {
			api.clearCache(
				function(ret, err) {
					toast.show('清理成功！');
				}
			);
		},
		function() {}
	);
}

//退出当前登陆用户
function user_login_out() {
	myApp.confirm('退出后你将无法接受到所有人的信息，别人也无法找到你，是否继续？', '退出登陆',
		function() {
			window.localStorage.clear();
			uid = "";
			username = "";
			mainView.router.loadPage('login.html');
			api.clearCache(
				function(ret, err) {

				}
			);
		},
		function() {}
	);
}

//查看当前用户二维码
function user_QR_panel() {
//	var QRcodeSrc = '';
	if($$('#QR_code').html() == '' || $$('#QR_code').html() == null){
		toast.show('二维码生成中...');
	}else{
		var modal = myApp.modal({
			title: '',
			text: '<div style="width:auto;height:50px;background-color: white;border-radius: 8px 8px 0px 0px;" id="QRcodediv">' +
				'<img src="' + $$('#user_info_userImage').attr('src') + '"  style="display: flex;margin-left: 15px;padding-top: 2px;width:45px;height:45px">' +
				'<span style="display: flex;margin-top: -35px;padding-left: 80px;">' + $$('#user_info_userName').html() + '</span>' +
				'</div>' +
				'<div  style="width: auto; padding-top: 10px;padding-bottom: 10px;">' +
				'<div class="swiper-wrapper">' +
				'<div class="swiper-slide" style=" width: 150px;height: 150px;margin-left: auto;margin-right: auto;"><img src="' + rootUrl + $$('#QR_code').html() + '" height="150" style="display:block"></div>' +
				'</div>' +
				'</div>',
			buttons: [{
				text: '扫一扫上面的二维码图案,加我哦脉'
			}, ]
		})
		myApp.swiper($$(modal).find('.swiper-container'), {
			pagination: '.swiper-pagination'
		});
		if($$('.modal-inner').hasClass('modalInnerPadding') == false) {
			$$('.modal-inner').addClass('modalInnerPadding');
		}
		$$('.modal-overlay.modal-overlay-visible').on('click', function() {
			myApp.closeModal();
		});
	}
}

//分享用户二维码
function user_share_QR() {
	var buttons1 = [{
		text: '分享到',
		label: true
	}, {
		text: '<div class="row" style="background-color: #f0f0f0;"><div class="col-33" style="padding: 5px;background: #f0f0f0;" onclick="share_QR_QQfriend();">' +
			'<div style="height:50px;  margin: 5px;"><img src="image/setting/ic_setting_qq.png" style="border-radius: 50%;width: 50px;height: 50px;" /></div>' +
			'<div ><span style="font-size: 15px;color:#000000">QQ好友</span></div>' +
			'</div>' +
			'<div class="col-33" style="padding: 5px;background: #f0f0f0;" onclick="share_QR_wxfriend();">' +
			'<div style="height:50px;  margin: 5px;"><img src="image/setting/ic_setting_weixin.png" style="border-radius: 50%;width: 50px;height: 50px;" /></div>' +
			'<div><span style="font-size: 15px;color:#000000">微信好友</span></div>' +
			'</div>' +
			'<div class="col-33" style="padding: 5px;background: #f0f0f0;" onclick="share_QR_wxcommunity();">' +
			'<div style="height:50px;  margin: 5px;"><img src="image/user/ic_shareboard_weixin_quan.png" style="border-radius: 50%;width: 50px;height: 50px;" /></div>' +
			'<div><span style="font-size: 15px;color:#000000">微信朋友圈</span></div>' +
			'</div></div>',
	}];
	var buttons2 = [{
		text: '取消',
		color: '#3BAB92'
	}];
	var groups = [buttons1, buttons2];
	myApp.actions(groups);
}

//分享二维码到QQ好友
function share_QR_QQfriend() {
	qq.installed(function(ret, err) {
		if(ret.status) {
			qq.shareNews({
				title: '难道不想加一波好友吗？',
				description: '下载智慧生活，直接加我为好友吧！',
				imgUrl: 'image/a.png',
				url: rootUrl + '/jsp/manager/share_user_card?userId=' + uid,
				type: 'QFriend'
			}, function(ret, err) {
				if(ret.status) {
					alert('分享成功');
				} else if(err.code == -4){
					alert('已取消分享');
				} else {
					alert('分享失败');
				}
			});
		} else {
			api.alert({
				msg: "没有安装"
			});
		}
	});
}

//分享二维码到微信好友
function share_QR_wxfriend() {
	wx.isInstalled(function(ret, err) {
		if(ret.installed) {
			wx.shareWebpage({
				apiKey: '',
				scene: 'session',
				title: '难道不想加一波好友吗？',
				description: '下载智慧生活，直接加我为好友吧！',
				thumb: 'image/a.png',
				contentUrl: rootUrl + '/jsp/manager/share_user_card?userId=' + uid
			}, function(ret, err) {
				if(ret.status) {
					alert('分享成功');
				} else if(err.code == 2){
					alert('已取消分享');
				} else {
					alert('分享失败');
				}
			});
		} else {
			alert('当前设备未安装微信客户端');
		}
	});
}

//分享二维码到微信朋友圈
function share_QR_wxcommunity() {
	wx.isInstalled(function(ret, err) {
		if(ret.installed) {
			wx.shareWebpage({
				apiKey: '',
				scene: 'timeline',
				title: '难道不想加一波好友吗？',
				description: '下载智慧生活，直接加我为好友吧！',
				thumb: 'image/a.png',
				contentUrl: rootUrl + '/jsp/manager/share_user_card?userId=' + uid
			}, function(ret, err) {
				if(ret.status) {
					alert('分享成功');
				} else if(err.code == 2){
					alert('已取消分享');
				} else {
					alert('分享失败');
				}
			});
		} else {
			alert('当前设备未安装微信客户端');
		}
	});
}

//点击头像换取照片
$$(document).on('click', '#user_info_userImage', function() {
	var buttons1 = [{
		text: '<span style="color:rgb(14, 170, 227)">更换头像</span>',
		onClick: function() {
			api.getPicture({
				sourceType: 'library',
				encodingType: 'jpg',
				mediaValue: 'pic',
				destinationType: 'base64',
				allowEdit: true,
				quality: 50,
				targetWidth: 460,
				saveToPhotoAlbum: false
			}, function(ret, err) {
				if(ret) {
					if(ret.data != '' && ret.data != null){
						var imageUrl = ret.data;
						$$('#user_info_userImage').attr('src', imageUrl);
	
						api.ajax({
							url: rootUrl + '/api/upload',
							method: 'post',
							data: {
								files: {
									file: imageUrl
								}
							}
						}, function(ret, err) {
							if(ret.execStatus == 'true') {
								var imageUrlBase64 = ret.formDataset.saveName;
	
								var _data = {
									script: "managers.om.user_moble.user",
									needTrascation: true,
									funName: "updateHeadPortrait",
									form: "{uid: '" + uid + "',imageUrlBase64: '" + imageUrlBase64 + "'}"
								};
	
								$$.ajax({
									url: rootUrl + "/api/execscript",
									method: 'post',
									dataType: 'json',
									data: _data,
									timeout: 5000,
									success: function(data) {
										if(data.formDataset.checked == 'true') {
											var upassword;
											uimg = imageUrlBase64;
											if(user_obj != null) {
												upassword = user_obj.password;
											}
											var user = new Object();
											user.uid = uid;
											user.omcode = omcode;
											user.username = uname;
											user.password = upassword;
											user.userImg = imageUrlBase64;
											window.localStorage.setItem("om_app_super", JSON.stringify(user));
											toast.show("修改成功");
											im_init();
										} else {
											toast.show("修改失败");
										}
									}
								});
							}
						});
					}
				} else {

				}
			});
		}
	}];
	var buttons2 = [{
		text: '<span style="color:rgb(14, 170, 227)">取消</span>'
	}];
	var groups = [buttons1, buttons2];
	myApp.actions(groups);
});

//编辑页面排序
myApp.onPageAfterAnimation('user_info_edit', function(page) {
	var byId = function(id) {
		return document.getElementById(id);
	};

	// Multi groups
	var sort = Sortable.create(byId('multi'), {
		animation: 150,
		draggable: '.tile',
		handle: '.tile__name'
	});

	[].forEach.call(byId('multi').getElementsByClassName('tile__list'), function(el) {
		Sortable.create(el, {
			group: 'photo',
			animation: 150
		});
	});
});

//编辑个人资料添加图片
$$(document).on('click', '.user_inf_edit_addPhoto', function() {
	var buttons1 = [{
		text: '拍照',
		onClick: function() {
			api.getPicture({
				sourceType: 'camera',
				encodingType: 'jpg',
				mediaValue: 'pic',
				destinationType: 'base64',
				allowEdit: true,
				quality: 50,
				targetWidth: 460,
				saveToPhotoAlbum: true
			}, function(ret, err) {
				if(ret) {
					if(ret.data == '' || ret.data == null) {} else {
						var winWidth = api.winWidth / 4.3;
						var imageUrlInfo = '<img src="' + ret.data + '" style="width: ' + winWidth + 'px; height: ' + winWidth + 'px;-webkit-border-radius: 10px;margin:2px" class="user_info_edit_newImage sharkInfoImage ui-state-default">';
						$$(imageUrlInfo).insertBefore('#user_inf_edit_addPhoto');
						var level = $$('#user_info_edit_level').html();
						var maxPic = level == 0 ? 8 : 16;
						if($$('#user_info_edit_image').find('.sharkInfoImage.ui-state-default').length == maxPic) {
							$$('#user_inf_edit_addPhoto').remove();
						}
					}
				} else {

				}
			});
		}
	}, {
		text: '从手机相册选择',
		onClick: function() {
			api.getPicture({
				sourceType: 'library',
				encodingType: 'jpg',
				mediaValue: 'pic',
				destinationType: 'base64',
				allowEdit: true,
				quality: 50,
				targetWidth: 460,
				saveToPhotoAlbum: false
			}, function(ret, err) {
				if(ret) {
					if(ret.data == '' || ret.data == null) {} else {
						var winWidth = api.winWidth / 4.3;
						var imageUrlInfo = '<img src="' + ret.data + '" style="width: ' + winWidth + 'px; height: ' + winWidth + 'px;-webkit-border-radius: 10px;margin:2px" class="user_info_edit_newImage sharkInfoImage ui-state-default">';
						$$(imageUrlInfo).insertBefore('#user_inf_edit_addPhoto');
						var level = $$('#user_info_edit_level').html();
						var maxPic = level == 0 ? 8 : 16;
						if($$('#user_info_edit_image').find('.sharkInfoImage.ui-state-default').length == maxPic) {
							$$('#user_inf_edit_addPhoto').remove();
						}
					}
				} else {

				}
			});
		}
	}];
	var buttons2 = [{
		text: '取消',
		color: 'red'
	}];
	var groups = [buttons1, buttons2];
	myApp.actions(groups);
});

//编辑排序页面删除图片
$$(document).on('click', '.sharkInfoImage.ui-state-default', function(e) {
	var level = $$('#user_info_edit_level').html();
	var maxPic = level == 0 ? 8 : 16;
	var winWidth = api.winWidth / 4.3;
	var buttons1 = [{
		text: '<span style="color:rgb(14, 170, 227)">删除该图片</span>',
		onClick: function() {
			if($$(e.srcElement).hasClass('user_info_edit_newImage')) {
				$$(e.srcElement).remove();

				if($$('#user_info_edit_image').find('.sharkInfoImage.ui-state-default').length == (maxPic - 1)) {
					$$('#user_edit_img_list').append('<a href="#" class="user_inf_edit_addPhoto" id="user_inf_edit_addPhoto"><img src="image/user/bg_addphoto_press.png" style="width: ' + winWidth + 'px; height: ' + winWidth + 'px;-webkit-border-radius: 10px;margin:2px;"></a>');
				}
			} else {
				var imgId = $$(e.srcElement).attr('id');
				$$(e.srcElement).remove();
				$$('#del_img_space').append('"' + imgId + '",');

				if($$('#user_info_edit_image').find('.sharkInfoImage.ui-state-default').length == (maxPic - 1)) {
					$$('#user_edit_img_list').append('<a href="#" class="user_inf_edit_addPhoto" id="user_inf_edit_addPhoto"><img src="image/user/bg_addphoto_press.png" style="width: ' + winWidth + 'px; height: ' + winWidth + 'px;-webkit-border-radius: 10px;margin:2px;"></a>');
				}
			}
		}
	}, {
		text: '<span style="color:rgb(14, 170, 227)">拍照</span>',
		onClick: function() {
			api.getPicture({
				sourceType: 'camera',
				encodingType: 'jpg',
				mediaValue: 'pic',
				destinationType: 'base64',
				allowEdit: true,
				quality: 50,
				targetWidth: 460,
				saveToPhotoAlbum: true
			}, function(ret, err) {
				if(ret) {
					if(ret.data != '' && ret.data != null){
						if($$(e.srcElement).hasClass('user_info_edit_newImage')) {
							$$(e.srcElement).attr('src', ret.data);
						} else {
							var imgId = $$(e.srcElement).attr('id');
							$$('#del_img_space').append('"' + imgId + '",');
							$$(e.srcElement).attr('src', ret.data);
							$$(e.srcElement).addClass('user_info_edit_newImage');
						}
					}else{}
				} else {}
			});
		}
	}, {
		text: '<span style="color:rgb(14, 170, 227)">从相册选择</span>',
		onClick: function() {
			api.getPicture({
				sourceType: 'album',
				encodingType: 'jpg',
				mediaValue: 'pic',
				destinationType: 'base64',
				allowEdit: true,
				quality: 50,
				targetWidth: 460,
				saveToPhotoAlbum: true
			}, function(ret, err) {
				if(ret) {
					if(ret.data != '' && ret.data != null){
						if($$(e.srcElement).hasClass('user_info_edit_newImage')) {
							$$(e.srcElement).attr('src', ret.data);
						} else {
							var imgId = $$(e.srcElement).attr('id');
							$$('#del_img_space').append('"' + imgId + '",');
							$$(e.srcElement).attr('src', ret.data);
							$$(e.srcElement).addClass('user_info_edit_newImage');
						}
					}else{}
				} else {}
			});
		}
	}];
	var buttons2 = [{
		text: '<span style="color:rgb(14, 170, 227)">取消</span>'
	}];
	var groups = [buttons1, buttons2];
	myApp.actions(groups);
});