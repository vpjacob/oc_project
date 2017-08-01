apiready = function() {
var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
//查看详情
//	$('#tv').click(function() {
//		api.openWin({
//			name : 'menkouship',
//			url : 'menkouship.html',
//			slidBackEnabled : true,
//			animation : {
//				type : "push", //动画类型（详见动画类型常量）
//				subType : "from_right", //动画子类型（详见动画子类型常量）
//				duration : 300 //动画过渡时间，默认300毫秒
//			}
//		});
//	});
	
//		$("#tv").click(function(){
//			$.ajax({
//                url:propertyUrl+"/doormaster/server/employees", 
//                type:"POST",   
//                async:true,
//                contentType: 'application/x-www-form-urlencoded',
//                data:$api.jsonToStr({
//                  "access_token": access_token,
//                  "operation": "GET_VOIP",
//                  "data":  {
////                      "ids": [2,3]
//
//                   }
//                }),
//                dataType:"json",   
//                success:function(req){
//                    //alert("返回结果:"+$api.jsonToStr(req));
//                    console.log("返回结果:"+$api.jsonToStr(req));
//                    var result= req.data;
//                    for(var i = 0; i < result.length; i++){
//                      //alert(result[i]);
//                      var room_list=result[i].community_info.room_list;
//                      //alert("emp_no="+result[i].community_info.room_list);
//                   	for(var j=0;j<room_list.length;j++){
//                   		alert(room_list[j].building);
//                   	}
//                      
//                    }   
//                },
//                error:function(){
//                    
//                }
//            }); 
//		
//		})
// 获取门口机列表
function tvList(){
			$.ajax({
                  url:propertyUrl+"/doormaster/server/employees", 
                  type:"POST",   
                  async:true,
                  contentType: 'application/x-www-form-urlencoded',
                  data:$api.jsonToStr({
                    "access_token": access_token,
                    "operation": "GET_VOIP",
                    "data":  {
//                      "ids": [2,3]

                     }
                  }),
                  dataType:"json",   
                  success:function(req){
                      var result= req.data;
                      for(var i = 0; i < result.length; i++){
                        var room_list=result[i].community_info.room_list;
                        if(room_list.length==0 ||room_list.length==''||room_list.length==undefined){
                        	return false;
                        }else{
                     	for(var j=0;j<room_list.length;j++){
//                   		alert(room_list[j].building);
                     		var nowList='<div class="box" id="'+room_list[j].room_id+'">'
                     					+'<img src="../../../image/menkoutv.jpg" alt="" />'
                     					+'<span>'+room_list[j].building+'门口机</span>'
										+'</div>'
                     	}
                        $('#tvList').append(nowList);
                      }  
                      } 
                  },
                  error:function(){
                      
                  }
              }); 
		
		}
		
	//tvList();
	
//	$('#tvList').on('click','.box',function() {
//			api.openWin({//详情界面
//				name : '../busdetail/seller.html',
//				url : '../busdetail/seller.html',
//				slidBackEnabled : true,
//				animation : {
//					type : "push", //动画类型（详见动画类型常量）
//					subType : "from_right", //动画子类型（详见动画子类型常量）
//					duration : 300 //动画过渡时间，默认300毫秒
//				},
//				pageParam : {
//					id : $(this).attr('id')
//				}
//			});
//		});
	
	$('#close').click(function() {
		$(this).addClass("animated rubberBand");
		setTimeout(function(){
			$("#close").removeClass("animated rubberBand");
			goBack();
		}, 1000)
	});

}
function goBack() {
	api.closeWin({
	});
}
