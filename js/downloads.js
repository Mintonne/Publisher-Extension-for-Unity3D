'use strict';

const downloadsTitle = elemQuerySelector('#downloads-section .nav-link'),
  downloadsPackageSearch = elemByID('downloads-package-search-input'),
  downloadsMonthPicker = elemByID('downloads-month-picker'),
  downloadsSortToggle = elemByID('downloads-sort-toggle'),
  downloadsSortOptions = elemQuerySelectorAll('#downloads-section .dropdown-item');

const downloadsInfoCards = elemByID('downloads-info-cards'),
  totalDownloadsCard = elemByID('card-total-downloads');

const downloadsDivider = elemQuerySelector('#downloads-section .divider'),
  downloadsPackageCards = elemByID('downloads-package-cards');

let downloadsSearchNodes;

downloadsPackageSearch.addEventListener('input', () => {
  SearchDownloadsPackages();
});

downloadsSortOptions.forEach(item =>
  item.addEventListener('click', e => {
    SortDownloadsPackages(Number(e.srcElement.getAttribute('value')));
    downloadsDivider.firstElementChild.innerHTML = `(<b>${e.srcElement.textContent}</b>)`;
  })
);

downloadsSortToggle.addEventListener('click', () => {
  downloadsReverseOrder = !downloadsSortToggle.firstChild.classList.toggle('icon-sort-amount-down');
  SortDownloadsPackages(downloadsSortOrder);
});

let downloadScroll = new PerfectScrollbar('#downloads-package-cards', {
  wheelSpeed: 0.2
});

$('#downloads-month-picker')
  .datepicker({
    startView: 1,
    minViewMode: 1,
    maxViewMode: 2,
    format: 'yyyymm',
    todayBtn: true,
    multidate: false,
    autoclose: true
  })
  .on('changeDate', e => {
    let selectedPeriod = Number(String(e.date.getFullYear()) + String(e.date.getMonth() + 1).padStart(2, '0'));

    selectedPeriod < firstPeriod ? (downloadsCurrentPeriod = firstPeriod) : (downloadsCurrentPeriod = selectedPeriod);

    $('#downloads-month-picker').datepicker('update', '');
    xhrRequest(Links().downloads, PopulateDownloads, 'Fetching downloads information', true);
  });

function OpenDownloads() {
  if (pubID == null)
    return RedirectToSettings();

  if (downloadsButton.classList.contains('active'))
    return;

  SetActiveButton(downloadsButton);
  SetActiveSection(downloadsSection);

  if (downloadsData == null)
    GetData([firstMonthsKey, currentMonthsKey], FetchDownloads, true);
}

function FetchDownloads(data) {
  downloadsCurrentPeriod = Number(data[currentMonthsKey].replace('-', ''));

  if (firstPeriod == null)
    firstPeriod = Number(data[firstMonthsKey].replace('-', ''));

  xhrRequest(Links().downloads, PopulateDownloads, 'Fetching downloads information', true);
}

function PopulateDownloads() {
  let formattedDate = InsertCharacter(downloadsCurrentPeriod.toString(), 4, '-');
  $('#downloads-month-picker').datepicker('update', formattedDate);
  downloadsTitle.innerText = new Date(formattedDate).toLocaleString(navigator.language, {
    month: 'long',
    year: 'numeric'
  });

  downloadsPackageSearch.value = '';

  downloadsData = JSON.parse(xhr.responseText);

  let totalDownloads = 0;

  if (downloadsData.aaData.length > 0) {
    downloadsData.aaData.forEach(item => {
      let downloads = Number(item[1]);
      totalDownloads += downloads;
    });

    SortDownloadsPackages(downloadsSortOrder);
  } else {
    downloadsDivider.classList.remove('active');
    downloadsPackageCards.classList.remove('active');
  }

  totalDownloadsCard.innerText = totalDownloads;
  downloadsInfoCards.classList.add('active');
}

function SortDownloadsPackages(order) {
  downloadsSortOrder = order;

  if (downloadsData.aaData.length === 0)
    return;

  downloadsData.aaData.sort((a, b) => {
    if (downloadsSortOrder == 1)
      return Number(a[downloadsSortOrder]) < Number(b[downloadsSortOrder]) ? 1 : -1;
    else
      return a[downloadsSortOrder] < b[downloadsSortOrder] ? 1 : -1;
  });

  if (downloadsReverseOrder)
    downloadsData.aaData.reverse();

  SetupDownloadsPackages(downloadsSortOrder);
}

function SetupDownloadsPackages(pos) {
  while (downloadsPackageCards.firstChild) {
    downloadsPackageCards.removeChild(downloadsPackageCards.firstChild);
  }

  if (pos === 0)
    pos = 1;

  downloadsData.aaData.forEach(item => {
    let PackageName = item[0];
    let Value = item[pos];

    downloadsPackageCards.insertAdjacentHTML(
      'beforeend',
      `<div class="download-package col-sm-4"><div class="card"><div class="card-body p-2"><p class="card-title text-dark">${PackageName}</p><h4 class="card-text text-primary">${Value}</h4></div></div></div>`
    );
  });

  downloadsSearchNodes = downloadsPackageCards.querySelectorAll('#downloads-package-cards .download-package');
  SearchDownloadsPackages();

  downloadsDivider.classList.add('active');
  downloadsPackageCards.classList.add('active');
}

function SearchDownloadsPackages() {
  if (downloadsSearchNodes == null || downloadsSearchNodes.length <= 0)
    return;

  let term = downloadsPackageSearch.value.toLowerCase();

  if (term === '') {
    downloadsSearchNodes.forEach(elem => {
      elem.style.display = 'block';
    });
  } else {
    downloadsSearchNodes.forEach(elem => {
      if (elem.textContent.toLowerCase().includes(term))
        elem.style.display = 'block';
      else
        elem.style.display = 'none';
    });
  }

  downloadScroll.update();
}