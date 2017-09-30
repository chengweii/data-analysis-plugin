var id = util.getQueryString("id");

$("#page-detail .back-btn").click(function() {
	location.href = "main.html?typeFrom=quota";
});

var query_sql = 'select * from analysis_quota where id =  ?';
util.dao.execute(query_sql, [ id ], function(tx, res) {
	if (res.rows.length) {
		$(".name_cn").attr("title-content", res.rows[0]['name_cn']).html(
				res.rows[0]['name_cn']);
		$(".name_en").attr("title-content", res.rows[0]['name_en']).html(
				res.rows[0]['name_en']);
		$(".category").html(res.rows[0]['category']);
		$(".unit").html(res.rows[0]['unit']);
		$(".expression").attr("title-content", res.rows[0]['expression']).html(
				res.rows[0]['expression']);
		$(".period").html($.convertor.period(res.rows[0]['period']));
		$(".coordinate").html(res.rows[0]['coordinate']);
		$(".reference_value").html(res.rows[0]['reference_value']);
		$(".remark").attr("title-content", res.rows[0]['remark']).html(
				res.rows[0]['remark']);

		renderHistoryChart(res.rows[0]);
		
		renderRelationChart();
	}
});

var chrodChart = echarts.init(document.getElementById('chrod-chart'),
		e_macarons);

var chrodOption = {
	title : {
		text : '德国队效力联盟',
		x : 'right',
		y : 'bottom'
	},
	tooltip : {
		trigger : 'item',
		formatter : function(params) {
			if (params.indicator2) { // is edge
				return params.indicator2 + ' ' + params.name + ' '
						+ params.indicator;
			} else { // is node
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
		data : [ '阿森纳', '拜仁慕尼黑', '多特蒙德' ]
	},
	series : [ {
		name : '德国队效力联盟',
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
		// 使用 nodes links 表达和弦图
		nodes : [ {
			name : '默特萨克'
		}, {
			name : '厄齐尔'
		}, {
			name : '波多尔斯基'
		}, {
			name : '诺伊尔'
		}, {
			name : '博阿滕'
		}, {
			name : '施魏因施泰格'
		}, {
			name : '拉姆'
		}, {
			name : '克罗斯'
		}, {
			name : '穆勒',
			symbol : 'star'
		}, {
			name : '格策'
		}, {
			name : '胡梅尔斯'
		}, {
			name : '魏登费勒'
		}, {
			name : '杜尔姆'
		}, {
			name : '格罗斯克罗伊茨'
		}, {
			name : '阿森纳'
		}, {
			name : '拜仁慕尼黑'
		}, {
			name : '多特蒙德'
		} ],
		links : [ {
			source : '阿森纳',
			target : '默特萨克',
			weight : 1,
			name : '效力'
		}, {
			source : '阿森纳',
			target : '厄齐尔',
			weight : 1,
			name : '效力'
		}, {
			source : '阿森纳',
			target : '波多尔斯基',
			weight : 1,
			name : '效力'
		}, {
			source : '拜仁慕尼黑',
			target : '诺伊尔',
			weight : 1,
			name : '效力'
		}, {
			source : '拜仁慕尼黑',
			target : '博阿滕',
			weight : 1,
			name : '效力'
		}, {
			source : '拜仁慕尼黑',
			target : '施魏因施泰格',
			weight : 1,
			name : '效力'
		}, {
			source : '拜仁慕尼黑',
			target : '拉姆',
			weight : 1,
			name : '效力'
		}, {
			source : '拜仁慕尼黑',
			target : '克罗斯',
			weight : 1,
			name : '效力'
		}, {
			source : '拜仁慕尼黑',
			target : '穆勒',
			weight : 1,
			name : '效力'
		}, {
			source : '拜仁慕尼黑',
			target : '格策',
			weight : 1,
			name : '效力'
		}, {
			source : '多特蒙德',
			target : '胡梅尔斯',
			weight : 1,
			name : '效力'
		}, {
			source : '多特蒙德',
			target : '魏登费勒',
			weight : 1,
			name : '效力'
		}, {
			source : '多特蒙德',
			target : '杜尔姆',
			weight : 1,
			name : '效力'
		}, {
			source : '多特蒙德',
			target : '格罗斯克罗伊茨',
			weight : 1,
			name : '效力'
		} ]
	} ]
};

chrodChart.setOption(chrodOption);

function queryQuotaRelations(object_id, callback) {
	var query_relations_sql = "select * from analysis_relations where ";
	var quotaRelationsList = [];
	var level = 0;
	var levelMax = 3;
	var queryrelations = function(relationList, callback) {
		var condition = "";
		for (var index = 0; index < relationList.length; index++) {
			quotaRelationsList.push(relationList[index]);
			var relation_object_type = relationList[index]["relation_object_type"];
			var relation_object_id = relationList[index]["relation_object_id"];
			condition = condition + "(object_type = '" + relation_object_type
					+ "' and object_id = '" + relation_object_id + "')";
			if (index < relationList.length - 1) {
				condition = condition + " or";
			}
		}
		if (level == levelMax||!condition) {
			callback(quotaRelationsList);
			return false;
		}
		if (condition) {
			level++;
			var query_sql = query_relations_sql + condition;
			util.dao.execute(query_sql, null, function(tx, res) {
				if (res.rows.length) {
					queryrelations(res.rows, callback);
				}else{
					callback(quotaRelationsList);
				}
			});
		}
	}

	util.dao.execute(query_relations_sql + " object_id = ?", [ object_id ],
			function(tx, res) {
				if (res.rows.length) {
					queryrelations(res.rows, callback);
				}
			});
}

function renderRelationChart(quota) {
	queryQuotaRelations(id, function(quotaRelationsList) {
		console.log(quotaRelationsList);
		var data = {
				chartId : "chrod-chart",
				title : quota.name_cn + "关联情况",
				legend : [quota.name_cn],
				nodes : [],
				links : []
			};
		for(var index in quotaRelationsList){
			data.nodes.push({name:quotaRelationsList[index]});
		}
		data.nodes.push({name:quota.name_cn});
	})
}

function renderHistoryChart(quota) {
	var query_sql = 'select * from analysis_quota_history where quota_id = ? order by coordinate asc';
	util.dao.execute(query_sql, [ id ], function(tx, res) {
		if (res.rows.length) {
			var data = {
				chartId : "line-chart",
				legend : quota.name_cn,
				title : quota.name_cn + "历史",
				x_data : [],
				y_data : []
			};
			if (quota.unit) {
				data.unit = quota.unit;
			}
			for (var index = 0; index < res.rows.length; index++) {
				var value = res.rows[index]['value'];
				var coordinate = res.rows[index]['coordinate'];
				data.x_data.push(coordinate);
				data.y_data.push(value);
			}

			util.chart.renderLineChart(data);
		}
	});
}
