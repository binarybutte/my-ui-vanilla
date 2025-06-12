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
     *  @param {string} // [data-js-behavior="carousel"]
     */
    carousel: function (elem) {
        const container = elem;
        const carousel = container.querySelector('.carousel');
        const effect = container?.getAttribute('data-carousel-effect') || 'slide';
        const isRotate = container?.getAttribute('data-carousel-rotate') || 'false';
        const isAuto = container?.getAttribute('data-carousel-auto') || 'false';
        const carouselItems = container.querySelectorAll('.carousel-item');
        const indicatorsGroup = container?.querySelector('.carousel-indicators');
        const pagination = container?.querySelector('.carousel-pagination');
        const controlBtns = container.querySelectorAll('.ui-carousel-control');
        let raw = parseInt(container?.getAttribute('data-carousel-start'), 10) || 1; // 기본 1
        raw = raw < 1 ? 1 : raw; // 최소 1로 보정 (1-based 기준)
        
        const startIndex = Math.max(0, Math.min(raw - 1, carouselItems.length - 1)); // 0-based로 변환 후 범위 보정
        let currentIndex = 0;
        const context = { container, carousel, effect, isRotate, isAuto, carouselItems, indicatorsGroup, pagination, controlBtns, startIndex, currentIndex: startIndex }

        /*
         myDisplayUI.carouselSlide() -> 고차함수.
         (carouselSlide가 외부로 빠지지 않고 내부에 변수로 담긴 버전은 display@20250414.js)
         기존의 내부 함수로 구성되어 변수로 담은 carouselSlide를, context를 인자로 넘기는 고차 함수로 분리
         리턴된 함수는 index만 받아서 동작하게 하면 됨!
         고차함수란? : 함수를 인자로 받거나, 함수를 반환하는 함수. 즉, 함수를 다루는 함수
         ㄴ forEach, map, filter, setTimeout...
         ex1) forEach(callback) : 함수를 인자로 받는다(다른 함수에게 동작을 위임) 
         ex2) function fnname(prefix) { return function(msg) { ... } } : 함수를 리턴(커스터마이징된 새 함수를 만듦)
         함수 안에 무언가를 RETURN 하더라도, RETURN 값이 함수가 아니면 고차함수가 아니다. 
         클로저란? : 함수를 반환하는 고차함수(ex2)에서, 내부함수가 자기만의 설정을 기억하는 것. 
                    즉, 함수가 외부 변수를 기억하고 있는 상태 = '변수를 캡쳐했다' 라고 표현함
        */
        const carouselSlide = myDisplayUI.carouselSlide(context); // myDisplayUI가 없다면 this로 접근

        // ↓↓ carouselSlide의 클로저를 인자로 받아서 실행하는 고차함수들 (실행만 해도 고차함수가 맞다.)
        myDisplayUI.carousel_swipe(context, carouselSlide) // 모바일 터치 swipe
        indicatorsGroup && myDisplayUI.carouselIndicators(context, carouselSlide) // 인디케이터 생성
        controlBtns && myDisplayUI.carousel_tap(context, carouselSlide); // 버튼 이벤트
        isAuto === 'true' && myDisplayUI.carousel_auto(context, carouselSlide);

        carouselSlide(startIndex);
    },
    carouselSlide: function (context) { // 고차 함수 (함수 생성기). context가 캡처됨 
        const resizeHandler = () => {
            const { carousel, carouselItems, effect, pagination, currentIndex } = context;

            if ( effect === 'slide' ) {
                const currentWidth = carouselItems[0].clientWidth;
                carousel.style.transform = `translateX(-${currentIndex * currentWidth}px)`;
            }
        };

        window.addEventListener('resize', resizeHandler); // 최초에 등록

        return function (index) { // 클로저 (context를 기억한 함수). index는 나중에 실제 동작할 때 들어오는 값
            // 이 함수는 context를 기억하고 있음!
            const { carousel, effect, isRotate, carouselItems, indicatorsGroup, controlBtns } = context;
            const indicatorBtns = indicatorsGroup?.querySelectorAll('button');
            const carouselId = carousel.getAttribute('id')

            const runSlide = function () {
                // 슬라이드 이동 처리
                carouselItems[context.currentIndex].classList.remove(myUI.activeClass);
                carouselItems[index].classList.add(myUI.activeClass);

                // carouselItems ID 부여
                carouselItems.forEach((item, index) => {
                    item.setAttribute('id', `${carouselId}-0${index + 1}`)
                })
                
                // 인디케이터 동기화
                if ( indicatorsGroup ) {
                    indicatorBtns[context.currentIndex].classList.remove(myUI.activeClass);
                    indicatorBtns[index].classList.add(myUI.activeClass);

                    indicatorBtns[context.currentIndex].setAttribute('aria-selected', 'false');
                    indicatorBtns[index].setAttribute('aria-selected', 'true');

                    indicatorBtns[context.currentIndex].setAttribute('tabindex', '-1');
                    indicatorBtns[index].setAttribute('tabindex', '0');
                    indicatorBtns[index].focus(); // 키보드 초점 이동
                }

                // 페이지네이션 표시
                if ( context.pagination ) {
                    context.pagination.textContent = `${index + 1} / ${carouselItems.length}`;
                }

                // 슬라이드 위치 이동 (translateX)
                if ( effect === 'slide' ) {
                    const width = carouselItems[0].clientWidth;
                    carousel.style.transform = `translateX(-${index * width}px)`;
                    carousel.classList.add('carousel--slide')
                }

                if ( effect === 'fade' ) {
                    carousel.classList.add('carousel--fade')
                }

                context.currentIndex = index;
            }
           
            runSlide();

            const btnInactive = function (btn) {
                btn.classList.add('btn-disabled');
                btn.setAttribute('aria-disabled', 'true');
                btn.setAttribute('tabindex', '-1');
                btn.disabled = true;
            }
            const btnActive = function (btn) {
                btn.classList.remove('btn-disabled');
                btn.removeAttribute('aria-disabled', 'true');
                btn.setAttribute('tabindex', '0');
                btn.disabled = false;
            }

            // 버튼 비활성화
            if ( context.controlBtns ) {
                context.controlBtns.forEach((btn) => {
                    const dir = btn.getAttribute('data-carousel-control');
                    const isPrev = dir === 'prev';
                    const isNext = dir === 'next';
                    const isFirst = index === 0;
                    const isLast = index === context.carouselItems.length - 1;

                    if ( isRotate === 'false' ) {
                        if ( (isPrev && isFirst) || (isNext && isLast) ) {
                            btnInactive(btn)
                        } else {
                            btnActive(btn)
                        }
                    } else {
                        if ( isPrev && isFirst ) {
                            btnInactive(btn)
                        } else {
                            btnActive(btn)
                        }
                    }
                })
            }
        }
    },
    carouselIndicators: function (context, fn) {
        const { carousel, carouselItems, indicatorsGroup, startIndex } = context;
        const carouselId = carousel.getAttribute('id')

        /*
         carouselItems.forEach((_, index) => { ...
         (_, index) _(언더스코어) 의미
         첫 번째 매개변수(현재 요소)를 안 쓴다는 일종의 암묵적, 관례적 표현.
         실제로는 아예 빼거나 item. element 등으로 표현해도 무방하다.
         forEach의 첫 번째 인자인 요소를 무시할 거라면 _를 써서
         그걸 명확히 표현하는 게 코드 가독성 면에서 좋다.
        */
        carouselItems.forEach((item, index) => {
            const createBtn = document.createElement('button');

            createBtn.setAttribute('type', 'button')
            createBtn.className = 'carousel-dotted';
            createBtn.setAttribute('aria-label', `carousel ${index + 1}`);
            createBtn.setAttribute('aria-controls', `${carouselId}-0${index + 1}`);
            createBtn.setAttribute('tabindex', index === startIndex ? '0' : '-1');
            createBtn.setAttribute('role', 'tab');

            if ( index === startIndex ) {
                createBtn.classList.add(myUI.activeClass);
                createBtn.setAttribute('aria-selected', 'true');
            } else {
                createBtn.setAttribute('aria-selected', 'false');
            }

            createBtn.addEventListener('click', () => fn(index));
            indicatorsGroup.appendChild(createBtn);
        })
    },
    carousel_auto: function (context, fn) {
        if ( !context.isAuto ) return;
        const { container, carouselItems } = context;
        const time = 5000;
        let autoTimer = setInterval(() => {
            let nextIndex = (context.currentIndex + 1) % carouselItems.length;
            fn(nextIndex);
        }, time);

        container.addEventListener('mouseenter', () => clearInterval(autoTimer));
        container.addEventListener('mouseleave', () => {
            autoTimer = setInterval(() => {
                let nextIndex = (context.currentIndex + 1) % carouselItems.length;
                fn(nextIndex);
            }, time);
        });
    },
    carousel_tap: function (context, fn) {
        const { container, carousel, isRotate, carouselItems, indicatorsGroup, controlBtns } = context;
        const rotate = function (dir, nextIndex) {
            if ( dir === 'prev' ) {
                if ( nextIndex === 0 ) return; // 첫 번째면 막음
                nextIndex--;
            }
            /*
             첫번째(prev 버튼 클릭시) -> 마지막으로 이동하게 하려면 (좌우순환시)
             let nextIndex;
             if ( dir === 'prev' ) {
                 nextIndex = context.currentIndex - 1;
                 if ( nextIndex < 0 ) nextIndex = carouselItems.length - 1;
             }
            */
            if ( dir === 'next' ) {
                nextIndex = ( context.currentIndex + 1 ) % carouselItems.length;
            }
            fn(nextIndex);
        }
        const acyclic = function (dir, nextIndex) {
            if ( dir === 'prev' ) {
                if ( nextIndex === 0 ) return; // 첫 번째면 막음
                nextIndex--;
            }
            if ( dir === 'next' ) {
                if ( nextIndex === carouselItems.length - 1 ) return; // 마지막이면 막음
                nextIndex++;
            }
            fn(nextIndex);
        }

        controlBtns.forEach((btn) => {
            btn.addEventListener('click', function () {
                const dir = btn.getAttribute('data-carousel-control');
                let nextIndex = context.currentIndex;

                if ( isRotate === 'false' ) { acyclic(dir, nextIndex); }
                if ( isRotate === 'true' ) { rotate(dir, nextIndex); }
            })
        })
    },
    carousel_swipe: function (context, fn) {
        const { carousel, isRotate, carouselItems, indicatorsGroup } = context;
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 50; // 최소 스와이프 거리
        const rotate = function (distance, nextIndex) {
            if ( distance < 0 ) {
                // 왼쪽으로 스와이프 → 다음 슬라이드
                nextIndex = ( context.currentIndex + 1 ) % carouselItems.length;

                fn(nextIndex);
            } else {
                // 오른쪽으로 스와이프 → 이전 슬라이드
                if ( nextIndex === 0 ) return; // 처음이면 멈춤
                nextIndex--;
                /*
                 첫번째(swipe시) -> 마지막으로 이동하게 하려면
                 nextIndex = context.currentIndex - 1;
                 if ( nextIndex < 0 ) nextIndex = carouselItems.length - 1; 
                */
                fn(nextIndex);
            }
        }
        const acyclic = function (distance, nextIndex) {
            if ( distance < 0 ) {
                // 왼쪽으로 스와이프 → 다음 슬라이드
                if ( nextIndex === carouselItems.length - 1 ) return; // 마지막이면 멈춤
                nextIndex++;
            } else {
                // 오른쪽으로 스와이프 → 이전 슬라이드
                if ( nextIndex === 0 ) return; // 처음이면 멈춤
                nextIndex--;
            }
            fn(nextIndex);
        }
        const swipeGesture = function () {
            const distance = touchEndX - touchStartX;
            let nextIndex = context.currentIndex;

            if ( Math.abs(distance ) > swipeThreshold ) {
                if ( isRotate === 'false' ) { acyclic(distance, nextIndex); }
                if ( isRotate === 'true' ) { rotate(distance, nextIndex); }
            }
        }

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            swipeGesture();
        });
    },
    /**
     * 
     */
    stepperSetting: function (elems, name) {
        for ( let i = 0; i < elems.length; i++ ) {
            elems[i].setAttribute(`data-stepper-${name}`, `${i}`)

            if ( name === 'flow' ) {
                const itemActive = elems[i].classList.contains(myUI.activeClass);
                const btns = elems[i].querySelectorAll('.stepper-handler');
                const firstBtn = elems[i].querySelector('[data-stepper-control="prev"]')
                
                if ( !itemActive ) {
                    btns.forEach((btn) => { btn.disabled = true })
                } else {
                    firstBtn.disabled = true
                }
            }
        }

        const tab = elems[0].closest('.stepper-tab');
        if ( tab ) {
            const tabPanels = tab.querySelectorAll('.tab-panel')
            for ( let j = 0; j < tabPanels.length; j++ ) {
                tabPanels[j].setAttribute(`data-stepper-tab`, `${j}`)
            }
        }
    },
    /**
     * @param {string} elem 
     */
    stepperNav: function (elem) {
        const container = elem;
        const prevHandler = container.querySelector('.stepper-prev-handler');
        const nextHandler = container.querySelector('.stepper-next-handler');
        const stepperItems = container.querySelectorAll('.stepper-item');
        const stepperControls = container.querySelectorAll('[data-stepper-control]');
        const stepperStatus = container.querySelector('.stepper-status');
        const stepperCurrent = stepperStatus?.querySelector('.current');
        const stepperContent = container.querySelector('.stepper-content');
        const stepperTab = container.querySelector('.tab-contents');
        let currentTarget = 0;
        let prevTarget = 0;
        const stepperState = function () {
            const total = stepperItems.length;
            for ( let i = 0; i < stepperControls.length; i++ ) {
                const btn = stepperControls[i];
                const val = stepperControls[i].getAttribute('data-stepper-control');

                if ( val && (val === 'prev' || val === 'start') ) { 
                    btn.disabled = currentTarget === 0; 
                } else if ( val && (val === 'next' || val === 'last') ) { 
                    btn.disabled = currentTarget === total - 1;
                }
            }
        }

        myDisplayUI.stepperSetting(stepperItems, 'nav');

        stepperControls.forEach((btn) => {
            const getValue = btn.dataset.stepperControl;
            // const getValue = btn.getAttribute('data-stepper-control');

            btn.addEventListener('click', function () {
                switch ( getValue ) {
                    case 'start':
                        container.querySelector(`[data-stepper-nav="${currentTarget}"]`).classList.remove(myUI.activeClass);
                        stepperTab && container.querySelector(`[data-stepper-tab="${currentTarget}"]`).classList.remove(myUI.activeClass);
                        currentTarget = 0;
                        prevTarget = 0;
                        container.querySelector(`[data-stepper-nav="0"]`).classList.add(myUI.activeClass);
                        stepperTab && container.querySelector(`[data-stepper-tab="0"]`).classList.add(myUI.activeClass);
                        stepperState()
                        break;

                    case 'prev':
                        if ( currentTarget > 0 ) {
                            container.querySelector(`[data-stepper-nav="${currentTarget}"]`).classList.remove(myUI.activeClass);
                            stepperTab && container.querySelector(`[data-stepper-tab="${currentTarget}"]`).classList.remove(myUI.activeClass);
                            currentTarget--;
                            container.querySelector(`[data-stepper-nav="${currentTarget}"]`).classList.add(myUI.activeClass);
                            stepperTab && container.querySelector(`[data-stepper-tab="${currentTarget}"]`).classList.add(myUI.activeClass);
                            prevTarget = Math.max(0, currentTarget - 1);
                        }
                        stepperState();
                        break;

                    case 'next':
                        if ( currentTarget < stepperItems.length - 1 ) {
                            container.querySelector(`[data-stepper-nav="${currentTarget}"]`).classList.remove(myUI.activeClass);
                            stepperTab && container.querySelector(`[data-stepper-tab="${currentTarget}"]`).classList.remove(myUI.activeClass);
                            currentTarget++;
                            container.querySelector(`[data-stepper-nav="${currentTarget}"]`).classList.add(myUI.activeClass);
                            stepperTab && container.querySelector(`[data-stepper-tab="${currentTarget}"]`).classList.add(myUI.activeClass);
                        }
                        stepperState()
                        break;

                    case 'last':
                        container.querySelector(`[data-stepper-nav="${currentTarget}"]`).classList.remove(myUI.activeClass);
                        stepperTab && container.querySelector(`[data-stepper-tab="${currentTarget}"]`).classList.remove(myUI.activeClass);
                        currentTarget = stepperItems.length - 1;
                        prevTarget = currentTarget - 1;
                        container.querySelector(`[data-stepper-nav="${currentTarget}"]`).classList.add(myUI.activeClass);
                        stepperTab && container.querySelector(`[data-stepper-tab="${currentTarget}"]`).classList.add(myUI.activeClass);
                        stepperState()
                        break;
                }

                stepperContent && myDisplayUI.stepperScroll(container, currentTarget);
                
                if ( stepperStatus ) {
                    stepperCurrent.innerText = `${currentTarget + 1}`;
                }
            })
        })


    },
    /**
     * @param {string} elem 
     */
    stepperFlow: function (event, elem) {
        const container = elem;
        const stepperItems = container.querySelectorAll('.stepper-item');
        const stepperHandler = myUI.getTarget(event.target, 'stepper-handler');
        const stepperAttr = stepperHandler?.dataset.stepperControl;
        const stepperStatus = container.querySelector('.stepper-status .current');
        
        if ( !stepperHandler ) return; // 클릭한게 버튼이 아니면 탈출

        container.querySelector(`[data-stepper-flow="${currentTarget}"]`).classList.remove(myUI.activeClass);

        switch ( stepperAttr ) {
            case 'prev':
                if ( currentTarget > 0 ) currentTarget--;
                break;

            case 'next':
                if ( currentTarget < stepperItems.length - 1 ) currentTarget++;
                break;
        }

        container.querySelector(`[data-stepper-flow="${currentTarget}"]`).classList.add(myUI.activeClass);

        // 버튼 상태 업데이트
        stepperItems.forEach((item, idx) => {
            const btns = item.querySelectorAll('.stepper-handler');
            btns.forEach(btn => {
                if ( idx === currentTarget ) {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }
            });
        });

        // prev, next 버튼 따로 관리
        const activeItem = container.querySelector(`[data-stepper-flow="${currentTarget}"]`);
        const prevBtn = activeItem.querySelector('[data-stepper-control="prev"]');
        const nextBtn = activeItem.querySelector('[data-stepper-control="next"]');

        if ( prevBtn ) prevBtn.disabled = currentTarget === 0; // 맨 앞이면 prev 비활성화
        if ( nextBtn ) nextBtn.disabled = currentTarget === stepperItems.length - 1; // 맨 뒤면 next 비활성화

        // 상태 업데이트
        if ( stepperStatus ) {
            stepperStatus.textContent = currentTarget + 1;
        }
    },
    stepperScroll: function (container, target) {
        const scrollalble = container.querySelector('.stepper-content')
        const targetItem = container.querySelector(`[data-stepper-nav="${target}"]`)
        const targetPos = targetItem.offsetTop;

        scrollalble.scrollTo( {
            top: targetPos,
            behavior: 'smooth',
        })
    },
}