import '../pages/index.css';
import { initialCards } from './cards.js';
import {creationCardFunction, deleteCardFunction, likeCardFunction} from './card.js';
import {openModal, closeModal, checkClosingButton, checkOverlayClosing} from './modal.js';

const content = document.querySelector('.content');
const placesList = document.querySelector('.places__list');

//Вывести карточки на страницу при первой загрузке
initialCards.forEach((item) => placesList.append(creationCardFunction(item.link, item.name, deleteCardFunction, likeCardFunction, handleOpenImage)));

const popups = document.querySelectorAll('.popup'); //собираем все попапы в массив
popups.forEach(addPopupProperties);

function addPopupProperties(item) {
    item.classList.add('popup_is-animated'); //добавляем попапам стилей, чтобы они плавно появлялись и исчезали
    item.querySelector('.popup__close').addEventListener('click', checkClosingButton); //слушатель на кнопку закрытия
    item.addEventListener('mousedown', checkOverlayClosing); //слушатель на нажатие по оверлею
};

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

const profile = document.querySelector('.profile__info'); //собираем элементы профиля, которые будут редактироваться формой
const profileNameInput = profile.querySelector('.profile__title');
const profileDescriptionInput = profile.querySelector('.profile__description');

//Слушатель для открытия попапов формы редактирования и добавления новой карточки. Слушатель для попапа открытия карточки навешивается при ее создании
content.querySelector('.profile__edit-button').addEventListener('click', () => openPopupTypeEdit(profileNameInput.textContent, profileDescriptionInput.textContent));
content.querySelector('.profile__add-button').addEventListener('click', () => {
    openModal(popupTypeNewCard);
    formElementNewCard.reset();
});

function openPopupTypeEdit(name, job) {
    nameInput.value = name;
    jobInput.value = job;
    openModal(popupTypeEdit);
};

function handleOpenImage(title, link) {
    popupCaption.textContent = title;
    popupImage.src = link;
    popupImage.alt = `Фотография места: ${title}`;
    openModal(popupTypeImage);
};

formElementEdit.addEventListener('submit', handleFormSubmitEdit);
formElementNewCard.addEventListener('submit', handleFormSubmitNewCard);

function handleFormSubmitEdit(evt) {//функция сохранения параметров формы "Редактировать профиль"
    evt.preventDefault();
    profileNameInput.textContent = nameInput.value;
    profileDescriptionInput.textContent = jobInput.value;
    closeModal(evt.target.closest('.popup_type_edit'));
};  

function handleFormSubmitNewCard(evt) {//функция сохранения параметров формы "Добавить карточку"
    evt.preventDefault();
    placesList.prepend(creationCardFunction(cardImageInput.value, cardImageTitleInput.value, deleteCardFunction, likeCardFunction, handleOpenImage));
    closeModal(evt.target.closest('.popup_type_new-card'));
    formElementNewCard.reset();
};