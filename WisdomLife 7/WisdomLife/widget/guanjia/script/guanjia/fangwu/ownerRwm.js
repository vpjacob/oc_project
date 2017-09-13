var urId='';
var telphone='';
var ownerInfo='';
var Info='';
apiready = function() {
	 ownerInfo = api.pageParam.info;
	 Info=$api.strToJson(ownerInfo);
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header,'margin-top:20px;');
	};
	urId = api.getPrefs({
	    sync:true,
	    key:'userNo'
    });
    telphone = api.getPrefs({
	    sync:true,
	    key:'telphone'
    });
    $('#tempTel').val(telphone);
	queryUserInfo(urId);
	
	$('#name').val(Info.data.userName);
	$('#userPhone').val(Info.data.userPhone);
	$('#community').val(Info.data.community);
	$('#building').val(Info.data.building);
	$('#room').val(Info.data.room);
	$('#unit').val(Info.data.unit);
	
	//23，根据用户编号查找用户真实姓名等信息	
function queryUserInfo(urId){
           var data = {
               "userNo":urId
          };
            $.ajax({  
                  url:rootUrls+'/xk/queryUserInfo.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));  
                  	  var data= result.data;
                  	 if(result.state==1){
                  	 	if(data.realName==null || data.realName=="undefined" ||data.realName==''){
                  	 		$('#tempName').val('暂无');
                  	 	}else{
                  	 		$('#tempName').val(data.realName);
                  	 	}
                        if(data.idcard==null || data.idcard=="undefined" || data.idcard==''){
                  	 		$('#tempId').val('暂无');
                  	 	}else{
                  	 		$('#tempId').val(data.idcard);
                  	 	};
                        relationList();
                      }else{  
//                        alert("2");
                      } 
                  }  
          }); 
	}	
	
	//获取与业主的关系
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
							$('#relationList').html(nowList);
						}	
                      }else{  
                      }  
                  }  
          }); 
	};
	
	
	//19，新增绑定家庭成员	
	function addFamilyMember(){
		var data = {
             userNo:urId,
             phone:$("#userPhone").val(),
             name :$("#tempName").val(),
             identity:$('#tempId').val(),
	         communityId:Info.data.communityId,
	         buildingId:Info.data.buildingId,
	         unitId: Info.data.unitId,
	         roomId:Info.data.roomId,
	         relation :$('#relationList option:selected').val()
          };
            $.ajax({  
                  url:rootUrls+'/xk/applyFamilyMember.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result));
                      if(result.state==1){
                        alert(result.msg);
                        api.execScript({//实现添加家庭成员的回显刷新
							name : 'familyNum',
							script : 'refresh()'
						});
						api.closeWin();
                      }else{  
                          alert(result.msg);
                      }  
                  }  
          }); 
	};
	
	$('#apply').click(function(){
		addFamilyMember();
	})
	
	
	
	
}
function goBack() {
		api.closeWin({
		});
	}
