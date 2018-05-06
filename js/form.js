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
  var onButtonSubmit = adForm.querySelector('.ad-form__submit');
  var AdTypePrices = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  var onRoomNumberFieldChange = function () {
    var roomSelectedValue = adFormRooms.options[adFormRooms.selectedIndex].value;
    var capacityAllowedValues = VALID_CAPACITY[roomSelectedValue];

    var capacityAllowedOptions = [];

    for (var i = 0; i < capacityAllowedValues.length; i++) {
      var index = capacityAllowedValues[i];
      for (var j = 0; j < adFormCapacity.options.length; j++) {
        if (adFormCapacity.options[j].value === index) {
          capacityAllowedOptions.push(adFormCapacity.options[j]);
        } else {
          adFormCapacity.options[j].disabled = true;
        }
      }
    }

    for (i = 0; i < capacityAllowedOptions.length; i++) {
      capacityAllowedOptions[i].disabled = false;
    }
  };

  // Функция установки значения в поле адреса
  var setAddressFieldValue = function (pinState) {
    adFormAddres.value = window.pin.calculateMainPinCoords(pinState);
  };

  // Функция включения / отключения полей формы
  var changeAdFormFieldsState = function (value) {
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = value;
    }
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

  // Клик на кнопку Отправить
  onButtonSubmit.addEventListener('click', function () {
    var capacitySelectedOption = adFormCapacity.options[adFormCapacity.selectedIndex];
    if (capacitySelectedOption.disabled) {
      adFormCapacity.setCustomValidity(VALID_CAPACITY_TEXT);
    } else {
      adFormCapacity.setCustomValidity('');
    }
  });

  // Успешная отправка
  var onSuccess = function () {
    window.map.disableFormFields();
    var successMessage = document.querySelector('.success');
    successMessage.classList.remove('hidden');
    var hideSuccessMsg = function () {
      successMessage.classList.add('hidden');
    };
    setTimeout(hideSuccessMsg, 2000);
  };

  // Отправка формы
  adForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(adForm), onSuccess, window.error.errorHandler);
    evt.preventDefault();
  });

  window.form = {
    setAddressFieldValue: setAddressFieldValue,
    changeAdFormFieldsState: changeAdFormFieldsState,
    onTypeFieldChange: onTypeFieldChange,
    onTimeInFieldChange: onTimeInFieldChange,
    onTimeOutFieldChange: onTimeOutFieldChange,
    onRoomNumberFieldChange: onRoomNumberFieldChange,
  };
})();
