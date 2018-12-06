'use strict';
const monthsNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthsAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const chartColors = ["#F15854", "#5DA5DA", "#FAA43A", "#60BD68", "#F17CB0", "#B2912F", "#B276B2", "#DECF3F", "#4E49D8", "#4D4D4D"];

const doc = document;

let elemByID = (myId) => {
    return doc.getElementById(myId);
}

let elemByClass = (myClass) => {
    return doc.getElementsByClassName(myClass);
}

let elemQuerySelector = (mySelector) => {
    return doc.querySelector(mySelector);
}

let elemQuerySelectorAll = (mySelector) => {
    return doc.querySelectorAll(mySelector);
}

let xhr = new XMLHttpRequest(),
    retryData,
    pubID,
    payoutRate,
    invoiceNumber,
    firstPeriod,
    salesCurrentPeriod,
    downloadsCurrentPeriod,
    salesData,
    downloadsData,
    revenueData,
    trendData,
    salesSortOrder = 0,
    downloadsSortOrder = 1,
    salesReverseOrder = false,
    downloadsReverseOrder = false;

function links() {
    return {
        dashboard: "https://publisher.assetstore.unity3d.com",
        userInfo: "https://publisher.assetstore.unity3d.com/api/publisher/user.json",
        publisherInfo: "https://publisher.assetstore.unity3d.com/api/publisher/overview.json",
        months: `https://publisher.assetstore.unity3d.com/api/publisher-info/months/${pubID}.json`,
        sales: `https://publisher.assetstore.unity3d.com/api/publisher-info/sales/${pubID}/${salesCurrentPeriod}.json`,
        downloads: `https://publisher.assetstore.unity3d.com/api/publisher-info/downloads/${pubID}/${downloadsCurrentPeriod}.json`,
        revenue: `https://publisher.assetstore.unity3d.com/api/publisher-info/revenue/${pubID}.json`,
        verify: `https://publisher.assetstore.unity3d.com/api/publisher-info/verify-invoice/${pubID}/${invoiceNumber}.json`,
        support: "mailto:mintonne@gmail.com",
        donate: "https://paypal.me/mintonne"
    }
}