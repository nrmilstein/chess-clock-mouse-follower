const extractTime = clockNode => {
  const time = new Time();

  if (clockNode.classList.contains("hour")) {
    time.hours = parseInt(clockNode.childNodes[0].wholeText);
    time.mins = parseInt(clockNode.childNodes[2].wholeText);
    time.secs = parseInt(clockNode.childNodes[4].wholeText);
  } else {
    time.mins = parseInt(clockNode.childNodes[0].wholeText);
    time.secs = parseInt(clockNode.childNodes[2].wholeText);
  }

  const tenthsNode = clockNode.querySelector("tenths");
  if (tenthsNode !== null) {
    time.tenths = parseInt(tenthsNode.childNodes[1].wholeText);
  }
  return time;
}

(async () => {
  const isGameUrl = /^\/([a-zA-Z0-9]{8}|[a-zA-Z0-9]{12})$/.test(window.location.pathname);
  if (!isGameUrl) {
    return;
  }

  const didComponentsMount = await waitForMount([".rclock-bottom .time", ".rclock-top .time", ".setup > span", ".rcontrols"]);
  if (!didComponentsMount) {
    return;
  }

  const gameType = document.querySelector(".setup > span").innerText.toLowerCase();
  if (gameType === "correspondence") {
    return;
  }

  const isGameOver = false;
  const mouseFollower = new ClockMouseFollower();

  const clockObserverOptions = {
    attributes: true,
    childList: true,
    subtree: false,
  }

  const topObserver = onMutate(".rclock-top .time", clockObserverOptions, node => mouseFollower.setTimeTop(extractTime(node)));
  const bottomObserver = onMutate(".rclock-bottom .time", clockObserverOptions, node => {
    const time = extractTime(node);
    mouseFollower.setTimeBottom(time);
    if (time.toSeconds() < 500) {
      mouseFollower.mount();
    }
  });

  onMutate(".rcontrols", { attributes: true, childList: true, subtree: false }, node => {
    if (node.querySelector(".rematch") !== null) {
      topObserver.disconnect();
      bottomObserver.disconnect();
      mouseFollower.unmount();
    }
  });
})();
