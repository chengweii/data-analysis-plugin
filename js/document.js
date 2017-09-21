var id = util.getQueryString("id");
console.log(id);
$("#page-document .back-btn").click(function () {
	location.href = "main.html";
});

function syncDocument(docId,callback){
	$.get('http://www.jianshu.com/p/2a3b4f4fc368', function(data) {
		var data_content = $(data).find(".show-content").html();
		Settings.setValue('doc_'+docId,data_content);
		callback(data_content);
	});
}

function showDocument(docId){
	var doc = Settings.getValue('doc_'+docId);
	if(!doc){
		syncDocument(docId,function(data_content){
			$(".show-content").html(data_content);
		});
	}else{
		$(".show-content").html(doc);
	}
}

showDocument(id);
