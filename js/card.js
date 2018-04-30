'use strict';

(function () {
  // Создание карточки объявления

  var IMG_WIDTH = 45;
  var IMG_HEIGHT = 40;
  var IMG_ALT = 'Фотография жилья';
  var ESC_KEYCODE = 27;

  var map = document.querySelector('.map');
  var template = document.querySelector('template');
  var cardTemplate = template.content.querySelector('.map__card');
  var filtersContainer = map.querySelector('.map__filters-container');

  // Создать изображения особенностей в объявлении
  var createFeatureElement = function (item) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('popup__feature');
    featureElement.classList.add('popup__feature--' + item);
    return featureElement;
  };

  // Создать фотографии жилья в объявлении
  var createPhotoElement = function (item) {
    var photoElement = document.createElement('img');
    photoElement.src = item;
    photoElement.width = IMG_WIDTH;
    photoElement.height = IMG_HEIGHT;
    photoElement.classList.add('popup__photo');
    photoElement.alt = IMG_ALT;
    return photoElement;
  };

  // Создать и добавить коллекцию данных в объявлении
  var createCollectionFromArray = function (array, renderFunction) {
    var fragment = document.createDocumentFragment();
    array.forEach(function (item) {
      fragment.appendChild(renderFunction(item));
    });
    return fragment;
  };

  // Удалить дочерние элементы
  var removeChildren = function (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  // Создаать элемент объявления
  var createCardElement = function (ad) {
    var cardElement = cardTemplate.cloneNode(true);
    var popupFeatures = cardElement.querySelector('.popup__features');
    var popupPhotos = cardElement.querySelector('.popup__photos');
    var popupType = cardElement.querySelector('.popup__type');
    var popupClose = cardElement.querySelector('.popup__close');

    popupClose.addEventListener('click', onPopupCloseClick);

    cardElement.querySelector('.popup__title').textContent = ad.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    switch (ad.offer.type) {
      case 'flat':
        popupType.textContent = 'Квартира';
        break;
      case 'bungalo':
        popupType.textContent = 'Бунгало';
        break;
      case 'house':
        popupType.textContent = 'Дом';
        break;
      case 'palace':
        popupType.textContent = 'Дворец';
        break;
    }
    cardElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    removeChildren(popupFeatures);
    popupFeatures.appendChild(createCollectionFromArray(ad.offer.features, createFeatureElement));
    cardElement.querySelector('.popup__description').textContent = ad.offer.description;
    removeChildren(popupPhotos);
    popupPhotos.appendChild(createCollectionFromArray(ad.offer.photos, createPhotoElement));
    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;

    return cardElement;
  };

  // Функция отрисовки объявления
  var renderCard = function (ad) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(createCardElement(ad));
    return fragment;
  };

  // Добавить объявление на карту
  var openCard = function (ad) {
    map.insertBefore(renderCard(ad), filtersContainer);
    document.addEventListener('keydown', onCardEscPress);
  };

  var closeCard = function () {
    map.querySelector('.map__card').remove();
    var currentPin = map.querySelector('.map__pin--active');
    currentPin.classList.remove('map__pin--active');
    document.removeEventListener('keydown', onCardEscPress);
  };

  // Закрытие карточки при нажатии кнопки ESC
  var onCardEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeCard();
    }
  };

  // Закрытие карточки при клике на крестик
  var onPopupCloseClick = function () {
    closeCard();
  };

  window.card = {
    openCard: openCard,
    closeCard: closeCard
  };
})();
