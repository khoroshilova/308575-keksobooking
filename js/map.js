'use strict';

(function () {
  // Управление карточками и пинами

  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 62;
  var PIN_ARROW_HEIGHT = 22;
  var ENABLE_FORM_FIELDS = false;
  var PIN_MAIN_LIMIT_X = [0, 1135];
  var PIN_MAIN_LIMIT_Y = [100, 625];

  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormAddres = adForm.querySelector('#address');

  // Функция отрисовки меток объявлений
  var renderPins = function (ad) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ad.length; i++) {
      fragment.appendChild(window.pin.createPinElement(ad[i]));
    }
    return fragment;
  };

  // При успешном запросе
  var onLoad = function (ads) {
    mapPinsContainer.appendChild(renderPins(ads));
  };

  // Ошибка
  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'fixed';
    node.style.top = 0;
    node.style.left = 0;
    node.style.fontSize = '24px';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  // Вычисление координат главной метки
  var calculateMainPinCoords = function (pinState) {
    var coordX = mapPinMain.offsetLeft + (PIN_MAIN_WIDTH / 2);
    var coordY = mapPinMain.offsetTop + (PIN_MAIN_HEIGHT / 2);

    if (pinState === 'dragged') {
      coordY = mapPinMain.offsetTop + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT;
    }
    return coordX + ', ' + coordY;
  };

  // Включить поля формы
  var enableFormFields = function () {
    adForm.classList.remove('ad-form--disabled');
    adFormFieldsets.forEach(function (item) {
      item.removeAttribute('disabled');
    });
  };

  // Активировать карту при перемещении метки
  var onMainPinDrag = function () {
    map.classList.remove('map--faded');
    // isPinDragged = true;
    window.backend.load(onLoad, errorHandler);
    // adFormAddres.value = calculateMainPinCoords();
    calculateMainPinCoords();
    adForm.classList.remove('ad-form--disabled');
    enableFormFields(ENABLE_FORM_FIELDS);
  };

  // Изменение координат главного маркера
  var changeMainPinCoords = function () {
    var changeMainPinX = Math.floor(parseInt(mapPinMain.style.left, 10) + PIN_MAIN_WIDTH / 2);
    var changeMainPinY = Math.floor(parseInt(mapPinMain.style.top, 10) + PIN_MAIN_HEIGHT);
    adFormAddres.value = changeMainPinX + ', ' + (changeMainPinY + PIN_ARROW_HEIGHT);
  };

  // Перетаскивание главного маркера
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var finishCoordsX = (mapPinMain.offsetLeft - shift.x);
      var finishCoordsY = (mapPinMain.offsetTop - shift.y);

      if (finishCoordsX < PIN_MAIN_LIMIT_X[0]) {
        finishCoordsX = PIN_MAIN_LIMIT_X[0];
      } else if (finishCoordsX > PIN_MAIN_LIMIT_X[1]) {
        finishCoordsX = PIN_MAIN_LIMIT_X[1];
      }

      if (finishCoordsY < PIN_MAIN_LIMIT_Y[0]) {
        finishCoordsY = PIN_MAIN_LIMIT_Y[0];
      } else if (finishCoordsY > PIN_MAIN_LIMIT_Y[1]) {
        finishCoordsY = PIN_MAIN_LIMIT_Y[1];
      }

      mapPinMain.style.left = finishCoordsX + 'px';
      mapPinMain.style.top = finishCoordsY + 'px';
      changeMainPinCoords();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      onMainPinDrag();
      changeMainPinCoords();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };


    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Отключить поля формы
  var disableFormFields = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    adForm.reset();

    mapPinMain.style.left = 570 + 'px';
    mapPinMain.style.top = 375 + 'px';
    var pins = mapPinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
    var openedCard = map.querySelector('.map__card');
    if (openedCard) {
      openedCard.remove();
    }
  };

  window.map = {
    calculateMainPinCoords: calculateMainPinCoords,
    disableFormFields: disableFormFields,
    errorHandler: errorHandler
  };
})();
