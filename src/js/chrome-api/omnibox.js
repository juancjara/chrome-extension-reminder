let Omnibox = {
  onChange(fn) {
    chrome.omnibox.onInputChanged.addListener(fn);
  },

  onSubmit(fn) {
    chrome.omnibox.onInputEntered.addListener(fn);
  }
};

export default Omnibox;
