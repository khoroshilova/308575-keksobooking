'use strict';

document.querySelector('.map').classList.remove('map--faded');

var CARDS_COUNT = 8;
var AVATARS = ['1', '2', '3', '4', '5', '6', '7', '8'];
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
var TYPES = ['flat', 'bungalo', 'house', 'palace'];
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
var GAP_X = 25;
var GAP_Y = 70;
var IMG_WIDTH = 40;
var IMG_HEIGHT = 40;

var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var filterContainer = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('template').content;
var cardPhotos = cardTemplate.querySelector('.popup__photos');
var cardPhoto = cardTemplate.querySelector('.popup__photo');

// Создание случайного числа
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Генерация случайных данных из любого массива
var getRandomItem = function (items) {
  return items[Math.floor(Math.random() * items.length)];
};

// Создание массива особенностей из строк случайной длины
var getRandomFeature = function () {
  return FEATURES.slice(getRandomNumber(0, FEATURES.length));
};

// Создание случайных неповторяющихся аватарок
var avatarsCopy = AVATARS.slice();
var getRandomAvatar = function () {
  return 'img/avatars/user' + '0' + avatarsCopy.shift() + '.png';
};

// Генерация случайных данных
var getRandomData = function () {
  var locationX = getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX);
  var locationY = getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX);
  return {
    author: {
      avatar: getRandomAvatar()
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
      features: getRandomFeature(FEATURES),
      description: ' ',
      photos: PHOTOS
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

// Создание массива одного объявления
var cards = [];
var getCard = function () {
  for (var i = 0; i < CARDS_COUNT; i++) {
    cards[i] = getRandomData();
  }
};

// Создание метки
var renderPin = function () {
  for (var i = 0; i < cards.length; i++) {
    var pin = document.createElement('button');
    var img = document.createElement('img');
    pin.type = 'button';
    pin.classList.add('map__pin');
    pin.style.left = cards[i].location.x - GAP_X + 'px';
    pin.style.top = cards[i].location.y - GAP_Y + 'px';

    img.src = cards[i].author.avatar;
    img.width = IMG_WIDTH;
    img.height = IMG_HEIGHT;
    img.alt = cards[i].offer.title;

    mapPins.appendChild(pin);
    pin.appendChild(img);
  }
};

getCard();
renderPin();

// Создание фотографий недвижимости в объявлении
var cardCreatePhotos = function () {
  for (var i = 0; i < PHOTOS.length; i++) {
    var cardPhotoX = cardPhoto.cloneNode(true);
    cardPhotos.appendChild(cardPhotoX);
    cardPhotoX.src = cards[0].offer.photos[i];
  }
  cardPhoto.parentNode.removeChild(cardPhoto);
};

var renderCard = function () {
  var cardElement = cardTemplate.cloneNode(true);
  map.insertBefore(cardElement, filterContainer);
};

var initCard = function () {
  cardTemplate.querySelector('.popup__title').textContent = cards[0].offer.title;
  cardTemplate.querySelector('.popup__text--address').textContent = cards[0].offer.address;
  cardTemplate.querySelector('.popup__text--price').textContent = cards[0].offer.price + '₽/ночь';
  var typeOfHousing;
  if (cards[0].offer.type === 'flat') {
    typeOfHousing = 'Квартира';
  } else if (cards[0].offer.type === 'bungalo') {
    typeOfHousing = 'Лачуга';
  } else if (cards[0].offer.type === 'palace') {
    typeOfHousing = 'Дворец';
  } else {
    typeOfHousing = 'Дом';
  }
  cardTemplate.querySelector('.popup__type').textContent = typeOfHousing;
  cardTemplate.querySelector('.popup__text--capacity').textContent = cards[0].offer.rooms + ' комнаты для ' + cards[0].offer.guests + ' гостей';
  cardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + cards[0].offer.checkin + ', выезд до ' + cards[0].offer.checkout;
  cardTemplate.querySelector('.popup__features').textContent = cards[0].offer.features;
  cardTemplate.querySelector('.popup__description').textContent = cards[0].offer.description;
  cardCreatePhotos();
  cardTemplate.querySelector('.popup__avatar').src = cards[0].author.avatar;
  renderCard();
};

initCard();
