'use strict';

(function () {
  var VALID_CAPACITY = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0'],
  };
  var VALID_CAPACITY_TEXT = 'Выберите допустимое количество гостей';
  var DISABLE_FORM_FIELDS = true;

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormAddres = adForm.querySelector('#address');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormCheckIn = adForm.querySelector('#timein');
  var adFormCheckOut = adForm.querySelector('#timeout');
  var adFormRooms = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var onButtonReset = adForm.querySelector('.ad-form__reset');
  var AdTypePrices = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  var onRoomNumberFieldChange = function () {
    var roomSelectedValue = adFormRooms.options[adFormRooms.selectedIndex].value;

    var capacityAllowedOptions =
    Array.from(adFormCapacity.options).filter(function (item) {
      item.disabled = true;
      return VALID_CAPACITY[roomSelectedValue].indexOf(item.value) !== -1;
    });
    capacityAllowedOptions.forEach(function (item) {
      item.disabled = false;
    });
  };

  // Функция установки значения в поле адреса
  var setAddressFieldValue = function (pinState) {
    adFormAddres.value = window.pin.calculateMainPinCoordinates(pinState);
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

  setAddressFieldValue();
  changeAdFormFieldsState(DISABLE_FORM_FIELDS);

  // Клик на кнопку очистить
  onButtonReset.addEventListener('click', function () {
    window.map.disableFormFields();
    onRoomNumberFieldChange();
  });

  // Успешная отправка
  var onSuccess = function () {
    window.map.disableFormFields();
    adForm.reset();
    onRoomNumberFieldChange();
    var successMessage = document.querySelector('.success');
    successMessage.classList.remove('hidden');
    var hideSuccessMessage = function () {
      successMessage.classList.add('hidden');
    };
    setTimeout(hideSuccessMessage, 2000);
  };

  adForm.addEventListener('submit', function (evt) {
    if (onRoomNumberFieldChange.disabled) {
      adFormCapacity.setCustomValidity(VALID_CAPACITY_TEXT);
      return;
    }
    window.backend.save(new FormData(adForm), onSuccess, window.error.createErrorMessage);
    evt.preventDefault();
  });

  window.form = {
    setAddressFieldValue: setAddressFieldValue,
    changeAdFormFieldsState: changeAdFormFieldsState,
    onTypeFieldChange: onTypeFieldChange,
    onTimeInFieldChange: onTimeInFieldChange,
    onTimeOutFieldChange: onTimeOutFieldChange,
    onRoomNumberFieldChange: onRoomNumberFieldChange
  };
})();
