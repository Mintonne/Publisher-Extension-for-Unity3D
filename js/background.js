'use strict';

let xhr = new XMLHttpRequest(),
    intervalID,
    interval = 0,
    pubID,
    currentPeriod;

let saleIcon = "../img/notification/icons8-cash-in-hand-96.png",
    refundIcon = "../img/notification/icons8-refund-96.png",
    chargebackIcon = "../img/notification/icons8-fraud-96.png";


let frequency = {
    0: 0,
    1: 5,
    2: 10,
    3: 15,
    4: 30,
    5: 60
}

function salesLink() {
    return `https://publisher.assetstore.unity3d.com/api/publisher-info/sales/${pubID}/${currentPeriod}.json`;
}

StartChecker();

chrome.runtime.onMessage.addListener((request) => {
    if (request.command === "restart")
        RestartChecker();
    if (request[updateFrequencyKey] != null)
        UpdateInterval(request[updateFrequencyKey]);
});

function StartChecker() {
    chrome.storage.local.get([pubIDKey, currentMonthsKey, updateFrequencyKey], (results) => {
        if (results == null || results[pubIDKey] == null || results[currentMonthsKey] == null)
            return;

        pubID = results[pubIDKey];
        currentPeriod = Number(results[currentMonthsKey].replace("-", ""));
        UpdateInterval(results[updateFrequencyKey], true);
    });
}

function RestartChecker() {
    if (intervalID != null)
        clearInterval(intervalID);

    StartChecker();
}

function StopChecker() {
    if (intervalID != null)
        clearInterval(intervalID);
}

function UpdateInterval(value, force = false) {
    if (intervalID != null)
        clearInterval(intervalID);

    if (value == null)
        return;

    interval = frequency[Number(value)] * 60 * 1000;
    intervalID = setInterval(DataRequest, interval);

    if (force)
        DataRequest();
}

function DataRequest() {
    if (pubID == null || currentPeriod == null) {
        RestartChecker();
        return;
    }

    if (interval === 0) {
        StopChecker();
        return;
    }

    xhr.onreadystatechange = HandleStateChange;
    xhr.open("GET", salesLink(), true);
    xhr.timeout = 15000;
    xhr.send();
}

function HandleStateChange() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);

            let qty = 0,
                refunds = 0,
                chargebacks = 0;

            data.aaData.forEach((item) => {
                qty += Number(item[2]);
                refunds += Number(item[3]);
                chargebacks += Number(item[4]);
            });

            let newData = {
                Qty: qty,
                Refunds: refunds,
                Chargebacks: chargebacks,
                Refreshed: Date.now()
            }

            let previousData = localStorage.getItem(salesInfo);

            if (previousData == null) {
                localStorage.setItem(salesInfo, JSON.stringify(newData));
            } else {
                previousData = JSON.parse(previousData);

                if (newData.Qty > previousData.Qty) {
                    let diff = newData.Qty - previousData.Qty;
                    SendNotification(`You have ${diff > 1 ? diff + " new sales." : "a new sale."}`, saleIcon)
                }

                if (newData.Refunds > previousData.Refunds) {
                    let diff = newData.Refunds - previousData.Refunds;
                    SendNotification(`You have ${diff > 1 ? diff + " new refunds." : "a new refund."}`, refundIcon);
                }

                if (newData.Chargebacks > previousData.Chargebacks) {
                    let diff = newData.Chargebacks - previousData.Chargebacks;
                    SendNotification(`You have ${diff > 1 ? diff + " new chargebacks." : "a new chargeback."}`, chargebackIcon);
                }

                localStorage.setItem(salesInfo, JSON.stringify(newData));
            }
        } else {
            console.log("Error");
        }
    }
}

function SendNotification(body, icon) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: icon,
        title: "Publisher Dashboard",
        message: body
    });
}