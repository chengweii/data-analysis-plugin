﻿Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		"S" : this.getMilliseconds()
	}
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [ o[this.name] ];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

window.util = {
	openNewTab : function(url) {
		chrome.tabs.create({
			url : url
		});
	},
	getNotificationId : function() {
		var id = Math.floor(Math.random() * 9007199254740992) + 1;
		return id.toString();
	},
	openNewNotification : function(options) {
		var notificationId = util.getNotificationId();

		var notificationOptions = {
			type : options.type,
			iconUrl : options.iconUrl,
			title : options.title,
			message : options.message
		};
		if (options.imageUrl) {
			notificationOptions.imageUrl = options.imageUrl;
		}
		if (options.buttons && options.buttons.length > 0) {
			notificationOptions.buttons = [];
			for ( var index in options.buttons) {
				var button = options.buttons[index];
				notificationOptions.buttons.push({
					title : button.title,
					iconUrl : button.iconUrl
				});
			}
		}

		chrome.notifications.create(notificationId, notificationOptions);

		if (options.buttons && options.buttons.length > 0) {
			chrome.notifications.onButtonClicked.addListener(function(notiId,
					btnId) {
				if (notiId === notificationId) {
					var fn = options.buttons[btnId].click;
					if (fn) {
						fn();
					}
				}
			});
		}

		if (options.closeTimeout) {
			setTimeout(function() {
				chrome.notifications.clear(notificationId, function() {
					// callback
				});
			}, options.closeTimeout, notificationId);
		}

		return notificationId;
	},
	getQueryString : function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	},
	getMousePosition : function(event) {
		var e = event || window.event;
		var scrollX = document.documentElement.scrollLeft
				|| document.body.scrollLeft;
		var scrollY = document.documentElement.scrollTop
				|| document.body.scrollTop;
		var x = e.pageX || e.clientX + scrollX;
		var y = e.pageY || e.clientY + scrollY;
		return {
			'x' : x,
			'y' : y
		};
	},
	bindTitleTip : function(styleClass) {
		var tipId = 'title-tip';
		$('body').append("<div id='" + tipId + "'></div>");
		var element = $("." + styleClass);
		element.mouseover(function() {
			var position = util.getMousePosition();
			var tip = $("#" + tipId);
			tip[0].style.left = position.x + 5 + "px";
			tip[0].style.top = position.y + 5 + "px";
			tip.html($(this).attr("title-content"));
			tip.show();
		});
		element.mouseout(function() {
			$("#" + tipId).hide();
		});
	},
	dao : {
		execute : function(sql, params, callback) {
			return assistantDb.query(sql, callback, params);
		},
		insert : function(table, row, callback) {
			var row_data = [];
			var row_temp = [];
			for ( var p in row) {
				row_temp.push({
					name : p,
					value : row[p]
				});
			}
			row_data.push(row_temp);
			return assistantDb.insert(table, row_data, callback);
		},
		update : function(table, row, id, callback) {
			var sql = "update " + table + " set ";
			var params = [];
			for ( var p in row) {
				sql = sql + p + " = ?,";
				params.push(row[p]);
			}
			sql = sql.substring(0, sql.length - 1);
			sql = sql + " where id = ?";
			params.push(id);
			return assistantDb.query(sql, callback, params);
		}
	}
};
