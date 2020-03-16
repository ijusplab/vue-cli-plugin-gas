# @ijusplab/vue-cli-plugin-gas

Vue CLI plugin to setup Google Apps Script project using Vue as frontend tool. Already integrates [clasp](https://github.com/google/clasp/) commands when initializing project (in order to create new project or clone an existing one) and deploying (by automatically synchronizing the manifest file, building to `dist` folder and executing `clasp push`).

### Setup:

#### 1. Install Clasp globally

```javascript
npm -g install @google/clasp // or yarn global add @google/clasp
```

#### 2. Create your Vue Project

```javascript
vue create <project_name>
cd <project_name>
```

#### 3. Add the plugin

```javascript
vue add @ijusplab/vue-cli-plugin-gas
```

> When running the script, the plugin will run `clasp login`, which
  may ask you to give permissions to access your google account. 



#### 4. Deploy files to Google Drive

```javascript
npm run deploy // or yarn deploy
```
> Important: behind the scenes, the plugin runs `clasp push`, not 
  `clasp deploy`. So, if you want to deploy a new version of your
  script you may want to run the command `clasp deploy` yourself or
  set your new version directly in the Google Apps Script IDE.   
