class Options {
  static defaultOptions = {
    activationThresholds: {
      ultrabullet: 5,
      bullet: 10,
      blitz: 20,
      rapid: 30,
      classical: 40,
    },
    location: 'centerRight',
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
