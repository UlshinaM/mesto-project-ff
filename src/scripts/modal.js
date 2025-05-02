import {placesList} from './index.js';
import {formElementNewCard, cardImageInput, cardImageTitleInput, popupImage, popupCaption} from './index.js';
import {profileNameInput, profileDescriptionInput, formElementEdit, nameInput, jobInput} from './index.js';
import {creationCardFunction, deleteCardFunction, likeCardFunction} from './card.js';

function handleFormSubmitEdit(evt) {//функция сохранения параметров формы "Редактировать профиль"
    evt.preventDefault();
    profileNameInput.textContent = nameInput.value;
    profileDescriptionInput.textContent = jobInput.value;
    closeModal(evt.target.parentElement.parentElement);
};  

function handleFormSubmitNewCard(evt) {//функция сохранения параметров формы "Добавить карточку"
    evt.preventDefault();
    placesList.prepend(creationCardFunction(cardImageInput.value, cardImageTitleInput.value, deleteCardFunction, likeCardFunction, openModal));
    closeModal(evt.target.parentElement.parentElement);
    cardImageInput.value = '';
    cardImageTitleInput.value = '';
};

function openModal(popup, closing, name, description, additionParametr) {
    switch (popup.classList[1]) {
        case 'popup_type_edit': //заполнение попапа карточки профиля перед открытием
            nameInput.value = name;
            jobInput.value = description;
            break;
        
        case 'popup_type_image': //заполнение попапа картинки перед открытием
            popupCaption.textContent = name;
            popupImage.src = description;
            popupImage.alt = additionParametr;  
    };

    popup.classList.add('popup_is-opened');
    
    formElementEdit.addEventListener('submit', handleFormSubmitEdit);
    formElementNewCard.addEventListener('submit', handleFormSubmitNewCard);

    popup.querySelector('.popup__close').addEventListener('click', () => closing(popup)); //слушатель на кнопку закрытия
    
    popup.addEventListener('click', (evt) => { //слушатель на нажатие по оверлею
        const checkPopup = popup.querySelector('.popup__content');
        if (!evt.composedPath().includes(checkPopup)) { //проверяем, что на самом окне попапа событие не сработало
            closing(popup);
        }
    });

    document.addEventListener('keydown', (evt) => { //слушатель на клавишу Esc
        if (evt.key === 'Escape') {
            closeModal(popup);
        }
        }, { //автоматически уберет слушатель с документа после срабатывания
            once: true 
        }
    );
};



function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
};

export {openModal, closeModal};