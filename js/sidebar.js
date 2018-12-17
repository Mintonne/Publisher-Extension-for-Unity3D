'use strict';

const sidebarButtons = elemQuerySelectorAll('.sidebarBtn'),
  dashboardButton = elemByID('dashboard-button'),
  salesButton = elemByID('sales-button'),
  downloadsButton = elemByID('downloads-button'),
  revenueButton = elemByID('revenue-button'),
  verifyButton = elemByID('verify-button'),
  settingsButton = elemByID('settings-button'),
  supportButton = elemByID('support-button'),
  donateButton = elemByID('donate-button');

dashboardButton.addEventListener('click', () => {
  OpenDashboard();
});

salesButton.addEventListener('click', () => {
  OpenSales();
});

downloadsButton.addEventListener('click', () => {
  OpenDownloads();
});

revenueButton.addEventListener('click', () => {
  OpenRevenue();
});

verifyButton.addEventListener('click', () => {
  OpenVerification();
});

settingsButton.addEventListener('click', () => {
  OpenSettings();
});

supportButton.addEventListener('click', () => {
  OpenLink(Links().support);
});

donateButton.addEventListener('click', () => {
  OpenLink(Links().donate);
});

function SetActiveButton(element) {
  sidebarButtons.forEach((item, index) => {
    item.classList.remove('active');
  });

  if (element != null)
    element.classList.add('active');
}
