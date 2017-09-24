var id = util.getQueryString("id");

$("#page-edit .back-btn").click(function() {
	location.href = "main.html?typeFrom=quota";
});

function bindData() {
	var query_sql = 'select * from analysis_quota where id =  ?';
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

$("#save-data").click(function() {
	var data = $(".form-control").serializeObject();
	util.dao.update('analysis_quota', data, id, function() {
		location.href = "main.html?typeFrom=quota";
	});
});