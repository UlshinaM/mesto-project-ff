// @todo: Темплейт карточки

const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы

const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки

function addCardToPage(cardImage, cardTitle, deleteCard) {
    const newCardElement = cardTemplate.querySelector('.card').cloneNode(true);
    newCardElement.querySelector('.card__image').src = cardImage;
    newCardElement.querySelector('.card__title').textContent = cardTitle;

    newCardElement.querySelector('.card__delete-button').addEventListener('click', deleteCard);

    return newCardElement;
};

// @todo: Функция удаления карточки

function deleteCardFunction(evt) {
    let placeItem = evt.target.closest('.places__item');
    placeItem.remove();
};

// @todo: Вывести карточки на страницу
for (let i = 0; i < initialCards.length; i++) {
    let imageLink = initialCards[i].link;
    let titleCard = initialCards[i].name;

    placesList.append(addCardToPage(imageLink, titleCard, deleteCardFunction));
};