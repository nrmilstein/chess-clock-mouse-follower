const waitForMount = async selectors => {
  let sleepTime = 100;

  for (let i = 0; i < 10; i++) {
    await sleep(sleepTime);
    sleepTime = Math.floor(sleepTime * 1.5);
    if (selectors.every(selector => document.querySelector(selector) !== null)) {
      return true;
    }
  }

  return false;
}

const sleep = async ms => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}
