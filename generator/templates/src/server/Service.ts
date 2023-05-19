'use strict';

function doGet(e: GoogleAppsScript.Events.DoGet) {
  const html = HtmlService.createTemplateFromFile('index');
  return html.evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle(process.env.VUE_APP_TITLE)
    .setFaviconUrl(process.env.VUE_APP_FAVICON);
}

function sampleFunction(): any {
  return {
    mode: 'This is production mode'
  };
}
