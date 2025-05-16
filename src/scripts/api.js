const config = {//объект для сборки базового запроса
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-39',
  headers: {
    authorization: 'efe03888-d184-438b-940b-b32d357d3e18', //токен
    'Content-Type': 'application/json'
  }
}

//экспорт запроса на данные профиля
export const getProfileInfo = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
    .then(res => {
        return checkPromiseStatus(res);
    });
};

//экспорт запроса на карточки с сервера
export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    })
    .then(res => {
        return checkPromiseStatus(res);
    });
};

export function updateProfile(newData) {
    return makePatchFetch({
        linkEnd: '/users/me',
        body: JSON.stringify(newData)
    });
};

export function updateProfileAvatar(avatar) {
    return makePatchFetch({
        linkEnd: '/users/me/avatar',
        body: JSON.stringify(avatar)
    });
};

//экспорт запроса на внесение изменений данных профиля, в том числе и аватарки
const makePatchFetch = (newDataObject) => {
    return fetch (`${config.baseUrl}${newDataObject.linkEnd}`, {
        method: 'PATCH',
        headers: config.headers,
        body: newDataObject.body
    })
    .then(res => {
        return checkPromiseStatus(res);
    });
};

//экспорт запроса на добавление новой карточки
export const makePostFetch = (newDataObject) => {
    return fetch (`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(newDataObject)
    })
    .then(res => {
        return checkPromiseStatus(res);
    });
};

//экспорт запроса на удаление карточки
export const deleteApi = (cardId) => {
    return fetch (`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .then(res => {
        return checkPromiseStatus(res);
    });
};

//экспорт запроса на сохранение лайка
export const putLikeCard = (cardId) => {
    return fetch (`${config.baseUrl}/cards/likes/${cardId}`, {
            method: 'PUT',
            headers: config.headers
    })
    .then(res => {
        return checkPromiseStatus(res);
    });
};

export const deleteLikeCard = (cardId) => {
    return fetch (`${config.baseUrl}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: config.headers
    })
    .then(res => {
        return checkPromiseStatus(res);
    });
}

function checkPromiseStatus(res) {
    if (res.ok) {
        return res.json(); //если все в порядке с запросом возвращаем ответ с сервера
    }
    return Promise.reject(`Код ошибки: ${res.status}`); //в случае ошибки
};