
// options.js

var BG = chrome.extension.getBackgroundPage();

document.body.onload = function() {
	document.getElementById("popup_width").value 
		= localStorage.getItem("PopupWidth") != undefined ? localStorage.getItem("PopupWidth") : BG.ui_menu_defaultPopupWidth;
	document.getElementById("font_size").value 
		= localStorage.getItem("FontSize") != undefined ? localStorage.getItem("FontSize") : BG.ui_defaultFontSize;
	document.getElementById("hide_favicon").checked 
		= localStorage.getItem("HideFavicon") == "true" ? true : false;
}

document.getElementById("save").onclick = function() {
	var popup_width;
	var font_size;

	popup_width = document.getElementById("popup_width").value;
	if (popup_width < BG.ui_menu_defaultPopupWidth || popup_width > BG.ui_menu_maxPopupWidth) {
		alert("The value of Popup width should be set in the range from 250px to 500px");
		return;
	}
	font_size = document.getElementById("font_size").value;
	if (font_size <= 0) {
		font_size = BG.ui_defaultFontSize;
	}

	localStorage.setItem("PopupWidth", popup_width);
	localStorage.setItem("FontSize", font_size);
	localStorage.setItem("HideFavicon", document.getElementById("hide_favicon").checked);
	window.close();
}

document.getElementById("cancel").onclick = function() {
	window.close();
}
