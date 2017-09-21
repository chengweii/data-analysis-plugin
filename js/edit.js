var id = util.getQueryString("id");
console.log(id);
$("#page-edit .back-btn").click(function() {
	location.href = "main.html";
});

var i=1;
$("#save-data").click(function(){
	var row = [];
	row.push([ {
		'name' : 'id',
		'value' : i
	}, {
		'name' : 'name',
		'value' : 'ceshi'+i
	} ]);
	assistantDb.insert('analysis_quota', row);
	i++;
});