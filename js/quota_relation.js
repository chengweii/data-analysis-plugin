var id = util.getQueryString("id");
$("#page-relation .back-btn").click(function() {
	location.href = "main.html?typeFrom=quota";
});

var objectType = '1';

function bindSelect() {
	var checkbox = $(this);
	var isChecked = checkbox.prop("checked");
	var relationRemark = checkbox.parent().find(".relation-remark").val();
	var relationObject = checkbox.prop("id").split("_");
	var relationObjectType = relationObject[0];
	var relationObjectId = relationObject[1];
	if (isChecked) {
		if(!relationRemark||!relationRemark.trim()){
			checkbox.attr("checked",false);
			alert("请输入关系说明。");
			return false;
		}
		util.dao.insert('analysis_relations', {
			object_id : id,
			object_type : objectType,
			relation_object_id : relationObjectId,
			relation_object_type : relationObjectType,
		});
	} else {
		util.dao
				.execute(
						"delete from analysis_relations where object_id = ? and object_type = ? and relation_object_id = ? and relation_object_type = ?",
						[ id, objectType, relationObjectId, relationObjectType ],
						function(tx, res) {
						});
	}
}

function bindAlllist() {
	var query_sql = "SELECT a.id, a.type, a.name_cn, a.name_en, b.id AS relation_id,b.relation_remark FROM ( SELECT q.id, '1' AS type, q.name_cn, q.name_en FROM analysis_quota q where q.id not in (?) UNION ALL SELECT f.id, '2' AS type, f.name_cn, f.name_en FROM analysis_factor f ) a LEFT JOIN analysis_relations b ON b.object_id = ? AND b.object_type = ? AND b.relation_object_type = a.type AND b.relation_object_id = a.id";
	util.dao.execute(query_sql, [ id, id, objectType ], function(tx, res) {
		if (res.rows.length) {
			var template = $(".relation-list .checkbox");
			$(".relation-list").html("");
			for (var index = 0; index < res.rows.length; index++) {
				var checkbox = template.clone();
				var inputId = res.rows[index]["type"] + "_"
						+ res.rows[index]["id"];
				checkbox.find("input").attr("id", inputId).click(bindSelect);
				checkbox.find("label").html(res.rows[index]["name_cn"]);
				checkbox.find("label").attr("for", inputId).attr("title",
						res.rows[index]["name_en"]);
				$(".relation-list").append(checkbox);
				if (res.rows[index]["relation_id"]) {
					checkbox.find("input").attr("checked", true);
					checkbox.parent().find(".relation-remark").val(res.rows[index]["relation_remark"]);
				}
				checkbox.show();
			}
		}
	});
}

bindAlllist();

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
