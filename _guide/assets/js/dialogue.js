/* Dialogue: popover, tooltip
========================================================*/
const myDialgUI = {
    /**
     * @param {*}  
     */
    popoverActiveClass : `popover-${myUI.activeClass}`,
    popover: function (elem) {   
        if ( elem.classList.contains(myDialgUI.popoverActiveClass) ) {
            myDialgUI.popoverClose (elem)
        } else {
            myDialgUI.popoverOpen (elem)
        }
        
        // setTimeout을 사용해 이벤트 버블링 방지
        setTimeout(() => {
            document.addEventListener('click', myDialgUI.popoverOutside, { once: true });
        }, 0);
    },
    popoverOpen: function (elem) {
        const wrap = document.querySelector('body > div');
        const elemTarget = elem.getAttribute('data-popover-target');
        const elemDirection = elem.getAttribute('data-popover-direction');
        const createPopover = document.createElement('div');
        const foundKey = popoverContents.find((item) => item.id === elemTarget);
        let popoverHtml;
        
        if ( elem.classList.contains(myDialgUI.popoverActiveClass) ) return;

        createPopover.className = `popover popover-${elemDirection}`; 
        createPopover.setAttribute('data-popover-id', elemTarget)
        wrap.insertAdjacentElement('beforeend', createPopover); // beforebegin, afterbegin, beforeend, afterend
        elem.classList.add(myDialgUI.popoverActiveClass);

        if ( foundKey.title === undefined ) {
            popoverHtml = `<div class="popover-content"><ul>${foundKey.content}</ul></div>`
        } else {
            popoverHtml = `<div class="popover-content"><dl><dt class="popover-title">${foundKey.title}</dt>${foundKey.content}</dl></div>`
        }

        createPopover.innerHTML = popoverHtml;

        const createdDiv = createPopover.querySelector('.popover-content');
        const closeBtnHtml = `<button type="button" class="btn-icon btn-icon-24 ui-popover-close" onclick="myDialgUI.popoverClose(this);">
                                <i class="icon-x-thin bg-black" aria-label="close"></i>
                              </button>`;
        
        const createdChip = document.createElement('i');
        createdChip.className = 'chip-border-triangle'; 
        
        createdDiv.insertAdjacentElement('afterend', createdChip)
        createdDiv.insertAdjacentHTML('afterend', closeBtnHtml)
        
        createPopover.classList.add('popover-visible');

        const setPlacement = function () {
            return new Promise((resolve) => {
                const getPosition = myUI.initPlacement(elem, elemDirection);

                createPopover.style.left = `${ getPosition[0] }px`;
                createPopover.style.top = `${ getPosition[1] }px`;

                resolve( getPosition )
            });
        }

        // 위치 적용 함수 분리
        function applyPosition (result) {
            /*
             result.map(Number): Number()로 변환해서 새 배열을 만듦
             const x = Number(popoverSetPos[0]);
             const y = Number(popoverSetPos[1]); ... 이렇게 하지 않아도 된다!
             - 값 변환없이 새로운 배열을 만드려면 ↓↓
             1. const copy = [...result]; (전개연산자) : 추천방식!
             2. const copy = result.slice(); (예전방식)
            */
            const [ x, y, width, height ] = result.map(Number);
      
            /* - transValue 적용이 어려울 때 수동으로 계산하기
             const popoverSizeArr = myUI.getElementSize(createPopover)
             const width = popoverSizeArr[0];
             const height = popoverSizeArr[1];
            */
            const popoverXgutter = 12;
            const popoverYgutter = 18;
            const chipLeft_calc = width / 2;
            const chipTop_calc = height / 2;
            let popoverLeft, popoverTop, popoverTrans, chipTop, chipLeft;

            createPopover.removeAttribute('style');
            createdChip.removeAttribute('style');

            switch (elemDirection) {
                case 'left': 
                    popoverLeft = `${ x - popoverXgutter }px`; // popoverLeft: `${ x - widthValue }px`
                    popoverTop = `${ y - popoverYgutter }px`;
                    popoverTrans = 'translateX(-100%)';
                    chipTop = `${ chipTop_calc + popoverXgutter }px`

                    createdChip.style.top = chipTop;
                    createPopover.style.transform = popoverTrans;
                    break;
                case 'right':
                    popoverLeft = `${ x + popoverXgutter }px`; 
                    popoverTop = `${ y - popoverYgutter }px`;
                    chipTop = `${ chipTop_calc + popoverXgutter }px`;

                    createdChip.style.top = chipTop;
                    break;
                case 'top':
                    popoverLeft = `${ x - popoverYgutter }px`; 
                    popoverTop = `${ y - popoverXgutter }px`; // `top: ${ y - heightValue }px`
                    popoverTrans = 'translateY(-100%)';
                    chipLeft = `${ chipLeft_calc + popoverXgutter }px`;

                    createdChip.style.left = chipLeft;
                    createPopover.style.transform = popoverTrans;
                    break;
                case 'bottom':
                    popoverLeft = `${ x - popoverYgutter }px`; 
                    popoverTop = `${ y + popoverXgutter }px`; 
                    chipLeft = `${ chipLeft_calc + popoverXgutter }px`;

                    createdChip.style.left = chipLeft;
                    break;
            }

            createPopover.style.left = popoverLeft;
            createPopover.style.top = popoverTop;
        }

        // 리사이즈 핸들러 선언 & 등록
        const resizePopoverHandler = () => {
            setPlacement().then(applyPosition);
        };

        window.addEventListener('resize', resizePopoverHandler);
        window.addEventListener('scroll', resizePopoverHandler, true);

        /*
         - ._resizePopoverHandler
         DOM 엘리먼트(객체)에 임의로 붙인 커스텀 필드/"확장 프로퍼티(expando)" (브라우저 표준 아님)
         * 자바스크립트 객체는(대부분) 동적으로 프로퍼티를 더 붙일 수 있다.
         createPopover 엘리먼트에 resizePopoverHandler 함수 저장하기.
         언더스코어(_) 로 시작하는 이름은 js에서 내부용, 비공개, 임시 데이터라는 의도를
         나타내기 위한 개발자들간의 '관례'. 실제 언어 규칙은 아니다. 
         등록한 resize 이벤트 제거를 위해 저장한다. (메모리 누수 위험 방지를 위해해)
         함수를 변수에 저장하고, 팝오버 (dom) 요소에 붙여서 보관하는 것.
         자바스크립트는 내용이 같은 함수가 아니라,'정확히 같은 인스턴스'인지 확인해서 이벤트를 제거하므로,
         익명함수가 아닌 변수에 저장(같은 객체)해야 제거가 가능하다.
         resizePopoverHandler는 popover 함수 내에서만 접근이 가능하므로 dom 요소에 함수를 저장하는 것.
         *** DOM 요소에 붙이면 외부 함수에서도 참조 가능.****(단순 변수 저장이 아니라, 접근 가능한 위치에 저장)
         핸들러 함수에 다시 접근 가능한 구조라면, 굳이 DOM 요소에 저장하지 않아도 된다. 
        */
        createPopover._resizePopoverHandler = resizePopoverHandler;

        /*
         - ResizeObserver 등록
         header 높이가 변경되는 것을 감지할 떄마다 
         resizePopoverHandler를 실행하여 위치값을 다시 계산한다.
        */
        const header = document.querySelector('header');
        const resizeObserver = new ResizeObserver(() => {
            resizePopoverHandler();
        });
        resizeObserver.observe(header);
        createPopover._resizeObserver = resizeObserver;

        setPlacement().then((result) => {
            setTimeout(() => {
                createPopover.classList.add('popover-effect');
                applyPosition(result);
            }, 100);
        });
    },
    popoverClose: function (elem) {
        let clicked;
        let popoverID;

        if ( elem.classList.contains('ui-popover-close') ) {
            const popover = elem.parentElement; // .popover
            popoverID = popover.getAttribute('data-popover-id');
            clicked = document.querySelector(`[data-popover-target="${popoverID}"]`)
        } else if ( elem.classList.contains(myDialgUI.popoverActiveClass) ) {
            popoverID = elem.getAttribute('data-popover-target');
            clicked = elem;
        } 
        
        const popover = document.querySelector(`[data-popover-id="${popoverID}"]`);

        clicked.classList.remove(myDialgUI.popoverActiveClass);
        popover.classList.remove('popover-visible');
        popover.classList.remove('popover-effect');
        setTimeout(function () {
            popover.remove()
        }, 400)

        document.removeEventListener('click', myDialgUI.popoverOutside);

        if ( popover && popover._resizePopoverHandler ) {
            window.removeEventListener('resize', popover._resizePopoverHandler);
            window.removeEventListener('scroll', popover._resizePopoverHandler, true);
        }
        if ( popover._resizeObserver ) {
            popover._resizeObserver.disconnect();
        }
    },
    popoverOutside: function (event) {
        const activeClasses = document.querySelectorAll(`.${myDialgUI.popoverActiveClass}`);
        const isInsidePopover = event.target.closest(`.${myDialgUI.popoverActiveClass}`);

        if ( !isInsidePopover ) { 
            activeClasses.forEach((item) => { myDialgUI.popoverClose(item); });
        }
    },
   /**
     * @param {*} 
     */
    tooltipActiveClass : `tooltip-${myUI.activeClass}`,
    tooltipInit: function (elem) {
        const openValue = elem.getAttribute('data-tooltip-open');
        const closeValue = elem.getAttribute('data-tooltip-close');
        const btnset = elem.classList.contains(myDialgUI.tooltipActiveClass)

        if ( openValue === 'auto' && !btnset ) {
            myDialgUI.tooltipOpen (elem)
            elem.classList.add(myDialgUI.tooltipActiveClass)
        }

        if ( closeValue === 'auto' ) {
            setTimeout(() => { 
                myDialgUI.tooltipClose(elem)
            }, 3000)
        }
    },
    tooltip: function (elem) {
        const outsideClick = elem.getAttribute('data-tooltip-outside'); 

        if ( elem.classList.contains(myDialgUI.tooltipActiveClass) ) {
            myDialgUI.tooltipClose (elem)
        } else {
            myDialgUI.tooltipOpen (elem)
        }

        if ( !outsideClick === 'no' ) {
            // setTimeout을 사용해 이벤트 버블링 방지
            setTimeout(() => {
                document.addEventListener('click', myDialgUI.tooltipOutside, { once: true });
            }, 0);
        }
    },
    tooltipOpen: function (elem) {
        const wrap = document.querySelector('body > div');
        const elemTarget = elem.getAttribute('data-tooltip-target');
        const elemDirection = elem.getAttribute('data-tooltip-direction');
        const elemContent = elem.getAttribute('data-tooltip-content');
        const createTooltip = document.createElement('div');
        const toolipHtml = `<div class="tooltip-content"><p>${elemContent}</p></div>`

        if ( elem.classList.contains(myDialgUI.tooltipActiveClass) ) return;

        createTooltip.className = `tooltip tooltip-${elemDirection}`; 
        createTooltip.setAttribute('data-tooltip-id', elemTarget)
        wrap.insertAdjacentElement('beforeend', createTooltip); // wrap.insertBefore(createPopover, elem.nextSibling)
        elem.classList.add(myDialgUI.tooltipActiveClass);
        createTooltip.innerHTML = toolipHtml;

        const createdDiv = createTooltip.querySelector('.tooltip-content');
        const closeBtnHtml = `<button type="button" class="btn-icon btn-icon-20 ui-tooltip-close" onclick="myDialgUI.tooltipClose(this);">
                                <i class="icon-x-thin bg-white" aria-label="close"></i>
                            </button>
                            <i class="chip-triangle"></i>`;

        createdDiv.insertAdjacentHTML('afterend', closeBtnHtml) // 'beforeend'
        createTooltip.classList.add('tooltip-visible');

        const setPlacement = function () {
            return new Promise((resolve) => {
                const getPosition = myUI.initPlacement(elem, elemDirection);

                createTooltip.style.left = `${ getPosition[0] }px`;
                createTooltip.style.top = `${ getPosition[1] }px`;

                resolve( getPosition )
            });
        }

        // 위치 적용 함수 분리
        function applyPosition (result) {
            /*
             result.map(Number): Number()로 변환해서 새 배열을 만듦
             const x = Number(popoverSetPos[0]);
             const y = Number(popoverSetPos[1]); ... 이렇게 하지 않아도 된다!
             값 변환없이 새로운 배열을 만드려면 ↓↓
             1. const copy = [...result]; (전개연산자) - 추천방식!
             2. const copy = result.slice(); (예전방식)
            */
            const [ x, y, width, height ] = result.map(Number);

            /* - transValue 적용이 어려울 때 수동으로 계산하기
             const popoverSizeArr = myUI.getElementSize(createPopover) 
             onst widthValue = popoverSizeArr[0];
             const heightValue = popoverSizeArr[1];
            */
            const tooltipGutter = 12;
            const tooltipLeft_calc = width / 2;
            const tooltipTop_calc = height / 2;
            let tooltipLeft;
            let tooltipTop;
            let tooltipTrans;

            createTooltip.removeAttribute('style');

            switch (elemDirection) {
                case 'left': 
                    tooltipLeft = `${ x - tooltipGutter }px`
                    tooltipTop = `${ y + tooltipTop_calc }px`
                    tooltipTrans = 'translate(-100%, -50%)'
                    break;
                case 'right': 
                    tooltipLeft = `${ x + tooltipGutter }px`
                    tooltipTop = `${ y + tooltipTop_calc }px`
                    tooltipTrans = 'translateY(-50%)'
                    break;
                case 'top':
                    tooltipLeft = `${ x + tooltipLeft_calc }px`
                    tooltipTop = `${ y - tooltipGutter }px`
                    tooltipTrans = 'translate(-50%, -100%)'
                    break;
                case 'bottom': 
                    tooltipLeft = `${ x + tooltipLeft_calc }px`
                    tooltipTop = `${ y + tooltipGutter }px`
                    tooltipTrans = 'translateX(-50%)'
                    break;
            }

            createTooltip.style.left = tooltipLeft;
            createTooltip.style.top = tooltipTop;
            createTooltip.style.transform = tooltipTrans
        }

        // 리사이즈 핸들러 선언 & 등록
        const resizeTooltipHandler = () => {
            setPlacement().then(applyPosition);
        };

        window.addEventListener('resize', resizeTooltipHandler);
        window.addEventListener('scroll', resizeTooltipHandler, true);
        
        /*
         - ._resizeTooltipHandler
         DOM 엘리먼트(객체)에 임의로 붙인 커스텀 필드/"확장 프로퍼티(expando)" (브라우저 표준 아님)
         * 자바스크립트 객체는(대부분) 동적으로 프로퍼티를 더 붙일 수 있다.
         createPopover 엘리먼트에 resizeTooltipHandler 함수 저장하기.
         언더스코어(_) 로 시작하는 이름은 js에서 내부용, 비공개, 임시 데이터라는 의도를
         나타내기 위한 개발자들간의 '관례'. 실제 언어 규칙은 아니다. 
         등록한 resize 이벤트 제거를 위해 저장한다. (메모리 누수 위험 방지를 위해해)
         함수를 변수에 저장하고, 팝오버 (dom) 요소에 붙여서 보관하는 것.
         자바스크립트는 내용이 같은 함수가 아니라,'정확히 같은 인스턴스'인지 확인해서 이벤트를 제거하므로,
         익명함수가 아닌 변수에 저장(같은 객체)해야 제거가 가능하다.
         resizeTooltipHandler는 tooltip 함수 내에서만 접근이 가능하므로 dom 요소에 함수를 저장하는 것.
         *** DOM 요소에 붙이면 외부 함수에서도 참조 가능.****(단순 변수 저장이 아니라, 접근 가능한 위치에 저장)
         핸들러 함수에 다시 접근 가능한 구조라면, 굳이 DOM 요소에 저장하지 않아도 된다. 
        */
        createTooltip._resizeTooltipHandler = resizeTooltipHandler;

        /*
         - ResizeObserver 등록
         header 높이가 변경되는 것을 감지할 떄마다 
         resizeTooltipHandler를 실행하여 위치값을 다시 계산한다.
        */
        const header = document.querySelector('header');
        const resizeObserver = new ResizeObserver(() => {
            resizeTooltipHandler();
        });
        resizeObserver.observe(header);
        createTooltip._resizeObserver = resizeObserver;

        setPlacement().then((result) => {
            setTimeout(() => {
                createTooltip.classList.add('tooltip-effect');
                applyPosition(result);
            }, 100);
        });
    },
    tooltipClose: function (elem) {
        let clicked;
        let tooltipID;

        if ( elem.classList.contains('ui-tooltip-close') ) {
            const tooltip = elem.parentElement; // .tooltip
            
            tooltipID = tooltip.getAttribute('data-tooltip-id');
            clicked = document.querySelector(`[data-tooltip-target="${tooltipID}"]`)
        } else if ( elem.classList.contains(myDialgUI.tooltipActiveClass) ) {
            tooltipID = elem.getAttribute('data-tooltip-target');
            clicked = elem;
        } 

        if ( !clicked || !clicked.classList.contains(myDialgUI.tooltipActiveClass) ) return;    

        const tooltip = document.querySelector(`[data-tooltip-id="${tooltipID}"]`);

        clicked.classList.remove(myDialgUI.tooltipActiveClass);
        tooltip.classList.remove('tooltip-visible');
        tooltip.classList.remove('tooltip-effect');
        setTimeout(function () {
            tooltip.remove()
        }, 300)

        document.removeEventListener('click', myDialgUI.tooltipOutside);
    },
    tooltipOutside: function (event) {
        const activeClasses = document.querySelectorAll(`.${myDialgUI.tooltipActiveClass}`);
        const isInsideTooltip = event.target.closest(`.${myDialgUI.tooltipActiveClass}`);

        if ( !isInsideTooltip ) { 
            activeClasses.forEach((item) => { myDialgUI.tooltipClose(item); });
        }
    },
    /**
     * 
     * @param {*} elem 
     * @param {*} message 
     * @returns 
     */
    toast: function (elem, message) {
        const wrap = document.querySelector('body > div');

        // 실행 중인지 확인하는 플래그 변수
        if ( this.isToastActive ) return;
        this.isToastActive = true;

        const elemDirection = elem.getAttribute('data-toast-direction');
        const createToast = document.createElement('div');
        const createToastHtml = `<p class="toast-massage">${message}</p>`
        createToast.className = `toast toast-${elemDirection}`; 

        wrap.insertAdjacentElement('beforeend', createToast);
        createToast.insertAdjacentHTML('beforeend', createToastHtml)

        // Promise 체이닝으로 순차 실행
        new Promise(resolve => setTimeout(resolve, 200)) // 3초 대기
        .then(() => {
            createToast.classList.add(myUI.activeClass)
            return new Promise(resolve => setTimeout(resolve, 2600)); // 페이드아웃 대기
        })
        .then(() => {
            createToast.classList.remove(myUI.activeClass)
            return new Promise(resolve => setTimeout(resolve, 200));
        })
        .then(() => {
            createToast.remove();
            this.isToastActive = false;
        });
    },
    /**
     * 
     * @param {*} elem 
     * @param {*} message 
     * @returns 
     */
    snackbar: function (elem, message) {
        const wrap = document.querySelector('body > div');

        // 실행 중인지 확인하는 플래그 변수
        if ( this.isSnackbarActive ) return;
        this.isSnackbarActive = true;

        const elemDirection = elem.getAttribute('data-snackbar-direction');
        const createSnackbar = document.createElement('div');
        const createSnackbarHtml = `<p class=snackbar-massage>${message}</p>
                                    <button type="button" class="btn-icon btn-icon-24" onclick="myDialgUI.snackbarRemove(this);">
                                        <i class="icon icon-x-thin bg-white" aria-label="close"></i>
                                    </button>`
        
        createSnackbar.className = `snackbar snackbar-${elemDirection}`; 
       
        wrap.insertAdjacentElement('beforeend', createSnackbar);
        createSnackbar.insertAdjacentHTML('beforeend', createSnackbarHtml);
        
        setTimeout(() => {
            createSnackbar.classList.add(myUI.activeClass)
        }, 300);
    },
    snackbarRemove: function (elem) {
        const snackbar = elem.closest('.snackbar');

        snackbar.classList.remove(myUI.activeClass);
        setTimeout(() => {
            snackbar.remove();
            this.isSnackbarActive = false;
        }, 300);
    },
    /**
     * @param {*} message 
     */
    customAlert: function (message) {
        myDialgUI.createdDialogue(message);
    },
    customConfirm: function (message) {
        myDialgUI.createdDialogue(message, 'confirm');
    },
    createdDialogue: function (message, type) {
        const body = document.querySelector('body');
        const wrap = document.querySelector('body > div');

        body.classList.add('dialog-opened')

        const createContainer = document.createElement('div');
        createContainer.className = 'dialog-container'; 

        const createDimmed = document.createElement('div');
        createDimmed.className = 'dimmed';

        const createDiv = document.createElement('div');
        createDiv.className = 'dialog-box'; 

        const createContent = document.createElement('div');
        createContent.className = 'dialog-content'; 

        const createText = document.createElement('p');
        createText.className = 'dialog-message text-center'; 
        createText.textContent = `${message}`; 

        const createBtngroup = document.createElement('div');
        createBtngroup.className = 'btn-group justify-center'; 

        const createConfirmBtn = document.createElement('button');
        createConfirmBtn.className = 'btn-basic btn-basic-md btn-primary'; 

        const createConfirmText = document.createElement('span');
        createConfirmText.textContent = '확인'; 

        wrap.insertAdjacentElement('beforeend', createContainer);
        createContainer.insertAdjacentElement('afterbegin', createDiv);
        createContainer.insertAdjacentElement('beforeend', createDimmed);
        createDiv.appendChild(createContent)
        createContent.insertAdjacentElement('afterbegin', createText);
        createContent.insertAdjacentElement('beforeend', createBtngroup);
        createBtngroup.insertAdjacentElement('beforeend', createConfirmBtn);
        createConfirmBtn.appendChild(createConfirmText)

        createConfirmBtn.addEventListener('click', function () {
            myDialgUI.removeDialogue()
        })

        if ( type === 'confirm' ) {
            const createCancelBtn = document.createElement('button');
            createCancelBtn.className = 'btn-basic btn-basic-md btn-secondary-line'; 
    
            const createCancelText = document.createElement('span');
            createCancelText.textContent = '취소'; 

            createBtngroup.insertAdjacentElement('afterbegin', createCancelBtn);
            createCancelBtn.appendChild(createCancelText)

            createCancelBtn.addEventListener('click', function () {
                myDialgUI.removeDialogue()
            })
        }
    },
    removeDialogue: function () {
        const dialog = document.querySelector('.dialog-container')
        const body = document.querySelector('body');

        body.classList.remove('dialog-opened')
        dialog.remove();
    }
}