/* Display: accordion, toggle
========================================================*/
const myDisplayUI = {
    /**
     * @param {string} // [data-js-behavior="accordion"]
     */
    accordion: function (event, elem) {
        const acodnItems = elem.getAttribute('data-accordion-items')
        const acodnHandler = myUI.getTarget(event.target, 'accordion-handler');
        const parentLi = acodnHandler.parentElement.parentElement;
        const tagType = acodnHandler.tagName

        if ( !parentLi.classList.contains(myUI.activeClass) ) {
            if ( acodnItems == 'collapse' ) { myDisplayUI.accordionAllCollps(parentLi) } 
            myDisplayUI.accordionExpand(acodnHandler)
        } else {
            myDisplayUI.accordionCollapse(acodnHandler)
        }

        if ( tagType === 'A') {
            event.preventDefault ? event.preventDefault() : (event.returnValue = false); // a태그 클릭시 브라우저 상단 이동 방지
        }
    },
    accordionExpand: function (handler) {
        const acodnLi = handler.parentElement.parentElement;
        const acodnArrow = handler.querySelector('.ui-arrow')
        
        acodnLi.classList.add(myUI.activeClass);
        myUI.attrExpand(true, handler, acodnArrow)
    },
    accordionCollapse: function (handler) {
        const acodnLi = handler.parentElement.parentElement;
        const acodnArrow = handler.querySelector('.ui-arrow')

        acodnLi.classList.remove(myUI.activeClass);
        myUI.attrExpand(false, handler, acodnArrow)
    },
    accordionAllCollps: function (li) {
        const siblings = myUI.getSiblings(li);
        
        siblings.forEach(item => { 
            const handler = item.querySelector('.accordion-handler')
            const acodnArrow = handler.querySelector('.ui-arrow');

            item.classList.remove(myUI.activeClass);
            myUI.attrExpand(false, handler, acodnArrow)
        });
    },
    /**
     *  @param {string} // [data-js-behavior="toggle"]
     */
    toggleActiveClass : `toggle-${myUI.activeClass}`,
    toggle: function (event, elem) {
        const elemTarget = elem.getAttribute('data-toggle-target');
        const toggleContent = document.querySelector(`#${elemTarget}`);
        const toggleArrow = elem.querySelector('.ui-arrow')
        const tagType = elem.tagName

        if ( !elem.classList.contains(myDisplayUI.toggleActiveClass) ) {
            toggleContent.classList.remove('collapsed');
            elem.classList.add(myDisplayUI.toggleActiveClass);
            myUI.attrExpand(true, elem, toggleArrow)
        } else {
            toggleContent.classList.add('collapsed');
            elem.classList.remove(myDisplayUI.toggleActiveClass);
            myUI.attrExpand(false, elem, toggleArrow)
        }

        if ( tagType === 'A' ) {
            event.preventDefault ? event.preventDefault() : (event.returnValue = false); // a태그 클릭시 브라우저 상단 이동 방지
        }
    },
    /**
     *  @param {string} // [data-js-behavior="trToggle"]
     */
    trToggle: function (event, elem) {
        const tableItems = elem.getAttribute('data-tr-items')
        const trHandler = myUI.getTarget(event.target, 'tr-toggle-handler');
        const trTarget = trHandler.getAttribute('data-tr-target');
        const trContent = document.querySelector(`#${trTarget}`);
        const trArrow = trHandler.querySelector('.ui-arrow')

        if ( !trHandler.classList.contains(myUI.activeClass) ) {
            if ( tableItems == 'collapse' ) { myDisplayUI.trCollapseAll(elem) } 
            trHandler.classList.add(myUI.activeClass);
            trContent.classList.remove('tr-collapsed');
            myUI.attrExpand(true, trHandler, trArrow)
        } else {
            trHandler.classList.remove(myUI.activeClass);
            trContent.classList.add('tr-collapsed');
            myUI.attrExpand(false, trHandler, trArrow)
        }
    },
    trCollapseAll: function (elem) {
        const siblings = elem.querySelectorAll('tr');

        siblings.forEach(item => { 
            const trArrow = item.querySelector('.ui-arrow');
            const trHandler = item.classList.contains('tr-toggle-handler');
            const trActive = item.classList.contains(myUI.activeClass)

            if ( trHandler && trActive ) {
                item.classList.remove(myUI.activeClass);
                myUI.attrExpand(false, item, trArrow)
            } else if ( trHandler && !trActive ) {
                myUI.attrExpand(true, item, trArrow)
            } else if ( item.classList.contains('tr-content') ) {
                item.classList.add('tr-collapsed')
            } 
        });
    },
    /**
     * 
     */
    carousel: function (elem) {
        const container = elem;
        const carousel = container.querySelector('.carousel');
        const carouselSwipe = container.getAttribute('data-carousel-swipe');
        const carouselItems = container.querySelectorAll('.carousel-item');
        const indicatorsGroup = container.querySelector('.carousel-indicators');
        const controlBtns = container.querySelectorAll('.ui-carousel-control');
        let currentIndex = 0;
        const context = { container, carousel, carouselItems, indicatorsGroup, controlBtns, currentIndex }

        const carouselSlide = function (index) {
            const carouselWidth = carouselItems[0].clientWidth;
            const indicatorBtns = indicatorsGroup.querySelectorAll('button');

            carousel.style.transform = `translateX(-${index * carouselWidth}px)`;
            carouselItems[context.currentIndex].classList.remove(myUI.activeClass);
            indicatorBtns[context.currentIndex].classList.remove(myUI.activeClass);

            carouselItems[index].classList.add(myUI.activeClass);
            indicatorBtns[index].classList.add(myUI.activeClass);

            context.currentIndex = index;
        }
        
        indicatorsGroup && myDisplayUI.carouselIndicators(context, carouselSlide) // 인디케이터 생성
        controlBtns && myDisplayUI.carousel_tap(context, carouselSlide); // 버튼 이벤트
        carouselSwipe === 'true' && myDisplayUI.carousel_swipe(context, carouselSlide) // 모바일 터치 swipe
    },
    carouselIndicators: function (context, fn) {
        const { carouselItems, indicatorsGroup } = context;

        /**
         * (_, index) _(언더스코어) 의미
         * 첫 번째 매개변수(현재 요소)를 안 쓴다는 일종의 암묵적, 관례적 표현.
         * 실제로는 아예 빼거나 item. element 등으로 표현해도 무방하다.
         * forEach의 첫 번째 인자인 요소를 무시할 거라면 _를 써서
         * 그걸 명확히 표현하는 게 코드 가독성 면에서 좋다.
         */
        carouselItems.forEach((_, index) => {
            const createBtn = document.createElement('button');
            createBtn.setAttribute('type', 'button')
            createBtn.className = 'carousel-dotted'
            if ( index === 0 ) {
                createBtn.classList.add(myUI.activeClass);
            }
            createBtn.addEventListener('click', () => fn(index));
            indicatorsGroup.appendChild(createBtn);
        })
    },
    carousel_tap: function (context, fn) {
        const { carousel, carouselItems, indicatorsGroup, controlBtns } = context;

        controlBtns.forEach((btn) => {
            const dir = btn.getAttribute('data-carousel-control');

            btn.addEventListener('click', function () {
                let nextIndex;

                if ( dir === 'prev' ) {
                    nextIndex = context.currentIndex - 1;
                    if ( nextIndex < 0 ) nextIndex = carouselItems.length - 1;
                }
                if ( dir === 'next' ) {
                    nextIndex = ( context.currentIndex + 1 ) % carouselItems.length;
                }
                fn(nextIndex);
            })
        })
    },
    carousel_swipe: function (context, fn) {
        const { carousel, carouselItems, indicatorsGroup } = context;
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 50; // 최소 스와이프 거리

        const swipeGesture = function () {
            const distance = touchEndX - touchStartX;
            let nextIndex;

            if (Math.abs(distance) > swipeThreshold) {
                if (distance < 0) {
                    // 왼쪽으로 스와이프 → 다음 슬라이드
                    nextIndex = ( context.currentIndex + 1 ) % carouselItems.length;

                    fn(nextIndex);
                } else {
                    // 오른쪽으로 스와이프 → 이전 슬라이드
                    nextIndex = context.currentIndex - 1;
                    if ( nextIndex < 0 ) nextIndex = carouselItems.length - 1;
                    fn(nextIndex);
                }
            }
        }

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            swipeGesture();
        });
    }
}