'use strict';

(function () {
  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 62;
  var PIN_ARROW_HEIGHT = 22;
  var PIN_MAIN_START_X = 570;
  var PIN_MAIN_START_Y = 375;
  var LOCATION_X_MIN = 0;
  var LOCATION_X_MAX = 1135;
  var LOCATION_Y_MIN = 200;
  var LOCATION_Y_MAX = 700;
  var ESC_KEYCODE = 27;
  var ENABLE_FORM_FIELDS = false;
  var DISABLE_FORM_FIELDS = true;
  var PINS_COUNT = 5;

  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapFilters = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var typeField = adForm.querySelector('#type');
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var roomNumberField = adForm.querySelector('#room_number');
  var pageState = 'disabled';

  // При успешном запросе
  var onLoad = function (data) {
    window.ads = data;
    var slicedAds = window.ads.slice(0, PINS_COUNT);
    mapPinsContainer.appendChild(window.pin.renderPins(slicedAds));
  };

  // Переключение состояния страницы
  var enablePageState = function () {
    window.backend.load(onLoad, window.error.errorHandler);
    window.form.setAddressFieldValue('dragged');

    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    mapFilters.addEventListener('change', window.filter.onFilterChange);
    typeField.addEventListener('change', window.form.onTypeFieldChange);
    timeInField.addEventListener('change', window.form.onTimeInFieldChange);
    timeOutField.addEventListener('change', window.form.onTimeOutFieldChange);
    roomNumberField.addEventListener('change', window.form.onRoomNumberFieldChange);
    window.form.changeAdFormFieldsState(ENABLE_FORM_FIELDS);
    pageState = 'enabled';
  };

  // Закрыть карточку при нажатии на кнопку ESC
  var onCardEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.map.closeCard();
    }
  };

  // Орисовать объявления
  var renderCard = function (ad) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.card.createCardElement(ad));
    return fragment;
  };

  // Активировать карту при перемещении главного маркера
  var onMainPinDrag = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');

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

      var isAvialibleX = finishCoordsX + (PIN_MAIN_WIDTH / 2) > LOCATION_X_MIN && finishCoordsX + (PIN_MAIN_WIDTH / 2) < LOCATION_X_MAX;
      var isAvialibleY = finishCoordsY + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT > LOCATION_Y_MIN && finishCoordsY + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT < LOCATION_Y_MAX;

      if (isAvialibleX) {
        mapPinMain.style.left = finishCoordsX + 'px';
      }

      if (isAvialibleY) {
        mapPinMain.style.top = finishCoordsY + 'px';
      }
      window.form.setAddressFieldValue('dragged');
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      if (pageState === 'disabled') {
        enablePageState();
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mapPinMain.addEventListener('mousedown', onMainPinDrag);

  window.map = {
    disableFormFields: function () {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      adForm.reset();

      mapPinMain.style.left = PIN_MAIN_START_X + 'px';
      mapPinMain.style.top = PIN_MAIN_START_Y + 'px';
      window.pin.removePins();
      var openedCard = map.querySelector('.map__card');
      if (openedCard) {
        openedCard.remove();
      }
      window.form.changeAdFormFieldsState(DISABLE_FORM_FIELDS);
      window.form.setAddressFieldValue();
      mapFilters.removeEventListener('change', window.filter.onFilterChange);
      typeField.removeEventListener('change', window.form.onTypeFieldChange);
      timeInField.removeEventListener('change', window.form.onTimeInFieldChange);
      timeOutField.removeEventListener('change', window.form.onTimeOutFieldChange);
      roomNumberField.removeEventListener('change', window.form.onRoomNumberFieldChange);
      pageState = 'disabled';
    },
    openCard: function (ad) {
      map.insertBefore(renderCard(ad), map.querySelector('.map__filters-container'));
      document.addEventListener('keydown', onCardEscPress);
    },
    closeCard: function () {
      map.querySelector('.map__card').remove();
      var currentPin = map.querySelector('.map__pin--active');
      currentPin.classList.remove('map__pin--active');
      document.removeEventListener('keydown', onCardEscPress);
    }
  };
})();
