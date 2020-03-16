/* eslint-disable  @typescript-eslint/ban-ts-ignore */
/* eslint-disable  @typescript-eslint/no-explicit-any */

'use strict';

function log(payload: string) {
  console.log('*** DEBUG_LOG');
  console.log(payload);
}

function errorHandler(payload: string) {
  let err = new Error(JSON.parse(payload));
  console.log(err);
}