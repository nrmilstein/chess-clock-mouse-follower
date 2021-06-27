const onMutate = (selector, options, callback) => {
  const observerCallback = (mutationList, observer) => {
    const node = mutationList[0].target;
    callback(node);
  }

  const node = document.querySelector(selector);
  callback(node);

  const observer = new MutationObserver(observerCallback);
  observer.observe(node, options);

  return observer;
};
