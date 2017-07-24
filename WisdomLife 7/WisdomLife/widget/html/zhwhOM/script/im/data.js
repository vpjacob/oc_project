var imLocalStorage = {
	"userid" : 1,
	"message" : {
		"private" : new Array(),
		"group" : new Array()
	},
	"conversationlist" : {
		"domhtml" : ""
	}
};

if (!localStorage.getItem('im')) {
	localStorage.setItem('im', JSON.stringify(imLocalStorage));
}

getImStore = function(key) {
	var imStore = null;

	if ($api.getStorage(key)) {
		imStore = $api.getStorage(key);
	} else {
		imStore = new Array();
	}
	
	return imStore;
}

setImStore = function(key, value){
	 $api.setStorage(key, value);
	 
	 return value;
}

