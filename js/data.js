'use strict';

(function () {
  // Создание массива данных

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

  // Получить случайное число
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Получить случайный элемент из массива
  var getRandomItem = function (array) {
    return array[getRandomNumber(0, array.length - 1)];
  };

  // Получить массив случайной длины
  var getRandomArrayLength = function (array) {
    return array.slice(0, getRandomNumber(0, array.length));
  };

  // Получить массив похожих объявлений
  var getDataArray = function (adsCount) {
    var adsArray = [];

    for (var i = 0; i < adsCount; i++) {
      var locationX = getRandomNumber(LOCATION_X_MIN, LOCATION_X_MAX);
      var locationY = getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX);

      adsArray.push({
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
      });
    }
    return adsArray;
  };

  window.data = {
    getDataArray: getDataArray
  };
})();
