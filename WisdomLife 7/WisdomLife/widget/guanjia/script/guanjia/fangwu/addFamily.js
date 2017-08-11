var wait = 60;
var identifyingCode=''
var communityId='';
var buildingId='';
var unitId='';
var roomId='';
apiready = function() {
//	兼容ios
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
		//addFamilyMember(urId);
	});
	communityId = api.pageParam.communityId;
	buildingId = api.pageParam.buildingId;
	unitId = api.pageParam.unitId;
	roomId = api.pageParam.roomId;
	//alert('添加'+buildingId);
//	alert(buildingId);
//	alert(unitId);
//	alert(roomId);
//提交接口
	$('#save').click(function() {  //执行提交接口给后台
		var name = $("#name").val();
		var tel = $("#tel").val();
		var ranzheng = $("#ranzheng").val();
		var idCard = $('#idCard').val();
		var regId=/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		 if (name == null || name == "") {
			alert("请填写申请人");
			return false;
		}else if (idCard == null || idCard == "") {
			alert("请输入您的身份证号码");
			return false;
		} else if (!regId.test(idCard)) {
			alert("您输入的身份证号有误");
			return false;
		} else if (tel == null || tel == "") {
			alert("联系电话不能为空");
			return false;
		} else if (!mobileReg.test(tel)) {
			alert("联系电话格式有误");
			return false;
		} else if (ranzheng == null || ranzheng == "") {
			alert("验证码不能为空");
			return false;
		} else if(ranzheng!=identifyingCode){
			alert("您输入的验证码不正确，请重新输入");
			return false;
		}else{
			addFamilyMember();
		}
	});
	
	$('#getId').click(function(){ //获取验证码
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		var tel = $("#tel").val();
		if (tel == null || tel == "") {
			alert("联系电话不能为空");
			return false;
		} else if (!mobileReg.test(tel)) {
			alert("联系电话格式有误");
			return false;
		} else {
			time(this);
			sendIdentifyingCode();
		}
	});
	
	
	/**
	 * 发送验证码
	 */
	function sendIdentifyingCode() {
		AjaxUtil.exeScript({
			script : "login.login", //need to do
			needTrascation : false,
			funName : "sendIdentifyingCode",
			form : {
				telphone : $("#tel").val()
			},
			success : function(data) {
			console.log($api.jsonToStr(data));
				if (data.formDataset.checked === "true") {
					identifyingCode = data.formDataset.code;
					console.log(identifyingCode+"******************************");
					if (identifyingCode != "") {
						api.alert({
							title : '系统提示',
							msg : '验证码发送成功!'
						}, function(ret, err) {

						});
					} else {
						api.alert({
							title : '系统提示',
							msg : '验证码发送失败!'
						}, function(ret, err) {
							//coding...
						});
					}
				}
			}
		});
	}
	
	//倒计时效果
	function time(o) {
		if (wait == 0) {
			o.removeAttribute("disabled");
			$(o).html( "获取验证码");
			o.style.background = "#ffffff";
			wait = 60;
		} else {
			o.setAttribute("disabled", true);
			$(o).html("重新发送(" + wait + ")");
			o.style.background = "#bfbfbf";
			wait--;
			setTimeout(function() {
				time(o)
			}, 1000)
		}
	}
//19，新增绑定家庭成员	
	function addFamilyMember(){
		var data = {
             userNo:urId,
             phone:$("#tel").val(),
             name :$("#name").val(),
             identity:$('#idCard').val(),
	         communityId:communityId,
	         buildingId:buildingId,
	         unitId: unitId,
	         roomId:roomId,
	         relation :$('#relate option:selected').val()
          };
            $.ajax({  
                  url:rootUrls+'/xk/addFamilyMember.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));
                      if(result.state==1){
                        alert(result.msg);
                        api.execScript({//实现添加家庭成员的回显刷新
							name : 'family',
							script : 'refresh()'
						});
						api.closeWin();
                      }else{  
                          alert(result.msg);
                      }  
                  }  
          }); 
	};
//20，成员类型列表
function relationList(){
		var data = {};
            $.ajax({  
                  url:rootUrls+'/xk/relationList.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));
                  	 var data= result.data; 
                  	 var nowList=''
                      if(result.state==1){
                      	 if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
		       				api.toast({
		                       msg:'暂无'
	                     });
								return false;
						}else{
							for(var i=0;i<data.length;i++){
								nowList+='<option value="'+data[i].key+'">'+data[i].name+'</option>'
							}
							$('#relate').html(nowList);
						}	
                      }else{  
                      }  
                  }  
          }); 
	};
	relationList();
}
function goBack() {
		api.closeWin({
		});
	}