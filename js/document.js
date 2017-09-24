var type = util.getQueryString("type");
$("#page-document .back-btn").click(function() {
	location.href = "main.html?typeFrom=" + type;
});

function syncDocument(docUrl, docId, callback) {
	$.get(docUrl, function(data) {
		var data_content = $(data).find(".show-content").html();
		Settings.setValue(docId, data_content);
		callback(data_content);
	});
}

var id = util.getQueryString("id");
var table = util.getQueryString("table");
function bindDocumentUrl() {
	var query_sql = 'select * from ' + table + ' where id =  ?';
	util.dao.execute(query_sql, [ id ], function(tx, res) {
		if (res.rows.length) {
			$(".document_url").val(res.rows[0]['document_url']);
		}
	});
	$(".sync-btn").click(function() {
		var docId = 'doc_' + type + '_' + id;
		var docUrl = $(".document_url").val();
		var data = {
			'document_url' : docUrl
		};
		util.dao.update(table, data, id, function() {
			syncDocument(docUrl, docId, function(data_content) {
				$(".show-content").html(data_content);
			});
		});
	});
}
bindDocumentUrl();

function showDocument(type, id) {
	var docId = 'doc_' + type + '_' + id;
	var doc = Settings.getValue(docId);
	var docUrl = $(".document_url").val();
	if (!doc & docUrl) {
		syncDocument(docUrl, docId, function(data_content) {
			$(".show-content").html(data_content);
		});
	} else {
		$(".show-content").html(doc);
	}
}

showDocument(type, id);
