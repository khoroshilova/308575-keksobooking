'use strict';

(function () {

  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 62;
  var PIN_ARROW_HEIGHT = 22;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');
  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');

  window.pin = {
    // Создать элемент метки
    makePinItem: function (ad) {
      var pinItem = pinTemplate.cloneNode(true);
      var pinAvatar = pinItem.querySelector('img');

      pinItem.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
      pinItem.style.top = ad.location.y - PIN_HEIGHT + 'px';
      pinAvatar.src = ad.author.avatar;
      pinAvatar.alt = ad.offer.title;

      pinItem.addEventListener('click', function () {
        if (map.querySelector('.map__card')) {
          window.map.closeCard();
        }
        window.map.openCard(ad);
        pinItem.classList.add('map__pin--active');
      });

      return pinItem;
    },

    // Функция вычисления координат главной метки
    calculateMainPinCoordinates: function (pinState) {
      var coordinatesX = mapPinMain.offsetLeft + (PIN_MAIN_WIDTH / 2);
      var coordinatesY = mapPinMain.offsetTop + (PIN_MAIN_HEIGHT / 2);

      if (pinState === 'dragged') {
        coordinatesY = mapPinMain.offsetTop + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT;
      }

      return coordinatesX + ', ' + coordinatesY;
    },

    // Функция отрисовки меток объявлений
    renderPins: function (adsArray) {
      var fragment = document.createDocumentFragment();

      adsArray.forEach(function (it) {
        fragment.appendChild(window.pin.makePinItem(it));
      });

      return fragment;
    },

    // Функция удаления отрисованных меток
    removePins: function () {
      var pins = mapPinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
      pins.forEach(function (pin) {
        pin.remove();
      });
    }
  };
})();
