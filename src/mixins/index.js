import Vue from 'vue';

export const SharedMethods = {
  methods: {
    openLink: (url) => {
      if (url == null)
        return;
      chrome.tabs.create({
        url: url
      });
    },
    loginStatus: () => {
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
          }
        }
      );
    }
  }
}