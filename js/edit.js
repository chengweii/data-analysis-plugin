var id = util.getQueryString("id");
console.log(id);
$("#page-edit .back-btn").click(function() {
	location.href = "main.html";
});

$("#save-data").click(function() {
	util.dao.insert('analysis_goal', {
		name : '似的发射点',
		detail : 'dsdsfdsd士大夫'
	});
});