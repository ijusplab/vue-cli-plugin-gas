class CustomWebpackPlugin {
  constructor({ hook, callback }) {
    this.hook = hook;
    this.callback = callback;
  }

  apply(compiler) {
    compiler.hooks[this.hook].tap('CustomPlugin', () => {
      this.callback();
    });
  }
}

module.exports = CustomWebpackPlugin;
