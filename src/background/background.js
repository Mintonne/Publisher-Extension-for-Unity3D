import {
  reviewCountKey,
  salesInfoKey,
  openAsPopupKey,
  popupWindowHeightKey,
  popupWindowWidthKey,
  popupWindowTopPosKey,
  popupWindowLeftPosKey
} from '@/constants/keys';

const xhttp = new XMLHttpRequest();
const x2js = new X2JS();

const saleIcon = 'images/notifications/icons8-cash-in-hand-96.png',
  refundIcon = 'images/notifications/icons8-refund-96.png',
  chargebackIcon = 'images/notifications/icons8-fraud-96.png',
  reviewIcon = 'images/notifications/icons8-very-popular-topic-96.png';

let intervalID,
  updateInterval = 0,
  pubID,
  reviewsFeed,
  currentPeriod,
  OpenAsPopupState,
  curWindow,
  lastLink;

function Links() {
  return {
    sales: `https://publisher.assetstore.unity3d.com/api/publisher-info/sales/${pubID}/${currentPeriod}.json`
  }
}

/* is-chrome:start */
OpenAsPopupState = localStorage[openAsPopupKey] == null ? true : parseBool(localStorage[openAsPopupKey]);

SetupBrowserAction();

function SetupBrowserAction() {
  if (OpenAsPopupState) {
    chrome.browserAction.setPopup({
      popup: '../index.html'
    });
  } else {
    chrome.browserAction.setPopup({
      popup: ''
    });
  }
}

chrome.browserAction.onClicked.addListener(tab => {
  OpenWindow('../index.html?resize');
});

chrome.contextMenus.create({
  id: 'parentContext',
  title: 'Open extension in',
  contexts: ['browser_action']
});

chrome.contextMenus.create({
  id: 'asPopup',
  title: 'Browser Popup',
  contexts: ['browser_action'],
  type: 'radio',
  parentId: 'parentContext',
  onclick: OpenAs,
  checked: OpenAsPopupState
});

chrome.contextMenus.create({
  id: 'asWindow',
  title: 'New Window',
  contexts: ['browser_action'],
  type: 'radio',
  parentId: 'parentContext',
  onclick: OpenAs,
  checked: !OpenAsPopupState
});

function OpenAs(data) {
  let menuItemId = data.menuItemId;

  OpenAsPopupState = menuItemId == 'asPopup' ? true : false;

  localStorage[openAsPopupKey] = OpenAsPopupState;
  SetupBrowserAction();
}
/* is-chrome:end */

chrome.runtime.onMessage.addListener(message => {
  if (message === 'restart')
    StartChecker();
  else if (request === 'restart-force')
    StartChecker(true);
});

StartChecker(true);

function StartChecker(force = false) {
  if (intervalID != null)
    clearInterval(intervalID);

  if (localStorage.vuex == null)
    return;

  let storageData = JSON.parse(localStorage.vuex);

  pubID = Number(storageData.pubId) || null;
  updateInterval = storageData.interval || null;
  currentPeriod = storageData.currentMonth || null;
  reviewsFeed = storageData.reviewsFeed || null;

  if (pubID == null || currentPeriod == null || updateInterval == null || updateInterval == 0)
    return;

  updateInterval = updateInterval * 60 * 1000;
  currentPeriod = Number(currentPeriod.replace('-', ''));

  intervalID = setInterval(FetchSalesData, updateInterval);

  if (force)
    FetchSalesData();
}

function StopChecker() {
  if (intervalID != null)
    clearInterval(intervalID);
}

function FetchSalesData() {
  if (pubID == null || currentPeriod == null) {
    StartChecker();
    return;
  }

  if (updateInterval === 0) {
    StopChecker();
    return;
  }

  xhttp.onreadystatechange = HandleStateChange;
  xhttp.open('GET', Links().sales, true);
  xhttp.timeout = 15000;
  xhttp.send();
}

function HandleStateChange() {
  if (xhttp.readyState === 4) {
    if (xhttp.status === 200) {
      let data = JSON.parse(xhttp.responseText);

      FetchReviewData();

      if (data.aaData.length == 0) return;

      let qty = 0,
        refunds = 0,
        chargebacks = 0;

      data.aaData.forEach(item => {
        qty += Number(item[2]);
        refunds += Number(item[3]);
        chargebacks += Number(item[4]);
      });

      let newData = {
        Qty: qty,
        Refunds: refunds,
        Chargebacks: chargebacks,
        Refreshed: Date.now()
      };

      let previousData = localStorage[salesInfoKey];

      if (previousData == null) {
        localStorage[salesInfoKey] = JSON.stringify(newData);
      } else {
        localStorage[salesInfoKey] = JSON.stringify(newData);

        previousData = JSON.parse(previousData);

        if (newData.Qty > previousData.Qty) {
          let diff = newData.Qty - previousData.Qty;
          SendNotification(`You have ${diff > 1 ? diff + ' new sales.' : 'a new sale.'}`, saleIcon);
          /* is-firefox:start */
          return;
          /* is-firefox:end */
        }

        if (newData.Refunds > previousData.Refunds) {
          let diff = newData.Refunds - previousData.Refunds;
          SendNotification(`You have ${diff > 1 ? diff + ' new refunds.' : 'a new refund.'}`, refundIcon);
          /* is-firefox:start */
          return;
          /* is-firefox:end */
        }

        if (newData.Chargebacks > previousData.Chargebacks) {
          let diff = newData.Chargebacks - previousData.Chargebacks;
          SendNotification(`You have ${diff > 1 ? diff + ' new chargebacks.' : 'a new chargeback.'}`, chargebackIcon);
        }
      }
    }
  }
}

function FetchReviewData() {
  if (reviewsFeed == null)
    return;

  xhttp.onreadystatechange = HandleReviewStateChange;
  xhttp.open('GET', reviewsFeed, true);
  xhttp.timeout = 15000;
  xhttp.send();
}

function HandleReviewStateChange() {
  if (xhttp.readyState === 4) {
    if (xhttp.status === 200) {
      let reviewsData = x2js.xml2js(xhttp.responseText);

      if (reviewsData.rss.channel.item == null)
        return;

      let totalReviews = reviewsData.rss.channel.item.length;
      let userReviews = 0;

      for (let x = 0; x < totalReviews; x++) {
        let title = reviewsData.rss.channel.item[x].title.replace(/\s+/g, ' ');

        if (title.toLowerCase().includes('reply to review'))
          continue;

        userReviews++;
      }

      let previousCount = localStorage[reviewCountKey];

      if (previousCount == null) {
        localStorage[reviewCountKey] = userReviews;
      } else if (userReviews > Number(previousCount)) {
        localStorage[reviewCountKey] = userReviews;

        let diff = userReviews - Number(previousCount);
        SendNotification(`You have ${diff > 1 ? diff + ' new reviews.' : 'a new review.'}`, reviewIcon);
      }
    }
  }
}

function SendNotification(body, icon) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: icon,
    title: 'Publisher Dashboard',
    message: body
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'verify-invoice',
    title: 'Verify Invoice',
    contexts: ['selection'],
    visible: true,
    onclick: VerifyInvoice
  });
})

function VerifyInvoice(data) {
  let selectedText = data.selectionText.replace(/[^\w\s]/gi, '').replace(/ /g, '');
  /* is-chrome:start */
  OpenWindow(`../index.html?inv=${selectedText}&resize`);
  /* is-chrome:end */

  /* is-firefox:start */
  browser.browserAction.setPopup({
    popup: `../index.html?inv=${selectedText}`
  });

  browser.browserAction.openPopup();

  browser.browserAction.setPopup({
    popup: "../index.html"
  });
  /* is-firefox:end */
}

/* is-chrome:start */
function OpenWindow(link) {
  let width, height, top, left;

  width = localStorage[popupWindowWidthKey] != null ? Number(localStorage[popupWindowWidthKey]) : 820;
  height = localStorage[popupWindowHeightKey] != null ? Number(localStorage[popupWindowHeightKey]) : 620;

  top = localStorage[popupWindowTopPosKey] != null ? Number(localStorage[popupWindowTopPosKey]) : null;
  left = localStorage[popupWindowLeftPosKey] != null ? Number(localStorage[popupWindowLeftPosKey]) : null;

  if (curWindow == null) {
    chrome.windows.create({
        url: link,
        type: 'popup',
        width: width,
        height: height,
        top: top,
        left: left,
        focused: true
      },
      window => {
        lastLink = link;
        curWindow = window;
      }
    );
  } else {
    if (lastLink != link) {
      lastLink = link;

      chrome.tabs.update(curWindow.tabs[0].id, {
        url: link
      });
    }

    chrome.windows.update(curWindow.id, {
      focused: true
    });
  }
}

chrome.windows.onRemoved.addListener(windowId => {
  if (curWindow == null)
    return;

  if (windowId == curWindow.id)
    curWindow = null;
});


function parseBool(b) {
  return !/^(false|0)$/i.test(b) && !!b;
}
/* is-chrome:end */