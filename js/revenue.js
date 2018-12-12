'use strict';

const revenueInfoCards = elemByID('revenue-info-cards'),
  curBalanceCard = elemByID('card-current-balance'),
  netRevenueCard = elemByID('card-net-revenue'),
  totalPayoutCard = elemByID('card-total-payout'),
  totalCommissionCard = elemByID('card-total-commission'),
  totalMonthsCard = elemByID('card-total-months'),
  averageRevenueCard = elemByID('card-average-revenue');

const ctx = elemByID('revenueChart').getContext('2d');

let data = [],
  labels = [];

function OpenRevenue() {
  if (pubID == null) return RedirectToSettings();

  if (revenueButton.classList.contains('active')) return;

  SetActiveButton(revenueButton);
  SetActiveSection(revenueSection);

  if (revenueData == null) FetchRevenueData();
}

function FetchRevenueData() {
  xhrRequest(Links().revenue, PopulateRevenue, 'Fetching revenue information', true);
}

function PopulateRevenue() {
  revenueData = JSON.parse(xhr.responseText);

  let entryDate,
    curBalance = 0,
    netRevenue = 0,
    averageIncome = 0,
    totalMonths = 0,
    totalCommission = 0,
    totalPayout = 0;

  if (revenueData.aaData.length > 0) {
    revenueData.aaData.forEach(item => {
      let Debit = Number(item[2].replace('$', ''));
      let Credit = Number(item[3].replace('$', ''));

      if (item[1].toLowerCase().includes('revenue for')) {
        netRevenue += Debit;
        netRevenue += Credit;

        if (!item[1].toLowerCase().includes('fixing')) {
          totalMonths++;

          entryDate = new Date(
            '01 ' +
              item[1]
                .toLowerCase()
                .replace('sale', '')
                .replace('revenue', '')
                .replace('for', '')
                .trim()
          );

          data.push(Debit.toFixed(2));
          labels.push(monthsAbbreviations[entryDate.getMonth()] + ' ' + entryDate.getFullYear());

          if (data.length > 6) data.shift();

          if (labels.length > 6) labels.shift();
        }
      }

      if (item[1].toLowerCase().includes('asset store payout')) {
        totalPayout += Credit * -1;
        totalPayout += Debit * -1;
      }
    });

    curBalance = revenueData.aaData[revenueData.aaData.length - 1][4].replace(' ', '');
    totalCommission = (netRevenue * (1 - payoutRate)) / payoutRate;
    averageIncome = netRevenue / totalMonths;

    curBalanceCard.innerText = `${curBalance}`;
    netRevenueCard.innerText = `$${netRevenue.toFixed(2)}`;
    totalPayoutCard.innerText = `$${totalPayout.toFixed(2)}`;
    totalCommissionCard.innerText = `$${totalCommission.toFixed(2)}`;
    averageRevenueCard.innerText = `$${averageIncome.toFixed(2)}`;
    totalMonthsCard.innerText = totalMonths;

    revenueInfoCards.classList.add('active');

    new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            data: data,
            fill: false,
            pointBackgroundColor: '#339AF0',
            borderColor: '#339AF0',
            pointHitRadius: 20,
            pointRadius: 5,
            pointStyle: 'circle',
            cubicInterpolationMode: 'monotone'
          }
        ],
        labels: labels
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          displayColors: false,
          backgroundColor: '#4A4C4F',
          bodyFontSize: 16,
          titleFontSize: 13,
          callbacks: {
            title: ([tooltipItems], data) => {
              return data.labels[tooltipItems.index];
            },
            label: (tooltipItem, data) => {
              return `$${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}`;
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  } else {
    revenueInfoCards.classList.remove('active');
    swal('Error', 'No records found', 'error');
  }
}
