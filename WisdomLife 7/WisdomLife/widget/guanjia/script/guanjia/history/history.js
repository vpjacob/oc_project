
function goBack() {
	api.closeWin({
	});
}
apiready = function() {
	var header = $api.byId('title');
	if (api.systemType == 'ios') {
		$api.css(header, 'margin-top:20px;');
	}
	
//开门记录接口
	function history(){
			$.ajax({
                  url:propertyUrl+"/doormaster/server/eventlogs", 
                  type:"POST",   
                  async:true,
                  contentType: 'application/x-www-form-urlencoded',
                  data:$api.jsonToStr({
                    "access_token": access_token,
                    "operation": "GET",
                    "data":  {
//                      "ids": [2,3]

                     }
                  }),
                  dataType:"json",   
                  success:function(req){
                      console.log("返回结果:"+$api.jsonToStr(req));
                      var result= req.data;
                      //console.log('data.length'+result.length);
                      for(var i = 0; i < result.length; i++){
                        var result=result[i].id;
                        console.log('result'+result);
                          
                      } 
                  },
                  error:function(){
                      
                  }
              }); 
		
		}
		
	//history();
	
	
}
function goBack() {
	api.closeWin({
	});
}