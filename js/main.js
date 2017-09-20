var result = math.eval("(5+3)*2.5/3");

function showNode(node) {
	node.forEach(function (node, path, parent) {
		if (node.args) {
			showNode(node);
		} else {
			console.log(node.name);
		}
	});
}

function transform(node) {
	var transformed = node.transform(function (node, path, parent) {
		if (node.isSymbolNode && node.name === 'roi_month') {
			return new math.expression.node.ConstantNode(3);
		} else if (node.isSymbolNode && node.name === 'ss') {
			return new math.expression.node.ConstantNode(5);
		} else if (node.isSymbolNode && node.name === 'dd') {
			return new math.expression.node.ConstantNode(8);
		}
		else {
			return node;
		}
	});
	return transformed.toString();
}
var node = math.parse('roi_month * ss + dd');
showNode(node);
var newexpression = transform(node);

$(".card-header .title").click(function () {
	$(".card-content").hide();
	$(".card-header .title").removeClass("card-selected");
	$(this).addClass("card-selected");
	$("." + $(this).attr("card-class")).show();
});

util.bindTitleTip('title-tip');