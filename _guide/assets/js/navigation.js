/* Navigation: tab, dropdown
========================================================*/
const myNavUI = {
    /**
     * @param {string} elem [data-js-behavior="tab"]
     */
    tab : function (event, elem) {
        const tabContents = elem.querySelector('.tab-contents'); // tabNav.nextElementSibling;
        const tabHandler = myUI.getTarget(event.target, 'tab-handler');

        if ( tabHandler ) {
            myNavUI.tabInactive(tabHandler, tabContents);
            myNavUI.tabActive(tabHandler, tabContents);
        }
    },
    tabActive: function (btn, content) {
        const tabTarget = btn.getAttribute('data-tab-target');
        const tabLi = btn.parentElement;

        tabLi.classList.add(myUI.activeClass);
        btn.setAttribute('aria-selected', true);

        if ( content !== undefined ) { 
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

            if ( content !== undefined ) {
                const getTarget = btns.getAttribute('data-tab-target');
                const panel = document.querySelector(`#${getTarget}`);
                panel.classList.remove(myUI.activeClass);     
            }
        }
    },
    /**
     * @param {string} elem [data-js-behavior="scrollTab"]
     */
    scrollTab: function (elem) {
        // const container = elem.isConnected ? elem : document.querySelector(elem); // isConnected: node가 dom에 있는지 여부 확인
        // elem이 문자열인 경우 isConnected 속성이 없을 수 있으므로, 타입 확인을 추가
        const container = typeof elem === 'object' && elem.isConnected ? elem : document.querySelector(elem);
        const tabNav = container.querySelector('.tab-nav');
        const tabContents = container.querySelector('.tab-contents');
        const tabScrollType = tabContents.getAttribute('data-tab-scroll')
        let scrollArea;

        if ( tabScrollType == 'element' ) { 
            scrollArea = tabContents.parentElement;
        } else {
            scrollArea = window;
        }
        const debouncedFocusing = myUI.debounce(function() { myNavUI.focusingMenu(container, scrollArea); }, 100);
        myNavUI.setStaticOffset(tabNav);

        tabNav.addEventListener('click', e => { 
            const tabBtn = myUI.getTarget(e.target, 'tab-handler');

            if ( tabBtn ) {
                myNavUI.scrollToContent(tabBtn, scrollArea);
            }
        })

     
        scrollArea.addEventListener('scroll', debouncedFocusing);
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
        const elemDirection = element.getAttribute('data-dropdown-direction') ?? undefined;
        const tagType = elem.tagName;

        if ( elemParent.classList.contains(myNavUI.dropdownActiveClass) ) {
            myNavUI.dropdownClose (element, elemParent, elemDirection)
        } else {
            if ( element.closest('[data-js-behavior="dropdownGroup"]') ) {
                const groupItems = dropdownGroup.querySelectorAll('.dropdown')

                groupItems.forEach(item => { 
                    const element = item.querySelector('[data-js-behavior="dropdown"]');
                    const elemDirection = elem.getAttribute('data-dropdown-direction') 
                    const elemParent = item;

                    myNavUI.dropdownClose(element, elemParent, elemDirection) 
                });
            }
            myNavUI.dropdownOpen(element, elemParent, elemDirection)
        }
       
        if ( tagType === 'A' ) {
            event.preventDefault ? event.preventDefault() : (event.returnValue = false); // a태그 클릭시 브라우저 상단 이동 방지
        }

        // setTimeout을 사용해 이벤트 버블링 방지
        setTimeout(() => {
            document.addEventListener('click', myNavUI.dropdownOutside, { once: true });
        }, 0);
    },
    dropdownOpen: function (elem, parent, direction) {
        const dropdownMenu = elem.nextElementSibling;
        const dropdownArrow = elem.querySelector('.ui-arrow')
       
        if ( parent.classList.contains(myNavUI.dropdownActiveClass) ) return;

        parent.classList.add(myNavUI.dropdownActiveClass);
        direction !== undefined ? dropdownMenu.classList.add(`dropdown-${direction}`) : 'null'

        // if ( dropdownArrow ) { myUI.attrExpand(true, elem, dropdownArrow) }
        dropdownArrow ? myUI.attrExpand(true, elem, dropdownArrow) : null;
    },
    dropdownClose: function (elem, parent, direction) {
        const dropdownMenu = elem.nextElementSibling;
        const dropdownArrow = elem.querySelector('.ui-arrow')

        parent.classList.remove(myNavUI.dropdownActiveClass);
        direction !== undefined && dropdownMenu.classList.remove(`dropdown-${direction}`);
        
        // if ( dropdownArrow ) { myUI.attrExpand(false, elem, dropdownArrow) }
        dropdownArrow && myUI.attrExpand(false, elem, dropdownArrow);

        document.removeEventListener('click', myNavUI.dropdownOutside);
    },
    dropdownOutside: function (event) {
        const active = document.querySelectorAll(`.${myNavUI.dropdownActiveClass}`);

        if ( !myUI.getTarget(event.target, 'dropdown') && !myUI.getTarget(event.target, myNavUI.dropdownActiveClass) ) { 
            active.forEach(item => { 
                const elem = item.querySelector('[data-js-behavior="dropdown"]');
                const elemDirection = elem.getAttribute('data-dropdown-direction');
                const elemParent = item;

                myNavUI.dropdownClose (elem, elemParent, elemDirection) 
            });
        }
    },
    scrollTableInit: function (elem) {
        const tableContainer = elem.isConnected ? elem : document.querySelector(`[data-scroll-table="${elem}"]`); // isConnected: node가 dom에 있는지 여부 확인
        /*
         clientWidth: padding 포함, border/scrollbar 제외, 레이아웃 변할 때 자동 반영,
                      스크롤 계산이나 내부 컨테이너 넓이(눈에 보이는 너비)를 구할 때 적용 
         scrollWidth: 스크롤이 필요할 정도로 넘치는 콘텐츠(자식요소) 포함 전체 너비를 구할 때 적용. 
                      자식 요소가 여러 개일 때도 다 포함. (scrollHeight도 있다.)
         getBoundingClientRect(): border, padding, scrollbar 포함 (렌더된 실제 크기),
                                  브라우저 렌더링 기준의 화면 상 위치/크기, 시각적으로 보여지는 실제 넓이 계산시 적용
        */
        const containerWidth = tableContainer.clientWidth;
        const containerScrollWidth = tableContainer.scrollWidth;
        const prevElement = tableContainer.previousElementSibling;
        const nextElement = tableContainer.nextElementSibling;
        let scrollHandlers;

        if ( prevElement && prevElement.classList.contains('table-scroll-handlers') ) {
            scrollHandlers = prevElement;
        } else if ( nextElement && nextElement.classList.contains('table-scroll-handlers') ) {
            scrollHandlers = nextElement;
        }

        /* btnHandlers
         - 일반조건문:
         let btnHandlers = null;
         if (scrollHandlers) { btnHandlers = scrollHandlers.querySelector('button') || scrollHandlers.querySelector('a'); }
         - 축약:
         const btnHandlers = scrollHandlers?.querySelectorAll('button') || scrollHandlers?.querySelectorAll('a') || null;
         항상 NodeList 객체를 반환하기 때문에 || 연산자가 의미가 없다. querySelectorAll()은 일치하는 요소가 없어도
         빈 NodeList를 반환하기 때문에, 둘 중 아무 것도 없을 때도 btnHandlers는 무조건 truthy한 상태가 됨.
         => .querySelector()로 먼저 확인한 다음 querySelectorAll()을 실행하거나, 둘 다 수집하고 forEach()로 묶는 식으로 처리
        */
        let btnHandlers = null;

        if ( scrollHandlers ) {
            const buttons = scrollHandlers.querySelectorAll('button');
            const anchors = scrollHandlers.querySelectorAll('a');
            btnHandlers = [...buttons, ...anchors]; // NodeList → 배열로 병합
        }

        const leftHandler = scrollHandlers.querySelector('.left-handler');
        const rightHandler = scrollHandlers.querySelector('.right-handler');
        const scrollInfo = { tableContainer, containerWidth, containerScrollWidth, leftHandler, rightHandler }

        tableContainer.scrollLeft === 0 && leftHandler.classList.add('opacity-0')
        
        /*
         debounce 함수에 '함수'가 아닌 '함수의 실행 결과'를 넣으면 Uncaught TypeError 발생할 수 있다.
         익명 함수로 감싸서 인자도 포함시켜야 한다.
        */
        tableContainer.addEventListener('scroll', myUI.debounce(() => {
            myNavUI.scrollTable(tableContainer, scrollInfo)
        }, 100));
        
        // 빈 상태를 고려하여 btnHandlers && 추가
        btnHandlers && btnHandlers.forEach((item) => {
            item.addEventListener('click', function () {
                myNavUI.scrollTableBtn(item, btnHandlers, scrollInfo)
            })
        })
    },
    scrollTable: function (elem, scrollInfo) {
        const { tableContainer, containerWidth, containerScrollWidth, leftHandler, rightHandler } = scrollInfo;

        if ( tableContainer.scrollLeft === 0 ) {
            leftHandler.classList.add('opacity-0')
            rightHandler.classList.remove('opacity-0')
        } else if ( Math.ceil(tableContainer.scrollLeft + containerWidth) >= containerScrollWidth ) {
            leftHandler.classList.remove('opacity-0')
            rightHandler.classList.add('opacity-0')
        } else {
            rightHandler.classList.remove('opacity-0')
            leftHandler.classList.remove('opacity-0')
        }
    },
    scrollTableBtn: function (item, btns, scrollInfo) {
        const { tableContainer, containerWidth, containerScrollWidth } = scrollInfo;
        const direction = item.getAttribute('data-scroll-move');
        const scrollStep = 100;
        const maxScroll = containerScrollWidth - containerWidth; // "scrollWidth - clientWidth = 스크롤 계산시의 핵심 공식" 

        switch ( direction ) {
            case 'start': 
                /* css scroll-behavior: smooth; 속성을 적용할 수 없다면, scrollTo()를 사용한다. */
                // tableContainer.scrollTo({ left: 0, behavior: 'smooth' });
                tableContainer.scrollLeft = 0;
                break;
            case 'left':
                // tableContainer.scrollTo({ left: tableContainer.scrollLeft - scrollStep, behavior: 'smooth' });
                tableContainer.scrollLeft -= scrollStep; // scrollLeft = scrollLeft - scrollStep
                break;
            case 'right':
                // tableContainer.scrollTo({ left: tableContainer.scrollLeft + scrollStep, behavior: 'smooth' });
                tableContainer.scrollLeft += scrollStep; // scrollLeft = scrollLeft + scrollStep
                break;
            case 'end':
                // tableContainer.scrollTo({ left: maxScroll, behavior: 'smooth' });
                tableContainer.scrollLeft = maxScroll;
                break;
        }
    }
}

/**
 * 팝업 툴팁 인풋필드 라디오컨트롤 토스트팝업 슬릭슬라이더 터치차단 아코디언 스크롤방지 
 */
