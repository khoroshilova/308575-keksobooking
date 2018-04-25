'use strict';

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
var IMG_ALT = 'Фотография жилья';
var PIN_HEIGHT = 70;
var PIN_MAIN_WIDTH = 62;
var PIN_MAIN_HEIGHT = 62;
var PIN_ARROW_HEIGHT = 22;
var ENABLE_FORM_FIELDS = false;
var ESC_KEYCODE = 27;

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

var map = document.querySelector('.map');
var mapPinsContainer = map.querySelector('.map__pins');
var mapPinMain = document.querySelector('.map__pin--main');
var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');
var filtersContainer = map.querySelector('.map__filters-container');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var addressField = adForm.querySelector('#address');
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

// Создать элемент метки
var createPinElement = function (ad) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinAvatar = pinElement.querySelector('img');

  pinElement.style.left = ad.location.x + 'px';
  pinElement.style.top = ad.location.y - PIN_HEIGHT / 2 + 'px';
  pinAvatar.src = ad.author.avatar;
  pinAvatar.alt = ad.offer.title;

  pinElement.addEventListener('click', function () {
    if (map.querySelector('.map__card')) {
      closeCard();
    }
    openCard(ad);
    pinElement.classList.add('map__pin--active');
  });

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


// Вычисление координат главной метки
var isPinDragged = false;
var calculateMainPinCoords = function (pinState) {
  var coordX = mapPinMain.offsetLeft + (PIN_MAIN_WIDTH / 2);
  var coordY = mapPinMain.offsetTop + (PIN_MAIN_HEIGHT / 2);

  if (pinState === 'dragged') {
    coordY = mapPinMain.offsetTop + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT;
  }

  return coordX + ', ' + coordY;
};

addressField.value = calculateMainPinCoords(isPinDragged);

// Включить / отключить поля формы
var changeAdFormFieldsState = function () {
  adForm.classList.remove('ad-form--disabled');
  adFormFieldsets.forEach(function (item) {
    item.removeAttribute('disabled');
  });
};

// Активировать карту при перемещении метки
var onMainPinDrag = function () {
  map.classList.remove('map--faded');
  mapPinsContainer.appendChild(renderPins(ads));
  isPinDragged = true;
  addressField.value = calculateMainPinCoords(isPinDragged);
  adForm.classList.remove('ad-form--disabled');
  changeAdFormFieldsState(ENABLE_FORM_FIELDS);
};

mapPinMain.addEventListener('mouseup', onMainPinDrag);

// Форма объявления
var adFormType = adForm.querySelector('#type');
var adFormPrice = adForm.querySelector('#price');
var adFormCheckIn = adForm.querySelector('#timein');
var adFormCheckOut = adForm.querySelector('#timeout');
var adFormRooms = adForm.elements.rooms;
var adFormCapacity = adForm.elements.capacity;
// var adFormSubmitButton = adForm.querySelector('.ad-form__submit');
// var adFormResetButton = adForm.querySelector('.ad-form__reset');

// Зависимоть цены от типа жилья
adFormType.addEventListener('change', function () {
  if (adFormType.value === 'bungalo') {
    adFormPrice.setAttribute('min', 0);
    adFormPrice.setAttribute('placeholder', 0);
  } else if (adFormType.value === 'flat') {
    adFormPrice.setAttribute('min', 1000);
    adFormPrice.setAttribute('placeholder', 1000);
  } else if (adFormType.value === 'house') {
    adFormPrice.setAttribute('min', 5000);
    adFormPrice.setAttribute('placeholder', 5000);
  } else if (adFormType.value === 'palace') {
    adFormPrice.setAttribute('min', 10000);
    adFormPrice.setAttribute('placeholder', 10000);
  }
});

// Синхронизация времени заезда и выезда
var syncTimes = function (fieldset1, fieldset2) {
  fieldset1.addEventListener('change', function () {
    fieldset2.value = fieldset1.value;
  });
};
syncTimes(adFormCheckIn, adFormCheckOut);
syncTimes(adFormCheckOut, adFormCheckIn);

// Синхронизация количества комнат и количества гостей
var syncRoomAndCapacity = function () {
  var validCapacity = {
    1: ['1'],
    2: ['2', '1'],
    3: ['3', '2', '1'],
    100: ['0']
  };
  var selectRoom = adFormRooms.options[adFormRooms.selectedIndex].value;
  var selectCapacity = adFormCapacity.options[adFormCapacity.selectedIndex].value;
  var isCapasityFalse = validCapacity[selectRoom].indexOf(selectCapacity) === -1;
  if (isCapasityFalse) {
    adFormCapacity.setCustomValidity('Гостей не должно быть больше, чем комнат! ' +
      'Если у вас 100 комнат - ваш вариант "не для гостей"');
  } else {
    adFormCapacity.setCustomValidity('');
  }
};

syncRoomAndCapacity();
