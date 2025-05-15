import {deleteApi, putLikeCard} from './api.js';

const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки
function creationCardFunction(cardObject) {
    const newCardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const newCardImage = newCardElement.querySelector('.card__image');
    const newCardTitle = newCardElement.querySelector('.card__title');
    const cardLikeNumber = newCardElement.querySelector('.card__like-number');
    const cardDeleteButton = newCardElement.querySelector('.card__delete-button');
    const cardLikeButton = newCardElement.querySelector('.card__like-button');

    newCardImage.src = cardObject.imageLink;
    newCardImage.alt = `Фотография места: ${cardObject.cardTitle}`;
    newCardTitle.textContent = cardObject.cardTitle;
    cardLikeNumber.textContent = cardObject.likeNumber;
    cardDeleteButton.setAttribute('disabled', true);
    cardDeleteButton.setAttribute('style', 'visibility: hidden');

    if (cardObject.profileId === cardObject.cardCreatorId) {//проверяем карточку на возможность удаления
        cardDeleteButton.removeAttribute('disabled');
        cardDeleteButton.setAttribute('style', 'visibility: visible');
        cardDeleteButton.addEventListener('click', () => cardObject.deleteFunction({
            card: newCardElement, 
            cardId: cardObject.cardId,
            error: cardObject.errorMessage
        }));
    }
    
    const DoYouLike = cardObject.likesArchive.some((item) => item._id === cardObject.profileId);

    if (DoYouLike) {
        cardLikeButton.classList.add('card__like-button_is-active');//если до обновления ставили лайк, добавить стиль сердечку
    };

    cardLikeButton.addEventListener('click', (evt) => cardObject.likeFunction({button: evt.target,
        cardId: `likes/${cardObject.cardId}`,
        likesNumber: evt.target.closest('.card__like-group').querySelector('.card__like-number'),
        error: cardObject.errorMessage
    }));
    newCardElement.querySelector('.card__image').addEventListener('click', () => cardObject.openImagePopup(cardObject.cardTitle, cardObject.imageLink));

    return newCardElement;
};

//Функция удаления карточки
function deleteCardFunction(cardElement) {
    deleteApi(cardElement.cardId)
    .then(() => cardElement.card.remove())
    .catch((err) => {
        cardElement.error(`${err}
//Невозможно удалить карточку`);
    });
};

//Функция like/dislike карточки
function likeCardFunction(cardElement) {
    if (!cardElement.button.classList.contains('card__like-button_is-active')) {
        putLikeCard(cardElement)
        .then((data) => {
            cardElement.likesNumber.textContent = data.likes.length;
            cardElement.button.classList.add('card__like-button_is-active');
        })
        .catch((err) => {
            cardElement.error(`${err}
Невозможно отметить "понравившимся"`);    
        });
    } else {
        //disLikeCard(cardElement);
        deleteApi(cardElement.cardId)
        .then((data) => {
            cardElement.button.classList.remove('card__like-button_is-active');
            cardElement.likesNumber.textContent = data.likes.length;
        })
        .catch((err) => {
            cardElement.error(`${err}
Невозможно снять отметку "понравившееся"`);    
        });
    }
};

export {creationCardFunction, deleteCardFunction, likeCardFunction};