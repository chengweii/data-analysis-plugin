chrome.browserAction.onClicked.addListener(function (tab) {
	var left = screen.width / 2 - 550;
	var top = screen.height / 2 - 350;
	window.open('main.html', 'newwindow', 'height=650, width=1100, top=' + top + ', left=' + left + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
});