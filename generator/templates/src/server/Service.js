'use strict';

function doGet(e) {
  var html = HtmlService.createTemplateFromFile('_index');
  return html.evaluate()
  .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  .setTitle(process.env.VUE_APP_TITLE)
  .setFaviconUrl(process.env.VUE_APP_FAVICON);
}

function callback(method) {
  return Cliente[method].apply(this, Array.prototype.slice.call(arguments, 1));
}