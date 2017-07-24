myApp.onPageInit('bind_contact', function(page) {
	if (isContactBind == 0) {
		$$('#cancelBind_btn').hide();
	} else {
		$$('#contact_btn').text('添加好友');
		$$('#cancelBind_btn').show();
	}

});

function cancelBind() {
	$$.ajax({
		url : server_address + 'index.php/user/user_info/cancelContactsBind',
		data : {
			uid : uid
		},
		dataType : 'json',
		method : 'post',
		error : function(xhr, status) {
			alert(status);
		},
		success : function(data) {
			isContactBind = 0;
			$$('#contact_btn').text('开启通讯录');
			$$('#cancelBind_btn').hide();

			$$('#bind_contact_link').find('img').attr('src', 'image/setting/ic_setting_phone_unbind.png');
			$$('#bind_contact_link').find('.item-text').text('未绑定');

		}
	});

}

//绑定通讯录
myApp.onPageInit('bind_contact_list', function(page) {
	if (isContactBind == 1) {
		$$.ajax({
			url : server_address + 'index.php/user/user_info/searchHavenContacts',
			data : {
				uid : uid
			},
			dataType : 'json',
			method : 'post',
			error : function(xhr, status) {
				alert(status);
			},
			success : function(data) {
				pakageUserContacts(data);
			}
		});

	} else {
		contacts.queryByPage(function(ret) {
			if (ret.status) {
				$$.ajax({
					url : server_address + 'index.php/user/user_info/openContacts',
					data : {
						uid : uid,
						isContactBind : isContactBind,
						result : JSON.stringify(ret)
					},
					dataType : 'json',
					method : 'post',
					error : function(xhr, status) {
						alert(status);
					},
					success : function(data) {
						pakageUserContacts(data);
					}
				});
			}
		});

	}

});

function pakageUserContacts(data) {
	var useTotal = data.useTotal;
	var used = data.used;
	var unuseTotal = data.unuseTotal;
	var unused = data.unused;

	if (useTotal > 0) {
		var contact_used = $$('#contact-used');
		contact_used.append('<li class="list-group-title" id="usedTotal" style="color: grey;">' + useTotal + '个好友待关注</li>');

		var usedPerson = "";
		for (var i = 0; i < used.length; i++) {
			usedPerson += '<li>';
			usedPerson += '<div class="item-content">';
			usedPerson += '<div class="item-media"><img src="' + used[i].img + '" width="50" height="50">';
			usedPerson += '</div>';
			usedPerson += '<div class="item-inner">';
			usedPerson += '<div class="item-title-row">';
			usedPerson += '<div class="item-title">';
			usedPerson += used[i].name;
			usedPerson += '</div>';
			usedPerson += '<div class="item-subtitle">';
			usedPerson += used[i].nickname;
			usedPerson += '</div>';
			usedPerson += '</div>';
			usedPerson += '<div class="item-after">';
			usedPerson += '<span class="button" id="used_' + i + '" style="background-color: rgb(39, 166, 137); color: white;" onclick="focusFriend(' + used[i].friendid + ' ,' + i + ' ,' + useTotal + ');">关注</span>';
			usedPerson += '</div>';
			usedPerson += '</div>';
			usedPerson += '</li>';
		}
		contact_used.append(usedPerson);
	}

	if (unuseTotal > 0) {
		var contact_unused = $$('#contact-unused');
		contact_unused.append('<li class="list-group-title" style="color: grey;">' + unuseTotal + '个好友可邀请</li>');

		var unusedPerson = "";
		for (var j = 0; j < unused.length; j++) {
			unusedPerson += '<li>';
			unusedPerson += '<div class="item-content">';
			unusedPerson += '<div class="item-inner">';
			unusedPerson += '<div class="item-title">';
			unusedPerson += unused[j].name;
			unusedPerson += '</div>';
			unusedPerson += '<div class="item-after">';
			unusedPerson += '<span class="button" style="background-color:#2196F3;border: 1px solid #2196F3; color: white;" onclick="sendInvitationSMS(\'' + unused[j].phone + '\');">邀请</span>';
			unusedPerson += '</div>';
			unusedPerson += '</div>';
			unusedPerson += '</li>';
		}
		contact_unused.append(unusedPerson);
	}

	$$('#contact_btn').text('添加好友');
	$$('#cancelBind_btn').show();
}

//通讯录内关注好友
function focusFriend(friendid, index, useTotal) {
	myApp.confirm('关注TA可查看并接受TA的全部动态，确定关注TA？', '', function() {
		$$.ajax({
			url : server_address + 'index.php/user/user_info/addRelation',
			data : {
				formUserID : uid,
				toUserID : friendid
			},
			dataType : 'json',
			type : 'post',
			timeout : 5000,
			success : function(data) {
				toast.show('关注成功！');
				$$('#used_' + index).text('已关注');
				$$('#usedTotal').text((useTotal - 1) + '个好友待关注');
				$$('#used_' + index).attr('style', 'background-color: grey; color: white;border: 1px solid grey;');
				$$('#used_' + index).removeAttr('onclick');
			}
		});
	}, function() {
	});
}

//发送邀请短信

function sendInvitationSMS(tel) {
	var content = '我在哦脉，哦脉号：' + omcode;
	api.sms({
		numbers : [tel],
		text : content
	}, function(ret, err) {

	});
}
