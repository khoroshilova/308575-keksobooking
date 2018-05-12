'use strict';

(function () {
  var PINS_COUNT = 5;

  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');

  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  var updatePins = function () {
    if (map.querySelector('.map__card')) {
      window.map.closeCard();
    }
    window.pin.removePins();
    var filteredPins = [];
    window.map.ads.some(function (it) {
      if (getType(it) && getPrice(it) && getRooms(it) && getCapacity(it) && getFeatures(it)) {
        filteredPins.push(it);
      }
      return filteredPins.length >= PINS_COUNT;
    });
    mapPinsContainer.appendChild(window.pin.renderPins(filteredPins));
  };

  var getType = function (ad) {
    return housingType.value === 'any' || housingType.value === ad.offer.type;
  };

  var getPrice = function (ad) {
    switch (housingPrice.value) {
      case 'low':
        return Price.LOW > ad.offer.price;
      case 'middle':
        return Price.LOW >= ad.offer.price && Price.HIGH >= ad.offer.price;
      case 'high':
        return Price.HIGH < ad.offer.price;
      default:
        return true;
    }
  };

  var getRooms = function (ad) {
    return housingRooms.value === 'any' || parseInt(housingRooms.value, 10) === ad.offer.rooms;
  };

  var getCapacity = function (ad) {
    return housingGuests.value === 'any' || parseInt(housingGuests.value, 10) <= ad.offer.guests;
  };

  var getFeatures = function (ad) {
    var checkedFeatures = mapFilters.querySelectorAll('input[type=checkbox]:checked');
    var hasFeatures = true;
    Array.from(checkedFeatures).some(function (item) {
      if (ad.offer.features.indexOf(item.value) === -1) {
        hasFeatures = false;
      }
    });
    return hasFeatures;
  };

  window.filter = {
    onFilterChange: function () {
      window.debounce(updatePins);
    },
    updatePins: updatePins
  };
})();
