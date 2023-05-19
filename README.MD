<p align="center">
  <a href="https://github.com/ijusplab/vue-cli-plugin-gas">
    <img src="https://raw.githubusercontent.com/ijusplab/vue-cli-plugin-gas/master/logo.png" width="300">
  </a>
</p>

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)
[![npm version](https://badge.fury.io/js/@ijusplab%2Fvue-cli-plugin-gas.svg)](https://badge.fury.io/js/@ijusplab%2Fvue-cli-plugin-gas)
![NPM](https://img.shields.io/npm/l/@ijusplab/vue-cli-plugin-gas)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/ijusplab/vue-cli-plugin-gas/master)

# @ijusplab/vue-cli-plugin-gas

This is a Vue CLI plugin that will help you to setup a Google Apps Script project using [Vue](https://vuejs.org/) as the front-end tool. The plugin already integrates [clasp](https://github.com/google/clasp/) commands. For example, it will initialize your project by executing `clasp clone` or `clasp create`. It will also enable you to bundle and deploy your code by automatically syncing the manifest file, building your code for production to the `dist` folder and running `clasp push` or `clasp deploy`.

This plugins expects you to have following version.

|Module|Version|
|---|---|
|Node.js|`v16.x`|
|Clasp|at least version `v2.4.1`|
|Vue CLI|`v4.x`|
|Vue|`v2.x` or `v3.x` (But not support Composition API)|

## Getting Started

### 1. Install Clasp globally

```bash
npm -g install @google/clasp #or yarn global add @google/clasp
```

### 2. Create your Vue Project

```bash
vue --version # confirm Vue CLI is v4.
vue create <project_name>
cd <project_name>
```

### 3. Add the plugin

```bash
vue add @ijusplab/vue-cli-plugin-gas
```
> Important: When running the script, in case you are not already authenticated, the plugin will execute `clasp login` behind the scenes, which may result in clasp asking you for permissions to access your google account.

##  Project\'s structure

All server-side code must be placed inside the `src/server` folder as `js` or `ts` files and will not be bundled by webpack, but `ts` files will be processed by [ts2gas](https://github.com/grant/ts2gas) during compilation.

Any constants you define in your `.env` file starting with `VUE_APP` or `GAS_APP` will be available for you inside server-side code as properties of `process.env`. But remember they are not actually constants, but merely placeholders for preprocessing.

Your Vue app will be the front-end. It will be bundled and inlined in your `index.html` in production. Vue, Vuex, Vue-Router([known issues](https://github.com/ijusplab/vue-cli-plugin-gas/issues/14)), and Vuetify (in case you decide to plug them in) are all consumed as node modules during development, but loaded via CDN in production using the `webpack-cdn-plugin`.

## google.script API mocking

Any global functions you create inside server-side files will be automatically mocked during development, so that your calls to `google.script.run` won\'t break.

All your calls to methods in `google.script.history`, `google.script.host` and `google.script.url` should also work just fine as mocked versions, following the APIs described in Google Apps Script\'s [HTML service documentation](https://developers.google.com/apps-script/reference/html).

The `google` global object will be available in the Vue instance as `$google`. Thus, the right way to invoke `google.script.run` inside your components is by calling `this.$google.script.run`.

In development, you can mock up the response of server-side functions. Seeing file (`./src/mock-data/responseMock.js`), you will find the example. You can specify mock data with JavaScript Object. The property name is server-side function name, and value is object which has two properties, `isSuccess` and `response`. If `isSuccess` is true, then `withSuccessHandler` will be invoked, if that is false, then `withFailureHandler` will be invoked. At that time, `response` will path as the first argument.

## Environment variables

You can change your project\'s name and favicon in the `.env` file by setting the following variables: `VUE_APP_TITLE` and `VUE_APP_FAVICON`. The value of `VUE_APP_FAVICON` should be a url to an external public resource.

## vue-cli-service commands

The plugin introduces five new commands to the vue-cli-service: `deploy`, `login`, `pull`, `push`, `syncmanifest` and `watch`.

| command | description | options |
| ------ | ------------ | ------- |
| `change-timezone` | Syncs manifest file and changes timezone in local manifest. | - |
| `deploy` | Syncs manifest file, builds for production and pushes the output to Google Drive under a new version. Runs part of `syncmanifest`, `vu-cli-service build`, `clasp push` and `clasp deploy` behind the scenes. | <nobr>`--description`</nobr> |
| `login` | Checks if you are already authenticated with Google and authenticates you if you are not. | - |
| `pull` | Pulls all remote files and places them into the local `dist` folder. Runs `clasp pull` behind the scenes. | - |
| `push` | Syncs manifest file, builds for development and pushes the output to Google Drive. Runs part of `syncmanifest`, `vu-cli-service build` and `clasp push` behind the scenes. | - |
| `syncmanifest` | Pulls remote manifest and merges it with your local manifest file, so that in the next `push` or `deploy` you may upload the most recent version of the file. In the case of conflict, local changes will prevail. Runs `clasp pull` and `clasp push` behind the scenes. | - |
| `watch` | Syncs manifest file, builds for development in watch mode and pushes the output to Google Drive each time webpack recompiles. Runs part of `syncmanifest`, `vu-cli-service build --watch`, `clasp pull` and `clasp push` behind the scenes. | - |

> IMPORTANT:
> 1. Be careful while using `deploy`, `push` or `watch` in a cloned project, because it will overwrite all your code in Google Drive.
> 1. The `pull` command **_will not update source code_**.


```bash
# usage:
vue-cli-service change-timezone # or npx vue-cli-service change-timezone
vue-cli-service deploy # or npx vue-cli-service deploy
vue-cli-service deploy --description "This is a new version" # or npx vue-cli-service deploy --description "This is a new version"
vue-cli-service login # or npx vue-cli-service login
vue-cli-service pull # or npx vue-cli-service pull
vue-cli-service push # or npx vue-cli-service push
vue-cli-service syncmanifest # or npx vue-cli-service syncmanifest
```

By tweeking the `scripts` property of your `package.json` file you may combine these new commands among themselves and with Vue CLI natives `serve` and `build`.

## npm scripts

This plugin already adds the following scripts to your project's `package.json`:

| script | commands executed | description |
| ------ | ----------------- | ----------- |
| `change-timezone` | `vue-cli-service change-timezone` | changes timezone in local manifest | - |
| `deploy` | `vue-cli-service deploy` | builds for production and pushes the output to Google Drive under a new version (accepts the `--description` option) |
| `pull` | `vue-cli-service pull` | pulls all remote files and places them into the local `dist` folder (**_it will not update source code_**) |
| `push` | `vue-cli-service push` | builds for development and pushes the output to Google Drive |
| `watch` | `vue-cli-service watch` | builds for development in watch mode and pushes the output to Google Drive each time webpack recompiles |

> IMPORTANT:
> 1. Be careful while using `deploy`, `push` or `watch` in a cloned project, because it will overwrite all your code in Google Drive.
> The plugin intercepts webpack's compilation process in two cases:
> 1. When running Vue CLI native `serve` command, in order to update the mocked `google.script.run` functions list; and
> 1. When running the `watch` command, in order to pull changes to Google Drive each time webpack recompiles.
> 1. In order to push code in production without changing version number, you just need to use `npm run push --mode production`.

```bash
# usage:
npm run change-timezone # or yarn change-timezone
npm run deploy # or yarn deploy
npm run deploy --description "This is a new version" # or yarn deploy --description "This is a new version"
npm run pull # or yarn pull
npm run push # or yarn push
npm run push --mode production # or yarn push --mode production
npm run watch # or yarn watch
```

If you want to use these commands otherwise or wish to know more about Clasp commands' general usage and restrictions, please refer directly to the [Clasp documentation](https://github.com/google/clasp/).
