// from https://github.com/David-Desmaisons/vue-cli-plugin-component, under MIT License, Copyright (c) 2017-2018 David Desmaisons

module.exports = {
    rename(files, oldName, newName) {
        files[newName] = files[oldName];
        delete files[oldName];
    },
    renameFiles(files, regex, replace, filter = ((file) => false)) {
        for (const file in files) {
            if (!regex.test(file) || filter(file)) {
                continue;
            }
            const migratedFile = file.replace(regex, replace);
            rename(files, file, migratedFile)
        }
    },
    updateFile(files, name, updater) {
        const fileContent = files[name]
        if (!fileContent) {
            console.warn(`File not found ${name}`)
            return;
        }
        files[name] = updater(fileContent)
    }
}