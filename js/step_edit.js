$("#page-edit .back-btn").click(function() {
	location.href = "main.html?typeFrom=step";
});

var save_fn;
var opreate = util.getQueryString("opreate");
var table = 'analysis_step';
if (opreate == 'edit') {
	$("h1.title").html("编辑步骤");
	var id = util.getQueryString("id");
	function bindData() {
		var query_sql = 'select * from ' + table + ' where id =  ?';
		util.dao.execute(query_sql, [ id ], function(tx, res) {
			if (res.rows.length) {
				$(".name").val(res.rows[0].name);
				$(".content").val(res.rows[0].content);
				$(".attentions").text(res.rows[0].attentions);
			}
		});
	}
	bindData();
	save_fn = function() {
		var data = $(".form-control").serializeObject();
		util.dao.update(table, data, id, function() {
			location.href = "main.html?typeFrom=step";
		});
	};
} else {
	$("h1.title").html("添加步骤");
	save_fn = function() {
		var data = $(".form-control").serializeObject();
		util.dao.insert(table, data, function() {
			location.href = "main.html?typeFrom=step";
		});
	};
}

$("#save-data").click(save_fn);