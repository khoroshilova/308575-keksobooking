'use strict';

(function () {
  // Фомра объявления

  var VALID_CAPACITY = {
    1: ['1'],
    2: ['2', '1'],
    3: ['3', '2', '1'],
    100: ['0']
  };

  var VALID_CAPACITY_TEXT = 'Гостей не должно быть больше, чем комнат! ' +
    'Если у вас 100 комнат - ваш вариант "не для гостей"';

  var TIMEOUT = 2000;

  var adForm = document.querySelector('.ad-form');
  var adFormAddres = adForm.querySelector('#address');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormCheckIn = adForm.querySelector('#timein');
  var adFormCheckOut = adForm.querySelector('#timeout');
  var adFormRooms = adForm.elements.rooms;
  var adFormCapacity = adForm.elements.capacity;
  var onButtonReset = adForm.querySelector('.ad-form__reset');

  var setAddressValue = function (pinState) {
    adFormAddres.value = window.map.calculateMainPinCoords(pinState);
  };

  // Синхронизация цены и типа жилья
  var syncTypeAndPrice = function () {
    switch (adFormType.value) {
      case 'bungalo':
        adFormPrice.setAttribute('min', 0);
        adFormPrice.setAttribute('placeholder', 0);
        break;
      case 'flat':
        adFormPrice.setAttribute('min', 1000);
        adFormPrice.setAttribute('placeholder', 1000);
        break;
      case 'house':
        adFormPrice.setAttribute('min', 5000);
        adFormPrice.setAttribute('placeholder', 5000);
        break;
      case 'palace':
        adFormPrice.setAttribute('min', 10000);
        adFormPrice.setAttribute('placeholder', 10000);
        break;
    }
  };

  syncTypeAndPrice();
  adFormType.addEventListener('change', syncTypeAndPrice);

  // Синхронизация времени заезда и выезда
  var syncTimes = function (fieldset1, fieldset2) {
    fieldset1.addEventListener('change', function () {
      fieldset2.value = fieldset1.value;
    });
  };
  syncTimes(adFormCheckIn, adFormCheckOut);
  syncTimes(adFormCheckOut, adFormCheckIn);

  // Синхронизация количества комнат и количества гостей
  var onRoomAndCapacityChange = function () {
    var selectRoom = adFormRooms.options[adFormRooms.selectedIndex].value;
    var selectCapacity = adFormCapacity.options[adFormCapacity.selectedIndex].value;
    var isCapasityFalse = VALID_CAPACITY[selectRoom].indexOf(selectCapacity) === -1;
    if (isCapasityFalse) {
      adFormCapacity.setCustomValidity(VALID_CAPACITY_TEXT);
    } else {
      adFormCapacity.setCustomValidity('');
    }
  };

  var syncRoomsAndCapacity = function () {
    adFormRooms.addEventListener('change', onRoomAndCapacityChange);
    adFormCapacity.addEventListener('change', onRoomAndCapacityChange);
  };

  setAddressValue();
  onRoomAndCapacityChange();
  syncRoomsAndCapacity();

  // Сброс формы
  onButtonReset.addEventListener('click', function () {
    window.map.disableFormFields();
    adFormCheckIn.removeEventListener('change', syncTimes);
    adFormCheckOut.removeEventListener('change', syncTimes);
    adFormRooms.removeEventListener('change', onRoomAndCapacityChange);
    adFormAddres.setAttribute('placeholder', '601, 406');
  });

  // Успешная отправка
  var successHandler = function () {
    window.map.disableFormFields();
    var successMessage = document.querySelector('.success');
    successMessage.classList.remove('hidden');
    var hideSuccessMsg = function () {
      successMessage.classList.add('hidden');
    };
    setTimeout(hideSuccessMsg, TIMEOUT);
    adFormAddres.setAttribute('placeholder', '601, 406');
  };

  // Ошибка
  var SHOW_ERROR_TIMEOUT = 3500;
  var errorHandler = function (onError) {
    var errorBlock = document.createElement('div');
    errorBlock.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    errorBlock.style.position = 'fixed';
    errorBlock.style.width = '100%';
    errorBlock.style.top = 0;
    errorBlock.style.left = 0;
    errorBlock.style.fontSize = '24px';
    errorBlock.style.color = 'white';
    errorBlock.textContent = onError;
    document.body.insertAdjacentElement('afterbegin', errorBlock);
    var removeErrorBlock = function () {
      errorBlock.classList.add('hidden');
    };
    setTimeout(removeErrorBlock, SHOW_ERROR_TIMEOUT);
  };

  // Отправка формы
  adForm.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(adForm), successHandler, errorHandler);
    evt.preventDefault();
  });

  window.form = {
    errorHandler: errorHandler
  };

})();
