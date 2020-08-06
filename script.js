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

//валидация - правильные символы
const checkFieldsValuesMatch = () => {
    let valid = true;
    const letters = /^[a-zA-Z]+$/;
    const lettersAndNumbers = /^[0-9a-zA-Z]+|[a-zA-Z]+[=][0-9a-zA-Z]+$/;
    if (!form.key.value.match(letters) && form.key.value) {
        let error = generateError('Must contain only letters');
        blocks[0].append(error);
        valid = false;
    } else if (!form.value.value.match(lettersAndNumbers) && form.value.value) {
        let error = generateError('Must contain only letters or numbers or a property');
        blocks[1].append(error);
        valid = false;
    }
    return valid;
};

//добавить свойство в итоговое поле
const addPropertyString = () => {
    let newProp = document.createElement('div');
    newProp.className = 'property';
    newProp.innerHTML = `<span>"${form.key.value}"</span> : <span>"${form.value.value}"</span>,`;
    plusButton.before(newProp);
};

const newObject = {};

//обработчик на отправку формы
form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    removeValidation();

    if (checkFieldsPresense() && checkFieldsValuesMatch()) {

        newObject[form.key.value] = form.value.value;

        addPropertyString();

        fields.forEach(field => field.value = '');

        hiddenClassToggle(img, form);

        if (downloadButton.classList.contains('hidden')) {
            downloadButton.classList.remove('hidden');
        }
        
    }
});

//удалить последнее свойство из окна, из объекта
minusButton.onclick = () => {
    const properties = document.querySelectorAll('.property');
    let lastProp = properties[properties.length - 1];
    lastProp.remove();

    const objectKeys = Object.keys(newObject);
    const lastKey = objectKeys[objectKeys.length - 1];
    delete newObject[lastKey];

    if (properties.length === 1) {
        if (!downloadButton.classList.contains('hidden')) {
            downloadButton.classList.add('hidden');
        }
    }
    console.log(newObject);
};

//скачать итоговый объект в виде файла
downloadButton.onclick = (event) => {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newObject, null, 2));
    let target = event.target;
    target.setAttribute("href", dataStr);
    target.setAttribute("download", "object.json");
};







