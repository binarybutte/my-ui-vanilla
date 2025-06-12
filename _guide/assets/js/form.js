/* Form: combobox, checkAll/Counter, fileUploader, 
        addForm, formTab
========================================================*/
const myFormUI = {
    comboboxActiveClass : `combobox-${myUI.activeClass}`,
    combobox: function (event) {
        const handler = myUI.getTarget(event.target, 'combobox-handler');
        const selectOption = myUI.getTarget(event.target, 'combobox--select-option');
        const radioOption = myUI.getTarget(event.target, 'combobox--radio-option');
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
            case !!radioOption: {
                const case_check = radioOption.closest('.combobox--check');

                myFormUI.combobox_selected (radioOption, case_check);  
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
        const selectedList = target.parentElement;
        const tagType = target.tagName;
        let selectedOption;
         
        if ( tagType === 'BUTTON' || tagType === 'A' ) {
            selectedOption = target.querySelector('.combobox-option-txt').textContent;
            myFormUI.combobox_unselected(selectedList);
            target.classList.add(myUI.activeClass);
        }

        if ( tagType === 'INPUT' ) {
            selectedOption = target.nextElementSibling.textContent
        }

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
        const isCheckAll = document.querySelector(`[data-check-target='${inputName}']`);
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
        let checkValue;
        
        checkValue = comboboxContainer ? counter.querySelector('.combobox-value') : counter;

        // 카운터 업데이트
        if ( checkedCount > 0 ) {
            checkValue.textContent = `${checkedCount}`;
            comboboxContainer && checkValue.classList.add('combobox-value-selected');
        } else {
            checkValue.textContent = `${checkPlacehoder}`;
            comboboxContainer && checkValue.classList.remove('combobox-value-selected');
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
    displayChecked: function (item, checkboxes, counter) {
        const checkedValue = item.nextElementSibling.textContent;
        const inputName = item.getAttribute('name');
        const inputId = item.getAttribute('id')

        if ( !item.checked ) {
            myFormUI.displayChecked_cancel(item, inputId)
        } else {
            myFormUI.displayChecked_add(checkedValue, inputName, inputId, checkboxes, counter)
        }
    },
    displayChecked_add: function (value, name, id, checkboxes, counter) {
        const counterElement = document.querySelector(`[data-check-counter='${name}']`);
        const displayDiv = document.querySelector(`[data-check-display="${name}"]`)
        const createdBadge = document.createElement('div');
        const createdBadgeText = document.createElement('span');
        const createdBadgeBtn = document.createElement('button');
        const createdBadgeIcon = document.createElement('i');

        createdBadge.className = 'badge-rect badge-md badge-primary';
        createdBadge.setAttribute('data-contact', `${id}`);
        createdBadgeBtn.className = 'btn-chip chip-rect';
        createdBadgeIcon.className = 'icon icon-x bg-white';
        createdBadgeIcon.setAttribute('aria-label', 'Delete');
        createdBadgeText.className = 'text-ellipsis'
        createdBadgeText.textContent = `${value}`

        displayDiv.appendChild(createdBadge);
        createdBadge.insertAdjacentElement('beforeend', createdBadgeText);
        createdBadge.insertAdjacentElement('beforeend', createdBadgeBtn);
        createdBadgeBtn.appendChild(createdBadgeIcon);

        createdBadgeBtn.addEventListener('click', function () {
            const checkbox = document.getElementById(id);
           
            if ( checkbox ) { checkbox.checked = false;  }
            createdBadge.remove(); 
            counterElement && myFormUI.checkCounter(checkboxes, counter);
        });
    }, 
    displayChecked_cancel: function (checkbox, id) {
        const displayDiv = document.querySelector(`[data-check-display="${checkbox.getAttribute('name')}"]`);
        const badge = displayDiv.querySelector(`[data-contact="${id}"]`);

        if ( badge ) { badge.remove(); }
    },
    /**
     * @param {string} elem 
     */
    fileUploader: function (elem) {
        const container = elem.closest('.file-uploader');
        const files = elem.files;
        /* - parseInt, Infinity
         data-maximum의 값(문자열) 정수로 변환. parseInt() 결과가 NaN 이면 Infinity : 즉, data-file-maximum이 없으면 무제한 업로드 가능.
         10' 은 문자열을 정수로 변환할 때 사용하는 진수를 의미. 기본값을 명시하지 않으면 0으로 시작하는 숫자를 8진수로 해석하는 경우가 있어서 명확하게 10을 지정하는 것이 좋음.
         
         - allowedExtensions
         요소의 속성값을 가져오고, 그 속성이 없을 경우(?.) undefined 반환 → 문자열을 쉼표 기준 배열로 나눔(.split(',')) (예: ['jpg', 'png', ' gif'])
         → 각 항목(.map)의 공백을 제거(trim()) 하고, 소문자로 변환 (toLowerCase())
        */
        const maxFiles = parseInt(elem.getAttribute('data-file-maximum'), 10) || Infinity;
        const allowedExtensions = elem.getAttribute('data-file-include')?.split(',').map(ext => ext.trim().toLowerCase()) || [];
        const fileIncludes = elem?.getAttribute('data-file-include'); // data-file-include 없으면 null 반환
        const message = container.querySelector('.file-message')
        const placeholder = message.getAttribute('data-file-placeholder') || '선택된 파일 없음';
        const list = container?.querySelector('.file-control')
        const context = {  // 함수 인자가 너무 많으면, 하나의 객체로 만들어 인자 수를 줄인다.
                            container, 
                            fileInput: elem, 
                            fileIncludes,
                            message, 
                            placeholder,
                            status: container.querySelector('.file-upload-status'), 
                            list,
                            preview: container.querySelector('.file-preview'),
                            allowedExtensions,
                            maxFiles
                        };

        container.classList.remove('file-uploader--fail'); // 새로운 업로드 시 실패 상태 제거

        if ( elem.multiple ) { // 또는 elem.getAttribute('multiple') !== null, elem.hasAttribute('multiple')
            if ( files.length > maxFiles ) {
                myFormUI.fileUpload_fail(context, `${maxFiles}개까지 업로드 가능`);
                return;
            }
            Array.from(files).forEach(file => myFormUI.fileDisplay(context, file));
        } else {
            myFormUI.fileDisplay(context, files[0])
        }
    },
    fileDisplay: function (context, file) {
        const { list, fileIncludes, maxFiles } = context;

        if ( !myFormUI.fileUpload_validate(context, file) ) {
            myFormUI.fileUpload_fail(context, `${fileIncludes}만 가능합니다.`);
            return;
        }

        let previewType;
        let uploadedItems;

        if ( list !== null && list !== undefined ) {
            previewType = list.getAttribute('data-file-control');
            uploadedItems = list.childElementCount
        } else {
            previewType = undefined;
            uploadedItems = undefined;
        }
        // 축약형: const previewType = list?.getAttribute('data-control');
        
        if ( uploadedItems >= maxFiles ) {
            myFormUI.fileUpload_fail(context, `${maxFiles}개까지 업로드 가능합니다.`);
            return;
        }
        if ( previewType === 'image' ) myFormUI.fileControl_img(context, file);
        if ( previewType === 'text' ) myFormUI.fileControl_txt(context, file);
       
        myFormUI.fileUpload_success(context, file);
    },
    fileControl_img: function (context, file) {
        const { fileInput, list } = context;
        const createdFile = myFormUI.fileItem_create(file, true);

        if ( !fileInput.hasAttribute('multiple') ) {
            list.innerHTML = '';
        }

        list.appendChild(createdFile);

        if ( file.type.startsWith('image/') ) { // file.type === 'image/png' 
            const image = document.createElement('img');
            createdFile.querySelector('.img').appendChild(image);

            const reader = new FileReader();
            reader.onload = function (e) {
                image.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            const emptyHtml = `<div class="icon-lg icon-paper bg-gray-500"></div>`;
            createdFile.querySelector('.img').classList.add('file-preview-none')
            createdFile.querySelector('.img').insertAdjacentHTML('beforeend', emptyHtml)
        }

        myFormUI.fileRemove(context, createdFile);
    }, 
    fileControl_txt: function (context, file) {
        const { fileInput, list } = context;
        const createdFile = myFormUI.fileItem_create(file, false);

        if ( !fileInput.hasAttribute('multiple') ) {
            list.innerHTML = '';
        }
        
        list.appendChild(createdFile);
        myFormUI.fileRemove(context, createdFile);
    },
    fileItem_create: function (fileItem, isImage) {
        const createdFile = document.createElement('div');
        createdFile.className = 'file-uploaded';

        const createdText = document.createElement('p');
        createdText.className = 'text-ellipsis';
        createdText.textContent = `${fileItem.name}`; 
        createdText.setAttribute('title', `${fileItem.name}`);

        const createdButton = document.createElement('button');
        createdButton.className = 'btn-chip chip-rounded bg-secondary'; 
        createdButton.setAttribute('type', 'button');

        const createdButtonIcon = document.createElement('i');
        createdButtonIcon.className = 'icon icon-x-bold bg-white'; 

        createdButton.appendChild(createdButtonIcon);
        createdFile.appendChild(createdText);
        createdFile.appendChild(createdButton);
        
        if ( isImage ) {
            const createdImg = document.createElement('figure');
            createdImg.className = 'img';
            createdFile.insertAdjacentElement('afterbegin', createdImg);
        }

        return createdFile;
    },
    fileUpload_validate: function (context, file) {
        if ( !context.allowedExtensions.length ) return true;
        const fileExtension = file.name.split('.').pop().toLowerCase();

        return context.allowedExtensions.includes(fileExtension);
    },
    fileUpload_fail: function (context, errorMessage) {
        const { container, message, status, list } = context;
        const uploadedItems = list.childElementCount;

        message.textContent = `${errorMessage}`;
        status.setAttribute('aria-label', 'Fail');
        container.classList.remove('file-uploader--success');
        container.classList.add('file-uploader--fail');

        if ( uploadedItems > 0 ) {
            message.textContent += `파일 ${uploadedItems}개`;
        }
    },
    fileUpload_success: function (context, file) {
        const { container, fileInput, message, status, list } = context;

        container.classList.remove('file-uploader--fail');
        container.classList.add('file-uploader--success');
        status.setAttribute('aria-label', 'Success');

        const uploadedItems = list?.childElementCount;

        message.textContent = fileInput.multiple && uploadedItems >= 2 ? `파일 ${uploadedItems}개` : file.name; 
    },
    fileRemove: function (context, createdFile) {
        const { container, fileInput, message, placeholder, status, list } = context;
        const removeButton = createdFile.querySelector('button');

        removeButton.addEventListener('click', () => {
            createdFile.remove();
            container.classList.remove('file-uploader--fail');
            container.classList.add('file-uploader--success');

            message.textContent = list.childElementCount >= 1 ? `파일 ${list.childElementCount}개` : placeholder;

            if ( !list.childElementCount ) {
                container.classList.remove('file-uploader--success');
                fileInput.value = '';
                status.removeAttribute('aria-label');
            }
        });
    },
    /**
     * @param {string} elem : button
     */
    addForm_fileuploader: function (elem) {
        const originElem = elem.closest('.ui-clone-element');
        const maximum = elem.getAttribute('data-file-maximum')
        const originElemsParent = originElem.parentElement;
        const originElemsAll = originElemsParent.querySelectorAll('.ui-clone-element');

        if ( originElemsAll.length >= maximum ) {
            myDialgUI.customAlert(`최대 ${maximum}개까지만 추가할 수 있습니다.`);
            return;
        }

        /*
         cloneNode(true): 요소 자신과 모든 자식 요소 및 속성까지 그대로 복사됨.
         cloneNode(false): 요소 자신만 복사. (빈 껍데기 요소만 생성됨)
        */
        const clone = originElem.cloneNode(true); 
        const deleteBtn = clone.querySelector('.ui-col-delete');
       
        // 새로운 input ID 및 리셋
        const newInput = clone.querySelector('input[type="file"]');
        const newLabel = clone.querySelector('label[for]');
        /*
         new Date().getTime() : 현재 시간을 **밀리초(ms, 1/1000초 단위)**로 반환하는 JavaScript 메서드
         new Date() → 현재 날짜와 시간을 나타내는 Date 객체를 생성
         .getTime() → 1970년 1월 1일 00:00:00 UTC(유닉스 에포크)부터 현재까지의 시간을 **밀리초(ms)**로 반환
         보통 고유한 ID 생성이나 타임스탬프 비교 같은 곳에 사용
         Date.now(); 도 가능
        */
        const timestamp = new Date().getTime(); 
        const newId = `example-file-${timestamp}`
        newInput.id = newId;
        newInput.value = '';
        newLabel.setAttribute('for', newId);

        // 기존 엘리먼트 등 초기화
        const message = clone.querySelector('.file-message');
        const placeholder = message.getAttribute('data-file-placeholder');
        const uploaded = clone.querySelector('.file-uploaded');
        message.textContent = `${placeholder}`;
        uploaded && ( uploaded.innerHTML = '' ); // if ( uploaded ) uploaded.innerHTML = '';
        clone.classList.remove('file-uploader--fail', 'file-uploader--success');
        
        // 추가 버튼
        const addBtn = clone.querySelector('[data-js-behavior="addForm_file"]');

        if ( !deleteBtn ) {
            const createdButton = document.createElement('button');
            createdButton.type = 'button';
            createdButton.className = 'btn-icon btn-icon-rounded btn-icon-40 border-gray-500 ui-col-delete';
            createdButton.innerHTML = '<i class="icon icon-minus bg-gray-500" aria-label="Delete file"></i>';
            createdButton.setAttribute('onclick', 'myFormUI.removeForm(this)');
            clone.appendChild(createdButton);
            addBtn.parentNode.insertBefore(createdButton, addBtn.nextSibling);
        }
        
        originElem.parentNode.insertBefore(clone, originElem.nextSibling);
    },
    removeForm: function (elem) {
        const cloneElem = elem.closest('.ui-clone-element');
        const cloneParent = cloneElem.closest('tbody');

        if ( cloneParent ) {
            const getName = cloneElem.getAttribute('data-clone-element');
            const trAll = cloneParent.querySelectorAll(`[data-clone-element="${getName}"]`)
            const tdRow = trAll[0].querySelector('td[rowspan]');

            tdRow && tdRow.setAttribute('rowspan', trAll.length - 1);
        }
        
        cloneElem.remove();
    },
    /**
     * @param {string} elem 
     */
    addForm_inputs: function (elem) {
        const cloneTarget = elem.getAttribute('data-clone-target');
        const maximum = elem.getAttribute('data-clone-maximum');
        const originElem = document.querySelector(`[data-clone-element="${cloneTarget}"]`)
        const originElemsParent = originElem.parentElement;
        const originElemsAll = originElemsParent.querySelectorAll(`[data-clone-element="${cloneTarget}"]`);

        if ( originElemsAll.length >= maximum ) {
            myDialgUI.customAlert(`최대 ${maximum}개까지만 추가할 수 있습니다.`);
            return;
        }
        
        /*
         cloneNode(true): 요소 자신과 모든 자식 요소 및 속성까지 그대로 복사됨.
         cloneNode(false): 요소 자신만 복사. (빈 껍데기 요소만 생성됨)
        */
        const clone = originElem.cloneNode(true);  
        const btnColumn = clone.querySelector('.ui-clone-handler');
        const deleteBtn = btnColumn.querySelector('.ui-col-delete');

        // 새로운 input ID 및 리셋
        const newInputs = clone.querySelectorAll('input');
        for ( let i = 0; i < newInputs.length; i++ ) { 
            const num = originElemsAll.length + 1; // 현재 추가된 폼 개수 + 1을 새로운 폼의 번호로 사용
            const newId = `${cloneTarget}-0${num}-0${i + 1}`; // 각 폼 내 input의 고유한 ID 생성.
            const formCheck = newInputs[i].closest('.form-check');

            newInputs[i].id = newId;
            newInputs[i].value = '';
            newInputs[i].placeholder = `#${newId}`;

            if ( formCheck ) { 
                const label = formCheck.querySelector('label');
                // if ( label ) { label.setAttribute('for', newId); }
                label?.setAttribute('for', newId);
            }
        }

        const newNumber = clone.querySelectorAll('.ui-number');
        for ( let j = 0; j < newNumber.length; j++ ) { 
            const num = originElemsAll.length + 1; // 현재 추가된 폼 개수 + 1을 새로운 폼의 번호로 사용

            newNumber[j].textContent = `${num}`
        }

        if ( !deleteBtn ) {
            const createdButton = document.createElement('button');
            createdButton.type = 'button';
            createdButton.className = 'btn-icon btn-icon-rounded btn-icon-40 border-gray-500 ui-col-delete';
            createdButton.innerHTML = '<i class="icon icon-minus bg-gray-500" aria-label="Delete"></i>';
            createdButton.setAttribute('onclick', 'myFormUI.removeForm(this)');
            btnColumn.appendChild(createdButton);
        }

        if ( originElemsParent.tagName === 'TBODY' ) {
            const tdRow = originElem.querySelector('td[rowspan]');
            tdRow && tdRow.setAttribute('rowspan', originElemsAll.length + 1);
            
            clone.querySelectorAll('[rowspan]').forEach(td => td.remove());
            const lastElem = originElemsAll[originElemsAll.length - 1]; // 현재 마지막 요소 찾기
            
            lastElem.insertAdjacentElement('afterend', clone);
        } else {
            originElemsParent.appendChild(clone);
        }
    },
    /**
     * @param {*} input 
     */
    inputKey: function (input) {
        const clearBtn = input.nextElementSibling.querySelector('.ui-input-clear');

        if ( input.value.length > 0 ) {
            clearBtn.classList.add('ui-active');
        } else {
            clearBtn.classList.remove('ui-active');
        }
    },
    inputClear: function (btn) {
        const target = btn.getAttribute('data-input-target');
        const targetInput = document.querySelector(`#${target}`)

        targetInput.value = '';
        targetInput.focus();
        btn.classList.remove('ui-active');
    },
    togglePassword: function (btn) {
        const target = btn.getAttribute('data-toggle-target');
        const targetInput = document.querySelector(`#${target}`);
        const icon = btn.querySelector('.icon');

        if ( targetInput.type === 'password' ) {
            targetInput.type = 'text';
            icon.classList.replace('icon-eye', 'icon-eye-off'); 
        } else {
            targetInput.type = 'password';
            icon.classList.replace('icon-eye-off', 'icon-eye'); 
        }
    },
    updateQuantity: function (event, elem) {
       const input = elem.querySelector('input');
       const btnPlus = myUI.getTarget(event.target, 'ui-qty-plus');
       const btnMinus = myUI.getTarget(event.target, 'ui-qty-minus');
       const maximum = input.getAttribute('data-qty-maximum');

       if ( !btnPlus && !btnMinus ) return;

        const currentValue = parseInt(input.value, 10);
        const maxValue = parseInt(input.getAttribute('data-qty-maximum'), 10) || Infinity;
        const change = btnPlus ? 1 : -1; // 클릭한 버튼이 플러스인지 마이너스인지 판별
        const newValue = currentValue + change;

        if ( newValue >= 0 && newValue <= maxValue ) {
            input.value = newValue;
        }
    },
    validation: function (value, type, options) { // options = {}
        options = options || {};
        switch (type) {
            case 'string':
                return myFormUI.validateString(value, options.minLength);
            case 'number':
                return myFormUI.validateNumber(value, options.min, options.max);
            case 'email':
                return myFormUI.validateEmail(value);
            case 'password':
                return myFormUI.validatePassword(value, options.minLength);
            case 'checkbox':
                return myFormUI.validateCheckbox(options.selector);

            // case에 해당되지 않을 때 실행되는 부분.
            default: 
                // 잘못된 type 값이 들어왔을 때 바로 감지할 수 있게 실행.
                throw new Error('type 값 잘못됨');
        }
    },
    validateString: function (value, minLength = 1) {
        if (typeof value !== 'string') return false;
        // trim(): 문자열 앞뒤에 있는 공백(띄어쓰기, 개행, 탭 등)을 제거
        return value.trim().length >= minLength;
    },
    validateNumber: function (value, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
        /*
         min과 max를 설정한 이유: 사용자가 특정 범위를 설정하지 않을 경우, JavaScript에서 안전하게 다룰 수 있는 최소~최대값을 기본값으로 적용
         ↓↓ 안전하게 표현할 수 있는 정수 범위를 나타내는 상수
         min = Number.MIN_SAFE_INTEGER: (-90071.... 약 -9경) 자바스크립트에서 안전하게 표현할 수 있는 가장 작은 정수
         max = Number.MAX_SAFE_INTEGER: (90071.... 약 9경) 자바스크립트에서 안전하게 표현할 수 있는 가장 큰 정수
         JavaScript의 Number 타입은 64비트 부동소수점 숫자를 사용하지만, 그중 안전한 정수 범위는 -(2^53 - 1) ~ (2^53 - 1)(약 ±9경)까지만 정확하게 표현할 수 있다.
         안전한 정수 범위를 벗어나면 이상한 값(오류 발생)이 나올 수 있기 때문에 쓴다.
        */
        const number = parseFloat(value);
        if (isNaN(number)) return false;
        return number >= min && number <= max;
    },
    validateEmail: function (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
    validatePassword: function (value, minLength = 4) {
        if (typeof value !== 'string') return false;
        return value.length >= minLength;
    },
    validateCheckbox: function (input) {
        const checkbox = document.querySelector(input);
        return checkbox && checkbox.checked; // 체크가 되면 true 반환
    },
    validateKorean: function (value) {
        const koreanRegex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
        return koreanRegex.test(value);
    },
    validateMessage: function (input, message) {
        const form = document.querySelector(input);
        if (!form) return;
        const parent = form.parentElement;
        const messageElem = parent.querySelector('.form-valid-message')

        form.focus();
        parent.classList.add('ui-form-error')
        messageElem.textContent = message;
    },
    validateMessage_reset: function (input) {
        const inputField = document.querySelector(input);
        if ( !inputField ) return;

        // 요소의 value가 바뀔 때 발생
        inputField.addEventListener('input', function () {
            const parent = inputField.parentElement;
            parent.classList.remove('ui-form-error'); 

            const messageElem = parent.querySelector('.form-valid-message');
            if (messageElem) messageElem.textContent = '';
        });
    },
    textareaCount: function (id) {
        const textarea = document.getElementById(id);
        const maxLength = parseInt(textarea.getAttribute('maxlength'), 10);
        const count = textarea.nextElementSibling.querySelector('.length');
        const updateCounter = function() {
            myFormUI.textareaUpdate(textarea, maxLength, count);
        };
        /*
         -함수를 변수에 넣기
         const updateCounter = myFormUI.textareaUpdate(textarea, maxLength, count);
         이렇게 한다면: updateCounter에 함수 결과가 할당, 그러나 textareaUpdate 함수는
         반환값을 주는 함수가 아니기 때문에 undefined에 해당. 호출시 오류가 발생하게 된다!
        */

        textarea.addEventListener('input', updateCounter);
        // 초기 카운트 설정
        updateCounter(); 

        // 새로고침 시 placeholder 문제 해결
        if ( !textarea.value.trim() ) {
            textarea.value = '';
        }
    },
    textareaUpdate: function (elem, maxLength, count) {
        const textLength = elem.value.length;

        count.textContent = textLength > maxLength ? maxLength : textLength;
    },
    textareaClear: function (id) {
        const textarea = document.getElementById(id);

        textarea.value = '';
        myFormUI.textareaUpdate(textarea, textarea.maxLength, textarea.nextElementSibling.querySelector('.length'));

        // 삭제 후 커서 위치 조정 (placeholder 표시를 위해 blur 적용)
        /*
         브라우저는 페이지 로드 후 자동으로 마지막 커서 위치를 기억하려는 특성이 있음.
         만약 textarea.value를 변경하면, 커서 위치가 마지막으로 설정된 곳으로 돌아가게 됨.
         textarea.value를 빈 문자열로 바꾸면, 커서가 기본적으로 맨 앞에 가야 하는데, 
         특정 조건에서는 중간이나 마지막 위치로 가는 버그가 발생할 수 있음.
         브라우저가 textarea를 "입력된 상태"로 인식해서 placeholder가 사라질 수 있음.
        */
        textarea.blur();
        setTimeout(() => textarea.setSelectionRange(0, 0), 0); // 커서를 맨 앞으로 이동
    },
    /** 
     * [ radioTab ]
     * input(radio) 탭 이벤트
     */
    formTabActiveClass : `formTab-${myUI.activeClass}`,
    radioTab: function (btn, index) {
        const tagType = btn.tagName;
        const tabName = btn.getAttribute('name');
        const tabButtons = document.querySelectorAll(`[name="${tabName}"]`);
        const tabContainer = document.querySelector(`[data-form-tab="${tabName}"]`);
        const tabPanels = tabContainer.querySelectorAll('.form-tab-panel');

        tabPanels.forEach(panel => panel.classList.remove(myFormUI.formTabActiveClass));

        if ( !tabButtons[index].checked ) { return; }

        tabPanels[index].classList.add(myFormUI.formTabActiveClass);
    },
    /** 
     * [ selectTab ]
     *  SELECT 선택시 탭 이벤트
     */
    selectTab: function (select) {
        const tabName = select.getAttribute('id');
        const tabContainer = document.querySelector(`[data-form-tab="${tabName}"]`);
        const tabPanels = tabContainer.querySelectorAll('.form-tab-panel');

        // const selectedIndex = select.selectedIndex; // <- 필터링없이 선택요소 인덱스 찾음
        // <option> 요소만 필터링하여 순수한 옵션 인덱스 찾기
        const options = [...select.querySelectorAll('option')];
        const selectedOption = select.options[select.selectedIndex];
        const optionIndex = options.indexOf(selectedOption); // 정확한 인덱스 찾기

        tabPanels.forEach(panel => panel.classList.remove(myFormUI.formTabActiveClass));

        if ( tabPanels[optionIndex] ) {
            tabPanels[optionIndex].classList.add(myFormUI.formTabActiveClass);
        }
    },
    /** 
     * [ formTab ]
     *  input(radio), SELECT 선택시 탭 이벤트
     */
    formTab: function (elem, index) {
        const isSelect = elem.tagName === 'SELECT';
        const tabName = isSelect ? elem.getAttribute('id') : elem.getAttribute('name');
        // [elem] (배열 형태)로 저장하여 querySelectorAll()과 일관성을 유지.
        const tabButtons = isSelect ? [elem] : document.querySelectorAll(`[name="${tabName}"]`)
        const tabContainer = document.querySelector(`[data-form-tab="${tabName}"]`);
        const tabPanels = tabContainer.querySelectorAll('.form-tab-panel');
        let tabIndex;

        if ( !isSelect ) {
            const checkedButton = [...tabButtons].find(button => button.checked);
            if (!checkedButton) return; // 체크된 버튼이 없으면 종료
            index = [...tabButtons].indexOf(checkedButton); // 체크된 버튼의 인덱스 찾기
            tabIndex = index;
        } else {
            // const selectedIndex = select.selectedIndex; // <- 필터링없이 선택요소 인덱스 찾음
            // <option> 요소만 필터링하여 순수한 옵션 인덱스 찾기
            const options = [...elem.querySelectorAll('option')];
            const selectedOption = elem.options[elem.selectedIndex];
            tabIndex = options.indexOf(selectedOption); // 정확한 인덱스 찾기
        }

        tabPanels.forEach(panel => panel.classList.remove(myFormUI.formTabActiveClass));

        // 선택된 인덱스의 탭 활성화
        if ( tabPanels[tabIndex] ) {
            tabPanels[tabIndex].classList.add(myFormUI.formTabActiveClass);
        }
    },
    /** 
     * [ multipleTab ]
     * input(radio), button, a 클릭시 탭 이벤트
     */
    multipleTab: function (btn, index, parent, className) {
        /* - instanceof HTMLElement 
         parent가 HTMLElement인지 체크해서, DOM 요소가 맞을 때만 사용.
         parent가 undefined, null, 혹은 잘못된 값일 경우 document를 기본값으로 설정.
         document는 항상 존재하는 루트 요소이므로 안전한 기본값이 됨.
        */
        const tabNav = parent instanceof HTMLElement ? parent : document;
        /* - 일반 조건문 
         let tabName;
         if ( className !== undefined ) { tabName = btn.classList.contains(className) ? className : '' }
         else { tabName = btn.getAttribute('name') }
        */
        const tabName = className !== undefined 
                ? (btn.classList.contains(className) ? className : '') 
                : btn.getAttribute('name');
        // tabButtons을 찾는 과정에서 className이 undefined면 빈 배열을 반환함
        const tabButtons = tabNav.querySelectorAll(`[name="${tabName}"]`).length 
                ? tabNav.querySelectorAll(`[name="${tabName}"]`) 
                : (className ? tabNav.querySelectorAll(`.${className}`) : []);
        const tabContainer = document.querySelector(`[data-form-tab="${tabName}"]`);
        const tabPanels = tabContainer.querySelectorAll('.form-tab-panel');

        tabPanels.forEach(panel => panel.classList.remove(myFormUI.formTabActiveClass));

        if ( tabButtons[index] && tabButtons[index].disabled ) { return; }

        tabPanels[index].classList.add(myFormUI.formTabActiveClass);

        console.log(tabNav)
    },
    _getNameOrClass: function (btn, className) {
        return btn.getAttribute('name') || (btn.classList.contains(className) ? className : '');
        
        // 지정한 클래스명 (className) 으로 시작하는 단어를 모두 포함하기
        // return btn.getAttribute('name') || Array.from(btn.classList).find(cls => cls.startsWith(className)) || '';
    },
    selectedOutput: function (select) {
        const output = select.nextElementSibling.querySelector('.selected-output');
        const selectedValues = Array.from(select.selectedOptions).map(option => option.text); // 선택된 옵션 값 가져오기

        // 화면에 표시
        output.textContent = selectedValues.length > 0 ? `${selectedValues.join(', ')}` : '없음';
    },
    /**
     * 
     */
    progressbar: function (elem) {
        const statusBar = elem;
        const percent = statusBar.getAttribute('aria-valuenow');
        const max = statusBar.getAttribute('aria-valuemax');
        const finalPercent = myUI.getSafePercent(percent, max)

        // 초기화
        statusBar.style.width = '0';
        
        /*
         왜 2번 rAF인가?
         첫 rAF는 초기 width 적용 (0)을 인식하게 하고, 
         두 번째 rAF는 transition 적용할 시점 확보 → 브라우저가 변화를 인식하고 부드럽게 트랜지션함
        */
        // 다음 두 프레임 후 width 설정 (transition 유도)
        requestAnimationFrame(() => {
            // 리플로우 대체: transition 적용 전 frame 보장
            requestAnimationFrame(() => {
                statusBar.style.width = `${Math.floor(finalPercent)}%`;
            });
        });

        const bubble = statusBar.querySelector('.speech-bubble');
        const btn = statusBar.querySelector('.progress-tooltip-marker');

        statusBar.addEventListener('transitionend', () => {
            bubble && bubble.classList.remove('opacity-0') 
            btn && myDialgUI.tooltipInit(btn); 
        });
    },
    /**
     * myFormUI.progressbar 에만 적용된 함수
     * common_ui.js에 재사용 가능한 유틸 함수로 다시 만듦 (myUI.observeElements)
     */
    _progressBarObserver: function () {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    myFormUI.progressbar(entry.target);
                    observer.unobserve(entry.target); // 한 번만 실행
                }
            });
        }, { threshold: 0.4 }); // 요소가 40% 이상 보여야 실행
    
        // 모든 progress bar 관찰
        document.querySelectorAll('[data-js-behavior="progressbar"]').forEach(bar => {
            observer.observe(bar);
        });
    },
    /**
     * void 강제 리플로우 사용하는 함수. (미사용)
     */
    _progressbar: function (elem) {
        const statusBar = elem;
        const percent = statusBar.getAttribute('aria-valuenow');
        const max = statusBar.getAttribute('aria-valuemax');
        const bubble = statusBar.querySelector('.speech-bubble')

        // 초기화
        statusBar.style.width = '0';

        /*
         js에서 void는 값을 평가하지만, 그 결과를 무시하고 undefined를 반환한다. 일종의 트릭같은 역할을 함.
         offsetWidth와 같은 dom속성을 읽는 순간, 브라우저는 강제로 스타일 계산(리플로우)을 하게 된다
         (리플로우: DOM 요소의 스타일/레이아웃이 변경될 때, 브라우저가 화면 전체 혹은 일부의 레이아웃을 다시 계산하는 과정)
         강제성이 있고, DOM 트리 복잡할수록 reflow는 렌더링 성능에 부담을 줄 수 있으므로, 루프 안에서는 절대로 리플로우 유발하지 말아야 한다!
         한 번만 쓰고 끝나는 초기 애니메이션에 적절함.
        */
        void statusBar.offsetWidth; // 리플로우 강제 발생
        statusBar.style.width = `${Math.floor(percent)}%`; // 브라우저가 변화로 인식함

        statusBar.addEventListener('transitionend', () => {
            bubble.classList.remove('opacity-0')
        });
    },
    /**
     * @param {string} elem 
     */
    progressCircle: function (elem) {
        /*
         const valuenow = elem?.getAttribute('aria-valuenow') || elem.getAttribute('data-progress-now');
         ↑↑ 이것도 맞지만,  aria-valuenow="0"처럼 "0"이 있을 경우, || 에 의해 무시될 수 있음
         ("0"은 truthy지만, 0 숫자라면 falsy)
        */
        const valuenow = elem?.getAttribute('aria-valuenow');
        const valuemax = elem?.getAttribute('aria-valuemax') ?? '100';
        const nowAttr = valuenow ?? elem?.getAttribute('data-progress-now') ?? '0';
        let progressNow = parseFloat(nowAttr); // 사전에 명확히 숫자로 변환하는 게 안정성 높음
        let progressPrev = parseFloat(elem?.getAttribute('data-progress-prev') ?? '0');
        let progressMax = parseFloat(valuemax);

        if ( isNaN(progressNow) ) progressNow = 0; // isNaN() : 입력값이 숫자가 아닐 가능성 대비
        progressNow = Math.min(progressNow, progressMax); // 최대값 오버 방지

        if ( isNaN(progressPrev) ) progressPrev = 0;
        progressPrev = Math.min(progressPrev, 100);

        const dashArray = elem.querySelector('.circle-trail').getTotalLength();
        const currentCircle = elem.querySelector('.circle-current');
        const prevCircle = elem?.querySelector('.circle-prev');
        const info = elem.querySelector('.progress-circle-info');

        currentCircle.style.strokeDashoffset = dashArray;
        if ( prevCircle ) { prevCircle.style.strokeDashoffset = dashArray; }

        // 현재상태만
        const singleProgress = () => {
            if ( progressNow <= 0 ) {
                currentCircle.classList.remove('circle-current')
                info.textContent = '0%'
            } else {
                const currentOffset = myFormUI.circleCalculator(progressNow, dashArray);
                
                currentCircle.style.strokeDashoffset = `${currentOffset}`
                info.textContent = `${Math.floor(progressNow)}%`
            }
        }

        // prev 포함
        const progressWithPrev = () => {
            const totalRaw = progressNow + progressPrev
            const subtr = totalRaw - progressNow;
            const totalOffset = myFormUI.circleCalculator(totalRaw, dashArray);
            const prevOffset = myFormUI.circleCalculator(subtr, dashArray);
            
            currentCircle.style.strokeDashoffset = `${totalOffset}`
            prevCircle.style.strokeDashoffset = `${prevOffset}`;
            info.textContent = `${Math.floor(totalRaw)}%`
        }

        if ( !elem?.hasAttribute('data-progress-prev') ) {
            singleProgress();
        } else {
            progressWithPrev();
        }

    },
    circleCalculator: function (num, total) {
        const currentValue = 1 - (num / 100);
        const current = total * currentValue;

        return current;
    },

}