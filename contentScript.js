const platform = /lichess/.test(window.location.hostname)
  ? platforms.lichess
  : platforms.chessCom;

let isExtensionStarted = false;
let mouseFollower, topObserver, bottomObserver, gameOverObserver = null;

const stopExtension = () => {
  if (mouseFollower) {
    mouseFollower.gameOver();
  }
  if (topObserver) {
    topObserver.disconnect();
  }
  if (bottomObserver) {
    bottomObserver.disconnect();
  }
  if (gameOverObserver) {
    gameOverObserver.disconnect();
  }
  isExtensionStarted = false;
}

const shouldExtensionStart = async () => {
  return !isExtensionStarted
    && (await Options.get('isEnabled'))
    && platform.gameUrlRegex.test(window.location.pathname);

}

const startExtension = async () => {
  if (!(await shouldExtensionStart())) {
    return;
  }

  const didComponentsMount = await waitForMount(platform.mountIndicators);
  if (!didComponentsMount) {
    return;
  }

  const timeControl = platform.getTimeControl();
  if (!["ultrabullet", "bullet", "blitz", "rapid", "classical"].includes(timeControl)) {
    return;
  }

  if (isExtensionStarted) {
    return;
  }
  isExtensionStarted = true;

  mouseFollower = new ClockMouseFollower();

  const clockObserverOptions = {
    attributes: true,
    childList: true,
    subtree: false,
  }

  topObserver = onMutate(platform.topClock, clockObserverOptions, async node => {
    mouseFollower.setTimeTop(platform.extractTime(node));
  });

  bottomObserver = onMutate(platform.bottomClock, clockObserverOptions, async node => {
    const time = platform.extractTime(node);
    mouseFollower.setTimeBottom(time);

    const activationThreshold = (await Options.get('activationThresholds'))[timeControl];
    if (time.toSeconds() <= activationThreshold) {
      mouseFollower.mount();
    } else {
      mouseFollower.unmount();
    }
  });

  gameOverObserver = onMutate(platform.gameOverIndicatorContainer, { attributes: true, childList: true, subtree: false }, node => {
    if (node.querySelector(platform.gameOverIndicator) !== null) {
      stopExtension();
    }
  });
};

browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  switch (request.type) {
    case "isEnabledChange":
      if (await Options.get('isEnabled')) {
        startExtension();
      } else {
        stopExtension();
      }
      break;
    case "historyStateUpdated":
      stopExtension();
      startExtension();
      break;
  }
});

startExtension();
