# vue-cli-plugin-gas

Vue CLI plugin to setup Google Apps Script project using Vue and Vuetify as frontend tools, using typescript for server code (in order to have code completion) and Vue/Vuetify for client code.

## Setup:

#### 1. Create Vue Project

```javascript
vue create <project_name>
cd <project_name>
```

#### 2. Install Clasp and create new GAS project

```javascript
npm -g install @google/clasp // or yarn global add @google/clasp

clasp login
clasp create --type webapp --rootDir ./dist
```

#### 3. Run `vue-cli-plugin-gas`

```javascript
npm install --save-dev <full_path_to_plugin> // or yarn install -D <full_path_to_plugin>
vue invoke vue-cli-plugin-gas
```

#### 4. Make first build and push files

```javascript
npm run build // or yarn build

clasp push -f
```