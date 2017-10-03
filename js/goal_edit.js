$("#page-edit .back-btn").click(function() {
	location.href = "main.html?typeFrom=goal";
});

var save_fn;
var opreate = util.getQueryString("opreate");
var table = 'analysis_goal';
if (opreate == 'edit') {
	$("h1.title").html("编辑目标");
	var id = util.getQueryString("id");
	function bindData() {
		var query_sql = 'select * from ' + table + ' where id =  ?';
		util.dao.execute(query_sql, [ id ], function(tx, res) {
			if (res.rows.length) {
				$(".name").val(res.rows[0].name);
				$(".detail").val(res.rows[0].detail);
				$(".remark").text(res.rows[0].remark);
			}
		});
	}
	bindData();
	save_fn = function() {
		var data = $(".form-control").serializeObject();
		util.dao.update(table, data, id, function() {
			location.href = "main.html?typeFrom=goal";
		});
	};
} else {
	$("h1.title").html("添加目标");
	save_fn = function() {
		var data = $(".form-control").serializeObject();
		util.dao.insert(table, data, function() {
			location.href = "main.html?typeFrom=goal";
		});
	};
}

$("#save-data").click(function(){
	if(checkParams()){
		save_fn();
	}
});

function checkParams(){
	var checkInfo = util.form.requireCheck();
	if (checkInfo.hasError) {
		alert(checkInfo.errMsg);
		return false;
	}
	
	return true;
}