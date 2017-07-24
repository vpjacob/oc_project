var om_qq;	
apiready = function() {
	om_qq = api.require('qq');
}

function getQQisInstalled(callback){
	om_qq.installed(function(ret,err){
		callback(ret.status);
	});
}

function getQQUserInfo(){
	om_qq.getUserInfo(function(ret,err) {
	   if (ret.status) {
	      callback(ret);
	   }else{
	      api.alert({msg:'获取qq信息失败'});
	   }
	});
}

function getQQLoginInfo(callback){
	om_qq.login(function(ret,err){
	    callback(ret);
	});
}

function getQQShareInfo(title,description,contentUrl,imgUrl,callback){
	obj.shareNews({
	    url:contentUrl,
	    title:title,
	    description:description,
	    imgUrl:imgUrl
	}, function(ret, err){
	    callback(ret.status);
	});
}

