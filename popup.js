const debounce = (func, timeout) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  const handleThresholdChange = async event => {
    const activationThresholds = await Options.get('activationThresholds');
    Options.set({
      activationThresholds: {
        ...activationThresholds,
        [event.target.name]: event.target.value,
      }
    });
  };

  const activationThresholds = await Options.get('activationThresholds');
  const timeControls = ['ultrabullet', 'bullet', 'blitz', 'rapid', 'classical'];
  for (const timeControl of timeControls) {
    thresholdInput = document.getElementById(timeControl + 'Threshold');
    thresholdInput.value = activationThresholds[timeControl];
    thresholdInput.addEventListener('input', debounce(handleThresholdChange, 300));
  }
});
