$("#page-calculate .back-btn").click(function() {
	location.href = "main.html?typeFrom=quota";
});

var id = util.getQueryString("id");

function renderCalculateView() {
	var query_sql = 'select * from analysis_quota where id =  ?';
	util.dao.execute(query_sql, [ id ], function(tx, res) {
		if (res.rows.length) {
			$(".expression").attr("title", res.rows[0]['expression']);
			$(".coordinate").attr("placeholder",
					$.convertor.period(res.rows[0]['period']));
			$(".coordinate").attr("period", res.rows[0]['period']);
			$(".coordinate").attr("name-cn", res.rows[0]['name_cn']);
			$(".quota-title").html(res.rows[0]['name_cn']);
			renderFactorsView(res.rows[0]['expression']);
		}
	});
}
renderCalculateView();

function renderFactorsView(expression) {
	var factors = util.math.getAllNode(expression).nodeList;
	factors = util.unique(factors);
	util.dao.execute("select * from analysis_factor where name_en in ('"
			+ factors.join("','") + "')", null, function(tx, res) {
		if (res.rows.length) {
			var template = $(".factor-list .row");
			$(".factor-list").html("");
			var expressionText = expression;
			for (var index = 0; index < res.rows.length; index++) {
				var row = template.clone();
				row.find(".factor-title").html(res.rows[index]["name_cn"]);
				row.find(".period").attr("placeholder",
						$.convertor.period(res.rows[index]["period"]));
				row.find(".period").attr("require-msg",
						res.rows[index]["name_cn"] + "的时间坐标不能为空。");
				row.find(".reference_value").attr("name",res.rows[index]["name_en"]);
				row.find(".reference_value").attr("factor-id",res.rows[index]["id"]);
				row.find(".reference_value").attr("require-msg",
						res.rows[index]["name_cn"] + "的参数值不能为空。");
				row.find(".period").attr("period", res.rows[index]["period"])
						.attr("name-cn", res.rows[index]["name_cn"]);
				row.find(".factor-unit").html(res.rows[index]["unit"]);
				$(".factor-list").append(row);
				row.show();
				expressionText = expressionText.replace(new RegExp(
						res.rows[index]["name_en"], "g"),
						res.rows[index]["name_cn"]);
			}
			$(".expression").html(expressionText);
		}
	});
}

$("#calculate-btn").click(function() {
	if (checkParams("calculate-require")) {
		var expression = $(".expression").attr("title");
		var factors = util.math.getAllNode(expression).nodeList;
		factors = util.unique(factors);
		
		var factorValues = $(".reference_value").serializeObject();
		
		var expressionValue = expression;
		for(var index in factors){
			expressionValue = expressionValue.replace(new RegExp(
					factors[index], "g"),factorValues[factors[index]]
					);
		}
		var result = util.math.calculate(expressionValue,4);
		$("#calculate-result").html(result);
		console.log(expressionValue);
	}
});

$("#save-data").click(function() {
	if (checkParams()&&checkCoordinate()) {
		var reference_value = $("#calculate-result").html();
		if(reference_value){
			var data = {reference_value:reference_value,coordinate:$(".coordinate").val()};
			util.dao.update('analysis_quota', data, id, function() {
				syncQuotaHistory();
				syncFactorHistory();
			});
		}
	}
});

function syncQuotaHistory(){
	var coordinate = $(".coordinate").val();
	var value = $("#calculate-result").html();
	var query_sql = 'select * from analysis_quota_history where quota_id =  ? and coordinate = ?';
	util.dao.execute(query_sql, [ id,coordinate ], function(tx, res) {
		var data = {quota_id:id,coordinate:coordinate,value:value};
		if (res.rows.length) {
			util.dao.update('analysis_quota_history', data, res.rows[0]['id'], function() {});
		}else{
			util.dao.insert('analysis_quota_history', data, function() {});
		}
	});
}

function syncFactorHistory(){
	$(".factor-list .row").each(function(index,item){
		var reference_value = $(item).find(".reference_value");
		var factor_id = reference_value.attr("factor-id");
		var value = reference_value.val();
		var coordinate = $(item).find(".coordinate-input").val();
		
		var query_sql = 'select * from analysis_factor_history where factor_id =  ? and coordinate = ?';
		util.dao.execute(query_sql, [ factor_id,coordinate ], function(tx, res) {
			var data = {factor_id:factor_id,coordinate:coordinate,value:value};
			if (res.rows.length) {
				util.dao.update('analysis_factor_history', data, res.rows[0]['id'], function() {});
			}else{
				util.dao.insert('analysis_factor_history', data, function() {});
			}
		});
	});
}

function checkCoordinate(){
	var isOk = true;
	$(".coordinate-input").each(function(index, item) {
		var obj = $(item);
		var value = obj.val();
		var period = obj.attr("period");
		var name_cn = obj.attr("name-cn");
		var checkInfo1 = util.date.checkDateTime(value, period);
		if (checkInfo1.hasError) {
			alert("[" + name_cn + "]的时间坐标输入错误：" + checkInfo1.errMsg);
			isOk = false;
			return false;
		}
	});
	return isOk;
}

function checkParams(requireClass) {
	var checkInfo = util.form.requireCheck(requireClass);
	if (checkInfo.hasError) {
		alert(checkInfo.errMsg);
		return false;
	}
	return true;
}