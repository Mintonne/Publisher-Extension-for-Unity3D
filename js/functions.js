function CheckLoginState(callback) {
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
            callback;
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
                        title: `Error ${xhr.status == 0 ? "" : xhr.status}`.trim(),
                        text: "Request Failed.",
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

function OpenLink(link, requireID = false) {
    if (requireID && pubID == null)
        return RedirectToSettings();

    chrome.tabs.create({
        url: link
    });
}