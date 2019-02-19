'use strict';

/*модуль сортировки обьявлений*/
(function () {
  var filters = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any'
  };

  var PRICE_RANGE = {
    'middle': {
      'from': 10000,
      'to': 49999
    },
    'low': {
      'from': 0,
      'to': 9999
    },
    'high': {
      'from': 50000,
      'to': Infinity
    }
  };

  var features = {
    'wifi': false,
    'dishwasher': false,
    'parking': false,
    'washer': false,
    'elevator': false,
    'conditioner': false
  };

  /*задание фильтров*/
  var setFilters = function (evt) {

    if (evt.target.name === 'features') {
      features[evt.target.value] = evt.target.checked;
      return;
    } else {
      filters[evt.target.name] = evt.target.value;
    }
  };

  var applyFilters = function () {
    /*тип*/
    var filterOfType = function (item) {
      return ( filters['housing-type'] === 'any' ||  item.offer.type === filters['housing-type']);
    };

    /*цена*/
    var filterOfPrice = function (item) {
      return (filters['housing-price'] === 'any' || item.offer.price >= PRICE_RANGE[filters['housing-price']].from && item.offer.price <= PRICE_RANGE[filters['housing-price']].to
      );
    };

    /*комнаты*/
    var filterOfRooms = function (item) {
      return ( filters['housing-rooms'] === 'any' || item.offer.rooms === parseInt(filters['housing-rooms'], 10)
      );
    };

    /*гости*/
    var filterOfGuests = function (item) {
      return (filters['housing-guests'] === 'any' || item.offer.guests === parseInt(filters['housing-guests'], 10)
      );
    };

    /*преимущества*/
    var filterOfFeatures = function (item) {
      var result = true;

      for (var key in features) {

        if (features[key] && item.offer.features.indexOf(key) === -1) {
          result = false;
          break;
        }

      }
      return result;
    };

    /*прогоняем через фильтр*/
    var filter = function () {
      return window.data.originPins.filter(function (item) {
        return (filterOfType(item) && filterOfPrice(item) && filterOfRooms(item) &&  filterOfGuests(item) && filterOfFeatures(item) );
      });
    };

    window.data.filtratedPins = filter();
    window.map.removePins();
    window.map.setPinsOnMap(window.data.filtratedPins);
  };

  var debouncePins = window.utils.debounce(applyFilters);

  window.data.mapFilters.addEventListener('change', function (evt) {
    window.map.removeCard();
    setFilters(evt);
    debouncePins();
  });

})();
