import {formElementNewCard, formElementEdit, handleFormSubmitEdit, handleFormSubmitNewCard} from './index.js';

function openModal(popup, closing) {
    popup.classList.add('popup_is-opened');
    
    formElementEdit.addEventListener('submit', handleFormSubmitEdit);
    formElementNewCard.addEventListener('submit', handleFormSubmitNewCard);

    popup.querySelector('.popup__close').addEventListener('click', () => closing(popup)); //слушатель на кнопку закрытия
    
    popup.addEventListener('click', (evt) => checkOverlayClosing(popup, evt));//слушатель на нажатие по оверлею

    document.addEventListener('keydown', (evt) => checkKeyClosing(popup, evt)); //слушатель на клавишу Esc
};

function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
};

function checkOverlayClosing(popup, evtSubject) { //функция-обработчик клика по оверлею
    const checkPopup = popup.querySelector('.popup__content');
    if (!evtSubject.composedPath().includes(checkPopup)) { //проверяем, что на самом окне попапа событие не сработало
        closeModal(popup);
    }
};

function checkKeyClosing(popup, evtSubject) { //функция-обработчик нажатия Esc
    if (evtSubject.key === 'Escape') {
        closeModal(popup);
        document.removeEventListener('keydown', checkKeyClosing);
    }
};

export {openModal, closeModal};