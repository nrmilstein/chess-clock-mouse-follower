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
  document.getElementById("isEnabled").innerText = (await Options.get('isEnabled'))
    ? "Disable"
    : "Enable";
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

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('isEnabled').addEventListener('click', async event => {
    const newIsEnabled = !(await Options.get('isEnabled'));
    Options.set({ isEnabled: newIsEnabled });
    syncEnabledButton();

    const tabs = await browser.tabs.query({ url: "https://lichess.org/*" });
    for (const tab of tabs) {
      browser.tabs.sendMessage(tab.id, { isEnabled: newIsEnabled });
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

  syncOptions();
});
