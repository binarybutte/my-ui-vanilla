/*========================================================
Tab
========================================================*/
// uiTab
function uiTab () {
    var tab = $('.ui-tab');
    var anchor = tab.find('li').children('a');

    anchor.on('click', function (e) {
        var tabID = $(this).attr("href");
        uiTabClick (this);
        if ($(this).parents().siblings('.ui-tab-container').length > 0) {
            $(tabID).addClass("active").siblings().removeClass("active");
        }
        e.preventDefault ? e.preventDefault() : (e.returnValue = false); // a태그 클릭시 브라우저 상단 이동 방지
    });
}
function uiTabClick (el) {
    $(el).parent('li').addClass('active').siblings('li').removeClass('active');
}


// uiJsTab
function uiJsTab () {
    var bindAll = function() {
        var menuElements = document.querySelectorAll('[data-tab]');
        for(var i = 0; i < menuElements.length ; i++) {
            menuElements[i].addEventListener('click', change, false);
        }
    }
    var clear = function() {
        var menuElements = document.querySelectorAll('[data-tab]');
        for(var i = 0; i < menuElements.length ; i++) {
            menuElements[i].parentNode.classList.remove('active');
            var id = menuElements[i].getAttribute('data-tab');
            document.getElementById(id).classList.remove('active');
        }
    }
    var change = function(e) {
        clear ();
        e.target.parentNode.classList.add('active');
        e.preventDefault ? e.preventDefault() : (e.returnValue = false); // a태그 클릭시 브라우저 상단 이동 방지
        var id = e.currentTarget.getAttribute('data-tab');
        document.getElementById(id).classList.add('active');
    }
    bindAll();
}


const myTabUI = {
    activeClass : 'ui-active',

    tabMenu : function (obj) {
        console.log(obj)
    },
    tabActive : function () {

    },
    tabInactive : function () {

    }

}

