$(function () {
    var tb_div = $('._pb-list-table'),
    tb_list = $('._pb-list-table table tbody'),
    total = tb_list.children('tr').not('.del').length,
    total_done = tb_list.children('tr.done').length,
    total_percent = total_done / total * 100,
    percent = total_percent.toFixed(0);

    $('._pb-status').find('.total').text(total);
    $('._pb-status').find('.page').text(total_done); 
    $('._pb-status').find('.percent').text(percent);

    tb_div.each(function (index) {
        $(this).attr('id', 'menu' + index);
    })

    tb_list.find('td').each(function () {
        if ($(this).hasClass('file')) {
            var link = $(this).text();
            $(this).html('<a href="html/' + link + '" target="_blank">' + link + '</a>');
        }
        // if ($(this).parent('tr').hasClass('ing')) {
        //     $(this).siblings('.comment').append().text('작업중')
        // }
        if ($(this).parent('tr').hasClass('del')) {
        	$(this).siblings('.comment').text('삭제된 페이지')
        }
    });

    $('._pb-toggle').each(function () {
        $(this).click(function () {
           $(this).toggleClass('off').parent('._pb-list-table').toggleClass('off');
        })
    });

    $('._pb-status-wrap').children('li').each(function () {
        var tb_id = $(this).children('a').attr('href'),
        tb_menu = $(tb_id).find('tbody').children('tr').not('.del').length,
        tb_menu_done = $(tb_id).find('tbody').children('tr.done').length;

        var allpercent = tb_menu_done / tb_menu * 100,
        percent = allpercent.toFixed(1); 

        $(this).find('.page-total').text(tb_menu);
        $(this).find('.page-num').text(tb_menu_done);
        $(this).find('.page-percent').text(percent);
    })

    // 스크롤 이벤트
    var statbox = $('._pb-status-list'),
    statboxPos = statbox.offset().top;
    statboxH = statbox.height() + 5;
    
    $(document).on('scroll', function(){
        var docScroll = $(document).scrollTop();
        if( docScroll > statboxPos ){
            statbox.addClass('fix');
            $('._pb-status').css('margin-bottom',statboxH)
        } else {
            statbox.removeClass('fix');
            $('._pb-status').removeAttr('style')
        }
        // 위로가기
        goTop();
    });

    statbox.find('a').on('click', function () {
        var link = $(this).attr('href'),
        linkPos = Math.ceil($(link).offset().top);

        $('html,body').animate({
            scrollTop: linkPos - statboxH
        }, 200);
    })

    $('.btn-gotop').on('click', function(){
        $('html, body').stop().animate({ scrollTop : 0 }, 200);
    });
});

// goTop
function goTop(){
    if ($(this).scrollTop() > 100){
        $('.btn-gotop').stop().fadeIn(200);
    } else{
        $('.btn-gotop').stop().fadeOut(200);
    }
}

