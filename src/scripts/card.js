import {cardTemplate, popupTypeImage} from './index.js';
import {closeModal} from './modal.js';

// @todo: Функция создания карточки

function creationCardFunction(cardImage, cardTitle, deleteCard, likeCard, openCard) {
    const newCardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const newCardImage = newCardElement.querySelector('.card__image');
    const newCardTitle = newCardElement.querySelector('.card__title');

    newCardImage.src = cardImage;
    newCardImage.alt = `Фотография места: ${cardTitle}`;
    newCardTitle.textContent = cardTitle;

    //newCardElement.querySelector('.card__delete-button').addEventListener('click', () => deleteCard(newCardElement));
    //newCardElement.querySelector('.card__like-button').addEventListener('click', (evt) => likeCard(evt.target));
    newCardElement.addEventListener('click', (evt) => { //слушатель клика висит на всей карточке, с помощью switch сортирую, что надо сделать в зависимости от элемента, по которому произошел клик
        switch (evt.target.classList[0]) {
            case 'card__delete-button':
                deleteCard(newCardElement);
                break;
            case 'card__image':
                openCard(popupTypeImage, closeModal, cardTitle, cardImage, `Фотография места: ${cardTitle}`);
                break;
            case 'card__like-button':
                likeCard(evt.target);
        }
    });

    return newCardElement;
};

// @todo: Функция удаления карточки

function deleteCardFunction(card) {
    card.remove();
};

function likeCardFunction(likeButton) {
    likeButton.classList.toggle('card__like-button_is-active');
};

export {creationCardFunction, deleteCardFunction, likeCardFunction};