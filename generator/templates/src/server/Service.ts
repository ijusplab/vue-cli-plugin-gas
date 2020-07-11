/* eslint-disable  @typescript-eslint/ban-ts-ignore */
/* eslint-disable  @typescript-eslint/no-explicit-any */

'use strict';

interface IPostData {
  length: number;
  type: string;
  contents: string;
  name: string;
}

interface IGetEvent {
  queryString: string;
  parameter: object;
  parameters: object;
  contextPath: string;
  contentLength: number;
  postData: IPostData;
}

function doGet(e: IGetEvent) {
  //@ts-ignore
  var html = HtmlService.createTemplateFromFile('index');
  return html.evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    //@ts-ignore
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle(process.env.VUE_APP_TITLE)
    .setFaviconUrl(process.env.VUE_APP_FAVICON);
}

const callback = (library: string, method: string, ...args: any) => {
  return this[library][method].apply(this, args);
}