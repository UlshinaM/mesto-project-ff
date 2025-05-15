function isValid(formElement, inputElement, formObject) {
    if (inputElement.validity.patternMismatch) {
        inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
        inputElement.setCustomValidity('');
    }
    
    if (inputElement.validity.valid) {
        hideInputError({
            form: formElement,
            input: inputElement,
            inputErrorClass: formObject.inputErrorClass,
            errorClass: formObject.errorClass
        });
    } else {
        showInputError({
            form: formElement,
            input: inputElement,
            errorMessage: inputElement.validationMessage,
            inputErrorClass: formObject.inputErrorClass,
            errorClass: formObject.errorClass
        });
    }
};

function showInputError(inputError) {
    const errorElement = inputError.form.querySelector(`.${inputError.input.id}-error`);
    const inputElement = inputError.input;

    inputElement.classList.add(inputError.inputErrorClass); //нижняя граница поля ввода красная
    errorElement.textContent = inputError.errorMessage;
    errorElement.classList.add(inputError.errorClass); //делаем текст ошибки видимым на странице
};

function hideInputError(inputError) { //надо вызвать при несохраняемом и сохраняемом закрытии попапов
    const inputElement = inputError.input;
    const errorElement = inputError.form.querySelector(`.${inputElement.id}-error`);
    
    inputElement.classList.remove(inputError.inputErrorClass); //нижняя граница поля ввода не красная
    errorElement.textContent = '';
    errorElement.classList.remove(inputError.errorClass); //делаем текст ошибки невидимым на странице
};

function hasInvalidInput(inputList) {
    return inputList.some((itemInputElement) => {
        return !itemInputElement.validity.valid;
    });
};

function checkSubmitButton(inputList, buttonElement, inactiveButtonClass) {
    if (hasInvalidInput(inputList)) {
        buttonElement.disabled = true; //кнока некликабельна
        buttonElement.classList.add(inactiveButtonClass); //делаем кнопку неактивной визуально
    } else {
        buttonElement.disabled = false; //кнопка кликабельна
        buttonElement.classList.remove(inactiveButtonClass); //делаем кнопку активной визуально
    }
};

function setEventListener(formElement, formObject) {
    const inputList = Array.from(formElement.querySelectorAll(`${formObject.inputSelector}`));
    
    inputList.forEach((itemInput) => {
        itemInput.addEventListener('input', () => {
            isValid(formElement, itemInput, formObject);

            checkSubmitButton(inputList, formElement.querySelector(`${formObject.submitButtonSelector}`), formObject.inactiveButtonClass);
        });
    });
}

function enableValidation(formObject) {
    const formList = Array.from(document.querySelectorAll(`${formObject.formSelector}`));
    
    formList.forEach((itemFormElement) => {
        itemFormElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
        });
        
        setEventListener(itemFormElement, formObject);
    });
};

function clearValidation(profileForm, validationConfig) {
    const buttonElement = profileForm.querySelector(validationConfig.submitButtonSelector);
    const inputList = Array.from(profileForm.querySelectorAll(`${validationConfig.inputSelector}`));

    inputList.forEach((itemInputElement) => {
        itemInputElement.classList.remove(validationConfig.inputErrorClass); //нижняя граница поля ввода не красная
        
        const errorElement = profileForm.querySelector(`.${itemInputElement.id}-error`);
        errorElement.textContent = '';
        errorElement.classList.remove(validationConfig.errorClass); //делаем текст ошибки невидимым на странице
    });

    buttonElement.disabled = true; //кнока некликабельна
    buttonElement.classList.add(validationConfig.inactiveButtonClass); //делаем кнопку неактивной визуально
};

export {enableValidation, clearValidation};