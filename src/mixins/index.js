import Vue from 'vue';

export const SharedMethods = {
  methods: {
    OpenLink: (url) => {
      if (url == null)
        return;
      chrome.tabs.create({
        url: url
      });
    },
    LoginStatus: (store) => {
      chrome.cookies.get({
          url: 'https://publisher.assetstore.unity3d.com',
          name: 'kharma_session'
        },
        cookie => {
          if (cookie == null) {
            Vue.swal({
              title: 'Not Logged In!',
              text: 'Sign in to your publisher dashboard to proceed.',
              type: 'error',
              allowOutsideClick: false,
            }).then(result => {
              if (result.value) {
                window.close();
              }
            });
          } else {
            store.dispatch('loadPubInfo');
          }
        }
      );
    },
    RedirectToSettings: (router, idError = true) => {
      Vue.swal(
        'Error',
        `We couldn\'t find your ${idError ? 'Publisher ID.' : 'reviews link.'} `,
        'error'
      );
      router.push('\settings');
    },
    SendMessage(msg) {
      chrome.runtime.sendMessage(msg);
    },
    InsertCharacter(string, pos, char) {
      return [string.slice(0, pos), char, string.slice(pos)].join('');
    }
  }
}