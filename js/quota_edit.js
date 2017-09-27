$("#page-edit .back-btn").click(function() {
	location.href = "main.html?typeFrom=quota";
});

var save_fn;
var opreate = util.getQueryString("opreate");
var table = 'analysis_quota';
if (opreate == 'edit') {
	$("h1.title").html("编辑指标");
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
			location.href = "main.html?typeFrom=quota";
		});
	};
} else {
	$("h1.title").html("添加指标");
	save_fn = function() {
		var data = $(".form-control").serializeObject();
		util.dao.insert(table, data, function() {
			location.href = "main.html?typeFrom=quota";
		});
	};
}

$("#save-data").click(function() {
	var expression = $(".expression").val();
	var accessParams = [];
	$(".right-content-factor tbody tr").each(function(index, item) {
		accessParams.push($(this).attr("name-en"));
	});
	var result = util.math.checkExpression(expression, accessParams);
	if (result) {
		alert(result);
		return false;
	}
	save_fn();
});

function bindFactorList() {
	var query_sql = 'select * from analysis_factor';
	util.dao.execute(query_sql, null, function(tx, res) {
		if (res.rows.length) {
			var template = $(".right-content-factor tbody tr");
			$(".right-content-factor tbody").html("");

			for (var index = 0; index < res.rows.length; index++) {
				var tr = template.clone();
				tr.attr("name-cn", res.rows[index]['name_cn']);
				tr.attr("name-en", res.rows[index]['name_en']);
				tr.find(".name-cn").html(res.rows[index]['name_cn']);
				tr.find(".name-en").html(res.rows[index]['name_en']);
				tr.click(function() {
					$(".expression").insertAtCaret($(this).attr("name-en"));
				});
				$(".right-content-factor tbody").append(tr);
			}
		}
	});
	$(".search-btn").click(function() {
		var word = $(".search-input").val();
		$(".right-content-factor tbody tr").each(function(index, item) {
			var tr = $(this);
			var name_cn = tr.attr("name-cn");
			var name_en = tr.attr("name-en");
			if (name_cn.indexOf(word) != -1 || name_en.indexOf(word) != -1) {
				tr.show();
			} else {
				tr.hide();
			}
		});
	});
	$(".expression").focus(function() {
		$(".right-content-default").hide();
		$(".right-content-factor").show();
	});
}
bindFactorList();