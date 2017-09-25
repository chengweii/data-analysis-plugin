$("#page-edit .back-btn").click(function() {
	location.href = "main.html?typeFrom=factor";
});

var save_fn;
var opreate = util.getQueryString("opreate");
var table = 'analysis_factor';
if (opreate == 'edit') {
	$("h1.title").html("编辑要素");
	var id = util.getQueryString("id");
	function bindData() {
		var query_sql = 'select * from ' + table + ' where id =  ?';
		util.dao.execute(query_sql, [ id ], function(tx, res) {
			if (res.rows.length) {
				$(".name_cn").val(res.rows[0]['name_cn']);
				$(".name_en").val(res.rows[0]['name_en']);
				$(".category").val(res.rows[0]['category']);
				$(".unit").val(res.rows[0]['unit']);
				$(".expression").text(res.rows[0]['expression']);
				$(".period").val(res.rows[0]['period']);
				$(".coordinate").val(res.rows[0]['coordinate']);
				$(".reference_value").val(res.rows[0]['reference_value']);
				$(".remark").text(res.rows[0]['remark']);
			}
		});
	}
	bindData();
	save_fn = function() {
		var data = $(".form-control").serializeObject();
		util.dao.update(table, data, id, function() {
			location.href = "main.html?typeFrom=factor";
		});
	};
} else {
	$("h1.title").html("添加要素");
	save_fn = function() {
		var data = $(".form-control").serializeObject();
		util.dao.insert(table, data, function() {
			location.href = "main.html?typeFrom=factor";
		});
	};
}

$("#save-data").click(save_fn);