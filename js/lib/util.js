Date.prototype.format = function(format) {
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
	showToast : function(msg) {
		var tipId = 'title-tip';
		var toast = $("<div id='" + tipId + "'></div>");
		$('body').append(toast);
		var position = util.getMousePosition();
		toast[0].style.left = position.x + 10 + "px";
		toast[0].style.top = position.y + 10 + "px";
		toast.html(msg);
		toast.show();
		setTimeout(function() {
			toast.remove();
		}, 2000);
	},
	unique : function(array) {
		var res = [];
		var json = {};
		for (var i = 0; i < array.length; i++) {
			if (!json[array[i]]) {
				res.push(array[i]);
				json[array[i]] = 1;
			}
		}
		return res;
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
		insertBatch : function(table, rows, callback) {
			var row_data = [];
			var row_temp = [];
			for ( var k in rows) {
				for ( var p in rows[k]) {
					row_temp.push({
						name : p,
						value : rows[k][p]
					});
				}
			}
			row_data.push(row_temp);
			return assistantDb.multiInsert(table, row_data, callback);
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
	},
	math : {
		getAllNode : function(expression) {
			var rootNode = math.parse(expression);
			var nodeList = [];
			var fnList = [];
			var getNodeList = function(root) {
				if (root.content && !root.content.args && root.content.name) {
					nodeList.push(root.content.name);
				}
				if (root.name && !root.args) {
					nodeList.push(root.name);
				}
				if (root.fn && root.fn.name) {
					fnList.push(root.fn.name);
				}
				if (root.content && root.content.fn && root.content.fn.name) {
					fnList.push(root.content.fn.name);
				}
				if (root.args) {
					root.forEach(function(node, path, parent) {
						getNodeList(node);
					});
				}
				if (root.content && root.content.args) {
					root.content.forEach(function(node, path, parent) {
						getNodeList(node);
					});
				}
			}
			getNodeList(rootNode);
			return {
				nodeList : nodeList,
				fnList : fnList
			};
		},
		checkExpression : function(expression, accessParams) {
			var errMsg = "";
			try {
				var result = util.math.getAllNode(expression);
				console.log(result);
				var accessFns = [ "abs", "add", "cbrt", "ceil", "cube",
						"divide", "dotDivide", "dotMultiply", "dotPow", "exp",
						"fix", "floor", "gcd", "hypot", "lcm", "log", "log10",
						"mod", "multiply", "norm", "nthRoot", "pow", "round",
						"sign", "sqrt", "square", "subtract", "unaryMinus",
						"unaryPlus", "xgcd", "min", "max", "acos", "acosh",
						"acot", "acoth", "acsc", "acsch", "asec", "asech",
						"asin", "asinh", "atan", "atan2", "atanh", "cos",
						"cosh", "cot", "coth", "csc", "csch", "sec", "sech",
						"sin", "sinh", "tan", "tanh" ];
				for ( var index in result.fnList) {
					if (accessFns.indexOf(result.fnList[index]) == -1) {
						errMsg = "函数[" + result.fnList[index] + "]不支持，请调整表达式。";
						break;
					}
				}
				if (errMsg) {
					return errMsg;
				}
				for ( var index in result.nodeList) {
					if (accessParams
							&& accessParams.indexOf(result.nodeList[index]) == -1) {
						errMsg = "要素[" + result.nodeList[index] + "]不存在，请认真核实。";
						break;
					}
				}
			} catch (e) {
				console.log(e);
				errMsg = "表达式不正确，请认真核实。";
			}
			return errMsg;
		}
	},
	date : {
		checkDateTime : function(time, period) {
			if (period == 1) {
				return util.date.checkDate(time);
			} else if (period == 2) {
				return util.date.checkWeek(time);
			} else if (period == 3) {
				return util.date.checkMonth(time);
			} else if (period == 4) {
				return util.date.checkQuarter(time);
			} else if (period == 5) {
				return util.date.checkYear(time);
			}
			return {
				hasError : false,
				errMsg : ""
			};
		},
		checkYear : function(year) {
			var info = {
				hasError : false,
				errMsg : ""
			};
			if (isNaN(parseInt(year))) {
				info.hasError = true;
				info.errMsg = "年份输入有误,请重新输入。";
			} else if (parseInt(year) < 1950 || parseInt(year) > 2050) {
				info.hasError = true;
				info.errMsg = "年份应该在1950-2050之间。";
			}
			return info;
		},
		checkMonth : function(month) {
			var info = {
				hasError : false,
				errMsg : ""
			};
			if (isNaN(parseInt(month, 10))) {
				info.hasError = true;
				info.errMsg = "月份输入有误,请重新输入。";
			} else if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
				info.hasError = true;
				info.errMsg = "月份应该在1-12之间。";
			}
			return info;
		},
		checkQuarter : function(quarter) {
			var info = {
				hasError : false,
				errMsg : ""
			};
			if (isNaN(parseInt(quarter, 10))) {
				info.hasError = true;
				info.errMsg = "季度输入有误,请重新输入。";
			} else if (parseInt(month, 10) < 1 || parseInt(month, 10) > 4) {
				info.hasError = true;
				info.errMsg = "季度应该在1-4之间。";
			}
			return info;
		},
		checkWeek : function(week) {
			var info = {
				hasError : false,
				errMsg : ""
			};
			if (isNaN(parseInt(quarter, 10))) {
				info.hasError = true;
				info.errMsg = "周输入有误,请重新输入。";
			} else if (parseInt(month, 10) < 1 || parseInt(month, 10) > 4) {
				info.hasError = true;
				info.errMsg = "周应该在1-4之间。";
			}
			return info;
		},
		checkDate : function(dateString) {
			var info = {
				hasError : false,
				errMsg : ""
			};
			try {
				var datetime = new Date(Date.parse(dateString));
				var year = datetime.getFullYear();
				var month = datetime.getMonth() + 1;
				var date = datetime.getDate();
				var calDays = function(year, month) {
					var d = new Date(year, month, 0);
					return d.getDate();
				}
				var daysOfMonth = calDays(parseInt(year), parseInt(month));

				if (isNaN(parseInt(date))) {
					info.hasError = true;
					info.errMsg = "日期输入有误,请重新输入。";
				} else if (parseInt(date) < 1 || parseInt(date) > daysOfMonth) {
					info.hasError = true;
					info.errMsg = "日期应该在1-" + daysOfMonth + "之间。";
				}
			} catch (e) {
				info.hasError = true;
				info.errMsg = "日期格式必须为yyyy/MM/dd。";
			}
			return info;
		},
	},
	form : {
		requireCheck : function() {
			var info = {
				hasError : false,
				errMsg : ""
			};
			$(".require").each(function(index, item) {
				var value = $(item).val();
				if (!value || !value.trim()) {
					info.hasError = true;
					info.errMsg = $(item).attr("require-msg");
					return false;
				}
			});
			return info;
		}
	}
};
