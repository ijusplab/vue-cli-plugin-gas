# vue-cli-plugin-gas

Vue CLI plugin to setup Google Apps Script project using Vue and Vuetify as frontend tools, using typescript for server code (in order to have code completion) and Vue/Vuetify for client code.

## Setup:

#### 1. Install Clasp globally

```javascript
npm -g install @google/clasp // or yarn global add @google/clasp
```

#### 2. Create your Vue Project

```javascript
vue create <project_name>
cd <project_name>
```

#### 3. Install and run `@ijusplab/vue-cli-plugin-gas`

```javascript
npm install --save-dev @ijusplab/vue-cli-plugin-gas // or yarn install -D @ijusplab/vue-cli-plugin-gas
vue invoke @ijusplab/vue-cli-plugin-gas
```

#### 4. Deploy files to Google Drive

```javascript
npm run deploy // or yarn deploy
```