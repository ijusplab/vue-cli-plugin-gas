'use strict';

function log(payload) {
  console.log('*** DEBUG_LOG');
  console.log(payload);
}

function errorHandler(payload) {
  let err = new Error(JSON.parse(payload));
  console.log(err);
}