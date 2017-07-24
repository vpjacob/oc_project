//个人信息主页数据填充
function init_user_info_data(userInfo, visitnum, dynamicnum, images) {
	var datauser = JSON.parse(userInfo);
	var dataimage = JSON.parse(images);
	$$('#user_info_userName').html(datauser.c_user_name);
	$$('#user_info_userCode').html('哦脉号:' + datauser.c_user_code);
	$$('#user_level_name').html(datauser.c_level_name);

	$$('#user_info_viewInfo_link').attr('href', 'html/user/userinfo_view.html?type=2&userID=' + uid);
	$$('#collection_link').attr('href', 'html/user/user_collection.html');
	if(datauser.c_user_qrcode != null && datauser.c_user_qrcode != '') {
		$$('#QR_code').html(datauser.c_user_qrcode);
	} else {
		Auto517.FNScanner.encodeImg(uid, function(QRcode) {
			api.ajax({
				url: rootUrl + '/api/upload',
				method: 'post',
				data: {
					files: {
						file: QRcode.imgPath
					}
				}
			}, function(ret, err) {
				if(ret.execStatus == 'true') {
					var imageUrlBase64 = ret.formDataset.saveName;
					api.sendEvent({
						name: 'QRcode',
						extra: imageUrlBase64
					});
				}
			});
		});

		api.addEventListener({
			name: 'QRcode'
		}, function(ret, err) {
			if(ret.value != '') {
				var _data = {
					script: "managers.om.user_moble.user",
					needTrascation: true,
					funName: "updateQRcode",
					form: "{uid: '" + uid + "',imageUrlBase64: '" + ret.value + "'}"
				};

				$$.ajax({
					url: rootUrl + "/api/execscript",
					method: 'post',
					dataType: 'json',
					data: _data,
					timeout: 5000,
					success: function(data) {
						if(data.formDataset.checked == 'true') {
							$$('#QR_code').html(ret.value);
						} else {
							myApp.toast('二维码生成失败');
						}
					}
				});
			}
		});
	}

	//谁看过我
	if(visitnum > 0) {
		$$('#user_info_visitorNum').html(visitnum);
	}

	$$('#user_info_userImage').attr('src', rootUrl + datauser.c_user_image);

	//动态信息
	if(dynamicnum > 0) {
		$$('#user_info_dynamicNum').html(dynamicnum);
		$$('#user_info_dynamic_none_link').attr('style', 'display:none;')
		$$('#user_info_dynamic_have_link').attr('href', 'html/user/userinfo_dynamic.html?userID=' + uid);
	} else {
		$$('#user_info_dynamic_have_link').attr('style', 'display:none;')
		$$('#user_info_dynamic_none_link').attr('href', 'html/user/userinfo_dynamic.html?userID=' + uid);
	}
	if(dataimage.length > 0) {
		var imggroup = '';
		for(var i = 0; i < dataimage.length; i++) {
			imggroup += '<img src="' + rootUrl + dataimage[i].c_dynamic_image + '" class="imageList " />';
		}
		$$('#user_info_dynamicImage').html(imggroup);
	}
}

//个人动态信息
function init_user_dynamic(userID) {

	var _data = {
		script: "managers.om.nearby.nearby",
		needTrascation: false,
		funName: "getUserDynamic",
		form: "{userID: '" + userID + "',uid:'" + uid + "'}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		data: _data,
		dataType: 'json',
		type: 'get',

		success: function(data) {
			Auto517.UIChatbox.im_getEmotionPaths(function(emotion) {
				_im_emotionData = emotion;
			});
			var userDynamic = data.datasources[0].rows;
			var data_comment = data.datasources[1].rows; 
			if(userDynamic.length > 0) {
				$$('#user_inf_dynamic_content').html('');
				for(var i = 0; i < userDynamic.length; i++) {
					var obj = userDynamic[i];

					var c_login_time = obj.c_login_time;
					if(parseInt(c_login_time) / 60 > 1 && parseInt(c_login_time) / 60 < 24) {
						c_login_time = Math.floor(parseInt(c_login_time) / 60) + '小时前';
					} else if(parseInt(c_login_time) / 60 >= 24) {
						c_login_time = Math.floor(parseInt(c_login_time) / (60 * 24)) + '天前';
					} else {
						c_login_time = (c_login_time == 0 ? 1 : c_login_time) + '分钟前';
					}

					var template = '';
					//评论
					var dynamicComment='';
					var flag=0;
					dynamicComment+='<div class="comment">';
					for(var j=0;j<data_comment.length;j++){
							if(data_comment[j].dynamicid==obj.c_id ){
								dynamicComment+='<div class="list-block" style="margin-top:0px;margin-bottom:0px;margin-left:15%;margin-right:20px;padding:0px;background-color:#F3F3F5;line-height:25px;">';
								dynamicComment+=	'<ul >';
								dynamicComment+='			<li style="border-bottom:1px;">';
								dynamicComment+='	          <div class="item-title" style="font-size:14px;padding:0px;margin:0px;white-space:normal;"><span style="color:#0EAAE3;">'+data_comment[j].c_user_name+':</span>&nbsp;&nbsp;<span>'+window.Auto517.UIChatbox._im_transText(data_comment[j].c_comment_content)+'<span ></div>';
								dynamicComment+='	          </li>' ;
								dynamicComment+='	         </ul>';
								dynamicComment+='	        </div>';
								flag++;
							}
							
					}
					
					dynamicComment+='</div>';
					//动态
					template += '<div id="' + obj.c_id + '" class="content-block" style="padding: 0;margin-top: 0px;margin-bottom: 2px;"  >';
					template += '				<div  class="card" style="margin: 1px;box-shadow: none;padding-bottom:5px;">';
					if(obj.c_dynamic_essence == 0) {
						template += '               <div class="userImage-1">';
						template += '					<img src="image/community/communityjing.png" style="width: 100%;" />';
						template += '				</div><br />';
					}
					template += '					<div class="card-header card-header-frist"  >';
					template += '						<div class="facebook-avatar" >';
					template += '							<img src="' + rootUrl + obj.c_user_image + '" style="width:' + 15 + 'vw;height:' + 15 + 'vw;">';
					template += '						</div>';
					template += '						<div class="item-inner" style="position: absolute;left: 20%;top: 15%;" >';
					template += '							<div class="item-title-row">';
					template += '								<div class="item-title"><span>' + obj.c_user_name + '</span></div>';
					template += '							</div>';
					template += '							<div class="item-subtitle">';
					if(parseInt(obj.c_user_gender) == 1) {
						template += '								<div class="communityDetal-mars" style="height:12px;margin-top: 1px;">';
						template += '<i class="icon icon-mars community-mars-icon" style="color: white;font-size: 10px;margin-top:1px;display:block;text-align:center;"></i>';
					} else {
						template += '								<div class="communityDetal-mars" style="height:12px;margin-top: 1px;background-color: #FA94AA;">';
						template += '<i class="icon icon-venus community-mars-icon" style="color: white;font-size: 10px;margin-top:1px;display:block;text-align:center;"></i>';
					}
					template += '									<span style="color: white;font-size: 10px;text-align:center;display:block;">' + obj.c_user_age + '</span>';
					template += '								</div>';
					template += '								<div class="communityDetal-vip">';
					template += '									<img src="' + obj.c_level_image + '" width="100%" style="height: 12px;margin-bottom: 3px;">';
					template += '							</div>';
					template += '							</div>';
					template += '						</div>';
					template += '						<div class="facebook-date facebook-dateafter r_float" onclick="notFunOrReport(\'' + obj.c_id + '\',\'' + obj.c_user_id + '\');">' + c_login_time + '</div>';
					template += '						<i class="icon-angle-down" ></i>';
					template += '					</div>';
					template += '					<a href="#" onclick="evaClick(\'' + obj.c_id + '\',\'' + obj.c_user_id + '\',2);"><div class="card-content">';
					template += '						<div class="card-content-inner" style="color: #A2A2A2;font-size: 14px;padding-left: 5px;padding-right: 5px;">';
					template += '							<p style="word-break: break-all">' + Auto517.UIChatbox._im_transText(obj.c_dynamic_content) + '</p>';

					var arrImage = new Array();
					if(obj.c_dynamic_image != null && obj.c_dynamic_image != '') {
						var dynamicImages = obj.c_dynamic_image.split(',');
						for(var j = 0; j < (dynamicImages.length > 3 ? 3 : dynamicImages.length); j++) {
							// 创建对象  
							var img = new Image();
							img.src = api.cacheDir + "/nearby/pic" + dynamicImages[j].substring(dynamicImages[j].lastIndexOf('/'));
							if(img.width == 0) {
								img.src = rootUrl + dynamicImages[j];
							}
							var classKey = 'dyImgPositionE';
							var winWidth = api.winWidth / 4 - 5;
							template += '<div class="dyImg" style="width: ' + winWidth + 'px;height: ' + winWidth + 'px;display: inline-block;text-align: center;margin-right: 2px;">';
							template += '<img class="' + classKey + '" width=' + winWidth + 'px height=' + winWidth + 'px src="' + rootUrl + dynamicImages[j] + '" ></div>';
						}
					}

					template += '						</div>';
					template += '					</div></a>';
					template += '					<div class="card-footer" style="padding-bottom: 2px;padding-left: 5px;padding-right: 5px;">';
					template += '						<div class="card-footer-title">';
					template += '							<span>' + obj.distance + 'km</span>&nbsp;';
					template += '							<span>' + obj.c_read + '阅读</span>';

					if(obj.c_user_id == uid) {

						template += '&nbsp;<a href="#" class="confirm-title-ok" onclick="user_info_deleteSelfDynamic(\'' + obj.c_id + '\');"><span style="color:#0EAAE3">删除</span></a>';

					}
					template += '						</div>';
					template += '						<div class="">';
					if(parseInt(obj.c_user_praise) > 0) {
						template += '							<i class="icon-thumbs-up" onclick="clickThumbs(this,\'' + obj.c_id + '\')"></i>';
					} else {
						template += '							<i class="icon-thumbs-up-alt"  onclick="clickThumbs(this,\'' + obj.c_id + '\')"></i>';
					}
					if(obj.c_praise > 0) {
						template += '							<span>' + obj.c_praise + '</span>&nbsp;&nbsp;&nbsp;&nbsp;';
					} else {
						template += '							<span>赞</span>&nbsp;&nbsp;&nbsp;&nbsp;';
					}
					template += '							<a href="#" data-ids="'+obj.c_id+'" class="discuss" style="color:#D3D3D5">';
					template += '							<i class="icon-flickr" ></i>';
					template += '							<span>'+flag+'&nbsp;&nbsp;&nbsp;&nbsp;</span>';
					template += '							</a>'
					template += '						</div>';
					template += '					</div>';
					template += dynamicComment;
					template += '				</div>';
					template += '		</div>';

					$$('#user_inf_dynamic_content').append(template);
				}
			}
		}
	});
}

//查看个人信息
function init_user_info_view_data(user_info, type) {
	var userInfo = user_info.datasources[0].rows;
	$$('#user_info_view_userName').html(userInfo[0].c_user_name);
	if(parseInt(userInfo[0].c_user_gender) == 1) {
		$$('#user_info_view_gender').attr('src', 'image/nearby/ic_user_male.png');
		$$('#user_info_view_mainDiv').attr('style', 'width: 40px;height: 13px;background-color: #8BC6FE;-moz-border-radius: 8px; -webkit-border-radius: 8px; border-radius:8px;');
	} else {
		$$('#user_info_view_gender').attr('src', 'image/nearby/ic_user_famale.png');
		$$('#user_info_view_mainDiv').attr('style', 'width: 40px;height: 13px;background-color: #F394A9;-moz-border-radius: 8px; -webkit-border-radius: 8px; border-radius:8px;');
	}
	$$('#user_info_view_age').html(userInfo[0].c_user_age);
	$$('#user_info_view_con').html(userInfo[0].c_user_con);
	if(userInfo[0].c_level_name != '普通用户') {
		$$('#vipImage').attr('src', user_info.datasources[0].rows[0].c_level_image);
		$$('#vipImage').css('width', '70%');
		$$('#vipSign').html('');
	}
	//用户图片
	var userImage = user_info.datasources[1].rows;

	var arrImage = new Array();
	var user_info_image = ''
	user_info_image += '<div class="swiper-slide">';
	var winWidth = api.winWidth / 4.3;

	if(userImage.length > 0) {
		for(var i = 0; i < userImage.length; i++) {
			var obj = userImage[i];

			arrImage[i] = rootUrl + obj.c_image_url;
			user_info_image += '<img class="user_inf_view_imageView" src=\"' + rootUrl + obj.c_image_url + '\"  style="width: ' + winWidth + 'px; height: ' + winWidth + 'px;-webkit-border-radius: 10px;margin:2px" onclick = "user_info_view_showImage(' + i + ');">';
			if(userImage.length > 8 && i % 8 == 7) {
				user_info_image += '</div><div class="swiper-slide">';
			}
		}
	}

	user_info_image += '</div>';
	$$('#user_info_view_image').html('');
	$$('#user_info_view_image').append(user_info_image);

	user_info_view_showImage = function(num) {
		Auto517.photoBrowser._photoBrowser_open(arrImage, num);
	};

	if(user_info.datasources[2].rows[0].dynamicnum > 0) {
		$$('#user_info_view_dynamicNum').html(user_info.datasources[2].rows[0].dynamicnum);
		var dynamicImage = user_info.datasources[3].rows;
		$$('#user_info_view_dynamicImage').html('');
		if(dynamicImage.length > 0) {
			for(var i = 0; i < dynamicImage.length; i++) {
				var obj = dynamicImage[i];
				$$('#user_info_view_dynamicImage').append('<img src="' + rootUrl + obj.c_dynamic_image + '" class="imageList " />');
			}
		}
	} else {
		$$('#user_info_view_dynamic_div').hide();
	}

	$$('#user_info_view_dynamic_link').attr('href', 'html/user/userinfo_dynamic.html?type=2&userID=' + userInfo[0].c_user_id);

	var userKeyWord = user_info.datasources[4].rows;
	if(userKeyWord.length > 0) {
		$$('#user_info_view_keyWord').html('');
		for(var i = 0; i < userKeyWord.length; i++) {
			$$('#user_info_view_keyWord').append('<div class="key-keyword-search" style="font-size: 0.8em;margin: 2px;"><span style="padding:5px;">' + userKeyWord[i].c_key_keyword + '</span></div>');
		}
	}

	$$('#user_info_view_sign').html(userInfo[0].c_user_sign);
	$$('#user_info_view_emstate').html(userInfo[0].c_user_emstate);
	$$('#user_info_view_home').html(userInfo[0].c_user_home);
//	$$('#user_info_view_code').html(userInfo[0].c_user_code);
	$$('#user_info_view_area').html(userInfo[0].c_user_area);
	$$('#user_info_view_remark').html(userInfo[0].c_user_remark);
	$$('#user_info_view_relation').html(userInfo[0].c_relation);
	$$('#user_inf_view_createTime').html(userInfo[0].c_user_createtimef);
	//判断是否被关注过，如果关注过就要隐藏关注按钮
	if(userInfo[0].c_rel_type == null) {
		$$("#follow").css('display', 'block');

	} else {
		$$("#follow").css('display', 'none');
	}
	$$('#user_info_view_follow').attr('onclick', 'user_info_follow(\'' + userInfo[0].c_user_id + '\');');
	$$('#user_info_view_report').attr('onclick', 'user_info_Report(\'' + userInfo[0].c_user_id + '\',' + type + ');');
	//add by cuikai
	//alert(JSON.stringify(userInfo));
	var personId = $$("#personId").val();
	$$('#user_info_view_chat').attr('onclick', 'user_info_chat(\'' + userInfo[0].c_user_id + '\',1,\'' + userInfo[0].c_user_name + '\',0,0);');

	var mySwiper = new Swiper('#user_info_view .swiper-container', {
		pagination: '.swiper-pagination',
		speed: 400,
		spaceBetween: 100
	});

}

//谁看过我
function int_user_info_visitorList() {
	var _data = {
		script: "managers.om.user_moble.user",
		needTrascation: false,
		funName: "visitorlist",
		form: "{userID: '" + uid + "'}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		timeout: 5000,
		success: function(data) {
			var visitorlist = data.datasources[0].rows;

			$$('#user_info_visitor_number').html('资料(' + data.datasources[1].rows[0].c_visitornum + ')');
			$$('#user_info_visitor_dynamic_number').html('动态(' + data.datasources[2].rows[0].c_dynamicnum + ')');

			$$('#user_info_visitor_list').html('');
			if(visitorlist.length > 0) {
				for(var i = 0; i < visitorlist.length; i++) {
					var obj = visitorlist[i];

					var user_image = rootUrl + obj.c_user_image;
					var user_gender = '';
					if(obj.c_user_gender == '1') {
						user_gender = 'image/nearby/ic_user_male.png';
					} else {
						user_gender = 'image/nearby/ic_user_famale.png';
					}
					var user_vipImage = obj.c_level_image;

					var user_visitorTime = obj.c_visitor_time;
					if(parseInt(user_visitorTime) / 60 > 1 && parseInt(user_visitorTime) / 60 < 24) {
						user_visitorTime = Math.round(parseInt(user_visitorTime) / 60) + '小时前';
					} else if(parseInt(user_visitorTime) / 60 >= 24) {
						user_visitorTime = Math.round(parseInt(user_visitorTime) / (60 * 24)) + '天前';
					} else {
						user_visitorTime = user_visitorTime + '分钟前';
					}
					user_visitorTime = user_visitorTime + '看过我的资料';

					var user_loginTime = obj.c_login_time;
					if(parseInt(user_loginTime) / 60 > 1 && parseInt(user_loginTime) / 60 < 24) {
						user_loginTime = Math.round(parseInt(user_loginTime) / 60) + '小时前';
					} else if(parseInt(user_loginTime) / 60 >= 24) {
						user_loginTime = Math.round(parseInt(user_loginTime) / (60 * 24)) + '天前';
					} else {
						user_loginTime = user_loginTime + '分钟前';
					}

					var template = '';
					template += '<li>';
					template += '	<a href="html/user/userinfo_view.html?type=1&userID=' + obj.c_user_id + '" class="item-link">';
					template += '		<div class="item-content" style="padding-top: 10px;padding-left: 5px;">';
					template += '			<div class="item-media" style="border-radius: 5px;padding: 0px;">';
					template += '				<img src="' + user_image + '" style="width: 80px;height: 80px;">';
					template += '			</div>';
					template += '			<div class="item-inner" style="padding: 1px;">';
					template += '				<div class="item-title-row" style="background-image: none;">';
					template += '					<div class="item-title"><span style="float: left;font-size: 15px;font-weight: 300;">' + obj.c_user_name + '</span></div>';
					template += '					<div class="item-after"><span>' + user_loginTime + '登陆过</span></div>';
					template += '				</div>';
					template += '				<div class="item-subtitle">';
					template += '					<div class="sex sex-bgc' + obj.c_user_gender + ' l_float">';
					template += '						<img class="img1" src="' + user_gender + '" /><span>' + obj.c_user_age + '</span>';
					template += '					</div>';
					template += '					<div class="l_float">';
					template += '						<img class="img2" src="' + user_vipImage + '" />';
					template += '					</div>';
					template += '				</div>';
					template += '				<div class="item-text"><span>' + user_visitorTime + '</span></div>';
					template += '			</div>';
					template += '		</div>';
					template += '	</a>';
					template += '</li>';

					$$('#user_info_visitor_list').append(template);
				}
			}
		},
		error: function(xhr, type) {
			alert("请求失败");
		}
	});
}

//谁看过我的动态
function int_user_info_visitorDynamic() {
	var _data = {
		script: "managers.om.user_moble.user",
		needTrascation: false,
		funName: "visitordynamic",
		form: "{userID: '" + uid + "'}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		timeout: 5000,
		success: function(data) {
			var visitordynamic = data.datasources[0].rows;

			$$('#user_info_visitor_number').html('资料(' + data.datasources[1].rows[0].c_visitornum + ')');
			$$('#user_info_visitor_dynamic_number').html('动态(' + data.datasources[2].rows[0].c_dynamicnum + ')');

			$$('#user_info_visitor_dynamic').html('');
			if(visitordynamic.length > 0) {
				for(var i = 0; i < visitordynamic.length; i++) {
					var obj = visitordynamic[i];

					var user_image = rootUrl + obj.c_user_image;
					var user_gender = '';
					if(obj.c_user_gender == '1') {
						user_gender = 'image/nearby/ic_user_male.png';
					} else {
						user_gender = 'image/nearby/ic_user_famale.png';
					}
					var user_vipImage = obj.c_level_image;

					var user_visitorTime = obj.c_visitor_time;
					if(parseInt(user_visitorTime) / 60 > 1 && parseInt(user_visitorTime) / 60 < 24) {
						user_visitorTime = Math.round(parseInt(user_visitorTime) / 60) + '小时前';
					} else if(parseInt(user_visitorTime) / 60 >= 24) {
						user_visitorTime = Math.round(parseInt(user_visitorTime) / (60 * 24)) + '天前';
					} else {
						user_visitorTime = user_visitorTime + '分钟前';
					}
					user_visitorTime = user_visitorTime + '看过我的动态';

					var user_loginTime = obj.c_login_time;
					if(parseInt(user_loginTime) / 60 > 1 && parseInt(user_loginTime) / 60 < 24) {
						user_loginTime = Math.round(parseInt(user_loginTime) / 60) + '小时前';
					} else if(parseInt(user_loginTime) / 60 >= 24) {
						user_loginTime = Math.round(parseInt(user_loginTime) / (60 * 24)) + '天前';
					} else {
						user_loginTime = user_loginTime + '分钟前';
					}

					var template = '';
					template += '<li>';
					template += '	<a href="html/user/userinfo_view.html?type=1&userID=' + obj.c_user_id + '" class="item-link">';
					template += '		<div class="item-content" style="padding-top: 10px;padding-left: 5px;">';
					template += '			<div class="item-media" style="border-radius: 5px;padding: 0px;">';
					template += '				<img src="' + user_image + '" style="width: 80px;height: 80px;">';
					template += '			</div>';
					template += '			<div class="item-inner" style="padding: 1px;">';
					template += '				<div class="item-title-row" style="background-image: none;">';
					template += '					<div class="item-title"><span style="float: left;font-size: 15px;font-weight: 300;">' + obj.c_user_name + '</span></div>';
					template += '					<div class="item-after"><span>' + user_loginTime + '登陆过</span></div>';
					template += '				</div>';
					template += '				<div class="item-subtitle">';
					template += '					<div class="sex sex-bgc' + obj.c_user_gender + ' l_float">';
					template += '						<img class="img1" src="' + user_gender + '" /><span>' + obj.c_user_age + '</span>';
					template += '					</div>';
					template += '					<div class="l_float">';
					template += '						<img class="img2" src="' + user_vipImage + '" />';
					template += '					</div>';
					template += '				</div>';
					template += '				<div class="item-text"><span>' + user_visitorTime + '</span></div>';
					template += '			</div>';
					template += '		</div>';
					template += '	</a>';
					template += '</li>';

					$$('#user_info_visitor_dynamic').append(template);
				}
			}
		},
		error: function(xhr, type) {
			alert("请求失败");
		}
	});
}

//修改个人详细信息数据加载
function init_user_info_edit_data(data,type) {
	var resultbase = data.datasources[0].rows[0];
	var winWidth = api.winWidth / 4.3;
	
	$$('#user_info_edit_userName').html(resultbase.c_user_name);
	$$('#user_info_edit_level').html(resultbase.c_level_code);
	$$('#user_info_edit_userName_link').attr('href', 'html/user/userinfo_edit_username.html?value=' + resultbase.c_user_name);
	if(parseInt(resultbase.c_user_gender) == 1) {
		$$('#user_info_view_gender').attr('src', 'image/nearby/ic_user_male.png');
	} else {
		$$('#user_info_view_gender').attr('src', 'image/nearby/ic_user_famale.png');
	}
	$$('#user_info_edit_age').html(resultbase.c_user_age);
	$$('#user_info_edit_astro').html(resultbase.c_user_con);
	$$('#user_info_edit_brithday').html(resultbase.c_user_birthday);
	$$('#user_info_edit_age_link').attr('href', 'html/user/userinfo_edit_age.html?value=' + resultbase.c_user_birthday);

	var resultuserimage = data.datasources[1].rows;
	var user_info_image = '<div class="tile__list" id="user_edit_img_list">';
	for(var i = 0; i < resultuserimage.length; i++) {
		user_info_image += '<img src="' + rootUrl + resultuserimage[i].c_image_url + '" style="width: ' + winWidth + 'px; height: ' + winWidth + 'px;-webkit-border-radius: 10px;margin:2px;" class="sharkInfoImage ui-state-default" id="' + resultuserimage[i].c_image_id + '">';
	}
	if(resultbase.c_level_code == 0 && resultuserimage.length < 8) {
		user_info_image += '<a href="#" class="user_inf_edit_addPhoto" id="user_inf_edit_addPhoto"><img src="image/user/bg_addphoto_press.png" style="width: ' + winWidth + 'px; height: ' + winWidth + 'px;-webkit-border-radius: 10px;margin:2px;"></a>';
	} else if(resultbase.c_level_code != 0 && resultuserimage.length < 16) {
		user_info_image += '<a href="#" class="user_inf_edit_addPhoto" id="user_inf_edit_addPhoto"><img src="image/user/bg_addphoto_press.png" style="width: ' + winWidth + 'px; height: ' + winWidth + 'px;-webkit-border-radius: 10px;margin:2px;"></a>';
	}
	user_info_image += '</div>';
	$$('#user_info_edit_image').append(user_info_image);

	if(type == '1') {
		var userKeyWord = data.datasources[2].rows;
		var userKeyWords = '';
		if(userKeyWord.length > 0) {
			for(var i = 0; i < userKeyWord.length; i++) {
				$$('#user_info_edit_keyword').append('<div class="key-keyword-search" style="font-size: 0.8em;margin: 2px 2px;"><span style="padding:5px;">' + userKeyWord[i].c_key_keyword + '</span></div>');
				userKeyWords += userKeyWord[i].c_key_keyword + ',';
			}
		}
		$$('#user_info_edit_keyword_link').attr('href', 'html/user/userinfo_edit_key.html?value=' + userKeyWords);
		$$('#user_info_edit_keywords').html(userKeyWords);
	} else {
		var userKeyWord = type.split(',');
		var userKeyWords = '';
		$$('#user_info_edit_keyword').html('');
		if(userKeyWord.length > 0) {
			for(var i = 0; i < userKeyWord.length; i++) {
				if(userKeyWord[i] != '' && userKeyWord != null) {
					$$('#user_info_edit_keyword').append('<div class="key-keyword-search" style="font-size: 0.8em;margin: 2px 2px;"><span style="padding:5px;">' + userKeyWord[i] + '</span></div>');
					userKeyWords += userKeyWord[i] + ',';
				}
			}
		}
		$$('#user_info_edit_keyword_link').attr('href', 'html/user/userinfo_edit_key.html?value=' + userKeyWords);
		$$('#user_info_edit_keywords').html(userKeyWords);
	}

	$$('#user_info_edit_sign').html(resultbase.c_user_sign);
	$$('#user_info_edit_sign_link').attr('href', 'html/user/userinfo_edit_sign.html?value=' + resultbase.c_user_sign);
	$$('#user_info_edit_emstate').html(resultbase.c_user_emstate);
	$$('#user_info_edit_home').html(resultbase.c_user_home);
	$$('#user_info_edit_area').html(resultbase.c_user_area);
	$$('#user_info_edit_area_link').attr('href', 'html/user/userinfo_edit_area.html?value=' + resultbase.c_user_area);
	$$('#user_info_edit_remark').html(resultbase.c_user_remark);
	$$('#user_info_edit_remark_link').attr('href', 'html/user/userinfo_edit_explain.html?value=' + resultbase.c_user_remark);
}

//用户黑名单列表
function init_user_setting_blackList() {

	var _data = {
		script: "managers.om.user_moble.user",
		needTrascation: false,
		funName: "getDefriendList",
		form: "{userID: '" + uid + "'}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		timeout: 5000,
		success: function(data) {
			var defriend = data.datasources[0].rows;
			if(defriend.length > 0) {
				for(var i = 0; i < defriend.length; i++) {
					var template = "";
					template += '<li class="item-content swipeout" style="padding-left: 2px;">';
					template += '					<div class="item-media" style="padding: 1px;"><img src="' + rootUrl + defriend[i].c_user_image + '" style="width: 50px;height:50px;border-radius: 10%;"></div>';
					template += '					<div class="item-inner" style="padding: 1px;margin-left: 5px;">';
					template += '						<div class="item-title-row">';
					template += '							<div class="item-title" style="padding-top: 0px;font-size: 14px;font-weight:300;">' + defriend[i].c_user_name + '</div>';
					template += '						</div>';
					template += '						<div class="item-text" style="padding-top: 10px;height: 25px;font-size: 14px;">拉黑时间:' + defriend[i].c_in_time + '</div>';
					template += '					</div>';
					template += '					<div class="swipeout-actions-right">';
					template += '						<a  href="#" class="swipeout-delete"  data-confirm="移除黑名单后，可以收到对方发来的消息，是否确认？" data-confirm-title="移除黑名单" data-id="' + defriend[i].c_user_id + '" style="font-size: 16px;">解除</a>';
					template += '					</div>';
					template += '				</li>';

					$$('#user_setting_blackList').append(template);
				}
			}
		},
		error: function(xhr, type) {
			alert("请求失败");
		}
	});
}

//发布动态个人动态列表加载
function user_dynamic_add(userDynamic) {
	if(userDynamic.length > 0) {
		for(var i = 0; i < userDynamic.length; i++) {
			var obj = userDynamic[i];
			var creatTime = obj.creattime;
			if(parseInt(creatTime) / 60 > 1 && parseInt(creatTime) / 60 < 24) {
				creatTime = Math.floor(parseInt(creatTime) / 60) + '小时前';
			} else if(parseInt(creatTime) / 60 >= 24) {
				creatTime = Math.floor(parseInt(creatTime) / (60 * 24)) + '天前';
			} else {
				creatTime = (creatTime == 0 ? 1 : creatTime) + '分钟前';
			}
			var content = Auto517.UIChatbox._im_transText(obj.content);
			var template = '';
			template += '<div id="' + obj.id + '" class="content-block" style="padding: 0;margin-top: 0px;margin-bottom: 2px;">';
			template += '				<div class="card" style="margin: 1px;box-shadow: none;">';
			template += '					<div class="card-header card-header-frist">';
			template += '						<div class="facebook-avatar">';
			template += '							<img src="' + rootUrl + obj.userimage + '" style="width:' + 15 + 'vw;height:' + 15 + 'vw;">';
			template += '						</div>';
			template += '						<div class="item-inner" style="position: absolute;left: 20%;top: 15%;">';
			template += '							<div class="item-title-row">';
			template += '								<div class="item-title"><span>' + obj.username + '</span></div>';
			template += '							</div>';
			template += '							<div class="item-subtitle">';
			if(parseInt(obj.gender) == 1) {
				template += '								<div class="communityDetal-mars" style="height:12px;margin-top: 1px;">';
				template += '<i class="icon icon-mars community-mars-icon" style="color: white;font-size: 10px;margin-top:1px;display:block;text-align:center;"></i>';
			} else {
				template += '								<div class="communityDetal-mars" style="height:12px;margin-top: 1px;background-color: #FA94AA;">';
				template += '<i class="icon icon-venus community-mars-icon" style="color: white;font-size: 10px;margin-top:1px;display:block;text-align:center;"></i>';
			}
			template += '									<span style="color: white;font-size: 10px;text-align:center;display:block;">' + obj.age + '</span>';
			template += '								</div>';
			template += '								<div class="communityDetal-vip">';
			template += '									<img src="' + obj.userlevel + '" width="100%" style="height: 12px;margin-bottom: 3px;">';
			template += '							</div>';
			template += '							</div>';
			template += '						</div>';
			template += '						<div class="facebook-date facebook-dateafter r_float">' + creatTime + '</div>';
			template += '						<i class="icon-angle-down"></i>';
			template += '					</div>';
			template += '					<div class="card-content">';
			template += '						<div class="card-content-inner" style="color: #A2A2A2;font-size: 14px;padding-left: 5px;padding-right: 5px;">';
			template += '							<p>' + content + '</p>';

			var arrImage = new Array();
			if(obj.dynamicimage != null && obj.dynamicimage != '') {
				var dynamicImages = obj.dynamicimage.split(',');
				for(var j = 0; j < (dynamicImages.length > 3 ? 3 : dynamicImages.length); j++) {
					// 创建对象
					var img = new Image();
					img.src = dynamicImages[j];
					var cssKey = 'width';
					var classKey = 'dyImgPositionW';
					if(img.width > img.height) {
						cssKey = 'height';
						classKey = 'dyImgPositionH';
					}
					if(img.width == img.height) {
						classKey = 'dyImgPositionE';
					}
					template += '<div class="dyImg" style="width: 25vw;height: 25vw;display: inline-block;text-align: center;margin-right: 2px;">';
					template += '<img class="' + classKey + '" ' + cssKey + '="100%" src="' + dynamicImages[j] + '" onclick="openPhoneBrowser(\'' + obj.id + '\',' + j + ');"></div>';
				}
			}
			template += '						</div>';
			template += '					</div>';
			template += '					<div class="card-footer" style="padding-bottom: 2px;padding-left: 5px;padding-right: 5px;">';
			template += '						<div class="card-footer-title">';
			template += '							<span>0km</span>&nbsp;';
			template += '							<span>' + obj.readnum + '阅读</span>';
			if(obj.dyUserId == uid) {

				template += '&nbsp;<a href="#" class="confirm-title-ok" onclick="user_info_deleteSelfDynamic(\'' + obj.id + '\');"><span style="color:#0EAAE3">删除</span></a>'

			}
			template += '						</div>';
			template += '						<div class="">';
			if(parseInt(obj.praise) > 0) {
				template += '							<i class="icon-thumbs-up" onclick="clickThumbs(this,\'' + obj.id + '\')"></i>';
			} else {
				template += '							<i class="icon-thumbs-up-alt" onclick="clickThumbs(this,\'' + obj.id + '\')"></i>';
			}

			template += '							<span>' + obj.praise + '</span>&nbsp;&nbsp;&nbsp;&nbsp;';
			template += '							<i class="icon-flickr" onclick="evaClick(\'' + obj.id + '\');"></i>';
			template += '							<span>评论</span>';
			template += '						</div>';
			template += '					</div>';
			template += '				</div>';
			template += '		</div>';
			$$('#user_inf_dynamic_content').prepend(template);
		}
	}
}

//收藏列表加载
function showCollectionList(data) {
	Auto517.UIChatbox.im_getEmotionPaths(function(emotion) {
		_im_emotionData = emotion;
	});
	var collectionlist = data.datasources[0].rows;
	var template = '';
	var winWidth = api.winWidth / 4 - 5;
	if(collectionlist.length > 0) {
		if(collectionlist.length < 20) {
			myApp.detachInfiniteScroll($$('#collection_page'));
			$$('#loading_more').css('display', 'none');
		}
		for(var i = 0; i < collectionlist.length; i++) {
			var obj = collectionlist[i];
			var content = window.Auto517.UIChatbox._im_transText(obj.c_dynamic_content);
			template += '<div id="' + obj.c_id + '" class="content-block" style="padding: 0;margin-top: 0px;margin-bottom: 2px;">';
			template += '	<div class="card facebook-card" style="margin: 1px;box-shadow: none;">';
			template += '		<div class="card-header card-header-frist">';
			template += '			<div class="facebook-avatar">';
			template += '				<img src="' + rootUrl + obj.c_user_image + '" style="width:15vw;height:15vw;">';
			template += '			</div>';
			template += '			<div class="item-inner" style="position: absolute;left: 20%;top: 15%;">';
			template += '				<div class="item-title-row">';
			template += '					<div class="item-title"><span>' + obj.c_user_name + '</span></div>';
			template += '				</div>';
			template += '				<div class="item-subtitle">';
			if(parseInt(obj.c_user_gender) == 1) {
				template += '				<div class="communityDetal-mars" style="height:12px;margin-top: 1px;">';
				template += '					<i class="icon icon-mars community-mars-icon" style="color: white;font-size: 10px;margin-top:1px;display:block;text-align:center;"></i>';
			} else {
				template += '				<div class="communityDetal-mars" style="height:12px;margin-top: 1px;background-color: #FA94AA;">';
				template += '					<i class="icon icon-venus community-mars-icon" style="color: white;font-size: 10px;margin-top:1px;display:block;text-align:center;"></i>';
			}
			template += '						<span style="color: white;font-size: 10px;text-align:center;display:block;">' + obj.c_user_age + '</span>';
			template += '					</div>';
			template += '					<div class="communityDetal-vip">';
			template += '						<img src="' + obj.c_level_image + '" width="100%" style="height: 12px;margin-bottom: 3px;">';
			template += '					</div>';
			template += '				</div>';
			template += '			</div>';
			template += '			<div class="facebook-date facebook-dateafter r_float" onclick="removeCollection(\'' + obj.c_id + '\');">移除</div>';
			template += '		</div>';
			template += '		<div class="card-content">';
			template += '			<div class="card-content-inner" style="color: #A2A2A2;font-size: 14px;padding-left: 5px;padding-right: 5px;">';
			template += '				<p>' + content + '</p>';

			if(obj.dynamicimage != null && obj.dynamicimage != '') {
				var dynamicImages = obj.dynamicimage.split(',');
				for(var j = 0; j < dynamicImages.length; j++) {
					// 创建对象
					var img = new Image();
					img.src = dynamicImages[j];
					var cssKey = 'width';
					var classKey = 'dyImgPositionW';
					if(img.width > img.height) {
						cssKey = 'height';
						classKey = 'dyImgPositionH';
					}
					if(img.width == img.height) {
						classKey = 'dyImgPositionE';
					}
					template += '<div class="pb-standalone-dark dyImg" onclick="openPhoneBrowserDynamicInfo(this);" style="width:' + winWidth + 'px;height:' + winWidth + 'px;display: inline-block;margin-top: 5px;margin-right: 2px; ">' + '<img class="cache ' + classKey + ' " src="' + rootUrl + dynamicImages[j] + '" width="100%" height="100%" />' + '</div>';
				}
			}
			template += '			</div>';
			template += '		</div>';
			template += '	</div>';
			template += '</div>';
		}
		$$('#user_collection_list').append(template);
	} else {
		toast.show('没有更多了！');
		myApp.detachInfiniteScroll($$('#collection_page'));
		$$('#loading_more').css('display', 'none');
	}
}

function feedback() {
	$$('#submit1').attr('disabled', false);
	var feedback_content = $$('#feedback_content').val();
	if(feedback_content.length > 200) {
		return false;
	}

	var _data = {
		script: "managers.om.user.user",
		needTrascation: true,
		funName: "insertfeedback",
		form: "{feedback_content: '" + Auto517.p_emotion.utf16toEntities(feedback_content) + "',c_user_id: '" + uid + "'}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			toast.show("提交成功");
			mainView.router.back();

		},
		error: function(xhr, type) {
			toast.show("提交失败");
		}
	});

}

function feedbackinitListener() {
	$$('#submit1').attr('disabled', true);
	$$('textarea[id="feedback_content"]').on('input', function() {
		if($$(this).val().length > 0) {
			$$('#submit1').removeAttr('disabled');
		} else {
			$$('#submit1').attr('disabled', true);
		}
	});

}

function edition_init() {
	var content;
	var _data = {
		script: "managers.om.user.user",
		needTrascation: true,
		funName: "selectedition",
		form: "{}"

	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		method: 'post',
		dataType: 'json',
		data: _data,
		success: function(data) {
			if(data.formDataset.checked == 'false') {} else {
				$$('#num-edition').text(data.datasources[0].rows[0].c_edition_name);
				$$('#introduce').html(data.datasources[0].rows[0].c_edition_content);
			}

		},
		error: function(xhr, type) {

			toast.show("请求失败");
		}
	});

}