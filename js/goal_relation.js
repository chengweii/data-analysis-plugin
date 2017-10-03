var id = util.getQueryString("id");
$("#page-relation .back-btn").click(function() {
	location.href = "main.html?typeFrom=goal";
});

var objectType = '3';

function bindSelect() {
	var checkbox = $(this);
	var isChecked = checkbox.prop("checked");
	var relationRemark = checkbox.parent().find(".relation-remark").val();
	var relationObject = checkbox.prop("id").split("_");
	var relationObjectType = relationObject[0];
	var relationObjectId = relationObject[1];
	if (isChecked) {
		if(!relationRemark||!relationRemark.trim()){
			alert("请输入关系说明。");
			checkbox.prop({checked:false});
			return false;
		}
		util.dao.insert('analysis_relations', {
			object_id : id,
			object_type : objectType,
			relation_object_id : relationObjectId,
			relation_object_type : relationObjectType,
			relation_remark : relationRemark.trim()
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
	var query_sql = "SELECT a.id, a.type, a.name_cn, a.name_en, b.id AS relation_id,b.relation_remark FROM ( SELECT q.id, '1' AS type, q.name_cn, q.name_en FROM analysis_quota q UNION ALL SELECT f.id, '2' AS type, f.name_cn, f.name_en FROM analysis_factor f ) a LEFT JOIN analysis_relations b ON b.object_id = ? AND b.object_type = ? AND b.relation_object_type = a.type AND b.relation_object_id = a.id";
	util.dao.execute(query_sql, [id,objectType], function(tx, res) {
		if (res.rows.length) {
			var template = $(".relation-list .checkbox");
			$(".relation-list").html("");
			for (var index = 0; index < res.rows.length; index++) {
				var checkbox = template.clone();
				var inputId = res.rows[index]["type"] + "_"
						+ res.rows[index]["id"];
				checkbox.find("input").attr("id", inputId).change(bindSelect);
				checkbox.find("label").html(res.rows[index]["name_cn"]);
				checkbox.find("label").attr("for", inputId).attr("title",
						res.rows[index]["name_en"]);
				$(".relation-list").append(checkbox);
				if(res.rows[index]["relation_id"]){
					checkbox.find("input").attr("checked",true);
					checkbox.find(".relation-remark").val(res.rows[index]["relation_remark"]);
				}
				checkbox.show();
			}
		}
	});
}

bindAlllist();

function queryQuotaRelations(object_id, callback) {
    var query_relations_sql = "select * from analysis_relations where ";
    var quotaRelationsList = [];
    var level = 0;
    var levelMax = 3;
    var queryrelations = function (relationList, callback) {
        var condition = "";
        for (var index = 0; index < relationList.length; index++) {
            quotaRelationsList.push(relationList[index]);
            var relation_object_type = relationList[index]["relation_object_type"];
            var relation_object_id = relationList[index]["relation_object_id"];
            condition = condition + "(object_type = '" + relation_object_type + "' and object_id = '" +
                relation_object_id + "')";
            if (index < relationList.length - 1) {
                condition = condition + " or";
            }
        }
        if (level == levelMax || !condition) {
            callback(quotaRelationsList);
            return false;
        }
        if (condition) {
            level++;
            var query_sql = query_relations_sql + condition;
            util.dao.execute(query_sql, null, function (tx, res) {
                if (res.rows.length) {
                    queryrelations(res.rows, callback);
                } else {
                    callback(quotaRelationsList);
                }
            });
        }
    }
 
    util.dao.execute(query_relations_sql + " object_id = ? and object_type = '3'", [object_id], function (tx, res) {
        if (res.rows.length) {
            queryrelations(res.rows, callback);
        }
    });
}

function getAllFactorAndQuota(callback) {
    var query_sql = "select f.id,2 as type,f.name_cn from analysis_factor f union all select q.id,1 as type,q.name_cn from analysis_quota q union all select g.id,3 as type,g.name as name_cn from analysis_goal g";
    util.dao.execute(query_sql, null, function (tx, res) {
        if (res.rows.length) {
            var fq_Map = {};
            for (var index = 0; index < res.rows.length; index++) {
                var id = res.rows[index]['id'];
                var type = res.rows[index]['type'];
                var name_cn = res.rows[index]['name_cn'];
                fq_Map[type + "_" + id] = name_cn;
            }
            callback(fq_Map);
        }
    });
}
 
function renderRelationChart(quota) {
    queryQuotaRelations(id, function (quotaRelationsList) {
        console.log(quotaRelationsList);
        getAllFactorAndQuota(function (fq_Map) {
            for (var index in quotaRelationsList) {
                var object_id = quotaRelationsList[index]["object_id"];
                var object_type = quotaRelationsList[index]["object_type"];
                quotaRelationsList[index]["object_name"] = fq_Map[object_type + "_" + object_id];
                var relation_object_id = quotaRelationsList[index]["relation_object_id"];
                var relation_object_type = quotaRelationsList[index]["relation_object_type"];
                quotaRelationsList[index]["relation_object_name"] = fq_Map[relation_object_type + "_" +
                    relation_object_id];
            }
            var data = {
                chartId: "chrod-chart",
                title: quota.name + "关联情况",
                legend: [quota.name],
                nodes: [],
                links: []
            };
            for (var index in quotaRelationsList) {
                data.nodes.push({
                    name: quotaRelationsList[index]["relation_object_name"]
                });
                data.links.push({
                    source: quotaRelationsList[index]["object_name"],
                    target: quotaRelationsList[index]["relation_object_name"],
                    weight: 1,
                    name: quotaRelationsList[index]["relation_remark"]
                });
            }
            data.nodes.push({
                name: quota.name
            });
            util.chart.renderChrodChart(data);
        });
    })
}

var query_sql = 'select * from analysis_goal where id =  ?';
util.dao.execute(query_sql, [id], function (tx, res) {
    if (res.rows.length) {
        renderRelationChart(res.rows[0]);
    }
});