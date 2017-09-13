var urId;
var oldPwd;
apiready = function() {
var header = $api.byId('header');
var cc = $api.dom('.content');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
		$api.css(cc, 'margin-top:20px;');
	}
	
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    oldPwd(urId);
		
	$('#goback').click(function(){
		api.closeWin({
        });
	});
	
	
//	$('#oldpwd').blur(function(){
//		var oldpwd=$('#oldpwd').val();
//		if(oldpwd==""){
//			alert("亲，请输入的旧密码");
//		}else if(oldPwd!=oldpwd){
//			alert("亲，您输入的旧密码错误");
//			return false;
//		}
//	})
	
	$('#sub').click(function(){
		var oldpwd=$('#oldpwd').val();
		var num=$('#num').val();
		var vCode=$('#vCode').val();
		var zg=/^\d{6}$/
		console.log('typeof(num)'+typeof(num))
		if(oldpwd==""){
			alert("亲，请输入的旧密码");
			return false;
		}else if(oldPwd!=oldpwd){
			alert("亲，您输入的旧密码错误");
			return false;
		}else if(num==''){
			alert('亲， 请输入您的新密码');
			return false;
		}else if(!zg.test(num)){
			alert('亲，您的新密码应为六位纯数字');
			return false;
		}else if(vCode==''){
			alert('亲，输入您的确认密码');
			return false;
		}else if(!zg.test(vCode)){
			alert('亲，您的确认新密码应为六位纯数字');
			return false;
		}else if( num!=vCode){
			alert('亲，您输入的两次密码不一致');
			return false;
		}else{
			sub(urId);
			api.toast({
					msg : "亲，您提交成功！"
				});
			setTimeout(function(){
				api.closeWin();
				api.execScript({//刷新银行卡列表页面
				name : 'buyback',
				//frameName : 'buyback-list',
				script : 'refresh();'
			});
			},1500);
			
		}
	})
	
	function oldPwd(urId){	
		AjaxUtil.exeScript({
	      script:"managers.home.person",
	      needTrascation:true,
	      funName:"querySecondPwd",
	      form:{
	        userNo:urId
	      },
	      success:function (data) {
	      console.log($api.jsonToStr(data));
	       if (data.formDataset.checked == 'true') {
	       		var account = data.formDataset.secondPwd;
	       		oldPwd=account;
				if(oldPwd==888888){
//	       			alert("您的二级密码的初始密码为888888,如果您想修改，请去个人信息完善修改！")
					$('#oldpwd').attr('placeholder','初始密码为六个8');
					
	       		}else{
	       			$('#oldpwd').attr('placeholder','请输入您的旧密码');
	       		}
	         } else {
	             alert(data.formDataset.errorMsg);
	         }
	       }
	    });
	}
	
	function sub(urId){
		var vCode=$('#vCode').val();
		AjaxUtil.exeScript({
	      script:"managers.home.person",
	      needTrascation:true,
	      funName:"updateSecondPwd",
	      form:{
	        userNo:urId,
	        secondPwd:vCode
	      },
	      success:function (data) {
//	       if (data.formDataset.checked == 'true') {
//	       		var account = data.formDataset.secondPwd;
//			    oldPwd=$api.strToJson(account);	
//	         } else {
//	             alert(data.formDataset.errorMsg);
//	         }
	       }
	    });
	}
	
}