const debounce = (func, timeout) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const timeControls = ['ultrabullet', 'bullet', 'blitz', 'rapid', 'classical'];

const syncOptions = async () => {
  document.getElementById('isEnabled').checked = (await Options.get('isEnabled'));

  const activationThresholds = await Options.get('activationThresholds');
  for (const timeControl of timeControls) {
    const thresholdInput = document.getElementById(timeControl + 'Threshold');
    thresholdInput.value = activationThresholds[timeControl];
  }

  document.querySelector(`[value=${await Options.get('position')}]`).checked = true;
}

const initEventHandlers = () => {
  document.getElementById('isEnabled').addEventListener('change', async event => {
    const newIsEnabled = event.target.checked;
    Options.set({ isEnabled: newIsEnabled });

    const tabs = await browser.tabs.query({ url: ["https://lichess.org/*", "https://www.chess.com/*"] });
    for (const tab of tabs) {
      browser.tabs.sendMessage(tab.id, {
        type: "isEnabledChange",
        isEnabled: newIsEnabled
      });
    }
  });

  const handleThresholdChange = async event => {
    const activationThresholds = await Options.get('activationThresholds');
    Options.set({
      activationThresholds: {
        ...activationThresholds,
        [event.target.name]: event.target.value,
      }
    });
  };

  for (const timeControl of timeControls) {
    const thresholdInput = document.getElementById(timeControl + 'Threshold');
    thresholdInput.addEventListener('input', debounce(handleThresholdChange, 300));
  }

  const positionRadioInputs = document.querySelectorAll('[name=position]');
  for (const positionRadioInput of positionRadioInputs) {
    positionRadioInput.addEventListener("change", async event => {
      Options.set({ position: event.target.value, });
    });
  }

  document.getElementById("resetOptions").addEventListener("click", event => {
    Options.set(Options.defaultOptions);
    syncOptions();
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  initEventHandlers();
  syncOptions();
});
