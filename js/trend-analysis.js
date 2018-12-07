'use strict';

const saveChartBtn = elemByID("save-chart-button"),
    ctx = elemByID("trendChart");

let myChart,
    yearsData = [],
    data = [],
    labels = [];

saveChartBtn.addEventListener("click", () => {
    if (myChart == null)
        return;

    swal({
        icon: "info",
        title: "Save Chart",
        text: "Do you want to hide the Revenue axis?",
        buttons: {
            btn1: {
                text: "Yes",
                value: "btn1",
            },
            btn2: {
                text: "No",
                value: "btn2",
            },
            btn3: {
                text: "Cancel",
                value: "btn3",
            }
        }
    }).then((value) => {
        switch (value) {
            case "btn1":
                SaveChart(true);
                break;

            case "btn2":
                SaveChart();
                break;

            case "btn3":
                swal.close()
                break;
        }
    });
});

Init();

function Init() {
    GetData([pubIDKey, payoutKey], Setup, true);
}

function Setup(value) {
    if (value == null)
        return;

    if (value[pubIDKey] != null)
        pubID = value[pubIDKey];
    else
        return swal("Error", "Publisher ID not found.", "error");

    if (value[payoutKey] != null)
        payoutRate = value[payoutKey];

    FetchTrendData();
}

function FetchTrendData() {
    if (trendData == null)
        xhrRequest(links().revenue, PopulateTrend, "Fetching revenue information", true);
}

function PopulateTrend() {
    trendData = JSON.parse(xhr.responseText);

    Chart.plugins.register({
        beforeDraw: function (c) {
            let ctx = c.chart.ctx;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, c.chart.width, c.chart.height);
        }
    });

    let Debit,
        Description,
        entryDate,
        curYear,
        curMonth;

    if (trendData.aaData.length > 0) {
        trendData.aaData.forEach((item) => {
            Debit = Number(item[2].replace("$", ""));

            Description = item[1].toLowerCase();

            if (Description.includes("revenue for") && !Description.includes("fixing")) {
                entryDate = new Date("01 " + Description.replace(/sale|revenue|for/g, "").trim());

                curYear = entryDate.getFullYear();
                curMonth = entryDate.getMonth();

                if (curYear != null && !yearsData.includes(curYear, 0))
                    yearsData.push(curYear);

                if (data[yearsData.indexOf(curYear)] == null)
                    data[yearsData.indexOf(curYear)] = [];

                data[yearsData.indexOf(curYear)][curMonth] = Debit.toFixed(2);
            }
        });
    }

    data.forEach((item) => {
        for (let x = 0; x < 12; x++)
            if (item[x] == null)
                item[x] = "0";
    });

    myChart = new Chart(ctx, {
        plugins: [showZeroPlugin],
        type: "bar",
        data: {
            datasets: [],
            labels: monthsNames
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: `Revenue Trend Analysis ${yearsData.length > 1 ? `(${yearsData[0]} - ${yearsData[yearsData.length-1]})` : `(${yearsData[0]})`}`,
                fontSize: 20,
                padding: 20
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    boxWidth: 50,
                    fontSize: 16
                }
            },
            tooltips: {
                displayColors: false,
                backgroundColor: "#4A4C4F",
                bodyFontSize: 16,
                titleFontSize: 13,
                callbacks: {
                    title: ([tooltipItems], data) => {
                        return `${data.labels[tooltipItems.index]} ${yearsData[tooltipItems.datasetIndex]}`;
                    },
                    label: (tooltipItem, data) => {
                        return `$${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}`;
                    }
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 15,
                        fontStyle: "bold"
                    }
                }],
                yAxes: [{
                    offset: true,
                    ticks: {
                        display: true,
                        beginAtZero: true,
                        fontSize: 15,
                        fontStyle: "bold",
                        callback: (value) => {
                            return value;
                        }
                    }
                }],
            }
        }
    });

    data.forEach((item, index) => {
        myChart.data.datasets.push({
            label: yearsData[index],
            backgroundColor: chartColors[index],
            data: item
        });
    });

    myChart.update();
}

const showZeroPlugin = {
    beforeRender: function (chartInstance) {
        let datasets = chartInstance.config.data.datasets;

        for (let i = 0; i < datasets.length; i++) {
            let meta = datasets[i]._meta;
            // It counts up every time you change something on the chart so
            // this is a way to get the info on whichever index it's at
            let metaData = meta[Object.keys(meta)[0]];
            let bars = metaData.data;

            for (let j = 0; j < bars.length; j++) {
                let model = bars[j]._model;

                if (metaData.type === "horizontalBar" && model.base === model.x) {
                    model.x = model.base + 3;
                } else if (model.base === model.y) {
                    model.y = model.base - 3;
                }
            }
        }

    }
};

function SaveChart(hideAxis = false) {
    if (hideAxis) {
        myChart.config.options.scales.yAxes[0].ticks.callback = () => {
            return "";
        }

        myChart.update({
            duration: 0,
        });
    }

    ctx.toBlob((blob) => {
        saveAs(blob, `chart-${Date.now()}.png`);
    });

    myChart.config.options.scales.yAxes[0].ticks.callback = (value) => {
        return value;
    }

    myChart.update({
        duration: 0,
    });
}