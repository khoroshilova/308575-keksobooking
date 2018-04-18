'use strict';

document.querySelector('.map').classList.remove('map--faded');

// Переменные
var CARDS_COUNT = 8;
var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var CHECKIN_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];
var CHECKOUT_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 150;
var LOCATION_Y_MAX = 500;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var GUESTS_MIN = 1;
var GUESTS_MAX = 9;
var IMG_WIDTH = 45;
var IMG_HEIGHT = 40;
var PIN_HEIGHT = 70;

// Получить случайный элемент из массива
var getRandomItem = function (array) {
  var randomItem = array[Math.floor(Math.random() * array.length)];
  return randomItem;
};

// Получить случайное число
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Получить массив случайной длины
var getRandomArrayLength = function (array) {
  return array.slice(0, getRandomNumber(1, array.length));
};

// Удалить дочерние элементы
var removeChildren = function (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

// Получить массив похожих объявлений
var getDataArray = function (adsCount) {
  var adsArray = [];

  for (var i = 0; i < adsCount; i++) {
    var locationX = getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX);
    var locationY = getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX);

    adsArray[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: getRandomItem(TITLES),
        address: locationX + ', ' + locationY,
        price: getRandomNumber(PRICE_MIN, PRICE_MAX),
        type: getRandomItem(TYPES),
        rooms: getRandomNumber(ROOMS_MIN, ROOMS_MAX),
        guests: getRandomNumber(GUESTS_MIN, GUESTS_MAX),
        checkin: getRandomItem(CHECKIN_TIMES),
        checkout: getRandomItem(CHECKOUT_TIMES),
        features: getRandomArrayLength(FEATURES),
        description: '',
        photos: PHOTOS
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  }
  return adsArray;
};

var map = document.querySelector('.map');
var mapPinsContainer = map.querySelector('.map__pins');
var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');
var ads = getDataArray(CARDS_COUNT);

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
  photoElement.alt = 'Фотография жилья';
  return photoElement;
};

// Создать и добавить коллекцию данных в объявлении
var createCollectionFromArray = function (array, renderFunction) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(renderFunction(array[i]));
  }
  return fragment;
};

// Создаать элемент объявления
var createCardElement = function (ad) {
  var cardElement = cardTemplate.cloneNode(true);
  var popupFeatures = cardElement.querySelector('.popup__features');
  var popupPhotos = cardElement.querySelector('.popup__photos');
  var popupType = cardElement.querySelector('.popup__type');

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

var openCard = function (ad) {
  map.insertBefore(renderCard(ad), map.querySelector('.map__filters-container'));
};

// Создать элемент метки
var createPinElement = function (ad) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinAvatar = pinElement.querySelector('img');

  pinElement.style.left = ad.location.x + 'px';
  pinElement.style.top = ad.location.y - PIN_HEIGHT / 2 + 'px';
  pinAvatar.src = ad.author.avatar;
  pinAvatar.alt = ad.offer.title;
  openCard(ad);
  return pinElement;
};

// Функция отрисовки меток объявлений
var renderPins = function (adsArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < adsArray.length; i++) {
    fragment.appendChild(createPinElement(adsArray[i]));
  }
  return fragment;
};

mapPinsContainer.appendChild(renderPins(ads));
