function trigger(clicked) {
	toggle(document.getElementById(clicked));
};

function toggle(clicked) {
	// strip "control" from the id of what was clicked
	ref=clicked.id.replace(/control/,"");
	// vars for referring to control and area
	control=document.getElementById("control"+ref);
	area=document.getElementById("tab"+ref); 
	
	if (area.style.display=="") {
	// div hasn't been clicked yet check if it is off (has a class of "cannotsee") or on ("cansee")
	if (area.className.indexOf("cannotsee")>=0) {
		// className contains cannotsee so turn it on
		showOrHide(1,ref);
	} else if (area.className.indexOf("cansee")>=0) {
		// className contains cansee so turn it off
		showOrHide(0,ref);
	}
	} else if (area.style.display=="block") {
		showOrHide(0,ref);
	} else if (area.style.display=="none") {
		showOrHide(1,ref);
	}
};

function showOrHide(show, who) {
	// vars for referring to area and control
	area=document.getElementById("tab"+who);
	// only set these if something was clicked
	// eg. image loop can't be toggled it just borrows showOrHide function so control is null
	control=document.getElementById("control"+who);
	if (control) {
		var linkChild=[control.firstChild, control.lastChild];
		//alert(linkChild[control.lastChild]);
		for (var x=0; x<linkChild.length; x++) {		
			if (linkChild[x].tagName=="SPAN") {
				text=linkChild[x];		
			} else if (linkChild[x].tagName=="IMG") {
				icon=linkChild[x];
			}		
		}
	} 
	if (show==0) {
		// hide the area
		area.style.display="none";
		if (control) {
			// change the control image to an arrow (hidden) and update the text
			if (window.icon) {icon.src=hidden.src;}
			if (window.hiddenText) {
				// note hiddenText var is defined in the template as it won't translate here
				text.innerHTML=hiddenText;
			}
		}
	} else if (show==1) {
		// show the area
		area.style.display="block";
		if (control) {
			// change the control image to a cross (shown) and update the text
			if (window.icon) {icon.src=shown.src;}
			if (window.shownText) {
				// note shownText var is defined in the template as it won't translate here
				text.innerHTML=shownText;
			}
		}
	}
	
};
/*this function use for attribute toggle only, and it can't use with multiple class*/
function changeALOT(strTagHead,strTag,strClass,textId)
{
	text = document.getElementById(textId);

	for (i=0;i<document.getElementsByTagName(strTag).length; i++) 
	{
		if (document.getElementsByTagName(strTag).item(i).className == strClass)
		{
			if(document.getElementsByTagName(strTag).item(i).style.display!= "none")
			{
				document.getElementsByTagName(strTag).item(i).style.display="none";
				text.style.display="";
			}
			else
			{
				document.getElementsByTagName(strTag).item(i).style.display="";
				text.style.display="none";
			}
		}
	}
	for (i=0;i<document.getElementsByTagName(strTagHead).length; i++) 
	{
		if (document.getElementsByTagName(strTagHead).item(i).className == strClass)
		{
			if(document.getElementsByTagName(strTagHead).item(i).style.display!= "none")
			{
				document.getElementsByTagName(strTagHead).item(i).style.display="none";
				text.style.display="";
			}
			else
			{
				document.getElementsByTagName(strTagHead).item(i).style.display="";
				text.style.display="none";
			}
		}
	}
};


	
