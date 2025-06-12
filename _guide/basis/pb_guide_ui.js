
/* GNB, SNB 메뉴 활성화
========================================================*/
(function(){
    const URL = document.location.href;
    //const root = URL.split("/").reverse()[1];
    const menuURL = URL.split('/').reverse()[0];
    const pageURL = URL.split('/').reverse()[1];
    const gnb = document.querySelector('._pb-gnb');
    const gnbMenu = gnb.querySelectorAll('a');
    const gnbBtn_mo = document.querySelector('._pb-gnb-btn');
    const snb = document.querySelector('._pb-collapse');
    const snbMenuList = snb.querySelectorAll('li')
    const snbBtn_mo = document.querySelector('._pb-side-btn');
    
    /*** gnb ***/
    gnbMenu.forEach((item) => {
        const pageValue = item.getAttribute('data-page')
        if ( pageValue === pageURL ) {
            item.parentElement.classList.add('on');
            menuInactive (gnbMenu);
        }
    });
    // mobile
    const wrapBody = document.querySelector('body')
    gnbBtn_mo.addEventListener('click', function () {
        if ( !gnbBtn_mo.classList.contains('on') ) {
            gnbBtn_mo.classList.add('on')
            wrapBody.classList.add('_pb-gnb-open')
        } else {
            gnbBtn_mo.classList.remove('on')
            wrapBody.classList.remove('_pb-gnb-open')
        }
    })

    /*** side ***/
    let activeItem;
    snbMenuList.forEach((item) => {
        const link = item.querySelector('a')
        const linkValue = link.getAttribute('href')
        if ( linkValue === menuURL ) {
            menuInactive (snbMenuList);
            item.classList.add('on');
            item.closest('.collapse-item').classList.add('current');
            activeItem = item.offsetTop;
        }
    });
    // side (mobile)
    const sideBar = document.querySelector('._pb-side-bar');
    const sideBarLinks = document.querySelector('._pb-links');

    snbBtn_mo.addEventListener('click', function () {
        if ( !sideBar.classList.contains('active') ) {
            sideBar.classList.add('active');
        } else {
            sideBar.classList.remove('active');
        }
    })
    window.addEventListener('resize', function () {
        if ( window.innerWidth > 768 && sideBar.classList.contains('active') ) {
            sideBar.classList.remove('active')
        }
    })

    sideBarLinks.scrollTo({
        top: activeItem,
        behavior: 'auto'
    })

    /*** scrollMove ***/
    scrollPosition ();

    window.addEventListener('scroll', function () {
        scrollPosition ()
    });

    function scrollPosition () {
        const scrollBody = document.querySelector('body');
        const docScroll = window.scrollY
        if ( docScroll > 0 ) {
            scrollBody.classList.add('_pb-body-scroll')
        } else {
            scrollBody.classList.remove('_pb-body-scroll')
        }
    }

    const compToggleBTn = document.querySelectorAll('._pb-toggle-btn');

    compToggleBTn.forEach((btn) => {
        const box = btn.parentElement;
        btn.addEventListener('click', function () {
            if ( box.classList.contains('inactive') ) {
                box.classList.remove('inactive')
            } else {
                box.classList.add('inactive')
            }
        })
    });


    /*** sectionTips ***/
    document.querySelectorAll('._pb-info-item').forEach(function (item, index) {
        const tipsText = item.innerHTML;
        const newLink = document.createElement('a');

        newLink.setAttribute('href',`${tipsText}`);
        newLink.setAttribute('target','_blank');
        newLink.textContent = `(${index + 1}) ${tipsText}`
        item.innerHTML = '';
        item.append(newLink);
    }) 
    // 클릭 활성/비활성
    let isPbTipOpen = false;
    const tipBtns = document.querySelectorAll('._pb-tips-btn');
    const tipDivs = document.querySelectorAll('._pb-section-tips');

    function openPbTips(elem) {
        isPbTipOpen = true;
        const btnParent = elem.parentElement;
        btnParent.classList.add('on');
    }

    function closePbTips(elem) {
        isPbTipOpen = false;
        const tipDivs = document.querySelectorAll('._pb-section-tips');
        tipDivs.forEach(item => {
            item.classList.remove('on')
        })
    }

    function handleClickOutside(event) {
        if (isPbTipOpen) {
            closePbTips();
        }
    }
    
    document.addEventListener('click', handleClickOutside);

    tipBtns.forEach(btn => {
        btn.addEventListener('click', function (event) {
            event.stopPropagation();
            isPbTipOpen ? closePbTips(btn) : openPbTips(btn);
        })
    })
    

    /*** common ***/
    function menuInactive (elem) {
        elem.forEach((item) => {
            item.classList.remove('on')
        });
    }

    function getTargetting (elem, className) {
        while ( !elem.classList.contains(className) ) {
            elem = elem.parentNode;

            if ( elem.nodeName == 'BODY' ) {
                elem = null;
                return;
            }
        }
        return elem; 
    }
})();