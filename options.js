
// options.js

// When you changed the default value for it in popup.html
// The number below should be fixed manually to have it work well.
const ui_menu_defaultPopupWidth = 250;

document.body.onload = function() {
	// load settings
	document.getElementById("popup_width").value = localStorage.PopupWidth;
	document.getElementById("hide_favicon").checked = localStorage.HideFavicon == "true" ? true : false;
}

document.getElementById("save").onclick = function() {
	localStorage.PopupWidth = document.getElementById("popup_width").value;
	localStorage.HideFavicon = document.getElementById("hide_favicon").checked;
	window.close();
}
