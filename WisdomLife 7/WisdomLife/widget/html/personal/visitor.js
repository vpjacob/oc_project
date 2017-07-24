var memberid;
//记录网络类型
var connectionType;
$.init();
apiready = function() {
	memberid = api.pageParam.memberid;
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}

	$("#back").bind("click", function() {
		api.closeWin();
	});

	$("#addvisitor").bind("click", function() {
		api.openWin({//打开意见反馈
			name : 'addVisitor',
			url : 'addVisitor.html',
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
	});

	getVisitorKeys();
	
//	$(document).on('refresh', '.pull-to-refresh-content', function(e) {
//		connectionType = api.connectionType;
//		if (connectionType == 'none' || connectionType == "unknown") {
//			api.alert({
//				msg : '当前网络不可用'
//			}, function(ret, err) {
//			});
//		} else {
//			getVisitorKeys();
//				
//		}
//	});

};
function getVisitorKeys() {
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '努力加载中...',
		text : '先喝杯茶...',
		modal : false
	});
	AjaxUtil.exeScript({
		script : "login.login",
		needTrascation : false,
		funName : "getVisitorKeys",
		form : {
			memberid : memberid
		},
		success : function(data) {//请求成功
			if (data.execStatus === "true" && data.datasources[0].rows.length > 0) {
				var visitorKeysInfo = data.datasources[0].rows;
				var visitorKeyInfo = "";
				var isforbid = "";
				var isfor;
				for (var i = 0; i < visitorKeysInfo.length; i++) {
					var keyId = visitorKeysInfo[i].fid;
					console.log(visitorKeysInfo[i].isforbidden+"---------------------------");
					if( visitorKeysInfo[i].isforbidden == true)
					{
						isforbid = "再次生成";
						isfor = 0;
						visitorKeyInfo += '<li style="background-color:#FFFFFF;">'
													+'<div class="recordlist1">'
														+'<p style="font-size:18px;color:#000000;font-weight:bold;">'+ (visitorKeysInfo[i].fname=="null"?"访客": visitorKeysInfo[i].fname)
														+'<br/><span style="font-size:14px;color:#787878;font-weight:normal;">'+visitorKeysInfo[i].account
														+'</span></p>'
														+'<p style="float:right;margin-right:1rem;font-size:14px;color:#000000;font-weight:normal;line-height:10px;" id="'+keyId+'status">停用</p>'
													+'</div>'
													+'<div class="recordlist2">'
														+'<p style="float:left;font-size:14px;color: #000000;line-height: 25px;">生成日期<br/>有效期至</p>'
														+'<p style="float:right;margin-right:1rem;font-size:14px;color: #000000;line-height:25px;">'+visitorKeysInfo[i].createtime+'<br />'+visitorKeysInfo[i].timelimit.substring(0,10) +' 23:59:59</p>'
													+'</div>'
													+'<div class="recordlist3">'
														+'<input type="button" class="cancel" value="'+isforbid+'"  onclick="editVisitor(\''+visitorKeysInfo[i].fname+'\',\''+keyId+'\',\''+visitorKeysInfo[i].roomid+'\',\''+visitorKeysInfo[i].account+'\',\''+visitorKeysInfo[i].timelimit.substring(0,10)+'\',\''+visitorKeysInfo[i].des+'\','+isfor+')" style="width:70px;height:24px;border:1px solid #787878;background-color:#FFFFFF;color:#787878;font-size:14px;border-radius:3px;line-height:24px;float:right;margin-top:8px;margin-right:0.5rem;"/>'
													+'</div>'
												+'</li>';
					}
					else
					{
						isforbid = "停用";
						isfor = 1;						
						visitorKeyInfo += '<li style="background-color:#FFFFFF;">'
													+'<div class="recordlist1">'
														+'<p style="font-size:18px;color:#000000;font-weight:bold;">'+ (visitorKeysInfo[i].fname=="null"?"访客": visitorKeysInfo[i].fname)+'<br/><span style="font-size:14px;color:#787878;font-weight:normal;">'+visitorKeysInfo[i].account+'</span></p>'
														+'<p style="float:right;margin-right:1rem;font-size:14px;color:#000000;font-weight:normal;line-height:10px;" id="'+keyId+'status">使用中</p>'
													+'</div>'
													+'<div class="recordlist2">'
														+'<p style="float:left;font-size:14px;color: #000000;line-height: 25px;">生成日期<br/>有效期至</p>'
														+'<p style="float:right;margin-right:1rem;font-size:14px;color: #000000;line-height:25px;">'+visitorKeysInfo[i].createtime+'<br />'+visitorKeysInfo[i].timelimit.substring(0,10) +' 23:59:59</p>'
													+'</div>'
													+'<div class="recordlist3">'
														+'<input type="button" id="'+keyId+'"  class="cancel" value="'+isforbid+'" onclick="startOrStop(\''+keyId+'\','+isfor+')" style="width:70px;height:24px;border:1px solid #0EAAE3;background-color:#FFFFFF;color:#0EAAE3;font-size:14px;border-radius:3px;line-height:24px;float:right;margin-top:8px;margin-right:0.5rem;"/>'
													+'</div>'
												+'</li>';
					}
					
				}

				
				$("#visitorItem").html(visitorKeyInfo);
				api.hideProgress();
			}
			else
			{
				visitorKeyInfo = "<li style='text-align:center;margin-top:50px;background-color:#f0f0f0f0;'>还没有数据哦!</li>";
				$("#visitorItem").html(visitorKeyInfo);
				api.hideProgress();
			}
		}
	});
}
function startOrStop(keyId,isfor)
{
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '努力加载中...',
		text : '先喝杯茶...',
		modal : false
	});
	AjaxUtil.exeScript({
		script : "login.login",
		needTrascation : false,
		funName : "updateKeyBaseIsforbidden",
		form : {
			isforbidden : isfor,
			fid:keyId
		},
		success : function(data) {
			if (data.execStatus === "true"&&data.formDataset.checked === "true") 
			{
				if(data.formDataset.isforbidden =="1")
				{
//					$("#"+keyId).attr("value","再次生成");
//					$("#"+keyId+"status").text("停用");
//					$("#"+keyId).removeAttr("style");
//					$("#"+keyId).attr("style","width:70px;height:24px;border:1px solid #787878;background-color:#FFFFFF;color:#787878;font-size:14px;border-radius:3px;line-height:24px;float:right;margin-top:8px;margin-right:0.5rem;");
					 getVisitorKeys();
				}
				api.hideProgress();
			} 
			else 
			{
				api.alert({
					msg:"修改失败,再试试吧!"
                },function(ret,err){
                	//coding...
                });
			}
		}
	});
}
function editVisitor(name,keyId,roomid,phone,timelimit,des,isfor)
{
	var reqUrl = "../personal/editVisitor.html";
		api.openWin({
			name : 'editVisitor',
			url : reqUrl,
			bounces : false,
			pageParam: {"name":name,"roomid":roomid,"phone":phone,"timelimit":timelimit,"des":des,"keyId":keyId},
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300
			}
		});
}