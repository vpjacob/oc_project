var memberid;
var roomInfo={};
var places= new Array();
var account = "";
apiready = function() {
	memberid = api.getPrefs({
	    sync:true,
	    key:'memberid'
    });
	 account = api.getPrefs({
	    sync:true,
	    key:'account'
    });
	var membercode = api.getPrefs({
		sync : true,
		key : 'membercode'
	});
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}

	$("#back").bind("click", function() {
		api.closeWin();
	});
	
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

	$("#timeLimited").calendar({
		value : [curDateTime()],
		minDate : curDateTime(),
		onChange : function(p, values, displayValues) {
			if (curDateTime() != displayValues) {
				$("#timeLimited").val(displayValues);
			}
		}
	});

	//根据用户id获取房间信息
	AjaxUtil.exeScriptSync({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getroomByIdAddVisitor",
		form : {
			memberid : memberid
		},
		success : function(data) {

			if (data.execStatus == 'true') {
				//用户所有房间
				var roomPlaceInfo = data.datasources[0].rows;
				for (var i = 0; i < roomPlaceInfo.length; i++) {
					var place =  roomPlaceInfo[i].area + roomPlaceInfo[i].name +roomPlaceInfo[i].fno+roomPlaceInfo[i].roomno;
					var roomid = roomPlaceInfo[i].roomid;
					roomInfo[place]=roomid;	
					places[i]=place;			
				}

				$("#roomInfo").picker({
				  toolbarTemplate: '<header class="bar bar-nav">\
				  <button class="button button-link pull-right close-picker">确定</button>\
				  <h1 class="title">请选择房间信息</h1>\
				  </header>',
				  cols: [
				    {
				      textAlign: 'center',
				      values:places
				    }
				  ]
				});
			} else {
				api.alert({
					title : '提示',
					msg : '获取房间信息失败',
				}, function(ret, err) {
				});
				return false;
			}
		}
	});


    $("#addVisitor").bind("click", function() {
    			var roominfo=$("#roomInfo").val();
	        var name=$("#name").val()==''?"访客":$("#name").val();    	
	        var telphone=$("#telphone").val(); 
	    		var timelimited=$("#timeLimited").val(); 
	        var memo=$("#memo").val(); 
	        
	    		if(roominfo==''){ 
		    	  	api.alert({
					msg : '请选择房间!'
				}, function(ret, err) {
				});	
				return;
		    	}
	    	
			if (telphone.length!=11) {
				api.alert({
					msg : '请填写正确的手机号!'
				}, function(ret, err) {
					$("#telphone").val("").focus();
				});
				return;
			}
			
			if(telphone==account)
			{
				api.alert({
					msg : '不要添加自己呦!'
				}, function(ret, err) {
					$("#telphone").val("").focus();
				});
				return;
			}
			
			if(timelimited==''){ 
		    	  	api.alert({
					msg : '请选择到期时间!'
				}, function(ret, err) {
				});	
				return;
		    	}
		    	
		    	//开始验证当前选中房间的到期时间是否大于租户到期时间
		    	var roomInfoName = $("#roomInfo").val();
			var roomid = roomInfo[roomInfoName];
		    	AjaxUtil.exeScript({
				script : "login.login",
				needTrascation : false,
				funName : "validateTimelimited",
				form : {
					myroomid: roomid,
					timelimited:timelimited,
					memberid:memberid
				},
				success : function(data) {//请求成功
				console.log("-------------dddd--------"+$api.jsonToStr(data));
		            if (data.execStatus === "true" && data.formDataset.checked === "true") {
		                   var telphones = new Array();
							telphones[0]=telphone;
							api.sms({
							    numbers:telphones,
							    text: '房主已经为您发放了家里的临时钥匙!'
							}, function(ret, err) {
							       addVisitorInfo(roominfo,name,telphone,timelimited,memo);
							});
					}
					else if (data.execStatus === "true" && data.formDataset.checked === "false") {
						api.alert({
							msg:'到期时间不能大于当前租期'
                        },function(ret,err){
                        	//coding...
                        });
					}
				}
			  });
		    	
       
	});
	function addVisitorInfo(roominfo,name,telphone,timelimited,memo)
	{
		var phoneId = api.deviceId;
		var registrationId = api.getPrefs({
			sync : true,
			key : 'registrationId'
		});
		
		var roomInfoName = $("#roomInfo").val();
		var roomid = roomInfo[roomInfoName];
		AjaxUtil.exeScript({//插入一条反馈
		script : "login.login",
		needTrascation : false,
		funName : "addVisitorInfo",
		form : {
			pwd:$.md5("000000"),
			myroomid: roomid,
			name:name,
			telphone:telphone,
			timelimited:timelimited,
			memo:memo,
			memberid:memberid,
			membercode:membercode,
			phoneid:phoneId,
			registrationid:registrationId
		},
		success : function(data) {//请求成功
            if (data.execStatus === "true" && data.formDataset.checked === "true") {
                   api.alert({
						msg : '临时钥匙添加成功!'
					}, function(ret, err) {
					//刷新
					api.execScript({
						sync : true,
						name : 'visitor',
						script : 'getVisitorKeys();'
					});
						setTimeout(function() {
							api.closeWin({
								name : 'addVisitor'
							});
						}, 500);
					});	
			}
		}
	   });
	}
}; 