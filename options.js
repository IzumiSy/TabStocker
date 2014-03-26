
// options.js

document.body.onload = function() {
	document.getElementById("popup_width").value = localStorage.PopupWidth;
	document.getElementById("hide_favicon").checked = localStorage.HideFavicon == "true" ? true : false;
}

document.getElementById("save").onclick = function() {
	var popup_width = document.getElementById("popup_width").value;

	// To set popup_width to zero, it's ganna be back to the default value.
	if (popup_width > 0 && popup_width < localStorage.constDefaultPopupWidth) {
		alert("The value of Popup width should be bigger than 250px");
		return;
	} else if (popup_width == 0) {
		popup_width = localStorage.constDefaultPopupWidth;
	}

	localStorage.PopupWidth = popup_width;
	localStorage.HideFavicon = document.getElementById("hide_favicon").checked;
	window.close();
}
