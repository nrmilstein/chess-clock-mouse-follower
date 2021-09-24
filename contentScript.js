const platform = /lichess/.test(window.location.hostname)
  ? platforms.lichess
  : platforms.chessCom;

let isExtensionStarted = false;
let mouseFollower = null, topObserver = null, bottomObserver = null, gameOverObserver = null;

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

  if (!(await waitForMount(platform.mountIndicators))) {
    return;
  }

  const timeControl = platform.parseTimeControl();
  if (!["ultrabullet", "bullet", "blitz", "rapid", "classical"].includes(timeControl)) {
    return;
  }

  if (isExtensionStarted) {
    return;
  }
  isExtensionStarted = true;

  mouseFollower = new ClockMouseFollower();

  const observerOptions = {
    attributes: true,
    childList: true,
    subtree: false,
  }

  topObserver = onMutate(platform.topClock, observerOptions, async node => {
    mouseFollower.setTimeTop(platform.parseTime(node));
  });

  bottomObserver = onMutate(platform.bottomClock, observerOptions, async node => {
    const time = platform.parseTime(node);
    mouseFollower.setTimeBottom(time);

    const activationThreshold = (await Options.get('activationThresholds'))[timeControl];
    if (time.toSeconds() <= activationThreshold) {
      mouseFollower.mount();
    } else {
      mouseFollower.unmount();
    }
  });

  gameOverObserver = onMutate(platform.gameOverIndicatorContainer, observerOptions, node => {
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
