var urId='';
apiready = function() {
	var header = $api.byId('header');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}

	FileUtils.readFile("info.json", function(info, err) {
			urId=info.userNo;
			queryUserInfoUserNo(urId);
		});

    //返回刷新
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		
			api.closeWin();
	});
	
	function refresh() {
		location.reload();

	}
	
	$('#goback').click(function(){
			api.closeWin({
	        });
	         
		});
		
	
			
	$('#sub').click(function(){
		addBank(urId);
		
	})	
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
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					var account = data.formDataset.userInfo;
					var list = $api.strToJson(account);
					if(list.real_name=='undefined' || list.real_name==null || list.real_name==''){
//						$('#master').attr('placeholder','请输入持卡人姓名');
						alert('请去个人中心完善您的真实姓名,否则影响您的回购功能');
						api.closeWin({});
						return false;
					}else{
						$('#master').val(list.real_name);
					};
					if(list.idcard=='undefined' || list.idcard==null || list.idcard==''){
//						$('#identity').attr('placeholder','请输入您的身份证号');
						alert('请去个人中心完善您的身份证号,否则影响您的回购功能');
						api.closeWin({});
						return false;
					}else{
						$('#identity').val(list.idcard);
					}
					

				} else {
//					alert(data.formDataset.errorMsg);
				}
			}
		});
	};
//提交相关的
	function addBank(urId){
		var master=$('#master').val();
		var bank=$('#bank').html();
		var card_no=$('#card_no').val();
		var reg = /^(\d{16}|\d{19})$/;
		var regId=/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
		var identity=$('#identity').val();
		if(master==''){
			api.alert({
			   msg : '请去个人中心完善您的姓名'
		   })
		   return false;
		};
		if(identity==''){
			api.alert({
			   msg : '请去个人中心完善您的身份证号'
		   })
		   return false;
		}else if(!regId.test(identity)){
			api.alert({
			   msg : '请输入正确身份证号'
		   })
		   return false;
		};
		if($('#province option:selected').val()==''){
			api.alert({
			   msg : '请输入银行卡所在省'
		   })
		   return false;
		};
		if($('#city option:selected').val()==''){
			api.alert({
			   msg : '请输入银行卡所在市'
		   })
		   return false;
		};
		if($('#bank option:selected').val()=='请选择'){
			api.alert({
			   msg : '请选择要转入的银行'
		   })
		   return false;
		};
		
		if( !card_no){
          api.alert({
			   msg : '请输入银行卡号'
		   })
		   return false;
		}else if(!reg.test(card_no)){
			api.alert({
			   msg : '请输入正确银行卡号'
		   })
		   return false;
		}
		
		AjaxUtil.exeScript({
	      script:"mobile.buyback.buyback",
	      needTrascation:true,
	      funName:"addBankInfo",
	      form:{
	        userNo:urId,
	        master:master,
	        bank:$('#bank option:selected').val(),
	        card_no:card_no,
	        province:$('#province option:selected').val(),
	        city:$('#city option:selected').val(),
	        identity_card:identity
	      },
	     
			success:function (data) {
				console.log($api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					api.toast({
						msg : "亲，您提交成功！"
					});
					setTimeout(function() {
						
						api.execScript({//刷新银行卡列表页面
							name : 'buyback-list',
							//frameName : 'buyback-list',
							script : 'refresh();'
						});
						api.closeWin();
					}, 1000)
				}else{
					alert(data.formDataset.errorMsg);
				}
			}
	    });
	}
	
}