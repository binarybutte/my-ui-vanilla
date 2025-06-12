/* Form: combobox, checkAll/Counter
========================================================*/
const myFormUI = {
    comboboxActiveClass : `combobox-${myUI.activeClass}`,
    combobox: function (event) {
        const handler = myUI.getTarget(event.target, 'combobox-handler');
        const selectOption = myUI.getTarget(event.target, 'combobox--select-option');
        const checkOption = myUI.getTarget(event.target, 'combobox--check-option');
        const disabled = myUI.getTarget(event.target, 'combobox-disabled');

        if ( disabled ) return;

        switch (true) {
            case !!handler: {
                const container = handler.closest('.combobox');
                const isActive = container.classList.contains(myFormUI.comboboxActiveClass);

                myFormUI.comboboxExpand(container, handler);
                !isActive ? myFormUI.comboboxExpand(container, handler) : myFormUI.comboboxCollapsed(container, handler);
                break;
            }
            case !!selectOption: {
                const case_select = selectOption.closest('.combobox--select');

                myFormUI.combobox_selected (selectOption, case_select);  
                break;
            }
        }

        setTimeout(() => { myFormUI.comboboxOutside(event) }, 0);
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
    combobox_selected: function (target, elem) {
        const handler = elem.querySelector('.combobox-handler');
        const selectedText = handler.querySelector('.combobox-value');
        const selectedOption = target.querySelector('.combobox-option-txt').textContent;
        const selectedList = target.parentElement;

        myFormUI.combobox_unselected(selectedList);
        target.classList.add(myUI.activeClass);
        selectedText.textContent = `${selectedOption}`;
        selectedText.classList.add('combobox-value-selected')
        myFormUI.comboboxCollapsed(elem, handler)
    },
    combobox_unselected: function (elem) {
        const siblings = myUI.getSiblings(elem)

        siblings.forEach(item => { 
            item.querySelector('.combobox--select-option').classList.remove(myUI.activeClass);
        });
    },
    comboboxOutside: function (event) {
        const activeClasses = document.querySelectorAll(`.${myFormUI.comboboxActiveClass}`);
        const clicked = myUI.getTarget(event.target, 'combobox');

        activeClasses.forEach(item => { 
            if ( item !== clicked ) { // 다른 combobox를 클릭한 경우만 닫기
                myFormUI.comboboxCollapsed(item, item.querySelector('.combobox-handler'));
            }
        });
    },
    /**
     * @param {string} all 
     */
    checkAll: function (inputName) {
        const isCheckAll = document.querySelector(`[data-js-behavior='${inputName}']`);
        const checkboxes = document.querySelectorAll(`input[name='${inputName}']:not(:disabled):not(.form-check-readonly)`);
        const counterElement = document.querySelector(`[data-check-counter='${inputName}']`);

        isCheckAll.addEventListener('change', function () {
            checkboxes.forEach(item => {
                item.checked = isCheckAll.checked;
            });
            counterElement && myFormUI.checkCounter(checkboxes, counterElement);
        });

        checkboxes.forEach(item => {
            item.addEventListener('change', function () {
                if ( !this.checked ) {
                    isCheckAll.checked = false;
                } else {
                    isCheckAll.checked = [...checkboxes].every(cb => cb.checked); // 배열의 모든 요소가 조건을 만족하는지 확인 true, false 반환
                }
                counterElement && myFormUI.checkCounter(checkboxes, counterElement);
            });
        });
    },
    checkCounter: function (elems, counter, maximum) {
        const checkedItems = [...elems].filter(cb => cb.checked); // 체크된 항목만 배열로 반환
        const checkedCount = checkedItems.length;
        const groupName = counter.dataset.checkCounter;
        const checkPlacehoder = counter.dataset.checkPlacehoder || 'Check an option';
        const messageElement = document.querySelector(`[data-check-message='${groupName}']`);
        const comboboxContainer = counter.closest('.combobox--check');

        // 카운터 업데이트
        if ( checkedCount > 0 ) {
            counter.textContent = `${checkedCount}`;
            comboboxContainer && counter.classList.add('combobox-value-selected');
        } else {
            counter.textContent = `${checkPlacehoder}`;
            comboboxContainer && counter.classList.remove('combobox-value-selected');
        }

        // 메시지 업데이트 (존재하면)
        if ( messageElement ) {
            if ( maximum && checkedCount >= maximum ) {
                messageElement.textContent = `Maximum ${maximum} selections allowed!`;
            } else {
                messageElement.textContent = ''; // 제한 초과가 아닐 때 메시지 제거
            }
        }

        if ( maximum ) {
            // 체크 개수가 최대값을 초과하면 체크 안 된 요소를 비활성화, 그렇지 않으면 다시 활성화
            elems.forEach(cb => {
                cb.disabled = !cb.checked && checkedCount >= maximum;
            });
        }
    },
    /**
     * @param {string} elem 
     */
    fileUploader: function (elem) {
        const fileInput = elem;
        const container = fileInput.closest('.file-uploader');
        let files;

        if ( elem.getAttribute('multiple') !== null ) { // 또는 elem.multiple, fileInput.hasAttribute('multiple')
            files = fileInput.files // 여러 개의 파일 배열
            if ( files.length > 0 ) {
                myFormUI.fileDisplay_multiple(container, fileInput, files);
            } 
        } else {
            files = fileInput.files[0];
            myFormUI.fileDisplay(container, fileInput, files);
        }
    },
    fileDisplay: function (container, fileInput, files) {
        const fileMessage = container.querySelector('.file-message'); 
        const uploadStatus = container.querySelector('.file-upload-status');
        // const extension = files.name.split('.').pop().toLowerCase();

        if ( files.type !== 'image/png' ) { // extension !== 'png'
            myFormUI.fileUpload_fail(container, fileMessage, uploadStatus);
        } else {
            const uploadedList = container.querySelector('.file-control');

            if ( uploadedList ) { 
                myFormUI.fileControl_txt(container, files, fileInput, fileMessage, uploadStatus, uploadedList)
            } 

            myFormUI.fileUpload_success(container, files, fileInput, fileMessage, uploadStatus, uploadedList);
        }
    },
    fileDisplay_multiple: function (container, fileInput, files) {
        const fileMessage = container.querySelector('.file-message'); 
        const uploadStatus = container.querySelector('.file-upload-status');
        const uploadedList = container.querySelector('.file-control');
        const previewType = uploadedList.getAttribute('data-control');

        Array.from(files).forEach(file => {
            if ( previewType === 'text' ) {
                myFormUI.fileControl_txt(container, file, fileInput, fileMessage, uploadStatus, uploadedList);
                myFormUI.fileUpload_success(container, file, fileInput, fileMessage, uploadStatus, uploadedList);
            }
            if ( previewType === 'image' ) {
                myFormUI.fileControl_img(container, file, fileInput, fileMessage, uploadStatus, uploadedList);
                myFormUI.fileUpload_success(container, file, fileInput, fileMessage, uploadStatus, uploadedList);
            } 
        });
    },
    fileControl_img: function (container, files, fileInput, message, status, list) {
        const uploadedList = list.querySelector('.file-preview');
        const createdFile = document.createElement('div');
        const createdImg = document.createElement('figure');
        const createdText = document.createElement('p');
        const createdButton = document.createElement('button');
        const createdButtonIcon = document.createElement('i');

        if ( !fileInput.hasAttribute('multiple') ) {
            uploadedList.innerHTML = '';
        }

        createdFile.className = 'file-uploaded';
        createdImg.className = 'img';  
        createdText.className = 'text-sm text-secondary text-ellipsis'; 
        createdText.textContent = `${files.name}`; 
        createdText.setAttribute('title', `${files.name}`);
        createdButton.className = 'btn-chip chip-rounded bg-secondary'; 
        createdButton.setAttribute('type', 'button');
        createdButtonIcon.className = 'icon icon-x-bold bg-white'; 

        uploadedList.appendChild(createdFile);
        createdFile.insertAdjacentElement('beforeend', createdImg);
        createdFile.insertAdjacentElement('beforeend', createdText);
        createdFile.insertAdjacentElement('beforeend', createdButton);
        createdButton.insertAdjacentElement('beforeend', createdButtonIcon);

        const previewType = list.getAttribute('data-control');

        if ( previewType === 'image' ) {
            if ( files.type === 'image/png' ) {
                const imgFile = document.createElement('img');
                createdImg.appendChild(imgFile);

                const reader = new FileReader();
                reader.onload = function (e) {
                    imgFile.src = e.target.result;
                    imgFile.style.display = 'block';
                };
                reader.readAsDataURL(files);
            } else {
                const emptyHtml = `<div class="icon-empty">//</div>`
                createdImg.insertAdjacentHTML('beforeend', emptyHtml)
            }
        }

        createdButton.addEventListener('click', (e) => {
            myFormUI.fileRemove(container, fileInput, message, status, uploadedList, createdButton)
        });
    },
    fileControl_txt: function (container, files, fileInput, message, status, list) {
        const uploadedList = list;
        const createdFile = document.createElement('div');
        const createdText = document.createElement('p');
        const createdButton = document.createElement('button');
        const createdButtonIcon = document.createElement('i');

        if ( !fileInput.hasAttribute('multiple') ) {
            uploadedList.innerHTML = '';
        }

        createdFile.className = 'file-uploaded'; 
        createdText.className = 'text-ellipsis'; 
        createdText.textContent = `${files.name}`; 
        createdText.setAttribute('title', `${files.name}`);
        createdButton.className = 'btn-chip chip-rounded bg-secondary'; 
        createdButton.setAttribute('type', 'button');
        createdButtonIcon.className = 'icon icon-x-bold bg-white'; 

        uploadedList.appendChild(createdFile);
        createdFile.insertAdjacentElement('beforeend', createdText);
        createdFile.insertAdjacentElement('beforeend', createdButton);
        createdButton.insertAdjacentElement('beforeend', createdButtonIcon);

        createdButton.addEventListener('click', (e) => {
            myFormUI.fileRemove(container, fileInput, message, status, uploadedList, createdButton)
        });
    },
    fileUpload_fail: function (container, message, status) {
        container.classList.remove('file-uploader--success');
        container.classList.add('file-uploader--fail');
        message.textContent = `업로드 실패`;
        status.setAttribute('aria-label', 'Fail');
    },
    fileUpload_success: function (container, files, fileInput, message, status, list) {
        container.classList.remove('file-uploader--fail');
        container.classList.add('file-uploader--success');
        status.setAttribute('aria-label', 'Success');

        const previewType = list.getAttribute('data-control');
        let uploadedList;
        let uploadedItems;
        
        if ( previewType === 'text' ) {
            uploadedList = list;
            uploadedItems = uploadedList.childElementCount;
        }
        if ( previewType === 'image' ) {
            uploadedList = list.querySelector('.file-preview');
            uploadedItems = uploadedList.childElementCount - 1;
        }

        if ( fileInput.multiple && uploadedItems >= 2 ) {
            message.textContent = `파일 ${uploadedItems}개`;
        } 
        message.textContent = `${files.name}`;    
    },
    fileRemove: function (container, fileInput, message, status, list, btn) {
        btn.parentElement.remove();
        message.textContent = `파일 ${list.childElementCount}개`;

        if ( list.childElementCount === 0 ) {
            container.classList.remove('file-uploader--success');
            message.textContent = '선택된 파일 없음 (Multiple)';
            fileInput.value = '';
            status.removeAttribute('aria-label');
        }
    }
}