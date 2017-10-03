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
			title : '能力=善于学习+经验积累',
			message : '请您及时整理业务分析相关的指标、要素。',
			imageUrl : 'img/review.png',
			closeTimeout : 50000
		});
		Settings.setValue('remindTime', remindTime);
	}
}

setInterval(remind, 5000);