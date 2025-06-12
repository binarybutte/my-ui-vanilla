var baseURL = '../../basis';
var assetURL = '../../assets';
// var assetURL = '../../../../pc';
var commonURL = '../../../common';
var include = {
	meta : function () {
		document.write(`
			<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
			<!-- <meta name="viewport" content="width=1280"> -->
			<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
			<meta name="format-detection" content="telephone=no">
		`);
	},
	styles : function () {
		document.write(`
			<link rel="stylesheet" type="text/css" href="${assetURL}/css/reset.css">
			<link rel="stylesheet" type="text/css" href="${assetURL}/css/layout.css">
			<link rel="stylesheet" type="text/css" href="${assetURL}/css/navigation.css">
			<link rel="stylesheet" type="text/css" href="${assetURL}/css/content.css">
			<link rel="stylesheet" type="text/css" href="${assetURL}/css/forms.css">
			<link rel="stylesheet" type="text/css" href="${assetURL}/css/display.css">
			<link rel="stylesheet" type="text/css" href="${assetURL}/css/tables.css">
			<link rel="stylesheet" type="text/css" href="${assetURL}/css/dialogue.css">
			<link rel="stylesheet" type="text/css" href="${assetURL}/css/utilities.css">
			<link rel="stylesheet" type="text/css" href="${assetURL}/css/svg.css">
			<link rel="stylesheet" type="text/css" href="${assetURL}/css/icons.css">
			<link rel="stylesheet" type="text/css" href="${baseURL}/pb_style.css"><!--// 퍼블리싱가이드용 css -->
			<link rel="stylesheet" type="text/css" href="${baseURL}/pb_template.css"><!--// 퍼블리싱가이드용 css -->	
		`);
		// <link rel="stylesheet" type="text/css" href="../../../../css/common.css"><!--// 실제 적용해야 할 css 경로 -->
	},
	scripts : function () {
		document.write(`
			<script defer src="${baseURL}/pb_guide_ui.js"></script> <!--// 퍼블리싱가이드용 js -->	
			<script src="${assetURL}/js/common_ui.js"></script>
			<script src="${assetURL}/js/dialogue.js"></script>
			<script src="${assetURL}/js/popup.js"></script>
			<script src="${assetURL}/js/navigation.js"></script>
			<script src="${assetURL}/js/display.js"></script>
			<script src="${assetURL}/js/form.js"></script>
			<script src="${assetURL}/js/init.js"></script>
		`);
	},
	title : function () {
		document.write(`
			<title>UI Documents</title>	
		`);
	},
	header : function () {
		document.write(`
			<header class="_pb-header">
				<div class="_pb-header-wrap">
					<div class="_pb-header-inner">
						<h1>UI Documents</h1>
					</div><!--// header :: header-inner -->
					<!-- ## Gnb영역 -->
					<nav class="_pb-gnb-wrap">
						<button class="_pb-gnb-btn"><span></span></button>
						<div class="_pb-gnb-panel">
							<div class="_pb-gnb-inner">
								<!-- util -->
								<div class="_pb-util">
									<ul class="util-01">
										<li><a href="../_template/template.html"><span>Template</span></a></li>
									</ul>
									<ul class="util-03">
										<li><a href="../../../pc/work_list.html" target="_blank"><span>퍼블리싱 작업 현황</span></a></li>
									</ul>
								</div>
								<!--// util -->
								<ul class="_pb-gnb">
									<li><a data-page="intro" href="../intro/intro.html"><span>Intro</span></a></li>
									<li><a data-page="layout" href="../layout/layout.html"><span>Layout</span></a></li>
									<li><a data-page="components" href="../components/typography.html"><span>Components</span></a></li>
									<li><a data-page="utilities" href="../utilities/helper.html"><span>Utilities</span></a></li>
									<li><a data-page="icons" href="../icons/svg.html"><span>Icons & Animation</span></a></li>
									<li><a data-page="library" href="../library/swiper.html"><span>Library</span></a></li>
									<li><a data-page="tips" href="../tips/tipstech_js.html"><span>Tips</span></a></li>
									<li><a data-page="playground" href="../playground/plaid.html"><span>Playground</span></a></li>
								</ul>
							</div>
						</div>
					</nav><!--// gnb-wrap -->
					<!--// ## Gnb영역 -->
				</div><!--// header-wrap -->
			</header>	
		`);
	},
	sidebar : function (menu) {
		const _sideBar = document.querySelector('._pb-side-bar');
		const _navTag = `<button type="button" class="_pb-side-btn"><span></span></button><nav class="_pb-links"></nav>`;
	
		_sideBar.insertAdjacentHTML('afterbegin', _navTag)
		
		const createList = function () {
			const newCollapseUl = document.createElement('ul');
			newCollapseUl.className = '_pb-collapse';
			document.querySelector('._pb-links').append(newCollapseUl);
			
			let itemArr;
			if ( menu === 'Layout' ) {
				itemArr = [
					{
						subject : 'Page',
						items : [
							['Layout', 'layout.html'],
							['Frame', 'frame.html'],
						]
					},
					{
						subject : 'Contents',
						items : [
							['Flexbox', 'flexbox.html'],
							['Grid', 'grid.html'],
							['List group', 'listgroup.html'],
							['Masonry', 'masonry.html'],
							['Column', 'column.html'],
							['Inline-block', 'inlineblock.html'],
						]
					},
				]
			}
			if ( menu === 'Components' ) {
				itemArr = [
					{
						subject : 'Contents',
						items : [
							['Typography', 'typography.html'],
							['Color', 'color.html'],
							['Badges & Chips', 'badges.html'],
							['Images', 'images.html']
						]
					},
					{
						subject : 'Navigation',
						items : [
							['Dropdown menu', 'dropdown.html'], // 메뉴 Dropdown
							['Tabs & Selection', 'tabs.html'],
							['Breadcrumb & Pagination', 'breadcrumb.html'],
						]
					},
					{
						subject : 'Display',
						items : [
							['Accordion', 'accordion.html'],
							['Toggle', 'toggle.html'],
							['Carousel', 'carousel.html'],
							['Stepper', 'stepper.html'],
							['Scroll contents', 'scrollcontents.html'],
							['Drag & Drop', 'drag.html']
						]
					},
					{
						subject : 'Dialogue',
						items : [
							['Popup', 'popup.html'],
							['Popover & Tooltip', 'popover.html'],
							['Alert & Others', 'alert.html']
						]
					},
					{
						subject : 'Tables',
						items : [
							['Basic', 'tables.html'],
							['Scroll', 'scrolltables.html'],
							['Responsive', 'responsivetables.html']
						]
					},
					{
						subject : 'Forms',
						items : [
							['Buttons', 'buttons.html'],
							['Checkboxes & Radios', 'checkboxes.html'],
							['Inputs & Textarea', 'inputs.html'],
							['Combobox', 'combobox.html'],
							['Progress', 'progress.html'],
							['Input group', 'inputgroups.html'],
							['Input group (JS)', 'inputgroups_js.html'],
							['Validation', 'validation.html'],
						]
					}
				]
			}
			if ( menu === 'Utilities' ) {
				itemArr = [
					{
						subject : 'Helper classes',
						items : [
							['Helper classes', 'helper.html']
						],
					},
				]
			}
			if ( menu === 'Icons' ) {
				itemArr = [
					{
						subject : 'Icons',
						items : [
							['SVG', 'svg.html'],
							['CSS', 'css.html'],
							['Bitmap', 'bitmap.html']
						]
					},
					{
						subject : 'Animation',
						items : [
							['CSS', 'ani_css.html'],
							['SVG', 'ani_svg.html'],
							['Canvas', 'ani_canvas.html'],
							['Lottie', 'ani_lottie.html']
						]
					}
				]
			}
			if ( menu === 'Library' ) {
				itemArr = [
					{
						subject : 'Slide',
						items : [
							['Swiper', 'swiper.html'],
							['Slick', 'slick.html']
						]
					},
					{
						subject : 'Calendar',
						items : [
							['Toast UI', 'planner.html']
						]
					},
					{
						subject : 'Layout',
						items : [
							['Masonry', 'masonry.html']
						]
					},
				]
			}
			if ( menu === 'Tips' ) {
				itemArr = [
					{
						subject : 'Javascript',
						items : [
							['√ Tips & Tech', 'tipstech_js.html'],
							['√ Copy & paste', 'copypaste_js.html'],
							['EventListener', 'eventListener.html'],
							['Scroll event', 'scrollevent.html'],
							['Function', 'function.html'],
							['Observer', 'observer.html'],
							['Promise & async, await', 'promise.html'],
							['requestAnimationFrame','requestAnimationFrame.html'],
						]
					},
					{
						subject : 'CSS',
						items : [
							['√ New Reference', 'reference_css.html'],
							['√ Copy & paste', 'copypaste_css.html'],
							['Tricks', 'tricks.html'],
							['Print CSS & Mediaquery', 'print.html'],
						]
					},
					{
						subject : 'HTML',
						items : [
							['√ Copy & paste', 'copypaste.html'],
							['Web Accessibility', 'accessibility.html'],
							['Special symbols', 'symbols.html'],
						]
					},
					{
						subject : 'Design',
						items : [
							['Display Size & Ratio', 'display_ratio.html'],
							// ['Viewport', 'viewport.html'],
						]
					},
				]
			}
			if ( menu === 'Playground' ) {
				itemArr = [
					{
						subject : 'Visual notes',
						items : [
							['Plaid', 'plaid.html']
						],
					},
					{
						subject : 'Samples',
						items : [
							['Puzzle', 'puzzle.html'],
							['Puzzle2', 'puzzle2.html']
						],
					},
				]
			}

			Object.keys(itemArr).forEach(function (item, i) {
				const newLi = document.createElement('li');
				const newAnchor = document.createElement('a');
				const newUl = document.createElement('ul');
				newLi.className = 'collapse-item';
				newUl.className = '_pb-collapse-dep';
				newCollapseUl.append(newLi);
				newLi.append(newAnchor);
				newLi.append(newUl);
				newAnchor.setAttribute('href','#');
				newAnchor.textContent = `${itemArr[i].subject}`

				for( let j = 0; j < itemArr[i].items.length; j++ ) {
					const new2DepLi = document.createElement('li');
					const new2DepAnchor = document.createElement('a');
					new2DepLi.className = 'collapse-dep-item';
					newUl.append(new2DepLi);
					new2DepLi.append(new2DepAnchor);
					new2DepAnchor.setAttribute('href',`${itemArr[i].items[j][1]}`);
					new2DepAnchor.textContent = `${itemArr[i].items[j][0]}`;
				}
			});
		};

		createList();
	},
	bottom : function () {
		document.write(`
			<button type="button" class="btn-gotop"><span>TOP</span></button>	
		`);
	},
}