'use strict';

const invoiceInput = elemByID('invoice-number-input'),
  verifyBtn = elemByID('verify-invoice'),
  resultsSection = elemByID('invoice-results');

const packageName = elemByID('package-name'),
  purchaseDate = elemByID('purchase-date'),
  purchasePrice = elemByID('purchase-price'),
  purchaseLicenses = elemByID('purchase-licenses'),
  purchaseStatus = elemByID('purchase-status');

verifyBtn.addEventListener('click', () => {
  let inputValue = invoiceInput.value.trim();

  if (inputValue == null || inputValue.length < 5) {
    invoiceInput.focus();
    return;
  }

  invoiceNumber = inputValue;

  xhrRequest(links().verify, InvoiceResult, 'Fetching invoice data');
});

function OpenVerification() {
  if (pubID == null) return RedirectToSettings();

  windowURL = new URL(window.location.href);

  if (windowURL.searchParams.has('inv')) {
    let paramValue = windowURL.searchParams.get('inv');
    invoiceInput.value = paramValue;
    verifyBtn.click();
  }

  if (verifyButton.classList.contains('active')) return;

  SetActiveButton(verifyButton);
  SetActiveSection(verificationSection);
}

function InvoiceResult() {
  let data = JSON.parse(xhr.responseText);

  let dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  if (data.aaData.length > 0) {
    resultsSection.classList.add('active');
    packageName.innerText = data.aaData[0][1];
    purchaseDate.innerText = new Date(data.aaData[0][4]).toLocaleDateString(navigator.language, dateOptions);
    purchasePrice.innerText = data.aaData[0][3];
    purchaseLicenses.innerText = FormatLicenseValue(data.aaData[0][2]);
    purchaseStatus.innerText = FormatStatusValue(data.aaData[0][5]);
  } else {
    resultsSection.classList.remove('active');
    swal('Error', 'No record found', 'error');
  }
}

function FormatLicenseValue(value) {
  value = Number(value);

  if (value > 1) return value + ' Licenses';
  else return '1 License';
}

function FormatStatusValue(value) {
  if (value.toLowerCase() == 'downloaded') {
    purchaseStatus.classList.add('text-dark');
    purchaseStatus.classList.remove('text-danger', 'font-weight-bold');
  } else {
    purchaseStatus.classList.remove('text-dark');
    purchaseStatus.classList.add('text-danger', 'font-weight-bold');
  }

  return value;
}
