var urId="";
var awardId=""
apiready = function() {
	$("#back").click(function() {
		api.closeWin();
	});
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    queryTaskPlan();
	
	var closePage = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(closePage, 'margin-top:1.1rem');
	};
	
    var scanner = api.require('scanner');
	$("#getButton").click(function() {
		if ($("#getButton").html() == "领取奖品") {
			$(".black_box").show();
			$(".tankuang_box").show();
		} else {
		var address = rootUrl + "/jsp/recommendmobile?userNo=" + urId + "&userType=1";
		//请求二维码模块
		scanner.encode({
			string : address,
			save : {
				imgPath : 'fs://',
				imgName : 'referUser.png'
			}
		}, function(ret, err) {
			if (ret.status) {
				api.openWin({
					name : 'myReferer',
					url : '../personal/myReferer.html',
					pageParam : {
						imgpath : ret.savePath
					},
					slidBackEnabled : true,
					animation : {
						type : "push", //动画类型（详见动画类型常量）
						subType : "from_right", //动画子类型（详见动画子类型常量）
						duration : 300 //动画过渡时间，默认300毫秒
					}

				});
			} else {
				api.alert({
					msg : JSON.stringify(err)
				}, function(ret, err) {
					//coding...
				});
			}
		});
		}
	});
	$(".close").click(function() {
		$(".black_box").hide();
		$(".tankuang_box").hide();
	});
	$(".postInfo").click(function() {
		var telphone = $("#telphone").val();
		var name = $("#name").val();
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if (name == "") {
			alert("请输入名字");
			return false;
		} else if (telphone == "") {
			alert("请输入手机号码");
			return false;
		} else if (!mobileReg.test(telphone)) {
			alert("手机号格式有误");
			return false;
		} else if ($("#addressInfo").html().replace(/<[^>]*>/g, "") == "") {
			alert("请输入详细地址");
			return false;
		} else {
			updateAddressAndStatus();
		}

	});
	
	//获取当前奖品 及推荐人数
	function queryTaskPlan() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myaward",
			needTrascation : true,
			funName : "queryTaskPlan ",
			form : {
				userNo : urId
			},
			success : function(data) {
				api.hideProgress();
				console.log("获取当前奖品 及推荐人数"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var list = data.formDataset.taskStatus;
					var award=$api.strToJson(data.formDataset.award);
					var awardReord=$api.strToJson(data.formDataset.awardReord);
					if(list==2){
						$("#getButton").html("领取奖品");
					}else if(list==3){
						$("#getButton").html("任务过期");
					}else if(list==4){
						$("#getButton").html("已经领取");
					}else if(list==0){
						$(".bottom").hide();
						api.toast({
	                        msg:'只限新用户参加！'
                        });
						return false;
					}
					
					$("#number").html(data.formDataset.finishPeople+"/"+data.formDataset.count+"人");
					var finishPeople=((data.formDataset.finishPeople)/(data.formDataset.count))*100;
					//走进度条
					$(".charts").each(function(i, item) {
						$(item).animate({
							width : finishPeople + "%"
						}, 1000);
					}); 
					$("#prizename").html(award.name);
//					$("#titleprice").attr("src",rootUrl + award.img_url);
					awardId=awardReord.id;
				}else{
					console.log(data.formDataset.errorMsg);
				}
			},
			error : function(xhr, type) {
				api.hideProgress();
				alert("您的网络不给力啊，检查下是否连接上网络了！");
			}
		});
	};
	
	function updateAddressAndStatus() {
		api.showProgress({});
		AjaxUtil.exeScript({
			script : "mobile.myegg.myaward",
			needTrascation : true,
			funName : "updateAddressAndStatus",
			form : {
				recordId  : awardId,
				name:$("#name").val(),
				address:$("#addressInfo").html().replace(/<[^>]*>/g, ""),
				phone :$("#telphone").val()
			},
			success : function(data) {
				api.hideProgress();
				console.log("领取奖品"+$api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					$(".black_box").hide();
					$(".tankuang_box").hide();
					api.toast({
	                    msg:'您已提交上去'
                    });
                    setTimeout(function(){
	                    api.closeWin();
                    },1000);
				} else {
					console.log(data.formDataset.errorMsg);
				}
			},
			error : function(xhr, type) {
				api.hideProgress();
				alert("您的网络不给力啊，检查下是否连接上网络了！");
			}
		});
	};

}