'use strict';

function doGet(e) {
  var html = HtmlService.createTemplateFromFile('index');
  return html.evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle(process.env.VUE_APP_TITLE)
    .setFaviconUrl(process.env.VUE_APP_FAVICON);
}

function sampleFunction() {
  return 'This is production mode';
}
