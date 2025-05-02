import '../pages/index.css';
import { initialCards } from './cards.js';
import {creationCardFunction, deleteCardFunction, likeCardFunction} from './card.js';
import {openModal, closeModal} from './modal.js';

// @todo: Темплейт карточки

export const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы

const content = document.querySelector('.content');
export const placesList = document.querySelector('.places__list');
const popups = document.querySelectorAll('.popup'); //собираем все попапы в массив
popups.forEach((item) => item.classList.add('popup_is-animated')); //добавляем попапам стилей, чтобы они плавно появлялись и исчезали

//отдельные попапы по типам, СПРОСИТЬ, МОЖНО ЛИ ЭТО КАК-ТО ОПТИМИЗИРОВАТЬ
const popupTypeEdit = document.querySelector('.popup_type_edit');
const formElementEdit = popupTypeEdit.querySelector('.popup__form');
const nameInput = formElementEdit.querySelector('.popup__input_type_name');
const jobInput = formElementEdit.querySelector('.popup__input_type_description');

const popupTypeNewCard = document.querySelector('.popup_type_new-card');
const formElementNewCard = popupTypeNewCard.querySelector('.popup__form');
const cardImageInput = formElementNewCard.querySelector('.popup__input_type_url'); 
const cardImageTitleInput = formElementNewCard.querySelector('.popup__input_type_card-name');

const popupTypeImage = document.querySelector('.popup_type_image');
const popupImage = popupTypeImage.querySelector('.popup__image');
const popupCaption = popupTypeImage.querySelector('.popup__caption');
export {popupTypeImage, popupImage, popupCaption};

const profile = document.querySelector('.profile__info');
const profileNameInput = profile.querySelector('.profile__title');
const profileDescriptionInput = profile.querySelector('.profile__description');
export {profile, profileNameInput, profileDescriptionInput, formElementEdit, nameInput, jobInput, formElementNewCard, cardImageInput, cardImageTitleInput};

// @todo: Вывести карточки на страницу
initialCards.forEach((item) => placesList.append(creationCardFunction(item.link, item.name, deleteCardFunction, likeCardFunction, openModal)));

//Слушатель для открытия попапов
content.addEventListener('click', (evt) => {
    switch (evt.target.classList[0]) {
        case 'profile__edit-button':   
            openModal(popupTypeEdit, closeModal, profileNameInput.textContent, profileDescriptionInput.textContent);
            break;
        case 'profile__add-button':
            openModal(popupTypeNewCard, closeModal);
    }
});