const parseTimeLichess = clockNode => {
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

const parseTimeChessCom = clockNode => {
  const time = new Time();

  const decimalSplit = clockNode.innerText.split('.');

  const integral = decimalSplit[0];
  const integralSplit = integral.split(':').reverse().map(e => parseInt(e))

  const tenths = decimalSplit.length > 1
    ? parseInt(decimalSplit[1][0])
    : null;

  [time.hours, time.mins, time.secs, time.tenths] = [
    integralSplit[2] ?? null,
    integralSplit[1] ?? null,
    integralSplit[0] ?? null,
    tenths ?? null
  ]

  return time;
}

const parseTimeControlLichess = () => {
  return document.querySelector(".setup > span").innerText.toLowerCase();
}

const parseTimeControlChessCom = () => {
  options = ["ultrabullet", "bullet", "blitz", "rapid", "classical"];
  classes = document.querySelector('a[data-tab="game"] > span').classList;
  timeControl = options.find(option => classes.contains(option));
  if (!timeControl) {
    return null;
  }
  return timeControl;
}

const platforms = {
  lichess: {
    gameUrlRegex: /^\/([a-zA-Z0-9]{8}|[a-zA-Z0-9]{12})$/,
    mountIndicators: [
      ".rclock-bottom .time",
      ".rclock-top .time",
      ".setup > span",
      ".rcontrols"
    ],
    topClock: ".rclock-top .time",
    bottomClock: ".rclock-bottom .time",
    gameOverIndicatorContainer: ".rcontrols",
    gameOverIndicator: ".rematch",
    parseTime: parseTimeLichess,
    parseTimeControl: parseTimeControlLichess,
  },
  chessCom: {
    gameUrlRegex: /^\/game\/live\/\d+$/,
    mountIndicators: [
      ".clock-top",
      ".clock-bottom",
      ".live-game-buttons-component",
      'a[data-tab="game"] > span',
    ],
    topClock: ".clock-top > span",
    bottomClock: ".clock-bottom > span",
    gameOverIndicatorContainer: ".live-game-buttons-component",
    gameOverIndicator: ".live-game-buttons-game-over",
    parseTime: parseTimeChessCom,
    parseTimeControl: parseTimeControlChessCom,
  }
}
