chrome.browserAction.onClicked.addListener(function (tab) {
	var left = screen.width / 2 - 550;
	var top = screen.height / 2 - 350;
	window.open('main.html', 'newwindow', 'height=650, width=1100, top=' + top + ', left=' + left + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
});

var remindTimes = [ 10, 15, 17 ];
function remind() {
	var date = new Date();
	var remindTime = date.format('yyyy-MM-dd hh');
	var lastRemindTime = Settings.getValue('remindTime');
	if (remindTimes.indexOf(date.getHours()) != -1
			&& (!lastRemindTime || lastRemindTime != remindTime)) {
		util.openNewNotification({
			type : 'image',
			iconUrl : 'img/icon.png',
			title : 'Please review your knowledge',
			message : 'Experience comes from learning',
			imageUrl : 'img/review.png',
			closeTimeout : 20000
		});
		Settings.setValue('remindTime', remindTime);
	}
}

setInterval(remind, 5000);