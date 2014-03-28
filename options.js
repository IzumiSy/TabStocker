
// options.js

var BG = chrome.extension.getBackgroundPage();

document.body.onload = function() {
	document.getElementById("popup_width").value = localStorage.getItem(BG.OPTION_POPUP_WIDTH) != undefined 
		? localStorage.getItem(BG.OPTION_POPUP_WIDTH) : BG.ui_menu_defaultPopupWidth;
	document.getElementById("font_size").value = localStorage.getItem(BG.OPTION_FONT_SIZE) != undefined 
		? localStorage.getItem(BG.OPTION_FONT_SIZE) : BG.ui_defaultFontSize;
	document.getElementById("hide_favicon").checked = localStorage.getItem(BG.OPTION_HIDE_FAVICONS) == "true" ? true : false;
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

	localStorage.setItem(BG.OPTION_POPUP_WIDTH, popup_width);
	localStorage.setItem(BG.OPTION_FONT_SIZE, font_size);
	localStorage.setItem(BG.OPTION_HIDE_FAVICONS, document.getElementById("hide_favicon").checked);
	window.close();
}

document.getElementById("cancel").onclick = function() {
	window.close();
}
