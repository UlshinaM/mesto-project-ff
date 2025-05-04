const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки

function creationCardFunction(cardImage, cardTitle, deleteCard, likeCard, openFullCard) {
    const newCardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const newCardImage = newCardElement.querySelector('.card__image');
    const newCardTitle = newCardElement.querySelector('.card__title');

    newCardImage.src = cardImage;
    newCardImage.alt = `Фотография места: ${cardTitle}`;
    newCardTitle.textContent = cardTitle;

    newCardElement.querySelector('.card__delete-button').addEventListener('click', () => deleteCard(newCardElement));
    newCardElement.querySelector('.card__like-button').addEventListener('click', (evt) => likeCard(evt.target));
    newCardElement.querySelector('.card__image').addEventListener('click', () => openFullCard(cardTitle, cardImage));

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