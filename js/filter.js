'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');

  var PINS_COUNT = 5;

  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  var updatePins = function () {
    if (map.querySelector('.map__card')) {
      window.map.closeCard();
    }
    window.pin.removePins();

    var filteredPins = window.ads.filter(function (it) {
      return getType(it) && getPrice(it) && getRooms(it) && getCapacity(it) && getFeatures(it);
    }).slice(0, PINS_COUNT);

    mapPinsContainer.append(window.pin.renderPins(filteredPins));
  };

  var getType = function (ad) {
    if (housingType.value === 'any') {
      return true;
    }
    return housingType.value === ad.offer.type;
  };

  var getPrice = function (ad) {
    switch (housingPrice.value) {
      case 'low':
        return Price.LOW >= ad.offer.price;
      case 'middle':
        return Price.LOW <= ad.offer.price && Price.HIGH >= ad.offer.price;
      case 'high':
        return Price.HIGH <= ad.offer.price;
      default:
        return true;
    }
  };

  var getRooms = function (ad) {
    if (housingRooms.value === 'any') {
      return true;
    }
    return parseInt(housingRooms.value, 10) === ad.offer.rooms;
  };

  var getCapacity = function (ad) {
    if (housingGuests.value === 'any') {
      return true;
    }
    return parseInt(housingGuests.value, 10) === ad.offer.guests;
  };

  var getFeatures = function (ad) {
    var checkedFeatures = mapFilters.querySelectorAll('input[type=checkbox]:checked');
    var hasFeatures = true;

    checkedFeatures.forEach(function (it) {
      if (ad.offer.features.indexOf(it.value) === -1) {
        hasFeatures = false;
      }
    });

    return hasFeatures;
  };

  window.filter = {
    onFilterChange: function () {
      window.debounce(updatePins);
    }
  };
})();
