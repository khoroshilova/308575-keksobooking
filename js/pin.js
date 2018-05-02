'use strict';

(function () {
// Создание пина

  var PIN_HEIGHT = 70;

  var map = document.querySelector('.map');
  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');

  // Создать элемент метки
  var createPinElement = function (ad) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinAvatar = pinElement.querySelector('img');

    pinElement.classList.add('map__pin');
    pinElement.style.left = ad.location.x + 'px';
    pinElement.style.top = ad.location.y - PIN_HEIGHT / 2 + 'px';
    pinAvatar.src = ad.author.avatar;
    pinAvatar.alt = ad.offer.title;

    pinElement.addEventListener('click', function () {
      if (map.querySelector('.map__card')) {
        window.card.closeCard();
      }
      window.card.openCard(ad);
      pinElement.classList.add('map__pin--active');
    });

    return pinElement;
  };

  window.pin = {
    createPinElement: createPinElement
  };
})();
