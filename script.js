const result = document.getElementById('result');
const plusButton = document.getElementById('plus');
const minusButton = document.getElementById('minus');
const resultObject = document.getElementById('object');
const form = document.forms.form;
const img = document.getElementById('img');
const downloadButton = document.getElementById('download');
const valueButton = document.getElementById('value-button');
const innerObject = document.getElementById('inner-object');

const addButton = form.elements.addbutton;
const fields = form.querySelectorAll('.generator__input');
const blocks = form.querySelectorAll('.generator__block');
const innerFields = form.querySelectorAll('.inner__input');
const innerBlocks = form.querySelectorAll('.inner__block');


//показать/скрыть элемент(форма и картинка)
const hiddenClassToggle = (RemoveClass, AddClass) => {
    if (RemoveClass.classList.contains('hidden')) {
        AddClass.classList.add('hidden');
        RemoveClass.classList.remove('hidden');
    }
};

//очистить все поля
const clearAllFields = () => {
    fields.forEach(field => field.value = '');
};

const formBlockToHide = blocks[1];

plusButton.onclick = () => {
    hiddenClassToggle(form, img);
    hiddenClassToggle(formBlockToHide, innerObject);
    clearAllFields();
}

valueButton.onclick = () => {
    hiddenClassToggle(innerObject, formBlockToHide);
};


//сообщение об ошибке при заполнении
const generateError = (text) => {
    let error = document.createElement('div');
    error.className = 'error';
    error.innerHTML = text;
    return error;
};

//очистить все имеющиеся сообщения об ошибке
const removeValidation = () => {
    let errors = form.querySelectorAll('.error');
    for (let i = 0; i < errors.length; i += 1) {
        errors[i].remove();
    }
};

//валидация - все поля заполнены, максимальное кол-во символов
const checkFieldsValidation = () => {

    let valid = true;

    for (let i = 0; i < fields.length; i += 1) {
        if (!fields[i].value && fields[i].offsetWidth > 0) {
            let error = generateError('Cannot be blank');
            blocks[i].append(error);
            valid = false;
        }
    }

    for (let i = 0; i < fields.length; i += 1) {
        let length = fields[i].value.length;
        if (fields[i].hasAttribute('key') && length > 12) {
            if (!blocks[i].querySelector('.error')) {
                let error = generateError('Cannot be more than 12 symbols');
                blocks[i].append(error);
                valid = false;
            }

        } else if (fields[i].hasAttribute('value') && length > 150) {
            if (!blocks[i].querySelector('.error')) {
                let error = generateError('Cannot be more than 150 symbols');
                blocks[i].append(error);
                valid = false;
            }
        }
    }

    const lettersAndNumbers = /^[0-9a-zA-Z]+$/;
    for (let i = 0; i < fields.length; i += 1) {
        if (fields[i].hasAttribute('key') && !fields[i].value.match(lettersAndNumbers) && fields[i].offsetWidth > 0) {
            if (!blocks[i].querySelector('.error')) {
                let error = generateError('Must contain only letters or numbers');
                blocks[i].append(error);
                valid = false;
            }
        }
    }
    console.log(valid);
    return valid;
};

// const ifErrorShouldBeAdded = (n, errorText) => {
//     if (!blocks[n].querySelector('.error')) {
//         let error = generateError(errorText);
//         blocks[n].append(error);
//         return false;
//     }
//     return true;
// };

const innerKey = document.getElementById('inner-key');
const innerValue = document.getElementById('inner-value');

//создать строку-свойство для добавления в итоговое поле
const generateProperty = (key, value) => {
    let elem = document.createElement('div');
    elem.className = 'property';
    elem.setAttribute('data-key', key.value);
    if (isNaN(Number(value.value))) {
        elem.innerHTML = `<span>"${key.value}"</span> : <span>"${value.value}"</span>,`;
    } else {
        elem.innerHTML = `<span>"${key.value}"</span> :  <span>${value.value}</span>,`;
    }
    return elem;
};

//создать кнопку минус
const createMinusButton = () => {
    let button = document.createElement('div');
    button.className = 'result__button minus';
    button.innerHTML = '-';
    return button;
};

const createInnerPlusButton = (parentElem) => {
    const plusElem = document.createElement('div');
    plusElem.className = 'result__button plus';
    addMarginLeft(plusElem, parentElem);
    plusElem.innerHTML = '+';
    return plusElem;
};

const createClosingBrace = (parentElem) => {
    const brace = document.createElement('div');
    brace.innerHTML = '}';
    addMarginLeft(brace, parentElem);
    return brace;
};

const createFirstLevelKey = () => {
    const keyElem = document.createElement('div');
    keyElem.className = 'property firstlevel';
    keyElem.setAttribute('data-key', form.key.value);
    keyElem.innerHTML = `"<span>${form.key.value}" : {</span>`;
    return keyElem;
};

const addMarginLeft = (elemToAdd, elemToTake) => {
    let marginValue = elemToTake.firstElementChild.offsetWidth + 'px';
    elemToAdd.style.marginLeft = marginValue;
};

const findPlusChild = (parentElem) => {
    let plusChild;
    const chosenChildElems = parentElem.children;
    for (let elem of chosenChildElems) {
        if (elem.classList.contains('plus')) {
            plusChild = elem;
        }
    }
    return plusChild;
};

//добавить свойство в итоговое поле
const addPropertyString = () => {

    const newProp = generateProperty(form.key, form.value);
    const propParent = result.querySelector('.chosen');

    if (!propParent) {
        if (!innerObject.classList.contains('hidden')) {
            const newKey = createFirstLevelKey();
            plusButton.before(newKey); 

            const minusButton = createMinusButton();
            newKey.append(minusButton);

            const innerProp = generateProperty(innerKey, innerValue);
            newKey.append(innerProp);
            addMarginLeft(innerProp, newKey);
            
            const innerMinusButton = createMinusButton();
            innerProp.append(innerMinusButton);

            const innerPlusButton = createInnerPlusButton(newKey);
            newKey.append(innerPlusButton);

            const closingBrace = createClosingBrace(newKey);
            newKey.append(closingBrace);
        } else {
            plusButton.before(newProp);
            const minusButton = createMinusButton();
            newProp.append(minusButton);
        }
    } else {
        
        const plusOfParent = findPlusChild(propParent);

        if (!innerObject.classList.contains('hidden')) {
            const newKey = createFirstLevelKey();
            plusOfParent.before(newKey);
            addMarginLeft(newKey, propParent);

            const minusButton = createMinusButton();
            newKey.append(minusButton);

            const innerProp = generateProperty(innerKey, innerValue);
            newKey.append(innerProp);
            addMarginLeft(innerProp, newKey);

            const innerMinusButton = createMinusButton();
            innerProp.append(innerMinusButton);

            const innerPlusButton = createInnerPlusButton(newKey);
            newKey.append(innerPlusButton);

            const closingBrace = createClosingBrace(newKey);
            newKey.append(closingBrace);
        } else {
            plusOfParent.before(newProp);
            addMarginLeft(newProp, propParent);
            const innerMinusButton = createMinusButton();
            newProp.append(innerMinusButton);
        }
    }
};

const newObject = {};


//валидация - проверка ключа
const checkKeyNotDoubled = () => {
    let valid = true;
    const firstKey = form.key.value;
    const secondKey = innerKey.value;
    if (newObject.hasOwnProperty(firstKey)) {
        let error = generateError('This key already exists');
        form.key.parentNode.append(error);
        valid = false;
    }

    if (newObject.hasOwnProperty(firstKey.secondKey) && innerKey.offsetWidth > 0) {
        let error = generateError('This key already exists');
        innerKey.parentNode.append(error);
        valid = false;
    }

    // if (form.key.hasAttribute('disabled')) {
    //     const objectForCheck = newObject[form.key.value];
    //     const innerObjectKeys = Object.keys(objectForCheck);
    //     if (innerObjectKeys.includes(innerKey.value)) {
    //         let error = generateError('This key already exists');
    //         innerBlocks[0].append(error);
    //         valid = false; 
    //     }
    // } else {
    //     const objectKeys = Object.keys(newObject);
    //     if (objectKeys.includes(form.key.value) && !form.key.hasAttribute('disabled')) {
    //         let error = generateError('This key already exists');
    //         blocks[0].append(error);
    //         valid = false;
    //     }
    // }
    return valid;
};


//добавить свойство в объект
const AddPropertyToObject = () => {
    const propParent = result.querySelector('.chosen');
    
    const newKey = form.key.value;
    const newValue = form.value.value;

    if (!propParent) {
    
        if (!innerObject.classList.contains('hidden')) {
            const propObject = {};
            ifValueIsNum(propObject, innerKey.value, innerValue.value);
            newObject[String(newKey)] = propObject;

        } else {
            ifValueIsNum(newObject, newKey, newValue);
        }

    } else {

        if (!innerObject.classList.contains('hidden')) {
            const propObject = {};
            ifValueIsNum(propObject, innerKey.value, innerValue.value);
            const propString = getParentsDataset(propParent);
            console.log(propString);
            // newObject[propString][String(newKey)] = propObject;

        } else {
        
            const propString = getParentsDataset(propParent);
            // newObject[propString][String(newKey)] = newValue;
            
        }
    }

};

const ifValueIsNum = (object, key, value) => {
    if (isNaN(Number(value))) {
        object[String(key)] = value;
    } else {
    object[String(key)] = Number(value);
    }  
};

const getParentsDataset = (elem) => {
    let result = [];
    for (let i = elem; i.classList.contains('property'); i = i.parentNode) {
        result.push(i.dataset.key);
    }
    return result.join('.');
};


//обработчик на отправку формы
form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    removeValidation();

    if (checkFieldsValidation() && checkKeyNotDoubled()) {
       
        AddPropertyToObject();

        addPropertyString();

        clearAllFields();

        hiddenClassToggle(img, form);
        hiddenClassToggle(formBlockToHide, innerObject);

        if (downloadButton.classList.contains('hidden')) {
            downloadButton.classList.remove('hidden');
        }

        removeChosen();
    }
    console.log(newObject);

});

//убрать кнопку download
const hideDownloadButton = () => {
    const properties = Object.keys(newObject);
    if (properties.length === 0) {
        if (!downloadButton.classList.contains('hidden')) {
            downloadButton.classList.add('hidden');
        }
    }
};


//удалить последнее свойство из окна, из объекта
result.addEventListener('click', (event) => {
    let minus = event.target;
    if (!minus.classList.contains('minus')) return;

    const minusParentOfParent = minus.parentNode.parentNode;
    if (!minusParentOfParent.hasAttribute('data-key')) {
        const keyToDelete = minus.parentNode.dataset.key;
        delete newObject[keyToDelete];
    } else {
        const outerKeyToDelete = minusParentOfParent.dataset.key;
        const innerKeyToDelete = minus.parentNode.dataset.key;
        delete newObject[outerKeyToDelete][innerKeyToDelete];
    }

    minus.parentNode.remove();

    clearAllFields();

    hiddenClassToggle(img, form);
    hiddenClassToggle(formBlockToHide, innerObject);

    hideDownloadButton();
    console.log(newObject);
});

//открыть форму для добавления внутреннего свойства
result.addEventListener('click', (event) => {
    let innerPlus = event.target;
    if (!innerPlus.classList.contains('plus')) return;

    hiddenClassToggle(form, img);
    
    innerPlus.parentNode.classList.add('chosen');
});

const cancelButton = form.elements.cancel;

//кнопка отмена
cancelButton.onclick = () => {
    clearAllFields();
    removeValidation();
    hiddenClassToggle(formBlockToHide,innerObject);
    hiddenClassToggle(img, form);
    removeChosen();
};

const removeChosen = () => {
    const chosen = result.querySelector('.chosen');
    if (chosen) {
        chosen.classList.remove('chosen');
    }
};


//скачать итоговый объект в виде файла
downloadButton.onclick = (event) => {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newObject, null, 4));
    let target = event.target;
    target.setAttribute("href", dataStr);
    target.setAttribute("download", "object.json");
};







