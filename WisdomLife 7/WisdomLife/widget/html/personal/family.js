apiready = function() {
    var header = $api.byId('header');
	if(api.systemType=='ios')
	{	  
	    var cc=$api.dom('.content');
		$api.css(header,'margin-top:20px;');
//		$api.css(cc,'margin-top:20px;');		
	}

	var roomid = api.pageParam.roomid;
//	tdstr += '<a  style="display:block; width: 100%;" onclick="jump(' + (res[i].fid+"") + ')"><li class="styleLine" ontouchstart="touchstart(this)">';
	AjaxUtil.exeScript({
		script : "mobile.center.room.roomindex",
		needTrascation : false,
		funName : "getMemberByRoomId",
		form : {
			roomid : roomid
		},
		success : function(data) {
			var rows = data.datasources[0].rows;
			var familyInfo = '';
			var familyMemberDiv = document.getElementById('familyMember');
			var headurl;
			var nick;
			for(var i=0; i<rows.length;i++){		
				if(rows[i].headurl == null){
					headurl = 'http://pic002.cnblogs.com/images/2011/358804/2011122613501726.jpg';
				}else{
					headurl = rows[i].headurl;
				}
				if(rows[i].nick == null){
					nick = '暂无名称';
				}else{
					nick = rows[i].nick;
				}
				familyInfo = familyInfo+'<div><img src="'+headurl+'" width="40" height="40" /><span>'+nick+'</span><span>已认证</span></div>';
				 
			}
			alert(familyInfo);
			$api.append(familyMemberDiv, familyInfo); 
			alert(familyInfo);
		}
	});

}