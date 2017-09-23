/*var result = math.eval("(5+3)*2.5/3");
function showNode(node) {
	node.forEach(function(node, path, parent) {
		if (node.args) {
			showNode(node);
		} else {
			console.log(node.name);
		}
	});
}
function transform(node) {
	var transformed = node.transform(function(node, path, parent) {
		if (node.isSymbolNode && node.name === 'roi_month') {
			return new math.expression.node.ConstantNode(3);
		} else if (node.isSymbolNode && node.name === 'ss') {
			return new math.expression.node.ConstantNode(5);
		} else if (node.isSymbolNode && node.name === 'dd') {
			return new math.expression.node.ConstantNode(8);
		} else {
			return node;
		}
	});
	return transformed.toString();
}
var node = math.parse('roi_month * ss + dd');
showNode(node);
var newexpression = transform(node);*/

function renderGoalData(rows, table) {
	var type = "goal";
	var template = $("." + type + "-card table tbody tr");
	var tbody = $("." + type + "-card table tbody");
	tbody.html("");

	if (!rows.length)
		return;

	for (var index = 0; index < rows.length; index++) {
		var temp = template.clone();
		var tds = temp.find("td");
		temp.attr(type + "-id", rows[index]['id']);
		var name = rows[index]['name'];
		$(tds[0]).find("span").html(name).attr("title-content", name);
		var detail = rows[index]['detail'];
		$(tds[1]).find("span").html(detail).attr("title-content", detail);
		var remark = rows[index]['remark'];
		$(tds[2]).find("span").html(detail).attr("title-content", remark);
		tbody.append(temp);
	}

	$("." + type + "-card .edit-btn").click(
			function() {
				location.href = type + "_edit.html?id="
						+ $(this).parent().parent().attr(type + "-id");
			});
	$("." + type + "-card .relation-btn").click(
			function() {
				location.href = type + "_relation.html?id="
						+ $(this).parent().parent().attr(type + "-id");
			});
	$("." + type + "-card .document-btn").click(
			function() {
				location.href = "document.html?type=" + type + "&id="
						+ $(this).parent().parent().attr(type + "-id");
			});
	$("." + type + "-card .remove-btn").click(
			function() {
				var tr = $(this).parent().parent();
				var id = tr.attr(type + "-id");
				util.dao.execute("delete from " + table + " where id = ?",
						[ id ], function(tx, res) {
							tr.remove();
						});
			});

	util.bindTitleTip(type + '-card .title-tip');
}

function renderQuotaData(rows, table) {
	var type = "quota";
	var template = $("." + type + "-card table tbody tr");
	var tbody = $("." + type + "-card table tbody");
	tbody.html("");

	if (!rows.length)
		return;

	for (var index = 0; index < rows.length; index++) {
		var temp = template.clone();
		var tds = temp.find("td");
		temp.attr(type + "-id", rows[index]['id']);
		var name_cn = rows[index]['name_cn'];
		$(tds[0]).find("span").html(name_cn).attr("title-content", name_cn);
		var name_en = rows[index]['name_en'];
		$(tds[1]).find("span").html(name_en).attr("title-content", name_en);
		var category = rows[index]['category'];
		$(tds[2]).html(category);
		var expression = rows[index]['expression'];
		$(tds[3]).find("span").html(expression).attr("title-content",
				expression);
		var period = rows[index]['period'];
		$(tds[4]).html(period);
		var coordinate = rows[index]['coordinate'];
		$(tds[5]).html(coordinate);
		var reference_value = rows[index]['reference_value'];
		$(tds[6]).html(reference_value);
		var unit = rows[index]['unit'];
		$(tds[7]).html(unit);
		var remark = rows[index]['remark'];
		$(tds[8]).html(remark);
		tbody.append(temp);
	}

	$("." + type + "-card .edit-btn").click(
			function() {
				location.href = type + "_edit.html?id="
						+ $(this).parent().parent().attr(type + "-id");
			});
	$("." + type + "-card .relation-btn").click(
			function() {
				location.href = type + "_relation.html?id="
						+ $(this).parent().parent().attr(type + "-id");
			});
	$("." + type + "-card .detail-btn").click(
			function() {
				location.href = type + "_detail.html?id="
						+ $(this).parent().parent().attr(type + "-id");
			});
	$("." + type + "-card .document-btn").click(
			function() {
				location.href = "document.html?type=" + type + "&id="
						+ $(this).parent().parent().attr(type + "-id");
			});
	$("." + type + "-card .remove-btn").click(
			function() {
				var tr = $(this).parent().parent();
				var id = tr.attr(type + "-id");
				util.dao.execute("delete from " + table + " where id = ?",
						[ id ], function(tx, res) {
							tr.remove();
						});
			});

	util.bindTitleTip(type + '-card .title-tip');
}

function renderFactorData(rows, table) {
	var type = "factor";
	var template = $("." + type + "-card table tbody tr");
	var tbody = $("." + type + "-card table tbody");
	tbody.html("");

	if (!rows.length)
		return;

	for (var index = 0; index < rows.length; index++) {
		var temp = template.clone();
		var tds = temp.find("td");
		temp.attr(type + "-id", rows[index]['id']);
		var name_cn = rows[index]['name_cn'];
		$(tds[0]).find("span").html(name_cn).attr("title-content", name_cn);
		var name_en = rows[index]['name_en'];
		$(tds[1]).find("span").html(name_en).attr("title-content", name_en);
		var category = rows[index]['category'];
		$(tds[2]).html(category);
		var expression = rows[index]['expression'];
		$(tds[3]).find("span").html(expression).attr("title-content",
				expression);
		var period = rows[index]['period'];
		$(tds[4]).html(period);
		var coordinate = rows[index]['coordinate'];
		$(tds[5]).html(coordinate);
		var reference_value = rows[index]['reference_value'];
		$(tds[6]).html(reference_value);
		var unit = rows[index]['unit'];
		$(tds[7]).html(unit);
		var remark = rows[index]['remark'];
		$(tds[8]).html(remark);
		tbody.append(temp);
	}

	$("." + type + "-card .edit-btn").click(
			function() {
				location.href = type + "_edit.html?id="
						+ $(this).parent().parent().attr(type + "-id");
			});
	$("." + type + "-card .relation-btn").click(
			function() {
				location.href = type + "_relation.html?id="
						+ $(this).parent().parent().attr(type + "-id");
			});
	$("." + type + "-card .detail-btn").click(
			function() {
				location.href = type + "_detail.html?id="
						+ $(this).parent().parent().attr(type + "-id");
			});
	$("." + type + "-card .document-btn").click(
			function() {
				location.href = "document.html?type=" + type + "&id="
						+ $(this).parent().parent().attr(type + "-id");
			});
	$("." + type + "-card .remove-btn").click(
			function() {
				var tr = $(this).parent().parent();
				var id = tr.attr(type + "-id");
				util.dao.execute("delete from " + table + " where id = ?",
						[ id ], function(tx, res) {
							tr.remove();
						});
			});

	util.bindTitleTip(type + '-card .title-tip');
}

function renderStepData(rows, table) {
	var type = "thinking";
	var template = $("." + type + "-card table tbody tr");
	var tbody = $("." + type + "-card table tbody");
	tbody.html("");

	if (!rows.length)
		return;

	for (var index = 0; index < rows.length; index++) {
		var temp = template.clone();
		var tds = temp.find("td");
		temp.attr(type + "-id", rows[index]['id']);
		var name = rows[index]['name'];
		$(tds[0]).find("span").html(name).attr("title-content", name);
		var content = rows[index]['content'];
		$(tds[1]).find("span").html(content).attr("title-content", content);
		var attentions = rows[index]['attentions'];
		$(tds[2]).find("span").html(attentions).attr("title-content", attentions);
		tbody.append(temp);
	}

	$("." + type + "-card .edit-btn").click(
			function() {
				location.href = type + "_edit.html?id="
						+ $(this).parent().parent().attr(type + "-id");
			});
	$("." + type + "-card .remove-btn").click(
			function() {
				var tr = $(this).parent().parent();
				var id = tr.attr(type + "-id");
				util.dao.execute("delete from " + table + " where id = ?",
						[ id ], function(tx, res) {
							tr.remove();
						});
			});

	util.bindTitleTip(type + '-card .title-tip');
}

function queryData(table, callback) {
	var query_sql = 'select * from ' + table;
	util.dao.execute(query_sql, null,
			function(tx, res) {
				if (res.rows.length) {
					console.log('find ' + table + ' ' + res.rows.length
							+ ' record(s)');
				} else {
					console.log(table + ' is empty');
				}
				callback(res.rows, table);
			});
}

queryData('analysis_goal', renderGoalData);
queryData('analysis_quota', renderQuotaData);
queryData('analysis_factor', renderFactorData);
queryData('analysis_step', renderStepData);

$("#page-index .card-header .title").click(function() {
	$(".card-content").hide();
	$(".card-header .title").removeClass("card-selected");
	$(this).addClass("card-selected");
	$("." + $(this).attr("card-class")).show();
});
$("#page-index .btn-add").click(function() {
	util.dao.insert('analysis_step', {
		name : '似的发射点' + (new Date()),
		content : 'dfsdfsdfsd',
		attentions : '营运能力'
	});
	location.href = "main.html";
});
