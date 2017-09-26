var id = util.getQueryString("id");

$("#page-detail .back-btn").click(function () {
	location.href = "main.html?typeFrom=factor";
});

var query_sql = 'select * from analysis_quota where id =  ?';
util.dao.execute(query_sql, [ id ], function(tx, res) {
	if (res.rows.length) {
		$(".name_cn").attr("title-content",res.rows[0]['name_cn']).html(res.rows[0]['name_cn']);
		$(".name_en").attr("title-content",res.rows[0]['name_en']).html(res.rows[0]['name_en']);
		$(".category").html(res.rows[0]['category']);
		$(".unit").html(res.rows[0]['unit']);
		$(".expression").attr("title-content",res.rows[0]['expression']).html(res.rows[0]['expression']);
		$(".period").html(res.rows[0]['period']);
		$(".coordinate").html(res.rows[0]['coordinate']);
		$(".reference_value").html(res.rows[0]['reference_value']);
		$(".remark").attr("title-content",res.rows[0]['remark']).html(res.rows[0]['remark']);
	}
});

var chrodChart = echarts.init(document.getElementById('chrod-chart'),e_macarons);

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

var lineChart = echarts.init(document.getElementById('line-chart'),e_macarons);

var lineOption = {
	    title : {
	        text: '未来一周气温变化',
	        subtext: '纯属虚构'
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['最高气温']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            magicType : {show: true, type: ['line', 'bar']}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            boundaryGap : false,
	            data : ['周一','周二','周三','周四','周五','周六','周日']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            axisLabel : {
	                formatter: '{value} °C'
	            }
	        }
	    ],
	    series : [
	        {
	            name:'最高气温',
	            type:'line',
	            data:[11, 11, 15, 13, 12, 13, 10],
	            markPoint : {
	                data : [
	                    {type : 'max', name: '最大值'},
	                    {type : 'min', name: '最小值'}
	                ]
	            },
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            }
	        }
	    ]
	};
lineChart.setOption(lineOption);
