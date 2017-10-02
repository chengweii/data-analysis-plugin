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

$.convertor = {
	period : function(code) {
		var period = [ "", "日", "周", "月", "季度", "年" ];
		return period[code];
	}
}

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
		calculate : function(expression, scale) {
			var value = math.eval(expression);
			return parseFloat(value).toFixed(scale);
		},
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
			if (!/^\d{4}$/.test(year)) {
				info.hasError = true;
				info.errMsg = "年份格式必须为yyyy。";
				return info;
			} else if (parseInt(year) < 1900 || parseInt(year) > 3000) {
				info.hasError = true;
				info.errMsg = "年份应该在1900-3000之间。";
				return info;
			}
			return info;
		},
		checkMonth : function(month) {
			var info = {
				hasError : false,
				errMsg : ""
			};
			if (!/^\d{6}$/.test(month)) {
				info.hasError = true;
				info.errMsg = "月份格式必须为yyyyMM。";
				return info;
			}
			var year = month.substring(0, 4);
			var yearInfo = util.date.checkYear(year);
			if (yearInfo.hasError) {
				return yearInfo;
			}
			var mon = month.substring(4, 6);
			if (parseInt(mon, 10) < 1 || parseInt(mon, 10) > 12) {
				info.hasError = true;
				info.errMsg = "月份应该在1-12之间。";
				return info;
			}
			return info;
		},
		checkQuarter : function(quarter) {
			var info = {
				hasError : false,
				errMsg : ""
			};
			if (!/^\d{6}$/.test(quarter)) {
				info.hasError = true;
				info.errMsg = "季度格式必须为yyyyQQ。";
				return info;
			}
			var year = quarter.substring(0, 4);
			var yearInfo = util.date.checkYear(year);
			if (yearInfo.hasError) {
				return yearInfo;
			}
			var quar = quarter.substring(4, 6);
			if (parseInt(quar, 10) < 1 || parseInt(quar, 10) > 4) {
				info.hasError = true;
				info.errMsg = "季度应该在1-4之间。";
				return info;
			}
			return info;
		},
		checkWeek : function(week) {
			var info = {
				hasError : false,
				errMsg : ""
			};
			if (!/^\d{8}$/.test(week)) {
				info.hasError = true;
				info.errMsg = "周格式必须为yyyyMMww。";
				return info;
			}
			var month = week.substring(0, 6);
			var monthInfo = util.date.checkMonth(month);
			if (monthInfo.hasError) {
				return monthInfo;
			}
			var wek = week.substring(6, 8);
			if (parseInt(wek, 10) < 1 || parseInt(wek, 10) > 4) {
				info.hasError = true;
				info.errMsg = "周应该在1-4之间。";
				return info;
			}
			return info;
		},
		checkDate : function(dateString) {
			var info = {
				hasError : false,
				errMsg : ""
			};
			try {
				if (!/^\d{8}$/.test(dateString)) {
					info.hasError = true;
					info.errMsg = "日期格式必须为yyyyMMdd。";
					return info;
				}
				var dateStr = dateString.substring(0, 4) + "/"
						+ dateString.substring(4, 6) + "/"
						+ dateString.substring(6, 8);
				var datetime = new Date(Date.parse(dateStr));
				var date = datetime.getDate();
				var realDate = datetime.format("yyyyMMdd");

				if (isNaN(parseInt(date))) {
					info.hasError = true;
					info.errMsg = "日期输入有误,请重新输入。";
					return info;
				} else if (realDate != dateString) {
					info.hasError = true;
					info.errMsg = "日期输入月份天数有误,请重新输入。";
					return info;
				}
			} catch (e) {
				info.hasError = true;
				info.errMsg = "日期格式必须为yyyyMMdd。";
				return info;
			}
			return info;
		},
	},
	form : {
		requireCheck : function(styleClass) {
			var info = {
				hasError : false,
				errMsg : ""
			};
			var className = styleClass ? styleClass : "require";
			$("." + className).each(function(index, item) {
				var value = $(item).val();
				if (!value || !value.trim()) {
					info.hasError = true;
					info.errMsg = $(item).attr("require-msg");
					return false;
				}
			});
			return info;
		}
	},
	chart : {
		renderLineChart : function(config) {
			var lineChart = echarts.init(document
					.getElementById(config.chartId), e_macarons);
			var lineOption = {
				title : {
					text : config.title
				},
				tooltip : {
					trigger : 'axis'
				},
				legend : {
					data : [ config.legend ]
				},
				toolbox : {
					show : true,
					feature : {
						mark : {
							show : true
						},
						magicType : {
							show : true,
							type : [ 'line', 'bar' ]
						}
					}
				},
				calculable : true,
				xAxis : [ {
					type : 'category',
					boundaryGap : false,
					data : config.x_data
				} ],
				yAxis : [ {
					type : 'value',
					axisLabel : {
						formatter : '{value} '
								+ (config.unit ? config.unit : "")
					}
				} ],
				series : [ {
					name : config.legend,
					type : 'line',
					data : config.y_data,
					markPoint : {
						data : [ {
							type : 'max',
							name : '最大值'
						}, {
							type : 'min',
							name : '最小值'
						} ]
					},
					markLine : {
						data : [ {
							type : 'average',
							name : '平均值'
						} ]
					}
				} ]
			};
			lineChart.setOption(lineOption);
		},
		renderChrodChart : function(config) {
			var chrodChart = echarts.init(document.getElementById(config.chartId),e_macarons);
			var chrodOption = {
				title : {
					text : config.title,
					x : 'right',
					y : 'bottom'
				},
				tooltip : {
					trigger : 'item',
					formatter : function(params) {
						if (params.indicator2) {
							return params.indicator2 + ' ' + params.name + ' '
									+ params.indicator;
						} else {
							return params.name
						}
					}
				},
				toolbox : {
					show : true,
					feature : {
						magicType : {
							show : true,
							type : [ 'force', 'chord' ]
						}
					}
				},
				legend : {
					x : 'left',
					data : config.legend
				},
				series : [ {
					name : config.title,
					type : 'chord',
					sort : 'ascending',
					sortSub : 'descending',
					ribbonType : false,
					radius : '60%',
					itemStyle : {
						normal : {
							label : {
								rotate : true
							}
						}
					},
					minRadius : 7,
					maxRadius : 20,
					nodes : config.nodes,
					links : config.links
				} ]
			};

			chrodChart.setOption(chrodOption);
		}
	}
};
