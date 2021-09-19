class Time {
  constructor() {
    this.hours = null;
    this.mins = null;
    this.secs = null;
    this.tenths = null;
  }

  getDigits() {
    return [this.hours, this.mins, this.secs, this.tenths];
  }

  getIntegralDigits() {
    return [this.hours, this.mins, this.secs];
  }

  format(withTenths = false) {
    const integralDigits = this.removePrefixZeroes(this.getIntegralDigits().filter(i => i !== null));
    const integralTimeStr = integralDigits.map((digit, i) => i > 0 ? this.formatDigit(digit) : String(digit)).join(":");
    const fractionalTimeStr = withTenths ? `.${this.tenths ?? "0"}` : "";
    return integralTimeStr + fractionalTimeStr;
  }

  toSeconds() {
    return this.hours * 60 * 60 + this.mins * 60 + this.secs + this.tenths * 0.1;
  }

  removePrefixZeroes(digits) {
    const firstNonZeroIndex = digits.findIndex(e => e > 0);
    return firstNonZeroIndex === -1 ? [0] : digits.slice(firstNonZeroIndex);
  }

  formatDigit(num) {
    return num < 10 ? "0" + num : String(num);
  }

  compare(otherTime) {
    const digits = this.getDigits();
    const otherDigits = otherTime.getDigits();

    for (let i = 0; i < digits.length; i++) {
      const difference = digits[i] - otherDigits[i];
      if (difference !== 0) {
        return difference;
      }
    }
    return 0;
  }
}
