'use strict';

const pubIdInput = elemByID('pubId-input'),
  fetchIdBtn = elemByID('fetch-pubId'),
  frequencySettings = elemQuerySelectorAll('#settings-section #frequency-setting .btn'),
  sidebarAnimationSettings = elemQuerySelectorAll('#settings-section #sidebar-setting .btn');

fetchIdBtn.addEventListener('click', () => {
  if (pubID != null) {
    CacheMonthsData();
    return;
  }
  xhrRequest(Links().publisherInfo, SavePublisherInfo, 'Fetching your publisher information');
});

frequencySettings.forEach(item => {
  item.addEventListener('click', () => {
    let frequencyValue = item.getAttribute('value');
    SaveData(updateFrequencyKey, frequencyValue);
    SetUpdateFrequency(frequencyValue);
    SendMessage({
      [updateFrequencyKey]: frequencyValue
    });
  });
});

sidebarAnimationSettings.forEach(item => {
  item.addEventListener('click', () => {
    let animValue = item.getAttribute('value');
    SaveData(animateSidebar, animValue);
    SetSidebarAnimation(animValue);
  });
});

function OpenSettings() {
  if (settingsButton.classList.contains('active'))
    return;

  SetActiveButton(settingsButton);
  SetActiveSection(settingsSection);

  GetData(updateFrequencyKey, SetUpdateFrequency);
}

function SetUpdateFrequency(value) {
  value == null ? (value = 0) : (value = Number(value));

  frequencySettings.forEach(item => {
    if (Number(item.getAttribute('value')) === value)
      item.classList.add('active');
    else
      item.classList.remove('active');
  });
}

function SetSidebarAnimation(value) {
  value == null ? (value = 1) : (value = Number(value));

  sidebarAnimationSettings.forEach(item => {
    if (Number(item.getAttribute('value')) === value)
      item.classList.add('active');
    else
      item.classList.remove('active');
  });

  value === 0 ? sidebar.classList.add('static') : sidebar.classList.remove('static');
}

function SetupPublisherInfo(id) {
  pubIdInput.value = id;
  pubID = id;
}

function SavePublisherInfo() {
  let data = JSON.parse(xhr.responseText);

  let id = Number(data.overview.id);
  let name = data.overview.name;
  let cut = Number(data.overview.payout_cut);

  SetupPublisherInfo(id);

  pubID = id;
  payoutRate = cut;

  SaveData(pubIDKey, id);
  SaveData(pubNameKey, name);
  SaveData(payoutKey, cut);

  CacheMonthsData();
}

function CacheMonthsData() {
  xhrRequest(Links().months, SaveMonthsData, 'Caching months data');
}

function SaveMonthsData() {
  let data = JSON.parse(xhr.responseText);

  SaveData(firstMonthsKey, InsertCharacter(data.periods[data.periods.length - 1].value, 4, '-'));
  SaveData(currentMonthsKey, InsertCharacter(data.periods[0].value, 4, '-'));
  SaveData(lastRefresh, Date.now());

  GetReviewsFeed();
}

function GetReviewsFeed() {
  swal({
    icon: 'info',
    title: "Get Reviews Link?",
    text: 'Do you want the extension to retrieve and save your reviews link?',
    buttons: {
      btn1: {
        text: 'Get Reviews Link',
        value: 'btn1'
      },
      btn2: {
        text: 'Skip',
        value: 'btn2'
      }
    }
  }).then(value => {
    switch (value) {
      case 'btn1':
        xhrRequest(Links().reviewsLink, SaveReviewsLink, "Fetching Reviews Link", true);
        break;

      case 'btn2':
        swal.close();
        break;
    }
  });
}

function SaveReviewsLink() {
  let data = JSON.parse(xhr.responseText);
  let link = ConvertToSecure(data.result.publisher.activity_url);

  reviewsFeed = link;

  SaveData(reviewsFeedKey, link);
}

function ConvertToSecure(link) {
  return link.replace(/http/g, 'https');
}