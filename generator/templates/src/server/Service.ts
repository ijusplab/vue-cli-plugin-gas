'use strict';

function doGet(e: GoogleAppsScript.Events.DoGet) {
  const html = HtmlService.createTemplateFromFile('index');
  return html.evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle(process.env.VUE_APP_TITLE)
    .setFaviconUrl(process.env.VUE_APP_FAVICON);
}

const callback = (library: string, method: string, ...args: any) => {
  return this[library][method].apply(this, args);
}