/*========================================================
Layer Popup
========================================================*/
function uiOnloadPop (id) { 
    var popupElem = $(id);
    layerOpen (popupElem);

    $('.ui-close-pop').on('click', function () {
        layerClose($(this))
    })
}

function uiLayerPop () {
    var btnAnchor = $('.ui-open-pop');
    var close = $('.ui-close-pop');

    btnAnchor.on('click', function () {
        btnTarget = $(this);
        var popupID;
        if ( btnTarget.is('button') ) {
            popupID = btnTarget.attr('data-layer');
        } else if ( btnTarget.is('a') ) {
            popupID = btnTarget.attr("href")
        }

        var popLayer = $(popupID);
        if ( !btnTarget.parents('.layer-pop').length ) {
            layerOpen (popLayer);
        } else if ( btnTarget.parents('.layer-pop').length ) {
            innerlayerOpen (popLayer);
        }
    })

    close.on('click', function () {
        layerClose($(this), btnTarget)
    })
}

function layerOpen (id) {
    var scrollValue = $('body').scrollTop();
    $('body').css({'overflow':'hidden'}).scrollTop(scrollValue);
    $(id).show().attr('tabIndex','0').focus;

    var popHeight = $(id).find('.layer-inner'); 
    // 팝업 최대 높이값을 윈도우 높이에 맞출 때 실행함
    layerHeight (popHeight); 

    // transform 버그 보완을 위해 높이값 짝수로 맞춤 (작업 중 2022.05.18)
    //layerMathHeight (popHeight);
}

function innerlayerOpen (id) {
    var scrollValue = $('body').scrollTop();
    $('body').addClass('layer-dim').scrollTop(scrollValue);
    $(id).show().addClass('layer-index').attr('tabIndex','0').focus;
}

function layerClose (el, btnTarget) {
    var layerWrap = $(el).parents('.layer-wrap');
    if ( !$(el).parents('.layer-index').length ) {
        $('body').removeAttr('style');
    } else if ( $(el).parents('.layer-index').length ) {
        $('body').removeClass('layer-dim');
    }
    $(el).siblings('.layer-body').find('.layer-content').scrollTop(0).removeAttr('style');
    layerWrap.hide();
    btnTarget === undefined ? btnTarget = '' : btnTarget.focus()
    // if ( btnTarget === undefined ) {
    //     btnTarget = '';
    // } else {
    //     btnTarget.focus();
    // }
}

// 팝업 최대 높이값을 윈도우 높이에 맞출 때 실행함
function layerHeight (popHeight) {
    var layerInner = $(popHeight),
    layerH = layerInner.outerHeight();
    
    maxLayerHeight ();

    $(window).resize(function () {
        maxLayerHeight ();
    })

    function maxLayerHeight () {
        var winH = $(window).height();
        var layerContetnt = layerInner.find('.layer-content')
        if ( layerH >= winH ) {
            layerContetnt.css('max-height',winH - 200)
        } else if ( layerH < winH ) {
            layerContetnt.removeAttr('style')
        }
       // console.log(layerH)
    }
}

// transform 버그 보완을 위해 높이값 짝수로 맞춤 (작업 중 2022.05.18)
function layerMathHeight (popHeight) {
    var layerInner = $(popHeight),
    layerH = layerInner.outerHeight();
    mathHeight = Math.floor(layerH)
    layerHeight % 2 === 0 ? '' : layer.css('min-height',mathHeight + 1);
}