/* Form
========================================================*/
const myFormUI = {
    /**
     * @param {combobox} // [data-js-behavior="accordion"]
     */
    comboboxActiveClass : `combobox-${myUI.activeClass}`,
    combobox: function (elem) {
        const container = elem;

        container.addEventListener('click', e => { 
            const handler = myUI.getTarget(e.target, 'combobox-handler');
            const comboboxActive = myUI.getTarget(e.target, myFormUI.comboboxActiveClass);

            if ( handler && !comboboxActive ) {
                myFormUI.comboboxExpand(container, handler);
            } else if ( handler && comboboxActive ) {
                myFormUI.comboboxCollapsed(container, handler);
            }

            // 하위 리스트 선택
            const comboboxListItem = myUI.getTarget(e.target, 'combobox-item');
            const comboboxValue = elem.querySelector('.combobox-value')

            if ( comboboxListItem ) {
                myFormUI.comboboxItem_selected (comboboxListItem, comboboxValue);  
            }
        })

        document.addEventListener('click', myFormUI.comboboxOutside)
    },
    comboboxExpand: function (elem, handler) {
        const comboboxArrow = elem.querySelector('.ui-arrow')

        elem.classList.add(myFormUI.comboboxActiveClass);
        myUI.attrExpand(true, handler, comboboxArrow)
    },
    comboboxCollapsed: function (elem, handler) {
        const comboboxArrow = elem.querySelector('.ui-arrow')

        elem.classList.remove(myFormUI.comboboxActiveClass);
        myUI.attrExpand(false, handler, comboboxArrow)
    },
    comboboxItem_selected: function (elem, value) {
        const container = elem.closest('.combobox');
        const handler = container.querySelector('.combobox-handler');
        
        const elemParent = elem.parentElement;
        const selectedText = elem.querySelector('.combobox-item-txt').textContent;
        
        myFormUI.comboboxItem_unselected(elemParent);
        elem.classList.add(myUI.activeClass);
        value.textContent = `${selectedText}`;
        value.classList.add('combobox-value-selected')
        myFormUI.comboboxCollapsed(container, handler)
    },
    comboboxItem_unselected: function (elem) {
        const siblings = myUI.getSiblings(elem)

        siblings.forEach(item => { 
            const btn = item.querySelector('.combobox-item');
            btn.classList.remove(myUI.activeClass);
        });
    },
    comboboxOutside: function (event) {
        const active = document.querySelectorAll(`.${myFormUI.comboboxActiveClass}`);
        const clicked = myUI.getTarget(event.target, 'combobox');

        active.forEach(item => { 
            if ( item !== clicked ) { // 다른 combobox를 클릭한 경우만 닫기
                const handler = item.querySelector('.combobox-handler');
                myFormUI.comboboxCollapsed(item, handler);
            }
        });
    }
}