'use strict';

const sections = elemByClass('section');

const sidebar = elemByID('sidebar'),
  dashboardSection = elemByID('dashboard-section'),
  salesSection = elemByID('sales-section'),
  downloadsSection = elemByID('downloads-section'),
  revenueSection = elemByID('revenue-section'),
  reviewsSection = elemByID('reviews-section'),
  verificationSection = elemByID('verification-section'),
  settingsSection = elemByID('settings-section');

windowURL = new URL(window.location.href);

if (windowURL.searchParams.has('resize')) {
  window.addEventListener('resize', () => {
    localStorage[popupWindowHeightKey] = window.outerHeight;
    localStorage[popupWindowWidthKey] = window.outerWidth;
    localStorage[popupWindowTopPosKey] = window.screenTop;
    localStorage[popupWindowLeftPosKey] = window.screenLeft;
  });
}

window.onload = () => {
  GetData([pubIDKey, pubNameKey, apiKeyKey, payoutKey, currentMonthsKey, lastRefresh, animateSidebar], Setup, true);
};

function Setup(value) {
  SetSidebarAnimation(value[animateSidebar]);

  if (value[pubIDKey] != null && value[pubNameKey] != null)
    SetupPublisherInfo(value[pubIDKey], value[pubNameKey]);

  if (value[payoutKey] != null)
    payoutRate = value[payoutKey];

  apiKey = value[apiKeyKey] == null ? null : value[apiKeyKey];

  if (value[currentMonthsKey] != null && value[lastRefresh] != null)
    CheckMonthsData({
      [currentMonthsKey]: value[currentMonthsKey],
      [lastRefresh]: value[lastRefresh]
    });

  if (windowURL.searchParams.has('inv'))
    CheckLoginState(OpenVerification());
  else
    CheckLoginState(OpenDashboard());
}