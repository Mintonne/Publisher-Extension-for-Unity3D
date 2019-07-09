import Vue from 'vue'

export const SharedMethods = {
  methods: {
    OpenLink: (url) => {
      if (url == null) {
        return
      }
      chrome.tabs.create({
        url: url
      })
    },
    LoginStatus: () => {
      chrome.cookies.get({
        url: 'https://publisher.assetstore.unity3d.com',
        name: 'kharma_session'
      },
      cookie => {
        if (cookie == null) {
          Vue.prototype.$swal.fire({
            title: 'Not Logged In!',
            text: 'Sign in to your publisher dashboard to proceed.',
            type: 'error',
            footer: '<a href="https://publisher.assetstore.unity3d.com" target="_blank">Go to Dashboard</a>',
            allowOutsideClick: false
          }).then(result => {
            if (result.value) {
              window.close()
            }
          })
        }
      }
      )
    },
    RedirectToSettings: (router, idError = true) => {
      Vue.prototype.$swal.fire(
        'Error',
        `We couldn't find your ${idError ? 'Publisher ID.' : 'reviews link.'} `,
        'error'
      )
      router.push('/settings')
    },
    SendMessage (msg) {
      chrome.runtime.sendMessage(msg)
    },
    InsertCharacter (string, pos, char) {
      return [string.slice(0, pos), char, string.slice(pos)].join('')
    },
    ellipsis (str, maxLength, ellipsis = '...') {
      if (str.length > maxLength) {
        return str.slice(0, maxLength - ellipsis.length) + ellipsis
      } else {
        return str
      }
    },
    FormatDate (dateString) {
      return new Date(dateString).toLocaleDateString(navigator.language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    RequestError () {
      Vue.prototype.$swal.fire('Request Failed', 'Sorry, we could not complete your request. Please try again.', 'error')
    },
    ConvertToSecure (link) {
      return link.replace(/http/g, 'https')
    }
  }
}
