'use strict';

(function () {
  var IMG_WIDTH = 45;
  var IMG_HEIGHT = 40;
  var IMG_ALT = 'Фотография жилья';

  var template = document.querySelector('template');
  var cardTemplate = template.content.querySelector('.map__card');

  // Создать изображения особенностей в объявлении
  var createFeatureItem = function (item) {
    var featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature');
    featureItem.classList.add('popup__feature--' + item);
    return featureItem;
  };

  // Создать фотографии жилья в объявлении
  var createPhotoItem = function (item) {
    var photoItem = document.createElement('img');
    photoItem.src = item;
    photoItem.width = IMG_WIDTH;
    photoItem.height = IMG_HEIGHT;
    photoItem.classList.add('popup__photo');
    photoItem.alt = IMG_ALT;
    return photoItem;
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

  // Создать элемент объявления
  var createCardItem = function (ad) {
    var cardItem = cardTemplate.cloneNode(true);
    var cardItemFeatures = cardItem.querySelector('.popup__features');
    var cardItemPhotos = cardItem.querySelector('.popup__photos');
    var cardItemTypes = cardItem.querySelector('.popup__type');
    var cardItemClose = cardItem.querySelector('.popup__close');

    cardItemClose.addEventListener('click', window.map.closeCard);

    cardItem.querySelector('.popup__title').textContent = ad.offer.title;
    cardItem.querySelector('.popup__text--address').textContent = ad.offer.address;
    cardItem.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    switch (ad.offer.type) {
      case 'flat':
        cardItemTypes.textContent = 'Квартира';
        break;
      case 'bungalo':
        cardItemTypes.textContent = 'Бунгало';
        break;
      case 'house':
        cardItemTypes.textContent = 'Дом';
        break;
      case 'palace':
        cardItemTypes.textContent = 'Дворец';
        break;
    }
    cardItem.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    cardItem.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    removeChildren(cardItemFeatures);
    cardItemFeatures.appendChild(createCollectionFromArray(ad.offer.features, createFeatureItem));

    cardItem.querySelector('.popup__description').textContent = ad.offer.description;

    removeChildren(cardItemPhotos);
    cardItemPhotos.appendChild(createCollectionFromArray(ad.offer.photos, createPhotoItem));

    cardItem.querySelector('.popup__avatar').src = ad.author.avatar;

    return cardItem;
  };

  window.card = {
    createCardItem: createCardItem
  };
})();
