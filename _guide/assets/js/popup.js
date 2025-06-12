/* Popup
========================================================*/
const myPopupUI = {
    /**
     * @param {object, string} // [data-js-behavior="popup"]
     */
    popupActiveClass : `popup-${myUI.activeClass}`,
    popup: function (elem, file) {   
        const body = document.querySelector('body');
        const wrap = document.querySelector('body > div');
        const elemID = elem.getAttribute('data-popup-target');
        const myURL = `pages/${file}`;
        const madeContainer = document.querySelector('.popup-container')

        if ( !madeContainer ) {
            const createContainer = document.createElement('div');

            createContainer.className = 'popup-container';
            wrap.insertAdjacentElement('beforeend', createContainer); // beforebegin, afterbegin, beforeend, afterend 
            createContainer.insertAdjacentHTML('beforeend', '<div class="dimmed" data-dismiss="popup"></div>')    
            body.classList.add('dialog-opened')
        } else {
            madeContainer.classList.add('popup-overlap');
        }

        const dimmed = document.querySelector('.dimmed')
        const popupContainer = document.querySelector('.popup-container')
        const createSection = document.createElement('div');

        createSection.className = 'popup-section'; 
        createSection.setAttribute('id', elemID)
        createSection.setAttribute('tabindex', '-1');
        createSection.setAttribute('data-popup-index', `${popupContainer.childElementCount}`)
        popupContainer.insertBefore(createSection, dimmed)

        fetch(myURL)
            .then(response => response.text())
            .then(data => {
                createSection.innerHTML = data;

                document.querySelector('.ui-popup-close').focus();

                document.querySelectorAll('[data-dismiss]').forEach(item => {
                    if ( !item.dataset.listener ) {  // 데이터 속성을 활용해 중복 등록 방지
                        item.dataset.listener = 'true';
                        item.addEventListener('click', function (e) {
                            e.stopPropagation();
                            myPopupUI.popupClose(item);
                        });
                    }
                })

                document.addEventListener('keydown', function(event) {
                    if (event.key === 'Escape') {
                        e.stopPropagation();
                        myPopupUI.popupClose(item);
                    }
                });
            })
            .catch(error => {
                alert('Error');
                console.error('Error', error);
            });
    },
    popupClose: function (elem) {
        const body = document.querySelector('body');
        const popupContainer = document.querySelector('.popup-container');
        const siblings = popupContainer ? popupContainer.children : false;
        const isPopup = Array.from(siblings).some(el => el.classList.contains('popup-section'));
        const isPopupLength = Array.from(siblings).filter(el => el.classList.contains('popup-section')).length;
        let myPopup;

        if ( elem && elem.classList.contains('dimmed') ) {
            myPopup = elem.previousElementSibling;
        } else {
            myPopup = elem.closest('.popup-section')
        }

        if ( isPopup && isPopupLength >= 2 ) {
            if ( myPopup ) { myPopup.remove(); }
            popupContainer.classList.remove('popup-overlap')
        } else {
            if ( popupContainer ) { popupContainer.remove(); }
            body.classList.remove('dialog-opened')
        }
    }
}

