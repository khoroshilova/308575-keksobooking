'use strict';

(function () {
  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 62;
  var PIN_ARROW_HEIGHT = 22;
  var PIN_MAIN_START_X = 570;
  var PIN_MAIN_START_Y = 375;
  var LOCATION_X_MIN = 30;
  var LOCATION_X_MAX = 1160;
  var LOCATION_Y_MIN = 150;
  var LOCATION_Y_MAX = 500;
  var ESC_KEYCODE = 27;
  var ENABLE_FORM_FIELDS = false;
  var DISABLE_FORM_FIELDS = true;

  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapFilters = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var typeField = adForm.querySelector('#type');
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var roomNumberField = adForm.querySelector('#room_number');
  var pageState = 'disabled';

  var ads = [];
  var onLoad = function (data) {
    window.map.ads = data;
    window.filter.updatePins();
  };

  // Переключение состояния страницы
  var enablePageState = function () {
    window.backend.load(onLoad, window.error.createErrorMessage);
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
    fragment.appendChild(window.card.createCardItem(ad));
    return fragment;
  };

  // Активировать карту при перемещении главного маркера
  var onMainPinDrag = function (evt) {
    evt.preventDefault();

    var startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');

      var shift = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      };

      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var finishCoordinatesX = (mapPinMain.offsetLeft - shift.x);
      var finishCoordinatessY = (mapPinMain.offsetTop - shift.y);

      var isAvialibleX = finishCoordinatesX + (PIN_MAIN_WIDTH / 2) > LOCATION_X_MIN && finishCoordinatesX + (PIN_MAIN_WIDTH / 2) < LOCATION_X_MAX;
      var isAvialibleY = finishCoordinatessY + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT > LOCATION_Y_MIN && finishCoordinatessY + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT < LOCATION_Y_MAX;

      if (isAvialibleX) {
        mapPinMain.style.left = finishCoordinatesX + 'px';
      }

      if (isAvialibleY) {
        mapPinMain.style.top = finishCoordinatessY + 'px';
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
    ads: ads,
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
      var mapCard = map.querySelector('.map__card');
      if (mapCard) {
        mapCard.removeEventListener('click', window.map.closeCard);
        mapCard.remove();
        document.removeEventListener('keydown', onCardEscPress);
      }
      var currentPin = map.querySelector('.map__pin--active');
      currentPin.classList.remove('map__pin--active');
    }
  };
})();
