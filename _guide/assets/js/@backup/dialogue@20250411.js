/* Dialogue: popover, tooltip
========================================================*/
const myDialgUI = {
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
            popoverHtml = `<div class="popover-content">
                                <ul>${foundKey.content}</ul>
                            </div>`
        } else {
            popoverHtml = `<div class="popover-content">
                                <dl><dt class="popover-title">${foundKey.title}</dt>${foundKey.content}</dl>
                            </div>`
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

        setPlacement().then((result) => {
            const popoverSetPos = result;
            const x_coordinate = Number(popoverSetPos[0]);
            const y_coordinate = Number(popoverSetPos[1]);
            const targetWidth = Number(popoverSetPos[2]);
            const targetHeight = Number(popoverSetPos[3]);
            /** - transValue 적용이 어려울 때 수동으로 계산하기
             * const popoverSizeArr = myUI.getElementSize(createPopover)
             * const widthValue = popoverSizeArr[0];
             * const heightValue = popoverSizeArr[1];
             */
            const popoverXgutter = 12;
            const popoverYgutter = 18;
            const chipLeft_calc = targetWidth / 2;
            const chipTop_calc = targetHeight / 2;
            let popoverLeft, popoverTop, popoverTrans, chipTop, chipLeft;

            createPopover.removeAttribute('style');
            createdChip.removeAttribute('style');

            setTimeout(() => {
                createPopover.classList.add('popover-effect');

                switch (elemDirection) {
                    case 'left': 
                        popoverLeft = `${ x_coordinate - popoverXgutter }px`; // popoverLeft: `${ x_coordinate - widthValue }px`
                        popoverTop = `${ y_coordinate - popoverYgutter }px`;
                        popoverTrans = 'translateX(-100%)';
                        chipTop = `${ chipTop_calc + popoverXgutter }px`

                        createdChip.style.top = chipTop;
                        createPopover.style.transform = popoverTrans;
                        break;
                    case 'right':
                        popoverLeft = `${ x_coordinate + popoverXgutter }px`; 
                        popoverTop = `${ y_coordinate - popoverYgutter }px`;
                        chipTop = `${ chipTop_calc + popoverXgutter }px`;

                        createdChip.style.top = chipTop;
                        break;
                    case 'top':
                        popoverLeft = `${ x_coordinate - popoverYgutter }px`; 
                        popoverTop = `${ y_coordinate - popoverXgutter }px`; // `top: ${ y_coordinate - heightValue }px`
                        popoverTrans = 'translateY(-100%)';
                        chipLeft = `${ chipLeft_calc + popoverXgutter }px`;

                        createdChip.style.left = chipLeft;
                        createPopover.style.transform = popoverTrans;
                        break;
                    case 'bottom':
                        popoverLeft = `${ x_coordinate - popoverYgutter }px`; 
                        popoverTop = `${ y_coordinate + popoverXgutter }px`; 
                        chipLeft = `${ chipLeft_calc + popoverXgutter }px`;

                        createdChip.style.left = chipLeft;
                        break;
                }

                createPopover.style.left = popoverLeft;
                createPopover.style.top = popoverTop;
            }, 100);
        })
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
    },
    popoverOutside: function (event) {
        const activeClasses = document.querySelectorAll(`.${myDialgUI.popoverActiveClass}`);
        const isInsidePopover = event.target.closest(`.${myDialgUI.popoverActiveClass}`);

        if ( !isInsidePopover ) { 
            activeClasses.forEach((item) => { myDialgUI.popoverClose(item); });
        }
    },
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

        // setTimeout을 사용해 이벤트 버블링 방지
        if ( !outsideClick === 'no' ) {
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

        setPlacement().then((result) => {
            const tooltipSetPos = result;
            const x_coordinate = Number(tooltipSetPos[0]);
            const y_coordinate = Number(tooltipSetPos[1]);
            const targetWidth = Number(tooltipSetPos[2]);
            const targetHeight = Number(tooltipSetPos[3]);
            /** - transValue 적용이 어려울 때 수동으로 계산하기
             * const popoverSizeArr = myUI.getElementSize(createPopover) 
             * onst widthValue = popoverSizeArr[0];
             * const heightValue = popoverSizeArr[1];
             */
            const tooltipGutter = 12;
            const tooltipLeft_calc = targetWidth / 2;
            const tooltipTop_calc = targetHeight / 2;
            let tooltipLeft;
            let tooltipTop;
            let tooltipTrans;

            createTooltip.removeAttribute('style');

            setTimeout(() => {
                createTooltip.classList.add('tooltip-effect');

                switch (elemDirection) {
                    case 'left': 
                        tooltipLeft = `${ x_coordinate - tooltipGutter }px`
                        tooltipTop = `${ y_coordinate + tooltipTop_calc }px`
                        tooltipTrans = 'translate(-100%, -50%)'
                        break;
                    case 'right': 
                        tooltipLeft = `${ x_coordinate + tooltipGutter }px`
                        tooltipTop = `${ y_coordinate + tooltipTop_calc }px`
                        tooltipTrans = 'translateY(-50%)'
                        break;
                    case 'top':
                        tooltipLeft = `${ x_coordinate + tooltipLeft_calc }px`
                        tooltipTop = `${ y_coordinate - tooltipGutter }px`
                        tooltipTrans = 'translate(-50%, -100%)'
                        break;
                    case 'bottom': 
                        tooltipLeft = `${ x_coordinate + tooltipLeft_calc }px`
                        tooltipTop = `${ y_coordinate + tooltipGutter }px`
                        tooltipTrans = 'translateX(-50%)'
                        break;
                }

                createTooltip.style.left = tooltipLeft;
                createTooltip.style.top = tooltipTop;
                createTooltip.style.transform = tooltipTrans
            }, 100);
        })
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