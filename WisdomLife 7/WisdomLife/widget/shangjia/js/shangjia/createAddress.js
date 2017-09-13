var urId;
var defaultFlag="";
apiready = function() {
	var header = $api.byId('title');
//	var cc = $api.dom('.iosBox');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:1.1rem;');
	};
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
	//33,查找所有的省份
	function queryProvnce(){
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
	}
queryProvnce();
	
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
			defaultFlag=2
		}else if($("#checkbox").prop("checked")==true){
			defaultFlag=1;
		}
		 insertDelivery(); 
	});
	
	
	// 添加收货地址
	function insertDelivery() {
		AjaxUtil.exeScript({
			script : "mobile.business.product",
			needTrascation : false,
			funName : "insertDelivery",
			form : {
				userNo : urId,
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
//				var result = {
//					province : $('#provinceTemp option:selected').val(),
//					city : $('#cityTemp option:selected').val(),
//					district : $('#districtTemp option:selected').val(),
//					name : $("#name").val(),
//					phone : $("#telNum").val(),
//					address : $("#addressInfo").html().replace(/<[^>]*>/g, ""),
//				};
				console.log("添加收货地址" + $api.jsonToStr(data));
//				console.log("传值："+$api.jsonToStr(result));
				if (data.formDataset.checked == 'true') {
					api.toast({
	                    msg:'添加成功'
                    });
//                  api.execScript({
//					    name: 'entranceGuardInfo',
//					    script: 'funcGoto('+JSON.stringify(result)+')'
//					});
					api.execScript({
					    name: 'receiveAddress',
					    script: 'refresh()'
					});
					api.closeWin({});
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
	function queryCityByProvinceId(){
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
	
//35,查找所有的区县
	function queryAreaByCityId(){
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