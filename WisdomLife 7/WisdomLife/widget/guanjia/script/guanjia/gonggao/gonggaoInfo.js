
apiready = function() {
//  上一页传来的相应的公告id
	id = api.pageParam.id;
	
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		//var cc = $api.dom('.content');
		$api.css(header, 'margin-top:20px;');
		//$api.css(cc, 'margin-top:20px;');
	}
	
//function ggInfo(){
//	//alert(id);
//	AjaxUtil.exeScript({
//    script:"mobile.steward.announcement",
//    needTrascation:true,
//    funName:"getAnnouncementById",
//    form:{
//       ggid:id
//    },
//    success:function (data) {
//    console.log($api.jsonToStr(data));
//     if (data.formDataset.checked == 'true') {
//     		var account = data.formDataset.announcementOne;
//     		var list=$api.strToJson(account);
//     		//alert(list[0].c_title);
//     		 if(list==undefined||list==""){
//                	api.toast({
//                        msg:'暂无'
//                    });
//                }else{
//               	list[0].c_title==null?$('#c_title').html('暂无'):$('#c_title').html(list[0].c_title);
//               	list[0].release_time==null?$('#release_time').html('暂无'):$('#release_time').html(list[0].release_time);
//               	list[0].c_content==null?$('#c_content').html('暂无'):$('#c_content').html(list[0].c_content);
//                }
//       } else {
//           alert(data.formDataset.errorMsg);
//       }
//     }
//  });
//}

	//公告详情
	function userGetAnnouncementlistByAnnId(){
           var data = {
               "annId":id,
          };
            $.ajax({  
                  url:rootUrls+'/announcement/userGetAnnouncementlistByAnnId.do',  
                  type:'post',  
                  dataType:'json',  
                  data:JSON.stringify(data),  
                  contentType: "application/json;charset=utf-8",
                  success:function(result){  
                  	 console.log($api.jsonToStr(result)); 
                  	 var data= result.data;
                  	 if(result.state==1){
                  	 	if(data==undefined||data==""){
		                  	api.toast({
		                          msg:'暂无'
		                      });
		                  }else{
		                 	data.title==null?$('#c_title').html('暂无'):$('#c_title').html(data.title);
		                 	data.strPushtTime==null?$('#release_time').html('暂无'):$('#release_time').html(data.strPushtTime);
		                 	data.content==null?$('#c_content').html('暂无'):$('#c_content').html(data.content);
		                  }
                      }else{  
//                        alert("2");
                      } 
                  }  
          }); 
	}
	userGetAnnouncementlistByAnnId();
	
	
	
}
function goBack() {
	api.closeWin({
	});
}	