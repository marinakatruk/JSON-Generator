const textarea = document.getElementById('textarea');
const addButton = document.getElementById('add');
const deleteButton = document.getElementById('delete');
const form = document.forms.form;

addButton.onclick = () => {
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        textarea.append('{ }');
    } 
    
};

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


const formButton = form.elements.button;
const fields = form.querySelectorAll('.form__input');
const blocks = form.querySelectorAll('.form__block');

const generateError = (text) => {
    let error = document.createElement('div');
    error.className = 'error';
    error.style.color = 'red';
    error.innerHTML = text;
    return error;
};

const removeValidation = () => {
    let errors = form.querySelectorAll('.error');
    for (let i = 0; i < errors.length; i += 1) {
        errors[i].remove();
    }
};

const checkFieldsPresense = () => {
    for (let i = 0; i < fields.length; i += 1) {
        if (!fields[i].value) {
            let error = generateError('Cannot be blank');
            blocks[i].append(error);
        }
    }
};

const checkFieldsValuesMatch = () => {
    const letters = /^[a-zA-Z]+$/;
    const lettersAndNumbers = /^[0-9a-zA-Z]+|[a-zA-Z]+[=][0-9a-zA-Z]+$/;
    if (!form.key.value.match(letters) && form.key.value) {
        let error = generateError('Must contain only letters');
            blocks[0].append(error);
    } else if (!form.value.value.match(lettersAndNumbers) && form.value.value) {
        let error = generateError('Must contain only letters or numbers or an object');
        blocks[1].append(error);
    }
};


form.addEventListener('submit', function (event) {
    event.preventDefault();

    removeValidation();

    checkFieldsPresense();

    checkFieldsValuesMatch();

    const text = `"${form.key.value}" : "${form.value.value}",`;


    let elemObject = document.createElement('div');
    elemObject.className = 'object';
    elemObject.innerHTML = text;
    console.log(elemObject);
    textarea.append(elemObject);

});







