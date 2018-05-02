'use strict';

(function () {
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var POST_URL = 'https://js.dump.academy/keksobooking';
  var SERVER_TIMEOUT = 10000;
  var STATUS_OK = 200;

  // var loadHandler = function (onLoad, onError) {
  //   var xhr = new XMLHttpRequest();
  //   xhr.responseType = 'json';
  //   xhr.addEventListener('load', function () {
  //     if (xhr.status === STATUS_OK) {
  //       onLoad(xhr.response);
  //     } else {
  //       onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
  //     }
  //   });
  //   xhr.addEventListener('error', function () {
  //     onError('Произошла ошибка соединения');
  //   });
  //   xhr.addEventListener('timeout', function () {
  //     onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
  //   });
  //   xhr.timeout = SERVER_TIMEOUT;
  //   return xhr;
  // };

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = SERVER_TIMEOUT;
    // var xhr = loadHandler(onLoad, onError);
    xhr.open('GET', GET_URL);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = SERVER_TIMEOUT;
    xhr.responseType = 'json';
    // var xhr = loadHandler(onLoad, onError);
    xhr.open('POST', POST_URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save,
  };
})();
