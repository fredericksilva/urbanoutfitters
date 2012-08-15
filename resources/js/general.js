var popup = function(url,width,height,name){
		if (width == null) width = 400;
		if (height == null) height = 425;
		if (name == null) name = "details";
		var props = "toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,titlebar=no,menubar=no,width="+width+",height="+height;
		w = window.open(url, name, props);
		if (w) {
		w.focus();
		}
};
var splitEmailAdd = function(usemail){
	var stringlist = new Array();
	while (usemail.length > 30) {
	   stringlist.push( usemail.slice(0,30));
	   usemail=usemail.substr(30);
	}
	if (usemail.length) {
	  stringlist.push(usemail);
	}
	document.write(stringlist.join( '<br>' ));
};
