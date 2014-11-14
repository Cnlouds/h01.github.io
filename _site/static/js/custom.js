/*
 * Custom.js 4 Hotes
 * http://ursb.org
 */

// 文章JSON数据
var posts = new Array();

// 获取分类文章列表
function getCategory(type){
	var html = "";
	type = type.toUpperCase();
	$.each(posts, function(i){
		if (posts[i].category.toUpperCase() == type || type == "ALL") {
			html += genPostHtml(posts[i]);
		};
	});
	if (html == "") {
		html = genPostHtml({
			style: "warning",
			link: "#",
			date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " 00:00:00 +0000",
			desc: "没有<code>" + type + "</code>这个分类 =$@.@$=",
			title: "出错啦"
		});
	};
	$("#posts").html(html);
}

// 生成文章列表HTML
function genPostHtml(obj){
	var html = '<div class="col-md-6 col-sm-12 col-xs-12">';
	html += '<div class="panel panel-' + (obj.style || "default") + '">';
	html += '	<div class="panel-heading">';
	html += '		<h3 class="panel-title"><span class="glyphicon glyphicon-file"></span> <a href="' + obj.link + '">' + obj.title + '</a></h3>';
	html += '	</div>';
	html += '	<div class="panel-body">';
	html += '		<div class="media">';
	html += '			<div class="pull-left" align="center">';
	html += '				<p style="font-size: 33px;margin-bottom: -5px;" class="text-' + (obj.style || "default") + '">' + obj.date.split(" ")[0].split("-")[2] + '</p>';
	html += '				<p class="text-' + (obj.style || "default") + '">' + obj.date.split(" ")[0].split("-")[0] + "-" + obj.date.split(" ")[0].split("-")[1] + '</p>';
	html += '			</div>';
	html += '			<div class="media-body text-' + (obj.style || "default") + '" style="padding-left: 5px;">';
	html += obj.desc;
	html += '			</div>';
	html += '		</div>';
	html += '	</div></div></div>';
	return html;
}

// 加载js文件(用于代码高亮)
function loadScript(url, editor, ctype, callback){
	var script = document.createElement("script");
	script.type = "text/javascript";
	if (script.readyState) {
		script.onreadystatechange = function(){
			if (script.readyState == "loaded" || script.readyState == "complete") {
				script.onreadystatechange = null;
				callback(editor, ctype);
			};
		}
	}else{
		script.onload = function(){
			callback(editor, ctype);
		}
	};
	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

$(document).ready(function(){
	// 获取文章JSON数据列表
	$.getJSON("/api/posts.json", function(temp){
		posts = temp;
	});
	// 代码高亮
	var codemirror_editor = document.getElementsByClassName("code");
	if (codemirror_editor.length > 0) {
		for (var i = 0; i < codemirror_editor.length; i++) {
			var _editor = codemirror_editor[i];
			var _ctype = _editor.className.replace(/code /, '');
			loadScript("/static/codemirror-4.7/mode/" + _ctype + "/" + _ctype + ".js", _editor, _ctype, function(editor, ctype){
				CodeMirror.fromTextArea(editor, {
					mode:	ctype,
					tabMode:	"indent",
					lineNumbers:	true,
					textWarpping:	true,
					readOnly:	true
				});
			});
		};
	};
	// 替换markdown元素
	var h4s = document.getElementsByTagName("h4");
	for (var i = 0; i < h4s.length; i++) {
		h4s[i].setAttribute("id", h4s[i].innerText);
		h4s[i].setAttribute("onclick", "javascript:location.href='#' + this.innerText;");
	};
})