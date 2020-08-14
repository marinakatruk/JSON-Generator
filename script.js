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
const fields = form.querySelectorAll('.form__input');
const blocks = form.querySelectorAll('.form__block');
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
    innerFields.forEach(field => field.value = '');
};

const formBlockToHide = blocks[1];

plusButton.onclick = () => {
    hiddenClassToggle(form, img);
    hiddenClassToggle(formBlockToHide, innerObject);
    makeKeyFieldActive();
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
    const lettersAndNumbers = /^[0-9a-zA-Z]+$/;
    if (innerObject.classList.contains('hidden')) {
        for (let i = 0; i < fields.length; i += 1) {
            let length = fields[i].value.length;
            if (!fields[i].value) {
                let error = generateError('Cannot be blank');
                blocks[i].append(error);
                valid = false;
            } else if (length > 12) {
                let error = generateError('Cannot be more than 12 symbols');
                blocks[i].append(error);
                valid = false;
            } else if (!fields[i].value.match(lettersAndNumbers)) {
                let error = generateError('Must contain only letters or numbers');
                blocks[i].append(error);
                valid = false;
            }
        }

    } else {
        let length = fields[0].value.length;
        if (!fields[0].value) {
            let error = generateError('Cannot be blank');
            blocks[0].append(error);
            valid = false;
        } else if (length > 12) {
            let error = generateError('Cannot be more than 12 symbols');
            blocks[0].append(error);
            valid = false;
        } else if (!fields[0].value.match(lettersAndNumbers)) {
            let error = generateError('Must contain only letters or numbers');
            blocks[0].append(error);
            valid = false;
        }
        for (let i = 0; i < innerFields.length; i += 1) {
            let innerLength = innerFields[i].value.length;
            if (!innerFields[i].value) {
                let error = generateError('Cannot be blank');
                innerBlocks[i].append(error);
                valid = false;
            } else if (innerLength > 12) {
                let error = generateError('Cannot be more than 12 symbols');
                innerBlocks[i].append(error);
                valid = false;
            } else if (!innerFields[i].value.match(lettersAndNumbers)) {
                let error = generateError('Must contain only letters or numbers');
                innerBlocks[i].append(error);
                valid = false;
            }
        }
    }
    return valid;
};

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

//добавить свойство в итоговое поле
const addPropertyString = () => {

    const addMarginLeft = (elemToAdd, elemToTake) => {
        let marginValue = elemToTake.firstElementChild.offsetWidth + 'px';
        elemToAdd.style.marginLeft = marginValue;
    }

    if (form.key.hasAttribute('disabled')) {
        const innerProp = generateProperty(innerKey, innerValue);
        const firstLevelKeyElems = result.querySelectorAll('.firstlevel');
        for (let elem of firstLevelKeyElems) {
            if (elem.dataset.key === form.key.value) {
                const plusOfElem = elem.querySelector('.plus');
                plusOfElem.before(innerProp);
                addMarginLeft(innerProp, elem);
                const innerMinusButton = createMinusButton();
                innerProp.append(innerMinusButton);
            }
        }
    
    } else if (!innerObject.classList.contains('hidden')) {
        const newKey = document.createElement('div');
        newKey.className = 'property firstlevel';
        newKey.setAttribute('data-key', form.key.value);
        newKey.innerHTML = `"<span>${form.key.value}" : {</span>`;
        plusButton.before(newKey);
        
        const minusButton = createMinusButton();
        newKey.append(minusButton);
        
        const innerProp = generateProperty(innerKey, innerValue);
        newKey.append(innerProp);
          
        addMarginLeft(innerProp, newKey);
        
        const innerMinusButton = createMinusButton();
        innerProp.append(innerMinusButton);

        const innerPlusButton = document.createElement('div');
        innerPlusButton.className = 'result__button plus';
        addMarginLeft(innerPlusButton, newKey);
        innerPlusButton.innerHTML = '+';
        newKey.append(innerPlusButton);
        
        const closingBrace = document.createElement('div');
        closingBrace.innerHTML = '}';
        newKey.append(closingBrace);
        addMarginLeft(closingBrace, newKey);
        
    } else {

        const newProp = generateProperty(form.key, form.value);
        plusButton.before(newProp);
        const minusButton = createMinusButton();
        newProp.append(minusButton);
    }
};

const newObject = {};

//валидация - проверка ключа
const checkKeyNotDoubled = () => {
    let valid = true;
    if (form.key.hasAttribute('disabled')) {
        const objectForCheck = newObject[form.key.value];
        const innerObjectKeys = Object.keys(objectForCheck);
        if (innerObjectKeys.includes(innerKey.value)) {
            let error = generateError('This key already exists');
            innerBlocks[0].append(error);
            valid = false; 
        }
    } else {
        const objectKeys = Object.keys(newObject);
        if (objectKeys.includes(form.key.value) && !form.key.hasAttribute('disabled')) {
            let error = generateError('This key already exists');
            blocks[0].append(error);
            valid = false;
        }
    }
    return valid;
};


//добавить свойство в объект
const AddPropertyToObject = () => {
    const newKey = form.key.value;
    const newValue = form.value.value;
    
    if (form.key.hasAttribute('disabled')) {
        ifValueIsNum(newObject[newKey], innerKey.value, innerValue.value);

    } else if (!innerObject.classList.contains('hidden')) {
        const propObject = {};
        ifValueIsNum(propObject, innerKey.value, innerValue.value);
        newObject[String(newKey)] = propObject;

    } else {
        ifValueIsNum(newObject, newKey, newValue);
    }

    console.log(newObject);
};

const ifValueIsNum = (object, key, value) => {
    if (isNaN(Number(value))) {
        object[String(key)] = value;
    } else {
    object[String(key)] = Number(value);
    }  
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
    }

    
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

//активировать поле ключ
const makeKeyFieldActive = () => {
    if (form.key.hasAttribute('disabled')) {
        form.key.removeAttribute('disabled');
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

    makeKeyFieldActive();

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
    hiddenClassToggle(innerObject, formBlockToHide);

    let currentKey = innerPlus.parentNode.dataset.key;
    form.key.value = currentKey;
    form.key.setAttribute('disabled', 'disabled');

});

const cancelButton = form.elements.cancel;

//кнопка отмена
cancelButton.onclick = () => {
    clearAllFields();
    makeKeyFieldActive();
    removeValidation();
    hiddenClassToggle(formBlockToHide,innerObject);
    hiddenClassToggle(img, form);
};


//скачать итоговый объект в виде файла
downloadButton.onclick = (event) => {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newObject, null, 4));
    let target = event.target;
    target.setAttribute("href", dataStr);
    target.setAttribute("download", "object.json");
};







