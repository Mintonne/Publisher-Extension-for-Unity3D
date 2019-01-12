export const openLink = {
  methods: {
    open: function (url) {
      if (url == null)
        return;
      chrome.tabs.create({
        url: url
      });
    }
  }
}