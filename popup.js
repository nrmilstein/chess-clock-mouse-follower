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

const syncEnabledButton = async () => {
  const isEnabled = await Options.get('isEnabled');
  const button = document.getElementById("isEnabled");
  button.innerText = isEnabled
    ? "Enabled"
    : "Disabled";
  if (isEnabled) {
    button.classList.remove("buttonDisabled");
    button.classList.add("buttonEnabled");
  } else {
    button.classList.remove("buttonEnabled");
    button.classList.add("buttonDisabled");
  }
}

const syncOptions = async () => {
  syncEnabledButton();

  const activationThresholds = await Options.get('activationThresholds');
  for (const timeControl of timeControls) {
    thresholdInput = document.getElementById(timeControl + 'Threshold');
    thresholdInput.value = activationThresholds[timeControl];
  }

  document.querySelector(`[value=${await Options.get('position')}]`).checked = true;
}

const initEventHandlers = () => {
  document.getElementById('isEnabled').addEventListener('click', async event => {
    const newIsEnabled = !(await Options.get('isEnabled'));
    Options.set({ isEnabled: newIsEnabled });
    syncEnabledButton();

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
    thresholdInput = document.getElementById(timeControl + 'Threshold');
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
