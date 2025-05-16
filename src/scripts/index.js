import '../pages/index.css';
import {creationCardFunction, deleteCardFunction, likeCardFunction} from './card.js';
import {openModal, closeModal, checkClosingButton, checkOverlayClosing} from './modal.js';
import {enableValidation, clearValidation} from './validation.js';
import {getProfileInfo, getInitialCards, makePostFetch, updateProfile, updateProfileAvatar} from './api.js';

const content = document.querySelector('.content');
const placesList = document.querySelector('.places__list');

const headerProfileInfo = {
    name: content.querySelector('.profile__title'),
    about: content.querySelector('.profile__description'),
    profileImage: content.querySelector('.profile__image')
};

const showErrorMessage = (error) => {//функция вывода сообщения об ошибке, сообщение будет прятаться через ~5 секунд
    const errorMessage = document.querySelector('#error-message-template').content;
    const page = document.querySelector('.page');
    const errorMessageElement = errorMessage.querySelector('.error-content').cloneNode(true);
    const errorMessageText = errorMessageElement.querySelector('.error-message_text');
    errorMessageText.textContent = `${error}`;

    page.prepend(errorMessageElement);
    setTimeout(() => {errorMessageElement.classList.add('error-content-is-animated')}, 50);
    setTimeout(() => {errorMessageElement.classList.remove('error-content-is-animated')}, 4500);
    setTimeout(() => {errorMessageElement.remove()}, 5000);
};

function loadProfileAndCards() {
    Promise.all([getProfileInfo(), getInitialCards()])
    .then(([profileData, cardsData]) => {
        headerProfileInfo.name.textContent = profileData.name;
        headerProfileInfo.about.textContent = profileData.about;
        headerProfileInfo.profileImage.style.backgroundImage = `url(${profileData.avatar})`;
        cardsData.forEach((cardObject) => placesList.append(creationCardFunction({imageLink: cardObject.link,
            cardTitle: cardObject.name,
            likesArchive: cardObject.likes,
            profileId: profileData._id,
            cardCreatorId: cardObject.owner._id,
            cardId: cardObject._id,
            deleteFunction: deleteCardFunction,
            likeFunction: likeCardFunction,
            openImagePopup: handleOpenImage,
            errorMessage: showErrorMessage
        })));
    })
    .catch((err) => {showErrorMessage(`${err}
Произошла ошибка при загрузке данных`);});
};

//выводим информацию о пользователе и список карточек
loadProfileAndCards();

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

//Переменные с конфиг-объектами для обработки форм
const configFormClass = {inputSelector: '.popup__input',
        inputErrorClass: 'popup__input_type_error',
        submitButtonSelector: '.popup__button',
        inactiveButtonClass: 'popup__button_disabled',
        errorClass: 'popup__error_visible',
        formSelector: '.popup__form'
    };

//Слушатель для открытия попапов формы редактирования и добавления новой карточки. Слушатель для попапа открытия карточки навешивается при ее создании
content.querySelector('.profile__edit-button').addEventListener('click', () => openPopupTypeEdit(profileNameInput.textContent, profileDescriptionInput.textContent));
content.querySelector('.profile__add-button').addEventListener('click', () => {//открываем попап добавления карточки
    formElementNewCard.reset();
    clearValidation(formElementNewCard, configFormClass);
    returnFormButtonSubmitStatus(popupTypeNewCard.querySelector('.popup__button'));
    openModal(popupTypeNewCard);
});
content.querySelector('.profile__image').addEventListener('click', () => {//открываем попап новой аватарки
    formElementEditAvatar.reset();
    clearValidation(formElementEditAvatar, configFormClass);
    returnFormButtonSubmitStatus(popupTypeEditAvatar.querySelector('.popup__button'));    
    openModal(popupTypeEditAvatar);
});

function openPopupTypeEdit(name, job) {//функция, открывающая попап для редактирования профиля
    nameInput.value = name;
    jobInput.value = job;
    clearValidation(formElementEdit, configFormClass);
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
    updateProfile({
        name: nameInput.value,
        about: jobInput.value
    })
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
    updateProfileAvatar({avatar: avatarInput.value})
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
        cardCreatorId: cardData.owner._id,
        profileId: cardData.owner._id,
        cardId: cardData._id, 
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

enableValidation(configFormClass);//вызываем функцию для включения валидации форм на странице