//用户的手机号
var telphone;
var name;
var memberid;
//用户信息
var userInfo = {
};
var userInfos = {};
var userDate;
var urId='';
var nameFlag='';
var nameCard='';
var oldPwd="";
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	} else {
		var tel = $api.byId('tel');
		$api.css(tel, 'padding-right:25px;');
	}
	FileUtils.readFile("info.json", function(info, err) {
				userInfo.createTime=info.createTime;
				urId = info.userNo;
				getInfo(urId);
				queryUserInfoUserNo(urId);
				oldPwd(urId);
				$('#createtime').html(userInfo.createTime);
			});
	

	/**
	 *嵌入页面测试  end
	 */

	$(".create-actions").on("click", function() {//弹出选择头像
		$("#photo").css("display", "block");
	});
	$("#photo .photo_bottom").on("click", function() {//弹出选择头像
		$("#photo").css("display", "none");
	});
	$('#album').click(function() {//选择相册
		getPicture(0);
		$("#photo").css("display", "none");
	});
	$('#tackpic').click(function() {//选择照相
		getPicture(1);
		$("#photo").css("display", "none");
	});
	$(".create-sex").on("click", function() {//弹出选择性别
		$("#women").css("display", "block");
	});
	$("#women .photo_bottom").on("click", function() {//弹出选择性别
		$("#women").css("display", "none");
	});
	$('#sexman').click(function() {//选择男
		changesex('男');
		$("#women").css("display", "none");
	});
	$('#sexwoman').click(function() {//选择女
		changesex('女');
		$("#women").css("display", "none");
	});

	memberid = api.pageParam.memberid;
	ProgressUtil.showProgress();
	$('#back').click(function() {
		api.execScript({//刷新我的界面金币总数的数据
						name : 'root',
						frameName : 'room',
						script : 'refresh();'
					});
		api.closeWin();
	});
	
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		api.execScript({//刷新我的界面金币总数的数据
				name : 'root',
				frameName : 'room',
				script : 'refresh();'
			});
			api.closeWin();
	});
	
	var d = new Date();
	var nowtime = d.toLocaleString();
	var time = curDateTime();
	$("#birthday").calendar({
		value : [curDateTime()],
		maxDate : time,
		onChange : function(p, values, displayValues) {
			if (curDateTime() != displayValues) {
//				alert(displayValues);
				changebirthday(displayValues);
			}
		}
	});
	
//获取持卡人的信息	
function queryUserInfoUserNo(urId){
		AjaxUtil.exeScript({
			script : "mobile.buyback.buyback",
			needTrascation : true,
			funName : "queryUserInfoUserNo",
			form : {
				userNo : urId
			},
			success : function(data) {
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.userInfo;
					var list = $api.strToJson(account);
					if(list.real_name=='undefined' || list.real_name==null || list.real_name==''){
						nameFlag=true;
					}else{
						nameFlag=false;
					};
					if(list.idcard=='undefined' || list.idcard==null || list.idcard==''){
						nameCard=true;
					}else{
						nameCard=false;
					}
				} else {
//					alert(data.formDataset.errorMsg);
				}
			}
		});
	};
	
//获取旧密码对二级密码进行跳转判断
function oldPwd(urId){	
		AjaxUtil.exeScript({
	      script:"managers.home.person",
	      needTrascation:true,
	      funName:"querySecondPwd",
	      form:{
	        userNo:urId
	      },
	      success:function (data) {
	       if (data.formDataset.checked == 'true') {
	       		var account = data.formDataset.secondPwd;
	       		oldPwd=account;
//				if(oldPwd==888888){
////	       			alert("您的二级密码的初始密码为888888,如果您想修改，请去个人信息完善修改！")
//					$('#oldpwd').attr('placeholder','初始密码为六个8');
//					
//	       		}else{
//	       			$('#oldpwd').attr('placeholder','请输入您的旧密码');
//	       		}
	         } else {
	             alert(data.formDataset.errorMsg);
	         }
	       }
	    });
	}	
//修改真实姓名
	$('#name_').click(function() {
		if (nameFlag == true) {
			api.openWin({
				name : 'changeRealname',
				url : 'changeRealname.html',
				reload : true,
				pageParam : {
					memberid : memberid,
					name : name
				},
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		}else{
			alert('您的姓名不可更改,如果想要更改请联系管理员!');
		}
	}); 



	
	$('#nick').click(function() {
		api.openWin({
			name : 'changename',
			url : 'changename.html',
			reload : true,
			pageParam : {
				memberid : memberid,
				name : name
			},
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});

//	$('#realname').click(function() {
//		api.openWin({
//			name : 'changename',
//			url : 'change_realname.html',
//			reload : true,
//			pageParam : {
//				memberid : memberid,
//				name : name
//			},
//			slidBackEnabled : true,
//			animation : {
//				type : "push", //动画类型（详见动画类型常量）
//				subType : "from_right", //动画子类型（详见动画子类型常量）
//				duration : 300 //动画过渡时间，默认300毫秒
//			}
//		});
//	});
//手机号暂时禁用
	$('#tel_li').click(function() {
		api.openWin({
			name : 'changenumber',
			url : 'changenumber.html',
			reload : true,
			pageParam : {
				memberid : memberid,
//				telphone : telphone
			},
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#changePwd').click(function() {
		api.openWin({
			name : 'changepassword',
			url : 'changepassword.html',
			reload : true,
			pageParam : {
				memberid : memberid
			},
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
//修改二级密码跳转	
	$('#changeSecondPwd').click(function() {
		if (oldPwd == 888888) {
			api.openWin({
				name : 'changeSecondPwd',
				url : 'changeSecondPwd.html',
				reload : true,
				pageParam : {
					memberid : memberid
				},
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		} else {
			api.openWin({
				name : 'changeSpwd',
				url : 'changeSpwd.html',
				reload : true,
				pageParam : {
					memberid : memberid
				},
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		}

	}); 

	
	$('#gexing').click(function() {
		api.openWin({
			name : 'gexing',
			url : '../home/gexing.html',
			reload : true,
			pageParam : {
				memberid : memberid
			},
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});

	$('#changeIdentify').click(function() {
		if (nameCard == true) {
			api.openWin({
				name : 'changeIdentify',
				url : '../home/changeIdentify.html',
				reload : true,
				pageParam : {
					memberid : memberid
				},
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
		}else{
			alert('您的身份证号码不可更改,如果想要更改请联系管理员!');
		}
	}); 


	$('#myroom').click(function() {
		showRoomPage();
	});

	$('#keywods').click(function() {
		api.openWin({
			name : 'keyword',
			url : '../home/keyword.html',
			reload : true,
			pageParam : {
				memberid : memberid
			},
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#couple').click(function() {
		api.openWin({
			name : 'couple',
			url : '../home/couple.html',
			reload : true,
			pageParam : {
				memberid : memberid
			},
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	$('#always').click(function() {
		api.openWin({
			name : 'always',
			url : '../home/always.html',
			reload : true,
			pageParam : {
				memberid : memberid
			},
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	//获得个人信息
	function getInfo(urId){
	AjaxUtil.exeScript({
		script : "managers.home.person",
		needTrascation : false,
		funName : "getmemberinfo1",
		form : {
			memberid : memberid
//			userNo:urId
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
					AjaxUtil.exeScript({
						script : "managers.home.person",
						needTrascation : false,
						funName : "getUserInfo",
						form : {
							memberid : memberid
						},
						success : function(data) {
							api.hideProgress();
							if (data.execStatus == 'true') {
								var result = data.datasources[0].rows[0];
								var headurl = result.head_image == null ? '../../image/morenpic_03.png' : rootUrl + result.head_image;
								$('#headurl').attr('src', headurl);
							} else {
								api.alert({
									msg : '网络连接失败'
								});
								api.closeWin();
							}
						}
					});
				
				var result = data.datasources[0].rows[0];
				// 头像
//				var headurl = result.headurl == null ? '../../image/morenpic_03.png' : rootUrl + result.headurl;
//				$('#headurl').attr('src', headurl);
				// 真实姓名
				var realname = result.real_name == null ? '' : result.real_name;
				$("#realname").html(realname);
				// 用户名称
				var nick = result.nick == null ? '' : result.nick;
				$("#nick").html(nick);
				//console.log('nick'+nick);
				// 性别
				var sex = result.sex == null ? '' : result.sex;
				$('#sex').html(sex);
				//var userid = result.membercode == null ? '' : result.membercode;
				//$('#userid').html(userid);
				// 生日
				var birthday = result.birthday == null ? '' : result.birthday;
				$('#birthday').val(birthday);			
				var address = result.address == null ? '' : result.address;
				$('#address').html(address);
				$('#address').val(address);
				// 手机号
				var telphone = result.telphone == null ? "" : result.telphone;
				$('#telphone').html(telphone);
				// 密码
				//var pwd = result.pwd == null ? "" : result.pwd;
				//$("#pwd").html(pwd);
				// 个性签名
				var c_user_sign = result.c_user_sign == null ? "" : result.c_user_sign;
				$("#c_user_sign").html(c_user_sign);
				// 关键词
				var keyword = result.keyword == null ? "" : result.keyword;
				keywordArr = keyword.split(",")
				for (var i =0; i<keywordArr.length; i++) {
					//alert(keywordArr[i]);
					$("#word"+ i).html(keywordArr[i]);			
				}
				
				//$("#word2").html("444");
				// 情感状态
				var feelings = result.feelings == null ? "" : result.feelings;
			


				$("#feelings").html(feelings);
				// 身份证号
				var idcard = result.idcard == 'undefined' ? "" : result.idcard;
				
				$("#idcard").html(idcard);
				// 我的房屋
				// 注册日期
//				var createtime = result.createtime == null ? "" : result.createtime;
//				$("#createtime").html(createtime);
				
			} else {
				api.alert({
					msg : '网络连接失败'
				});
				api.closeWin();
			}
		}
	});
	}
	//点击保存按钮
	$('#regist').click(function() {
		api.closeWin();
	});
	//地址
	$('#myAddress').click(function() {
		getCityList();
	});
};
//	$('#date').click(function() {
//		api.openPicker({
//  	
//		}, function(ret, err) {
// 		if (ret) {
// 			 userDate = ret.year+"-"+ret.month+"-"+ret.day;
//			$("#showDate").html(userDate);
//  	} 
//		});
//	});
/**
 *打开城市列表
 */
function getCityList() {
	var hh = 0;
	var UICityList = api.require('UICityList');
	if (api.systemType == 'ios') {
		hh = 20;
	}
	UICityList.open({
		rect : {
			x : 0,
			y : hh,
			w : api.frameWidth,
			h : api.frameHeight
		},
		resource : 'widget://res/UICityList.json',
		styles : {
			searchBar : {
				bgColor : '#696969',
				cancelColor : '#E3E3E3'
			},
			location : {
				color : '#696969',
				size : 12
			},
			sectionTitle : {
				bgColor : '#eee',
				color : '#000',
				size : 12
			},
			item : {
				bgColor : '#fff',
				activeBgColor : '#696969',
				color : '#000',
				size : 14,
				height : 40
			},
			indicator : {
				bgColor : '#fff',
				color : '#696969'
			}
		},
		currentCity : '北京',
		locationWay : 'GPS',
		hotTitle : '热门城市',
		fixedOn : api.frameName,
		placeholder : '输入城市名或首字母查询'
	}, function(ret, err) {
		if (ret) {
			if (ret.eventType == 'show') {
			} else {

				changeaddress(ret.cityInfo.city);
				UICityList.close();
			}
		} else {
			api.alert({
				msg : JSON.stringify(err)
			});
		}
	});
}

	function savaRealname() {
		alert("ss");
	}

function curDateTime() {
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var date = d.getDate();
	var day = d.getDay();
	var curDateTime = year;
	if (month > 9)
		curDateTime = curDateTime + "-" + month;
	else
		curDateTime = curDateTime + "-" + "0" + month;
	if (date > 9)
		curDateTime = curDateTime + "-" + date;
	else
		curDateTime = curDateTime + "-" + "0" + date;
	return curDateTime;
}

function changesex(sex) {
	ProgressUtil.showProgress();
	AjaxUtil.exeScript({
		script : "managers.home.person",
		needTrascation : false,
		funName : "updatememberinfo",
		form : {
			headurl : "",
			nick : "",
			sex : sex,
			birthday : "",
			address : "",
			telphone : "",
			pwd : "",
			idCard : "",
			c_user_sign : "",
			keyword : "",	
			couple : "",	
			realname : "",	
			memberid : memberid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				api.alert({
					msg : '修改成功'
				});
				$('#sex').html(sex);
			}
		}
	});
}

function changebirthday(birthday) {
	ProgressUtil.showProgress();
	AjaxUtil.exeScript({
		script : "managers.home.person",
		needTrascation : false,
		funName : "updatememberinfo",
		form : {
			headurl : "",
			nick : "",
			sex : "",
			birthday : birthday,
			address : "",
			telphone : "",
			pwd : "",
			idCard : "",
			c_user_sign : "",
			keyword : "",
			couple : "",
			realname : "",
			memberid : memberid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				api.alert({
					msg : '修改成功'
				});
			}			
		}
	});
}

function changeaddress(address) {
	ProgressUtil.showProgress();
	AjaxUtil.exeScript({
		script : "managers.home.person",
		needTrascation : false,
		funName : "updatememberinfo",
		form : {
			headurl : "",
			nick : "",
			sex : "",
			birthday : "",
			address : address,
			telphone : "",
			pwd : "",
			idCard : "",
			c_user_sign : "",
			keyword : "",
			couple : "",
			realname : "",
			memberid : memberid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'true') {
				$('#address').val(address);
				api.alert({
					msg : '修改成功'
				});
			}
		}
	});
}

/**
 *本地图片和拍照  0：本地，1：拍照
 * @param {Object} type
 */
function getPicture(type) {
	if (type == 0) {//本地相册
		api.getPicture({
			sourceType : 'library',
			mediaValue : 'pic',
			destinationType : 'url',
			allowEdit : true,
			quality : 100,
			//			targetWidth : 100,
			//			targetHeight : 100,
			saveToPhotoAlbum : false
		}, function(ret, err) {
			if (ret) {
				compress(ret.data);
			} else {
				//				alert(JSON.stringify(err));
				//				api.alert({
				//					msg : JSON.stringify(err)
				//				});
			}
		});
	} else {//拍照
		api.getPicture({
			sourceType : 'camera',
			encodingType : 'jpg',
			mediaValue : 'pic',
			destinationType : 'url',
			allowEdit : true,
			quality : 100,
			//			targetWidth : 100,
			//			targetHeight : 100,
			saveToPhotoAlbum : false
		}, function(ret, err) {
			if (ret) {
				compress(ret.data);
			} else {
				//				alert(JSON.stringify(err));
				//				api.alert({
				//					msg : JSON.stringify(err)
				//				});
			}
		});
	}
}
//图片压缩
function compress(compressPic) {
		var imgTempPath = compressPic.substring(compressPic.lastIndexOf("/"));
		var imageFilter = api.require('imageFilter');
		imageFilter.compress({
			img : compressPic,
			quality : 0.05,
			save : {
				imgPath : "fs://imgtemp",
				imgName : imgTempPath
			}
		}, function(ret, err) {
			if (ret.status) {
				headurls= "fs://imgtemp" + imgTempPath;
				changeheadurl(headurls);
			} else {
				alert(JSON.stringify(err));
			}
		});
	}
function changeheadurl(headurl) {
	if (headurl) {
		ProgressUtil.showProgress();
		api.ajax({
			url : rootUrl + '/api/upload',
			method : 'post',
			data : {
				files : {
					file : headurl
				}
			}
		}, function(ret, err) {
			api.hideProgress();
			if (ret.execStatus == 'true') {
				headurl = ret.formDataset.saveName;
				AjaxUtil.exeScript({
					script : "managers.home.person",
					needTrascation : false,
					funName : "updatememberinfo",
					form : {
						headurl : headurl,
						nick : "",
						sex : "",
						birthday : "",
						address : "",
						telphone : "",
						pwd : "",
						idCard : "",
						c_user_sign : "",
						keyword : "",
						couple : "",
						realname : "",
						memberid : memberid
					},
					success : function(data) {
						api.hideProgress();
						if (data.execStatus == 'true') {
							$('#headurl').attr('src', rootUrl + headurl);
							api.execScript({//刷新person界面数据
								name : 'root',
								frameName : 'room',
								script : 'refresh();'
							});
						}
					}
				});

			} else {
				api.alert({
					msg : '上传图片失败,请您从新上传'
				});
			}
		});
	}
}

function touchstart(o) {
	o.style.backgroundColor = '#eaeaea';

	setTimeout(function() {
		o.style.background = "#fff";
	}, 1000 * 0.2);
}

function test(ss) {
	var aa = document.getElementById(ss);
	aa.style.background = "#fff";
}

function refresh() {
	location.reload();
}

/**
 * 获取当前登录的用户id，并且跳到我的房间页面
 */
function showRoomPage() {
	api.showProgress({
	});
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getroomById",
		form : {
			memberid : memberid
		},
		success : function(data) {
			api.hideProgress();
			if (data.execStatus == 'false') {
				api.alert({
					title : '提示',
					msg : '对不起，加载房间信息失败，请您重新加载',
				}, function(ret, err) {
				});
			} else {
				roomLength = data.datasources[0].rows.length;
				if (roomLength != 0) {
					api.openWin({
						name : 'managerRoom',
						url : '../personal/select_adress.html',
						slidBackEnabled : true,
						pageParam : {
							memberid : memberid
						},
						animation : {
							type : "push", //动画类型（详见动画类型常量）
							subType : "from_right", //动画子类型（详见动画子类型常量）
							duration : 300 //动画过渡时间，默认300毫秒
						}
					});
				} else {
					api.openWin({
						name : 'addroom',
						url : '../personal/roominfo.html',
						slidBackEnabled : true,
						animation : {
							type : "push", //动画类型（详见动画类型常量）
							subType : "from_right", //动画子类型（详见动画子类型常量）
							duration : 300 //动画过渡时间，默认300毫秒
						}
					});
				}
			}
		}
	});
}
