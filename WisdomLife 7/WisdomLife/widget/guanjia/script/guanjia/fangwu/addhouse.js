var urId='';
var telphone='';
var bianId='';
var wait = 60;
apiready = function() {
	bianId = api.pageParam.id;
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	FileUtils.readFile("info.json", function(info, err) {
		urId = info.userNo;
//		telphone=info.telphone;
//		$('#yzPhone').val(telphone);
		//获取业主姓名
//		queryUserInfo(urId);
		
	});
	
	$(function() {
		$(".Personal_centent").hide().first().show();
		$(".step").hide().first().show();
		$(".span1").click(function() {
			$("#apply").hide();
			$("#zuhu").show();
			//查询相关的省份
			queryProvnce();
		})
		$(".span0").click(function() {
			$("#apply").show();
			$("#zuhu").hide();
		})
		$(".Personal_title span").click(function() {
			$(this).addClass("special").siblings().removeClass("special");
			$(".Personal_centent").hide().eq($(this).index()).show();
		});

	});
	
	//业主提交接口
	$('#save').click(function() {  //执行提交接口给后台
		var name = $("#ownerName").val();
		var tel = $("#tel").val();
		var ranzheng = $("#ranzheng").val();
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		 if (name == null || name == "") {
			alert("请填写您的姓名");
			return false;
		}else if (tel == null || tel == "") {
			alert("手机号码不能为空");
			return false;
		} else if (!mobileReg.test(tel)) {
			alert("手机号码格式有误");
			return false;
		} else if (ranzheng == null || ranzheng == "") {
			alert("验证码不能为空");
			return false;
		} else if(ranzheng!=identifyingCode){
			alert("您输入的验证码不正确，请重新输入");
			return false;
		}else{
			houseOwnerApply();
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
//业主提交审核接口

	function houseOwnerApply() {
		var data = {
			"userNo" : urId,
			"phone" : $("#tel").val(),
			"name" : $("#ownerName").val()
		};
		$.ajax({
			url : rootUrls + '/xk/houseOwnerApply.do',
			type : 'post',
			dataType : 'json',
			data : JSON.stringify(data),
			contentType : "application/json;charset=utf-8",
			success : function(result) {
				console.log($api.jsonToStr(result));
				var data = result.data;
				if (result.state == 1) {
					alert(result.msg);
					api.execScript({//刷新银行卡列表页面
						name : 'myhouse',
						script : 'refresh();'
					});
					api.closeWin({
					});
				} else {
					alert(result.msg);
				}
			}
		});
	}



	//我是租户部分提交
	$('#zuhu').click(function(){
		if($('#beginTime').html()=='请选择开始时间'){
			alert('请选择开始时间');
			return false;
		};
		 if($('#endTime').html()=='请选择结束时间'){
			alert('请选择结束时间');
			return false;
		};
		if($('#beginTime').html()>$('#endTime').html()){
			alert('请输入正确的租房时间');
			return false;
		};
		if($('#tempName').val()==''){
			alert('请输入业主的名字');
			return false;
		};
		if($('#tempTel').val()==''){
			alert('请输入业主手机号');
			return false;
		};
		submitTenementHouseApply();
	});

	
//23，根据用户编号查找用户真实姓名等信息	
//function queryUserInfo(urId){
//         var data = {
//             "userNo":urId
//        };
//          $.ajax({  
//                url:rootUrls+'/xk/queryUserInfo.do',  
//                type:'post',  
//                dataType:'json',  
//                data:JSON.stringify(data),  
//                contentType: "application/json;charset=utf-8",
//                success:function(result){  
//                	 console.log($api.jsonToStr(result));  
//                	  var data= result.data;
//                	 if(result.state==1){
//                      $('#name').val(data.realName);
//                    }else{  
////                        alert("2");
//                    } 
//                }  
//        }); 
//	}	
	$('#beginTime').click(function() {
		api.openPicker({
    		type: 'date',
		    date: '',
		    title: '选择时间'
		}, function(ret, err) {
			var userDate = ret.year+"-"+ret.month+"-"+ret.day;
			//$("#show").attr('value', userDate);
			$("#beginTime").html(userDate);
    		if (ret) {
    	} 
		});
	});
	$('#endTime').click(function() {
		api.openPicker({
    		type: 'date',
		    date: '',
		    title: '选择时间'
		}, function(ret, err) {
			var userDate = ret.year+"-"+ret.month+"-"+ret.day;
			//$("#show").attr('value', userDate);
			$("#endTime").html(userDate);
    		if (ret) {
    	} 
		});
	});
//16，提交租户房屋信息审核
	function submitTenementHouseApply(){
		var data = {
             userNo:urId,
	         phone:$('#tempTel').val(),
	         name:$('#tempName').val(),
	         province :$('#provinceTemp option:selected').attr('id'),
	         city:$('#cityTemp option:selected').attr('id'),
	         district:$('#districtTemp option:selected').attr('id'),
	         street:$("#streetTemp option:selected" ).attr('id'),
	         communityId:$("#xiaoquTemp option:selected" ).attr('id'),
	         buildingId:$("#bulidingTemp option:selected" ).attr('id'),
	         unitId: $("#unitNameTemp option:selected").attr('id'),
	         roomId:$("#roomIdTemp option:selected").attr('id'),
	         startTime :$('#beginTime').html(),
	         endTime :$('#endTime').html(),
          };
            $.ajax({  
                  url:rootUrls+'/xk/submitTenementHouseApply.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));
                      if(result.state==1){
                          alert(result.msg);
                        	api.execScript({//实现我的房屋回显刷新
								name : 'myhouse',
								script : 'refresh()'
							});
							api.closeWin({});
                        
                      }else{  
                          alert(result.msg);
                      }  
                  }  
          }); 
	}
	
}
//33,查找所有的省份
	function queryProvnce(){
		$('#cityTemp').html('<option>请选择</option>');
		$('#districtTemp').html('<option>请选择</option>');
		$('#streetTemp').html('<option>请选择</option>');
		$('#xiaoquTemp').html('<option>请选择</option>');
		$('#bulidingTemp').html('<option>请选择</option>');
		$('#unitNameTemp').html('<option>请选择</option>');
		$('#roomIdTemp').html('<option>请选择</option>');
           var data = {};
            $.ajax({  
                  url:rootUrls+'/xk/queryProvnce.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));  
                  	 var data= result.data;
                  	 var nowList='<option>请选择</option>';
                  	 if(result.state==1){
			             if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
			       				api.toast({
			                       msg:'暂无相关省份信息'
		                     });
									return false;
							}else{
							for(var i=0;i<data.length;i++){
					       		 nowList+='<option id="'+data[i].id+'" >'+data[i].name+'</option>';
					       		}
					       		$('#provinceTemp').append(nowList);
							}
                      }else{  
                          //alert("2");
                      }
                  }  
          }); 
	}
//queryProvnce();
//34,查找所有的市
	function queryCityByProvinceId(){
		$('#cityTemp').html('<option>请选择</option>');
		$('#districtTemp').html('<option>请选择</option>');
		$('#streetTemp').html('<option>请选择</option>');
		$('#xiaoquTemp').html('<option>请选择</option>');
		$('#bulidingTemp').html('<option>请选择</option>');
		$('#unitNameTemp').html('<option>请选择</option>');
		$('#roomIdTemp').html('<option>请选择</option>');
           var data = {
           		"provinceId":$('#provinceTemp option:selected').attr('id'),
           };
            $.ajax({  
                  url:rootUrls+'/xk/queryCityByProvinceId.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));  
                  	 var data= result.data;
                  	 var nowList='<option>请选择</option>';
                  	 if(result.state==1){
			             if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
			       				api.toast({
			                       msg:'暂无相关市信息'
		                     });
									return false;
							}else{
							for(var i=0;i<data.length;i++){
					       		 nowList+='<option id="'+data[i].id+'" >'+data[i].name+'</option>';
					       		}
					       		$('#cityTemp').html(nowList);
							}
	         
                      }else{  
                          //alert("2");
                      }
                  }  
          }); 
	};
	
//35,查找所有的区县
	function queryAreaByCityId(){
		$('#districtTemp').html('<option>请选择</option>');
		$('#streetTemp').html('<option>请选择</option>');
		$('#xiaoquTemp').html('<option>请选择</option>');
		$('#bulidingTemp').html('<option>请选择</option>');
		$('#unitNameTemp').html('<option>请选择</option>');
		$('#roomIdTemp').html('<option>请选择</option>');
           var data = {
           		"cityId":$('#cityTemp option:selected').attr('id'),
           };
            $.ajax({  
                  url:rootUrls+'/xk/queryAreaByCityId.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));  
                  	 var data= result.data;
                  	 var nowList='<option>请选择</option>';
                  	 if(result.state==1){
			             if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
			       				api.toast({
			                       msg:'暂无相关市信息'
		                     });
									return false;
							}else{
							for(var i=0;i<data.length;i++){
					       		 nowList+='<option id="'+data[i].id+'" >'+data[i].name+'</option>';
					       		}
					       		$('#districtTemp').html(nowList);
							}
	         
                      }else{  
                          //alert("2");
                      }
                  }  
          }); 
	};	
//36,查找所有的街道
	function queryStreetByAreaId(){
		$('#streetTemp').html('<option>请选择</option>');
		$('#xiaoquTemp').html('<option>请选择</option>');
		$('#bulidingTemp').html('<option>请选择</option>');
		$('#unitNameTemp').html('<option>请选择</option>');
		$('#roomIdTemp').html('<option>请选择</option>');
           var data = {
           		"areaId":$('#districtTemp option:selected').attr('id'),
           };
            $.ajax({  
                  url:rootUrls+'/xk/queryStreetByAreaId.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));  
                  	 var data= result.data;
                  	 var nowList='<option>请选择</option>';
                  	 if(result.state==1){
			             if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
			       				api.toast({
			                       msg:'暂无相关街道信息'
		                     });
									return false;
							}else{
							for(var i=0;i<data.length;i++){
					       		 nowList+='<option id="'+data[i].id+'" >'+data[i].name+'</option>';
					       		}
					       		$('#streetTemp').html(nowList);
							}
	         
                      }else{  
                          //alert("2");
                      }
                  }  
          }); 
	};	
//15,查找所有的小区
	function queryAllHasEstateCommunityTemp(){
		$('#xiaoquTemp').html('<option>请选择</option>');
		$('#bulidingTemp').html('<option>请选择</option>');
		$('#unitNameTemp').html('<option>请选择</option>');
		$('#roomIdTemp').html('<option>请选择</option>');
           var data = {
           		"province":$('#provinceTemp option:selected').attr('id'),
           		"city":$('#cityTemp option:selected').attr('id'),
           		"district":$('#districtTemp option:selected').attr('id'),
           		"street":$('#streetTemp option:selected').attr('id'),
           };
            $.ajax({  
                  url:rootUrls+'/xk/queryAllHasEstateCommunity.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));  
                  	 var data= result.data;
                  	 var nowList='<option>请选择</option>';
                  	 if(result.state==1){
			             if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
			       				api.toast({
			                       msg:'暂无相关小区信息'
		                     });
									return false;
							}else{
							for(var i=0;i<data.length;i++){
					       		 nowList+='<option id="'+data[i].id+'" >'+data[i].communityName+'</option>';
					       		}
					       		$('#xiaoquTemp').html(nowList);
							}
	         
                      }else{  
                          //alert("2");
                      }
                  }  
          }); 
	};	
	
	
	
	//15，根据省市地区查询所有有物业的小区信息		
//	function queryAllHasEstateCommunity(){
//		$('#xiaoquTemp').html('<option>请选择</option>');
//		$('#bulidingTemp').html('<option>请选择</option>');
//		$('#unitNameTemp').html('<option>请选择</option>');
//		$('#roomIdTemp').html('<option>请选择</option>');
//         var data = {
//             "province":$('#provinceTemp option:selected').val(),
//             "city":$("#cityTemp option:selected" ).val(),
//             "district": $("#districtTemp option:selected" ).val()
//        };
//          $.ajax({  
//                url:rootUrls+'/xk/queryAllHasEstateCommunity.do',  
//                type:'post',  
//                dataType:'json',  
//                data:JSON.stringify(data),  
//                contentType: "application/json;charset=utf-8",
//                success:function(result){  
//                	 console.log($api.jsonToStr(result));  
//                	 var data= result.data;
//                	 var nowList='<option>请选择</option>';
//                	 if(result.state==1){
//			             if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
//			       				api.toast({
//			                       msg:'暂无相关小区信息'
//		                     });
//									return false;
//							}else{
//							for(var i=0;i<data.length;i++){
//					       		 nowList+='<option id="'+data[i].id+'" >'+data[i].communityName+'</option>';
//					       		}
//					       		$('#xiaoquTemp').html(nowList);
//							}
//	         
//                    }else{  
//                        //alert("2");
//                    }
//                }  
//        }); 
//	}		
	//queryAllHasEstateCommunity();	
	
	
	
	//4.根据小区id查找是否存在物业 租户
//	function isHaveEstateByCommunityIdTemp(){
//         var data = {
//             "communityId":$("#xiaoquTemp option:selected" ).attr('id'),
//        };
//          $.ajax({  
//                url:rootUrls+'/xk/isHaveEstateByCommunityId.do',  
//                type:'post',  
//                dataType:'json',  
//                data:JSON.stringify(data),  
//                contentType: "application/json;charset=utf-8",
//                success:function(result){  
//                	 console.log($api.jsonToStr(result));
//                    if(result.state==1){
//						if(result.data==1){
//							$('.buildingRoomTemp').css('display','none');
//							$('.showAddressTemp').css('display','block');
//						}else if(result.data==2){
//							$('.buildingRoomTemp').css('display','block');
//							$('.showAddressTemp').css('display','none');
//							queryBuildingByCommunityIdTemp();
//						}
//                    }else{  
////                        alert(result.msg);
//                    }  
//                }  
//        }); 
//	}
//5.根据小区id查找所关联的楼栋信息  租户
	function queryBuildingByCommunityIdTemp(){
		$('#bulidingTemp').html('<option>请选择</option>');
		$('#unitNameTemp').html('<option>请选择</option>');
		$('#roomIdTemp').html('<option>请选择</option>');
           var data = {
               "communityId":$("#xiaoquTemp option:selected" ).attr('id'),
          };
            $.ajax({  
                  url:rootUrls+'/xk/queryBuildingByCommunityId.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 var data= result.data;
                 	 var nowList='<option>请选择</option>';
                      if(result.state==1){
	                      if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
			       				api.toast({
			                       msg:'暂无相关楼栋信息'
		                     });
									return false;
							}else{
							for(var i=0;i<data.length;i++){
					       		 nowList+='<option id="'+data[i].id+'" >'+data[i].buildingName+'</option>';
					       		}
					       		$('#bulidingTemp').html(nowList);
							}
                      }else{  
//                        alert(result.msg);
                      }  
                  }  
          }); 
	}
//6.根据小区id和楼栋id查找单元信息      租户
function queryUnitByComIdAndBuildIdTemp(){
		$('#unitNameTemp').html('<option>请选择</option>');
		$('#roomIdTemp').html('<option>请选择</option>');
           var data = {
               "communityId": $("#xiaoquTemp option:selected" ).attr('id'),
               "buildingId":$("#bulidingTemp option:selected" ).attr('id')
          };
            $.ajax({  
                  url:rootUrls+'/xk/queryUnitByComIdAndBuildId.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 var data= result.data;
                 	 var nowList='<option>请选择</option>';
                      if(result.state==1){
                        if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
			       				api.toast({
			                       msg:'暂无相关单元信息'
		                     });
									return false;
							}else{
							for(var i=0;i<data.length;i++){
					       		 nowList+='<option id="'+data[i].id+'" >'+data[i].unitName +'</option>';
					       		}
					       		$('#unitNameTemp').html(nowList);
							}
                      }else{  
//                        alert(result.msg);
                      }  
                  }  
          }); 
	}
	//7.根据小区id和楼栋id和单元id查找房屋信息  租户
	function queryRoomByComIdAndBuildIdAndunitIdTemp(){
		$('#roomIdTemp').html('<option>请选择</option>');
           var data = {
               "communityId": $("#xiaoquTemp option:selected" ).attr('id'),
               "buildingId":$("#bulidingTemp option:selected" ).attr('id'),
               "unitId": $("#unitNameTemp option:selected" ).attr('id'),
          };
            $.ajax({  
                  url:rootUrls+'/xk/queryRoomByComIdAndBuildIdAndunitId.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 var data= result.data;
                 	 var nowList='<option>请选择</option>';
                      if(result.state==1){
                       if (data.length == undefined || data.length == 0 || data == undefined || data == '' || data.length == '') {
			       				api.toast({
			                       msg:'暂无相关房间号'
		                     });
									return false;
							}else{
							for(var i=0;i<data.length;i++){
					       		 nowList+='<option id="'+data[i].id+'" >'+data[i].roomName+'</option>';
					       		}
					       		$('#roomIdTemp').html(nowList);
							}
                      }else{  
//                        alert(result.msg);
                      }  
                  }  
          }); 
	}	
//时间转化 YY-MM-DD
	
	
	
function goBack() {
		api.closeWin({
		});
	}
