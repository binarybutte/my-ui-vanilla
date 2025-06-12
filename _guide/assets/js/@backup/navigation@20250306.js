/* Navigation
========================================================*/
const myNavUI = {
    /**
     * @param {string} elem [data-js-behavior="tab"]
     */
    tab : function (elem) {
        const container = elem.isConnected ? elem : document.querySelector(elem); // isConnected: node가 dom에 있는지 여부 확인
        const tabNav = container.querySelector('.tab-nav');
        const tabContents = container.querySelector('.tab-contents'); // tabNav.nextElementSibling;

        tabNav.addEventListener('click', e => { 
            const tabBtn = myUI.getTarget(e.target, 'tab-handler');

            if ( tabBtn ) {
                myNavUI.tabInactive(tabBtn, tabContents);
                myNavUI.tabActive(tabBtn, tabContents);
            }
        })
    },
    tabActive: function (btn, content) {
        const tabTarget = btn.getAttribute('data-tab-target');
        const tabLi = btn.parentElement;

        tabLi.classList.add(myUI.activeClass);
        btn.setAttribute('aria-selected', true);

        if ( content != undefined ) { 
            const tabPanel = document.querySelector(`#${tabTarget}`);
            tabPanel.classList.add(myUI.activeClass);
        } 
    },
    tabInactive: function (btn, content) {
        const tabLi = btn.parentElement;
        const lists = [...tabLi.parentNode.children];

        for ( let i = 0; i < lists.length ; i++ ) {
            const btns = lists[i].querySelector('.tab-handler')

            lists[i].classList.remove(myUI.activeClass);
            btns.setAttribute('aria-selected', false);

            if ( content != undefined ) {
                const getTaret = btns.getAttribute('data-tab-target');
                const panel = document.querySelector(`#${getTaret}`);
                panel.classList.remove(myUI.activeClass);     
            }
        }
    },
    /**
     * @param {string} elem [data-js-behavior="scrollTab"]
     */
    scrollTab: function (elem) {
        const container = elem.isConnected ? elem : document.querySelector(elem); // isConnected: node가 dom에 있는지 여부 확인
        const tabNav = container.querySelector('.tab-nav');
        const tabContents = container.querySelector('.tab-contents');
        const tabScrollType = tabContents.getAttribute('data-tab-scroll')
        let scrollArea;

        if ( tabScrollType == 'element' ) { 
            scrollArea = tabContents.parentElement;
        } else {
            scrollArea = window;
        }

        myNavUI.setStaticOffset(tabNav);

        tabNav.addEventListener('click', e => { 
            const tabBtn = myUI.getTarget(e.target, 'tab-handler');

            if ( tabBtn ) {
                myNavUI.scrollToContent(tabBtn, scrollArea);
            }
        })
     
        scrollArea.addEventListener('scroll', e => { 
            myUI.debounce(myNavUI.focusingMenu(container, scrollArea), 100)
        });
    },
    scrollToContent: function (btn, scrollArea) {
        const tabTarget = btn.getAttribute('data-tab-target');
        const tabPanel = document.querySelector(`#${tabTarget}`);
        const tabPanelPos = tabPanel.offsetTop;

        btn.setAttribute('aria-selected', true);
        scrollArea.scrollTo({ top: tabPanelPos, behavior: 'smooth' }) 
        // behavior: instant, smooth, auto.. auto 설정시 스크롤 이동 애니메이션 없음
    },
    focusingMenu: function (container, scrollArea) {
        const tabList = container.querySelector('.tab-list');
        const tabLi = tabList.querySelectorAll('li');
        const tabContents = container.querySelector('.tab-contents');
        const tabPanels = tabContents.querySelectorAll('.tab-scrollpanel');
        const scrollboxHeight = tabContents.parentElement.getBoundingClientRect().height;
        let contentsHeight;
        let scrollPos;
        let calcHeight;

        if ( scrollArea === window ) {
            contentsHeight = container.getBoundingClientRect().height;
            scrollPos = Math.round(window.scrollY); // window.pageYOffset window.scrollY
            calcHeight = contentsHeight - window.innerHeight; 
        } else {
            contentsHeight = tabContents.getBoundingClientRect().height;
            scrollPos = Math.round(scrollArea.scrollTop);
            calcHeight = contentsHeight - scrollboxHeight; 
        }

        tabPanels.forEach((item, index) => {
            const idx = index; // [...item.parentNode.children].indexOf(item)
            const lastIdx = tabPanels.length - 1;
            let activeList;
            let focused;

            if ( scrollPos > item.offsetTop - 40 ) {
                activeList = tabLi[idx];
                focused = activeList.querySelector('.tab-handler');
                myNavUI.tabInactive(focused)
                myNavUI.tabActive(focused)
                myNavUI.moveScroll(activeList, tabList)
            } 
            else if ( scrollPos >= calcHeight ) {
                activeList = tabLi[lastIdx];
                focused = activeList.querySelector('.tab-handler');
                myNavUI.tabInactive(focused)
                myNavUI.tabActive(focused)
                myNavUI.moveScroll(activeList, tabList)
            }
        })
    },
    setStaticOffset: function (nav) {
        // const screen = window.innerWidth;
        const tabNav = nav;
        const screen = tabNav.querySelector('.tab-list').getBoundingClientRect().width;
        const tabList = tabNav.querySelectorAll('li')

        tabList.forEach(item => {
            const listWidth = item.getBoundingClientRect().width;
            const listLeftPos = item.offsetLeft;
            const listRightPos = Math.floor(listLeftPos + listWidth);
            const listPos = listRightPos / screen;
            const screenOverNum = listPos.toFixed(1)
            
            item.setAttribute('data-tab-screen', screenOverNum)
        });
    },
    moveScroll: function (li, ul) {
        // const screen = window.innerWidth;
        const screen = ul.getBoundingClientRect().width;
        const liWidth = li.getBoundingClientRect().width + 10;
        const getValue = li.getAttribute('data-tab-screen')

        if ( getValue < 1 ) {
            ul.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            ul.scrollTo({ left: (screen * getValue) - liWidth, behavior: 'smooth' });
        }
    },
    /**
     * @param {string} elem [data-js-behavior="dropdown"]
     */
    dropdownActiveClass : `dropdown-${myUI.activeClass}`,
    dropdown: function (event, elem) {
        const element = elem;
        const elemParent = element.parentElement;
        const elemDirection = element.getAttribute('data-dropdown-direction');
        const tagType = elem.tagName;

        // dropdownGroup
        const dropdownGroup = element.parentElement.parentElement;
        const getAttrGroup = dropdownGroup.getAttribute('data-js-behavior');
        const groupItems = dropdownGroup.querySelectorAll('.dropdown')

        if ( getAttrGroup === 'dropdown-group' ) {
            groupItems.forEach(item => { 
                const element = item.querySelector('[data-js-behavior="dropdown"]');
                const elemDirection = elem.getAttribute('data-dropdown-direction');
                const elemParent = item;

                myNavUI.dropdownClose (element, elemParent, elemDirection) 
            });
        }

        if ( elemParent.classList.contains(myNavUI.dropdownActiveClass) ) {
            myNavUI.dropdownClose (element, elemParent, elemDirection)
        } else {
            myNavUI.dropdownOpen (element, elemParent, elemDirection)
        }
       
        if ( tagType === 'A' ) {
            event.preventDefault ? event.preventDefault() : (event.returnValue = false); // a태그 클릭시 브라우저 상단 이동 방지
        }

        document.addEventListener('click', myNavUI.dropdownOutside)
    },
    dropdownOpen: function (elem, parent, direction) {
        const dropdownMenu = elem.nextElementSibling;
        const dropdownArrow = elem.querySelector('.ui-arrow')
       
        if ( parent.classList.contains(myNavUI.dropdownActiveClass) ) return;

        parent.classList.add(myNavUI.dropdownActiveClass);
        dropdownMenu.classList.add(`dropdown-${direction}`);
        myUI.attrExpand(true, elem, dropdownArrow)
    },
    dropdownClose: function (elem, parent, direction) {
        const dropdownMenu = elem.nextElementSibling;
        const dropdownArrow = elem.querySelector('.ui-arrow')

        parent.classList.remove(myNavUI.dropdownActiveClass);
        dropdownMenu.classList.remove(`dropdown-${direction}`);
        myUI.attrExpand(false, elem, dropdownArrow)
    },
    dropdownOutside: function (event) {
        const active = document.querySelectorAll(`.${myNavUI.dropdownActiveClass}`);

        // if ( !myUI.getTarget(event.target, 'dropdown') && !myUI.getTarget(event.target, myNavUI.dropdownActiveClass) ) { 
        if ( !myUI.getTarget(event.target, 'dropdown') ) { 
            active.forEach(item => { 
                const elem = item.querySelector('[data-js-behavior="dropdown"]');
                const elemDirection = elem.getAttribute('data-dropdown-direction');
                const elemParent = item;

                myNavUI.dropdownClose (elem, elemParent, elemDirection) 
            });
        }
    },
}

/**
 * 팝업 툴팁 인풋필드 라디오컨트롤 토스트팝업 슬릭슬라이더 터치차단 아코디언 스크롤방지 
 */
