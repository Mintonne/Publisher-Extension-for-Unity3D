'use strict';

const sections = elemByClass("section");

const sidebar = elemByID("sidebar"),
    dashboardSection = elemByID("dashboard-section"),
    salesSection = elemByID("sales-section"),
    downloadsSection = elemByID("downloads-section"),
    revenueSection = elemByID("revenue-section"),
    verificationSection = elemByID("verification-section"),
    settingsSection = elemByID("settings-section");

window.onload = () => {
    Init();
}

function Init() {
    CheckLoginState();
    GetData([pubIDKey, payoutKey, currentMonthsKey, lastRefresh, animateSidebar], Setup, true);
}

function Setup(value) {
    SetSidebarAnimation(value[animateSidebar]);

    if (value[pubIDKey] != null)
        SetupPublisherInfo(value[pubIDKey]);

    if (value[payoutKey] != null)
        payoutRate = value[payoutKey];

    if (value[currentMonthsKey] != null && value[lastRefresh] != null)
        CheckMonthsData({
            [currentMonthsKey]: value[currentMonthsKey],
            [lastRefresh]: value[lastRefresh]
        });
}

function CheckLoginState() {
    chrome.cookies.get({
        "url": links().dashboard,
        "name": "kharma_session"
    }, (cookie) => {
        if (cookie === null) {
            swal({
                icon: "error",
                title: "Not Logged In!",
                text: "Sign in to your publisher dashboard to proceed.",
                buttons: {
                    Login: {
                        text: "Login",
                        value: "btn1",
                    },
                    Close: {
                        text: "Close",
                        value: "btn2",
                    }
                },
                closeOnClickOutside: false,
            }).then((value) => {
                switch (value) {

                    case "btn1":
                        OpenLink(links().dashboard);
                        break;

                    case "btn2":
                        CloseWindow();
                        break;
                }
            });
        } else {
            OpenDashboard();
        }
    });
}

function CheckNetworkState() {
    return navigator.onLine;
}

function SetActiveSection(element) {
    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove("active");
    }

    element.classList.add("active");
}

function CloseWindow() {
    window.close();
}

function InsertCharacter(string, pos, char) {
    return [string.slice(0, pos), char, string.slice(pos)].join("");
}

function xhrRequest(link, callback, loadingText = "Loading...", retry = false, type = "text") {
    if (!CheckNetworkState()) {
        swal("Error", "You seem to be offline!", "error");
    } else {
        retry ? retryData = {
            link: link,
            callback: callback,
            loadingText: loadingText,
            retry: retry,
            type: type
        } : retryData = null;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200)
                    callback();
                else
                if (retry) {
                    swal({
                        icon: "error",
                        title: "Error",
                        text: "Request Failed",
                        buttons: {
                            btn1: {
                                text: "Retry",
                                value: "btn1",
                            },
                            btn2: {
                                text: "Close",
                                value: "btn2",
                            }
                        },
                        closeOnClickOutside: false,
                    }).then((value) => {
                        switch (value) {
                            case "btn1":
                                xhrRequest(retryData.link, retryData.callback, retryData.loadingText, retryData.retry, retryData.type);
                                break;

                            case "btn2":
                                swal.close()
                                break;
                        }
                    });
                } else
                    swal("Error", "Request Failed", "error");

                Anim.CloseAnimation();
            }
        };

        xhr.open("GET", link, true);
        xhr.responseType = type;
        xhr.timeout = 15000;
        xhr.send();

        Anim.ShowAnimation(loadingText);
    }
}

function SaveImage() {
    let reader = new FileReader()
    reader.readAsDataURL(xhr.response);

    reader.onloadend = () => {
        // console.log(reader.result);
    }
}

function SendMessage(value) {
    chrome.runtime.sendMessage(value);
}

function SaveData(saveKey, saveValue, showDialog = false) {
    chrome.storage.local.set({
        [saveKey]: saveValue
    }, () => {
        if (showDialog)
            swal("Success", "Saved", "success");
    });
}

function GetData(key, callback, full = false) {
    chrome.storage.local.get(key, (result) => {
        if (full)
            callback(result)
        else
            callback(result[key]);
    });
}

function RedirectToSettings() {
    swal("Error", "We couldn't find your Publisher ID.", "error");
    OpenSettings();
}

function OpenLink(link) {
    chrome.tabs.create({
        url: link
    });
}