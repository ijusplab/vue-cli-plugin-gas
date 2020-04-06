## {{ appName }}

Change your project\'s name and favicon in the `.env` file by setting the following variables: `VUE_APP_TITLE` and `VUE_APP_FAVICON`. The value of `VUE_APP_FAVICON` should be a url to an external public resource.

The following properties and methods are avaliable in your Vue instance:

| property/method | description | parameters | type/return type |
| --------------- | ----------- | ---------- | ------ |
| `$google` | `google` global object | - | `object` |
| `$devMode` | `true` when `process.env.NODE_ENV !== 'production'` | - | `boolean` |
| `$callLibraryMethod` | calls the server-side `callback` function, which allows you to call methods of libraries you use as dependencies in your server-side code or of any other global namespace | <br>`library:string`<br>`method:string`<br>`...args:any` | `Promise` |
| `$log` | calls the server-side `log` function, which sends debug info to the Stackdriver Logging console | `string` | `void` |
| `$errorHandler` | calls the server-side `errorHandler` function, which sends error info to the Stackdriver Logging console | `{`<br> `message:string`<br>`stack:string`<br>`}` | `void` |

> IMPORTANT: The `$log` method does not work in production.

You have the following npm scripts available:

| script | commands executed | description |
| ------ | ----------------- | ----------- |
| `change-timezone` | `vue-cli-service change-timezone` | changes timezone in local manifest | - | 
| `deploy` | `vue-cli-service deploy` | builds for production and pushes the output to Google Drive under a new version (accepts the `--description` option) | 
| `inspect` | `vue-cli-service inspect --mode development > wp.dev.output.js && vue-cli-service inspect --mode production > wp.prod.output.js` | pipes development and production webpack configurations into the files `wp.dev.output.js` and `wp.prod.output.js` |
| `pull` | `vue-cli-service pull` | pulls all remote files and places them into the local `dist` folder (**_it will not update source code_**) |
| `push` | `vue-cli-service push` | builds for development and pushes the output to Google Drive |  
| `watch` | `vue-cli-service watch` | builds for development in watch mode and pushes the output to Google Drive each time webpack recompiles |

> IMPORTANT:
> 1. Be careful while using `deploy`, `push` or `watch` in a cloned project, because it will overwrite all your code in Google Drive.  
> 1. In order to push code in production without changing version number, you just need to use `npm run push --mode production`. 

```javascript
/* 
  usage:
*/
npm run change-timezone // or yarn change-timezone
npm run deploy // or yarn deploy
npm run deploy --description "This is a new version" // or yarn deploy --description "This is a new version" 
npm run inspect // or yarn inspect
npm run pull // or yarn pull
npm run push // or yarn push
npm run push --mode production // or yarn push --mode production
npm run watch // or yarn watch
```
