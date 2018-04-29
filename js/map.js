'use strict';

(function () {
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
  var addressField = adForm.querySelector('#address');

  // Функция отрисовки меток объявлений
  var renderPins = function (adsArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < adsArray.length; i++) {
      fragment.appendChild(window.pin.createPinElement(adsArray[i]));
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

  var CARDS_COUNT = 8;
  var ads = window.data.getDataArray(CARDS_COUNT);

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
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
