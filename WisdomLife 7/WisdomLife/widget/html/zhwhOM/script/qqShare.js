var om_wb;	
apiready = function() {
	om_wb = api.require('weibo');
}

function getWeiBoAuth(callback){
	weibo.auth(function(ret,err){
	    callback(ret);
	});
}

function getWeiBoShareWebPage(text,title,description,thumb,contentUrl,callback){
	weibo.shareWebPage({
	    text: text,
	    title: title,
	    description: description,
	    thumb: thumb,
	    contentUrl: contentUrl
	},function(ret,err){
	    callback(ret.status);
	});
}

