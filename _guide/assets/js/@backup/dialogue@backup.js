/* Dialogue
========================================================*/
let openFlag = false;

const myDialgUI = {
    popoverInit: function (obj) {
        const popoverBtns = document.querySelectorAll(obj);
        for ( let i = 0; i < popoverBtns.length; i++ ) {
            const num = i + 1;
            popoverBtns[i].setAttribute('data-popover-target', `popover-0${[num]}`);
        }
    },
    popover: function (obj) {   
        if ( obj.classList.contains('popover-open') ) {
            myDialgUI.popoverClose (obj)
        } else {
            myDialgUI.popoverOpen (obj)
        }
    },
    popoverOpen: function (obj) {
        const popoverContents = [
            {
                id: 'MYDIALGUI_POPOVER01',
                title: 'Lorem ipsum dolor sit amet.',
                content: '<dd>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint, velit.</dd><dd>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit eos, autem doloremque tenetur recusandae nulla?</dd>',
            },
            {
                id: 'MYDIALGUI_POPOVER02',
                content: '<li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non perspiciatis repellendus ducimus incidunt a.</li><li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus.</li>',
            },
            {
                id: 'MYDIALGUI_POPOVER03',
                content: '<li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis voluptates dolore repellendus! Praesentium necessitatibus itaque quidem veniam!</li>',
            },
            {
                id: 'MYDIALGUI_POPOVER04',
                title: 'Lorem ipsum dolor sit.',
                content: '<dd>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error cumque impedit laudantium architecto ipsam vitae id numquam dicta dolores?</dd><dd>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, amet ipsa?</dd>',
            },
        ]
        
        const wrap = document.querySelector('body > div');
        const objTarget = obj.getAttribute('data-popover-target');
        const objDirection = obj.getAttribute('data-popover-direction');
        const objTitle = obj.getAttribute('data-popover-title');
        const objContent = obj.getAttribute('data-popover-content');
        const createPopover = document.createElement('div');
        const foundKey = popoverContents.find((item) => item.id === objContent);
        let popoverHtml;
        
        if ( obj.classList.contains('popover-open') ) return;

        createPopover.className = `popover popover-${objDirection}`; 
        createPopover.setAttribute('data-popover-id', objTarget)
        wrap.insertAdjacentElement('beforeend', createPopover); // wrap.insertBefore(createPopover, obj.nextSibling)
        obj.classList.add('popover-open');

        if ( objTitle === 'Y' ) {
            popoverHtml = `<div class="popover-content" data-popover-content-id="${foundKey.id}">
                                <dl><dt>${foundKey.title}</dt>${foundKey.content}</dl>
                            </div>`
        } else {
            popoverHtml = `<div class="popover-content" data-popover-content-id="${foundKey.id}">
                                <ul>${foundKey.content}</ul>
                            </div>`
        }

        createPopover.innerHTML = popoverHtml;

        const createdDiv = createPopover.querySelector('.popover-content');
        const closeBtnHtml = `<button type="button" class="btn-icon-24 popover-close-btn" onclick="myDialgUI.popoverClose(this);">
                                <i class="icon-css-x-normal icon-sm"></i>
                              </button>`;

        createdDiv.insertAdjacentHTML('beforeend', closeBtnHtml)
        createPopover.classList.add('popover-visible');

        const setPlacement = function () {
            return new Promise((resolve) => {
                const getPosition = myUI.initPlacement(obj, objDirection);

                createPopover.style.left = `${ getPosition[0] }px`;
                createPopover.style.top = `${ getPosition[1] }px`;

                resolve( getPosition )
            });
        }

        setPlacement().then((result) => {
            const popoverSetPos = result;
            const leftPos = popoverSetPos[0];
            const topPos = popoverSetPos[1];

            const popoverSizeArr = myUI.getTargetSize(createPopover)
            const widthValue = popoverSizeArr[0];
            const heightValue = popoverSizeArr[1];
            let leftValue;
            let topValue;

            createPopover.removeAttribute('style');

            setTimeout(() => {
                createPopover.classList.add('popover-effect');

                if ( objDirection === 'left' ) {
                    leftValue = `${ leftPos - widthValue }px`;
                    topValue = `${ topPos }px`
                    console.log('left', popoverSizeArr)
                }
                if ( objDirection === 'right' ) {
                    leftValue = `${ leftPos }px`
                    topValue = `${ topPos }px`
                    console.log('right', popoverSizeArr)
                }
                if ( objDirection === 'top' ) {
                    leftValue = `${ leftPos }px`
                    topValue = `${ topPos - heightValue }px`
                    console.log('top', popoverSizeArr)
                }
                if ( objDirection === 'bottom' ) {
                    leftValue = `${ leftPos }px`
                    topValue = `${ topPos }px`
                    console.log('bottom', popoverSizeArr)
                }

                createPopover.style.left = leftValue;
                createPopover.style.top = topValue;

                console.log(leftValue, topValue)
            }, 100);
        })

        openFlag = true;
    },
    popoverClose: function (obj) {
        let clicked;
        let popoverID;

        if ( obj.classList.contains('popover-close-btn') ) {
            const popover = obj.closest('.popover');
            popoverID = popover.getAttribute('data-popover-id');
            clicked = document.querySelector(`[data-popover-target="${popoverID}"]`)
        } else if ( obj.classList.contains('popover-open') ) {
            popoverID = obj.getAttribute('data-popover-target');
            clicked = obj;
        }
        
        const popover = document.querySelector(`[data-popover-id="${popoverID}"]`);

        clicked.classList.remove('popover-open');
        popover.classList.remove('popover-visible');
        popover.classList.remove('popover-effect');
        setTimeout(function () {
            popover.remove()
        }, 400)

        openFlag = false;
    },
}