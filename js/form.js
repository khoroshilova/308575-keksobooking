'use strict';

(function () {
  var VALID_CAPACITY = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  var VALID_CAPACITY_TEXT = 'Выберите допустимое количество гостей';
  var TIMEOUT = 2000;
  var ENABLE_FORM_FIELDS = false;
  var DISABLE_FORM_FIELDS = true;

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormAddres = adForm.querySelector('#address');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormCheckIn = adForm.querySelector('#timein');
  var adFormCheckOut = adForm.querySelector('#timeout');
  var adFormRoomsNumber = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var buttonReset = adForm.querySelector('.ad-form__reset');

  var AdTypePrices = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  var onRoomNumberFieldChange = function () {
    if (adFormCapacity.options.length > 0) {
      [].forEach.call(adFormCapacity.options, function (item) {
        item.selected = VALID_CAPACITY[adFormRoomsNumber.value][0] === item.value;
        item.disabled = VALID_CAPACITY[adFormRoomsNumber.value].indexOf(item.value) === -1;
      });
    }
  };

  // Функция установки значения в поле адреса
  var setAddressFieldValue = function (pinState) {
    adFormAddres.value = window.pin.calculateCoordinates(pinState);
  };

  // Функция включения / отключения полей формы
  var changeAdFormFieldsState = function (value) {
    adFormFieldsets.forEach(function (item) {
      item.disabled = value;
    });
  };

  // Поля Время заезда и выезда
  var onTimeInFieldChange = function () {
    adFormCheckOut.options.selectedIndex = adFormCheckIn.options.selectedIndex;
  };

  var onTimeOutFieldChange = function () {
    adFormCheckIn.options.selectedIndex = adFormCheckOut.options.selectedIndex;
  };

  // Поля Тип жилья и цена
  var onTypeFieldChange = function () {
    var typeSelectedValue = adFormType.options[adFormType.selectedIndex].value;
    adFormPrice.placeholder = AdTypePrices[typeSelectedValue];
    adFormPrice.min = AdTypePrices[typeSelectedValue];
  };

  var onButtonResetClick = function () {
    window.map.reset();
    onRoomNumberFieldChange();
    onTypeFieldChange();
  };

  // Успешная отправка
  var onSuccess = function () {
    window.map.reset();
    adForm.reset();
    onRoomNumberFieldChange();
    var successMessage = document.querySelector('.success');
    successMessage.classList.remove('hidden');
    var hideSuccessMessage = function () {
      successMessage.classList.add('hidden');
    };
    setTimeout(hideSuccessMessage, TIMEOUT);
  };

  var onAdFormSubmit = function (evt) {
    if (onRoomNumberFieldChange.disabled) {
      adFormCapacity.setCustomValidity(VALID_CAPACITY_TEXT);
      return;
    }
    window.backend.save(new FormData(adForm), onSuccess, window.error.show);
    evt.preventDefault();
  };

  var init = function () {
    adFormType.addEventListener('change', onTypeFieldChange);
    adFormCheckIn.addEventListener('change', onTimeInFieldChange);
    adFormCheckOut.addEventListener('change', onTimeOutFieldChange);
    adFormRoomsNumber.addEventListener('change', onRoomNumberFieldChange);
    changeAdFormFieldsState(ENABLE_FORM_FIELDS);

    // Клик на кнопку очистить
    buttonReset.addEventListener('click', onButtonResetClick);
    adForm.addEventListener('submit', onAdFormSubmit);

    setAddressFieldValue('dragged');
    adForm.classList.remove('ad-form--disabled');
  };

  var reset = function () {
    adFormType.removeEventListener('change', onTypeFieldChange);
    adFormCheckIn.removeEventListener('change', onTimeInFieldChange);
    adFormCheckOut.removeEventListener('change', onTimeOutFieldChange);
    adFormRoomsNumber.removeEventListener('change', onRoomNumberFieldChange);
    adForm.removeEventListener('submit', onAdFormSubmit);
    buttonReset.removeEventListener('click', onButtonResetClick);
    changeAdFormFieldsState(DISABLE_FORM_FIELDS);
    setAddressFieldValue();
    adForm.classList.add('ad-form--disabled');
  };

  window.form = {
    setAddressFieldValue: setAddressFieldValue,
    changeAdFormFieldsState: changeAdFormFieldsState,
    reset: reset,
    init: init
  };
})();
