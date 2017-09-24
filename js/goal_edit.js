var id = util.getQueryString("id");

$("#page-edit .back-btn").click(function() {
	location.href = "main.html?typeFrom=goal";
});

function bindData() {
	var query_sql = 'select * from analysis_goal where id =  ?';
	util.dao.execute(query_sql, [ id ], function(tx, res) {
		if (res.rows.length) {
			$(".name").val(res.rows[0].name);
			$(".detail").val(res.rows[0].detail);
			$(".remark").text(res.rows[0].remark);
		}
	});
}
bindData();

$("#save-data").click(function() {
	var data = $(".form-control").serializeObject();
	util.dao.update('analysis_goal', data, id, function() {
		location.href = "main.html?typeFrom=goal";
	});
});