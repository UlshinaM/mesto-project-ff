import '../pages/index.css';
import { initialCards } from './cards.js';
import {creationCardFunction, deleteCardFunction, likeCardFunction} from './card.js';
import {openModal, closeModal} from './modal.js';

//собираем все необходимые элементы, с которыми будем взаимодействовать, со страницы
export const cardTemplate = document.querySelector('#card-template').content;
const content = document.querySelector('.content');
const placesList = document.querySelector('.places__list');

const popups = document.querySelectorAll('.popup'); //собираем все попапы в массив
popups.forEach((item) => item.classList.add('popup_is-animated')); //добавляем попапам стилей, чтобы они плавно появлялись и исчезали

//отдельные попапы по типам
const popupTypeEdit = document.querySelector('.popup_type_edit'); //попап и форма редактирования профиля с полями
const formElementEdit = popupTypeEdit.querySelector('.popup__form');
const nameInput = formElementEdit.querySelector('.popup__input_type_name');
const jobInput = formElementEdit.querySelector('.popup__input_type_description');

const popupTypeNewCard = document.querySelector('.popup_type_new-card'); //попап и форма добавления новой карточки с полями
const formElementNewCard = popupTypeNewCard.querySelector('.popup__form');
const cardImageInput = formElementNewCard.querySelector('.popup__input_type_url'); 
const cardImageTitleInput = formElementNewCard.querySelector('.popup__input_type_card-name');

const popupTypeImage = document.querySelector('.popup_type_image'); //попап, открывающий фотографию карточки в большем размере
const popupImage = popupTypeImage.querySelector('.popup__image');
const popupCaption = popupTypeImage.querySelector('.popup__caption');
export {popupTypeImage, popupImage, popupCaption};

const profile = document.querySelector('.profile__info'); //собираем элементы профиля, которые будут редактироваться формой
const profileNameInput = profile.querySelector('.profile__title');
const profileDescriptionInput = profile.querySelector('.profile__description');
export {formElementEdit, formElementNewCard};

//Вывести карточки на страницу при первой загрузке
initialCards.forEach((item) => placesList.append(creationCardFunction(item.link, item.name, deleteCardFunction, likeCardFunction, openModal)));

//Слушатель для открытия попапов формы редактирования и добавления новой карточки. Слушатель для попапа открытия карточки навешивается при ее создании
content.addEventListener('click', (evt) => {
    switch (evt.target.classList[0]) {
        case 'profile__edit-button':   
            nameInput.value = profileNameInput.textContent;
            jobInput.value = profileDescriptionInput.textContent;
            openModal(popupTypeEdit, closeModal);
            break;
        case 'profile__add-button':
            openModal(popupTypeNewCard, closeModal);
            cardImageInput.value = '';
            cardImageTitleInput.value = '';
    }
});

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
export {handleFormSubmitEdit, handleFormSubmitNewCard};