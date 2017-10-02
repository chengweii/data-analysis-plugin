var id = util.getQueryString("id");
 
$("#page-detail .back-btn").click(function () {
    location.href = "main.html?typeFrom=quota";
});
 
var query_sql = 'select * from analysis_quota where id =  ?';
util.dao.execute(query_sql, [id], function (tx, res) {
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
 
        renderRelationChart(res.rows[0]);
    }
});
 
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
 
    util.dao.execute(query_relations_sql + " object_id = ?", [object_id], function (tx, res) {
        if (res.rows.length) {
            queryrelations(res.rows, callback);
        }
    });
}
 
function getAllFactorAndQuota(callback) {
    var query_sql = "select f.id,2 as type,f.name_cn from analysis_factor f union all select q.id,1 as type,q.name_cn from analysis_quota q";
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
                title: quota.name_cn + "关联情况",
                legend: [quota.name_cn],
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
                name: quota.name_cn
            });
            util.chart.renderChrodChart(data);
        });
    })
}
 
function renderHistoryChart(quota) {
    var query_sql = 'select * from analysis_quota_history where quota_id = ? order by coordinate asc';
    util.dao.execute(query_sql, [id], function (tx, res) {
        if (res.rows.length) {
            var data = {
                chartId: "line-chart",
                legend: quota.name_cn,
                title: quota.name_cn + "历史",
                x_data: [],
                y_data: []
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