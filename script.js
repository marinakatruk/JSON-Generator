const result = document.getElementById('result');
const plusButton = document.getElementById('plus');
const minusButton = document.getElementById('minus');
const resultObject = document.getElementById('object');
const form = document.forms.form;
const img = document.getElementById('img');
const downloadButton = document.getElementById('download');


//показать/скрыть элемент(форма и картинка)
const hiddenClassToggle = (toRemove, toAdd) => {
    if (toRemove.classList.contains('hidden')) {
        toAdd.classList.add('hidden');
        toRemove.classList.remove('hidden');
    }
};

plusButton.onclick = () => hiddenClassToggle(form, img);

//сообщения-подсказки по заполнению полей
const showHelp = (note) => {
    note.style.display = 'block';
}

const hideHelp = (note) => {
    note.style.display = 'none';
}

const helpKey = document.getElementById('help-key');

form.key.onfocus = () => {
    setTimeout (() => showHelp(helpKey), 100);
    form.key.onblur = () => {
        setTimeout (() => hideHelp(helpKey), 100);
    }
};

const helpValue = document.getElementById('help-value');

form.value.onfocus = () => {
    setTimeout (() => showHelp(helpValue), 100);
    form.value.onblur = () => {
        setTimeout (() => hideHelp(helpValue), 100);
    }
};


const addButton = form.elements.addbutton;
const fields = form.querySelectorAll('.form__input');
const blocks = form.querySelectorAll('.form__block');

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

//валидация - нет пустых полей
const checkFieldsPresense = () => {
    let valid = true;
    for (let i = 0; i < fields.length; i += 1) {
        if (!fields[i].value) {
            let error = generateError('Cannot be blank');
            blocks[i].append(error);
            valid = false;
        }
    }
    return valid;
};

//валидация - символы
const checkFieldsValuesMatch = () => {
    let valid = true;
    const lettersAndNumbers = /^[0-9a-zA-Z]+$/;
    const letAndNumAndProp = /^[0-9a-zA-Z]+|[0-9a-zA-Z]+[=][0-9a-zA-Z]+$/;
    if (!form.key.value.match(lettersAndNumbers) && form.key.value) {
        let error = generateError('Must contain only letters or numbers');
        blocks[0].append(error);
        valid = false;
    } else if (!form.value.value.match(letAndNumAndProp) && form.value.value) {
        let error = generateError('Must contain only letters or numbers or a property');
        blocks[1].append(error);
        valid = false;
    }
    return valid;
};

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

    if (checkFieldsPresense() && checkFieldsValuesMatch() && checkKeyNotDoubled(form.key.value)) {

        AddPropertyToObject();

        addPropertyString();

        fields.forEach(field => field.value = '');

        hiddenClassToggle(img, form);

        if (downloadButton.classList.contains('hidden')) {
            downloadButton.classList.remove('hidden');
        } 
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
result.onclick = (event) => {
    let minus = event.target.closest('div.minus');
    if (!minus) return;

    minus.parentNode.remove();

    const keyToDelete = minus.parentNode.dataset.key;
    delete newObject[keyToDelete];

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







