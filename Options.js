class Options {
  static defaultOptions = {
    isEnabled: true,
    activationThresholds: {
      ultrabullet: 3,
      bullet: 5,
      blitz: 8,
      rapid: 15,
      classical: 20,
    },
    position: 'centerRight',
  };

  static async get(key) {
    if (typeof key === 'string') {
      const option = await browser.storage.sync.get({ [key]: this.defaultOptions[key] });
      return option[key];
    }
    return await browser.storage.sync.get(this.defaultOptions);
  }

  static set(...args) {
    browser.storage.sync.set(...args);
  }
}
