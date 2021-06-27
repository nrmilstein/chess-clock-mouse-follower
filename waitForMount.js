const isMounted = selector => {
  return document.querySelector(selector) !== null;
}

const waitForMount = async selectors => {
  let sleepTime = 100;

  for (let i = 0; i < 7; i++) {
    await sleep(sleepTime);
    Math.floor(sleepTime *= 1.5);
    if (selectors.every(selector => isMounted(selector))) {
      return true;
    }
  }

  return false;

  // This method observes mutations on document.body and waits for the clock to mount. It is too
  // CPU intensive.

  //  return new Promise((resolve, reject) => {
  //    const documentObserverOptions = {
  //      attributes: false,
  //      childList: true,
  //      subtree: true,
  //    }
  //
  //    const documentObserverCallback = (mutationList, observer) => {
  //      const isClockAdded = Array.from(mutationList).some(mutation => {
  //        return Array.from(mutation.addedNodes).some(node => {
  //          const hasRoundApp = node.classList && node.classList.length > 0
  //            && Array.from(node.classList).some(className => className === "round__app");
  //          if (!hasRoundApp) {
  //            return false;
  //          }
  //          const hasClock = (node.querySelector(".rclock-top .time") !== null
  //            && node.querySelector(".rclock-bottom .time") !== null);
  //          return hasClock;
  //        });
  //      });
  //
  //      if (isClockAdded) {
  //        observer.disconnect();
  //        resolve();
  //      }
  //    };
  //
  //    const documentObserver = new MutationObserver(documentObserverCallback);
  //    documentObserver.observe(document, documentObserverOptions);
  //  });
}

const sleep = async ms => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}
