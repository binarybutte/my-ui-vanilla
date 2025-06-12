var assetURL = '../../assets';
var include = {
	meta : function(){
		document.write(`
			<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
			<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
			<meta name="format-detection" content="telephone=no">
		`);
		//document.write('<meta name="format-detection" content="telephone=no">');
	},
	styles : function(){
		document.write(`
			<link rel="stylesheet" type="text/css" href="${assetURL}/css/reset.css">
			<link rel="stylesheet" type="text/css" href="${assetURL}//css/common.css">`);
	},
	scripts : function(){
		document.write(``);
	},
	title : function(){
		document.write(`
			<title>Title</title>	
		`);
	},
	header : function(){
		document.write(`
			<div class="skip-navi"><a href="#gnb">주요 메뉴 바로가기</a><a href="#contents">본문 컨텐츠 바로가기</a></div>
			<header class="header">
				<div><h1>Header</h1></div>
			</header>	
		`);
	},
	footer : function(){
		document.write(`
			<footer class="footer">// Footer</footer>
		`);
	},
}