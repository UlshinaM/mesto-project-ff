function openModal(popup) {
    popup.classList.add('popup_is-opened');

    //popup.querySelector('.popup__close').addEventListener('click', checkClosingButton); //слушатель на кнопку закрытия

    //popup.addEventListener('mousedown', checkOverlayClosing);//слушатель на нажатие по оверлею

    document.addEventListener('keydown', checkKeyClosing); //слушатель на клавишу Esc, если ставить где-то за пределами функции открытия модального окна будут ошибки, напрмер, единичное нажате клавиши Esc будет приводить к снятию слушателя
};

function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
};

function checkClosingButton() {
    closeModal(document.querySelector('.popup_is-opened'));
};

function checkOverlayClosing(evt) { //функция-обработчик клика по оверлею
    const checkPopup = document.querySelector('.popup_is-opened .popup__content'); //из всего документа выбираем только содержимое всплывающего окошка, открытого в данный момент
    if (!evt.composedPath().includes(checkPopup)) { //проверяем, что на содержимом попапа событие не сработало
        closeModal(document.querySelector('.popup_is-opened'));
    };
};

function checkKeyClosing(evt) { //функция-обработчик нажатия Esc
    if (evt.key === 'Escape') {
        closeModal(document.querySelector('.popup_is-opened'));
        document.removeEventListener('keydown', checkKeyClosing);
    }
};

export {openModal, closeModal, checkClosingButton, checkOverlayClosing};