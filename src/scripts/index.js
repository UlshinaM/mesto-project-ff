import '../pages/index.css';
import {creationCardFunction, deleteCardFunction, likeCardFunction} from './card.js';
import {openModal, closeModal, checkClosingButton, checkOverlayClosing} from './modal.js';
import {enableValidation, clearValidation} from './validation.js';
import {getProfileInfo, getInitialCards, makePatchFetch, makePostFetch} from './api.js';

const showErrorMessage = (error) => {//функция вывода сообщения об ошибке, сообщение будет прятаться через ~5 секунд
    const errorMessageElement = document.createElement('div');
    errorMessageElement.setAttribute('style', `
        position: absolute;
        top: 5%;
        left: 5%;
        font-family: Arial;
        background-color: #fff;
        border-radius: 10px;
        padding: 20px 5px;
        color: #000;
        font-size: 24px;
        font-weight: 900;
        white-space: pre;
        text-align: center;
        min-width: 35%;`);
    errorMessageElement.textContent = `Произошла ошибка
${error}`;

    document.body.appendChild(errorMessageElement);

    setTimeout(() => {
        errorMessageElement.parentNode.removeChild(errorMessageElement);
    }, 5000);
};

const content = document.querySelector('.content');
const placesList = document.querySelector('.places__list');

const headerProfileInfo = {
    name: content.querySelector('.profile__title'),
    about: content.querySelector('.profile__description'),
    profileImage: content.querySelector('.profile__image')
};

const cardsArchiveLink = 'https://nomoreparties.co/v1/wff-cohort-39/cards';
const myToken = 'efe03888-d184-438b-940b-b32d357d3e18';

function loadingProfileInfo(aboutProfile) {
    getProfileInfo()
    .then((data) => {
        aboutProfile.name.textContent = data.name;
        aboutProfile.about.textContent = data.about;
        aboutProfile.profileImage.style.backgroundImage = `url(${data.avatar})`;
    })
    .catch((err) => {
        showErrorMessage(`${err}
Произошла ошибка при загрузке данных`);
    });
};

function loadCards() {
    Promise.all([getProfileInfo()
        .then((data) => {const profileId = data._id; return profileId;}),//если все в порядке - получили id пользователя, если нет - топаем в .catch для всего Promise.all
        getInitialCards()])
    .then((data) => {
        data[1].forEach((cardObject) => placesList.append(creationCardFunction({imageLink: cardObject.link,
            cardTitle: cardObject.name,
            deleteFunction: deleteCardFunction,
            likeFunction: likeCardFunction,
            openImagePopup: handleOpenImage,
            likesArchive: cardObject.likes,
            likeNumber: cardObject.likes.length,
            cardCreatorId: cardObject.owner._id,
            profileId: data[0],
            cardId: cardObject._id,
            token: myToken,
            cardsLink: cardsArchiveLink,
            errorMessage: showErrorMessage
            })));
    })
    .catch((err) => {showErrorMessage(`${err}
Произошла ошибка при загрузке данных`);});
};
//выводим информацию о пользователе и список карточек
loadingProfileInfo(headerProfileInfo);
loadCards();

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

const popupTypeEditAvatar = document.querySelector('.popup_type_edit_avatar'); //попап, на обновление аватарки
const formElementEditAvatar = popupTypeEditAvatar.querySelector('.popup__form');
const avatarInput = formElementEditAvatar.querySelector('.popup__input_type_avatar-url');

const profile = document.querySelector('.profile__info'); //собираем элементы профиля, которые будут редактироваться формой
const profileNameInput = profile.querySelector('.profile__title');
const profileDescriptionInput = profile.querySelector('.profile__description');

//Слушатель для открытия попапов формы редактирования и добавления новой карточки. Слушатель для попапа открытия карточки навешивается при ее создании
content.querySelector('.profile__edit-button').addEventListener('click', () => openPopupTypeEdit(profileNameInput.textContent, profileDescriptionInput.textContent));
content.querySelector('.profile__add-button').addEventListener('click', () => {//открываем попап добавления карточки
    formElementNewCard.reset();
    clearValidation(formElementNewCard,
        {inputSelector: '.popup__input',
        inputErrorClass: 'popup__input_type_error',
        submitButtonSelector: '.popup__button',
        inactiveButtonClass: 'popup__button_disabled',
        errorClass: 'popup__error_visible'});
    returnFormButtonSubmitStatus(popupTypeNewCard.querySelector('.popup__button'));
    openModal(popupTypeNewCard);
});
content.querySelector('.profile__image').addEventListener('click', () => {//открываем попап новой аватарки
    formElementEditAvatar.reset();
    clearValidation(formElementEditAvatar,
        {inputSelector: '.popup__input',
        inputErrorClass: 'popup__input_type_error',
        submitButtonSelector: '.popup__button',
        inactiveButtonClass: 'popup__button_disabled',
        errorClass: 'popup__error_visible'});
    returnFormButtonSubmitStatus(popupTypeEditAvatar.querySelector('.popup__button'));    
    openModal(popupTypeEditAvatar);
});

function openPopupTypeEdit(name, job) {//функция, открывающая попап для редактирования профиля
    nameInput.value = name;
    jobInput.value = job;
    clearValidation(formElementEdit,
        {inputSelector: '.popup__input',
        inputErrorClass: 'popup__input_type_error',
        submitButtonSelector: '.popup__button',
        inactiveButtonClass: 'popup__button_disabled',
        errorClass: 'popup__error_visible'});
    returnFormButtonSubmitStatus(popupTypeEdit.querySelector('.popup__button'));
    openModal(popupTypeEdit);
};

function handleOpenImage(title, link) {//функция, открывающая попап картинки на большом экране
    popupCaption.textContent = title;
    popupImage.src = link;
    popupImage.alt = `Фотография места: ${title}`;
    openModal(popupTypeImage);
};

formElementEdit.addEventListener('submit', handleFormSubmitEdit);
formElementNewCard.addEventListener('submit', handleFormSubmitNewCard);
formElementEditAvatar.addEventListener('submit', handleFormSubmitEditAvatar);

function showSavingFormProcess(button) {
    button.textContent = 'Сохранение...';
    button.disabled = true;
};

function returnFormButtonSubmitStatus(button) {
    button.textContent = 'Сохранить';
    button.disabled = false;
};

function handleFormSubmitEdit(evt) {//функция сохранения параметров формы "Редактировать профиль"
    evt.preventDefault();
    showSavingFormProcess(evt.target.querySelector('.popup__button'));
    makePatchFetch({linkEnd: '/users/me',
        body: JSON.stringify({
            name: nameInput.value,
            about: jobInput.value
    })})
    .then(() => {
        profileNameInput.textContent = nameInput.value;
        profileDescriptionInput.textContent = jobInput.value;
    })
    .catch((err) => {showErrorMessage(`${err}
Произошла ошибка при загрузке данных`)})
    .finally(() => {
        closeModal(evt.target.closest('.popup_type_edit'));
    });
};

function handleFormSubmitEditAvatar(evt) {//функция сохранения параметров формы "Обновить аватар"
    evt.preventDefault();
    showSavingFormProcess(evt.target.querySelector('.popup__button'));
    makePatchFetch({linkEnd: '/users/me/avatar',
        body: JSON.stringify({
            avatar: avatarInput.value
        })
    })
    .then(() => {
        headerProfileInfo.profileImage.style.backgroundImage = `url(${avatarInput.value})`;
    })
    .catch((err) => {showErrorMessage(`${err}
Произошла ошибка при загрузке данных`)})
    .finally(() => {
        closeModal(evt.target.closest('.popup_type_edit_avatar'));
    });
};

function handleFormSubmitNewCard(evt) {//функция сохранения параметров формы "Добавить карточку"
    evt.preventDefault();
    showSavingFormProcess(evt.target.querySelector('.popup__button'));
    makePostFetch({name: cardImageTitleInput.value, link: cardImageInput.value})
    .then((cardData) => {
        placesList.prepend(creationCardFunction({imageLink: cardData.link,
        cardTitle: cardData.name,
        deleteFunction: deleteCardFunction,
        likeFunction: likeCardFunction,
        openImagePopup: handleOpenImage,
        likesArchive: cardData.likes,
        likeNumber: cardData.likes.length,
        cardCreatorId: cardData.owner._id,
        profileId: cardData.owner._id,
        cardId: cardData._id, 
        token: myToken,
        cardsLink: cardsArchiveLink,
        errorMessage: showErrorMessage
        }));
        
    })
    .catch((err) => {showErrorMessage.log(`${err}
Произошла ошибка при загрузке данных`)})
    .finally(() => {
        closeModal(evt.target.closest('.popup_type_new-card'));
        formElementNewCard.reset();
    });
};

enableValidation({//вызываем функцию для включения валидации форм на странице
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
});