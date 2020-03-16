# @ijusplab/vue-cli-plugin-gas

Vue CLI plugin to setup a Google Apps Script project using [Vue](https://vuejs.org/) as the front end tool. Already integrates [clasp](https://github.com/google/clasp/) commands when initializing your project (in order to create new project or clone an existing one) or bundling and deploying your code (by automatically synchronizing the manifest file, building your code for production to the `dist` folder and running `clasp push`).

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
> When running the script, the plugin will execute `clasp login` behind the
  scenes, which may result in clasp asking you for permissions to access 
  your google account. 

#### 4. Deploy files to Google Drive

```javascript
npm run deploy // or yarn deploy
```
> Important: behind the scenes, the plugin executes `clasp push`, not 
  `clasp deploy`. So, if you want to deploy a new version of your
  script you may want to run the command `clasp deploy` yourself or
  set your new version directly in the Google Apps Script IDE.   
