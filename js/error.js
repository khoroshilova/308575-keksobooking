'use strict';

(function () {
  var SHOW_ERROR_TIMEOUT = 3500;

  var createErrorMessage = function (onError) {
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

  window.error = {
    createErrorMessage: createErrorMessage
  };
})();
