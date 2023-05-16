'use strict';

function log(payload) {
  console.log(payload);
}

function errorHandler(payload) {
  console.error('%s\n%s', payload.message, payload.stack);
}
