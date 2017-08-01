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
		
	});
	
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
		updateTenementHouseApply();
	});

		
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
//17，提交租户房屋信息审核
	function updateTenementHouseApply(){
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
	         id:bianId
          };
            $.ajax({  
                  url:rootUrls+'/xk/updateTenementHouseApply.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
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
queryProvnce();
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
