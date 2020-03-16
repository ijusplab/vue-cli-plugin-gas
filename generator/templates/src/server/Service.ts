/* eslint-disable  @typescript-eslint/ban-ts-ignore */
/* eslint-disable  @typescript-eslint/no-explicit-any */

'use strict';

function doGet(e: any) {
  //@ts-ignore
  var html = HtmlService.createTemplateFromFile('_index');
  return html.evaluate()
  .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  //@ts-ignore
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  .setTitle(process.env.VUE_APP_TITLE)
  .setFaviconUrl(process.env.VUE_APP_FAVICON);
}

function callback(method: object) {
  //@ts-ignore
  return Cliente[method].apply(this, Array.prototype.slice.call(arguments, 1));
}