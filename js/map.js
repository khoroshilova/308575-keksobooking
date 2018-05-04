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
  var renderPins = function (ads) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      fragment.appendChild(window.pin.createPinElement(ads[i]));
    }
    return fragment;
  };

  // При успешном запросе отрисовать пины
  var onLoad = function (ads) {
    mapPinsContainer.appendChild(renderPins(ads));
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
    window.backend.load(onLoad, window.form.errorHandler);
    calculateMainPinCoords();
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
    changeMainPinCoords();
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
  };
})();
