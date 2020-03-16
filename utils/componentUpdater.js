const snippet = `
<style>
    .dummy { margin: 0; }
</style>`;

module.exports = (content, {}) => {
    return /<style.*?>[^]*?<\/style>/.test(content) ? content : content + snippet;
}