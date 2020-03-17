// adapted from https://github.com/David-Desmaisons/vue-cli-plugin-component, under MIT License, Copyright (c) 2017-2018 David Desmaisons    

const rename = (files, oldName, newName) => {
    files[newName] = files[oldName];
    delete files[oldName];
};

const renameFiles = (files, regex, replace, filter = ((file) => false)) => {
    for (const file in files) {
        if (!regex.test(file) || filter(file)) {
            continue;
        }
        const migratedFile = file.replace(regex, replace);
        rename(files, file, migratedFile)
    }
};

const updateFile = (files, name, updater) => {
    let fileContent = files[name];
    if (!fileContent) {
        fileContent = '\n ';
        console.warn(`File not found ${name}. Had to create it.`)
    }
    files[name] = updater(fileContent);
};

module.exports = {
    rename,
    renameFiles,
    updateFile
}