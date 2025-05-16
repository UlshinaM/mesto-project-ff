import {deleteApi, putLikeCard, deleteLikeCard} from './api.js';

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
    cardLikeNumber.textContent = cardObject.likesArchive.length;

    if (cardObject.profileId === cardObject.cardCreatorId) {//проверяем карточку на возможность удаления
        cardDeleteButton.addEventListener('click', () => cardObject.deleteFunction({
            card: newCardElement, 
            cardId: cardObject.cardId,
            error: cardObject.errorMessage
        }));
    } else {//если не пользователь создавал, скрываем кнопку удаления
        cardDeleteButton.setAttribute('disabled', true);
        cardDeleteButton.setAttribute('style', 'visibility: hidden');
    }
    
    const doYouLike = cardObject.likesArchive.some((item) => item._id === cardObject.profileId);

    if (doYouLike) {
        cardLikeButton.classList.add('card__like-button_is-active');//если до обновления ставили лайк, добавить стиль сердечку
    };

    cardLikeButton.addEventListener('click', (evt) => cardObject.likeFunction({button: evt.target,
        cardId: cardObject.cardId,
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
    const isLiked = cardElement.button.classList.contains('card__like-button_is-active'); //булева переменная, хранящая отмечена карточка, как понравившаяся или нет
    //ставим условие проверки наличия лайка на карточке через тернарный оператор
    const whichLikeMethod = isLiked ? deleteLikeCard : putLikeCard;
    whichLikeMethod(cardElement.cardId) //в зависимости от условия получаем в переменной метод либо удаления лайка карточки, либо лайка, его и вызываем
    .then((data) => {
        cardElement.likesNumber.textContent = data.likes.length;
        cardElement.button.classList.toggle('card__like-button_is-active');
    })
    .catch((err) => {
        cardElement.error(`${err}
Невозможно ${isLiked ? 'снять' : 'поставить'} лайк`)
    });
};

export {creationCardFunction, deleteCardFunction, likeCardFunction};