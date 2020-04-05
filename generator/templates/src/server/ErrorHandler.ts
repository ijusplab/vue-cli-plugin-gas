/* eslint-disable  @typescript-eslint/ban-ts-ignore */
/* eslint-disable  @typescript-eslint/no-explicit-any */

'use strict';

interface IError {
  message: string;
  stack: string;
}

function log(payload: string) {
  console.log(payload);
}

function errorHandler(payload: IError) {
  console.error('%s\n%s', payload.message, payload.stack);
}