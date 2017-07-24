myApp.onPageInit('communityMembers', function(page) {

	var communityId = page.query.communityId;
	var orderByNum = page.query.orderByNum;
	var pagetype = page.query.pagetype;
	var communityName = page.query.communityName;
	$$("#communityPt").val(pagetype);
	$$("#communityID").val(communityId);
	$$("#communityName").val(communityName);
	if(pagetype == 1){
		//从圈资料进入
		$$('#community-members-back').addClass('back');
	}else if(pagetype == 2){
		//邀请圈成员进入
		
		$$('#community-members-back').on('click',function(){
			mainView.router.back({
				url : 'html/maillist/friendListJoinCommunity.html?communityId='+communityId+'&communityName='+communityName ,
				force : true
			});
		});
	}
	var powerType = 0;

	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: false,
		funName: "getCommunityMembers",
		form: "{communityId:'" + communityId + "',orderByNum:" + orderByNum + ",beginLat:" + user_lat + ",beginLon:" + user_lon + "}"
	};

	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data: _data,
		type: 'post',
		success: function(data) {
			var result = data.datasources[0].rows;
			// 生成新条目的HTML
			var community_template = '<div class="list-group"><ul>';
			var personTypes = new Array("圈主", "管理员", "成员");
			for(var j = 0; j < personTypes.length; j++) {
				var personType = personTypes[j];
				community_template += '<li class="list-group-title" style="font-size: 15px;color: rgba(133, 133, 133, 0.81);line-height: 25px;height: 25px;" id="joinPerson_"' + j + '>' + personType + '</li>';
				for(var i = 0; i < result.length; i++) {
					var communityMember = result[i];
					if(communityMember.persontype == personType) {
						community_template += '<li class="swipeout">';
						community_template += '<a href="#" class="item-link swipeout-content item-content">';
						community_template += '<div class="item-media"><img class="tag-info-four" src=\"' + rootUrl + communityMember.userimage + '\" width="80"></div>';
						community_template += '<div class="item-inner">';
						community_template += '<div class="item-title-row" style="height: 30px;background: none;padding-right: 0px;">';
						community_template += '<div class="item-title" style="font-weight: 300;font-size:16px;">' + communityMember.username + '</div>';

						var creatTime = communityMember.beforemin;
						if(parseInt(creatTime) / 60 > 1 && parseInt(creatTime) / 60 < 24) {
							creatTime = Math.round(parseInt(creatTime) / 60) + '小时前';
						} else if(parseInt(creatTime) / 60 >= 24) {
							creatTime = Math.round(parseInt(creatTime) / (60 * 24)) + '天前';
						} else {
							creatTime = creatTime + '分钟前';
						}
						var distance = communityMember.distance;
						community_template += '<div class="item-after" style="color: #adadad;font-size: 12px;">' + distance + 'km&nbsp|&nbsp' + creatTime + '</div>';
						community_template += '</div>';
						if(communityMember.persontype == '圈主') {
							if(communityMember.userid == uid) {
								powerType = 1;
							}

							community_template += '<div class="item-subtitle row no-gutter" style="width: 7.5em;">';
							if(communityMember.usergender == 1) {
								community_template += '<div class="col-33 tablet-33" style="background-color: #45ADF6;height: 12px;line-height: 12px;color: white;text-align: center;font-size: 10px;">';
								community_template += '<i class="icon icon-mars community-mars-icon" style="color: white;line-height: 12px;"></i>&nbsp&nbsp' + communityMember.userage;
							} else {
								community_template += '<div class="col-33 tablet-33" style="background-color: #E7739C;height: 12px;line-height: 12px;color: white;text-align: center;font-size: 10px;">';
								community_template += '<i class="icon icon-venus community-mars-icon" style="color: white;line-height: 12px;"></i>&nbsp&nbsp' + communityMember.userage;
							}
							community_template += '</div>';
							community_template += '<div class="col-33 tablet-33" style="border-bottom-width: 0px;height: 12px;line-height: 12px;border-top-width: 0px;text-align: center;"><img src=\"' + communityMember.c_level_image + '\"  height="12px" width="35px"/></div>';
							community_template += '<div class="col-33 tablet-33" style="background-color: hotpink;color: white;height: 12px;line-height: 12px;text-align: center;font-size: 10px;">圈主</div>';
							community_template += '</div>';
						} else {
							community_template += '<div class="item-subtitle row no-gutter" style="width: 5em;">';
							if(communityMember.usergender == 1) {
								community_template += '<div class="col-50 tablet-50" style="background-color: #45ADF6;height: 12px;line-height: 12px;color: white;text-align: center;font-size: 10px;">';
								community_template += '<i class="icon icon-mars community-mars-icon" style="color: white;line-height: 12px;"></i>&nbsp&nbsp' + communityMember.userage;
							} else {
								community_template += '<div class="col-50 tablet-50" style="background-color: #E7739C;height: 12px;line-height: 12px;color: white;text-align: center;font-size: 10px;">';
								community_template += '<i class="icon icon-venus community-mars-icon" style="color: white;line-height: 12px;"></i>&nbsp&nbsp' + communityMember.userage;
							}
							community_template += '</div>';
							community_template += '<div class="col-50 tablet-50" style="border-bottom-width: 0px;height: 12px;line-height: 12px;border-top-width: 0px;text-align: center;"><img src=\"' + communityMember.c_level_image + '\" height="12px" width="35px"/></div>';
							community_template += '</div>';
						}
						community_template += '<div class="item-text" style="height: 30px;font-size: 14px;width:150px;line-height:40px;"><span style="width:150px;">' + communityMember.usersign + '</span></div>';

						community_template += '</div>';
						community_template += '</a>';
						if(communityMember.persontype == '成员' && powerType == 1) {
							community_template += '<div class="swipeout-actions-right">';
							community_template += '<a href="#" class="admin-new bg-orange" data-personId="' + communityMember.userid + '" data-joinId="' + communityMember.joinid + '">设置为管理员</a>';
							community_template += '</div>';
						}
						community_template += '</li>';
					}
				}
			}
			community_template += '</div></ul>';

			$$('#community-members-list').html(community_template);
		}
	})
	
	$$(document).on('click','.admin-new', function () {
	  	var user_join_id = $$(this).data('joinId');
	  	var user_id = $$(this).data('personId');
	  	myApp.showIndicator();
	  	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: true,
		funName: "updateCommunityPerson",
		form: "{userJoinId: '"+user_join_id+"',userId: '" + user_id + "'}"
	    };
	  	
	  	$$.ajax({
			url: rootUrl + "/api/execscript",
			dataType: 'json',
			data: _data,
			type: 'post',
			success: function(data) {
				myApp.hideIndicator();
				mainView.router.refreshPage();
			}
		});
	});

	$$('.community-4').on('click', function() {
		var buttons1 = [{
				text: '<span style="color:rgb(14, 170, 227)">默认顺序</span>'
					//          onClick: function () {
					//              myApp.alert('Button1 clicked');
					//          }
			},
			//      {
			//         text: '<span style="color:rgb(14, 170, 227)">按活跃度排序</span>',
			//          onClick: function () {
			//             mainView.router.reloadPage('html/community/communityMembers.html?communityId='+communityId+'&orderByNum=1');
			//          }
			//      },
			{
				text: '<span style="color:rgb(14, 170, 227)">按加入时间排序</span>',
				onClick: function() {
					mainView.router.reloadPage('html/community/communityMembers.html?communityId=' + communityId + '&orderByNum=2&pagetype=' + pagetype);
				}
			}
		];
		var buttons2 = [{
			text: '<span style="color:rgb(14, 170, 227)">取消</span>'
				//          onClick: function () {
				//              myApp.alert('Cancel clicked');
				//          }
		}];
		var groups = [buttons1, buttons2];
		myApp.actions(groups);
	});
});

//圈成员页面返回


myApp.onPageInit('communityJoinMember', function(page) {
	var communityId = page.query.communityId;
	var communityName = '';

	var _data = {
		script: "managers.om.user_moble.user",
		needTrascation: true,
		funName: "getCommunityOnlyInfo",
		form: "{communityId: '" + communityId + "'}"
	};
	
	var comname = '';
	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data: _data,
		type: 'post',
		success: function(data) {
			var communityInfo = data.datasources[0].rows[0];

			$$('#community-join-img').attr('src', rootUrl + communityInfo.c_image);
			$$('#community-join-title').append(communityInfo.c_name);
			$$('#community-join-code').append(communityInfo.c_code);
			$$('#community-join-sign').append(communityInfo.c_type);
			comname = communityInfo.c_name;
			$$('#community-join-om').attr('href', 'html/maillist/friendListJoinCommunity.html?communityId=' + communityId + '&communityName=' + communityInfo.c_name);
		}
	});
	$$('#community-join-om').attr('href','html/maillist/friendListJoinCommunity.html?communityId='+communityId+'&communityName='+communityName);

	$$('#share_community_wxfri').on('click', function() {

		wx.isInstalled(function(ret, err) {
			if(ret.installed) {
				wx.shareWebpage({
					apiKey: '',
					scene: 'session',
					title: '我在' + comname + '圈等你！',
					description: '下载智慧生活，加入我们的圈子吧！',
					thumb: 'image/a.png',
					contentUrl: rootUrl + '/jsp/manager/share_community_card?communityId=' + communityId
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
	});

	$$('#share_community_qqfri').on('click', function() {
		qq.installed(function(ret, err) {
			if(ret.status) {
				qq.shareNews({
					title: '我在' + comname + '圈等你！',
					description: '下载智慧生活，加入我们的圈子吧！',
					imgUrl: 'image/a.png',
					url: rootUrl + '/jsp/manager/share_community_card?communityId=' + communityId,
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
	});
	
	$$('#share_community_wxcom').on('click', function() {
		wx.isInstalled(function(ret, err) {
			if(ret.installed) {
				wx.shareWebpage({
					apiKey: '',
					scene: 'timeline',
					title: '我在' + comname + '圈等你！',
					description: '下载智慧生活，加入我们的圈子吧！',
					thumb: 'image/a.png',
					contentUrl: rootUrl + '/jsp/manager/share_community_card?communityId=' + communityId
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
	});
	
	$$('#share_community_weibo').on('click', function() {
		weibo.isInstalled(function(ret, err) {
			if(ret.status) {
				weibo.shareWebPage({
					apiKey: '',
					scene: 'timeline',
					title: '我在' + comname + '圈等你！',
					description: '下载智慧生活，加入我们的圈子吧！',
					thumb: 'image/a.png',
					contentUrl: rootUrl + '/jsp/manager/share_community_card?communityId=' + communityId
				}, function(ret, err) {
					if(ret.status) {
						alert('分享成功');
					} else if(err.code == 1){
						alert('已取消分享');
					} else {
						alert('分享失败');
					}
				});
			} else {
				alert('未安装新浪微博客户端');
			}
		});
	});
});

myApp.onPageInit('friendListJoinCommunity', function(page) {
	var communityJoinFriend = $$('#community-friends-list');
	var communityId = page.query.communityId;
	var communityName = page.query.communityName;
	var communityJoinFriendLi = '';
	
	var _data = {
		script: "managers.om.community.appcommunity",
		needTrascation: false,
		funName: "getCommunityAdminFriend",
		form: "{communityId: '"+communityId+"',uid:'"+uid+"'}"
	};
	
	$$.ajax({
		url: rootUrl + "/api/execscript",
		dataType: 'json',
		data: _data,
		type: 'post',
		success: function(data) {
			var result = data.datasources[0].rows;
			for(var j = 0; j < result.length; j++) {
				var communityJoinFriendDate = result[j];
				communityJoinFriendLi += '<li>';
				communityJoinFriendLi += '<label class="label-checkbox item-content">';
				communityJoinFriendLi += '<input type="checkbox" name="my-join-friends" value="' + communityJoinFriendDate.c_user_id + '">';
				communityJoinFriendLi += '<div class="item-media">';
				communityJoinFriendLi += '<i class="icon icon-form-checkbox"></i>';
				communityJoinFriendLi += '<img src="' + rootUrl + communityJoinFriendDate.c_user_image + '" width="30">';
				communityJoinFriendLi += '</div>';
				communityJoinFriendLi += '<div class="item-inner" style="line-height: 30px;">';
				communityJoinFriendLi += '<div class="item-title-row">';
				communityJoinFriendLi += '<div class="item-title" style="font-weight: 300;">' + communityJoinFriendDate.c_user_name + '</div>';
				communityJoinFriendLi += '</div>';
				communityJoinFriendLi += '</label>';
				communityJoinFriendLi += '</li>';
			}
			communityJoinFriend.append(communityJoinFriendLi);
		}
	});

	$$('.community-6').on('click', function() {
		myApp.showIndicator();
		var myJoinFInput = '';
		$$('input[name="my-join-friends"]:checked').each(function() {
			myJoinFInput += $$(this).val() + ',';
		});
		if(myJoinFInput.length > 0) {
			myJoinFInput = myJoinFInput.substring(0, myJoinFInput.length - 1);
			
			var _data = {
				script: "managers.om.community.appcommunity",
				needTrascation: true,
				funName: "insertCommunityFriends",
				form: "{communityId: '"+communityId+"',personJoinId:'"+myJoinFInput+"',communityName: '"+communityName+"'}"
	        }; 
			
			$$.ajax({
				url: rootUrl + "/api/execscript",
				dataType: 'json',
				data: _data,
				type: 'post',
				success: function(data) {
					
					//调融云接口
//					Auto517.RongCloud.joinGroup(communityId,communityName);
					mainView.router.loadPage('html/community/communityMembers.html?communityId='+communityId+'&orderByNum=0&pagetype=2&communityName='+communityName);
					myApp.hideIndicator();
				}
			});
		}
	});
});

myApp.onPageInit('communityJoinSubmit', function(page) {
	var communityId = page.query.communityId;
	$$('#communityJoinSubmit-sub').on('click', function() {
	    myApp.showIndicator();
		var formData = myApp.formToJSON('#communityJoinSubmit-form');
		var userRemark = formData.joinTextarea;
		var userRemarkLength = userRemark.replace(/[^\x00-\xff]/g, "0101").length;
		if(userRemarkLength > 256) {
			myApp.hideIndicator();
			myApp.alert('加圈理由(256个汉字)过长，请重新输入！', '哦脉提示');
			return false;
		} else {
            var _data = {
				script: "managers.om.community.appcommunity",
				needTrascation: true,
				funName: "saveCommunityJoinPerson",
				form: "{communityId: '" + communityId + "',userId:'" + uid + "',userRemark: '" + userRemark + "'}"
			};

			$$.ajax({
				url: rootUrl + "/api/execscript",
				dataType: 'json',
				data: _data,
				type: 'post',
				success: function(data) {
					myApp.hideIndicator();
					toast.show("申请已发出，请耐心等待审批！");
					mainView.router.loadPage('html/community/communityMain.html?reloadCommunityPage=1');
					//发送个事件
					api.sendEvent({
						name: 'addJoinMessage',
						extra: {
							fileName: 'waiting'
						}
					});
				}
			});
		}
	});
});