$(function () {
    var URL = document.location.href;
    //var root = URL.split("/").reverse()[1];
    var menuURL = URL.split("/").reverse()[0];
    var pageURL = URL.split("/").reverse()[1];

   

   var gnbMenu = $('._pb-gnb').children('li').find('a');
   gnbMenu.each(function () {
        var pageValue = $(this).attr('data-page');

        if ( pageValue === pageURL ) {
            $(this).parent().addClass('on');
            $(this).parent().siblings().removeClass('on')
        }
    });

    var sideMenu = $('._pb-collapse').find('li');
    // 페이지 표시
    sideMenu.each(function () {
        var sideLink = $(this).children('a').attr('href');
        if ( sideLink === menuURL ) {
            $(this).addClass('on');
            $(this).parents('.collapse-item').addClass('current');
        }
    });

    // side collapse
    $('._pb-side-btn').on('click', function () {
        var linkMenu = $(this).next('._pb-links');
        if ( !linkMenu.hasClass('active') ) {
            $(this).addClass('on');
            linkMenu.addClass('active');
        } else if ( linkMenu.hasClass('active') ) {
            $(this).removeClass('on');
            linkMenu.removeClass('active');
        }
        console.log('click')
    });
    $(window).resize(function (){
        if ( $(window).width() > 768 ) {
            var linkMenu = $('._pb-links');
            if ( linkMenu.hasClass('active') ) {
                linkMenu.removeClass('active')
            }
        }
    });
    
    sideMenu.children('a').on('click', function () {
        if ( $(this).next('._pb-collapse-dep').length > 0 ) {
            $(this).next('._pb-collapse-dep').slideToggle(200)
        }
    })

    // 사이드메뉴 스크롤 위치값
    var depList =  $('._pb-collapse').find('li.on');
    // var posTop = Math.floor(depList.position().top)
    // $('._pb-links').scrollTop(posTop - 30)
    // console.log(posTop)

    // gnb
    $('._pb-gnb-btn').on('click', function (){
        if ( !$(this).hasClass('on') ) {
            $(this).addClass('on')
            $('body').addClass('_pb-gnb-open');
        } else if ( $(this).hasClass('on') ) {
            $(this).removeClass('on')
            $('body').removeClass('_pb-gnb-open');
        }
    })

    // $('._pb-article').each(function (index) {
    //     $(this).attr('id', 'article' + (index + 1));
    // })

    // 스크롤시 상단으로
    // $(window).on('scroll', function(){
    //     if ($(this).scrollTop() > 100){
    //         $('.btn-gotop').stop().fadeIn(200);
    //     } else{
    //         $('.btn-gotop').stop().fadeOut(200);
    //     }
    // });

    // $('.btn-gotop').on('click', function(){
    //     $('html, body').stop().animate({ scrollTop : 0 }, 200);
    // });

    scrollMove();

    $(window).resize(function (){
        scrollMove();

        if ( $('._pb-gnb-btn').hasClass('on') && $(window).width() >= 768 ) {
            $('body').removeClass('_pb-gnb-open')
            $('._pb-gnb-btn').removeClass('on')
        }
    });


    const sectionTips = document.querySelectorAll('._pb-section-tips');
    sectionTips.forEach(function (item, index) {
        const tipsItem = item.querySelector('._pb-info-item')
        const tipsText = tipsItem.innerHTML;
        const newLink = document.createElement('a');

        newLink.setAttribute('href',`${tipsText}`);
        newLink.setAttribute('target','_blank');
        newLink.textContent = `(${index + 1}) ${tipsText}`
        tipsItem.innerHTML = '';
        tipsItem.append(newLink);
    }) 

    const wrap = document.querySelector('._pb-guide');
    wrap.addEventListener('click', e => {
        const tipsBtn = getTarget(e.target, '_pb-tips-btn');
        closeTips ();
        if ( tipsBtn ) {
            const btnParent = tipsBtn.parentElement;
            btnParent.classList.add('on');
        } 
        
    });

    function closeTips () {
        sectionTips.forEach( item => {
            item.classList.remove('on');
        });
    }

    function getTarget (elem, className) {
        while ( !elem.classList.contains(className) ) {
            elem = elem.parentNode;

            if ( elem.nodeName == 'BODY' ) {
                elem = null;
                return;
            }
        }
        return elem; 
    }
});

function scrollMove () {
    var scrollHeader = $('body');

    scrollPos ()

    $(window).on('scroll', function(){
        scrollPos ()
    });

    function scrollPos () {
        var docScroll = $(document).scrollTop();
        if ( docScroll > 0 ) {
            scrollHeader.addClass('_pb-body-scroll');
        } else {
            scrollHeader.removeClass('_pb-body-scroll');
        }
    }
}

 

// function scrollMove () {
//     anchorNav =  $('._pb-anchor-nav'),
//     anchorNavList = anchorNav.find('li > a'),
//     headerH = Math.ceil($('._pb-header-wrap').height());
//     anchorNavH = Math.ceil(anchorNav.height()) + 15

//     // 메뉴이동
//     anchorNavList.on('click',function () {
//         var cnt = $(this).attr('href'),
//             cntPosIframe = $(cnt).offset().top - 50;

//         if ( !$(this).parents('._pb-anchor-nav').hasClass('scroll') ) {
//             var cntPos = $(cnt).offset().top - (headerH + anchorNavH) - anchorNavH
//         } else {
//             var cntPos = $(cnt).offset().top - (headerH + anchorNavH)
//         }
        
//         // iframe
//         if ( $(this).parents('._pb-page-tit').hasClass('in-iframe') ) {
//             $('html, body').stop().animate({ scrollTop : cntPosIframe }, 200);
//         } else {
//             $('html, body').stop().animate({ scrollTop : cntPos }, 200);
//         }
//     })

//     $(window).on('scroll', function(){
//         var docScroll = $(document).scrollTop();
//         if ( docScroll > headerH - 10 ) {
//             anchorNav.addClass('scroll')
//             anchorNav.prev().css('margin-bottom',anchorNavH - 15)
//             anchorNav.css('top',headerH)
//         } else {
//             anchorNav.removeClass('scroll')
//             anchorNav.prev().removeAttr('style')
//             anchorNav.removeAttr('style')
//         }
//     });
// }

