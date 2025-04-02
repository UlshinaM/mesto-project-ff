// @todo: Темплейт карточки

const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы

const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки

function creationCardFunction(cardImage, cardTitle, deleteCard) {
    const newCardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const newCardImage = newCardElement.querySelector('.card__image');
    const newCardTitle = newCardElement.querySelector('.card__title');

    newCardImage.src = cardImage;
    newCardImage.alt = `Фотография места: ${cardTitle}`;
    newCardTitle.textContent = cardTitle;

    newCardElement.querySelector('.card__delete-button').addEventListener('click', () => deleteCard(newCardElement));

    return newCardElement;
};

// @todo: Функция удаления карточки

function deleteCardFunction(card) {
    card.remove();
};

// @todo: Вывести карточки на страницу
initialCards.forEach((item) => placesList.append(creationCardFunction(item.link, item.name, deleteCardFunction)));