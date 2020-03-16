module.exports = (content, { locale }) => {
    content = content.replace(/lang="en"/, `lang="${locale}"`);
    content = content.replace(/<link rel="icon".+>/, `<link rel="icon" href="<%= process.env.VUE_APP_FAVICON %>">`);
    content = content.replace(/<%= htmlWebpackPlugin.options.title %>/g, '<%= process.env.VUE_APP_TITLE %>');
    return content;
}