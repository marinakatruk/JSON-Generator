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

plusButton.onclick = () => hiddenClassToggle(form, img);

const formBlockToHide = blocks[1];

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

// const checkAllFields = (fields, blocks, n) => {
//     const lettersAndNumbers = /^[0-9a-zA-Z]+$/;
//     let length = fields[n].value.length;
//     let valid;
//     if (!fields[n].value) {
//         let error = generateError('Cannot be blank');
//         blocks[n].append(error);
//         valid = false;
//     } else if (length > 12) {
//         let error = generateError('Cannot be more than 12 symbols');
//         blocks[n].append(error);
//         valid = false;
//     } else if (!fields[n].value.match(lettersAndNumbers)) {
//         let error = generateError('Must contain only letters or numbers');
//         blocks[n].append(error);
//         valid = false;
//     }
//     return valid;
// };

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

const generateProperty = (key, value) => {
    let elem = document.createElement('div');
    elem.className = 'property';
    elem.setAttribute('data-key', key.value);
    elem.innerHTML = `<span>"${key.value}"</span> : <span>"${value.value}"</span>,`;
    return elem;
};

const createMinusButton = () => {
    let button = document.createElement('div');
    button.className = 'result__button minus';
    button.innerHTML = '-';
    return button;
};

//добавить свойство в итоговое поле
const addPropertyString = () => {
    if (innerObject.classList.contains('hidden')) {
        const newProp = generateProperty(form.key, form.value);
        plusButton.before(newProp);
        const minusButton = createMinusButton();
        newProp.append(minusButton);
    
    } else {
        const newKey = document.createElement('div');
        newKey.className = 'property';
        newKey.setAttribute('data-key', form.key.value);
        newKey.innerHTML = `"<span>${form.key.value}" : {</span>`;
        plusButton.before(newKey);
        
        const minusButton = createMinusButton();
        newKey.append(minusButton);
        
        const innerProp = generateProperty(innerKey, innerValue);
        newKey.append(innerProp);
        innerProp.style.marginLeft = newKey.firstElementChild.offsetWidth + 'px';
        
        const innerMinusButton = createMinusButton();
        innerProp.append(innerMinusButton);

        const innerPlusButton = document.createElement('div');
        innerPlusButton.className = 'result__button';
        innerPlusButton.style.marginLeft = newKey.firstElementChild.offsetWidth + 'px';
        innerPlusButton.setAttribute('id', 'inner-plus');
        innerPlusButton.innerHTML = '+';
        newKey.append(innerPlusButton);
        
        const closingBrace = document.createElement('div');
        closingBrace.innerHTML = '}';
        newKey.append(closingBrace);
        closingBrace.style.marginLeft = newKey.firstElementChild.offsetWidth + 'px';

    }
};

const newObject = {};

//валидация - проверка ключа
const checkKeyNotDoubled = (key) => {
    let valid = true;
    const objectKeys = Object.keys(newObject);
    if (objectKeys.includes(key)) {
        let error = generateError('This key already exists');
        blocks[0].append(error);
        valid = false;
    }
    return valid;
};


//добавить свойство в объект
const AddPropertyToObject = () => {
    const newKey = form.key.value;
    const newValue = form.value.value;
    if (innerObject.classList.contains('hidden')) {
        if (typeof newKey === 'number') {
            newObject[String(newKey)] = newValue;
        }
        newObject[newKey] = newValue;
    }
    else {
        const propObject = {};
        if (typeof innerKey.value === 'number') {
            propObject[String(innerKey.value)] = innerValue.value;
        }
        propObject[innerKey.value] = innerValue.value;

        if (typeof newKey === 'number') {
            newObject[String(newKey)] = propObject;
        }
        newObject[newKey] = propObject;
        console.log(newObject);
    }
};

//обработчик на отправку формы
form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    removeValidation();

    if (checkFieldsValidation() && checkKeyNotDoubled(form.key.value)) {
       
        AddPropertyToObject();

        addPropertyString();

        fields.forEach(field => field.value = '');
        innerFields.forEach(field => field.value = '');

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

//удалить последнее свойство из окна, из объекта
result.onclick = (event) => {
    let minus = event.target.closest('div.minus');
    if (!minus) return;

    const minusParentOfParent = minus.parentNode.parentNode;
    if (!minusParentOfParent.hasAttribute('data-key')) {
        const keyToDelete = minus.parentNode.dataset.key;
        delete newObject[keyToDelete];
    } else {
        const outerKeyToDelete = minusParentOfParent.dataset.key;
        const innerKeyToDelete = minus.parentNode.dataset.key;
        delete newObject[outerKeyToDelete][innerKeyToDelete];
        console.log(newObject);
    }


    minus.parentNode.remove();

    hideDownloadButton();
    console.log(newObject);
};



//скачать итоговый объект в виде файла
downloadButton.onclick = (event) => {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newObject, null, 2));
    let target = event.target;
    target.setAttribute("href", dataStr);
    target.setAttribute("download", "object.json");
};







