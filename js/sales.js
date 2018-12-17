'use strict';

const salesTitle = elemQuerySelector('#sales-section .nav-link'),
  packageSearch = elemByID('package-search-input'),
  monthPicker = elemByID('month-picker'),
  sortToggle = elemByID('sort-toggle'),
  sortOptions = elemQuerySelectorAll('#sales-section .dropdown-item');

const salesInfoCards = elemByID('sales-info-cards'),
  revenueCard = elemByID('card-revenue'),
  salesCard = elemByID('card-sales'),
  refundsCard = elemByID('card-refunds'),
  commissionCard = elemByID('card-commission'),
  vouchersCard = elemByID('card-vouchers'),
  chargebacksCard = elemByID('card-chargebacks');

const salesDivider = elemQuerySelector('#sales-section .divider'),
  packageCards = elemByID('package-cards');

let searchNodes, qtyBubbles;

packageSearch.addEventListener('input', () => {
  SearchSalesPackages();
});

sortOptions.forEach(item =>
  item.addEventListener('click', e => {
    SortSalesPackages(Number(e.srcElement.getAttribute('value')));
    salesDivider.firstElementChild.innerHTML = `(<b>${e.srcElement.textContent}</b>)`;
  })
);

sortToggle.addEventListener('click', () => {
  salesReverseOrder = !sortToggle.firstChild.classList.toggle('icon-sort-amount-down');
  SortSalesPackages(salesSortOrder);
});

let salesScroll = new PerfectScrollbar('#package-cards', {
  wheelSpeed: 0.2
});

$('#month-picker')
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

    selectedPeriod < firstPeriod ? (salesCurrentPeriod = firstPeriod) : (salesCurrentPeriod = selectedPeriod);

    $('#month-picker').datepicker('update', '');
    xhrRequest(Links().sales, PopulateSales, 'Fetching sales information', true);
  });

function OpenSales() {
  if (pubID == null)
    return RedirectToSettings();

  if (salesButton.classList.contains('active'))
    return;

  SetActiveButton(salesButton);
  SetActiveSection(salesSection);

  if (salesData == null)
    GetData([firstMonthsKey, currentMonthsKey, salesSortOrderKey], FetchSales, true);
}

function FetchSales(data) {
  salesCurrentPeriod = Number(data[currentMonthsKey].replace('-', ''));
  firstPeriod = Number(data[firstMonthsKey].replace('-', ''));

  data[salesSortOrderKey] == null ? (salesSortOrder = 0) : (salesSortOrder = Number(data[salesSortOrderKey]));

  xhrRequest(Links().sales, PopulateSales, 'Fetching sales information', true);
}

function PopulateSales() {
  let formattedDate = InsertCharacter(salesCurrentPeriod.toString(), 4, '-');
  $('#month-picker').datepicker('update', formattedDate);
  salesTitle.innerText = new Date(formattedDate).toLocaleString(navigator.language, {
    month: 'long',
    year: 'numeric'
  });

  packageSearch.value = '';

  salesData = JSON.parse(xhr.responseText);

  let grossRevenue = 0,
    netRevenue = 0,
    commission = 0,
    vouchers = 0,
    totalSales = 0,
    totalRefunds = 0,
    totalChargebacks = 0;

  if (salesData.aaData.length > 0) {
    salesData.aaData.forEach(item => {
      let gross = Number(item[5].replace('$', ''));
      let qty = Number(item[2]);
      if (gross === 0)
        vouchers += qty;

      grossRevenue += gross;
      totalSales += qty;
      totalRefunds += Number(item[3]);
      totalChargebacks += Number(item[4]);
    });

    netRevenue = grossRevenue * payoutRate;
    commission = grossRevenue * (1 - payoutRate);

    SortSalesPackages(salesSortOrder);
  } else {
    salesDivider.classList.remove('active');
    packageCards.classList.remove('active');
  }

  revenueCard.innerText = `$${netRevenue.toFixed(2)}`;
  salesCard.innerText = totalSales;
  refundsCard.innerText = totalRefunds;
  commissionCard.innerText = `$${commission.toFixed(2)}`;
  vouchersCard.innerText = vouchers;
  chargebacksCard.innerText = totalChargebacks;

  salesInfoCards.classList.add('active');
}

function SortSalesPackages(order = 5) {
  SaveData(salesSortOrderKey, order);
  salesSortOrder = order;

  if (salesData.aaData.length === 0)
    return;

  salesData.aaData.sort((a, b) => {
    if (salesSortOrder > 0 && salesSortOrder <= 5)
      return Number(a[salesSortOrder].replace('$', '')) < Number(b[salesSortOrder].replace('$', '')) ? 1 : -1;
    else
      return a[salesSortOrder] < b[salesSortOrder] ? 1 : -1;
  });

  if (salesReverseOrder)
    salesData.aaData.reverse();

  SetupSalesPackages(salesSortOrder);
}

function SetupSalesPackages(pos) {
  while (packageCards.firstChild) {
    packageCards.removeChild(packageCards.firstChild);
  }

  if (pos === 0)
    pos = 1;

  salesData.aaData.forEach(item => {
    let PackageName = item[0];
    let Qty = item[2];
    let Value;

    if (pos === 5)
      Value = `$${(Number(item[pos].replace('$', '')) * payoutRate).toFixed(2)}`;
    else
      Value = item[pos];

    packageCards.insertAdjacentHTML('beforeend', `<div class="package col-sm-4"><div class="card"><div class="card-body p-2"><p class="card-title text-dark">${PackageName}</p><h4 class="card-text text-primary">${Value.replace(' ','')}</h4></div><span class="bubble" title="${Qty} sale(s)">${Qty > 999 ? '999+' : Qty}</span></div></div>`);
  });

  qtyBubbles = packageCards.querySelectorAll('.package .bubble');

  qtyBubbles.forEach(item => {
    if (salesSortOrder === 0 || salesSortOrder === 1 || salesSortOrder >= 5)
      item.classList.add('active');
    else
      item.classList.remove('active');
  });

  searchNodes = packageCards.querySelectorAll('#package-cards .package');
  SearchSalesPackages();

  salesDivider.classList.add('active');
  packageCards.classList.add('active');
}

function SearchSalesPackages() {
  if (searchNodes == null || searchNodes.length <= 0)
    return;

  let term = packageSearch.value.toLowerCase();

  if (term === '') {
    searchNodes.forEach(elem => {
      elem.style.display = 'block';
    });
  } else {
    searchNodes.forEach(elem => {
      if (elem.textContent.toLowerCase().includes(term))
        elem.style.display = 'block';
      else
        elem.style.display = 'none';
    });
  }

  salesScroll.update();
}