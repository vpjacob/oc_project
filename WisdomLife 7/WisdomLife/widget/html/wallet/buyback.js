var tokencode;
var isbank = false;
var bankcode;
var bankacount;
var bankusername;
var subbankname;
var couriercount;
var nopaycount;
var withdrawtype;
//获得银行卡列表的JSON
var result;
var urId;
var oldPwd;
var cardId;
var chooseId;
var buyNo;
var beannum='';
var title = '小客提醒';
var message ='您在小客有一笔回购,请等待平台审核!';
apiready = function() {
//	api.showProgress();
//上来就进行加载银行卡
//	bankLoad();
//显示回购的金额与数量
	
//获取选中的银行卡id
	api.getPrefs({
	    key: 'chooseId'
	}, function(ret, err) {
	     chooseId = ret.value;
	     console.log('chooseId为'+chooseId);
	     if(chooseId!=undefined && chooseId!=''){
	     	//bankList(chooseId);
	     	api.setPrefs({
				    key: 'chooseId',
				    value: ''
			});
	     }
	});
	FileUtils.readFile("info.json", function(info, err) {
			urId=info.userNo;
			count(urId);
			oldPwd(urId);
			bank(chooseId,urId);
		});
								
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		api.execScript({//刷新我的界面金币总数的数据
				name : 'my-qianbao',
//				frameName : 'room',
				script : 'refresh();'
			});
			api.closeWin();
	});
	
		$("#back").bind("click", function() {
//		alert('1')
		api.execScript({//刷新person界面数据
				name : 'my-qianbao',
//				frameName : 'room',
				script : 'refresh();'
			});

		api.closeWin();
	});
/*
 * 获得订单号
 */
function getDealNo() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    
    var strHours = date.getHours();
    var strMinutes = date.getMinutes();
    var strSeconds = date.getSeconds();
    var strMilliseconds = date.getMilliseconds();
    
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHours >= 0 && strHours <= 9) {
      strHours = "0" + strHours;
    }
    
    if (strMinutes >= 0 && strMinutes <= 9) {
      strMinutes = "0" + strMinutes;
    }
    if (strSeconds >= 0 && strSeconds <= 9) {
      strSeconds = "0" + strSeconds;
    }
    if (strMilliseconds >= 0 && strMilliseconds <= 9) {
      strMilliseconds = "00" + strMilliseconds;
    }else if(strMilliseconds >= 10 && strMilliseconds <= 99) {
      strMilliseconds = "0" + strMilliseconds;
    }
    var currentdate = date.getFullYear() + month + strDate
            + strHours + strMinutes + strSeconds + strMilliseconds;
    
    //三位随机数
    var rand = "";
    for(var i = 0; i <3;i++){
      var sjs= Math.floor(Math.random() * 10);
      rand += sjs;
    }
    currentdate += rand;
    return currentdate;
}
buyNo=getDealNo();
//获取二级密码
	function oldPwd(urId){	
		AjaxUtil.exeScript({
	      script:"managers.home.person",
	      needTrascation:true,
	      funName:"querySecondPwd",
	      form:{
	        userNo:urId
	      },
	      success:function (data) {
	      //console.log($api.jsonToStr(data));
	       if (data.formDataset.checked == 'true') {
	       		var account = data.formDataset.secondPwd;
	       		oldPwd=account;
	       		if(oldPwd==888888){
//	       			alert("您的二级密码的初始密码为888888,如果您想修改，请去个人信息完善修改！")
					$('#password').attr('placeholder','请点击修改二级密码');
					
	       		}else{
	       			$('#password').attr('placeholder','请输入二级密码');
	       		}
	         } else {
	             alert(data.formDataset.errorMsg);
	         }
	       }
	    });
	}
	$('#password').click(function(){
		if(oldPwd==888888){
			api.openWin({
				name : 'changeRealname',
				url : '../personal/changeSecondPwd.html',
				reload : true,
				slidBackEnabled : true,
				animation : {
					type : "push", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300 //动画过渡时间，默认300毫秒
				}
			});
			}
		})
	
	$('#addBank').click(function() {
		api.openWin({
			name : 'buyback-list',
			url : 'buyback-list.html',
			reload : true,
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});
	
//	api.ajax({//获取银行卡列表信息
//		url : rootUrl + '/api/commmonweal/findmyallBank',
//		method : 'post'
//	}, function(ret, err) {
//		if (ret) {
//			console.log($api.jsonToStr(ret));
//			if (ret.execStatus == "true") {
//				result = ret.formDataset.entity;
//				if (result.length == 0) {
//					api.alert({
//						msg : "您还未添加银行卡信息"
//					});
//				} else {
//					api.hideProgress();
//					var obj = [];
//					for (var i = 0; i < result.length; i++) {
//						obj.push(result[i].bankname + "  ****" + result[i].bankacount.substring(result[i].bankacount.length - 4));
//					}
//					console.log($api.jsonToStr(obj));
//					$("#picker").picker({
//						toolbarTemplate : '<header class="bar bar-nav">\<button class="button button-link pull-right close-picker">确定</button>\</header>',
//						cols : [{
//							textAlign : 'center',
//							values : obj
//						}]
//					});
//					api.showProgress();
//					api.ajax({//获取推荐人姓名
//						url : rootUrl + '/api/commmonweal/getTokenCode',
//						method : 'post'
//					}, function(ret, err) {
//						console.log($api.jsonToStr(ret));
//						if (ret) {
//							tokencode = ret.formDataset.entity.tokencode;
//						}
//						api.ajax({
//							url : rootUrl + '/api/commmonweal/findmyBank',
//							method : 'post'
//						}, function(ret, err) {
//							api.hideProgress();
//							console.log($api.jsonToStr(ret));
//							if (ret) {
//								if (!ret.formDataset.entity.accountname || ret.formDataset.entity.accountname == "") {
//									isbank = false;
//								} else {
//									isbank = true;
//									bankcode = ret.formDataset.entity.bankcode;
//									bankacount = ret.formDataset.entity.bankacount;
//									bankusername = ret.formDataset.entity.accountname;
//									subbankname = ret.formDataset.entity.subbankname;
//									couriercount = parseFloat(ret.formDataset.entity.couriercount);
//									nopaycount = parseFloat(ret.formDataset.entity.nopaycount);
//									if (couriercount == undefined && couriercount == 'undefined') {
//										couriercount = 0.00;
//									}
//									$('#beancount').html(couriercount + "颗");
//									$('#countmoney').html(couriercount + "元");
//									$('#picker').val(ret.formDataset.entity.bankname + "  ****" + bankacount.substring(bankacount.length - 4));
//								}
//							}
//						})
//					});
//				}
//			} else {
//				api.toast({
//					msg : "获取信息失败，请重试"
//				});
//			}
//		} else {
//			api.toast({
//				msg : "获取信息失败，请重试"
//			});
//		}
//	});

	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		var content = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		$api.css(content, 'margin-top:20px;');
	}

	$("#back").bind("click", function() {
		api.closeWin();
	});
//回购记录的跳转
	$("#backrecord").bind("click", function() {
		api.openWin({
			name : 'backrecord',
			url : '../personal/backcount.html',
			slidBackEnabled : true,
			animation : {
				type : "push", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	});

	function count(){
		AjaxUtil.exeScript({
	      script:"mobile.buyback.buyback",
	      needTrascation:true,
	      funName:"queryAccountInfo",
	      form:{
	        userNo:urId
	      },
	      success:function (data) {
	    	console.log("输出："+$api.jsonToStr(data));
	       if (data.formDataset.checked == 'true') {
	       		$("#beancount").html(data.formDataset.mayBack+'枚');
				$("#countmoney").html(data.formDataset.mayBack);				
	         } else {
	             alert(data.formDataset.errorMsg);
	         }
	       }
	    });
	}
	
	
// 处理银行卡下拉部分
//	function bankLoad() {
//		var selectBank = document.getElementById("selectBank");
//		selectBank.innerHTML = "";
//		var banka = new Option();
//		banka.value = "请选择开户银行";
//		banka.text = "请选择开户银行";
//		selectBank.options.add(banka);
//		for (var i = 0; i < bank.length; i++) {
//			var banka = new Option();
//			banka.value = bank[i].bankcode;
//			banka.text = bank[i].bankname;		
//			selectBank.options.add(banka);
//		}
//	}

	//console.log('chooseId为'+chooseId)
	
//	function bankList(chooseId){
//		AjaxUtil.exeScript({
//	      script:"mobile.buyback.buyback",
//	      needTrascation:true,
//	      funName:"queryBankById ",
//	      form:{
//	         id:chooseId
//	      },
//	      success:function (data) {
//	      console.log($api.jsonToStr(data));
//	       if (data.formDataset.checked == 'true') {
//	       		var account = data.formDataset.bank;
//	       		//console.log('account为'+account);
//	       		var list=$api.strToJson(account);
//	       		 cardId=list.id;
//	       		console.log('list.card_no为'+list.card_no);
//						var nowli='<div class="jia" id="'+list.id+'">'
//		       					+'<div class="left">'
//		       					+'<img src="../../image/bank1.png"/>'
//		       					+'</div>'
//		       					+'<div class="middle">'
//		       					+'<div><span id="bankName">'+list.open_bank+'</span></div>'
//          					+'<div><span id="card_no">'+list.card_no+'</span></div>'
//          					+'</div>'
//          					+'</div>';		       			
//		       			$('#addcard').append(nowli);
//		       		
//	       		
//	         } else {
//	             alert(data.formDataset.errorMsg);
//	         }
//	       }
//	    });
//	}

function bank(chooseId,urId){
		AjaxUtil.exeScript({
	      script:"mobile.buyback.buyback",
	      needTrascation:true,
	      funName:"queryBankByUserNo ",
	      form:{
	         id:chooseId,
	         userNo:urId
	      },
	      success:function (data) {
	      console.log($api.jsonToStr(data));
	       if (data.formDataset.checked == 'true') {
	       		var account = data.formDataset.bank;
	       		//console.log('account为'+account);
	       		var list=$api.strToJson(account);
	       		 cardId=list.id;
	       		console.log('list.card_no为'+list.card_no);
						var nowli='<div class="jia" id="'+list.id+'">'
		       					+'<div class="left">'
		       					+'<img src="../../image/bank1.png"/>'
		       					+'</div>'
		       					+'<div class="middle">'
		       					+'<div><span id="bankName">'+list.open_bank+'</span></div>'
            					+'<div><span id="card_no">'+list.card_no+'</span></div>'
            					+'</div>'
            					+'</div>';		       			
		       			$('#addcard').append(nowli);
		       		
	       		
	         } else {
//	             alert(data.formDataset.errorMsg);
	         }
	       }
	    });
	}

//回购 推送消息
function pushMsg(urId,title,message){
	$.ajax({
		type:"post",
		url:"http://xk.ppke.cn:8888/jdpaydemo/msgPush.htm",
		data:{userNo:urId,title:title,message:message,msgtype:"2"},
		dataType:"json",    			
		success:function(res){   
		alert(api.jsonToStr(res)); 	
 			 if(res.success==true){
 				//alert('消息推送成功!');
			}else{
				//alert('消息推送失败:'+res.tips);
			}     				
		}		
	});
 } 
//添加银行卡部分
	$('#submit').click(function(){
       //var index=document.getElementById('selectBank').selectedIndex;
       //var name=$('#personName').val();
       //var bankName=document.getElementById('selectBank').options[index].text;
      // var bankId=$('#selectBank').val();
       //var bankName=$('#bankName').html();
       //var bankNumber=$('#card_no').html();
        beannum = $("#beans").val();
       var password=$('#password').val();
       //var personNumber=$("#personNumber").val();
       //var reg = /^(\d{16}|\d{19})$/;
       //var regId=/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
		//console.log('bankName为'+bankName);
		//console.log('bankNumber为'+bankNumber);
		
		if(cardId==''||cardId==undefined){
			api.alert({
				msg : "请选择银行卡"
			}, function(ret, err) {

			});
			return false;
		}
       	if (!beannum) {
			api.alert({
				msg : "对不起,请输入您要回购的金币数！"
			}, function(ret, err) {

			});
			return false;
		}
		if (beannum >50000) {
			api.alert({
				msg : "对不起,每笔最多回购50000枚金币,请您重新输入！"
			}, function(ret, err) {
				$("#beans").val('');
			});
			return false;
		}

		if (beannum && beannum < 100) {
			api.alert({
				msg : "对不起,每次回购最少100枚金币！"
			}, function(ret, err) {
				$("#beans").val('');
			});
			return false;
		}
		if (beannum > parseInt( $("#beancount").html())) {			
			api.alert({
				msg : "您要回购的金币数大于您当前剩余金币总数!"
			}, function(ret, err) {
				$("#beans").val('');
			});
			return false;
		}
			
		var z = beannum % 100;
		if (z != 0) {
			api.alert({
				msg : "对不起,请你输入100的整倍数！"
			}, function(ret, err) {
				$("#beans").val('');
			});
			return false;
		}
		if(password==''){
			alert('请输入二级密码');
			return false;
		}
		if(password!=oldPwd){
			alert('您输入二级密码有误');
			return false;
		};
		$("#showAmount").html(beannum);
		if(beannum>0&&beannum<1000){
			$("#procedureCost").html(5);
		}else if(beannum>=1000){
			$("#procedureCost").html((beannum*0.006).toFixed(1));
		}
		$('.black_box').css('display','block');
		$('.tankuang_box').css('display','block');
		
    });

//弹框提示执行回购方法
	$("#closetankuang").click(function() {
		$('.black_box').css('display', 'none');
		$('.tankuang_box').css('display', 'none');
	});
	$("#apply").click(function() {
		$('#apply').attr('disabled', 'disabled');
		$('#submit').attr('disabled', 'disabled');
		$('.black_box').css('display', 'none');
		$('.tankuang_box').css('display', 'none');
		  submit();
	});
//提交给后台方法
    
	function submit() {
		AjaxUtil.exeScript({
			script : "mobile.buyback.buyback",
			needTrascation : true,
			funName : "buyBackApply",
			form : {
				userNo : urId,
				amount : beannum,
				bankId : cardId,
				buyNo : buyNo
			},
			success : function(data) {
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					api.alert({
						msg : "亲，您已提交成功！"
					}, function(ret, err) {
//						pushMsg(urId, title, message);
							api.execScript({//刷新我的界面金币总数的数据
								name : 'my-qianbao',
								script : 'refresh();'
							});
							api.closeWin();
					}); 
				}else{
					alert(data.formDataset.errorMsg);
					$('#submit').removeAttr('disabled');
					$('#apply').removeAttr('disabled');
				}
			}
		});
	}


}