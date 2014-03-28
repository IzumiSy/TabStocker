
// options.js

var BG = chrome.extension.getBackgroundPage();

document.body.onload = function() {
	document.getElementById("popup_width").value = localStorage.PopupWidth;
	document.getElementById("hide_favicon").checked = localStorage.HideFavicon == "true" ? true : false;
}

document.getElementById("save").onclick = function() {
	var popup_width = document.getElementById("popup_width").value;

	if (popup_width < BG.ui_menu_defaultPopupWidth || popup_width > BG.ui_menu_maxPopupWidth) {
		alert("The value of Popup width could be set in the range from 250px to 500px");
		return;
	}

	localStorage.PopupWidth = popup_width;
	localStorage.HideFavicon = document.getElementById("hide_favicon").checked;
	window.close();
}

document.getElementById("cancel").onclick = function() {
	window.close();
}
