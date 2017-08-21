var defaultFlag="";
var provinceId="";
var cityId="";
var districtId="";
var userInfo="";
var hideflag='';
apiready = function() {
	var header = $api.byId('title');
//	var cc = $api.dom('.iosBox');
	var editAddressId = api.pageParam.id;
//	alert(editAddressId);
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:1.1rem;');
	};	
	FileUtils.readFile("info.json", function(info, err) {
		userInfo = info;
	});
	queryDeliveryById();
	//33,查找所有的省份
	function queryProvnce(provinceId,cityId,disId){
		$('#cityTemp').html('<option>请选择</option>');
		$('#districtTemp').html('<option>请选择</option>');
		$('#streetTemp').html('<option>请选择</option>');
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
                  	 var nowList='<option value="0">请选择</option>';
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
					       	//调用数据的回显功能
							}	
							$("#provinceTemp option").each(function() {
								if ($(this).attr("id") == provinceId) {
									$(this).attr("selected", "true");
								}
							}); 		
							queryCityByProvinceId(provinceId,cityId,disId);				
                      }else{  
                          //alert("2");
                      }
                  },
                  error : function() {
					api.alert({
						msg : "您的网络是否已经连接上了，请检查一下！"
					});
				}  
          }); 
	}	
//queryProvnce();
	//地址回显功能
		function queryDeliveryById() {
			AjaxUtil.exeScript({
				script : "mobile.business.product",
				needTrascation : false,
				funName : "queryDeliveryById ",
				form : {
					id : editAddressId
				},
				success : function(data) {
					console.log("地址回显功能" + $api.jsonToStr(data));
					if (data.formDataset.checked == 'true') {
						var account = data.formDataset.delivery;
						var list = $api.strToJson(account);
						for (var i = 0; i < list.length; i++) {
							$("#name").val(list[i].name);
							$("#telNum").val(list[i].phone);
							$("#addressInfo").html(list[i].address);
							var tags = list[i].tags;
							var labelAddress = document.getElementById("labelAddress");
							for(var j=0;j<labelAddress.options.length;j++){
								var a = labelAddress.options[j].value;
								if(a == tags){
									labelAddress.options[j].selected = true;
								}
							}
//							$("#labelAddress option").each(function() {
//								$(this).attr("selected", "");
//								if ($(this).val() == list[i].tags) {
//									$(this).attr("selected", "selected");
//								}
//							});
							if (list[i].is_default == 1) {
								$(".hidesaddress").hide();
								hideflag = 1;
							}
							provinceId = list[i].province;
							cityId = list[i].city;
							districtId = list[i].district;
							queryProvnce(list[i].province, list[i].city, list[i].district);
						}
					} else {
						alert(data.formDataset.errorMsg);
					}
				},
				error : function() {
					api.alert({
						msg : "您的网络是否已经连接上了，请检查一下！"
					});
				}
			});
		}


	$('#save').click(function() {
		var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if($("#name").val()==""){
			api.alert({
				msg : "请输入收货人的姓名！"
			});
			return false;
		};
		if($("#telNum").val()==""){
			api.alert({
				msg : "请输入手机号！"
			});
			return false;
		};
		if(!mobileReg.test($("#telNum").val())){
			api.alert({
				msg : "您输入的手机号格式不对！"
			});
			return false;
		};
		if($("#labelAddress option:selected").val()=="0"){
			api.alert({
				msg : "请选择地址标签！"
			});
			return false;
		};
		if($("#provinceTemp option:selected").val()=="0"){
			api.alert({
				msg : "请选择省份！"
			});
			return false;
		};
		if($("#cityTemp option:selected").val()=="0"){
			api.alert({
				msg : "请选择市！"
			});
			return false;
		};
		if($("#districtTemp option:selected").val()=="0"){
			api.alert({
				msg : "请选择区！"
			});
			return false;
		};
		if($("#addressInfo").html().replace( /<[^>]*>/g, "" )==""){
			api.alert({
				msg : "请输入详细地址！"
			});
			return false;
		};
		if($("#checkbox").prop("checked")==false){
			if(hideflag==1){
				defaultFlag=1;
			}else{
				defaultFlag=2;
			}
			
		}else if($("#checkbox").prop("checked")==true){
			defaultFlag=1;
		}
		updateDelivery();
	});
	//修改接口
	function updateDelivery(){
//		alert(defaultFlag);
		AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "updateDelivery",
			form : {
				id : editAddressId,
				userNo:userInfo.userNo,
				name : $("#name").val(),
				phone : $("#telNum").val(),
				tags : $("#labelAddress option:selected").val(),
				province : $('#provinceTemp option:selected').attr('id'),
				city : $('#cityTemp option:selected').attr('id'),
				district : $('#districtTemp option:selected').attr('id'),
				provinceName : $('#provinceTemp option:selected').val(),
				cityName : $('#cityTemp option:selected').val(),
				districtName : $('#districtTemp option:selected').val(),
				address : $("#addressInfo").html().replace(/<[^>]*>/g, ""),
				defaultNo:defaultFlag,
			},
			success : function(data) {
				console.log("收货编辑" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					api.toast({
	                    msg:'修改成功'
                    });
                    setTimeout(function(){
                    	api.execScript({
					    name: 'receiveAddress',
					    script: 'refresh()'
					});
					api.closeWin({});
                    },500)
				} else {
					alert(data.formDataset.errorMsg);
				}
			},
			error : function() {
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
	}
	
	//执行删除功能
	$("#delAddress").click( function() {
		api.confirm({
				title : '提示',
				msg : '你想选择这条收货地址吗？',
				buttons : ['确定', '取消']
			}, function(ret, err) {
				var index = ret.buttonIndex;
				if (index == 1) {
					deleteDelivery()
				}
			});
	});
	
	//删除接口
	function deleteDelivery() {
		AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "deleteDelivery",
			form : {
				id : editAddressId
			},
			success : function(data) {
				console.log("商品规格初始化" + $api.jsonToStr(data));
				if (data.formDataset.checked == 'true') {
					api.toast({
	                    msg:'删除成功'
                    });
					setTimeout(function(){
                    	api.execScript({
					    name: 'receiveAddress',
					    script: 'refresh()'
					});
					api.closeWin({});
                    },500)

				} else {
					alert(data.formDataset.errorMsg);
				}
			},
			error : function() {
				api.alert({
					msg : "您的网络是否已经连接上了，请检查一下！"
				});
			}
		});
	}
};
//34,查找所有的市
	function queryCityByProvinceId(provinceId,cityId,districtId){
		$('#cityTemp').html('<option>请选择</option>');
		$('#districtTemp').html('<option>请选择</option>');
           var data = {
//         		"provinceId":$('#provinceTemp option:selected').attr('id'),
                "provinceId":provinceId
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
                  	 var nowList='<option value="0">请选择</option>';
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
	         			   $("#cityTemp option").each(function() {
								if ($(this).attr("id") == cityId) {
									$(this).attr("selected", "true");
								}
							}); 
							queryAreaByCityId(cityId,districtId)
                      }else{  
                          //alert("2");
                      }
                  },
                  error : function() {
					api.alert({
						msg : "您的网络是否已经连接上了，请检查一下！"
					});
				}  
          }); 
	};
	
//35,查找所有的区县
	function queryAreaByCityId(cityId,districtId){
		$('#districtTemp').html('<option>请选择</option>');
           var data = {
           		"cityId":cityId
//         		"cityId":$('#cityTemp option:selected').attr('id'),
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
                  	 var nowList='<option value="0">请选择</option>';
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
							$("#districtTemp option").each(function() {
								if ($(this).attr("id") == districtId) {
									$(this).attr("selected", "true");
								}
							}); 
                      }else{  
                          //alert("2");
                      }
                  },
                  error : function() {
					api.alert({
						msg : "您的网络是否已经连接上了，请检查一下！"
					});
				}  
          }); 
	};	
	
	
	//36,查找所有的市
	function CityByProvinceId(){
		$('#cityTemp').html('<option>请选择</option>');
		$('#districtTemp').html('<option>请选择</option>');
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
                  	 var nowList='<option value="0">请选择</option>';
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
                  },
                  error : function() {
					api.alert({
						msg : "您的网络是否已经连接上了，请检查一下！"
					});
				}  
          }); 
	};
	
//36,查找所有的区县
	function AreaByCityId(){
		$('#districtTemp').html('<option>请选择</option>');
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
                  	 var nowList='<option value="0">请选择</option>';
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
                  },
                  error : function() {
					api.alert({
						msg : "您的网络是否已经连接上了，请检查一下！"
					});
				}  
          }); 
	};	

	
$(document).ready(function(){
    var h=$(window).height();
    $(window).resize(function() {
        if($(window).height()<h){
            $('.next').hide();
        }
        if($(window).height()>=h){
            $('.next').show();
        }
    });
});
function goBack() {
	api.closeWin({
	});
}