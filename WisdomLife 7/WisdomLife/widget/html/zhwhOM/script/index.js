// Add main view
var mainView = myApp.addView('.view-main', {
	// Enable Dynamic Navbar for this view
	dynamicNavbar : false,
	preloadPreviousPage : true
});
//全局用用户ID和用户名
var uid = '';
var omcode = '';
var uname = '';
var uimg = '';
var user_lat = 0;
var user_lon = 0;
var user_address = '';
var user_province = '';
var user_city = '';
var user_district = '';
var user_streetName = '';
var user_streetNumber = '';
var user_obj = window.localStorage.getItem("om_app_super");
user_obj = JSON.parse(user_obj);
var utoken = '';
//图片查看标志
var viewPicFlag = true;
var user_age = '';
var user_gender = '';
var user_level = '';
var user_name = '';
var user_image = '';
var user_level_image = '';
var lastDistance = -1, lastDyId = -1, per_curPage = 1;
var _im_sourcePath = "widget://image/em";
//表情路径
var _im_emotionData;
//表情数据

var UIActionSelector;
var wx;
var qq;
var weibo;
var frameH;
var headerH;
var androidBack = '';
//安卓返回键全局变量
var home_add1 = 0;
function _auto517_pl_appback() {

	var pageName = mainView.activePage.name;
	
	var flag = '';
	if (androidBack == 'closePhoto') {
		Auto517.photoBrowser._photoBrowser_close();
		return;
	} else if (androidBack == "citySelector") {
		androidBack = '';
		UIActionSelector.close();
		return;
	} else if (androidBack == "rankPage") {
		androidBack = '';
		myApp.closeModal();
		return;
	} 
//	else if ($$('.swipeout-content').css('transform') != 'none' && pageName == 'maillist') {
//		myApp.swipeoutClose($$('.swipeout'));
//		return;
//	} 
//	else if ($$('.searchbar-overlay').css('display') == 'block') {
//		$$("#chaxun").blur();
//		$$(".searchbar-cancel").click();
//		return;
//	} 
	else if ($$('.modal-overlay.modal-overlay-visible').length > 0) {
		myApp.closeModal();
		return;
	} else if ($$(".popup.popup-community-twoStep").css('display') == 'block') {
		$$(".popup.popup-community-twoStep").css('display', 'none');
		$$(".popup.popup-community-oneStep").css('display', 'block');
		return;
	} else if ($$('.popup.popup-power').css('display') == 'block' || $$(".popup.popup-community-oneStep").css('display') == 'block') {
		myApp.closeModal();
		return;
	} else if ($$("#picker-deviceCons").css('display') == 'block' || $$(".picker-community-search").css('display') == 'block') {
		myApp.closeModal();
		return;
	} else if (pageName == 'nearbyDynamicInfo') {
		flag = $$("#dyInBack").val();
		if (flag == 1) {
			mainView.router.back({
				url : 'html/nearby/nearbyMain.html',
				force : true
			});
		} else {
			mainView.router.back();
		}
		return;
	} else if (pageName == 'user_info_view') {
		flag = $$("#usertype").val();
		if (flag == '2') {
			//从个人信息页查看个人详情页
			mainView.router.back({
				force : false,
				url : 'html/user/userInfo.html'
			});
			return;
		} else if (flag == '1') {
			mainView.router.back();
			return;
		} else if (flag == '3') {
			//从好友列表查看个人详情页
			mainView.router.back({
				url : 'html/maillist/maillist.html',
				force : false
			});
			return;
		} else if (flag == '4') {
			//从搜索查看个人详情
			mainView.router.back({
				url : 'html/maillist/addfriends.html',
				force : false
			});
			return;
		} else if (flag == '5') {
			//从个人信息页查看个人详情页
			mainView.router.back({
				url : 'html/maillist/maillist.html?type=1',
				force : true
			});
			return;
		}

	} else if (pageName == 'releaseDy') {
		mainView.router.back();
		onclickTab($$("#dynamic"), 'tabspan2');
		$$('#tab-people').removeClass('active');
		$$('#tab-dynamic').addClass('active');
		return;
	} else if (pageName == 'communityMembers') {
		flag = $$("#communityPt").val();
		if (flag == 2) {
			var communityId = $$("#communityID").val();
			var communityName = $$("#communityName").val();
			//邀请圈成员进入
			mainView.router.back({
				url : 'html/maillist/friendListJoinCommunity.html?communityId=' + communityId + '&communityName=' + communityName,
				force : true
			});
			return;
		} else {
			mainView.router.back();
			return;
		}
	} else if (androidBack == 'QRCode') {
		var type = {
			"value" : {
				"type" : "back"
			}
		};
		Auto517.FNScanner._exitScanner(type);
		return;
	} else if (pageName == 'servicechat') {
		Service.clearBadge();
		Service.listMyCounsel();
		Service.counselId = null;
		Service.targetId = null;
		Service.statu = null;
		Service.conversationtype = null;
		mainView.router.back();
		backMain();
	} else if (pageName == 'nearby-index' || pageName == 'list_community' || pageName == 'myServiceList' || pageName == 'user_info_main' || pageName == 'maillist' || pageName=='personnel-dynamic' || pageName == 'addfriends') {
		backMain();
	} else {
		mainView.router.back();
	}
	if(api.winName == 'root' && pageName == 'neighbour-index'){
		api.confirm({
		    title: '温馨提示',
		    msg: '确定要退出程序吗？',
		    buttons: ['确定', '取消']
		}, function(ret, err) {
		    if(ret.buttonIndex == 1){
		    	api.closeWidget({
	                id : 'A6921550712789',
	                retData : {
	                    name : 'closeWidget'
	                },
	                silent : true
            });
		    }
		});
	}
}

apiready = function() {
	api.addEventListener({
    name:'noticeclicked'
	},function(ret,err){
	    if(ret.value == 'applyNews'){
	    	mainView.router.loadPage('html/maillist/aboutgroup.html');
	    }
	});
	api.addEventListener({
	    name: 'uichatOpen'
	}, function(ret, err) {
		var pageName=myApp.getCurrentView().activePage.name;
		if(pageName!='nearbyDynamicInfo' && pageName!='communityInfoDetailed'){
			 Auto517.UIChatbox._inputBar_popupBoard();
		}
	    
	});
	
    var c_wisdom_id = api.pageParam.uid;
    var userInfos = {};
    frameH = api.pageParam.frameH;
    headerH = api.pageParam.headerH;
	var _data = {
			script: "managers.om.nearby.nearby",
			needTrascation: false,
			funName: "getUserById",
			form: "{uid: '"+c_wisdom_id+"'}"
		};
	    $$.ajax({
			url: rootUrl + "/api/execscript",
			dataType: 'json',
			method: 'post',
			data:_data,
			success: function(data) {
				if(data.datasources[0].rows!=''){
					user_age= data.datasources[0].rows[0].age;
					user_gender=data.datasources[0].rows[0].gender;
					user_level=data.datasources[0].rows[0].level;
					uname=data.datasources[0].rows[0].username;
					utoken=data.datasources[0].rows[0].c_rong_token;
					uimage=data.datasources[0].rows[0].c_user_image;
					uimg =data.datasources[0].rows[0].c_user_image;
					uid=data.datasources[0].rows[0].uid;
					Service.listMyCounsel();
					Auto517.RongCloud.connect(utoken, function(mess) {

	});
				}
			},
			error: function(data) {
				toast.show("请求失败");
			}
		});

    Auto517.init();
	UIActionSelector = api.require('UIActionSelector');
	wx = api.require('wx');
	qq = api.require('qq');
	weibo = api.require('weibo');
	UIActionSelector = api.require('UIActionSelector');
//	Auto517.RongCloud.connect(utoken, function(mess) {
//
//	});
//	mainView.router.loadPage('html/nearby/nearbyMain.html');
}
var backMain = function() {
//	api.closeToWin({
//		name : 'root'
//	});
api.setFrameAttr({
    name: 'welcome',
    rect: {
        x: 0,
        y: headerH,
        w: 'auto',
        h: frameH
    },
    bounces: false
});
mainView.router.back({
       url:'welcome.html'	
});
}
$$(document).on('click', '.backMain', function() {
		backMain();
    var fs = api.require('fs');
		fs.rmdir({
		    path: api.cacheDir+'/om'
		}, function(ret, err) {
		    if (ret.status) {
//		        alert(JSON.stringify(ret));
		    } else {
//		        alert(JSON.stringify(err));
		    }
		});
});

function wxLogin(){
	mainView.router.loadPage('html/maillist/maillist.html');
}

function _QQ_login(){
	mainView.router.loadPage('html/nearby/personnelDynamic.html');
}

function _weibo_isInstalled(){
	mainView.router.loadPage('html/community/communityMain.html');
}

myApp.onPageBeforeInit('maillist',function(){
	removeToolbar();
})

myApp.onPageBeforeInit('personnel-dynamic',function(){
	removeToolbar();
})

myApp.onPageBeforeInit('list_community',function(){
	removeToolbar();
})

myApp.onPageBeforeInit('myServiceList',function(){
	removeToolbar();
})

myApp.onPageBeforeInit('nearby-index',function(){
	removeToolbar();
})

myApp.onPageBeforeInit('servicechat',function(){
	removeToolbar();
})

function removeToolbar(){
	api.setFrameAttr({
    name: 'welcome',
    rect: {
        x: 0,
        y: headerH,
        w: 'auto',
        h: 'auto'
    },
    bounces: false
});
}

function pageTz(num){
	if(num == 3){
		mainView.router.loadPage('html/service/myServiceList.html');
	}
	if(num == 7){
		mainView.router.loadPage('html/nearby/nearbyMain.html');
	}
}

myApp.onPageInit('neighbour-index',function(page){
//	alert(111);
	Service.listMyCounsel();
})

$$(document).on('touchstart','.bg_color',function(){
	this.style.backgroundColor = '#C0C0C0';
})
$$(document).on('touchend','.bg_color',function(){
	this.style.backgroundColor = 'white';
})

$$(document).on('click','#home_add',function(){
	home_add1 = 1;
	removeToolbar();
	mainView.router.loadPage({
				url: "html/maillist/addfriends.html"
			});
})


function showAround1(show){
	api.closeToWin({
			name : 'root',
			animation:{
		    type:"none",                //动画类型（详见动画类型常量）
		    subType:"from_right",       //动画子类型（详见动画子类型常量）
		    duration:300                //动画过渡时间，默认300毫秒
		}
	});
	api.execScript({
			sync : true,
			name : 'root',
			script : 'showAround()'
		});
}
