const myUI = {
    activeClass : 'ui-active', // 이벤트 위임 처리된 엘리먼트의 `자식 요소`에서만 쓴다. 그 외에는 별도의 활성 클래스 생성
    getTarget: function (elem, className) {
        while ( elem && elem.nodeName !== 'BODY' ) {
            if ( elem.classList.contains(className) ) {
                return elem;
            }
            elem = elem.parentNode;
        }
        return null; // 명확하게 null 반환
    },
    getSiblings: function (elem) {
        const children = elem.parentElement.children;
        const tempArr = [];

        for ( let i = 0; i < children.length; i++ ) { tempArr.push(children[i]); }
        return tempArr.filter(function(e) { return e != elem; });

        /* es6
         1. [...elem.parentNode.children].filter((child) => child !== elem);
         2. var siblings = n => [...n.parentElement.children].filter(c=>c!=n)
                var c = document.querySelector('.c')
                var brothers_n_sisters = siblings(c)
        */
    },
    /** [ debounce ]
     * 함수 그 자체를 넘겨야 한다. return이 없을 경우, 익명 함수로 감싸서 호출한다.
     */
    debounce: function (fn, delay) {
        let timer = null;
        
        return function() {
            let context = this;
            let args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(context, args);
            }, delay);
        }
    },
    getIndex: function (elem) {
        let index = 0;
        while (elem = elem.previousElementSibling) {
            index++;
        }
        return index;
    },
    getSafeNumber: function (val, fallback = 0) {
        if (val === null || val === undefined) return fallback;
        const num = parseFloat(val);
        return isNaN(num) ? fallback : num;
    },
    getSafePercent: function (num, max) {
        /*
         -parseFloat()
         문자열을 부동소수점 숫자(float)로 변환해주는 함수.
         좌측부터 숫자로 읽을 수 있을 때까지만 파싱 (ex: "12abc" → 12, "abc12" → NaN 숫자가 앞에 없으면 NaN)
         공백은 무시, 소수점도 허용, 과학 표기법도 가능 (ex: "1e3" → 1000)
         적절한 사용: HTML 속성 값이 숫자 문자열일 때. 사용자 입력값 파싱
         
         parseInt()는 정수로 변환(소수점아래는버림)
         ㄴ 사용자 나이, 페이지 번호 등 정수만 필요한 경우
         parseFloat()는 실수 변환이다. (소수점 유지)
         ㄴ 퍼센트, 배율, 정확한 비율 계산 필요한 상황에서 쓰임.
        */
       const rawPercent = parseFloat(num);
       const rawMax = parseFloat(max);
       let finalPercent = Math.min(rawPercent, rawMax); // percent가 max를 넘는 것 방지

       if ( rawMax > 0 ) {
           finalPercent = (finalPercent / rawMax) * 100; // 실제 퍼센트 계산 (0~100 기준으로)
       }

       finalPercent = Math.min(finalPercent, 100); // 브라우저 width 100% 초과 방지

       return finalPercent;
   },
    getElementSize: function (content) {
        const createdDiv = content;
        const createdDivWidth = createdDiv.offsetWidth; 
        const createdDivHeight = createdDiv.offsetHeight; 
        const createdDivArr = [ createdDivWidth, createdDivHeight ]

        return createdDivArr;
    },
    getTargetPos: function (target) {
        const clickedTarget = target;    
        const rect = clickedTarget.getBoundingClientRect();
        const targetWidth = rect.width;
        const targetHeight = rect.height; 
        /* 
         getBoundingClientRect가 반환하는 좌표는 뷰포트 기준으로 계산됨
         따라서, 브라우저 너비, 스크롤 위치가 변경되면 좌표값도 달라진다.
         window.scrollX, window.scrollY 값을 더하여
         절대 좌표를 계산하는 방식으로 해결함.
        */
        const targetLeft = rect.left + window.scrollX;
        const targetRight = rect.right + window.scrollX; // targetLeft + targetWidth;
        const targetTop = rect.top + window.scrollY;
        const targetBottom = rect.bottom + window.scrollY; // targetTop + targetHeight;
        const targetPosArr = [ targetLeft, targetRight, targetTop, targetBottom, targetWidth, targetHeight ]
        
        return targetPosArr;
    },
    initPlacement: function (target, direction) {
        const positionArr = myUI.getTargetPos(target);
        const left = positionArr[0].toFixed(0);
        const right = positionArr[1].toFixed(0);
        const top = positionArr[2].toFixed(0);
        const bottom = positionArr[3].toFixed(0);
        const width = positionArr[4].toFixed(0);
        const height = positionArr[5].toFixed(0);
        let setArray;

        switch (direction) {
            case 'left': 
                setArray = [ left, top, width, height ]
                return setArray;
            case 'right':
                setArray = [ right, top, width, height ]
                return setArray;
            case 'top':
                setArray = [ left, top, width, height ]
                return setArray;
            case 'bottom':
                setArray = [ left, bottom, width, height ]
                return setArray;
            default: 
                setArray = [ right, top, width, height ]
                return setArray;
        }
    },
    attrExpand: function (flag, handler, label) {
        const clickHandler = handler;
        const arrowLabel = label;

        clickHandler.setAttribute('aria-expanded', flag);
        if ( flag ) {
            arrowLabel.setAttribute('aria-label', '닫기')
        } else {
            arrowLabel.setAttribute('aria-label', '열기')
        }
    },
    /**
     * 일반 파라미터 방식과 달리, 객체기반 방식으로 '구조분해Destructuring' 방식이라고 부른다.
     * 아래는 객체를 직접 구조 분해하면서 기본값까지 미리 지정하는 패턴. 순서에 상관없이 쓸 수 있다.
     * 작업 시 선호되는 방식이라고 함..
     * @param {Object}    options - 설정 객체
     * @param {string}    options.selector - 감시할 대상 셀렉터
     * @param {number}   [options.threshold = 0] - 감지 비율 (0~1)
     * @param {number}   [options.delay = 0] - 각 요소 간 순차 딜레이 (ms)
     * @param {function}  options.onIntersect - 요소가 보일 때 실행할 콜백
     * @param {function} [options.onExit] - 요소가 사라질 때 실행할 콜백 (선택)
     * @param {boolean}  [options.resetOnLeave = false] - 요소가 나가면 초기화할지 여부.
     * @param {boolean}  [options.once = true] - 한 번만 실행할지 여부
     * 
     * 파라미터가 많아져 선언부가 길어지면 option 객체를 그대로 받고 내부에서 구조분해를 해도 된다.
     * ex) observeElements: function (options) { const { selector, ...} = options }
     */
    observeElements: function ({ 
        selector,
        threshold = 0,
        delay = 0,
        onIntersect,
        once = true,
        onExit
    }) 
    {
        if ( !selector || typeof onIntersect !== 'function' ) return;
        const elements = document.querySelectorAll(selector);
        if ( elements.length === 0 ) return;

        /*
         IntersectionObserver
         브라우저에서 특정 요소가 뷰포트(viewport) 또는 부모 요소 안에서 보여지는지 관찰할 수 있는 API
         동적으로 관찰 대상 관리할 때 사용
         "화면에 보이면 실행" 이라는 조건부 트리거가 필요할 때 쓰는 방식
         프로그레스바가 스크롤을 내려서 등장할 때만 애니메이션 하고 싶을때 사용.
         progressbar()와 동시에 사용하면 안된다. 둘 중 하나만 선택해야 함.
         entries: 관찰 중인 요소들의 상태 정보 리스트 (IntersectionObserverEntry[])
         observer: 이 콜백을 실행한 IntersectionObserver 인스턴스 그 자체
        */
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                const target = entry.target;
                // 요소가 화면에 들어올 때
                if ( entry.isIntersecting ) {
                    // 순차 지연 실행 delay ms 간격
                    setTimeout(() => { 
                        onIntersect(target); // 함수실행
                    }, index * delay); // elay ms 간격

                    if ( once ) {
                        observer.unobserve(target); // 한 번만 실행
                    }
                } else if ( typeof onExit === 'function' ) {
                    onExit(target);
                }
                
                /*
                 - resetOnLeave 옵션 사용하기
                 함수 실행시 옵션설정은 once: false, resetOnLeave: true
                 resetOnLeave는 onExit을 직접 쓰지 않고도 미리 정의된 리셋 동작을 쉽게 켤 수 있는 옵션.
                 리셋 작업(style.width = '0')을 자동으로 처리하고 싶을 때 사용한다.
                 그러나 observeElements 은 유틸함수이므로, onExit 우선 사용하도록 한다.
                */
                // else {
                //     if (typeof onExit === 'function') {
                //         onExit(entry.target);
                //     } else if (resetOnLeave) {
                //          entry.target.style.width = '0';
                //     }
                // }
            });
        }, { threshold }); // 요소가 ~% 이상 보여야 실행
    
        // 모든 지정 엘리먼트 관찰
        elements.forEach(elem => observer.observe(elem));
    },
    /**
     * observeElements() 경량화 버전.
     * 여러 엘리먼트가 아니라 한개의 엘리먼트만 감시하는 용도 (forEach 루프없이 간단하게게)
     */
    observeSingle: function ( elem, onIntersect, { threshold = 0, once = true } = {} ) {
        if (!elem || typeof onIntersect !== 'function') return;

        const observer = new IntersectionObserver((entries, observer) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                onIntersect(entry.target);
                if ( once ) observer.unobserve(entry.target);
            }
        }, { threshold });

        observer.observe(elem);
    }
}