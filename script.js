const result = document.getElementById('result');
const plusButton = document.getElementById('plus');
const minusButton = document.getElementById('minus');
const resultObject = document.getElementById('object');
const form = document.forms.form;
const img = document.getElementById('img');
const downloadButton = document.getElementById('download');
const valueButton = document.getElementById('value-button');
const innerObject = document.getElementById('inner-object');



//показать/скрыть элемент(форма и картинка)
const hiddenClassToggle = (RemoveClass, AddClass) => {
    if (RemoveClass.classList.contains('hidden')) {
        AddClass.classList.add('hidden');
        RemoveClass.classList.remove('hidden');
    }
};

plusButton.onclick = () => hiddenClassToggle(form, img);


const addButton = form.elements.addbutton;
const fields = form.querySelectorAll('.form__input');
const blocks = form.querySelectorAll('.form__block');
const innerFields = form.querySelectorAll('.inner__input');
const innerBlocks = form.querySelectorAll('.inner__block');


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
const checkFieldsPresAndMax = () => {

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

// //валидация - символы
// const checkFieldsValuesMatch = () => {
//     let valid = true;
//     const lettersAndNumbers = /^[0-9a-zA-Z]+$/;
//     const letAndNumAndProp = /^[0-9a-zA-Z]+|[0-9a-zA-Z]+[=][0-9a-zA-Z]+$/;
//     if (!form.key.value.match(lettersAndNumbers) && form.key.value) {
//         let error = generateError('Must contain only letters or numbers');
//         blocks[0].append(error);
//         valid = false;
//     } 
//     if (!form.value.value.match(letAndNumAndProp) && form.value.value) {
//         let error = generateError('Must contain only letters or numbers or a property');
//         blocks[1].append(error);
//         valid = false;
//     }
//     return valid;
// };

//добавить свойство в итоговое поле
const addPropertyString = () => {
    const newProp = document.createElement('div');
    newProp.className = 'property';
    newProp.setAttribute('data-key', form.key.value);
    newProp.innerHTML = `<span>"${form.key.value}"</span> : <span>"${form.value.value}"</span>,`;
    plusButton.before(newProp);
    const minusButton = document.createElement('div');
    minusButton.className = 'result__button minus';
    minusButton.innerHTML = '-';
    newProp.append(minusButton);
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
    if (typeof newKey === 'number') {
        newObject[String(newKey)] = newValue;
    }
    newObject[newKey] = newValue;
};

//обработчик на отправку формы
form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    removeValidation();

    if (checkFieldsPresAndMax() && checkFieldsValuesMatch() && checkKeyNotDoubled(form.key.value)) {
       
        AddPropertyToObject();

        addPropertyString();

        fields.forEach(field => field.value = '');

        hiddenClassToggle(img, form);

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

    minus.parentNode.remove();

    const keyToDelete = minus.parentNode.dataset.key;
    delete newObject[keyToDelete];

    hideDownloadButton();
    console.log(newObject);
};


const formBlockToHide = blocks[1];

valueButton.onclick = () => {
    hiddenClassToggle(innerObject, formBlockToHide);
    console.log(innerObject);
};




//скачать итоговый объект в виде файла
downloadButton.onclick = (event) => {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newObject, null, 2));
    let target = event.target;
    target.setAttribute("href", dataStr);
    target.setAttribute("download", "object.json");
};







